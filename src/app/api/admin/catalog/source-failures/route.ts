import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { getSourceFailureSummary } from '@/lib/catalog/source-failure-queue'

type ResolutionDecision = 'accepted_as_supporting' | 'rejected' | 'needs_new_capture' | 'primary_retry_required'
type ManualCapture = {
  snapshotId: string
  sourceUrl: string
  contentHash: string
  captureMethod: string
  status: string
  createdAt: string
}

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function requireReviewer() {
  const context = await getCatalogReviewer()
  if (!context.user) return { response: errorResponse('Sign in is required.', 401) }
  if (context.error) return { response: errorResponse('Catalog operations are not provisioned yet.', 503) }
  if (!context.reviewer) return { response: errorResponse('Catalog reviewer access is required.', 403) }
  return context
}

export async function GET() {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const queue = getSourceFailureSummary()
  const slugs = queue.failures.map(failure => failure.slug)
  const { data: opportunities, error: opportunitiesError } = slugs.length
    ? await context.supabase.from('opportunities').select('id, slug').in('slug', slugs)
    : { data: [], error: null }
  if (opportunitiesError) return errorResponse('Unable to load failed-source opportunities.', 500)
  const opportunityIds = (opportunities ?? []).map(opportunity => opportunity.id)
  const { data: resolutions, error: resolutionsError } = opportunityIds.length
    ? await context.supabase
      .from('source_resolution_reviews')
      .select('id, opportunity_id, primary_source_url, alternate_source_url, alternate_snapshot_hash, decision, evidence_anchor, reviewer_note, reviewed_by, reviewed_at, updated_at')
      .in('opportunity_id', opportunityIds)
      .order('reviewed_at', { ascending: false })
    : { data: [], error: null }
  if (resolutionsError) return errorResponse('Unable to load source-resolution reviews. Apply the source-resolution migration first.', 500)

  const sourceUrls = [...new Set(queue.failures.flatMap(failure => [failure.sourceUrl, ...failure.alternateOfficialSources.map(source => source.url)]))]
  const { data: registeredSources, error: registeredSourcesError } = sourceUrls.length
    ? await context.supabase.from('source_registry').select('id, url').in('url', sourceUrls)
    : { data: [], error: null }
  if (registeredSourcesError) return errorResponse('Unable to load registered evidence sources.', 500)
  const sourceIds = (registeredSources ?? []).map(source => source.id)
  const { data: manualSnapshots, error: manualSnapshotsError } = sourceIds.length
    ? await context.supabase
      .from('source_snapshots')
      .select('id, source_registry_id, content_hash, capture_method, status, created_at')
      .in('source_registry_id', sourceIds)
      .in('capture_method', ['manual_official_text', 'manual_official_pdf_text'])
      .order('created_at', { ascending: false })
    : { data: [], error: null }
  if (manualSnapshotsError) return errorResponse('Unable to load manual evidence snapshots. Apply the manual-evidence migration first.', 500)
  const urlBySourceId = new Map((registeredSources ?? []).map(source => [source.id, source.url]))
  const manualCapturesByUrl = new Map<string, ManualCapture[]>()
  for (const snapshot of manualSnapshots ?? []) {
    const sourceUrl = urlBySourceId.get(snapshot.source_registry_id)
    if (!sourceUrl) continue
    const captures = manualCapturesByUrl.get(sourceUrl) ?? []
    captures.push({
      snapshotId: snapshot.id,
      sourceUrl,
      contentHash: snapshot.content_hash,
      captureMethod: snapshot.capture_method,
      status: snapshot.status,
      createdAt: snapshot.created_at,
    })
    manualCapturesByUrl.set(sourceUrl, captures)
  }

  const idBySlug = new Map((opportunities ?? []).map(opportunity => [opportunity.slug, opportunity.id]))
  return NextResponse.json({
    summary: queue.summary,
    failures: queue.failures.map(failure => ({
      ...failure,
      opportunityId: idBySlug.get(failure.slug) ?? null,
      resolutions: (resolutions ?? []).filter(resolution => resolution.opportunity_id === idBySlug.get(failure.slug)),
      manualCaptures: [failure.sourceUrl, ...failure.alternateOfficialSources.map(source => source.url)]
        .flatMap(sourceUrl => manualCapturesByUrl.get(sourceUrl) ?? []),
    })),
  }, { headers: { 'cache-control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: {
    slug?: string
    primarySourceUrl?: string
    alternateSourceUrl?: string
    alternateSnapshotHash?: string
    decision?: ResolutionDecision
    evidenceAnchor?: string
    reviewerNote?: string
  }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }

  const decisions: ResolutionDecision[] = ['accepted_as_supporting', 'rejected', 'needs_new_capture', 'primary_retry_required']
  if (!body.slug || !body.primarySourceUrl || !body.alternateSourceUrl || !body.decision || !decisions.includes(body.decision)) {
    return errorResponse('slug, primarySourceUrl, alternateSourceUrl, and a valid decision are required.', 400)
  }
  if (!/^https:\/\//i.test(body.primarySourceUrl) || !/^https:\/\//i.test(body.alternateSourceUrl)) {
    return errorResponse('Primary and alternate source URLs must use HTTPS.', 422)
  }
  if (!body.reviewerNote?.trim()) return errorResponse('A reviewer note is required for every source-resolution decision.', 422)
  if (body.decision === 'accepted_as_supporting' && (!body.evidenceAnchor?.trim() || !body.alternateSnapshotHash?.trim())) {
    return errorResponse('Accepting alternate evidence requires a precise anchor and captured snapshot hash.', 422)
  }

  const queueFailure = getSourceFailureSummary().failures.find(failure => failure.slug === body.slug && failure.sourceUrl === body.primarySourceUrl)
  if (!queueFailure) return errorResponse('The failed primary source is not present in the current review queue.', 404)
  if (!queueFailure.alternateOfficialSources.some(source => source.url === body.alternateSourceUrl)) {
    return errorResponse('The alternate URL must be one of the exact official alternates registered for this failed source.', 422)
  }
  if (body.decision === 'accepted_as_supporting') {
    const captured = queueFailure.alternateCaptures.find(capture => capture.sourceUrl === body.alternateSourceUrl && capture.contentHash === body.alternateSnapshotHash)
    if (!captured) return errorResponse('The accepted alternate must match an exact captured snapshot hash in the review queue.', 422)
  }

  const { data: opportunity, error: opportunityError } = await context.supabase
    .from('opportunities')
    .select('id')
    .eq('slug', body.slug)
    .maybeSingle()
  if (opportunityError) return errorResponse('Unable to load the opportunity record.', 500)
  if (!opportunity) return errorResponse('Opportunity record not found. Apply the catalog seeds first.', 404)

  const { data: alternateSource, error: alternateSourceError } = await context.supabase
    .from('source_registry')
    .select('id')
    .eq('url', body.alternateSourceUrl)
    .maybeSingle()
  if (alternateSourceError) return errorResponse('Unable to verify the alternate source registry entry.', 500)
  if (!alternateSource) return errorResponse('The alternate URL must already exist in the registered official source registry.', 422)

  const { data: resolution, error: resolutionError } = await context.supabase
    .from('source_resolution_reviews')
    .upsert({
      opportunity_id: opportunity.id,
      primary_source_url: body.primarySourceUrl,
      alternate_source_registry_id: alternateSource.id,
      alternate_source_url: body.alternateSourceUrl,
      alternate_snapshot_hash: body.alternateSnapshotHash?.trim() || null,
      decision: body.decision,
      evidence_anchor: body.evidenceAnchor?.trim() || null,
      reviewer_note: body.reviewerNote.trim(),
      reviewed_by: context.user.id,
      reviewed_at: new Date().toISOString(),
    }, { onConflict: 'opportunity_id,primary_source_url,alternate_source_url' })
    .select('id, decision, reviewed_at')
    .single()
  if (resolutionError || !resolution) return errorResponse('Unable to save the source-resolution decision. Apply the source-resolution migration first.', 500)

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'source_resolution_review',
    entity_id: resolution.id,
    action: 'catalog_source_resolution_recorded',
    metadata: {
      slug: body.slug,
      primary_source_url: body.primarySourceUrl,
      alternate_source_url: body.alternateSourceUrl,
      alternate_snapshot_hash: body.alternateSnapshotHash?.trim() || null,
      decision: body.decision,
      evidence_anchor: body.evidenceAnchor?.trim() || null,
    },
  })

  return NextResponse.json({ ok: true, resolution }, { status: 201 })
}
