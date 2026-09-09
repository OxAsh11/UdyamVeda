import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { isPrimaryOfficialSource } from '@/lib/opportunities/editorial'

type RecordAction = 'archive' | 'create_revision'

const sourceKinds = new Set(['gazette', 'guideline', 'ministry', 'agency', 'myscheme', 'startup_india', 'pib', 'other'])

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function asPositiveInteger(value: unknown) {
  if (typeof value === 'number' && Number.isInteger(value) && value >= 1) return value
  if (typeof value === 'string' && /^\d+$/.test(value.trim()) && Number(value) >= 1) return Number(value)
  return null
}

function hashPayload(payload: unknown) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
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
    .from('opportunities')
    .select('id, slug, name, opportunity_type, status, current_version_id, updated_at, current_version:opportunity_versions!opportunities_current_version_fk(id, version_number, title, review_status, completeness, last_verified_at)')
    .order('updated_at', { ascending: false })
    .limit(200)
  if (error) return errorResponse('Unable to load catalog records.', 500)
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: {
    opportunityId?: string
    action?: RecordAction
    reason?: string
    patch?: Record<string, unknown>
    sources?: Array<Record<string, unknown>>
  }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.opportunityId || !body.action || !['archive', 'create_revision'].includes(body.action)) {
    return errorResponse('opportunityId and a valid action are required.', 400)
  }
  if (!body.reason?.trim()) return errorResponse('A reason is required for catalog record changes.', 422)

  const { data: opportunity, error: opportunityError } = await context.supabase
    .from('opportunities')
    .select('id, name, current_version_id, status')
    .eq('id', body.opportunityId)
    .maybeSingle()
  if (opportunityError) return errorResponse('Unable to load the catalog record.', 500)
  if (!opportunity) return errorResponse('Catalog record not found.', 404)

  if (body.action === 'archive') {
    const { error } = await context.supabase.from('opportunities').update({ status: 'archived' }).eq('id', opportunity.id)
    if (error) return errorResponse('Unable to archive the catalog record.', 500)
    await context.supabase.from('audit_logs').insert({
      actor_id: context.user.id,
      entity_type: 'opportunity',
      entity_id: opportunity.id,
      action: 'catalog_opportunity_archived',
      metadata: { reason: body.reason.trim(), previous_status: opportunity.status },
    })
    return NextResponse.json({ ok: true, status: 'archived' })
  }

  if (!opportunity.current_version_id) return errorResponse('A correction requires an existing current version.', 422)
  const sourceInputs = Array.isArray(body.sources) ? body.sources : []
  if (!sourceInputs.length) return errorResponse('A correction requires at least one fresh official source.', 422)
  const sources = sourceInputs.flatMap(source => {
    const sourceUrl = asString(source.source_url) ?? asString(source.url)
    const kind = asString(source.source_kind) ?? asString(source.kind)
    if (!sourceUrl || !/^https:\/\//i.test(sourceUrl) || !kind || !sourceKinds.has(kind)) return []
    return [{
      source_url: sourceUrl,
      source_kind: kind,
      source_title: asString(source.source_title) ?? asString(source.title),
      source_anchor: asString(source.source_anchor) ?? asString(source.anchor),
      page_number: asPositiveInteger(source.page_number ?? source.pageNumber),
      section: asString(source.section),
      paragraph: asString(source.paragraph),
      document_anchor: asString(source.document_anchor ?? source.documentAnchor),
      is_primary: source.is_primary === true,
    }]
  })
  if (!sources.length || !sources.some(source => isPrimaryOfficialSource(source))) {
    return errorResponse('A correction requires a primary official source with a precise HTTPS source anchor.', 422)
  }

  const { data: current, error: currentError } = await context.supabase
    .from('opportunity_versions')
    .select('*')
    .eq('id', opportunity.current_version_id)
    .maybeSingle()
  if (currentError) return errorResponse('Unable to load the current opportunity version.', 500)
  if (!current) return errorResponse('Current opportunity version not found.', 404)

  const [benefitsResult, requirementsResult, stepsResult, windowsResult] = await Promise.all([
    context.supabase.from('opportunity_benefits').select('benefit_type, label, amount_min, amount_max, currency, percentage, conditions').eq('opportunity_version_id', current.id),
    context.supabase.from('opportunity_requirements').select('requirement_type, name, description, required, accepted_formats, max_size_mb').eq('opportunity_version_id', current.id),
    context.supabase.from('opportunity_steps').select('step_number, title, description, official_url, expected_days, depends_on').eq('opportunity_version_id', current.id),
    context.supabase.from('opportunity_windows').select('window_type, opens_at, closes_at, label, source_evidence').eq('opportunity_version_id', current.id),
  ])
  if (benefitsResult.error || requirementsResult.error || stepsResult.error || windowsResult.error) {
    return errorResponse('Unable to load the current version details for correction.', 500)
  }

  const { data: latestVersion } = await context.supabase
    .from('opportunity_versions')
    .select('version_number')
    .eq('opportunity_id', opportunity.id)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()
  const patch = asRecord(body.patch)
  const nextVersion = Number(latestVersion?.version_number ?? current.version_number) + 1
  const nextVersionPayload = {
    opportunity_id: opportunity.id,
    version_number: nextVersion,
    title: asString(patch.title) ?? current.title,
    summary: patch.summary === undefined ? current.summary : asString(patch.summary),
    objective: patch.objective === undefined ? current.objective : asString(patch.objective),
    legal_basis: patch.legal_basis === undefined ? current.legal_basis : asString(patch.legal_basis),
    eligibility: patch.eligibility && typeof patch.eligibility === 'object' ? patch.eligibility : current.eligibility,
    application: patch.application && typeof patch.application === 'object' ? patch.application : current.application,
    fine_print: patch.fine_print && typeof patch.fine_print === 'object' ? patch.fine_print : current.fine_print,
    benefit_summary: patch.benefit_summary && typeof patch.benefit_summary === 'object' ? patch.benefit_summary : current.benefit_summary,
    effective_from: asString(patch.effective_from) ?? current.effective_from,
    effective_to: asString(patch.effective_to) ?? current.effective_to,
    last_verified_at: new Date().toISOString(),
    completeness: typeof patch.completeness === 'number' ? patch.completeness : current.completeness,
    confidence: typeof patch.confidence === 'number' ? patch.confidence : current.confidence,
    content_hash: hashPayload({ patch, sources, reason: body.reason.trim() }),
    review_status: 'in_review',
  }
  const { data: revision, error: revisionError } = await context.supabase.from('opportunity_versions').insert(nextVersionPayload).select('id').single()
  if (revisionError || !revision) return errorResponse('Unable to create the corrected opportunity version.', 500)

  const rollback = async () => {
    await context.supabase.from('opportunity_versions').delete().eq('id', revision.id)
  }
  const { error: sourceError } = await context.supabase.from('opportunity_sources').insert(sources.map(source => ({ ...source, opportunity_version_id: revision.id })))
  if (sourceError) {
    await rollback()
    return errorResponse('Unable to attach correction sources.', 500)
  }

  const benefitRows = (benefitsResult.data ?? []).map(benefit => ({ ...benefit, opportunity_version_id: revision.id }))
  if (benefitRows.length) {
    const { error } = await context.supabase.from('opportunity_benefits').insert(benefitRows)
    if (error) {
      await rollback()
      return errorResponse('Unable to carry forward correction benefits.', 500)
    }
  }
  const requirementRows = (requirementsResult.data ?? []).map(requirement => ({ ...requirement, opportunity_version_id: revision.id }))
  if (requirementRows.length) {
    const { error } = await context.supabase.from('opportunity_requirements').insert(requirementRows)
    if (error) {
      await rollback()
      return errorResponse('Unable to carry forward correction requirements.', 500)
    }
  }
  const stepRows = (stepsResult.data ?? []).map(step => ({ ...step, opportunity_version_id: revision.id }))
  if (stepRows.length) {
    const { error } = await context.supabase.from('opportunity_steps').insert(stepRows)
    if (error) {
      await rollback()
      return errorResponse('Unable to carry forward correction steps.', 500)
    }
  }
  const windowRows = (windowsResult.data ?? []).map(window => ({ ...window, opportunity_version_id: revision.id }))
  if (windowRows.length) {
    const { error } = await context.supabase.from('opportunity_windows').insert(windowRows)
    if (error) {
      await rollback()
      return errorResponse('Unable to carry forward correction windows.', 500)
    }
  }

  const { data: existingRules } = await context.supabase.from('eligibility_rule_sets').select('rules, rule_version, source_evidence').eq('opportunity_version_id', current.id).limit(1).maybeSingle()
  const { error: rulesError } = await context.supabase.from('eligibility_rule_sets').insert({
    opportunity_version_id: revision.id,
    rules: nextVersionPayload.eligibility,
    rule_version: existingRules?.rule_version ?? '1.0',
    source_evidence: sources,
    reviewed: false,
  })
  if (rulesError) {
    await rollback()
    return errorResponse('Unable to create the corrected eligibility rule set.', 500)
  }

  const { error: taskError } = await context.supabase.from('review_tasks').insert({ opportunity_version_id: revision.id, task_type: 'publish', status: 'open' })
  if (taskError) {
    await rollback()
    return errorResponse('Unable to create the correction review task.', 500)
  }
  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'opportunity_version',
    entity_id: revision.id,
    action: 'catalog_opportunity_correction_created',
    metadata: { opportunity_id: opportunity.id, previous_version_id: current.id, reason: body.reason.trim() },
  })
  return NextResponse.json({ ok: true, status: 'in_review', versionId: revision.id }, { status: 201 })
}
