import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

type RouteContext = { params: Promise<{ id: string }> }

const applicationStatuses = ['started', 'ready', 'submitted', 'under_review', 'approved', 'rejected', 'withdrawn'] as const
type ApplicationStatus = typeof applicationStatuses[number]

const allowedTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  started: ['ready', 'submitted', 'withdrawn'],
  ready: ['started', 'submitted', 'withdrawn'],
  submitted: ['under_review', 'approved', 'rejected', 'withdrawn'],
  under_review: ['approved', 'rejected', 'withdrawn'],
  approved: [],
  rejected: ['submitted', 'withdrawn'],
  withdrawn: ['started'],
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === 'string' && applicationStatuses.includes(value as ApplicationStatus)
}

async function getAuthorizedApplication(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, business: null, application: null, error: 'Authentication required' }

  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return { supabase, user, business: null, application: null, error: 'Unable to load the active business.' }
  if (!business) return { supabase, user, business: null, application: null, error: null }

  const { data: application, error } = await supabase
    .from('applications')
    .select('id, business_id, opportunity_id, opportunity_version_id, status, eligibility_snapshot, official_portal_url, target_date, created_at, updated_at, opportunity:opportunities(name, slug)')
    .eq('id', id)
    .eq('business_id', business.id)
    .maybeSingle()

  if (error) return { supabase, user, business, application: null, error: 'Unable to load the application.' }
  return { supabase, user, business, application, error: null }
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const result = await getAuthorizedApplication(id)
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business || !result.application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const [{ data: tasks, error: tasksError }, { data: statusEvents, error: eventsError }, { data: documentLinks, error: linksError }] = await Promise.all([
    result.supabase
      .from('application_tasks')
      .select('id, title, description, status, due_date, owner_id, depends_on_task_ids, sort_order, created_at, completed_at')
      .eq('application_id', result.application.id)
      .order('sort_order'),
    result.supabase
      .from('application_status_events')
      .select('id, from_status, to_status, note, created_at, actor_id')
      .eq('application_id', result.application.id)
      .order('created_at', { ascending: false }),
    result.supabase
      .from('application_document_links')
      .select('id, status, reviewer_note, created_at, business_document:business_documents(id, file_name, mime_type, size_bytes, expires_at, scan_status), opportunity_requirement:opportunity_requirements(id, name)')
      .eq('application_id', result.application.id)
      .order('created_at', { ascending: false }),
  ])

  if (tasksError || eventsError || linksError) {
    return NextResponse.json({ error: 'Unable to load the application workspace.' }, { status: 500 })
  }

  return NextResponse.json({ data: { application: result.application, tasks: tasks ?? [], statusEvents: statusEvents ?? [], documentLinks: documentLinks ?? [] } })
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const result = await getAuthorizedApplication(id)
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business || !result.application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const body = await request.json().catch(() => ({})) as { status?: unknown; targetDate?: unknown; note?: unknown }
  const hasStatus = body.status !== undefined
  const hasTargetDate = body.targetDate !== undefined
  if (!hasStatus && !hasTargetDate) return NextResponse.json({ error: 'Provide a status or targetDate to update.' }, { status: 400 })

  if (hasStatus && !isApplicationStatus(body.status)) {
    return NextResponse.json({ error: 'Invalid application status.' }, { status: 400 })
  }
  if (hasTargetDate && body.targetDate !== null && (typeof body.targetDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.targetDate))) {
    return NextResponse.json({ error: 'targetDate must be YYYY-MM-DD or null.' }, { status: 400 })
  }

  const nextStatus = hasStatus ? body.status as ApplicationStatus : result.application.status as ApplicationStatus
  if (hasStatus && nextStatus !== result.application.status && !allowedTransitions[result.application.status as ApplicationStatus]?.includes(nextStatus)) {
    return NextResponse.json({ error: `Cannot move an application from ${result.application.status} to ${nextStatus}.` }, { status: 422 })
  }

  const update: Record<string, string | null> = {}
  if (hasStatus) update.status = nextStatus
  if (hasTargetDate) update.target_date = body.targetDate === null ? null : body.targetDate as string

  const { data: updated, error: updateError } = await result.supabase
    .from('applications')
    .update(update)
    .eq('id', result.application.id)
    .eq('business_id', result.business.id)
    .select('id, opportunity_id, opportunity_version_id, status, eligibility_snapshot, official_portal_url, target_date, created_at, updated_at')
    .single()

  if (updateError || !updated) return NextResponse.json({ error: 'Unable to update the application.', detail: updateError?.message }, { status: 500 })

  if (hasStatus && nextStatus !== result.application.status) {
    const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim() : 'Application status updated from the workspace.'
    const { error: eventError } = await result.supabase.from('application_status_events').insert({
      application_id: result.application.id,
      from_status: result.application.status,
      to_status: nextStatus,
      actor_id: result.user.id,
      note,
    })
    if (eventError) {
      await result.supabase.from('applications').update({ status: result.application.status }).eq('id', result.application.id).eq('business_id', result.business.id)
      return NextResponse.json({ error: 'Unable to record the application status history.', detail: eventError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ data: updated })
}
