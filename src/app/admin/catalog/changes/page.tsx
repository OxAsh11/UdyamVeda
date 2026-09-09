'use client'

import { useEffect, useState } from 'react'

type Snapshot = { id: string; body_markdown: string; content_hash: string; created_at: string }
type ChangeEvent = {
  id: string
  event_type: string
  previous_content_hash: string | null
  content_hash: string
  summary: string
  review_status: string
  reviewer_note: string | null
  created_at: string
  source_registry: { name: string; url: string } | Array<{ name: string; url: string }> | null
  current_snapshot: Snapshot | null
  previous_snapshot: Snapshot | null
  diff: { rows: Array<{ kind: 'same' | 'added' | 'removed'; text: string }>; added: number; removed: number; truncated: boolean } | null
}

function sourceName(value: ChangeEvent['source_registry']) {
  const source = Array.isArray(value) ? value[0] : value
  return source?.name ?? 'Registered source'
}

export default function CatalogChangesPage() {
  const [events, setEvents] = useState<ChangeEvent[]>([])
  const [message, setMessage] = useState('Loading source changes…')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function loadChanges() {
    const response = await fetch('/api/admin/catalog/changes', { cache: 'no-store' })
    const payload = (await response.json()) as { data?: ChangeEvent[]; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load source changes.')
      return
    }
    setEvents(payload.data ?? [])
    setMessage(payload.data?.length ? '' : 'No source change events have been recorded.')
  }

  useEffect(() => {
    void Promise.resolve().then(loadChanges)
  }, [])

  async function updateEvent(changeId: string, action: 'review' | 'ignore') {
    const reviewerNote = noteDrafts[changeId]?.trim() ?? ''
    if (action === 'ignore' && !reviewerNote) {
      setErrors(previous => ({ ...previous, [changeId]: 'Add a note explaining why this source change is safe to ignore.' }))
      return
    }
    setErrors(previous => ({ ...previous, [changeId]: '' }))
    setBusyId(changeId)
    const response = await fetch('/api/admin/catalog/changes', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ changeId, action, reviewerNote }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [changeId]: payload.error ?? 'The change status could not be saved.' }))
      return
    }
    await loadChanges()
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Source changes</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Compare stored source snapshots before changing a published record. Reviewing a change does not publish extracted content automatically.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/sources" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source registry</a>
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <button onClick={() => void loadChanges()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh list</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <div className="grid gap-5">
          {events.map(event => (
            <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{event.event_type}</span>
                    <span className={`rounded-full px-2.5 py-1 ${event.review_status === 'open' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{event.review_status}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{sourceName(event.source_registry)}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.summary}</p>
                </div>
                <p className="text-xs text-slate-500">{new Date(event.created_at).toLocaleString()}</p>
              </div>

              <div className="mt-5 grid gap-3 text-xs md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Previous hash</p><p className="mt-1 break-all font-mono">{event.previous_content_hash ?? 'None'}</p></div>
                <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-500">Current hash</p><p className="mt-1 break-all font-mono">{event.content_hash}</p></div>
              </div>

              {event.event_type === 'changed' && event.diff && <div className="mt-5 rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold">Deterministic line diff</p><p className="text-xs text-slate-500">{event.diff.added} added · {event.diff.removed} removed{event.diff.truncated ? ' · truncated' : ''}</p></div>
                <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-slate-950 p-3 text-xs leading-5 text-slate-100">{event.diff.rows.map((row, index) => <span key={`${index}-${row.kind}`} className={`block ${row.kind === 'added' ? 'bg-emerald-900/60 text-emerald-200' : row.kind === 'removed' ? 'bg-rose-900/60 text-rose-200' : 'text-slate-300'}`}>{row.kind === 'added' ? '+ ' : row.kind === 'removed' ? '- ' : '  '}{row.text}{'\n'}</span>)}</pre>
              </div>}

              {event.event_type === 'changed' && <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <details className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer text-sm font-bold">Previous snapshot</summary>
                  <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-600">{event.previous_snapshot?.body_markdown ?? 'Previous snapshot unavailable.'}</pre>
                </details>
                <details className="rounded-xl border border-slate-200 p-4">
                  <summary className="cursor-pointer text-sm font-bold">Current snapshot</summary>
                  <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-600">{event.current_snapshot?.body_markdown ?? 'Current snapshot unavailable.'}</pre>
                </details>
              </div>}

              {event.reviewer_note && <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600"><strong>Reviewer note:</strong> {event.reviewer_note}</p>}

              {event.review_status === 'open' && <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4">
                <label className="grid gap-1 text-xs font-semibold text-slate-600">Reviewer note <span className="font-normal text-slate-500">(required to ignore; optional when marking reviewed)</span>
                  <textarea aria-label={`${sourceName(event.source_registry)} reviewer note`} rows={2} value={noteDrafts[event.id] ?? ''} onChange={change => setNoteDrafts(previous => ({ ...previous, [event.id]: change.target.value }))} placeholder="What did the snapshot comparison establish?" className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                </label>
                {errors[event.id] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[event.id]}</p>}
                <div className="flex flex-wrap gap-2">
                  <button disabled={busyId === event.id} onClick={() => void updateEvent(event.id, 'review')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Mark reviewed</button>
                  <button disabled={busyId === event.id} onClick={() => void updateEvent(event.id, 'ignore')} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50">Ignore event</button>
                </div>
              </div>}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
