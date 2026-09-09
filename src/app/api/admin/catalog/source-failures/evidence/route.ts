import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { getSourceFailureSummary } from '@/lib/catalog/source-failure-queue'

const MAX_EVIDENCE_CHARACTERS = 2_000_000

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

function usableEvidence(content: string) {
  const normalized = content.trim().toLowerCase()
  if (normalized.length < 80) return false
  const rejectedMarkers = [
    'the requested url was not found',
    'requested page could not be found',
    'potentially suspicious content entered by you',
    'review all errors and resolve them one by one',
    'access denied',
    'request blocked',
    'error code "err_',
  ]
  return !rejectedMarkers.some(marker => normalized.includes(marker))
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: {
    slug?: string
    primarySourceUrl?: string
    sourceUrl?: string
    content?: string
    evidenceAnchor?: string
  }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }

  const slug = body.slug?.trim()
  const primarySourceUrl = body.primarySourceUrl?.trim()
  const sourceUrl = body.sourceUrl?.trim()
  const content = body.content?.trim()
  const evidenceAnchor = body.evidenceAnchor?.trim()
  if (!slug || !primarySourceUrl || !sourceUrl || !content || !evidenceAnchor) {
    return errorResponse('slug, primarySourceUrl, sourceUrl, content, and evidenceAnchor are required.', 400)
  }
  if (!/^https:\/\//i.test(primarySourceUrl) || !/^https:\/\//i.test(sourceUrl)) {
    return errorResponse('Primary and evidence source URLs must use HTTPS.', 422)
  }
  if (content.length > MAX_EVIDENCE_CHARACTERS) {
    return errorResponse(`Evidence is limited to ${MAX_EVIDENCE_CHARACTERS.toLocaleString()} characters.`, 413)
  }
  if (evidenceAnchor.length < 8) return errorResponse('Provide a precise page, section, paragraph, or document anchor.', 422)
  if (!usableEvidence(content)) return errorResponse('The submitted text is empty, too short, or matches a known error/security-interstitial response.', 422)

  const failure = getSourceFailureSummary().failures.find(item => item.slug === slug && item.sourceUrl === primarySourceUrl)
  if (!failure) return errorResponse('The failed primary source is not present in the current review queue.', 404)
  const alternate = failure.alternateOfficialSources.find(item => item.url === sourceUrl)
  if (sourceUrl !== primarySourceUrl && !alternate) {
    return errorResponse('The evidence URL must be the current primary URL or an exact registered official alternate.', 422)
  }

  const { data: source, error: sourceError } = await context.supabase
    .from('source_registry')
    .select('id, url')
    .eq('url', sourceUrl)
    .maybeSingle()
  if (sourceError) return errorResponse('Unable to verify the evidence source registry entry.', 500)
  if (!source) return errorResponse('The evidence URL must already exist in the registered official source registry.', 422)

  const contentHash = createHash('sha256').update(content, 'utf8').digest('hex')
  const snapshotPayload = {
    source_registry_id: source.id,
    content_hash: contentHash,
    content_type: 'text/markdown',
    body_markdown: content,
    status: 'needs_review',
    capture_method: 'manual_official_text',
    final_url: sourceUrl,
    response_status: null,
    response_content_type: 'text/markdown',
  }

  const inserted = await context.supabase
    .from('source_snapshots')
    .insert(snapshotPayload)
    .select('id, content_hash, capture_method, status, created_at')
    .maybeSingle()
  let snapshot = inserted.data
  if (inserted.error && (inserted.error as { code?: string }).code === '23505') {
    const existing = await context.supabase
      .from('source_snapshots')
      .select('id, content_hash, capture_method, status, created_at')
      .eq('source_registry_id', source.id)
      .eq('content_hash', contentHash)
      .maybeSingle()
    if (existing.error) return errorResponse('The existing evidence snapshot could not be read.', 500)
    snapshot = existing.data
  } else if (inserted.error) {
    return errorResponse('Unable to persist the manual evidence snapshot.', 500)
  }
  if (!snapshot) return errorResponse('The manual evidence snapshot was not persisted.', 500)

  const { error: auditError } = await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'source_snapshot',
    entity_id: snapshot.id,
    action: 'catalog_manual_evidence_submitted',
    metadata: {
      slug,
      primary_source_url: primarySourceUrl,
      source_url: sourceUrl,
      capture_role: sourceUrl === primarySourceUrl ? 'primary' : 'alternate',
      content_hash: contentHash,
      evidence_anchor: evidenceAnchor,
      publication_status: 'blocked',
    },
  })
  if (auditError) return errorResponse('Evidence was stored but its audit record failed; do not treat it as reviewed.', 500)

  return NextResponse.json({
    ok: true,
    snapshot,
    sourceUrl,
    contentHash,
    reviewStatus: 'needs_review',
    publicationStatus: 'blocked',
  }, { status: inserted.error ? 200 : 201 })
}
