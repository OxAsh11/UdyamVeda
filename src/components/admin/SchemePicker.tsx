'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { freshnessOf } from '@/lib/opportunities/engine/classify'
import type { Freshness } from '@/lib/opportunities/engine/types'

export type PickerRow = {
  slug: string
  name: string
  status: string
  group: string
  authority: string
  versionNumber: number
  lastCheckedAt: string | null
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  upcoming: 'bg-sky-50 text-sky-700',
  paused: 'bg-amber-50 text-amber-800',
  pending_renewal: 'bg-orange-50 text-orange-800',
  closed: 'bg-slate-100 text-slate-600',
}

const STATUS_LABELS: Record<string, string> = { active: 'Active', upcoming: 'Upcoming', paused: 'Paused', pending_renewal: 'Pending renewal', closed: 'Closed' }

const FRESHNESS_STYLES: Record<Freshness, string> = {
  fresh: 'text-slate-400',
  amber: 'font-bold text-amber-700',
  stale: 'font-bold text-rose-700',
}

const NEEDS_CHECK = 'needs_check'
const checkedTime = (value: string | null) => (value ? new Date(value).getTime() : 0)

export default function SchemePicker({ rows }: { rows: PickerRow[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [now] = useState(() => new Date())
  // Dates updated on this visit, so a row changes as soon as it is marked.
  const [checkedNow, setCheckedNow] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const current = useMemo(() => rows.map(row => ({ ...row, lastCheckedAt: checkedNow[row.slug] ?? row.lastCheckedAt })), [rows, checkedNow])
  const needsCheck = (row: PickerRow) => freshnessOf(row.lastCheckedAt, now) !== 'fresh'
  const dueCount = current.filter(needsCheck).length

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matching = current.filter(row =>
      (status === 'all' || (status === NEEDS_CHECK ? freshnessOf(row.lastCheckedAt, now) !== 'fresh' : row.status === status))
      && (!needle || `${row.name} ${row.authority} ${row.slug}`.toLowerCase().includes(needle)))
    return status === NEEDS_CHECK ? [...matching].sort((left, right) => checkedTime(left.lastCheckedAt) - checkedTime(right.lastCheckedAt)) : matching
  }, [current, query, status, now])

  async function markChecked(row: PickerRow) {
    setSaving(row.slug)
    const response = await fetch('/api/admin/catalog/mark-checked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: row.slug }),
    }).catch(() => null)
    setSaving(null)
    const payload = await response?.json().catch(() => null) as { checkedAt?: string; error?: string } | null | undefined
    if (!response?.ok || !payload?.checkedAt) {
      toast.error(payload?.error ?? 'Could not save. Please try again.')
      return
    }
    setCheckedNow(previous => ({ ...previous, [row.slug]: payload.checkedAt as string }))
    toast.success(`${row.name} marked as checked today.`)
  }

  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <label className="sr-only" htmlFor="scheme-search">Search schemes</label>
        <input id="scheme-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by scheme, ministry or ID" className="min-w-64 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-indigo-200 focus:ring-2" />
        <label className="sr-only" htmlFor="scheme-status">Filter by status</label>
        <select id="scheme-status" value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
          <option value="all">All statuses ({rows.length})</option>
          <option value={NEEDS_CHECK}>Needs checking, oldest first ({dueCount})</option>
          {['active', 'upcoming', 'paused', 'pending_renewal', 'closed'].map(value => <option key={value} value={value}>{STATUS_LABELS[value] ?? value} ({rows.filter(row => row.status === value).length})</option>)}
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-500">{visible.length} of {rows.length} schemes. Amber: not checked for 30 days. Red: over 60 days, so founders see it as &quot;status not confirmed&quot;.</p>
      <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {visible.map(row => (
          <li key={row.slug} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-indigo-50/50">
            <Link href={`/admin/catalog/edit/${row.slug}`} className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">{row.name}</p>
              <p className="truncate text-xs text-slate-500">{row.authority} · {row.group}</p>
            </Link>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>{STATUS_LABELS[row.status] ?? row.status}</span>
            <span className={`w-28 text-right text-[11px] ${FRESHNESS_STYLES[freshnessOf(row.lastCheckedAt, now)]}`}>v{row.versionNumber}{row.lastCheckedAt ? ` · ${new Date(row.lastCheckedAt).toLocaleDateString('en-IN')}` : ' · never checked'}</span>
            <button
              type="button"
              disabled={saving === row.slug}
              onClick={() => void markChecked(row)}
              title="Only press this after opening the official source today"
              className="rounded-lg border border-indigo-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
            >
              {saving === row.slug ? 'Saving…' : 'Source opened today: still correct'}
            </button>
          </li>
        ))}
        {visible.length === 0 && <li className="px-4 py-6 text-sm text-slate-500">No schemes match.</li>}
      </ul>
    </section>
  )
}
