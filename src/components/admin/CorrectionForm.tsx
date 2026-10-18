'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { isInternalNote } from '@/lib/opportunities/display'

export type CorrectionInitial = {
  status: string
  officialUrl: string
  headline: string
  summary: string
  windowType: string
  opensAt: string
  closesAt: string
  windowNote: string
  route: string
  selection: string
  fees: string
  conditions: string
  exclusions: string
  internalNote: string
}

type Field = keyof CorrectionInitial

const WINDOW_TYPES: Array<[string, string]> = [
  ['rolling', 'Open year-round'],
  ['call_for_applications', 'Periodic calls for applications'],
  ['call_for_proposals', 'Periodic calls for proposals'],
  ['fixed', 'Fixed dates'],
  ['annual', 'Annual cycle'],
  ['recurring', 'Recurring intake'],
  ['partner_intake', 'Through partner institutions'],
  ['event', 'Event-based'],
  ['programme_route', 'Programme route'],
  ['static', 'See official portal'],
  ['closed', 'Closed'],
  ['closed_or_claim_only', 'Closed (claims only)'],
]

// Fields applicants read; flagged when they look like reviewer notes.
const PUBLIC_FIELDS: Field[] = ['headline', 'summary', 'windowNote', 'route', 'selection', 'fees', 'conditions', 'exclusions']

function splitLines(value: string) {
  return value.split('\n').map(line => line.trim()).filter(Boolean)
}

// Calendar day in India → timestamp at the start or end of that day (IST).
function istTimestamp(date: string, endOfDay: boolean) {
  return date ? `${date}T${endOfDay ? '23:59:59' : '00:00:00'}+05:30` : null
}

function buildChanges(initial: CorrectionInitial, form: CorrectionInitial) {
  const changed = (field: Field) => form[field].trim() !== initial[field].trim()
  const orNull = (value: string) => value.trim() || null
  const changes: Record<string, unknown> = {}

  if (changed('status')) changes.status = form.status
  if (changed('officialUrl')) changes.official_url = form.officialUrl.trim()
  if (changed('summary')) changes.summary = form.summary.trim()
  if (changed('headline')) changes.benefit_summary = { headline: orNull(form.headline) }

  const window: Record<string, unknown> = {}
  if (changed('windowType')) window.window_type = form.windowType
  if (changed('opensAt')) window.opens_at = istTimestamp(form.opensAt, false)
  if (changed('closesAt')) window.closes_at = istTimestamp(form.closesAt, true)
  if (Object.keys(window).length) changes.window = window

  const application: Record<string, unknown> = {}
  if (changed('windowNote')) application.window_note = orNull(form.windowNote)
  if (changed('route')) application.route = orNull(form.route)
  if (changed('selection')) application.selection = orNull(form.selection)
  if (changed('fees')) application.fees = orNull(form.fees)
  if (Object.keys(application).length) changes.application = application

  const eligibility: Record<string, unknown> = {}
  if (changed('conditions')) eligibility.conditions = splitLines(form.conditions)
  if (changed('exclusions')) eligibility.exclusions = splitLines(form.exclusions)
  if (Object.keys(eligibility).length) changes.eligibility = eligibility

  if (changed('internalNote')) changes.fine_print = { review_note: orNull(form.internalNote) }
  return changes
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-indigo-200 focus:ring-2'

export default function CorrectionForm({ slug, initial }: { slug: string; initial: CorrectionInitial }) {
  const router = useRouter()
  const [form, setForm] = useState(initial)
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [published, setPublished] = useState<number | null>(null)

  const changes = buildChanges(initial, form)
  const changedCount = Object.keys(changes).length
  const set = (field: Field) => (event: { target: { value: string } }) => setForm(previous => ({ ...previous, [field]: event.target.value }))
  const warn = (field: Field) => PUBLIC_FIELDS.includes(field) && form[field].trim() !== initial[field].trim() && isInternalNote(form[field])
    ? <p className="mt-1 text-xs font-semibold text-amber-700">This reads like an internal note, so applicants will not see it. Rewrite it in plain language for them.</p>
    : null

  async function publish(event: React.FormEvent) {
    event.preventDefault()
    if (!changedCount) return toast.error('Nothing has changed yet.')
    if (!reason.trim()) return toast.error('Add a short reason for the change.')
    setSaving(true)
    try {
      const response = await fetch('/api/admin/catalog/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, changes, reason }),
      })
      const payload = await response.json().catch(() => ({})) as { data?: { version_number?: number }; error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Publishing failed')
      setPublished(payload.data?.version_number ?? null)
      setReason('')
      toast.success(`Published version ${payload.data?.version_number ?? ''}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Publishing failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={publish} className="mt-6 space-y-5">
      {published !== null && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><p className="font-bold">Published version {published}.</p><p className="mt-1">The public page refreshes within a few minutes. <a className="font-semibold underline" href={`/schemes/${slug}`} target="_blank" rel="noreferrer">Open it</a>.</p></div>}

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <h2 className="font-black text-slate-900 sm:col-span-2">Status and link</h2>
        <label className="text-sm font-semibold text-slate-700">Status
          <select value={form.status} onChange={set('status')} className={`${inputClass} mt-1`}>
            <option value="active">Active: open to applicants</option>
            <option value="upcoming">Upcoming: announced, not open yet</option>
            <option value="paused">Paused: no open call right now</option>
            <option value="closed">Closed: no new applications</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">Official link
          <input type="url" value={form.officialUrl} onChange={set('officialUrl')} className={`${inputClass} mt-1`} />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-black text-slate-900">What applicants read</h2>
        <label className="block text-sm font-semibold text-slate-700">What you get (one line)
          <input value={form.headline} onChange={set('headline')} className={`${inputClass} mt-1`} />{warn('headline')}
        </label>
        <label className="block text-sm font-semibold text-slate-700">Summary
          <textarea rows={3} value={form.summary} onChange={set('summary')} className={`${inputClass} mt-1`} />{warn('summary')}
        </label>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3">
        <h2 className="font-black text-slate-900 sm:col-span-3">Application window</h2>
        <label className="text-sm font-semibold text-slate-700">Type
          <select value={form.windowType} onChange={set('windowType')} className={`${inputClass} mt-1`}>
            {WINDOW_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700">Opens on (optional)
          <input type="date" value={form.opensAt} onChange={set('opensAt')} className={`${inputClass} mt-1`} />
        </label>
        <label className="text-sm font-semibold text-slate-700">Closes on (optional)
          <input type="date" value={form.closesAt} onChange={set('closesAt')} className={`${inputClass} mt-1`} />
        </label>
        <label className="block text-sm font-semibold text-slate-700 sm:col-span-3">Note for applicants (optional)
          <input value={form.windowNote} onChange={set('windowNote')} placeholder="e.g. Extended to 31 December 2026 by DGFT Notification 41/2026-27" className={`${inputClass} mt-1`} />{warn('windowNote')}
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-black text-slate-900">How to apply</h2>
        <label className="block text-sm font-semibold text-slate-700">Route
          <textarea rows={3} value={form.route} onChange={set('route')} className={`${inputClass} mt-1`} />{warn('route')}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">Selection
            <textarea rows={2} value={form.selection} onChange={set('selection')} className={`${inputClass} mt-1`} />{warn('selection')}
          </label>
          <label className="block text-sm font-semibold text-slate-700">Fees
            <textarea rows={2} value={form.fees} onChange={set('fees')} className={`${inputClass} mt-1`} />{warn('fees')}
          </label>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
        <h2 className="font-black text-slate-900 sm:col-span-2">Who can apply <span className="text-xs font-semibold text-slate-400">(one point per line)</span></h2>
        <label className="block text-sm font-semibold text-slate-700">Eligible if
          <textarea rows={6} value={form.conditions} onChange={set('conditions')} className={`${inputClass} mt-1`} />{warn('conditions')}
        </label>
        <label className="block text-sm font-semibold text-slate-700">Not eligible if
          <textarea rows={6} value={form.exclusions} onChange={set('exclusions')} className={`${inputClass} mt-1`} />{warn('exclusions')}
        </label>
      </section>

      <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <label className="block text-sm font-semibold text-slate-700">Internal note (never shown to applicants)
          <textarea rows={2} value={form.internalNote} onChange={set('internalNote')} className={`${inputClass} mt-1`} />
        </label>
      </section>

      <section className="sticky bottom-0 rounded-2xl border border-indigo-200 bg-white p-5 shadow-lg">
        <label className="block text-sm font-semibold text-slate-700">Reason for this change (required)
          <input value={reason} onChange={event => setReason(event.target.value)} placeholder="e.g. DGFT Notification 41/2026-27 extends RoDTEP to 31 Dec 2026" className={`${inputClass} mt-1`} />
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={saving || !changedCount} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Publishing…' : 'Save & publish'}</button>
          <button type="button" disabled={saving || !changedCount} onClick={() => setForm(initial)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 disabled:opacity-40">Undo my edits</button>
          <span className="text-xs text-slate-500">{changedCount ? `${changedCount} section${changedCount === 1 ? '' : 's'} changed` : 'No changes yet'}</span>
        </div>
      </section>
    </form>
  )
}
