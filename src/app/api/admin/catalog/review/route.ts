import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStale } from '@/lib/opportunities/freshness'
import { isPrimaryOfficialSource, publicationStatusForWindows, validatePublicationRecord } from '@/lib/opportunities/editorial'
import { validateEligibilityRules } from '@/lib/opportunities/validation'

type ReviewAction = 'approve' | 'reject' | 'request_changes' | 'confirm_rules' | 'record_check'
type ReviewCheckType = 'source' | 'eligibility' | 'benefit' | 'application' | 'window' | 'fine_print' | 'amendment'
type ReviewCheckStatus = 'pending' | 'passed' | 'failed' | 'not_applicable'

const reviewCheckTypes: ReviewCheckType[] = ['source', 'eligibility', 'benefit', 'application', 'window', 'fine_print', 'amendment']

type ReviewTaskRow = {
  id: string
  task_type: string
  status: string
  reviewer_notes: string | null
  created_at: string
  opportunity_version: {
    id: string
    version_number: number
    title: string
    summary: string | null
    objective: string | null
    legal_basis: string | null
    eligibility: unknown
    application: unknown
    fine_print: unknown
    benefit_summary: unknown
    effective_from: string | null
    effective_to: string | null
    completeness: number
    confidence: number
    last_verified_at: string | null
    review_status: string
    rules: Array<{ reviewed: boolean; rules: unknown }>
    opportunity: {
      id: string
      slug: string
      name: string
      status: string
      opportunity_type: string
      current_version_id: string | null
    } | null
    sources: Array<{
      source_registry_id: string | null
      source_url: string
      source_kind: string
      source_title: string | null
      source_anchor: string | null
      page_number: number | null
      section: string | null
      paragraph: string | null
      document_anchor: string | null
      is_primary: boolean
    }>
    benefits: Array<{ benefit_type: string; label: string; amount_min: number | null; amount_max: number | null; percentage: number | null }>
    requirements: Array<{ requirement_type: string; name: string; required: boolean }>
    steps: Array<{ step_number: number; title: string; official_url: string | null }>
    windows: Array<{ window_type: string; opens_at: string | null; closes_at: string | null }>
    checks: Array<{ check_type: ReviewCheckType; status: ReviewCheckStatus; evidence: unknown; reviewer_note: string | null; reviewed_by: string | null; reviewed_at: string | null }>
  } | null
}

function reviewerError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function reviewSearchTerm(value: string) {
  return value.replace(/[,%()]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
}

export async function GET(request: NextRequest) {
  const { supabase, user, reviewer, error: reviewerErrorState } = await getCatalogReviewer()

  if (!user) return reviewerError('Sign in is required.', 401)
  if (reviewerErrorState) {
    return reviewerError('Catalog review access is not provisioned yet.', 503)
  }
  if (!reviewer) return reviewerError('Catalog reviewer access is required.', 403)

  // The reviewer identity is verified above with the user's Supabase session.
  // Use the server-only client for the read-heavy, nested queue query so that
  // related catalog rows are not blocked by client-scoped RLS policies. POST
  // actions intentionally continue using the session client and database RPCs.
  const reviewReadClient = process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createAdminClient()
    : supabase

  const requestedPage = Number(request.nextUrl.searchParams.get('page') ?? '1')
  const requestedPageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? '10')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
    ? Math.min(requestedPageSize, 25)
    : 10
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const search = reviewSearchTerm(request.nextUrl.searchParams.get('q') ?? '')
  const authority = reviewSearchTerm(request.nextUrl.searchParams.get('authority') ?? '')
  const { data: authorityOptionRows, error: authorityOptionError } = await reviewReadClient
    .from('opportunities')
    .select('authority:authorities(name)')
    .not('authority_id', 'is', null)
    .limit(500)
  if (authorityOptionError) return reviewerError('Unable to load catalog review authorities.', 500)
  const authorityOptions = [...new Set((authorityOptionRows ?? []).map(row => {
    const value = Array.isArray(row.authority) ? row.authority[0] : row.authority
    return value?.name
  }).filter((value): value is string => Boolean(value)))].sort((a, b) => a.localeCompare(b))
  let matchingVersionIds: string[] | null = null

  async function versionIdsForAuthority(term: string) {
    const pattern = `%${term}%`
    const { data: authorityRows, error: authorityError } = await reviewReadClient
      .from('authorities')
      .select('id')
      .ilike('name', pattern)
      .limit(100)
    if (authorityError) return { ids: [] as string[], error: true }
    const authorityIds = (authorityRows ?? []).map(row => row.id)
    if (!authorityIds.length) return { ids: [] as string[], error: false }
    const { data: opportunityRows, error: opportunityError } = await reviewReadClient
      .from('opportunities')
      .select('id')
      .in('authority_id', authorityIds)
      .limit(500)
    if (opportunityError) return { ids: [] as string[], error: true }
    const opportunityIds = (opportunityRows ?? []).map(row => row.id)
    if (!opportunityIds.length) return { ids: [] as string[], error: false }
    const { data: versionRows, error: versionError } = await reviewReadClient
      .from('opportunity_versions')
      .select('id')
      .in('opportunity_id', opportunityIds)
      .limit(500)
    if (versionError) return { ids: [] as string[], error: true }
    return { ids: (versionRows ?? []).map(row => row.id), error: false }
  }

  if (search) {
    const pattern = `%${search}%`
    const [versionByTitle, versionBySummary, versionByObjective, opportunityByName, opportunityBySlug] = await Promise.all([
      reviewReadClient.from('opportunity_versions').select('id').ilike('title', pattern).limit(500),
      reviewReadClient.from('opportunity_versions').select('id').ilike('summary', pattern).limit(500),
      reviewReadClient.from('opportunity_versions').select('id').ilike('objective', pattern).limit(500),
      reviewReadClient.from('opportunities').select('id').ilike('name', pattern).limit(500),
      reviewReadClient.from('opportunities').select('id').ilike('slug', pattern).limit(500),
    ])
    const searchErrors = [versionByTitle, versionBySummary, versionByObjective, opportunityByName, opportunityBySlug].filter(result => result.error)
    if (searchErrors.length) return reviewerError('Unable to search the catalog review queue.', 500)
    const versionIds = new Set([
      ...(versionByTitle.data ?? []).map(row => row.id),
      ...(versionBySummary.data ?? []).map(row => row.id),
      ...(versionByObjective.data ?? []).map(row => row.id),
    ])
    const opportunityIds = new Set([
      ...(opportunityByName.data ?? []).map(row => row.id),
      ...(opportunityBySlug.data ?? []).map(row => row.id),
    ])
    if (opportunityIds.size) {
      const { data: versionsForOpportunities, error: opportunityVersionError } = await reviewReadClient
        .from('opportunity_versions')
        .select('id')
        .in('opportunity_id', [...opportunityIds])
        .limit(500)
      if (opportunityVersionError) return reviewerError('Unable to search the catalog review queue.', 500)
      for (const row of versionsForOpportunities ?? []) versionIds.add(row.id)
    }
    matchingVersionIds = [...versionIds]
  }

  if (authority) {
    const authorityMatch = await versionIdsForAuthority(authority)
    if (authorityMatch.error) return reviewerError('Unable to filter the catalog review queue by authority.', 500)
    matchingVersionIds = matchingVersionIds === null
      ? authorityMatch.ids
      : matchingVersionIds.filter(id => authorityMatch.ids.includes(id))
  }

  if (matchingVersionIds && !matchingVersionIds.length) {
    return NextResponse.json({ data: [], pagination: { page, pageSize, total: 0, hasMore: false }, search, authority, authorityOptions })
  }

  let reviewQuery = reviewReadClient
    .from('review_tasks')
    .select(
      'id, task_type, status, reviewer_notes, created_at, opportunity_version:opportunity_versions(id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, effective_from, effective_to, completeness, confidence, last_verified_at, review_status, opportunity:opportunities(id, slug, name, status, opportunity_type, current_version_id), sources:opportunity_sources(source_registry_id, source_url, source_kind, source_title, source_anchor, page_number, section, paragraph, document_anchor, is_primary), benefits:opportunity_benefits(benefit_type, label, amount_min, amount_max, percentage), requirements:opportunity_requirements(requirement_type, name, required), steps:opportunity_steps(step_number, title, official_url), windows:opportunity_windows(window_type, opens_at, closes_at), rules:eligibility_rule_sets(reviewed), checks:catalog_review_checks(check_type, status, evidence, reviewer_note, reviewed_by, reviewed_at))',
      { count: 'exact' },
    )
    .in('status', ['open', 'in_review'])
    .order('created_at', { ascending: true })
  if (matchingVersionIds) reviewQuery = reviewQuery.in('opportunity_version_id', matchingVersionIds)
  const { data, count, error } = await reviewQuery.range(from, to)

  if (error) return reviewerError('Unable to load the catalog review queue.', 500)

  return NextResponse.json({
    data: (data ?? []) as unknown as ReviewTaskRow[],
    pagination: {
      page,
      pageSize,
      total: count ?? 0,
      hasMore: (count ?? 0) > to + 1,
    },
    search,
    authority,
    authorityOptions,
  })
}

export async function POST(request: NextRequest) {
  const { supabase, user, reviewer, error: reviewerErrorState } = await getCatalogReviewer()

  if (!user) return reviewerError('Sign in is required.', 401)
  if (reviewerErrorState) {
    return reviewerError('Catalog review access is not provisioned yet.', 503)
  }
  if (!reviewer) return reviewerError('Catalog reviewer access is required.', 403)

  let body: { taskId?: string; action?: ReviewAction; notes?: string; checkType?: ReviewCheckType; checkStatus?: ReviewCheckStatus; evidence?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return reviewerError('The request body must be valid JSON.', 400)
  }

  const { taskId, action, notes } = body
  if (!taskId || !action || !['approve', 'reject', 'request_changes', 'confirm_rules', 'record_check'].includes(action)) {
    return reviewerError('taskId and a valid action are required.', 400)
  }

  const { data: task, error: taskError } = await supabase
    .from('review_tasks')
    .select('id, status, opportunity_version_id, opportunity_version:opportunity_versions(id, title, objective, legal_basis, eligibility, application, fine_print, benefit_summary, completeness, review_status, last_verified_at, opportunity_id, opportunity:opportunities(id, slug, status, current_version_id), benefits:opportunity_benefits(benefit_type, label, amount_min, amount_max, percentage), requirements:opportunity_requirements(requirement_type, name, required), steps:opportunity_steps(step_number, title, official_url), windows:opportunity_windows(window_type, opens_at, closes_at), sources:opportunity_sources(source_registry_id, source_url, source_kind, source_anchor, page_number, section, paragraph, document_anchor, is_primary), rules:eligibility_rule_sets(reviewed, rules), checks:catalog_review_checks(check_type, status, evidence, reviewer_note, reviewed_by, reviewed_at))')
    .eq('id', taskId)
    .maybeSingle()

  if (taskError) return reviewerError('Unable to load the review task.', 500)
  if (!task) return reviewerError('Review task not found.', 404)
  if (!['open', 'in_review'].includes(task.status)) {
    return reviewerError('This review task has already been completed.', 409)
  }

  const version = Array.isArray(task.opportunity_version)
    ? task.opportunity_version[0]
    : task.opportunity_version
  if (!version) return reviewerError('The review task has no opportunity version.', 422)

  if (action === 'record_check') {
    if (!body.checkType || !reviewCheckTypes.includes(body.checkType)) return reviewerError('A valid editorial check type is required.', 400)
    if (!body.checkStatus || !['pending', 'passed', 'failed', 'not_applicable'].includes(body.checkStatus)) return reviewerError('A valid editorial check status is required.', 400)
    if ((body.checkStatus === 'failed' || body.checkStatus === 'not_applicable') && !body.notes?.trim()) {
      return reviewerError('A reviewer note is required for failed or not-applicable checks.', 422)
    }
    const evidenceRecord = body.evidence && typeof body.evidence === 'object' && !Array.isArray(body.evidence)
      ? body.evidence as Record<string, unknown>
      : null
    if (body.checkStatus === 'passed' && (!evidenceRecord || Object.keys(evidenceRecord).length === 0 || typeof evidenceRecord.finding !== 'string' || !evidenceRecord.finding.trim())) {
      return reviewerError('Structured evidence with the exact source finding is required before a check can be passed.', 422)
    }
    const { data: updatedCheck, error: checkError } = await supabase
      .from('catalog_review_checks')
      .update({
        status: body.checkStatus,
        evidence: body.evidence && typeof body.evidence === 'object' ? body.evidence : {},
        reviewer_note: body.notes?.trim() || null,
        reviewed_by: body.checkStatus === 'pending' ? null : user.id,
        reviewed_at: body.checkStatus === 'pending' ? null : new Date().toISOString(),
      })
      .eq('review_task_id', taskId)
      .eq('check_type', body.checkType)
      .select('id')
      .maybeSingle()
    if (checkError || !updatedCheck) return reviewerError('Unable to record the editorial check. Apply the catalog checklist migration first.', 500)
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      entity_type: 'catalog_review_check',
      entity_id: version.id,
      action: 'catalog_review_check_recorded',
      metadata: { task_id: taskId, check_type: body.checkType, status: body.checkStatus, notes: body.notes?.trim() || null },
    })
    return NextResponse.json({ ok: true, checkType: body.checkType, status: body.checkStatus })
  }

  if (action === 'confirm_rules') {
    const ruleSets = Array.isArray(version.rules) ? version.rules : []
    const ruleSet = ruleSets[0]
    if (!ruleSet) return reviewerError('This record has no structured eligibility rule set.', 422)
    const ruleErrors = validateEligibilityRules(ruleSet.rules)
    if (ruleErrors.length) return reviewerError('Eligibility rules are not valid: ' + ruleErrors.join(' '), 422)
    const { error: rulesError } = await supabase
      .from('eligibility_rule_sets')
      .update({ reviewed: true })
      .eq('opportunity_version_id', version.id)
    if (rulesError) return reviewerError('Unable to confirm the eligibility rules.', 500)
    const { data: updatedEligibilityCheck, error: checklistError } = await supabase
      .from('catalog_review_checks')
      .update({ status: 'passed', evidence: { rulesConfirmed: true }, reviewer_note: notes?.trim() || null, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('review_task_id', taskId)
      .eq('check_type', 'eligibility')
      .select('id')
      .maybeSingle()
    if (checklistError || !updatedEligibilityCheck) return reviewerError('Eligibility rules were validated, but the editorial checklist could not be updated.', 500)
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      entity_type: 'eligibility_rule_set',
      entity_id: version.id,
      action: 'catalog_eligibility_rules_confirmed',
      metadata: { task_id: taskId, notes: notes?.trim() || null },
    })
    return NextResponse.json({ ok: true, status: 'in_review', rulesReviewed: true })
  }

  let publicationStatus: 'active' | 'upcoming' | 'closed' | null = null

  if (action === 'approve') {
    const [{ data: windows, error: windowError }, { data: benefits, error: benefitsError }, { data: requirements, error: requirementsError }, { data: steps, error: stepsError }, { data: sources, error: sourceError }, { data: rules, error: rulesError }, { data: checks, error: checksError }] = await Promise.all([
      supabase.from('opportunity_windows').select('window_type, opens_at, closes_at').eq('opportunity_version_id', version.id),
      supabase.from('opportunity_benefits').select('benefit_type, label, amount_min, amount_max, percentage').eq('opportunity_version_id', version.id),
      supabase.from('opportunity_requirements').select('requirement_type, name, required').eq('opportunity_version_id', version.id),
      supabase.from('opportunity_steps').select('step_number, title, official_url').eq('opportunity_version_id', version.id),
      supabase.from('opportunity_sources').select('source_registry_id, source_url, source_kind, source_anchor, page_number, section, paragraph, document_anchor, is_primary').eq('opportunity_version_id', version.id),
      supabase.from('eligibility_rule_sets').select('reviewed').eq('opportunity_version_id', version.id),
      supabase.from('catalog_review_checks').select('check_type, status, reviewer_note').eq('review_task_id', taskId),
    ])
    if (windowError || benefitsError || requirementsError || stepsError || sourceError || rulesError || checksError) return reviewerError('Unable to verify the complete publication dossier.', 500)
    const checkMap = new Map((checks ?? []).map(check => [check.check_type, check.status]))
    const incompleteChecks = reviewCheckTypes.filter(checkType => {
      const status = checkMap.get(checkType)
      return checkType === 'amendment' ? !['passed', 'not_applicable'].includes(status ?? '') : status !== 'passed'
    })
    if (incompleteChecks.length) return reviewerError('Editorial checklist is incomplete: ' + incompleteChecks.join(', ') + '.', 422)
    const publicationErrors = validatePublicationRecord({
      title: version.title,
      objective: version.objective,
      eligibility: version.eligibility,
      application: version.application,
      fine_print: version.fine_print,
      benefit_summary: version.benefit_summary,
      completeness: version.completeness,
      last_verified_at: version.last_verified_at,
      benefits_count: benefits?.length ?? 0,
      requirements_count: requirements?.length ?? 0,
      steps_count: steps?.length ?? 0,
      windows_count: windows?.length ?? 0,
    })
    if (publicationErrors.length) return reviewerError('Publication dossier is incomplete: ' + publicationErrors.join(' '), 422)
    const deadlineSensitive = (windows ?? []).some(window => ['fixed', 'call_for_applications'].includes(window.window_type))
    if (isStale(version.last_verified_at, deadlineSensitive ? 'deadline_sensitive' : 'rolling')) {
      return reviewerError('This record is stale and must be re-verified before publication.', 422)
    }

    if (!rules?.length || rules.some(rule => !rule.reviewed)) {
      return reviewerError('Eligibility rules must be explicitly reviewed before publication.', 422)
    }
    if (!(sources ?? []).some(source => source.source_registry_id && isPrimaryOfficialSource(source))) {
      return reviewerError('At least one primary official source linked to the registered source registry with a precise HTTPS source anchor is required.', 422)
    }
    publicationStatus = publicationStatusForWindows(windows ?? []) as 'active' | 'upcoming' | 'closed'
  }

  const { data: decision, error: decisionError } = await supabase.rpc('apply_catalog_review_decision', {
    p_task_id: taskId,
    p_action: action,
    p_notes: notes?.trim() || null,
    p_publication_status: publicationStatus,
  })
  if (decisionError) return reviewerError('Unable to apply the catalog review decision: ' + decisionError.message, 500)

  const result = (decision ?? {}) as { status?: string; publication_status?: string | null }
  return NextResponse.json({ ok: true, status: result.status ?? 'in_review', publicationStatus: result.publication_status ?? publicationStatus })
}
