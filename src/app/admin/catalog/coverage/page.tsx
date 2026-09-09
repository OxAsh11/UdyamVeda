'use client'

import { type FormEvent, useCallback, useEffect, useState } from 'react'

type CoverageRow = {
  id: string
  authority_level: string
  authority_name: string
  authority_url: string | null
  business_relevance: string
  assessment_status: string
  exclusion_reason: string | null
  assessment_note: string | null
  assessment_evidence_url: string | null
  assessment_evidence_anchor: string | null
  assessed_at: string | null
  source_registry: { name: string; url: string; expected_item_count: number | null } | Array<{ name: string; url: string; expected_item_count: number | null }> | null
}

type CoverageFilter = 'all' | 'needs_review' | 'assessed'

type CoveragePagination = {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

type CoverageSummary = {
  total: number
  assessed: number
  relevant: number
  excluded: number
  unclear: number
  ministryTotal: number
  ministryAssessed: number
  departmentTotal: number
  departmentAssessed: number
  unresolvedPortals: number
}

type AssessmentDecision = 'relevant' | 'not_relevant' | 'unclear'

type AssessmentDraft = {
  coverageId: string
  businessRelevance: AssessmentDecision
  exclusionReason: string
  assessmentNote: string
  assessmentEvidenceUrl: string
  assessmentEvidenceAnchor: string
}

function assessmentLabel(status: string) {
  if (status === 'assessed') return 'Assessed'
  if (status === 'in_progress') return 'Needs follow-up'
  return 'Not assessed'
}

function relevanceLabel(relevance: string) {
  if (relevance === 'relevant') return 'Relevant'
  if (relevance === 'not_relevant') return 'Not relevant'
  if (relevance === 'unclear') return 'Unclear'
  return 'Not decided'
}

function sourceName(source: CoverageRow['source_registry']) {
  const value = Array.isArray(source) ? source[0] : source
  return value?.name ?? 'Directory source'
}

export default function CatalogCoveragePage() {
  const [rows, setRows] = useState<CoverageRow[]>([])
  const [filter, setFilter] = useState<CoverageFilter>('needs_review')
  const [message, setMessage] = useState('Loading authority coverage…')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<CoveragePagination>({ page: 1, pageSize: 25, total: 0, hasMore: false })
  const [summary, setSummary] = useState<CoverageSummary>({ total: 0, assessed: 0, relevant: 0, excluded: 0, unclear: 0, ministryTotal: 0, ministryAssessed: 0, departmentTotal: 0, departmentAssessed: 0, unresolvedPortals: 0 })
  const [assessmentDraft, setAssessmentDraft] = useState<AssessmentDraft | null>(null)
  const [assessmentError, setAssessmentError] = useState('')

  const loadCoverage = useCallback(async () => {
    const response = await fetch(`/api/admin/catalog/coverage?page=${page}&pageSize=25&filter=${filter}`, { cache: 'no-store' })
    const payload = (await response.json()) as { data?: CoverageRow[]; pagination?: CoveragePagination; summary?: CoverageSummary; error?: string }
    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to load authority coverage.')
      return
    }
    setRows(payload.data ?? [])
    setPagination(payload.pagination ?? { page, pageSize: 25, total: payload.data?.length ?? 0, hasMore: false })
    setSummary(payload.summary ?? { total: 0, assessed: 0, relevant: 0, excluded: 0, unclear: 0, ministryTotal: 0, ministryAssessed: 0, departmentTotal: 0, departmentAssessed: 0, unresolvedPortals: 0 })
    setMessage(payload.data?.length ? '' : 'No authority rows have been discovered yet. Queue an IGOD refresh first.')
  }, [filter, page])

  async function exportCoverage() {
    const response = await fetch('/api/admin/catalog/coverage?format=csv', { cache: 'no-store' })
    if (!response.ok) {
      const payload = (await response.json()) as { error?: string }
      window.alert(payload.error ?? 'Unable to export authority coverage.')
      return
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'udyamveda-authority-coverage.csv'
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    void Promise.resolve().then(loadCoverage)
  }, [loadCoverage])

  function beginAssessment(row: CoverageRow, businessRelevance: AssessmentDecision) {
    setAssessmentError('')
    setAssessmentDraft({
      coverageId: row.id,
      businessRelevance,
      exclusionReason: row.exclusion_reason ?? '',
      assessmentNote: row.assessment_note ?? '',
      assessmentEvidenceUrl: row.assessment_evidence_url ?? '',
      assessmentEvidenceAnchor: row.assessment_evidence_anchor ?? '',
    })
  }

  function updateAssessmentDraft(field: keyof Omit<AssessmentDraft, 'coverageId' | 'businessRelevance'>, value: string) {
    setAssessmentDraft(current => current ? { ...current, [field]: value } : current)
  }

  async function submitAssessment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!assessmentDraft) return
    const { businessRelevance, exclusionReason, assessmentNote, assessmentEvidenceUrl, assessmentEvidenceAnchor } = assessmentDraft
    if (businessRelevance === 'not_relevant' && !exclusionReason.trim()) {
      setAssessmentError('Explain why this authority is excluded from the business catalog.')
      return
    }
    if (businessRelevance !== 'unclear' && (!assessmentEvidenceUrl.trim() || !assessmentEvidenceAnchor.trim())) {
      setAssessmentError('Terminal decisions require an official evidence URL and a precise page, section, or directory anchor.')
      return
    }
    if ((businessRelevance === 'relevant' || businessRelevance === 'unclear') && !assessmentNote.trim()) {
      setAssessmentError(businessRelevance === 'relevant' ? 'Describe the relevant official source scope.' : 'Describe what remains unclear and what the reviewer should verify next.')
      return
    }
    setBusyId(assessmentDraft.coverageId)
    const response = await fetch('/api/admin/catalog/coverage', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ coverageId: assessmentDraft.coverageId, businessRelevance, exclusionReason, assessmentNote, assessmentEvidenceUrl, assessmentEvidenceAnchor }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyId(null)
    if (!response.ok) {
      setAssessmentError(payload.error ?? 'The authority assessment could not be saved.')
      return
    }
    setAssessmentDraft(null)
    setAssessmentError('')
    await loadCoverage()
  }

  const assessed = summary.assessed
  const ministryExpected = 53
  const departmentExpected = 50
  const ministryAssessed = summary.ministryAssessed
  const departmentAssessed = summary.departmentAssessed
  const unresolvedPortals = summary.unresolvedPortals
  const unclearRows = summary.unclear
  const relevantRows = summary.relevant
  const excludedRows = summary.excluded
  const inventoryWarnings = [
    { label: 'Union ministries', discovered: summary.ministryTotal, expected: ministryExpected },
    { label: 'Union departments', discovered: summary.departmentTotal, expected: departmentExpected },
  ].filter(item => item.discovered !== item.expected)

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Authority coverage matrix</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">Assess every discovered Union ministry and department. Relevant authorities must have their official portals followed for business opportunities; not-relevant decisions always need a reason.</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin/catalog/sources" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source registry</a>
            <a href="/admin/catalog/crosswalk" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Authority crosswalk</a>
            <a href="/admin/catalog/relationships" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Authority relationships</a>
            <button onClick={() => void exportCoverage()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Export CSV</button>
            <button onClick={() => void loadCoverage()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh matrix</button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xs text-indigo-700">Ministries assessed</p><p className="mt-1 text-2xl font-black text-indigo-950">{ministryAssessed}/{ministryExpected}</p></div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4"><p className="text-xs text-cyan-700">Departments assessed</p><p className="mt-1 text-2xl font-black text-cyan-950">{departmentAssessed}/{departmentExpected}</p></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-xs text-amber-800">Portal URLs unresolved</p><p className="mt-1 text-2xl font-black text-amber-950">{unresolvedPortals}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">Needs review</p><p className="mt-1 text-2xl font-black">{summary.total - assessed}</p><p className="mt-1 text-[11px] text-slate-500">{unclearRows} unclear · {summary.total - assessed - unclearRows} not assessed</p></div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-xs text-emerald-800">Relevance decisions</p><p className="mt-1 text-2xl font-black text-emerald-950">{relevantRows + excludedRows}/{summary.total}</p><p className="mt-1 text-[11px] text-emerald-800">{relevantRows} relevant · {excludedRows} excluded</p></div>
        </div>

        <div role="status" className={inventoryWarnings.length ? 'mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950' : 'mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950'}>
          {inventoryWarnings.length
            ? <><strong>Inventory is incomplete.</strong> {inventoryWarnings.map(item => `${item.label}: ${item.discovered}/${item.expected} discovered`).join(' · ')}. Do not treat the Central coverage gate as complete until the exact official inventory is refreshed.</>
            : <><strong>Exact directory inventory discovered.</strong> Every expected ministry and department row is present; individual relevance assessments are still required.</>}
        </div>

        <div className="mb-5 flex gap-2">
          {([['needs_review', 'Needs review'], ['assessed', 'Assessed'], ['all', 'All']] as const).map(([value, label]) => (
            <button key={value} onClick={() => { setFilter(value); setPage(1) }} className={filter === value ? 'rounded-full bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600'}>
              {label}
            </button>
          ))}
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}
        <div className="grid gap-3">
          {rows.map(row => (
            <article key={row.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{row.authority_level} · {sourceName(row.source_registry)}</p>
                  <h2 className="mt-1 text-lg font-bold">{row.authority_name}</h2>
                  {row.authority_url && <a href={row.authority_url} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-indigo-700 underline underline-offset-2">{row.authority_url}</a>}
                  {!row.authority_url && <p className="mt-2 text-xs font-semibold text-amber-700">Official portal URL unresolved. Refresh the IGOD source before marking relevant.</p>}
                  {row.exclusion_reason && <p className="mt-2 text-xs text-slate-600">Reason: {row.exclusion_reason}</p>}
                  {row.assessment_note && <p className="mt-2 text-xs text-slate-600">Review note: {row.assessment_note}</p>}
                  {row.assessment_evidence_url && <p className="mt-2 text-xs text-slate-600">Evidence: <a href={row.assessment_evidence_url} target="_blank" rel="noreferrer" className="text-indigo-700 underline">{row.assessment_evidence_url}</a>{row.assessment_evidence_anchor ? ` · ${row.assessment_evidence_anchor}` : ''}</p>}
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{assessmentLabel(row.assessment_status)} · {relevanceLabel(row.business_relevance)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button disabled={busyId === row.id || !row.authority_url} onClick={() => beginAssessment(row, 'relevant')} className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Relevant</button>
                <button disabled={busyId === row.id} onClick={() => beginAssessment(row, 'unclear')} className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Unclear</button>
                <button disabled={busyId === row.id} onClick={() => beginAssessment(row, 'not_relevant')} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">Not relevant</button>
              </div>
              {assessmentDraft?.coverageId === row.id && <form onSubmit={submitAssessment} className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Record {relevanceLabel(assessmentDraft.businessRelevance).toLowerCase()} decision</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Terminal decisions require an evidence URL that already exists in the <a href="/admin/catalog/sources" className="font-semibold text-indigo-700 underline">source registry</a>. Nothing is published by this form.</p>
                  </div>
                  <button type="button" onClick={() => { setAssessmentDraft(null); setAssessmentError('') }} className="text-xs font-semibold text-slate-500 underline">Cancel</button>
                </div>
                <div className="mt-4 grid gap-3">
                  {assessmentDraft.businessRelevance === 'not_relevant' && <label className="grid gap-1 text-xs font-semibold text-slate-700">Exclusion reason<textarea required rows={3} value={assessmentDraft.exclusionReason} onChange={event => updateAssessmentDraft('exclusionReason', event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" placeholder="Explain why no business-relevant opportunity should be tracked here." /></label>}
                  {(assessmentDraft.businessRelevance === 'relevant' || assessmentDraft.businessRelevance === 'unclear') && <label className="grid gap-1 text-xs font-semibold text-slate-700">{assessmentDraft.businessRelevance === 'relevant' ? 'Relevant official source scope' : 'Follow-up note'}<textarea required rows={3} value={assessmentDraft.assessmentNote} onChange={event => updateAssessmentDraft('assessmentNote', event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" placeholder={assessmentDraft.businessRelevance === 'relevant' ? 'Name the opportunity areas or official source scope that make this authority relevant.' : 'State what remains unclear and what must be verified next.'} /></label>}
                  {assessmentDraft.businessRelevance !== 'unclear' && <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">Official evidence URL<input required type="url" value={assessmentDraft.assessmentEvidenceUrl} onChange={event => updateAssessmentDraft('assessmentEvidenceUrl', event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" placeholder="https://..." /></label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">Precise evidence anchor<input required value={assessmentDraft.assessmentEvidenceAnchor} onChange={event => updateAssessmentDraft('assessmentEvidenceAnchor', event.target.value)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 font-normal" placeholder="Page 4, section 2.1, or directory entry" /></label>
                  </div>}
                </div>
                {assessmentError && <p role="alert" className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800">{assessmentError}</p>}
                <button disabled={busyId === row.id} type="submit" className="mt-4 rounded-xl bg-[#3f46e8] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busyId === row.id ? 'Saving…' : 'Save decision'}</button>
              </form>}
            </article>
          ))}
        </div>
        {pagination.total > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-slate-500">Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} authorities in this view</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button disabled={!pagination.hasMore} onClick={() => setPage(current => current + 1)} className="rounded-xl bg-[#3f46e8] px-3 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>}
      </div>
    </main>
  )
}
