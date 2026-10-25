'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

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

export default function SchemePicker({ rows }: { rows: PickerRow[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return rows.filter(row =>
      (status === 'all' || row.status === status)
      && (!needle || `${row.name} ${row.authority} ${row.slug}`.toLowerCase().includes(needle)))
  }, [rows, query, status])

  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <label className="sr-only" htmlFor="scheme-search">Search schemes</label>
        <input id="scheme-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by scheme, ministry or ID" className="min-w-64 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-indigo-200 focus:ring-2" />
        <label className="sr-only" htmlFor="scheme-status">Filter by status</label>
        <select id="scheme-status" value={status} onChange={event => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm">
          <option value="all">All statuses ({rows.length})</option>
          {['active', 'upcoming', 'paused', 'pending_renewal', 'closed'].map(value => <option key={value} value={value}>{STATUS_LABELS[value] ?? value} ({rows.filter(row => row.status === value).length})</option>)}
        </select>
      </div>
      <p className="mt-3 text-xs text-slate-500">{visible.length} of {rows.length} schemes</p>
      <ul className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {visible.map(row => (
          <li key={row.slug}>
            <Link href={`/admin/catalog/edit/${row.slug}`} className="flex flex-wrap items-center gap-3 px-4 py-3 hover:bg-indigo-50/50">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{row.name}</p>
                <p className="truncate text-xs text-slate-500">{row.authority} · {row.group}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLES[row.status] ?? 'bg-slate-100 text-slate-600'}`}>{STATUS_LABELS[row.status] ?? row.status}</span>
              <span className="w-28 text-right text-[11px] text-slate-400">v{row.versionNumber}{row.lastCheckedAt ? ` · ${new Date(row.lastCheckedAt).toLocaleDateString('en-IN')}` : ''}</span>
            </Link>
          </li>
        ))}
        {visible.length === 0 && <li className="px-4 py-6 text-sm text-slate-500">No schemes match.</li>}
      </ul>
    </section>
  )
}
