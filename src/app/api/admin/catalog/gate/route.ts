import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { isStale } from '@/lib/opportunities/freshness'
import { isPrimaryOfficialSource } from '@/lib/opportunities/editorial'

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

type GateCheck = {
  id: string
  label: string
  passed: boolean
  value: string
  detail: string
}

export async function GET() {
  const context = await requireReviewer()
  if ('response' in context) return context.response
  const supabase = context.supabase

  const { data: sources, error: sourcesError } = await supabase
    .from('source_registry')
    .select('id, url, expected_item_count, name')
    .in('url', [
      'https://igod.gov.in/ug/E002/organizations',
      'https://igod.gov.in/ug/E003/organizations',
    ])
  if (sourcesError) return errorResponse('Unable to evaluate source coverage.', 500)

  const ministriesSource = sources?.find(source => source.url.includes('/E002/'))
  const departmentsSource = sources?.find(source => source.url.includes('/E003/'))
  const sourceIds = [ministriesSource?.id, departmentsSource?.id].filter((id): id is string => Boolean(id))
  const { data: coverage, error: coverageError } = sourceIds.length
    ? await supabase.from('authority_coverage').select('source_registry_id, authority_level, assessment_status, business_relevance, assessment_evidence_source_registry_id, assessment_evidence_url, assessment_evidence_anchor').in('source_registry_id', sourceIds)
    : { data: [], error: null }
  if (coverageError) return errorResponse('Unable to evaluate authority coverage.', 500)

  const assessmentSourceIds = [...new Set((coverage ?? []).map(row => row.assessment_evidence_source_registry_id).filter((id): id is string => Boolean(id)))]
  const { data: assessmentSources, error: assessmentSourcesError } = assessmentSourceIds.length
    ? await supabase.from('source_registry').select('id, url').in('id', assessmentSourceIds)
    : { data: [], error: null }
  if (assessmentSourcesError) return errorResponse('Unable to evaluate authority assessment provenance.', 500)
  const assessmentSourceById = new Map((assessmentSources ?? []).map(source => [source.id, source.url]))
  const invalidAuthorityEvidence = (coverage ?? []).filter(row => row.assessment_status === 'assessed' && (
    !row.assessment_evidence_source_registry_id
    || !row.assessment_evidence_url
    || !row.assessment_evidence_anchor?.trim()
    || assessmentSourceById.get(row.assessment_evidence_source_registry_id) !== row.assessment_evidence_url
  ))

  const ministryRows = (coverage ?? []).filter(row => row.authority_level === 'ministry')
  const departmentRows = (coverage ?? []).filter(row => row.authority_level === 'department')
  const ministriesExpected = ministriesSource?.expected_item_count ?? 53
  const departmentsExpected = departmentsSource?.expected_item_count ?? 50
  const ministriesAssessed = ministryRows.filter(row => row.assessment_status === 'assessed').length
  const departmentsAssessed = departmentRows.filter(row => row.assessment_status === 'assessed').length

  const { data: opportunities, error: opportunitiesError } = await supabase
    .from('opportunities')
    .select('id, name, slug, status, current_version_id')
    .in('status', ['active', 'upcoming'])
  if (opportunitiesError) return errorResponse('Unable to evaluate published opportunity coverage.', 500)

  const { data: crosswalkOpportunities, error: crosswalkOpportunitiesError } = await supabase
    .from('opportunities')
    .select('id, status')
    .neq('status', 'archived')
    .neq('status', 'superseded')
  if (crosswalkOpportunitiesError) return errorResponse('Unable to evaluate authority crosswalk coverage.', 500)
  const crosswalkOpportunityIds = (crosswalkOpportunities ?? []).map(opportunity => opportunity.id)
  const { data: crosswalkReviews, error: crosswalkReviewsError } = crosswalkOpportunityIds.length
    ? await supabase.from('opportunity_authority_reviews').select('opportunity_id, decision').in('opportunity_id', crosswalkOpportunityIds)
    : { data: [], error: null }
  if (crosswalkReviewsError) return errorResponse('Unable to evaluate authority crosswalk decisions.', 500)
  const reviewedCrosswalks = new Map((crosswalkReviews ?? []).map(review => [review.opportunity_id, review.decision]))
  const unresolvedCrosswalks = (crosswalkOpportunities ?? []).filter(opportunity => !['confirmed', 'excluded'].includes(reviewedCrosswalks.get(opportunity.id) ?? ''))

  const versionIds = (opportunities ?? []).map(row => row.current_version_id).filter((id): id is string => Boolean(id))
  const { data: versions, error: versionsError } = versionIds.length
    ? await supabase.from('opportunity_versions').select('id, title, review_status, completeness, last_verified_at').in('id', versionIds)
    : { data: [], error: null }
  if (versionsError) return errorResponse('Unable to evaluate opportunity completeness.', 500)

  const { data: windows, error: windowsError } = versionIds.length
    ? await supabase.from('opportunity_windows').select('opportunity_version_id, window_type').in('opportunity_version_id', versionIds)
    : { data: [] }
  if (windowsError) return errorResponse('Unable to evaluate opportunity windows.', 500)
  const { data: sourceRows, error: sourceRowsError } = versionIds.length
    ? await supabase.from('opportunity_sources').select('opportunity_version_id, source_url, source_anchor, source_registry_id, is_primary, source_kind').in('opportunity_version_id', versionIds)
    : { data: [] }
  if (sourceRowsError) return errorResponse('Unable to evaluate opportunity provenance.', 500)

  const missingCurrentVersion = (opportunities ?? []).filter(opportunity => !opportunity.current_version_id)
  const unapprovedVersions = (versions ?? []).filter(version => version.review_status !== 'approved')
  const staleVersions = (versions ?? []).filter(version => {
    const isDeadlineSensitive = (windows ?? []).some(window => window.opportunity_version_id === version.id && ['fixed', 'call_for_applications'].includes(window.window_type))
    return isStale(version.last_verified_at, isDeadlineSensitive ? 'deadline_sensitive' : 'rolling')
  })
  const incompleteVersions = (versions ?? []).filter(version => Number(version.completeness) < 0.95)
  const missingPrimarySources = (versions ?? []).filter(version => !(sourceRows ?? []).some(source => source.opportunity_version_id === version.id && source.source_registry_id && isPrimaryOfficialSource(source)))
  const ministriesComplete = ministryRows.length === ministriesExpected && ministryRows.every(row => row.assessment_status === 'assessed')
  const departmentsComplete = departmentRows.length === departmentsExpected && departmentRows.every(row => row.assessment_status === 'assessed')
  const approvedVersionIds = new Set((versions ?? []).filter(version => version.review_status === 'approved').map(version => version.id))
  const auditCandidates = (opportunities ?? [])
    .filter(opportunity => (opportunity.status === 'active' || opportunity.status === 'upcoming') && opportunity.current_version_id && approvedVersionIds.has(opportunity.current_version_id))
    .map(opportunity => {
      const version = (versions ?? []).find(candidate => candidate.id === opportunity.current_version_id)
      return { versionId: opportunity.current_version_id as string, name: version?.title ?? opportunity.name, slug: opportunity.slug, status: opportunity.status }
    })

  const { data: latestAudit } = await supabase
    .from('catalog_audits')
    .select('sample_size, accurate_count, accuracy_percent, completed_at')
    .eq('audit_type', 'factual_accuracy')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: discoveries, error: discoveriesError } = await supabase
    .from('catalog_discoveries')
    .select('id, lifecycle_status, business_relevance, assessment_status, exclusion_reason, linked_opportunity_id')
    .in('lifecycle_status', ['active', 'upcoming'])
  if (discoveriesError) return errorResponse('Unable to evaluate discovered opportunity coverage.', 500)

  const linkedOpportunityIds = (discoveries ?? []).map(row => row.linked_opportunity_id).filter((id): id is string => Boolean(id))
  const { data: linkedOpportunities } = linkedOpportunityIds.length
    ? await supabase.from('opportunities').select('id, status, current_version_id').in('id', linkedOpportunityIds)
    : { data: [] }
  const linkedVersionIds = (linkedOpportunities ?? []).map(row => row.current_version_id).filter((id): id is string => Boolean(id))
  const { data: linkedVersions } = linkedVersionIds.length
    ? await supabase.from('opportunity_versions').select('id, review_status').in('id', linkedVersionIds)
    : { data: [] }
  const approvedLinkedOpportunityIds = new Set(
    (linkedOpportunities ?? [])
      .filter(opportunity => opportunity.status === 'active' || opportunity.status === 'upcoming')
      .filter(opportunity => linkedVersions?.some(version => version.id === opportunity.current_version_id && version.review_status === 'approved'))
      .map(opportunity => opportunity.id),
  )
  const unresolvedDiscoveries = (discoveries ?? []).filter(discovery => {
    if (discovery.assessment_status !== 'assessed') return true
    if (discovery.business_relevance === 'not_relevant') return !discovery.exclusion_reason?.trim()
    if (discovery.business_relevance !== 'relevant') return true
    return !discovery.linked_opportunity_id || !approvedLinkedOpportunityIds.has(discovery.linked_opportunity_id)
  })

  const { data: openChangeEvents, error: changeEventsError } = await supabase
    .from('change_events')
    .select('id')
    .eq('review_status', 'open')
    .in('event_type', ['initial', 'changed'])
  if (changeEventsError) return errorResponse('Unable to evaluate source-change review state.', 500)

  const checks: GateCheck[] = [
    {
      id: 'ministries',
      label: 'Every IGOD-listed Union ministry assessed',
      passed: ministriesComplete,
      value: ministriesAssessed + '/' + ministriesExpected,
      detail: 'Discovered ' + ministryRows.length + '; assessed ' + ministriesAssessed + '. Exact inventory and every-row assessment are required.',
    },
    {
      id: 'departments',
      label: 'Every IGOD-listed Union department assessed',
      passed: departmentsComplete,
      value: departmentsAssessed + '/' + departmentsExpected,
      detail: 'Discovered ' + departmentRows.length + '; assessed ' + departmentsAssessed + '. Exact inventory and every-row assessment are required.',
    },
    {
      id: 'authority_provenance',
      label: 'Every assessed authority has registered, anchored evidence',
      passed: invalidAuthorityEvidence.length === 0,
      value: invalidAuthorityEvidence.length === 0 ? 'Clear' : invalidAuthorityEvidence.length + ' invalid',
      detail: 'Every terminal authority decision must retain an exact registered source URL and a precise evidence anchor.',
    },
    {
      id: 'published_version_status',
      label: 'Every active/upcoming opportunity has an approved current version',
      passed: missingCurrentVersion.length === 0 && unapprovedVersions.length === 0,
      value: missingCurrentVersion.length || unapprovedVersions.length ? (missingCurrentVersion.length + ' missing, ' + unapprovedVersions.length + ' unapproved') : 'Clear',
      detail: 'An active or upcoming opportunity cannot enter the beta catalog without an approved current version.',
    },
    {
      id: 'published_completeness',
      label: 'Published versions meet 95% completeness',
      passed: incompleteVersions.length === 0,
      value: (versions ?? []).length + ' published',
      detail: incompleteVersions.length + ' published versions below the threshold.',
    },
    {
      id: 'freshness',
      label: 'No published version is stale',
      passed: staleVersions.length === 0,
      value: staleVersions.length === 0 ? 'Clear' : staleVersions.length + ' stale',
      detail: 'Deadline-sensitive records use 30 days; rolling/static records use 90 days.',
    },
    {
      id: 'provenance',
      label: 'Published versions have primary official provenance',
      passed: missingPrimarySources.length === 0,
      value: missingPrimarySources.length === 0 ? 'Clear' : missingPrimarySources.length + ' missing',
      detail: 'Primary sources with source_kind=other do not satisfy the gate.',
    },
    {
      id: 'accuracy',
      label: 'Manual factual accuracy audit reaches 98%',
      passed: Number(latestAudit?.accuracy_percent ?? 0) >= 98,
      value: latestAudit ? Number(latestAudit.accuracy_percent).toFixed(2) + '%' : 'Not recorded',
      detail: latestAudit ? 'Sample ' + latestAudit.sample_size + ', accurate ' + latestAudit.accurate_count + '.' : 'A reviewer must record an audit sample.',
    },
    {
      id: 'discovery_coverage',
      label: 'Every active/upcoming discovery assessed and resolved',
      passed: unresolvedDiscoveries.length === 0,
      value: (discoveries ?? []).length + ' open discoveries',
      detail: unresolvedDiscoveries.length + ' discoveries still need assessment, exclusion evidence, or an approved linked record.',
    },
    {
      id: 'authority_crosswalk',
      label: 'Every catalog opportunity has a reviewed authority mapping or exclusion',
      passed: unresolvedCrosswalks.length === 0,
      value: unresolvedCrosswalks.length === 0 ? 'Clear' : unresolvedCrosswalks.length + ' pending',
      detail: 'Every non-archived opportunity needs a confirmed evidence-backed authority mapping or an explicit exclusion reason.',
    },
    {
      id: 'source_change_review',
      label: 'No open source-change events remain',
      passed: (openChangeEvents ?? []).length === 0,
      value: (openChangeEvents ?? []).length === 0 ? 'Clear' : (openChangeEvents ?? []).length + ' open',
      detail: 'Initial and changed snapshots require reviewer disposition before release.',
    },
  ]

  return NextResponse.json({
    ready: checks.every(check => check.passed),
    checks,
    latestAudit: latestAudit ?? null,
    auditCandidates,
    evaluatedAt: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { sampleVersionIds?: unknown; inaccurateVersionIds?: unknown; notes?: string }
  try {
    body = await request.json() as { sampleVersionIds?: unknown; inaccurateVersionIds?: unknown; notes?: string }
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  const sampleVersionIds = Array.isArray(body.sampleVersionIds) ? body.sampleVersionIds.filter((value): value is string => typeof value === 'string' && value.length > 0) : []
  const inaccurateVersionIds = Array.isArray(body.inaccurateVersionIds) ? body.inaccurateVersionIds.filter((value): value is string => typeof value === 'string' && value.length > 0) : []
  if (sampleVersionIds.length < 20) {
    return errorResponse('A factual-accuracy audit must cover at least 20 records.', 422)
  }
  if (new Set(sampleVersionIds).size !== sampleVersionIds.length || new Set(inaccurateVersionIds).size !== inaccurateVersionIds.length) {
    return errorResponse('Sample version IDs must be unique.', 422)
  }
  if (inaccurateVersionIds.some(versionId => !sampleVersionIds.includes(versionId))) {
    return errorResponse('Every inaccurate record must be included in the selected sample.', 422)
  }
  if (!body.notes?.trim()) {
    return errorResponse('Sampling notes are required for a factual-accuracy audit.', 422)
  }

  const { data, error } = await context.supabase.rpc('record_catalog_accuracy_audit', {
    p_sample_version_ids: sampleVersionIds,
    p_inaccurate_version_ids: inaccurateVersionIds,
    p_notes: body.notes.trim(),
  })
  if (error) return errorResponse('Unable to save the accuracy audit.', 500)
  return NextResponse.json({ data: Array.isArray(data) ? data[0] : data }, { status: 201 })
}
