import fs from 'node:fs'
import path from 'node:path'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

type ReviewCheck = {
  key: string
  label: string
  required: boolean
}

type ReviewRecord = {
  slug: string
  name: string
  seedFile: string
  authority: string
  opportunityType: string
  lifecycleStatus: string
  reviewStatus: string
  publicationStatus: string
  canonicalUrl: string | null
  source: {
    url: string | null
    anchor: string | null
    registered: boolean
    liveSnapshotRequired: boolean
    liveSnapshot: {
      status: string
      fetchedAt: string | null
      snapshotPath: string | null
      contentHash: string | null
      captureMethod: string | null
      reviewStatus: string
      publicationStatus: string
    }
  }
  eligibility: {
    entityTypes: string[]
    lifecycleStages: string[]
    industries: string[]
    locations: string[]
    conditions: string[]
    thresholds: Record<string, unknown>
    exclusions: string[]
    unknownHandling: string
  }
  benefit: {
    type: string | null
    label: string | null
    amountMin: number | null
    amountMax: number | null
    percentage: number | null
    summary: Record<string, unknown>
    conditions: Record<string, unknown>
  }
  application: {
    portal: string | null
    route: string | null
    selection: string | null
    requirements: { name: string | null; description: string | null }
    steps: Array<{ title?: string; description?: string; url?: string }>
  }
  window: {
    type: string | null
    label: string | null
    evidence: Record<string, unknown> | null
  }
  finePrint: Record<string, unknown>
  reviewChecklist: Array<{ key: string; label: string; required: boolean; status: string; note: string | null }>
  nextAction: string
}

type ReviewPack = {
  generatedAt: string
  status: string
  interpretation: string
  reviewChecks: ReviewCheck[]
  summary: {
    totalRecords: number
    inReview: number
    sourceRegistered: number
    pendingReviewChecks: number
    publicationReady: number
  }
  records: ReviewRecord[]
}

type ReviewBatch = {
  batchId: string
  authorityName: string
  authorityLevel: string
  recordCount: number
  records: Array<{ slug: string }>
}

type ReviewBatchManifest = {
  generatedAt: string
  summary: {
    reviewBatches: number
    opportunityRecords: number
  }
  batches: ReviewBatch[]
}

function readReviewPack(): ReviewPack {
  const filePath = path.join(process.cwd(), 'docs', 'catalog-review-pack.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ReviewPack
}

function readReviewBatches(): ReviewBatchManifest {
  const filePath = path.join(process.cwd(), 'docs', 'catalog-review-batches.json')
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ReviewBatchManifest
}

function json(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}

function list(values: string[]) {
  return values.length ? values.join(' · ') : 'None recorded'
}

type PageProps = {
  searchParams: Promise<{ page?: string; q?: string; batch?: string }>
}

export default async function OfflineCatalogReviewPage({ searchParams }: PageProps) {
  if (process.env.NODE_ENV === 'production') notFound()

  const pack = readReviewPack()
  const batches = readReviewBatches()
  const params = await searchParams
  const query = (params.q ?? '').trim()
  const selectedBatchId = (params.batch ?? '').trim()
  const selectedBatch = batches.batches.find(batch => batch.batchId === selectedBatchId) ?? null
  const batchSlugs = selectedBatch ? new Set(selectedBatch.records.map(record => record.slug)) : null
  const filteredRecords = query
    ? pack.records.filter(record => {
        const matchesBatch = !batchSlugs || batchSlugs.has(record.slug)
        return matchesBatch && `${record.name} ${record.slug} ${record.authority} ${record.opportunityType} ${record.source.url ?? ''}`.toLowerCase().includes(query.toLowerCase())
      })
    : pack.records.filter(record => !batchSlugs || batchSlugs.has(record.slug))
  const batchBySlug = new Map(batches.batches.flatMap(batch => batch.records.map(record => [record.slug, batch.batchId] as const)))
  const requestedPage = Number(params.page ?? '1')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = 20
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const boundedPage = Math.min(page, totalPages)
  const firstRecord = (boundedPage - 1) * pageSize
  const visibleRecords = filteredRecords.slice(firstRecord, firstRecord + pageSize)

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">Local editorial tooling</p>
            <h1 className="text-3xl font-black tracking-tight">Offline catalog review pack</h1>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
              This is a local development review surface for the generated Government opportunity pack. It is not the public catalog, does not approve records, and is disabled in production.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Live reviewer queue</a>
            <a href="/admin/catalog/preflight" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Preflight</a>
          </div>
        </div>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xs text-indigo-700">Records</p><p className="mt-1 text-2xl font-black text-indigo-950">{pack.summary.totalRecords}</p></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs text-amber-800">In review</p><p className="mt-1 text-2xl font-black text-amber-950">{pack.summary.inReview}</p></div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4"><p className="text-xs text-cyan-700">Registered sources</p><p className="mt-1 text-2xl font-black text-cyan-950">{pack.summary.sourceRegistered}</p></div>
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs text-rose-800">Pending checks</p><p className="mt-1 text-2xl font-black text-rose-950">{pack.summary.pendingReviewChecks}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Publication-ready</p><p className="mt-1 text-2xl font-black text-slate-900">{pack.summary.publicationReady}</p></div>
        </section>

        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
          <strong>Review gate:</strong> {pack.interpretation} Generated {new Date(pack.generatedAt).toLocaleString()}.
        </div>

        <form method="get" className="mb-4 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <label className="sr-only" htmlFor="offline-review-search">Search review pack</label>
          <input id="offline-review-search" name="q" defaultValue={query} placeholder="Search scheme, authority, slug, type, or source URL" className="min-w-72 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2" />
          <label className="sr-only" htmlFor="offline-review-batch">Review batch</label>
          <select id="offline-review-batch" name="batch" defaultValue={selectedBatchId} className="min-w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2">
            <option value="">All review batches ({batches.summary.opportunityRecords})</option>
            {batches.batches.map(batch => <option key={batch.batchId} value={batch.batchId}>{batch.batchId} | {batch.authorityName} ({batch.recordCount})</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white">Search</button>
          {(query || selectedBatchId) && <a href="/admin/catalog/offline-review" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Clear</a>}
        </form>

        {selectedBatch && <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-950"><strong>{selectedBatch.batchId}</strong> | {selectedBatch.authorityName} | {selectedBatch.recordCount} records. Complete the evidence checks for this batch before moving to the next one.</div>}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <p className="text-slate-600">{filteredRecords.length ? `Showing ${firstRecord + 1}–${Math.min(firstRecord + pageSize, filteredRecords.length)} of ${filteredRecords.length}` : 'No matching records'}{query ? ` for “${query}”` : ''}</p>
          <div className="flex gap-2">
            <a href={boundedPage > 1 ? `/admin/catalog/offline-review?page=${boundedPage - 1}&q=${encodeURIComponent(query)}&batch=${encodeURIComponent(selectedBatchId)}` : '#'} aria-disabled={boundedPage === 1} className={`rounded-lg border px-3 py-2 font-semibold ${boundedPage === 1 ? 'pointer-events-none border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600'}`}>Previous</a>
            <span className="rounded-lg bg-slate-100 px-3 py-2 font-semibold text-slate-600">Page {boundedPage} of {totalPages}</span>
            <a href={boundedPage < totalPages ? `/admin/catalog/offline-review?page=${boundedPage + 1}&q=${encodeURIComponent(query)}&batch=${encodeURIComponent(selectedBatchId)}` : '#'} aria-disabled={boundedPage === totalPages} className={`rounded-lg border px-3 py-2 font-semibold ${boundedPage === totalPages ? 'pointer-events-none border-slate-100 text-slate-300' : 'border-slate-200 text-slate-600'}`}>Next</a>
          </div>
        </div>

        <section className="grid gap-4">
          {visibleRecords.map(record => (
            <details key={record.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{record.opportunityType}</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{record.reviewStatus}</span>
                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-700">{record.publicationStatus}</span>
                      <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-700">{batchBySlug.get(record.slug) ?? 'unbatched'}</span>
                    </div>
                    <h2 className="text-xl font-bold">{record.name}</h2>
                    <p className="mt-1 text-sm text-slate-600">{record.authority} · {record.slug}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Source: {record.source.liveSnapshot.status}</p>
                    <p>{record.reviewChecklist.filter(check => check.status === 'pending').length} checks pending</p>
                  </div>
                </div>
              </summary>

              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 lg:grid-cols-2">
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold">Official provenance</h3>
                  <p className="mt-2 break-all text-xs text-indigo-700">{record.source.url ?? 'Missing source URL'}</p>
                  <p className="mt-2 text-xs text-slate-600">Anchor: {record.source.anchor ?? 'Missing anchor'}</p>
                  <p className="mt-2 text-xs text-slate-600">Registered: {record.source.registered ? 'Yes' : 'No'} · Snapshot: {record.source.liveSnapshot.status}</p>
                  {record.source.liveSnapshot.snapshotPath && <a href={`/admin/catalog/offline-review/snapshot?slug=${encodeURIComponent(record.slug)}&path=${encodeURIComponent(record.source.liveSnapshot.snapshotPath)}`} className="mt-3 inline-block rounded-lg border border-indigo-200 bg-white px-3 py-2 text-xs font-semibold text-indigo-700 underline">Open captured snapshot</a>}
                  {record.canonicalUrl && <a href={record.canonicalUrl} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs text-indigo-700 underline">Open canonical source</a>}
                </section>
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold">Review checklist</h3>
                  <ul className="mt-2 grid gap-1 text-xs text-slate-600">{record.reviewChecklist.map(check => <li key={check.key}><span className={check.status === 'passed' ? 'text-emerald-700' : 'text-amber-700'}>{check.status}</span> · {check.label}{check.note ? ` — ${check.note}` : ''}</li>)}</ul>
                </section>
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold">Eligibility</h3>
                  <p className="mt-2 text-xs text-slate-600"><strong>Entities:</strong> {list(record.eligibility.entityTypes)}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Stages:</strong> {list(record.eligibility.lifecycleStages)}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Industries:</strong> {list(record.eligibility.industries)}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Locations:</strong> {list(record.eligibility.locations)}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Unknown handling:</strong> {record.eligibility.unknownHandling}</p>
                  <details className="mt-3"><summary className="cursor-pointer text-xs font-semibold text-indigo-700">Open thresholds and conditions</summary><pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{json({ conditions: record.eligibility.conditions, thresholds: record.eligibility.thresholds, exclusions: record.eligibility.exclusions })}</pre></details>
                </section>
                <section className="rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-bold">Benefit and application</h3>
                  <p className="mt-2 text-xs text-slate-600"><strong>Benefit:</strong> {record.benefit.label ?? 'Not recorded'} · {record.benefit.type ?? 'type missing'}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Separate value:</strong> {record.benefit.amountMin ?? '—'} to {record.benefit.amountMax ?? '—'} · {record.benefit.percentage ?? '—'}%</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Portal:</strong> {record.application.portal ?? 'Not recorded'}</p>
                  <p className="mt-2 text-xs text-slate-600"><strong>Window:</strong> {record.window.label ?? record.window.type ?? 'Not recorded'}</p>
                  <details className="mt-3"><summary className="cursor-pointer text-xs font-semibold text-indigo-700">Open steps and fine print</summary><pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{json({ application: record.application, windowEvidence: record.window.evidence, finePrint: record.finePrint })}</pre></details>
                </section>
                <section className="rounded-xl border border-amber-100 bg-amber-50/60 p-4 lg:col-span-2">
                  <h3 className="text-sm font-bold text-amber-950">Next editorial action</h3>
                  <p className="mt-2 text-xs leading-5 text-amber-900">{record.nextAction.replaceAll('_', ' ')}</p>
                  <p className="mt-2 text-xs text-amber-900">Seed file: {record.seedFile}</p>
                </section>
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  )
}
