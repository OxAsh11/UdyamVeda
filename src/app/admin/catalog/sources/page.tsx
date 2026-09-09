'use client'

import { useCallback, useEffect, useState } from 'react'

type SourceRow = {
  id: string
  name: string
  url: string
  source_kind: string
  coverage_level: string
  cadence: string
  active: boolean
  last_checked_at: string | null
  last_content_hash: string | null
  expected_item_count: number | null
  notes: string | null
}

type SourcePagination = {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

export default function CatalogSourcesPage() {
  const [sources, setSources] = useState<SourceRow[]>([])
  const [message, setMessage] = useState('Loading source registry…')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [pagination, setPagination] = useState<SourcePagination>({ page: 1, pageSize: 25, total: 0, hasMore: false })

  const loadSources = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: '25' })
    if (query) params.set('q', query)
    const response = await fetch(`/api/admin/catalog/sources?${params.toString()}`, { cache: 'no-store' })
    const payload = (await response.json()) as { data?: SourceRow[]; pagination?: SourcePagination; search?: string; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load the source registry.')
      return
    }
    setSources(payload.data ?? [])
    setPagination(payload.pagination ?? { page, pageSize: 25, total: payload.data?.length ?? 0, hasMore: false })
    setMessage(payload.data?.length ? '' : query ? 'No registered sources match this search.' : 'No registered sources.')
  }, [page, query])

  useEffect(() => {
    void Promise.resolve().then(loadSources)
  }, [loadSources])

  async function refresh(sourceId: string) {
    setBusyId(sourceId)
    const response = await fetch('/api/admin/catalog/sources', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sourceId }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      window.alert(payload.error ?? 'Refresh could not be queued.')
      return
    }
    window.alert('Refresh queued. The source will remain in review until the result is assessed.')
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Source registry</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Refresh official sources and inspect their last crawl state. A refresh creates review work; it never publishes content automatically.</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin/catalog/coverage" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Coverage matrix</a>
            <a href="/admin/catalog/discoveries" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Discoveries</a>
            <a href="/admin/catalog/changes" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source changes</a>
            <a href="/admin/catalog/records" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Records</a>
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <button onClick={() => void loadSources()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh list</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <form onSubmit={event => { event.preventDefault(); setQuery(searchInput.trim()); setPage(1) }} className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <label className="sr-only" htmlFor="source-registry-search">Search registered sources</label>
          <input id="source-registry-search" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search source name, URL, type, or coverage" className="min-w-72 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2" />
          <button type="submit" className="rounded-lg bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white">Search</button>
          {query && <button type="button" onClick={() => { setSearchInput(''); setQuery(''); setPage(1) }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Clear</button>}
        </form>

        {query && <p className="mb-4 text-xs text-slate-500">Showing sources matching “{query}”.</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {sources.map(source => (
            <article key={source.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{source.source_kind} · {source.coverage_level}</p>
                  <h2 className="mt-2 text-lg font-bold">{source.name}</h2>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${source.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{source.active ? 'Active' : 'Inactive'}</span>
              </div>
              <a href={source.url} target="_blank" rel="noreferrer" className="mt-3 block truncate text-sm text-indigo-700 underline underline-offset-2">{source.url}</a>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><dt className="text-slate-500">Cadence</dt><dd className="mt-1 font-semibold">{source.cadence}</dd></div>
                <div><dt className="text-slate-500">Expected items</dt><dd className="mt-1 font-semibold">{source.expected_item_count ?? 'Not fixed'}</dd></div>
                <div><dt className="text-slate-500">Last checked</dt><dd className="mt-1 font-semibold">{source.last_checked_at ? source.last_checked_at.slice(0, 10) : 'Never'}</dd></div>
                <div><dt className="text-slate-500">Content hash</dt><dd className="mt-1 truncate font-mono">{source.last_content_hash ? source.last_content_hash.slice(0, 12) : 'None'}</dd></div>
              </dl>
              {source.notes && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">{source.notes}</p>}
              <button disabled={!source.active || busyId === source.id} onClick={() => void refresh(source.id)} className="mt-5 rounded-xl bg-[#3f46e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                {busyId === source.id ? 'Queueing…' : 'Queue refresh'}
              </button>
            </article>
          ))}
        </div>
        {pagination.total > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-slate-500">Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} registered sources</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button disabled={!pagination.hasMore} onClick={() => setPage(current => current + 1)} className="rounded-xl bg-[#3f46e8] px-3 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>}
      </div>
    </main>
  )
}
