'use client'

import { useEffect, useState } from 'react'

type Discovery = {
  id: string
  name: string
  canonical_url: string | null
  opportunity_type: string | null
  lifecycle_status: string
  business_relevance: string
  assessment_status: string
  exclusion_reason: string | null
  linked_opportunity_id: string | null
  source_registry: { name: string; url: string } | Array<{ name: string; url: string }> | null
}

type ApprovedOpportunity = {
  id: string
  name: string
  slug: string
  status: string
}

function sourceName(value: Discovery['source_registry']) {
  const source = Array.isArray(value) ? value[0] : value
  return source?.name ?? 'Registered source'
}

export default function CatalogDiscoveriesPage() {
  const [rows, setRows] = useState<Discovery[]>([])
  const [approvedOpportunities, setApprovedOpportunities] = useState<ApprovedOpportunity[]>([])
  const [selectedOpportunity, setSelectedOpportunity] = useState<Record<string, string>>({})
  const [exclusionDrafts, setExclusionDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('Loading discoveries…')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadDiscoveries() {
    const response = await fetch('/api/admin/catalog/discoveries', { cache: 'no-store' })
    const payload = (await response.json()) as { data?: Discovery[]; approvedOpportunities?: ApprovedOpportunity[]; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load discoveries.')
      return
    }
    setRows(payload.data ?? [])
    setApprovedOpportunities(payload.approvedOpportunities ?? [])
    setSelectedOpportunity(previous => {
      const next = { ...previous }
      for (const row of payload.data ?? []) if (row.linked_opportunity_id) next[row.id] = row.linked_opportunity_id
      return next
    })
    setMessage(payload.data?.length ? '' : 'No active or upcoming discoveries have been staged yet.')
  }

  useEffect(() => {
    void Promise.resolve().then(loadDiscoveries)
  }, [])

  async function assess(row: Discovery, businessRelevance: 'relevant' | 'not_relevant' | 'unclear') {
    const exclusionReason = exclusionDrafts[row.id]?.trim() ?? ''
    const linkedOpportunityId = businessRelevance === 'relevant' ? selectedOpportunity[row.id] ?? '' : ''
    if (businessRelevance === 'not_relevant' && !exclusionReason) {
      setErrors(previous => ({ ...previous, [row.id]: 'Add an exclusion reason before marking this discovery not relevant.' }))
      return
    }
    if (businessRelevance === 'relevant' && !linkedOpportunityId) {
      setErrors(previous => ({ ...previous, [row.id]: 'Select an approved opportunity before marking this discovery relevant.' }))
      return
    }
    setErrors(previous => ({ ...previous, [row.id]: '' }))
    setBusyId(row.id)
    const response = await fetch('/api/admin/catalog/discoveries', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ discoveryId: row.id, businessRelevance, exclusionReason, linkedOpportunityId: linkedOpportunityId || undefined }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [row.id]: payload.error ?? 'The discovery assessment could not be saved.' }))
      return
    }
    await loadDiscoveries()
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Opportunity discoveries</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Every active or upcoming opportunity found in an official-source crawl must be assessed, linked to an approved record, or excluded with a documented reason before the Central beta gate can pass.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <a href="/admin/catalog/drafts" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Drafts</a>
            <button onClick={() => void loadDiscoveries()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh list</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <div className="grid gap-4">
          {rows.map(row => (
            <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{row.opportunity_type ?? 'opportunity'}</span>
                    <span className={`rounded-full px-2.5 py-1 ${row.assessment_status === 'assessed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{row.assessment_status}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{row.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">Found in {sourceName(row.source_registry)}</p>
                  {row.canonical_url && <a href={row.canonical_url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-sm text-indigo-700 underline underline-offset-2">{row.canonical_url}</a>}
                </div>
                <div className="rounded-xl bg-slate-50 p-4 text-sm">
                  <p className="text-slate-500">Current assessment</p>
                  <p className="mt-1 font-bold">{row.business_relevance}</p>
                  {row.linked_opportunity_id && <p className="mt-1 max-w-48 truncate text-xs text-slate-500">Linked: {row.linked_opportunity_id}</p>}
                  {row.exclusion_reason && <p className="mt-2 max-w-sm text-xs leading-5 text-slate-600">{row.exclusion_reason}</p>}
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-2 border-t border-slate-100 pt-4">
                <label className="min-w-72 text-xs font-semibold text-slate-600">Approved opportunity<select value={selectedOpportunity[row.id] ?? ''} onChange={event => setSelectedOpportunity(previous => ({ ...previous, [row.id]: event.target.value }))} disabled={busyId === row.id || !approvedOpportunities.length} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700"><option value="">{approvedOpportunities.length ? 'Select approved record' : 'No approved records available'}</option>{approvedOpportunities.map(opportunity => <option key={opportunity.id} value={opportunity.id}>{opportunity.name} · {opportunity.status}</option>)}</select></label>
                <label className="min-w-72 flex-1 text-xs font-semibold text-slate-600">Exclusion reason <span className="font-normal text-slate-500">(required for not relevant)</span><textarea aria-label={`${row.name} exclusion reason`} rows={2} value={exclusionDrafts[row.id] ?? row.exclusion_reason ?? ''} onChange={event => setExclusionDrafts(previous => ({ ...previous, [row.id]: event.target.value }))} placeholder="Explain why this finding is outside the business catalog." className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" /></label>
                <button disabled={busyId === row.id || !selectedOpportunity[row.id] || !approvedOpportunities.length} onClick={() => void assess(row, 'relevant')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Relevant / link record</button>
                <button disabled={busyId === row.id} onClick={() => void assess(row, 'not_relevant')} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 disabled:opacity-50">Not relevant</button>
                <button disabled={busyId === row.id} onClick={() => void assess(row, 'unclear')} className="rounded-xl border border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 disabled:opacity-50">Needs more research</button>
              </div>
              {errors[row.id] && <p className="mt-3 text-xs font-semibold text-rose-700" role="alert">{errors[row.id]}</p>}
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
