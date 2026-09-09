'use client'

import { useCallback, useEffect, useState } from 'react'

type AlternateSource = { url: string; title: string; role: string }
type AlternateCapture = { sourceUrl: string; contentHash: string | null; snapshotPath: string | null; captureMethod: string | null }
type Gap = {
  slug: string
  name: string
  sourceUrl: string
  sourceAnchor: string | null
  status: string
  captureError: string | null
  captureFailureKind: string | null
  captureRetryable: boolean | null
  integrityStatus: string
  alternateOfficialSources: AlternateSource[]
  alternateCaptures: AlternateCapture[]
  nextAction: string
  publicationStatus: string
}
type Payload = {
  summary: { totalRecords: number; currentSourceGaps: number; primarySnapshotMissing: number; primaryCaptureFailed: number; retryableFailures: number; manualReviewRequired: number; integrityReviewRequired: number; alternateCapturesAvailable: number; publicationReady: number }
  gaps: Gap[]
  error?: string
}

function label(value: string) {
  return value.replaceAll('_', ' ')
}

export default function CatalogSourceGapsPage() {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'retryable' | 'manual' | 'alternate'>('all')
  const [message, setMessage] = useState('Loading current-source gap queue…')

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/catalog/source-gaps', { cache: 'no-store' })
    const next = await response.json() as Payload
    if (!response.ok) {
      setMessage(next.error ?? 'Unable to load the current-source gap queue.')
      return
    }
    setPayload(next)
    setMessage('')
  }, [])

  useEffect(() => { void Promise.resolve().then(load) }, [load])

  const normalizedQuery = query.trim().toLowerCase()
  const gaps = (payload?.gaps ?? []).filter(gap => {
    const matchesQuery = !normalizedQuery || [gap.name, gap.slug, gap.sourceUrl, gap.status].some(value => value.toLowerCase().includes(normalizedQuery))
    const matchesFilter = filter === 'all'
      || (filter === 'retryable' && gap.captureRetryable === true)
      || (filter === 'manual' && gap.captureRetryable !== true)
      || (filter === 'alternate' && gap.alternateCaptures.length > 0)
    return matchesQuery && matchesFilter
  })

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Current source gaps</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Every record below is missing current primary evidence or needs capture/integrity review. This queue is review-only and cannot publish an opportunity.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <a href="/admin/catalog/source-failures" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm">Failed captures</a>
            <a href="/admin/catalog/preflight" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Preflight</a>
            <button onClick={() => void load()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh queue</button>
          </div>
        </div>

        {message && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        {payload && <>
          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs text-rose-800">Current gaps</p><p className="mt-1 text-2xl font-black text-rose-950">{payload.summary.currentSourceGaps}</p></div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs text-amber-800">Missing snapshots</p><p className="mt-1 text-2xl font-black text-amber-950">{payload.summary.primarySnapshotMissing}</p></div>
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4"><p className="text-xs text-orange-800">Failed captures</p><p className="mt-1 text-2xl font-black text-orange-950">{payload.summary.primaryCaptureFailed}</p></div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4"><p className="text-xs text-cyan-800">Retryable</p><p className="mt-1 text-2xl font-black text-cyan-950">{payload.summary.retryableFailures}</p></div>
            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4"><p className="text-xs text-violet-800">Manual review</p><p className="mt-1 text-2xl font-black text-violet-950">{payload.summary.manualReviewRequired}</p></div>
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4"><p className="text-xs text-indigo-800">Alternates available</p><p className="mt-1 text-2xl font-black text-indigo-950">{payload.summary.alternateCapturesAvailable}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-600">Publication-ready</p><p className="mt-1 text-2xl font-black">{payload.summary.publicationReady}</p></div>
          </section>

          <form onSubmit={event => event.preventDefault()} className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_auto]">
            <div><label className="sr-only" htmlFor="source-gap-search">Search source gaps</label><input id="source-gap-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search scheme, slug, source URL, or status" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2" /></div>
            <div><label className="sr-only" htmlFor="source-gap-filter">Filter source gaps</label><select id="source-gap-filter" value={filter} onChange={event => setFilter(event.target.value as typeof filter)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none ring-indigo-200 focus:ring-2 md:min-w-48"><option value="all">All gaps</option><option value="retryable">Retryable captures</option><option value="manual">Manual review</option><option value="alternate">Alternate evidence</option></select></div>
          </form>

          <p className="mb-4 text-xs text-slate-500">Showing {gaps.length} of {payload.summary.currentSourceGaps} current evidence gaps. Capture categories are triage signals, not publication decisions.</p>
          <div className="grid gap-5">
            {gaps.map(gap => <article key={`${gap.slug}-${gap.sourceUrl}`} className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-rose-800">{label(gap.status)}</span><h2 className="mt-3 text-xl font-bold">{gap.name}</h2><p className="mt-1 text-xs text-slate-500">{gap.slug}</p></div>
                <p className="max-w-sm text-xs leading-5 text-slate-600"><span className="font-bold text-slate-800">Next action:</span> {label(gap.nextAction)}.</p>
              </div>
              <div className="mt-4 grid gap-2 text-xs"><div className="rounded-xl bg-rose-50 p-3"><p className="font-bold text-rose-900">Current primary source</p><a href={gap.sourceUrl} target="_blank" rel="noreferrer" className="mt-1 block break-all text-indigo-700 underline">{gap.sourceUrl}</a><p className="mt-2 text-rose-900">Anchor: {gap.sourceAnchor ?? 'Not recorded'}</p>{gap.captureFailureKind && <p className="mt-2 text-rose-900">Failure class: {label(gap.captureFailureKind)} · {gap.captureRetryable === true ? 'retryable' : 'manual review required'}</p>}{gap.captureError && <p className="mt-2 text-rose-900">Capture error: {gap.captureError}</p>}</div>
                <details className="rounded-xl bg-slate-50 p-3"><summary className="cursor-pointer font-bold text-slate-700">Official alternates and captured evidence</summary>{gap.alternateOfficialSources.length > 0 ? <ul className="mt-2 space-y-1">{gap.alternateOfficialSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-700 underline">{source.title}</a> · {label(source.role)}</li>)}</ul> : <p className="mt-2 text-slate-600">No alternate source is registered for this record.</p>}{gap.alternateCaptures.length > 0 && <div className="mt-3 rounded-lg bg-amber-50 p-3"><p className="font-bold text-amber-900">Captured alternate snapshots</p>{gap.alternateCaptures.map(capture => <div key={`${capture.sourceUrl}-${capture.contentHash}`} className="mt-2"><p className="break-all text-amber-900">{capture.sourceUrl} · {capture.captureMethod ?? 'capture method not recorded'} · hash {capture.contentHash ?? 'missing'}</p>{capture.snapshotPath && <a href={`/admin/catalog/offline-review/snapshot?path=${encodeURIComponent(capture.snapshotPath)}&slug=${encodeURIComponent(gap.slug)}`} className="mt-1 inline-block font-semibold text-indigo-700 underline">Open captured snapshot</a>}</div>)}</div>}</details></div>
            </article>)}
          </div>
        </>}
      </div>
    </main>
  )
}
