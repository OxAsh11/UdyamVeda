'use client'

import { useCallback, useEffect, useState } from 'react'

type Source = { url: string; title: string; role: string; captureRequired: boolean; sourceAnchor?: string }
type Capture = { sourceUrl: string; snapshotPath: string | null; contentHash: string | null; captureRole: string }
type ManualCapture = { snapshotId: string; sourceUrl: string; contentHash: string; captureMethod: string; status: string; createdAt: string }
type Resolution = { id: string; decision: string; alternate_source_url: string; alternate_snapshot_hash: string | null; evidence_anchor: string | null; reviewer_note: string; reviewed_at: string }
type Failure = {
  slug: string
  name: string
  sourceUrl: string
  failureKind: string
  attempts: number | null
  error: string
  status: string
  nextAction: string
  manualPath: string
  alternateOfficialSources: Source[]
  alternateCaptures: Capture[]
  manualCaptures: ManualCapture[]
  resolutions: Resolution[]
}
type Queue = { summary: { totalOpen: number; alternateCapturedPendingReview: number; publicationReady: number }; failures: Failure[] }
type Decision = 'accepted_as_supporting' | 'rejected' | 'needs_new_capture' | 'primary_retry_required'
type Draft = {
  alternateSourceUrl: string
  alternateSnapshotHash: string
  decision: Decision
  evidenceAnchor: string
  reviewerNote: string
  manualSourceUrl: string
  manualEvidence: string
  manualEvidenceAnchor: string
}

function initialDraft(failure: Failure): Draft {
  const captured = failure.alternateCaptures[0]
  const alternateSource = captured?.sourceUrl ?? failure.alternateOfficialSources[0]?.url ?? ''
  return {
    alternateSourceUrl: alternateSource,
    alternateSnapshotHash: captured?.contentHash ?? '',
    decision: captured?.contentHash ? 'accepted_as_supporting' : 'needs_new_capture',
    evidenceAnchor: '',
    reviewerNote: '',
    manualSourceUrl: failure.sourceUrl,
    manualEvidence: '',
    manualEvidenceAnchor: '',
  }
}

export default function CatalogSourceFailuresPage() {
  const [queue, setQueue] = useState<Queue | null>(null)
  const [message, setMessage] = useState('Loading source-resolution queue…')
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const [manualBusySlug, setManualBusySlug] = useState<string | null>(null)
  const [manualMessages, setManualMessages] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    const response = await fetch('/api/admin/catalog/source-failures', { cache: 'no-store' })
    const payload = await response.json() as Queue & { error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load source-resolution reviews.')
      return
    }
    setQueue(payload)
    setDrafts(previous => {
      const next = { ...previous }
      for (const failure of payload.failures ?? []) {
        if (!next[failure.slug]) next[failure.slug] = initialDraft(failure)
      }
      return next
    })
    setMessage(payload.failures?.length ? '' : 'No failed primary captures remain in the queue.')
  }, [])

  useEffect(() => { void Promise.resolve().then(load) }, [load])

  function updateDraft(slug: string, patch: Partial<Draft>) {
    setDrafts(previous => ({
      ...previous,
      [slug]: {
        ...(previous[slug] ?? {
          alternateSourceUrl: '',
          alternateSnapshotHash: '',
          decision: 'needs_new_capture',
          evidenceAnchor: '',
          reviewerNote: '',
          manualSourceUrl: '',
          manualEvidence: '',
          manualEvidenceAnchor: '',
        }),
        ...patch,
      },
    }))
  }

  async function save(failure: Failure) {
    const draft = drafts[failure.slug] ?? initialDraft(failure)
    setErrors(previous => ({ ...previous, [failure.slug]: '' }))
    setBusySlug(failure.slug)
    const response = await fetch('/api/admin/catalog/source-failures', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        slug: failure.slug,
        primarySourceUrl: failure.sourceUrl,
        alternateSourceUrl: draft.alternateSourceUrl,
        alternateSnapshotHash: draft.alternateSnapshotHash || undefined,
        decision: draft.decision,
        evidenceAnchor: draft.evidenceAnchor,
        reviewerNote: draft.reviewerNote,
      }),
    })
    const payload = await response.json() as { error?: string }
    setBusySlug(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [failure.slug]: payload.error ?? 'The source-resolution decision could not be saved.' }))
      return
    }
    await load()
  }

  async function saveManualEvidence(failure: Failure) {
    const draft = drafts[failure.slug] ?? initialDraft(failure)
    setManualBusySlug(failure.slug)
    setManualMessages(previous => ({ ...previous, [failure.slug]: '' }))
    const response = await fetch('/api/admin/catalog/source-failures/evidence', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        slug: failure.slug,
        primarySourceUrl: failure.sourceUrl,
        sourceUrl: draft.manualSourceUrl,
        content: draft.manualEvidence,
        evidenceAnchor: draft.manualEvidenceAnchor,
      }),
    })
    const payload = await response.json() as { error?: string; contentHash?: string }
    setManualBusySlug(null)
    setManualMessages(previous => ({
      ...previous,
      [failure.slug]: response.ok
        ? `Stored as review-blocked evidence. SHA-256: ${payload.contentHash ?? 'recorded'}`
        : (payload.error ?? 'Manual evidence could not be stored.'),
    }))
    if (response.ok) await load()
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Source-resolution queue</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Compare failed primary captures with exact registered official alternates. Accepted evidence remains review-blocked and never publishes a record automatically.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/preflight" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Preflight</a>
            <a href="/admin/catalog/changes" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source changes</a>
            <button onClick={() => void load()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh queue</button>
          </div>
        </div>

        {message && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        {queue && <>
          <section className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs text-rose-800">Open primary failures</p><p className="mt-1 text-2xl font-black text-rose-950">{queue.summary.totalOpen}</p></div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs text-amber-800">Alternate captures pending</p><p className="mt-1 text-2xl font-black text-amber-950">{queue.summary.alternateCapturedPendingReview}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-600">Publication-ready from this queue</p><p className="mt-1 text-2xl font-black text-slate-900">{queue.summary.publicationReady}</p></div>
          </section>

          <div className="grid gap-5">
            {queue.failures.map(failure => {
              const draft = drafts[failure.slug] ?? initialDraft(failure)
              return <article key={`${failure.slug}-${failure.sourceUrl}`} className="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div><span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-rose-800">{failure.status.replaceAll('_', ' ')}</span><h2 className="mt-3 text-xl font-bold">{failure.name}</h2><p className="mt-1 text-xs text-slate-500">{failure.failureKind} · {failure.attempts ?? '—'} attempt(s)</p></div>
                  <p className="max-w-sm text-xs leading-5 text-slate-500">{failure.nextAction.replaceAll('_', ' ')}.</p>
                </div>

                <div className="mt-4 grid gap-2 text-xs">
                  <div className="rounded-xl bg-rose-50 p-3"><p className="font-bold text-rose-900">Primary source failure</p><p className="mt-1 break-all text-rose-800">{failure.sourceUrl}</p><p className="mt-2 leading-5 text-rose-900">{failure.error}</p></div>
                  <details className="rounded-xl bg-slate-50 p-3">
                    <summary className="cursor-pointer font-bold text-slate-700">Resolution plan and official alternates</summary>
                    <p className="mt-2 leading-5 text-slate-600">{failure.manualPath}</p>
                    <ul className="mt-2 space-y-1">{failure.alternateOfficialSources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-700 underline">{source.title}</a> · {source.role.replaceAll('_', ' ')}</li>)}</ul>
                    {failure.alternateCaptures.length > 0 && <div className="mt-3 rounded-lg bg-amber-50 p-3"><p className="font-bold text-amber-900">Captured alternate snapshots</p>{failure.alternateCaptures.map(capture => <div key={`${capture.sourceUrl}-${capture.contentHash}`} className="mt-2"><p className="break-all text-amber-900">{capture.sourceUrl} · hash {capture.contentHash ?? 'missing'}</p>{capture.snapshotPath ? <a href={`/admin/catalog/offline-review/snapshot?path=${encodeURIComponent(capture.snapshotPath)}&slug=${encodeURIComponent(failure.slug)}`} className="mt-1 inline-block font-semibold text-indigo-700 underline">Open captured snapshot</a> : <p className="mt-1 text-amber-800">Snapshot file unavailable; capture or attach evidence before review.</p>}</div>)}</div>}
                  </details>
                </div>

                <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-sm font-black text-emerald-950">Manual evidence intake</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-900">Paste text copied from the exact primary or registered alternate official source. It will be hashed and stored as <strong>needs review</strong>; it cannot publish a record.</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Evidence source<select value={draft.manualSourceUrl} onChange={event => updateDraft(failure.slug, { manualSourceUrl: event.target.value })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700"><option value={failure.sourceUrl}>Current primary source</option>{failure.alternateOfficialSources.map(source => <option key={source.url} value={source.url}>{source.title}</option>)}</select></label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Precise evidence anchor<input value={draft.manualEvidenceAnchor} onChange={event => updateDraft(failure.slug, { manualEvidenceAnchor: event.target.value })} placeholder="Page, section, paragraph, or heading" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700" /></label>
                  </div>
                  <label className="mt-3 grid gap-1 text-xs font-semibold text-slate-600">Official source text<textarea rows={6} value={draft.manualEvidence} onChange={event => updateDraft(failure.slug, { manualEvidence: event.target.value })} placeholder="Paste official page or document text here. Do not paste passwords, OTPs, or personal identity numbers." className="rounded-lg border border-slate-200 bg-white p-2 font-mono text-[11px] font-normal leading-5 text-slate-700" /></label>
                  <div className="mt-3 flex flex-wrap items-center gap-3"><button disabled={manualBusySlug === failure.slug} onClick={() => void saveManualEvidence(failure)} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{manualBusySlug === failure.slug ? 'Storing…' : 'Store blocked evidence'}</button>{manualMessages[failure.slug] && <p className="text-xs font-semibold text-emerald-900" role="status">{manualMessages[failure.slug]}</p>}</div>
                  {failure.manualCaptures.length > 0 && <div className="mt-3 rounded-lg bg-white p-3 text-xs text-slate-600"><p className="font-bold text-slate-800">Stored manual snapshots</p>{failure.manualCaptures.map(capture => <p key={capture.snapshotId} className="mt-1 break-all">{capture.sourceUrl} · {capture.status} · {capture.contentHash}</p>)}</div>}
                </div>

                <div className="mt-5 grid gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Registered alternate source<select value={draft.alternateSourceUrl} onChange={event => { const capture = failure.alternateCaptures.find(item => item.sourceUrl === event.target.value); updateDraft(failure.slug, { alternateSourceUrl: event.target.value, alternateSnapshotHash: capture?.contentHash ?? '' }) }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700">{failure.alternateOfficialSources.map(source => <option key={source.url} value={source.url}>{source.title}</option>)}</select></label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Resolution decision<select value={draft.decision} onChange={event => updateDraft(failure.slug, { decision: event.target.value as Decision })} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700"><option value="accepted_as_supporting">Accept as supporting evidence</option><option value="rejected">Reject alternate</option><option value="needs_new_capture">Needs new capture</option><option value="primary_retry_required">Retry primary source</option></select></label>
                  </div>
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Captured snapshot hash<input value={draft.alternateSnapshotHash} onChange={event => updateDraft(failure.slug, { alternateSnapshotHash: event.target.value })} placeholder="Required when accepting captured evidence" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700" /></label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Evidence anchor<input value={draft.evidenceAnchor} onChange={event => updateDraft(failure.slug, { evidenceAnchor: event.target.value })} placeholder="Page, section, paragraph, or heading" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700" /></label>
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Reviewer note<textarea rows={2} value={draft.reviewerNote} onChange={event => updateDraft(failure.slug, { reviewerNote: event.target.value })} placeholder="Explain the source comparison and the next safe action." className="rounded-lg border border-slate-200 bg-white p-2 text-xs font-normal leading-5 text-slate-700" /></label>
                  {failure.resolutions.length > 0 && <div className="rounded-lg bg-white p-3 text-xs text-slate-600"><p className="font-bold text-slate-800">Latest recorded resolution</p><p className="mt-1">{failure.resolutions[0].decision.replaceAll('_', ' ')} · {new Date(failure.resolutions[0].reviewed_at).toLocaleString()}</p><p className="mt-1">{failure.resolutions[0].reviewer_note}</p></div>}
                  {errors[failure.slug] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[failure.slug]}</p>}
                  <button disabled={busySlug === failure.slug} onClick={() => void save(failure)} className="w-fit rounded-xl bg-[#3f46e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busySlug === failure.slug ? 'Saving…' : 'Record resolution decision'}</button>
                </div>
              </article>
            })}
          </div>
        </>}
      </div>
    </main>
  )
}
