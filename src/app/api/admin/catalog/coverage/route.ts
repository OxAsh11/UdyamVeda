import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { isOfficialSourceUrl } from '@/lib/opportunities/editorial'

type Relevance = 'relevant' | 'not_relevant' | 'unclear'

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

export async function GET(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const requestUrl = new URL(request.url)
  if (requestUrl.searchParams.get('format') === 'csv') {
    const { data, error } = await context.supabase
      .from('authority_coverage')
      .select('id, source_registry_id, authority_level, authority_name, authority_url, business_relevance, assessment_status, exclusion_reason, assessment_note, assessment_evidence_url, assessment_evidence_anchor, assessed_at, source_registry:source_registry!authority_coverage_source_registry_id_fkey(name, url, expected_item_count)')
      .order('assessment_status', { ascending: true })
      .order('authority_name', { ascending: true })
    if (error) return errorResponse('Unable to load the authority coverage matrix.', 500)
    const rows = data ?? []
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const header = ['authority_level', 'authority_name', 'authority_url', 'business_relevance', 'assessment_status', 'exclusion_reason', 'assessment_note', 'assessment_evidence_url', 'assessment_evidence_anchor', 'assessed_at', 'source_name', 'source_url', 'expected_item_count']
    const csvRows = rows.map(row => {
      const source = Array.isArray(row.source_registry) ? row.source_registry[0] : row.source_registry
      return [
        row.authority_level,
        row.authority_name,
        row.authority_url,
        row.business_relevance,
        row.assessment_status,
        row.exclusion_reason,
        row.assessment_note,
        row.assessment_evidence_url,
        row.assessment_evidence_anchor,
        row.assessed_at,
        source?.name,
        source?.url,
        source?.expected_item_count,
      ].map(escape).join(',')
    })
    return new NextResponse([header.map(escape).join(','), ...csvRows].join('\r\n'), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="udyamveda-authority-coverage.csv"',
        'cache-control': 'no-store',
      },
    })
  }

  const requestedPage = Number(requestUrl.searchParams.get('page') ?? '1')
  const requestedPageSize = Number(requestUrl.searchParams.get('pageSize') ?? '25')
  const filter = requestUrl.searchParams.get('filter')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
    ? Math.min(requestedPageSize, 50)
    : 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const selectColumns = 'id, source_registry_id, authority_level, authority_name, authority_url, business_relevance, assessment_status, exclusion_reason, assessment_note, assessment_evidence_url, assessment_evidence_anchor, assessed_at, source_registry:source_registry!authority_coverage_source_registry_id_fkey(name, url, expected_item_count)'
  let coverageQuery = context.supabase
    .from('authority_coverage')
    .select(selectColumns, { count: 'exact' })
  if (filter === 'needs_review') coverageQuery = coverageQuery.neq('assessment_status', 'assessed')
  if (filter === 'assessed') coverageQuery = coverageQuery.eq('assessment_status', 'assessed')

  const [coverageResult, totalResult, assessedResult, relevantResult, excludedResult, unclearResult, ministryTotalResult, ministryAssessedResult, departmentTotalResult, departmentAssessedResult, unresolvedPortalsResult] = await Promise.all([
    coverageQuery
      .order('assessment_status', { ascending: true })
      .order('authority_name', { ascending: true })
      .range(from, to),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('assessment_status', 'assessed'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('business_relevance', 'relevant'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('business_relevance', 'not_relevant'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).or('business_relevance.eq.unclear,assessment_status.eq.in_progress'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('authority_level', 'ministry'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('authority_level', 'ministry').eq('assessment_status', 'assessed'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('authority_level', 'department'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).eq('authority_level', 'department').eq('assessment_status', 'assessed'),
    context.supabase.from('authority_coverage').select('id', { count: 'exact', head: true }).is('authority_url', null),
  ])

  if ([coverageResult, totalResult, assessedResult, relevantResult, excludedResult, unclearResult, ministryTotalResult, ministryAssessedResult, departmentTotalResult, departmentAssessedResult, unresolvedPortalsResult].some(result => result.error)) {
    return errorResponse('Unable to load the authority coverage matrix.', 500)
  }

  return NextResponse.json({
    data: coverageResult.data ?? [],
    pagination: {
      page,
      pageSize,
      total: coverageResult.count ?? 0,
      hasMore: (coverageResult.count ?? 0) > to + 1,
    },
    summary: {
      total: totalResult.count ?? 0,
      assessed: assessedResult.count ?? 0,
      relevant: relevantResult.count ?? 0,
      excluded: excludedResult.count ?? 0,
      unclear: unclearResult.count ?? 0,
      ministryTotal: ministryTotalResult.count ?? 0,
      ministryAssessed: ministryAssessedResult.count ?? 0,
      departmentTotal: departmentTotalResult.count ?? 0,
      departmentAssessed: departmentAssessedResult.count ?? 0,
      unresolvedPortals: unresolvedPortalsResult.count ?? 0,
    },
  })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { coverageId?: string; businessRelevance?: Relevance; exclusionReason?: string; assessmentNote?: string; assessmentEvidenceUrl?: string; assessmentEvidenceAnchor?: string }
  try {
    body = await request.json() as { coverageId?: string; businessRelevance?: Relevance; exclusionReason?: string; assessmentNote?: string; assessmentEvidenceUrl?: string; assessmentEvidenceAnchor?: string }
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.coverageId || !body.businessRelevance || !['relevant', 'not_relevant', 'unclear'].includes(body.businessRelevance)) {
    return errorResponse('coverageId and a valid businessRelevance are required.', 400)
  }
  if (body.businessRelevance === 'not_relevant' && !body.exclusionReason?.trim()) {
    return errorResponse('An exclusion reason is required when an authority is marked not relevant.', 422)
  }
  if (body.businessRelevance === 'unclear' && !body.assessmentNote?.trim()) {
    return errorResponse('A review note is required when an authority remains unclear.', 422)
  }
  if (body.businessRelevance === 'relevant' && !body.assessmentNote?.trim()) {
    return errorResponse('A review note describing the relevant source scope is required before an authority can be assessed.', 422)
  }
  if (body.businessRelevance !== 'unclear' && !isOfficialSourceUrl(body.assessmentEvidenceUrl?.trim())) {
    return errorResponse('An official Government or allowlisted implementing-agency HTTPS evidence URL is required before a terminal authority decision can be saved.', 422)
  }
  if (body.businessRelevance !== 'unclear' && !body.assessmentEvidenceAnchor?.trim()) {
    return errorResponse('A precise official evidence anchor is required before a terminal authority decision can be saved.', 422)
  }

  let registeredEvidenceSourceId: string | null = null
  if (body.businessRelevance !== 'unclear') {
    const evidenceUrl = body.assessmentEvidenceUrl?.trim() ?? ''
    const { data: registeredSource, error: registeredSourceError } = await context.supabase
      .from('source_registry')
      .select('id')
      .eq('url', evidenceUrl)
      .maybeSingle()
    if (registeredSourceError) return errorResponse('Unable to verify the authority evidence source registry.', 500)
    if (!registeredSource) return errorResponse('The terminal authority evidence URL must already exist in the registered official source registry.', 422)
    registeredEvidenceSourceId = registeredSource.id
  }

  const { data: coverage, error: coverageError } = await context.supabase
    .from('authority_coverage')
    .select('id, authority_name, authority_url')
    .eq('id', body.coverageId)
    .maybeSingle()
  if (coverageError) return errorResponse('Unable to load the authority row.', 500)
  if (!coverage) return errorResponse('Authority coverage row not found.', 404)
  if (body.businessRelevance === 'relevant' && !(typeof coverage.authority_url === 'string' && /^https:\/\//i.test(coverage.authority_url))) {
    return errorResponse('A verified HTTPS authority portal URL is required before marking this authority relevant.', 422)
  }

  const { error } = await context.supabase
    .from('authority_coverage')
    .update({
      business_relevance: body.businessRelevance,
      assessment_status: body.businessRelevance === 'unclear' ? 'in_progress' : 'assessed',
      exclusion_reason: body.businessRelevance === 'not_relevant' ? body.exclusionReason?.trim() : null,
      assessment_note: body.assessmentNote?.trim() || null,
      assessment_evidence_url: body.businessRelevance === 'unclear' ? null : body.assessmentEvidenceUrl?.trim(),
      assessment_evidence_anchor: body.businessRelevance === 'unclear' ? null : body.assessmentEvidenceAnchor?.trim(),
      assessment_evidence_source_registry_id: body.businessRelevance === 'unclear' ? null : registeredEvidenceSourceId,
      assessed_at: body.businessRelevance === 'unclear' ? null : new Date().toISOString(),
      assessed_by: body.businessRelevance === 'unclear' ? null : context.user.id,
    })
    .eq('id', coverage.id)
  if (error) return errorResponse('Unable to save the authority assessment.', 500)

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'authority_coverage',
    entity_id: coverage.id,
    action: 'authority_relevance_assessed',
    metadata: { authority_name: coverage.authority_name, business_relevance: body.businessRelevance, exclusion_reason: body.exclusionReason?.trim() || null, assessment_note: body.assessmentNote?.trim() || null, assessment_evidence_url: body.assessmentEvidenceUrl?.trim() || null, assessment_evidence_anchor: body.assessmentEvidenceAnchor?.trim() || null },
  })

  return NextResponse.json({ ok: true, assessmentStatus: body.businessRelevance === 'unclear' ? 'in_progress' : 'assessed' })
}
