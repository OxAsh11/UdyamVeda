import fs from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'

type CrosswalkArtifact = {
  summary?: Record<string, unknown>
  interpretation?: string
  authorities?: unknown[]
  opportunityRecords?: Array<{ slug: string; [key: string]: unknown }>
}

export async function GET() {
  const context = await getCatalogReviewer()
  if (!context.user) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 })
  if (context.error) return NextResponse.json({ error: 'Catalog operations are not provisioned yet.' }, { status: 503 })
  if (!context.reviewer) return NextResponse.json({ error: 'Catalog reviewer access is required.' }, { status: 403 })

  try {
    const file = path.join(process.cwd(), 'docs', 'catalog-authority-opportunity-crosswalk.json')
    const artifact = JSON.parse(await fs.readFile(file, 'utf8')) as CrosswalkArtifact
    const slugs = (artifact.opportunityRecords ?? []).map(record => record.slug).filter(Boolean)
    const { data: opportunities, error: opportunitiesError } = slugs.length
      ? await context.supabase.from('opportunities').select('id, slug').in('slug', slugs)
      : { data: [], error: null }
    if (opportunitiesError) return NextResponse.json({ error: 'Unable to load crosswalk review decisions.' }, { status: 500 })
    const opportunityIds = (opportunities ?? []).map(opportunity => opportunity.id)
    const { data: decisions, error: decisionsError } = opportunityIds.length
      ? await context.supabase.from('opportunity_authority_reviews').select('opportunity_id, decision, mapping_kind, evidence_url, evidence_anchor, reviewer_note, reviewed_at').in('opportunity_id', opportunityIds)
      : { data: [], error: null }
    if (decisionsError) return NextResponse.json({ error: 'Unable to load crosswalk review decisions. Apply the crosswalk review migration first.' }, { status: 500 })
    const idBySlug = new Map((opportunities ?? []).map(opportunity => [opportunity.slug, opportunity.id]))
    const decisionsByOpportunityId = new Map((decisions ?? []).map(decision => [decision.opportunity_id, decision]))
    const opportunityRecords = (artifact.opportunityRecords ?? []).map(record => ({
      ...record,
      reviewDecision: idBySlug.has(record.slug) ? decisionsByOpportunityId.get(idBySlug.get(record.slug) as string) ?? null : null,
    }))
    const decided = opportunityRecords.filter(record => ['confirmed', 'excluded'].includes(String(record.reviewDecision?.decision))).length
    return NextResponse.json({
      ...artifact,
      opportunityRecords,
      reviewSummary: { total: opportunityRecords.length, decided, pending: opportunityRecords.length - decided },
    }, { headers: { 'cache-control': 'no-store' } })
  } catch {
    return NextResponse.json({ error: 'The authority crosswalk artifact is unavailable.' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  const context = await getCatalogReviewer()
  if (!context.user) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401 })
  if (context.error) return NextResponse.json({ error: 'Catalog operations are not provisioned yet.' }, { status: 503 })
  if (!context.reviewer) return NextResponse.json({ error: 'Catalog reviewer access is required.' }, { status: 403 })

  let body: {
    slug?: string
    decision?: 'confirmed' | 'excluded'
    mappingKind?: 'exact_authority_portal' | 'same_authority_host' | 'source_host_evidence_only' | 'manual' | 'explicit_exclusion'
    authorityName?: string
    authorityUrl?: string
    evidenceUrl?: string
    evidenceAnchor?: string
    reviewerNote?: string
  }
  try {
    body = await request.json() as typeof body
  } catch {
    return NextResponse.json({ error: 'The request body must be valid JSON.' }, { status: 400 })
  }
  if (!body.slug || !body.decision || !['confirmed', 'excluded'].includes(body.decision)) return NextResponse.json({ error: 'slug and a valid decision are required.' }, { status: 400 })
  if (body.decision === 'excluded' && !body.reviewerNote?.trim()) return NextResponse.json({ error: 'An explicit exclusion reason is required.' }, { status: 422 })
  if (body.decision === 'confirmed' && (!body.evidenceUrl || !/^https:\/\//i.test(body.evidenceUrl) || !body.evidenceAnchor?.trim())) return NextResponse.json({ error: 'A confirmed mapping requires an HTTPS evidence URL and precise anchor.' }, { status: 422 })

  const { data: opportunity, error: opportunityError } = await context.supabase.from('opportunities').select('id, slug').eq('slug', body.slug).maybeSingle()
  if (opportunityError) return NextResponse.json({ error: 'Unable to load the opportunity record.' }, { status: 500 })
  if (!opportunity) return NextResponse.json({ error: 'Opportunity record not found. Apply the catalog seeds first.' }, { status: 404 })

  let authorityCoverageId: string | null = null
  if (body.decision === 'confirmed') {
    const authorityQuery = body.authorityUrl
      ? context.supabase.from('authority_coverage').select('id').eq('authority_url', body.authorityUrl).limit(1).maybeSingle()
      : context.supabase.from('authority_coverage').select('id').eq('authority_name', body.authorityName ?? '').limit(1).maybeSingle()
    const { data: authority, error: authorityError } = await authorityQuery
    if (authorityError) return NextResponse.json({ error: 'Unable to resolve the IGOD authority coverage row.' }, { status: 500 })
    if (!authority) return NextResponse.json({ error: 'The confirmed mapping must point to an IGOD authority coverage row.' }, { status: 422 })
    const { data: registeredSource, error: sourceError } = await context.supabase.from('source_registry').select('id').eq('url', body.evidenceUrl).maybeSingle()
    if (sourceError) return NextResponse.json({ error: 'Unable to verify the crosswalk evidence source.' }, { status: 500 })
    if (!registeredSource) return NextResponse.json({ error: 'The crosswalk evidence URL must already exist in the registered official source registry.' }, { status: 422 })
    authorityCoverageId = authority.id
  }

  const { data: decision, error: decisionError } = await context.supabase
    .from('opportunity_authority_reviews')
    .upsert({
      opportunity_id: opportunity.id,
      authority_coverage_id: authorityCoverageId,
      decision: body.decision,
      mapping_kind: body.decision === 'excluded' ? 'explicit_exclusion' : body.mappingKind ?? 'manual',
      evidence_url: body.decision === 'confirmed' ? body.evidenceUrl : null,
      evidence_anchor: body.decision === 'confirmed' ? body.evidenceAnchor?.trim() : null,
      reviewer_note: body.reviewerNote?.trim() || null,
      reviewed_by: context.user.id,
      reviewed_at: new Date().toISOString(),
    }, { onConflict: 'opportunity_id' })
    .select('decision, mapping_kind, evidence_url, evidence_anchor, reviewer_note, reviewed_at')
    .single()
  if (decisionError) return NextResponse.json({ error: 'Unable to save the crosswalk decision.' }, { status: 500 })

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'opportunity_authority_review',
    entity_id: opportunity.id,
    action: 'opportunity_authority_mapping_decided',
    metadata: { slug: opportunity.slug, decision: body.decision, mapping_kind: body.mappingKind ?? null, reviewer_note: body.reviewerNote?.trim() || null },
  })
  return NextResponse.json({ ok: true, decision })
}
