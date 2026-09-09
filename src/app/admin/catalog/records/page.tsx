'use client'

import { useEffect, useState } from 'react'

type CurrentVersion = {
  id: string
  version_number: number
  title: string
  review_status: string
  completeness: number
  last_verified_at: string | null
}

type RecordRow = {
  id: string
  slug: string
  name: string
  opportunity_type: string
  status: string
  current_version_id: string | null
  updated_at: string
  current_version: CurrentVersion | CurrentVersion[] | null
}
type RecordDraft = { archiveReason: string; correctionReason: string; sourceUrl: string; sourceKind: string; sourceAnchor: string; patchText: string }

function currentVersion(value: RecordRow['current_version']) {
  return Array.isArray(value) ? value[0] : value
}

export default function CatalogRecordsPage() {
  const [records, setRecords] = useState<RecordRow[]>([])
  const [message, setMessage] = useState('Loading catalog records…')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, RecordDraft>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  function draftFor(record: RecordRow) {
    return drafts[record.id] ?? { archiveReason: '', correctionReason: '', sourceUrl: '', sourceKind: 'ministry', sourceAnchor: '', patchText: '' }
  }

  async function loadRecords() {
    const response = await fetch('/api/admin/catalog/records', { cache: 'no-store' })
    const payload = (await response.json()) as { data?: RecordRow[]; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load catalog records.')
      return
    }
    setRecords(payload.data ?? [])
    setMessage(payload.data?.length ? '' : 'No catalog records have been staged.')
  }

  useEffect(() => {
    void Promise.resolve().then(loadRecords)
  }, [])

  async function archive(record: RecordRow) {
    const reason = draftFor(record).archiveReason.trim()
    if (!reason) {
      setErrors(previous => ({ ...previous, [record.id]: 'Add an archive reason before continuing.' }))
      return
    }
    setErrors(previous => ({ ...previous, [record.id]: '' }))
    setBusyId(record.id)
    const response = await fetch('/api/admin/catalog/records', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ opportunityId: record.id, action: 'archive', reason }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [record.id]: payload.error ?? 'The record could not be archived.' }))
      return
    }
    await loadRecords()
  }

  async function createCorrection(record: RecordRow) {
    const draft = draftFor(record)
    const reason = draft.correctionReason.trim()
    const sourceUrl = draft.sourceUrl.trim()
    const sourceKind = draft.sourceKind.trim()
    const sourceAnchor = draft.sourceAnchor.trim()
    const patchText = draft.patchText.trim()
    if (!reason || !sourceUrl || !sourceKind || !sourceAnchor) {
      setErrors(previous => ({ ...previous, [record.id]: 'Correction requires a reason, fresh HTTPS source URL, source type, and precise source anchor.' }))
      return
    }
    let patch: Record<string, unknown> = {}
    if (patchText.trim()) {
      try {
        const parsed = JSON.parse(patchText) as unknown
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('The correction patch must be a JSON object.')
        patch = parsed as Record<string, unknown>
      } catch {
        setErrors(previous => ({ ...previous, [record.id]: 'The correction patch must be valid JSON object.' }))
        return
      }
    }
    setErrors(previous => ({ ...previous, [record.id]: '' }))
    setBusyId(record.id)
    const response = await fetch('/api/admin/catalog/records', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        opportunityId: record.id,
        action: 'create_revision',
        reason,
        patch,
        sources: [{ source_url: sourceUrl, source_kind: sourceKind, source_title: 'Reviewer-supplied correction source', source_anchor: sourceAnchor, is_primary: true }],
      }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [record.id]: payload.error ?? 'The correction could not be created.' }))
      return
    }
    setMessage('Correction created as an in-review version. The current published version remains unchanged until approval.')
    await loadRecords()
    setMessage('Correction created as an in-review version. The current published version remains unchanged until approval.')
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Catalog records</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Archive outdated records or create a correction version with fresh official evidence. Corrections never overwrite the previous version.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <button onClick={() => void loadRecords()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh list</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <div className="grid gap-4">
          {records.map(record => {
            const version = currentVersion(record.current_version)
            return (
              <article key={record.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{record.opportunity_type}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{record.status}</span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold">{record.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{record.slug}</p>
                  </div>
                  {version && <div className="rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="text-slate-500">Current version</p>
                    <p className="mt-1 font-bold">v{version.version_number} · {version.review_status}</p>
                    <p className="mt-1 text-xs text-slate-500">Completeness {Math.round(Number(version.completeness) * 100)}%</p>
                    <p className="mt-1 text-xs text-slate-500">Verified {version.last_verified_at?.slice(0, 10) ?? 'Not verified'}</p>
                  </div>}
                </div>
                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4">
                  <div className="grid gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Correction reason
                      <textarea aria-label={`${record.name} correction reason`} rows={2} value={draftFor(record).correctionReason} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), correctionReason: event.target.value } }))} placeholder="Describe what must be corrected." className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Fresh official HTTPS source URL
                      <input type="url" value={draftFor(record).sourceUrl} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), sourceUrl: event.target.value } }))} placeholder="https://official.example" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Source type
                      <select value={draftFor(record).sourceKind} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), sourceKind: event.target.value } }))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700"><option value="gazette">Gazette</option><option value="guideline">Guideline</option><option value="ministry">Ministry</option><option value="agency">Agency</option><option value="myscheme">myScheme</option><option value="startup_india">Startup India</option><option value="pib">PIB</option></select>
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Precise source anchor
                      <input value={draftFor(record).sourceAnchor} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), sourceAnchor: event.target.value } }))} placeholder="Page, section, paragraph, or heading" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600 md:col-span-2">Optional JSON patch
                      <textarea aria-label={`${record.name} correction JSON patch`} rows={3} value={draftFor(record).patchText} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), patchText: event.target.value } }))} placeholder="Leave blank to copy the current version; otherwise use a JSON object." className="rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                  </div>
                  <div className="grid gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Archive reason
                      <textarea aria-label={`${record.name} archive reason`} rows={2} value={draftFor(record).archiveReason} onChange={event => setDrafts(previous => ({ ...previous, [record.id]: { ...draftFor(record), archiveReason: event.target.value } }))} placeholder="Explain why this record should be archived." className="rounded-lg border border-slate-200 bg-white p-2 text-sm font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                  </div>
                  {errors[record.id] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[record.id]}</p>}
                  <div className="flex flex-wrap gap-2">
                  <button disabled={busyId === record.id || record.status === 'archived'} onClick={() => void createCorrection(record)} className="rounded-xl bg-[#3f46e8] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Create correction</button>
                  <button disabled={busyId === record.id || record.status === 'archived'} onClick={() => void archive(record)} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 disabled:opacity-50">Archive record</button>
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
