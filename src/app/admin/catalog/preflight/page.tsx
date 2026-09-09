'use client'

import { useCallback, useEffect, useState } from 'react'

type Check = { id: string; label: string; passed: boolean; required: boolean; detail: string }
type SourceFailure = {
  slug: string
  name: string
  sourceUrl: string
  failureKind: string
  retryable: boolean
  attempts: number | null
  error: string
  status: string
  publicationStatus: string
  nextAction: string
  manualPath: string
  alternateOfficialSources: Array<{ url: string; title: string; role: string; captureRequired: boolean }>
  alternateCaptures: Array<{ sourceUrl: string; snapshotPath: string | null; contentHash: string | null; captureRole: string }>
}
type SourceFailureQueue = {
  summary: { totalOpen: number; retryable: number; manualReviewRequired: number; alternateCapturedPendingReview: number; publicationReady: number }
  failures: SourceFailure[]
}
type CurrentSourceGapQueue = {
  summary: { totalRecords: number; currentSourceGaps: number; primarySnapshotMissing: number; primaryCaptureFailed: number; retryableFailures: number; manualReviewRequired: number; integrityReviewRequired: number; alternateCapturesAvailable: number; publicationReady: number }
}
type Payload = { ready?: boolean; checks?: Check[]; sourceFailureQueue?: SourceFailureQueue; currentSourceGapQueue?: CurrentSourceGapQueue; evaluatedAt?: string; error?: string }

function label(value: string) {
  return value.replaceAll('_', ' ')
}

export default function CatalogPreflightPage() {
  const [payload, setPayload] = useState<Payload | null>(null)
  const [message, setMessage] = useState('Loading catalog preflight…')

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/catalog/preflight', { cache: 'no-store' })
    const next = (await response.json()) as Payload
    if (!response.ok) {
      setMessage(next.error ?? 'Unable to evaluate catalog prerequisites.')
      return
    }
    setPayload(next)
    setMessage('')
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Catalog preflight</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Read-only checks for server credentials and remote schema. Secret values are never displayed.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <a href="/admin/catalog/source-failures" className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm">Source-resolution queue</a>
            <a href="/admin/catalog/source-gaps" className="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm">Current source gaps</a>
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <button onClick={() => void load()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Recheck</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        {payload && <>
          <section className={`rounded-2xl border p-6 shadow-sm ${payload.ready ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Operational readiness</p>
            <h2 className="mt-2 text-3xl font-black">{payload.ready ? 'Ready for catalog operations' : 'Prerequisites still due'}</h2>
            <p className="mt-2 text-sm">{payload.evaluatedAt ? new Date(payload.evaluatedAt).toLocaleString() : ''}</p>
          </section>
          {payload.sourceFailureQueue && <section className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-700">Publication blockers</p>
                <h2 className="mt-2 text-2xl font-black text-rose-950">Source evidence queue</h2>
                <p className="mt-2 max-w-3xl text-sm text-rose-900">These source failures remain blocked even when infrastructure checks pass. Alternate captures never become approval automatically.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-rose-900">
                <div className="rounded-xl bg-white/70 px-4 py-3"><div className="text-2xl">{payload.sourceFailureQueue.summary.totalOpen}</div><div>Open</div></div>
                <div className="rounded-xl bg-white/70 px-4 py-3"><div className="text-2xl">{payload.sourceFailureQueue.summary.alternateCapturedPendingReview}</div><div>Alt. pending</div></div>
              </div>
            </div>
              <div className="mt-5 flex flex-wrap gap-3"><a href="/admin/catalog/source-failures" className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white">Open reviewer resolution queue</a></div>
              <div className="mt-5 grid gap-3">
              {payload.sourceFailureQueue.failures.map(failure => <article key={`${failure.slug}-${failure.sourceUrl}`} className="rounded-xl border border-rose-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><h3 className="font-bold text-slate-900">{failure.name}</h3><p className="mt-1 text-xs text-slate-500">{failure.failureKind} · {failure.attempts ? `${failure.attempts} attempt(s)` : 'attempt count unavailable'}</p></div>
                  <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-800">{label(failure.status)}</span>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-600">{failure.nextAction.replaceAll('_', ' ')}.</p>
                {failure.alternateCaptures.length > 0 && <p className="mt-2 text-xs font-semibold text-amber-700">Alternate evidence captured and awaiting reviewer comparison.</p>}
                <details className="mt-3 rounded-lg bg-slate-50 p-3">
                  <summary className="cursor-pointer text-xs font-bold text-slate-700">Open resolution details</summary>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{failure.manualPath}</p>
                  <p className="mt-2 break-all text-[11px] text-slate-500">Primary: {failure.sourceUrl}</p>
                  {failure.alternateOfficialSources.length > 0 && <ul className="mt-2 space-y-1 text-[11px] text-indigo-700">{failure.alternateOfficialSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="underline">{source.title}</a> · {source.role.replaceAll('_', ' ')}</li>)}</ul>}
                </details>
              </article>)}
            </div>
          </section>}
          {payload.currentSourceGapQueue && <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Current primary evidence</p><h2 className="mt-2 text-2xl font-black text-amber-950">Source gaps</h2><p className="mt-2 max-w-3xl text-sm text-amber-900">These records do not yet have an integrity-passing snapshot for their current primary source URL. They remain blocked and require capture or evidence review.</p></div>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-amber-950"><div className="rounded-xl bg-white/70 px-4 py-3"><div className="text-2xl">{payload.currentSourceGapQueue.summary.currentSourceGaps}</div><div>Open gaps</div></div><div className="rounded-xl bg-white/70 px-4 py-3"><div className="text-2xl">{payload.currentSourceGapQueue.summary.alternateCapturesAvailable}</div><div>Alt. available</div></div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3"><a href="/admin/catalog/source-gaps" className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-bold text-white">Open current-source gap queue</a><span className="rounded-xl border border-amber-200 bg-white/70 px-4 py-2 text-sm font-semibold text-amber-900">{payload.currentSourceGapQueue.summary.primarySnapshotMissing} missing · {payload.currentSourceGapQueue.summary.primaryCaptureFailed} failed · {payload.currentSourceGapQueue.summary.retryableFailures} retryable · {payload.currentSourceGapQueue.summary.manualReviewRequired} manual</span></div>
          </section>}
          <div className="mt-6 grid gap-3">
            {(payload.checks ?? []).map(check => (
              <article key={check.id} className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div><h2 className="font-bold">{check.label}</h2><p className="mt-1 text-sm text-slate-600">{check.detail}</p></div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${check.passed ? 'bg-emerald-100 text-emerald-700' : check.required ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{check.passed ? 'Pass' : check.required ? 'Due' : 'Optional'}</span>
              </article>
            ))}
          </div>
        </>}
      </div>
    </main>
  )
}
