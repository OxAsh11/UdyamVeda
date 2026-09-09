import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { profileFromBusinessFacts } from '@/lib/businesses/profile'
import { evaluateEligibilityRules } from '@/lib/opportunities/rules'

type ApplicationRequest = {
  businessId?: string
  opportunityId?: string
}

function statusFor(result: boolean | null) {
  if (result === true) return 'eligible'
  if (result === false) return 'not_eligible'
  return 'needs_information'
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.', detail: businessError.message }, { status: 500 })
  if (!business) return NextResponse.json({ data: [] })

  const { data, error } = await supabase
    .from('applications')
    .select('id, opportunity_id, opportunity_version_id, status, official_portal_url, target_date, created_at, updated_at, opportunity:opportunities(name, slug)')
    .eq('business_id', business.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ data: [], setupRequired: true })

  const applicationIds = (data ?? []).map(item => item.id)
  const { data: tasks, error: tasksError } = applicationIds.length
    ? await supabase.from('application_tasks').select('id, application_id, title, status, due_date, owner_id, depends_on_task_ids, sort_order, completed_at').in('application_id', applicationIds).order('sort_order')
    : { data: [], error: null }
  if (tasksError) return NextResponse.json({ data: [], setupRequired: true })

  const tasksByApplication = new Map<string, typeof tasks>()
  for (const task of tasks ?? []) {
    const existing = tasksByApplication.get(task.application_id) ?? []
    existing.push(task)
    tasksByApplication.set(task.application_id, existing)
  }
  return NextResponse.json({ data: (data ?? []).map(item => ({ ...item, tasks: tasksByApplication.get(item.id) ?? [] })) })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as ApplicationRequest
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id, body.businessId)
  if (businessError) return NextResponse.json({ error: 'Unable to load the selected business.', detail: businessError.message }, { status: 500 })
  if (!business || !body.opportunityId) {
    return NextResponse.json({ error: 'A valid business and opportunityId are required' }, { status: 400 })
  }

  const opportunityQuery = isUuid(body.opportunityId)
    ? supabase.from('opportunities').select('id, slug, name, status, current_version_id, canonical_url').eq('id', body.opportunityId).maybeSingle()
    : supabase.from('opportunities').select('id, slug, name, status, current_version_id, canonical_url').eq('slug', body.opportunityId).maybeSingle()
  const { data: opportunity, error: opportunityError } = await opportunityQuery
  if (opportunityError) return NextResponse.json({ error: 'Unable to load the opportunity.', detail: opportunityError.message }, { status: 500 })
  if (!opportunity || !['active', 'upcoming'].includes(opportunity.status) || !opportunity.current_version_id) {
    return NextResponse.json({ error: 'Only approved active or upcoming opportunities can start an application.' }, { status: 422 })
  }

  const { data: version, error: versionError } = await supabase
    .from('opportunity_versions')
    .select('id, version_number, application, review_status')
    .eq('id', opportunity.current_version_id)
    .eq('review_status', 'approved')
    .maybeSingle()
  if (versionError) return NextResponse.json({ error: 'Unable to load the approved opportunity version.', detail: versionError.message }, { status: 500 })
  if (!version) return NextResponse.json({ error: 'The opportunity has no approved version.' }, { status: 422 })

  const { data: existingApplication, error: existingApplicationError } = await supabase
    .from('applications')
    .select('id, opportunity_id, opportunity_version_id, status, official_portal_url, created_at')
    .eq('business_id', business.id)
    .eq('opportunity_id', opportunity.id)
    .neq('status', 'withdrawn')
    .maybeSingle()
  if (existingApplicationError) return NextResponse.json({ error: 'Unable to check the existing application.', detail: existingApplicationError.message }, { status: 500 })
  if (existingApplication) return NextResponse.json({ data: existingApplication, existing: true })

  const [{ data: facts, error: factsError }, { data: ruleSet, error: rulesError }, { data: steps, error: stepsError }, { data: requirements, error: requirementsError }] = await Promise.all([
    getBusinessFacts(supabase, business.id),
    supabase.from('eligibility_rule_sets').select('rules, reviewed').eq('opportunity_version_id', version.id).maybeSingle(),
    supabase.from('opportunity_steps').select('step_number, title, description, expected_days, depends_on').eq('opportunity_version_id', version.id).order('step_number'),
    supabase.from('opportunity_requirements').select('name, description, required').eq('opportunity_version_id', version.id).eq('required', true),
  ])
  if (factsError || rulesError || stepsError || requirementsError) {
    return NextResponse.json({ error: 'Unable to load the application checklist and eligibility evidence.' }, { status: 500 })
  }
  if (!ruleSet?.reviewed) return NextResponse.json({ error: 'Eligibility rules for this opportunity are not yet reviewed.' }, { status: 422 })

  const profile = profileFromBusinessFacts(business, facts ?? [])
  const evaluation = evaluateEligibilityRules(ruleSet.rules, {
    ...profile,
    lifecycle_stage: profile.stage,
    enterprise_stage: profile.stage,
    founder_category: profile.founder_type,
    industry: profile.sector,
    udyam_registered: profile.has_udyam,
    dpiit_recognized: profile.has_dpiit,
  })
  const applicationDetails = version.application && typeof version.application === 'object' && !Array.isArray(version.application)
    ? version.application as Record<string, unknown>
    : {}
  const officialPortalUrl = typeof applicationDetails.portal === 'string' ? applicationDetails.portal : opportunity.canonical_url
  const eligibilitySnapshot = {
    catalog_version_id: version.id,
    catalog_version_number: version.version_number,
    evaluated_at: new Date().toISOString(),
    status: statusFor(evaluation.result),
    result: evaluation.result,
    reasons: evaluation.reasons,
    missing_facts: evaluation.missingFacts,
    blockers: evaluation.blockers,
    business_facts: profile,
  }

  const { data, error } = await supabase
    .from('applications')
    .insert({
      business_id: business.id,
      opportunity_id: opportunity.id,
      opportunity_version_id: version.id,
      official_portal_url: officialPortalUrl,
      eligibility_snapshot: eligibilitySnapshot,
    })
    .select('id, opportunity_id, opportunity_version_id, status, official_portal_url, created_at')
    .single()

  if (error || !data) return NextResponse.json({ error: 'Applications are not initialized yet. Apply the UdyamVeda migration first.', detail: error?.message }, { status: 503 })

  const taskRows = [
    ...(steps ?? []).map(step => ({
      application_id: data.id,
      title: step.title,
      description: step.description,
      status: 'todo',
      sort_order: step.step_number,
      owner_id: user.id,
      depends_on_task_ids: [],
    })),
    ...(requirements ?? []).map((requirement, index) => ({
      application_id: data.id,
      title: 'Prepare ' + requirement.name,
      description: requirement.description,
      status: 'todo',
      sort_order: 1000 + index,
      owner_id: user.id,
      depends_on_task_ids: [],
    })),
  ]
  if (taskRows.length) {
    const { data: insertedTasks, error: taskError } = await supabase.from('application_tasks').insert(taskRows).select('id, sort_order')
    if (taskError || !insertedTasks) {
      await supabase.from('applications').delete().eq('id', data.id)
      return NextResponse.json({ error: 'Unable to create the application checklist.', detail: taskError?.message }, { status: 500 })
    }

    const taskIdByStepNumber = new Map((insertedTasks ?? []).filter(task => task.sort_order < 1000).map(task => [task.sort_order, task.id]))
    const dependencyResults = await Promise.all((steps ?? []).map(step => {
      const taskId = taskIdByStepNumber.get(step.step_number)
      const dependencyNumbers = Array.isArray(step.depends_on) ? step.depends_on.filter((value): value is number => typeof value === 'number') : []
      const dependencyIds = dependencyNumbers.map(number => taskIdByStepNumber.get(number)).filter((value): value is string => Boolean(value))
      if (!taskId || !dependencyIds.length) return null
      return supabase.from('application_tasks').update({ depends_on_task_ids: dependencyIds }).eq('id', taskId)
    }))
    if (dependencyResults.some(result => result?.error)) {
      await supabase.from('applications').delete().eq('id', data.id)
      return NextResponse.json({ error: 'Unable to create the application task dependencies.' }, { status: 500 })
    }

    const { error: taskEventError } = await supabase.from('application_task_status_events').insert(
      (insertedTasks ?? []).map(task => ({
        task_id: task.id,
        from_status: null,
        to_status: 'todo',
        actor_id: user.id,
        note: 'Application task created from the approved opportunity workflow.',
      })),
    )
    if (taskEventError) {
      await supabase.from('applications').delete().eq('id', data.id)
      return NextResponse.json({ error: 'Unable to record the application task history.' }, { status: 500 })
    }
  }

  const { error: eventError } = await supabase.from('application_status_events').insert({
    application_id: data.id,
    from_status: null,
    to_status: 'started',
    actor_id: user.id,
    note: 'Application workspace created from an approved catalog version.',
  })
  if (eventError) {
    await supabase.from('applications').delete().eq('id', data.id)
    return NextResponse.json({ error: 'Unable to record the application status history.', detail: eventError.message }, { status: 500 })
  }

  const { error: savedError } = await supabase
    .from('saved_opportunities')
    .upsert({ business_id: business.id, opportunity_id: opportunity.id, status: 'started' }, { onConflict: 'business_id,opportunity_id' })
  if (savedError) {
    await supabase.from('applications').delete().eq('id', data.id)
    return NextResponse.json({ error: 'Unable to link the application to the opportunity workspace.', detail: savedError.message }, { status: 503 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
