'use client'

import { useState } from 'react'
import { CalendarClock, Check, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const taskStatuses = ['todo', 'in_progress', 'blocked', 'done'] as const
type TaskStatus = typeof taskStatuses[number]
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

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  due_date: string | null
  owner_id?: string | null
  depends_on_task_ids?: string[] | null
  completed_at?: string | null
}

function normalizeTaskStatus(status: string): TaskStatus {
  return taskStatuses.includes(status as TaskStatus) ? status as TaskStatus : 'todo'
}

function normalizeApplicationStatus(status: string): ApplicationStatus {
  return applicationStatuses.includes(status as ApplicationStatus) ? status as ApplicationStatus : 'started'
}

function titleCase(value: string) {
  return value.replaceAll('_', ' ').replace(/\b\w/g, character => character.toUpperCase())
}

export default function ApplicationWorkspaceControls({
  applicationId,
  initialStatus,
  initialTargetDate,
  initialTasks,
  currentUserId,
}: {
  applicationId: string
  initialStatus: string
  initialTargetDate: string | null
  initialTasks: Task[]
  currentUserId: string
}) {
  const [status, setStatus] = useState<ApplicationStatus>(normalizeApplicationStatus(initialStatus))
  const [targetDate, setTargetDate] = useState(initialTargetDate ?? '')
  const [tasks, setTasks] = useState(() => initialTasks.map(task => ({ ...task, status: normalizeTaskStatus(task.status) })))
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null)

  async function saveApplication() {
    setSavingStatus(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, targetDate: targetDate || null, note: `Workspace moved the application to ${titleCase(status)}.` }),
      })
      const payload = await response.json().catch(() => ({})) as { data?: { status: string; target_date: string | null }; error?: string }
      if (!response.ok || !payload.data) throw new Error(payload.error ?? 'Unable to save application changes')
      setStatus(normalizeApplicationStatus(payload.data.status))
      setTargetDate(payload.data.target_date ?? '')
      toast.success('Application workspace updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save application changes')
    } finally {
      setSavingStatus(false)
    }
  }

  async function saveTask(task: Task & { status: TaskStatus }) {
    setSavingTaskId(task.id)
    try {
      const response = await fetch(`/api/applications/${applicationId}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: task.status, dueDate: task.due_date || null, ownerId: task.owner_id ?? null }),
      })
      const payload = await response.json().catch(() => ({})) as { data?: Task; error?: string }
      if (!response.ok || !payload.data) throw new Error(payload.error ?? 'Unable to save task changes')
      setTasks(previous => previous.map(item => item.id === task.id ? { ...item, status: normalizeTaskStatus(payload.data!.status), due_date: payload.data!.due_date, owner_id: payload.data!.owner_id, depends_on_task_ids: payload.data!.depends_on_task_ids } : item))
      toast.success('Task updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save task changes')
    } finally {
      setSavingTaskId(null)
    }
  }

  const nextStatuses = allowedTransitions[status]

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="min-w-[180px] flex-1 text-[11px] font-semibold text-slate-600">Application status<select value={status} onChange={event => setStatus(normalizeApplicationStatus(event.target.value))} disabled={savingStatus} className="mt-1 w-full rounded-lg border border-violet-200 bg-white px-2.5 py-2 text-xs text-slate-700"><option value={status}>{titleCase(status)} (current)</option>{nextStatuses.map(nextStatus => <option key={nextStatus} value={nextStatus}>{titleCase(nextStatus)}</option>)}</select></label>
          <label className="min-w-[160px] flex-1 text-[11px] font-semibold text-slate-600"><span className="inline-flex items-center gap-1"><CalendarClock size={12} /> Target date</span><input type="date" value={targetDate} onChange={event => setTargetDate(event.target.value)} disabled={savingStatus} className="mt-1 w-full rounded-lg border border-violet-200 bg-white px-2.5 py-2 text-xs text-slate-700" /></label>
          <button type="button" onClick={saveApplication} disabled={savingStatus} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50">{savingStatus ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save application</button>
        </div>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">Only valid status transitions are offered. The official portal remains the final submission channel.</p>
      </div>

      <div className="space-y-3">
        {tasks.length ? tasks.map(task => <div key={task.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
          <div className="flex flex-wrap items-start gap-3">
            <div className="flex-1"><div className="text-sm font-bold text-slate-800">{task.title}</div>{task.description ? <p className="mt-1 text-xs leading-5 text-slate-500">{task.description}</p> : null}</div>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${task.status === 'done' ? 'bg-emerald-50 text-emerald-700' : task.status === 'blocked' ? 'bg-red-50 text-red-700' : task.status === 'in_progress' ? 'bg-orange-50 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>{titleCase(task.status)}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="text-[11px] font-semibold text-slate-600">Status<select value={task.status} onChange={event => setTasks(previous => previous.map(item => item.id === task.id ? { ...item, status: normalizeTaskStatus(event.target.value) } : item))} disabled={savingTaskId === task.id} className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700">{taskStatuses.map(taskStatus => <option key={taskStatus} value={taskStatus}>{titleCase(taskStatus)}</option>)}</select></label>
            <label className="text-[11px] font-semibold text-slate-600">Due date<input type="date" value={task.due_date ?? ''} onChange={event => setTasks(previous => previous.map(item => item.id === task.id ? { ...item, due_date: event.target.value || null } : item))} disabled={savingTaskId === task.id} className="mt-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700" /></label>
            <button type="button" onClick={() => setTasks(previous => previous.map(item => item.id === task.id ? { ...item, owner_id: currentUserId } : item))} disabled={savingTaskId === task.id || task.owner_id === currentUserId} className="inline-flex h-9 items-center justify-center rounded-lg border border-violet-200 px-3 text-xs font-bold text-violet-700 hover:bg-violet-50 disabled:opacity-50">{task.owner_id === currentUserId ? 'Assigned to me' : 'Assign to me'}</button>
            <button type="button" onClick={() => saveTask(task)} disabled={savingTaskId === task.id} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 px-3 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50">{savingTaskId === task.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save task</button>
          </div>
          {task.depends_on_task_ids?.length ? <p className="mt-2 text-[11px] text-slate-400">Depends on {task.depends_on_task_ids.length} earlier task{task.depends_on_task_ids.length === 1 ? '' : 's'}.</p> : null}
        </div>) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No checklist tasks were generated for this opportunity version.</p>}
      </div>
    </div>
  )
}
