'use client'

import { useEffect, useState } from 'react'

type Draft = {
  id: string
  payload: Record<string, unknown>
  completeness: number
  validation_errors: string[]
  validation_warnings: string[]
  extraction_model: string | null
  status: string
  created_at: string
  source_snapshot: { content_hash: string; created_at: string } | Array<{ content_hash: string; created_at: string }> | null
}

function text(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export default function CatalogDraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [message, setMessage] = useState('Loading extracted drafts…')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)

  async function loadDrafts() {
    const response = await fetch('/api/admin/catalog/drafts', { cache: 'no-store' })
    const payload = (await response.json()) as { data?: Draft[]; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load extracted drafts.')
      return
    }
    setDrafts(payload.data ?? [])
    setMessage(payload.data?.length ? '' : 'No extracted drafts are waiting for review.')
  }

  useEffect(() => {
    void Promise.resolve().then(loadDrafts)
  }, [])

  async function act(draftId: string, action: 'promote' | 'reject') {
    const notes = noteDrafts[draftId]?.trim() ?? ''
    setErrors(previous => ({ ...previous, [draftId]: '' }))
    setBusyId(draftId)
    const response = await fetch('/api/admin/catalog/drafts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ draftId, action, notes }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [draftId]: payload.error ?? 'The draft action could not be completed.' }))
      return
    }
    await loadDrafts()
  }

  async function importLegacyDrafts() {
    setImporting(true)
    const response = await fetch('/api/admin/catalog/legacy-import', { method: 'POST' })
    const payload = (await response.json()) as { imported?: number; skipped?: number; failures?: string[]; error?: string }
    setImporting(false)
    if (!response.ok && response.status !== 207) {
      setMessage(payload.error ?? 'The legacy catalog could not be imported.')
      return
    }
    setMessage(`Legacy import complete: ${payload.imported ?? 0} added, ${payload.skipped ?? 0} already present, ${(payload.failures ?? []).length} failed. Imported records remain review-blocked.`)
    await loadDrafts()
    setMessage(`Legacy import complete: ${payload.imported ?? 0} added, ${payload.skipped ?? 0} already present, ${(payload.failures ?? []).length} failed. Imported records remain review-blocked.`)
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Extracted drafts</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">AI output is shown with validation warnings. Promotion creates an in-review version; it does not publish the opportunity.</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <a href="/admin/catalog/sources" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source registry</a>
            <button disabled={importing} onClick={() => void importLegacyDrafts()} className="rounded-xl bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{importing ? 'Importing…' : 'Import legacy drafts'}</button>
            <button onClick={() => void loadDrafts()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh list</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <div className="grid gap-5">
          {drafts.map(draft => {
            const payload = draft.payload
            const sourceSnapshot = Array.isArray(draft.source_snapshot) ? draft.source_snapshot[0] : draft.source_snapshot
            const sources = Array.isArray(payload.sources) ? payload.sources as Array<Record<string, unknown>> : []
            return (
              <article key={draft.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{text(payload.opportunity_type, 'scheme')}</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{draft.status}</span>
                    </div>
                    <h2 className="text-xl font-bold">{text(payload.name, 'Untitled extracted opportunity')}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{text(payload.objective, 'No objective was extracted.')}</p>
                  </div>
                  <div className="min-w-40 rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="text-slate-500">Completeness</p>
                    <p className="mt-1 text-2xl font-black">{Math.round(Number(draft.completeness) * 100)}%</p>
                    <p className="mt-1 text-xs text-slate-500">{draft.extraction_model ?? 'Model not recorded'}</p>
                  </div>
                </div>

                {draft.validation_errors.length > 0 && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><p className="font-bold">Blocking validation errors</p><ul className="mt-2 list-disc pl-5">{draft.validation_errors.map(error => <li key={error}>{error}</li>)}</ul></div>}
                {draft.validation_warnings.length > 0 && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><p className="font-bold">Reviewer warnings</p><ul className="mt-2 list-disc pl-5">{draft.validation_warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></div>}

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Extracted sources</p>
                  <div className="mt-2 grid gap-2">
                    {sources.map((source, index) => <a key={index} href={text(source.url, '#')} target="_blank" rel="noreferrer" className="text-sm text-indigo-700 underline underline-offset-2">{text(source.title, text(source.url, 'Source'))}{source.anchor ? ' · ' + String(source.anchor) : ''}</a>)}
                    {sources.length === 0 && <span className="text-sm text-slate-500">No source entries extracted.</span>}
                  </div>
                  {sourceSnapshot && <p className="mt-3 text-xs text-slate-500">Snapshot hash: <span className="font-mono">{sourceSnapshot.content_hash.slice(0, 16)}</span></p>}
                </div>

                <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Reviewer note <span className="font-normal text-slate-500">(optional for promotion; recommended for rejection)</span>
                    <textarea aria-label={`${text(payload.name, 'Draft')} reviewer note`} rows={2} value={noteDrafts[draft.id] ?? ''} onChange={event => setNoteDrafts(previous => ({ ...previous, [draft.id]: event.target.value }))} placeholder="Record what was checked or what needs correction." className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                  </label>
                  {errors[draft.id] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[draft.id]}</p>}
                  <div className="flex flex-wrap gap-2">
                  <button disabled={busyId === draft.id || draft.validation_errors.length > 0} onClick={() => void act(draft.id, 'promote')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Promote to review queue</button>
                  <button disabled={busyId === draft.id} onClick={() => void act(draft.id, 'reject')} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 disabled:opacity-50">Reject draft</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}
