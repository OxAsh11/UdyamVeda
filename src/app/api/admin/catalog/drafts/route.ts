import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { validateOpportunityDraft, type ExtractedOpportunityDraft } from '@/lib/opportunities/validation'

type DraftAction = 'promote' | 'reject'

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

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'government-opportunity'
}

const sourceKinds = new Set(['gazette', 'guideline', 'ministry', 'agency', 'myscheme', 'startup_india', 'pib', 'other'])
const benefitTypes = new Set(['grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement', 'recognition', 'training', 'market_access', 'mentorship', 'compliance', 'equity_investment'])
const requirementTypes = new Set(['document', 'registration', 'declaration', 'financial', 'other'])
const windowTypes = new Set(['rolling', 'annual', 'fixed', 'call_for_applications', 'closed'])

function dateValue(value: unknown) {
  const text = asString(value)
  if (!text) return null
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? null : text.slice(0, 10)
}

function windowRowsFor(value: unknown) {
  const candidates = Array.isArray(value) ? value : [value]
  return candidates.flatMap(candidate => {
    const dates = asRecord(candidate)
    const status = asString(dates.status)
    const windowType = asString(dates.window_type) ?? (status === 'rolling' ? 'rolling' : null)
    if (!windowType || !windowTypes.has(windowType)) return []
    const evidence = dates.source_evidence ?? dates.window_evidence
    return [{
      window_type: windowType,
      opens_at: dateValue(dates.opens_at),
      closes_at: dateValue(dates.closes_at),
      label: asString(dates.label) ?? asString(dates.window_label) ?? asString(dates.reason),
      source_evidence: evidence && typeof evidence === 'object' ? evidence : {},
    }]
  })
}

async function rollbackOpportunity(supabase: SupabaseClient, opportunityId: string) {
  await supabase.from('opportunities').delete().eq('id', opportunityId)
}

export async function GET() {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const { data, error } = await context.supabase
    .from('opportunity_drafts')
    .select('id, payload, completeness, validation_errors, validation_warnings, extraction_model, status, created_at, promoted_opportunity_id, promoted_version_id, source_snapshot:source_snapshots(source_registry_id, content_hash, created_at)')
    .in('status', ['draft', 'validated', 'needs_review'])
    .order('created_at', { ascending: true })

  if (error) return errorResponse('Unable to load extracted drafts.', 500)
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { draftId?: string; action?: DraftAction; notes?: string }
  try {
    body = await request.json() as { draftId?: string; action?: DraftAction; notes?: string }
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.draftId || !body.action || !['promote', 'reject'].includes(body.action)) {
    return errorResponse('draftId and a valid action are required.', 400)
  }

  const { data: draft, error: draftError } = await context.supabase
    .from('opportunity_drafts')
    .select('id, payload, completeness, status, promoted_version_id, source_snapshot_id, ingestion_run_id, source_snapshot:source_snapshots(source_registry_id, content_hash, created_at)')
    .eq('id', body.draftId)
    .maybeSingle()
  if (draftError) return errorResponse('Unable to load the extracted draft.', 500)
  if (!draft) return errorResponse('Extracted draft not found.', 404)
  if (draft.promoted_version_id) return errorResponse('This draft has already been promoted.', 409)
  if (!['draft', 'validated', 'needs_review'].includes(draft.status)) return errorResponse('This draft is no longer actionable.', 409)

  if (body.action === 'reject') {
    const { error } = await context.supabase.from('opportunity_drafts').update({
      status: 'rejected',
      validation_warnings: [body.notes?.trim() || 'Rejected during editorial review'],
    }).eq('id', draft.id)
    if (error) return errorResponse('Unable to reject the draft.', 500)
    return NextResponse.json({ ok: true, status: 'rejected' })
  }

  const payload = asRecord(draft.payload) as ExtractedOpportunityDraft
  const validation = validateOpportunityDraft(payload)
  if (validation.errors.length) return errorResponse('The draft has blocking validation errors and cannot be promoted.', 422)

  const authorityValue = asRecord(payload.authority)
  const authorityName = asString(payload.authority) ?? asString(authorityValue.name)
  if (!authorityName) return errorResponse('The draft has no identifiable implementing authority.', 422)

  let authorityId: string | null = null
  const { data: existingAuthority } = await context.supabase.from('authorities').select('id').eq('name', authorityName).limit(1).maybeSingle()
  if (existingAuthority) {
    authorityId = existingAuthority.id
  } else {
    const { data: newAuthority, error: authorityError } = await context.supabase.from('authorities').insert({
      name: authorityName,
      level: 'central',
      official_url: asString(authorityValue.official_url),
    }).select('id').single()
    if (authorityError || !newAuthority) return errorResponse('Unable to create the authority record.', 500)
    authorityId = newAuthority.id
  }

  const title = asString(payload.name) ?? 'Untitled Government opportunity'
  const baseSlug = slugify(title)
  const { data: slugConflict } = await context.supabase.from('opportunities').select('id').eq('slug', baseSlug).maybeSingle()
  const slug = slugConflict ? baseSlug + '-' + draft.id.slice(0, 8) : baseSlug
  const application = asRecord(payload.application)
  const geography = asRecord(payload.geography)
  const { data: opportunity, error: opportunityError } = await context.supabase.from('opportunities').insert({
    slug,
    name: title,
    opportunity_type: asString(payload.opportunity_type) ?? 'scheme',
    status: 'in_review',
    authority_id: authorityId,
    geography: Object.keys(geography).length ? geography : { coverage: 'central', locations: ['India'] },
    canonical_url: asString(application.portal) ?? asString(application.official_url),
  }).select('id').single()
  if (opportunityError || !opportunity) return errorResponse('Unable to create the opportunity record.', 500)

  const snapshot = Array.isArray(draft.source_snapshot) ? draft.source_snapshot[0] : draft.source_snapshot
  const sourceRecords = Array.isArray(payload.sources) ? payload.sources as Array<Record<string, unknown>> : []
  const { data: version, error: versionError } = await context.supabase.from('opportunity_versions').insert({
    opportunity_id: opportunity.id,
    version_number: 1,
    title,
    summary: asString(payload.summary) ?? asString(payload.objective),
    objective: asString(payload.objective),
    legal_basis: asString(payload.legal_basis),
    eligibility: payload.eligibility ?? {},
    application,
    fine_print: payload.fine_print ?? {},
    benefit_summary: payload.benefit_summary ?? {},
    completeness: validation.completeness,
    confidence: 0.5,
    content_hash: snapshot?.content_hash ?? null,
    review_status: 'in_review',
  }).select('id').single()
  if (versionError || !version) {
    await rollbackOpportunity(context.supabase, opportunity.id)
    return errorResponse('Unable to create the opportunity version.', 500)
  }
  const { error: currentVersionError } = await context.supabase.from('opportunities').update({ current_version_id: version.id }).eq('id', opportunity.id)
  if (currentVersionError) {
    await rollbackOpportunity(context.supabase, opportunity.id)
    return errorResponse('Unable to link the current opportunity version.', 500)
  }

  const sourceRows = sourceRecords.flatMap((source, index) => {
    const url = asString(source.url)
    if (!url || !/^https:\/\//i.test(url)) return []
    return [{
      opportunity_version_id: version.id,
      source_url: url,
      source_kind: sourceKinds.has(String(source.kind)) ? String(source.kind) : 'other',
      source_title: asString(source.title),
      source_anchor: asString(source.anchor),
      is_primary: index === 0 || source.is_primary === true,
      content_hash: snapshot?.content_hash ?? null,
    }]
  })
  if (sourceRows.length) {
    const { error } = await context.supabase.from('opportunity_sources').insert(sourceRows)
    if (error) {
      await rollbackOpportunity(context.supabase, opportunity.id)
      return errorResponse('Unable to persist opportunity sources.', 500)
    }
  }

  const benefitRows = (Array.isArray(payload.benefits) ? payload.benefits : []).flatMap(value => {
    const benefit = asRecord(value)
    const label = asString(benefit.label)
    if (!label) return []
    return [{
      opportunity_version_id: version.id,
      benefit_type: benefitTypes.has(String(benefit.type)) ? String(benefit.type) : 'recognition',
      label,
      amount_min: typeof benefit.amount_min === 'number' ? benefit.amount_min : null,
      amount_max: typeof benefit.amount_max === 'number' ? benefit.amount_max : null,
      percentage: typeof benefit.percentage === 'number' ? benefit.percentage : null,
      conditions: asRecord(benefit.conditions),
    }]
  })
  if (benefitRows.length) {
    const { error } = await context.supabase.from('opportunity_benefits').insert(benefitRows)
    if (error) {
      await rollbackOpportunity(context.supabase, opportunity.id)
      return errorResponse('Unable to persist opportunity benefits.', 500)
    }
  }

  const requirementRows = (Array.isArray(payload.requirements) ? payload.requirements : []).flatMap(value => {
    const requirement = asRecord(value)
    const name = asString(requirement.name)
    if (!name) return []
    return [{
      opportunity_version_id: version.id,
      requirement_type: requirementTypes.has(String(requirement.type)) ? String(requirement.type) : 'other',
      name,
      description: asString(requirement.description),
      required: requirement.required !== false,
      accepted_formats: Array.isArray(requirement.accepted_formats) ? requirement.accepted_formats.filter((item): item is string => typeof item === 'string') : [],
      max_size_mb: typeof requirement.max_size_mb === 'number' ? requirement.max_size_mb : null,
    }]
  })
  if (requirementRows.length) {
    const { error } = await context.supabase.from('opportunity_requirements').insert(requirementRows)
    if (error) {
      await rollbackOpportunity(context.supabase, opportunity.id)
      return errorResponse('Unable to persist opportunity requirements.', 500)
    }
  }

  const stepRows = (Array.isArray(payload.steps) ? payload.steps : []).flatMap((value, index) => {
    const step = asRecord(value)
    const stepTitle = asString(step.title)
    if (!stepTitle) return []
    return [{
      opportunity_version_id: version.id,
      step_number: typeof step.number === 'number' ? step.number : index + 1,
      title: stepTitle,
      description: asString(step.description),
      official_url: asString(step.official_url),
      expected_days: typeof step.expected_days === 'number' ? step.expected_days : null,
      depends_on: Array.isArray(step.depends_on) ? step.depends_on.filter((item): item is number => typeof item === 'number') : [],
    }]
  })
  if (stepRows.length) {
    const { error } = await context.supabase.from('opportunity_steps').insert(stepRows)
    if (error) {
      await rollbackOpportunity(context.supabase, opportunity.id)
      return errorResponse('Unable to persist opportunity steps.', 500)
    }
  }

  const windowRows = windowRowsFor(payload.effective_dates).map(window => ({
    opportunity_version_id: version.id,
    ...window,
  }))
  if (windowRows.length) {
    const { error } = await context.supabase.from('opportunity_windows').insert(windowRows)
    if (error) {
      await rollbackOpportunity(context.supabase, opportunity.id)
      return errorResponse('Unable to persist opportunity windows.', 500)
    }
  }

  const { error: rulesError } = await context.supabase.from('eligibility_rule_sets').insert({
    opportunity_version_id: version.id,
    rules: payload.eligibility ?? {},
    source_evidence: sourceRecords,
    reviewed: false,
  })
  if (rulesError) {
    await rollbackOpportunity(context.supabase, opportunity.id)
    return errorResponse('Unable to persist the eligibility rule set.', 500)
  }
  const { error: taskError } = await context.supabase.from('review_tasks').insert({
    opportunity_version_id: version.id,
    ingestion_run_id: draft.ingestion_run_id,
    task_type: 'publish',
    status: 'open',
  })
  if (taskError) {
    await rollbackOpportunity(context.supabase, opportunity.id)
    return errorResponse('Unable to create the publish review task.', 500)
  }
  const { error: draftUpdateError } = await context.supabase.from('opportunity_drafts').update({
    status: 'promoted',
    promoted_opportunity_id: opportunity.id,
    promoted_version_id: version.id,
  }).eq('id', draft.id)
  if (draftUpdateError) {
    await rollbackOpportunity(context.supabase, opportunity.id)
    return errorResponse('Unable to mark the draft as promoted.', 500)
  }
  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'opportunity_draft',
    entity_id: draft.id,
    action: 'catalog_draft_promoted',
    metadata: { opportunity_id: opportunity.id, opportunity_version_id: version.id, notes: body.notes?.trim() || null },
  })

  return NextResponse.json({ ok: true, status: 'promoted', opportunityId: opportunity.id, versionId: version.id })
}
