import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'

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

  const { data, error } = await context.supabase
    .from('catalog_discoveries')
    .select('id, name, canonical_url, opportunity_type, lifecycle_status, business_relevance, assessment_status, exclusion_reason, linked_opportunity_id, created_at, source_registry:source_registry(name, url), source_snapshot:source_snapshots(content_hash, created_at)')
    .in('lifecycle_status', ['active', 'upcoming'])
    .order('created_at', { ascending: true })
  if (error) return errorResponse('Unable to load catalog discoveries.', 500)

  const { data: opportunities, error: opportunitiesError } = await context.supabase
    .from('opportunities')
    .select('id, name, slug, status, current_version_id')
    .in('status', ['active', 'upcoming'])
  if (opportunitiesError) return errorResponse('Unable to load approved opportunity options.', 500)
  const versionIds = (opportunities ?? []).map(opportunity => opportunity.current_version_id).filter((id): id is string => Boolean(id))
  const { data: versions, error: versionsError } = versionIds.length
    ? await context.supabase.from('opportunity_versions').select('id, review_status').in('id', versionIds)
    : { data: [], error: null }
  if (versionsError) return errorResponse('Unable to validate approved opportunity options.', 500)
  const approvedVersionIds = new Set((versions ?? []).filter(version => version.review_status === 'approved').map(version => version.id))
  const approvedOpportunities = (opportunities ?? []).filter(opportunity => opportunity.current_version_id && approvedVersionIds.has(opportunity.current_version_id)).map(opportunity => ({ id: opportunity.id, name: opportunity.name, slug: opportunity.slug, status: opportunity.status }))
  return NextResponse.json({ data: data ?? [], approvedOpportunities })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: {
    discoveryId?: string
    businessRelevance?: 'relevant' | 'not_relevant' | 'unclear'
    exclusionReason?: string
    linkedOpportunityId?: string
  }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.discoveryId || !body.businessRelevance || !['relevant', 'not_relevant', 'unclear'].includes(body.businessRelevance)) {
    return errorResponse('discoveryId and a valid businessRelevance are required.', 400)
  }
  if (body.businessRelevance === 'not_relevant' && !body.exclusionReason?.trim()) {
    return errorResponse('An exclusion reason is required for a not-relevant discovery.', 422)
  }
  if (body.businessRelevance === 'relevant' && !body.linkedOpportunityId) {
    return errorResponse('A relevant discovery must be linked to an approved opportunity.', 422)
  }
  if (body.businessRelevance !== 'relevant' && body.linkedOpportunityId) {
    return errorResponse('Only relevant discoveries may be linked to an opportunity.', 422)
  }

  if (body.linkedOpportunityId) {
    const { data: opportunity, error } = await context.supabase
      .from('opportunities')
      .select('id, status, current_version_id')
      .eq('id', body.linkedOpportunityId)
      .maybeSingle()
    if (error) return errorResponse('Unable to validate the linked opportunity.', 500)
    if (!opportunity) return errorResponse('The linked opportunity was not found.', 404)
    if (!['active', 'upcoming'].includes(opportunity.status) || !opportunity.current_version_id) {
      return errorResponse('The linked opportunity must be active or upcoming.', 422)
    }
    const { data: version, error: versionError } = await context.supabase.from('opportunity_versions').select('review_status').eq('id', opportunity.current_version_id).maybeSingle()
    if (versionError) return errorResponse('Unable to validate the linked opportunity version.', 500)
    if (version?.review_status !== 'approved') return errorResponse('The linked opportunity version must be approved.', 422)
  }

  const { error } = await context.supabase.from('catalog_discoveries').update({
    business_relevance: body.businessRelevance,
    assessment_status: body.businessRelevance === 'unclear' ? 'in_progress' : 'assessed',
    exclusion_reason: body.businessRelevance === 'not_relevant' ? body.exclusionReason?.trim() : null,
    linked_opportunity_id: body.businessRelevance === 'relevant' ? body.linkedOpportunityId ?? null : null,
    assessed_by: context.user.id,
    assessed_at: new Date().toISOString(),
  }).eq('id', body.discoveryId)
  if (error) return errorResponse('Unable to save the discovery assessment.', 500)

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'catalog_discovery',
    entity_id: body.discoveryId,
    action: 'catalog_discovery_assessed',
    metadata: { business_relevance: body.businessRelevance, exclusion_reason: body.exclusionReason?.trim() || null, linked_opportunity_id: body.linkedOpportunityId ?? null },
  })

  return NextResponse.json({ ok: true })
}
