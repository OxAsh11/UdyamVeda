'use client'

import { useCallback, useEffect, useState } from 'react'

type Authority = { id: string; name: string; ministry: string | null; department: string | null; official_url: string | null }
type ParentCoverage = { id: string; authority_level: string; authority_name: string; authority_url: string | null }
type Relationship = {
  id: string
  relationship_type: string
  source_url: string
  source_anchor: string
  evidence_note: Record<string, unknown>
  review_status: string
  reviewed_at: string | null
  child_authority: Authority | Authority[] | null
  parent_coverage: ParentCoverage | ParentCoverage[] | null
}
type Pagination = { page: number; pageSize: number; total: number; hasMore: boolean }
type Status = 'pending' | 'confirmed' | 'rejected' | 'all'

function one<T>(value: T | T[] | null) { return Array.isArray(value) ? value[0] : value }

export default function CatalogRelationshipsPage() {
  const [rows, setRows] = useState<Relationship[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pageSize: 25, total: 0, hasMore: false })
  const [status, setStatus] = useState<Status>('pending')
  const [page, setPage] = useState(1)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('Loading authority relationships...')

  const load = useCallback(async () => {
    const response = await fetch(`/api/admin/catalog/relationships?page=${page}&pageSize=25&status=${status}`, { cache: 'no-store' })
    const payload = await response.json() as { data?: Relationship[]; pagination?: Pagination; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load authority relationships.')
      return
    }
    setRows(payload.data ?? [])
    setPagination(payload.pagination ?? { page, pageSize: 25, total: payload.data?.length ?? 0, hasMore: false })
    setMessage(payload.data?.length ? '' : 'No relationship candidates in this view.')
  }, [page, status])

  useEffect(() => { void Promise.resolve().then(load) }, [load])

  async function decide(row: Relationship, action: 'confirm' | 'reject') {
    const note = noteDrafts[row.id]?.trim() ?? ''
    if (!note) {
      setErrors(previous => ({ ...previous, [row.id]: action === 'confirm' ? 'Describe the official evidence that confirms this relationship.' : 'Explain why this relationship is incorrect or insufficient.' }))
      return
    }
    setErrors(previous => ({ ...previous, [row.id]: '' }))
    setBusyId(row.id)
    const response = await fetch('/api/admin/catalog/relationships', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ relationshipId: row.id, action, reviewNote: note }),
    })
    const payload = await response.json() as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [row.id]: payload.error ?? 'The relationship decision could not be saved.' }))
      return
    }
    await load()
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Authority relationships</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Confirm or reject the proposed relationship between an implementing authority and an IGOD ministry or department. This decision does not assess business relevance or publish an opportunity.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/crosswalk" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Crosswalk</a>
            <a href="/admin/catalog/coverage" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Coverage matrix</a>
            <button onClick={() => void load()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh queue</button>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {([['pending', 'Pending'], ['confirmed', 'Confirmed'], ['rejected', 'Rejected'], ['all', 'All']] as const).map(([value, label]) => <button key={value} onClick={() => { setStatus(value); setPage(1) }} className={status === value ? 'rounded-full bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600'}>{label}</button>)}
        </div>
        {message && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        <div className="grid gap-3">
          {rows.map(row => {
            const child = one(row.child_authority)
            const parent = one(row.parent_coverage)
            return <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{row.relationship_type.replaceAll('_', ' ')}</p>
                  <h2 className="mt-1 text-lg font-bold">{child?.name ?? 'Implementing authority'}</h2>
                  <p className="mt-2 text-sm text-slate-600">Proposed parent: <span className="font-semibold">{parent?.authority_name ?? 'IGOD authority'}</span> ({parent?.authority_level ?? 'unknown'})</p>
                  {child?.official_url && <a href={child.official_url} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs text-indigo-700 underline">{child.official_url}</a>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.review_status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : row.review_status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>{row.review_status}</span>
              </div>
              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-600"><p className="font-bold text-slate-700">Evidence to verify</p><a href={row.source_url} target="_blank" rel="noreferrer" className="mt-1 block break-all text-indigo-700 underline">{row.source_url}</a><p className="mt-1">{row.source_anchor}</p></div>
              {row.review_status === 'pending' && <div className="mt-4 grid gap-3">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">Review note <span className="font-normal text-slate-500">(required for either decision)</span>
                  <textarea aria-label={`${child?.name ?? 'Authority'} relationship review note`} rows={2} value={noteDrafts[row.id] ?? ''} onChange={event => setNoteDrafts(previous => ({ ...previous, [row.id]: event.target.value }))} placeholder="Cite the official organizational evidence or explain the rejection." className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                </label>
                {errors[row.id] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[row.id]}</p>}
                <div className="flex flex-wrap gap-2"><button disabled={busyId === row.id} onClick={() => void decide(row, 'confirm')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Confirm relationship</button><button disabled={busyId === row.id} onClick={() => void decide(row, 'reject')} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 disabled:opacity-50">Reject candidate</button></div>
              </div>}
            </article>
          })}
        </div>
        {pagination.total > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm"><p className="text-slate-500">Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} relationships</p><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-600 disabled:opacity-40">Previous</button><button disabled={!pagination.hasMore} onClick={() => setPage(current => current + 1)} className="rounded-xl bg-[#3f46e8] px-3 py-2 font-semibold text-white disabled:opacity-40">Next</button></div></div>}
      </div>
    </main>
  )
}
