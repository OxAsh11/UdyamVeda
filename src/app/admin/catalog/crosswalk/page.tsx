'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Authority = {
  authorityLevel: string
  authorityName: string
  authorityUrl: string
  directOpportunityCount: number
  sourceHostEvidenceOnlyCount: number
  nameCandidateCount: number
  opportunitySlugs: string[]
  discoveryDisposition: 'opportunity_evidence_present' | 'no_explicit_seed_evidence'
  nextAction: string
}

type OpportunityRecord = {
  slug: string
  name: string
  mapping: string
  declaredAuthority: string
  declaredAuthorityUrl: string
  seedFile: string
  nextAction: string
  candidateAuthorities?: Array<{ authorityLevel: string; authorityName: string; authorityUrl: string; matchBasis?: string }>
  reviewDecision?: { decision: string; mapping_kind: string; evidence_url: string | null; evidence_anchor: string | null; reviewer_note: string | null; reviewed_at: string | null } | null
}

type Crosswalk = {
  interpretation: string
  summary: {
    authorityCount: number
    opportunityRecordCount: number
    authorityWithOpportunityEvidence: number
    authoritiesWithoutExplicitSeedEvidence: number
    mappingCounts: Record<string, number>
  }
  authorities: Authority[]
  opportunityRecords: OpportunityRecord[]
  reviewSummary?: { total: number; decided: number; pending: number }
}

type Filter = 'all' | 'no_evidence' | 'unresolved_records'

function displayMapping(mapping: string) {
  if (mapping === 'exact_authority_portal') return 'Exact authority portal'
  if (mapping === 'same_authority_host') return 'Same official host'
  if (mapping === 'source_host_evidence_only') return 'Source-host evidence only'
  return 'Unresolved'
}

function displayCandidateBasis(value: string | undefined) {
  if (value === 'declared_authority_name_candidate') return 'Name candidate only — verify officially'
  if (value === 'source_host_evidence_only') return 'Source-host lead only'
  return value?.replaceAll('_', ' ') ?? 'Candidate'
}

export default function CatalogCrosswalkPage() {
  const [crosswalk, setCrosswalk] = useState<Crosswalk | null>(null)
  const [filter, setFilter] = useState<Filter>('no_evidence')
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('Loading authority crosswalk...')
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const [evidenceUrlDrafts, setEvidenceUrlDrafts] = useState<Record<string, string>>({})
  const [evidenceAnchorDrafts, setEvidenceAnchorDrafts] = useState<Record<string, string>>({})
  const [reviewerNoteDrafts, setReviewerNoteDrafts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadCrosswalk = useCallback(() => {
    return fetch('/api/admin/catalog/crosswalk', { cache: 'no-store' })
      .then(async response => {
        const payload = await response.json() as Crosswalk & { error?: string }
        if (!response.ok) throw new Error(payload.error ?? 'Unable to load the authority crosswalk.')
        setCrosswalk(payload)
        setMessage('')
      })
      .catch(error => setMessage(error instanceof Error ? error.message : 'Unable to load the authority crosswalk.'))
  }, [])

  useEffect(() => {
    void loadCrosswalk()
  }, [loadCrosswalk])

  async function decideRecord(record: OpportunityRecord, decision: 'confirmed' | 'excluded') {
    const reviewerNote = reviewerNoteDrafts[record.slug]?.trim() ?? ''
    const evidenceUrl = evidenceUrlDrafts[record.slug]?.trim() ?? record.declaredAuthorityUrl
    const evidenceAnchor = evidenceAnchorDrafts[record.slug]?.trim() ?? ''
    if (decision === 'excluded' && !reviewerNote) {
      setErrors(previous => ({ ...previous, [record.slug]: 'Add an explicit exclusion reason before excluding this opportunity.' }))
      return
    }
    if (decision === 'confirmed' && (!evidenceUrl || !evidenceAnchor)) {
      setErrors(previous => ({ ...previous, [record.slug]: 'A confirmed mapping requires a registered HTTPS evidence URL and precise anchor.' }))
      return
    }
    setErrors(previous => ({ ...previous, [record.slug]: '' }))
    setBusySlug(record.slug)
    const response = await fetch('/api/admin/catalog/crosswalk', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ slug: record.slug, decision, mappingKind: record.mapping, authorityName: record.declaredAuthority, authorityUrl: record.declaredAuthorityUrl, evidenceUrl, evidenceAnchor, reviewerNote }),
    })
    const payload = await response.json() as { error?: string }
    setBusySlug(null)
    if (!response.ok) {
      setErrors(previous => ({ ...previous, [record.slug]: payload.error ?? 'The crosswalk decision could not be saved.' }))
      return
    }
    await loadCrosswalk()
  }

  const opportunityBySlug = useMemo(() => new Map((crosswalk?.opportunityRecords ?? []).map(record => [record.slug, record])), [crosswalk])
  const visibleAuthorities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return (crosswalk?.authorities ?? []).filter(authority => {
      if (filter === 'no_evidence' && authority.discoveryDisposition !== 'no_explicit_seed_evidence') return false
      if (filter === 'unresolved_records' && !authority.opportunitySlugs.some(slug => opportunityBySlug.get(slug)?.mapping === 'unresolved')) return false
      if (!normalizedQuery) return true
      return `${authority.authorityName} ${authority.authorityLevel}`.toLowerCase().includes(normalizedQuery)
    })
  }, [crosswalk, filter, opportunityBySlug, query])

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Authority-opportunity crosswalk</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">A review queue connecting the IGOD authority baseline to seeded opportunity evidence. This is not a publication decision.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/catalog/coverage" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Coverage matrix</a>
            <a href="/admin/catalog/relationships" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Authority relationships</a>
            <a href="/admin/catalog/discoveries" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Discoveries</a>
            <a href="/admin/catalog" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Review queue</a>
          </div>
        </div>

        {message && <div role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        {crosswalk && <>
          <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xs text-indigo-700">IGOD authorities</p><p className="mt-1 text-2xl font-black text-indigo-950">{crosswalk.summary.authorityCount}</p></div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4"><p className="text-xs text-cyan-700">Seeded opportunities</p><p className="mt-1 text-2xl font-black text-cyan-950">{crosswalk.summary.opportunityRecordCount}</p></div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs text-amber-800">Authorities with no seed evidence</p><p className="mt-1 text-2xl font-black text-amber-950">{crosswalk.summary.authoritiesWithoutExplicitSeedEvidence}</p></div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4"><p className="text-xs text-rose-800">Opportunity mappings unresolved</p><p className="mt-1 text-2xl font-black text-rose-950">{crosswalk.summary.mappingCounts.unresolved ?? 0}</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs text-emerald-800">Reviewer decisions</p><p className="mt-1 text-2xl font-black text-emerald-950">{crosswalk.reviewSummary?.decided ?? 0}/{crosswalk.reviewSummary?.total ?? crosswalk.summary.opportunityRecordCount}</p><p className="mt-1 text-[11px] text-emerald-800">{crosswalk.reviewSummary?.pending ?? crosswalk.summary.opportunityRecordCount} pending</p></div>
          </section>

          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">{crosswalk.interpretation}</div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {([['no_evidence', 'Authorities without evidence'], ['unresolved_records', 'Authorities with unresolved records'], ['all', 'All authorities']] as const).map(([value, label]) => (
              <button key={value} onClick={() => setFilter(value)} className={filter === value ? 'rounded-full bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600'}>{label}</button>
            ))}
            <label className="ml-auto min-w-64 text-sm text-slate-600"><span className="sr-only">Search authorities</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search authorities" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none ring-indigo-200 focus:ring-2" /></label>
          </div>

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4"><h2 className="text-lg font-bold">Opportunity mapping decisions</h2><p className="mt-1 text-sm text-slate-600">Every seeded opportunity must be confirmed against an IGOD authority with registered evidence or explicitly excluded with a documented reason.</p></div>
            <div className="grid gap-3">
              {(crosswalk.opportunityRecords ?? []).filter(record => record.mapping === 'unresolved' || !record.reviewDecision || record.reviewDecision.decision === 'pending').map(record => <article key={record.slug} className="rounded-xl border border-amber-100 bg-amber-50/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold text-slate-900">{record.name}</h3><p className="mt-1 text-xs text-slate-600">Declared authority: {record.declaredAuthority}</p><p className="mt-1 text-xs text-slate-500">{record.slug}</p></div><span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">{record.reviewDecision?.decision ?? 'pending'}</span></div>
                {record.nextAction && <p className="mt-2 text-xs text-slate-600">Next action: {record.nextAction.replaceAll('_', ' ')}</p>}
                {record.candidateAuthorities?.length ? <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3"><p className="text-xs font-bold uppercase tracking-wide text-indigo-800">Unverified authority candidates</p><ul className="mt-1 space-y-1 text-xs text-indigo-950">{record.candidateAuthorities.map(candidate => <li key={`${record.slug}-${candidate.authorityName}`}><span className="font-semibold">{candidate.authorityName}</span> · {displayCandidateBasis(candidate.matchBasis)} · <a href={candidate.authorityUrl} target="_blank" rel="noreferrer" className="underline">official portal</a></li>)}</ul></div> : null}
                <div className="mt-3 grid gap-3 rounded-xl border border-amber-200 bg-white p-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Registered official evidence URL
                      <input type="url" value={evidenceUrlDrafts[record.slug] ?? record.declaredAuthorityUrl} onChange={event => setEvidenceUrlDrafts(previous => ({ ...previous, [record.slug]: event.target.value }))} placeholder="https://official.example" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-600">Precise evidence anchor
                      <input value={evidenceAnchorDrafts[record.slug] ?? ''} onChange={event => setEvidenceAnchorDrafts(previous => ({ ...previous, [record.slug]: event.target.value }))} placeholder="Page, section, paragraph, or heading" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                    </label>
                  </div>
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Reviewer note <span className="font-normal text-slate-500">(required for exclusion)</span>
                    <textarea aria-label={`${record.name} crosswalk reviewer note`} rows={2} value={reviewerNoteDrafts[record.slug] ?? record.reviewDecision?.reviewer_note ?? ''} onChange={event => setReviewerNoteDrafts(previous => ({ ...previous, [record.slug]: event.target.value }))} placeholder="Explain the mapping decision or exclusion." className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                  </label>
                  {errors[record.slug] && <p className="text-xs font-semibold text-rose-700" role="alert">{errors[record.slug]}</p>}
                  <div className="flex flex-wrap gap-2"><button disabled={busySlug === record.slug} onClick={() => void decideRecord(record, 'confirmed')} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Confirm with evidence</button><button disabled={busySlug === record.slug} onClick={() => void decideRecord(record, 'excluded')} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Exclude with reason</button></div>
                </div>
              </article>)}
            </div>
          </section>

          <p className="mb-3 text-sm text-slate-500">Showing {visibleAuthorities.length} of {crosswalk.summary.authorityCount} authorities</p>
          <div className="grid gap-3">
            {visibleAuthorities.map(authority => (
              <details key={`${authority.authorityLevel}:${authority.authorityName}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{authority.authorityLevel}</p>
                      <h2 className="mt-1 text-lg font-bold">{authority.authorityName}</h2>
                      <p className="mt-1 text-xs text-slate-500">{authority.nextAction.replaceAll('_', ' ')}</p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Direct evidence: {authority.directOpportunityCount}</span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Source-host only: {authority.sourceHostEvidenceOnlyCount}</span>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-800">Name candidates: {authority.nameCandidateCount}</span>
                    </div>
                  </div>
                </summary>
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <a href={authority.authorityUrl} target="_blank" rel="noreferrer" className="break-all text-sm text-indigo-700 underline underline-offset-2">{authority.authorityUrl}</a>
                  {authority.opportunitySlugs.length ? <div className="mt-4 grid gap-2">{authority.opportunitySlugs.map(slug => {
                    const record = opportunityBySlug.get(slug)
                    return <div key={slug} className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-semibold">{record?.name ?? slug}</p><p className="mt-1 text-xs text-slate-500">{record ? `${displayMapping(record.mapping)} · ${record.declaredAuthority}` : slug}</p>{record && <p className="mt-1 text-xs text-amber-700">Next: {record.nextAction.replaceAll('_', ' ')}</p>}</div>
                  })}</div> : <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">No explicit opportunity seed evidence is mapped to this authority. Crawl its official source pack and record either discovered opportunities or a documented exclusion reason.</p>}
                </div>
              </details>
            ))}
          </div>
        </>}
      </div>
    </main>
  )
}
