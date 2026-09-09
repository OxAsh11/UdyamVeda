import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

type RouteContext = { params: Promise<{ id: string; taskId: string }> }
const taskStatuses = ['todo', 'in_progress', 'blocked', 'done'] as const

function isTaskStatus(value: unknown): value is typeof taskStatuses[number] {
  return typeof value === 'string' && taskStatuses.includes(value as typeof taskStatuses[number])
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id, taskId } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

  const { data: task, error: taskError } = await supabase
    .from('application_tasks')
    .select('id, application_id, status, due_date, owner_id, completed_at')
    .eq('id', taskId)
    .eq('application_id', id)
    .maybeSingle()
  if (taskError) return NextResponse.json({ error: 'Unable to load the task.' }, { status: 500 })
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  const { data: application } = await supabase.from('applications').select('id').eq('id', id).eq('business_id', business.id).maybeSingle()
  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const body = await request.json().catch(() => ({})) as { status?: unknown; dueDate?: unknown; ownerId?: unknown }
  if (body.status === undefined && body.dueDate === undefined && body.ownerId === undefined) return NextResponse.json({ error: 'Provide a status, dueDate, or ownerId to update.' }, { status: 400 })
  if (body.status !== undefined && !isTaskStatus(body.status)) return NextResponse.json({ error: 'Invalid task status.' }, { status: 400 })
  if (body.dueDate !== undefined && body.dueDate !== null && (typeof body.dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.dueDate))) {
    return NextResponse.json({ error: 'dueDate must be YYYY-MM-DD or null.' }, { status: 400 })
  }
  if (body.ownerId !== undefined && body.ownerId !== null && typeof body.ownerId !== 'string') {
    return NextResponse.json({ error: 'ownerId must be a business member or null.' }, { status: 400 })
  }

  if (typeof body.ownerId === 'string') {
    const { data: membership, error: membershipError } = await supabase
      .from('business_memberships')
      .select('user_id')
      .eq('business_id', business.id)
      .eq('user_id', body.ownerId)
      .maybeSingle()
    if (membershipError) return NextResponse.json({ error: 'Unable to verify the task owner.' }, { status: 500 })
    if (!membership) return NextResponse.json({ error: 'Task owner must be a member of this business.' }, { status: 422 })
  }

  const update: Record<string, unknown> = {}
  if (body.status !== undefined) {
    update.status = body.status as string
    update.completed_at = body.status === 'done' ? new Date().toISOString() : null
  }
  if (body.dueDate !== undefined) update.due_date = body.dueDate === null ? null : body.dueDate as string
  if (body.ownerId !== undefined) update.owner_id = body.ownerId === null ? null : body.ownerId as string

  const { data: updated, error: updateError } = await supabase
    .from('application_tasks')
    .update(update)
    .eq('id', task.id)
    .eq('application_id', application.id)
    .select('id, application_id, title, description, status, due_date, owner_id, depends_on_task_ids, sort_order, created_at, completed_at')
    .single()

  if (updateError || !updated) return NextResponse.json({ error: 'Unable to update the task.', detail: updateError?.message }, { status: 500 })
  if (body.status !== undefined && body.status !== task.status) {
    const { error: eventError } = await supabase.from('application_task_status_events').insert({
      task_id: task.id,
      from_status: task.status,
      to_status: body.status as string,
      actor_id: user.id,
      note: 'Task status updated from the application workspace.',
    })
    if (eventError) {
      await supabase.from('application_tasks').update({ status: task.status, completed_at: task.completed_at }).eq('id', task.id)
      return NextResponse.json({ error: 'Unable to record task status history.', detail: eventError.message }, { status: 500 })
    }
  }
  return NextResponse.json({ data: updated })
}
