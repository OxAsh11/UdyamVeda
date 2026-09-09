'use client'

import { FormEvent, useEffect, useState } from 'react'

type GateCheck = {
  id: string
  label: string
  passed: boolean
  value: string
  detail: string
}

type AuditCandidate = {
  versionId: string
  name: string
  slug: string
  status: string
}

type GatePayload = {
  ready?: boolean
  checks?: GateCheck[]
  latestAudit?: { sample_size: number; accurate_count: number; accuracy_percent: number; completed_at: string } | null
  auditCandidates?: AuditCandidate[]
  evaluatedAt?: string
  error?: string
}

type AuditMark = 'accurate' | 'inaccurate'

export default function CatalogGatePage() {
  const [payload, setPayload] = useState<GatePayload | null>(null)
  const [message, setMessage] = useState('Loading beta gate...')
  const [auditMarks, setAuditMarks] = useState<Record<string, AuditMark>>({})
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function loadGate() {
    const response = await fetch('/api/admin/catalog/gate', { cache: 'no-store' })
    const next = (await response.json()) as GatePayload
    if (!response.ok) {
      setMessage(next.error ?? 'Unable to evaluate the Central beta gate.')
      return
    }
    setPayload(next)
    setMessage('')
  }

  useEffect(() => {
    void Promise.resolve().then(loadGate)
  }, [])

  function toggleCandidate(versionId: string) {
    setAuditMarks(current => {
      const next = { ...current }
      if (next[versionId]) delete next[versionId]
      else next[versionId] = 'accurate'
      return next
    })
  }

  function setMark(versionId: string, mark: AuditMark) {
    setAuditMarks(current => ({ ...current, [versionId]: mark }))
  }

  async function recordAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const sampleVersionIds = Object.keys(auditMarks)
    const inaccurateVersionIds = sampleVersionIds.filter(versionId => auditMarks[versionId] === 'inaccurate')
    if (sampleVersionIds.length < 20) {
      setFormError('Select at least 20 approved opportunity versions for the audit sample.')
      return
    }
    if (!notes.trim()) {
      setFormError('Add the sampling method and source notes before recording the audit.')
      return
    }
    setFormError('')
    setSaving(true)
    const response = await fetch('/api/admin/catalog/gate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sampleVersionIds, inaccurateVersionIds, notes }),
    })
    const next = (await response.json()) as GatePayload
    setSaving(false)
    if (!response.ok) {
      setFormError(next.error ?? 'The audit could not be recorded.')
      return
    }
    setAuditMarks({})
    setNotes('')
    await loadGate()
  }

  const sampleSize = Object.keys(auditMarks).length
  const inaccurateCount = Object.values(auditMarks).filter(mark => mark === 'inaccurate').length

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Central beta gate</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">This is a release checklist, not a progress estimate. All checks must pass before the Central Government catalog is called beta-ready.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
            <a href="/admin/catalog/coverage" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Coverage matrix</a>
            <button onClick={() => void loadGate()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Re-evaluate</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        {payload && <>
          <section className={`rounded-2xl border p-6 shadow-sm ${payload.ready ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
            <p className="text-xs font-bold uppercase tracking-[0.18em]">Release decision</p>
            <h2 className="mt-2 text-3xl font-black">{payload.ready ? 'Central beta ready' : 'Not ready yet'}</h2>
            <p className="mt-2 text-sm">Evaluated {payload.evaluatedAt ? new Date(payload.evaluatedAt).toLocaleString() : '—'}. Failed checks remain release blockers.</p>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2">
            {(payload.checks ?? []).map(check => (
              <article key={check.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4"><h2 className="font-bold">{check.label}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${check.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{check.passed ? 'Pass' : 'Due'}</span></div>
                <p className="mt-4 text-2xl font-black">{check.value}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{check.detail}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Record a factual-accuracy audit</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Select at least 20 approved, active or upcoming opportunity versions. Mark each sampled record accurate or inaccurate after comparing it with the official source evidence. The aggregate is computed by the database.</p>
            <form onSubmit={recordAudit} className="mt-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4 text-sm"><span className="font-semibold text-slate-700">Selected sample: {sampleSize} records</span><span className="text-slate-500">Marked inaccurate: {inaccurateCount}</span></div>
              {(payload.auditCandidates ?? []).length === 0 ? <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">No approved active or upcoming records are available to sample yet. This is expected while the catalog is still in review.</div> : <div className="max-h-[32rem] space-y-2 overflow-auto rounded-xl border border-slate-200 p-3">{(payload.auditCandidates ?? []).map(candidate => { const mark = auditMarks[candidate.versionId]; return <div key={candidate.versionId} className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${mark ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}><input type="checkbox" checked={Boolean(mark)} onChange={() => toggleCandidate(candidate.versionId)} className="h-4 w-4 accent-indigo-600" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{candidate.name}</p><p className="truncate text-xs text-slate-500">{candidate.slug} · {candidate.status}</p></div>{mark && <select value={mark} onChange={event => setMark(candidate.versionId, event.target.value as AuditMark)} className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold"><option value="accurate">Accurate</option><option value="inaccurate">Inaccurate</option></select>}</div>})}</div>}
              <label className="mt-4 block text-sm font-semibold">Sampling notes<textarea required value={notes} onChange={event => setNotes(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2 font-normal" placeholder="Describe the source mix, selection method, and reviewer observations" /></label>
              {formError && <p className="mt-3 text-sm font-semibold text-rose-700" role="alert">{formError}</p>}
              <button disabled={saving || sampleSize < 20 || !(payload.auditCandidates ?? []).length} type="submit" className="mt-4 rounded-xl bg-[#3f46e8] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving...' : 'Record audit sample'}</button>
            </form>
            {payload.latestAudit && <p className="mt-4 text-xs text-slate-500">Latest audit: {payload.latestAudit.accurate_count}/{payload.latestAudit.sample_size} accurate ({Number(payload.latestAudit.accuracy_percent).toFixed(2)}%).</p>}
          </section>
        </>}
      </div>
    </main>
  )
}
