'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type ReviewTask = {
  id: string
  task_type: string
  status: string
  reviewer_notes: string | null
  created_at: string
  opportunity_version: {
    id: string
    version_number: number
    title: string
    summary: string | null
    objective: string | null
    legal_basis: string | null
    eligibility: unknown
    application: unknown
    fine_print: unknown
    benefit_summary: unknown
    effective_from: string | null
    effective_to: string | null
    completeness: number
    confidence: number
    last_verified_at: string | null
    review_status: string
    rules: Array<{ reviewed: boolean }>
    opportunity: { name: string; slug: string; status: string; opportunity_type: string } | null
     sources: Array<{ source_registry_id: string | null; source_url: string; source_title: string | null; source_anchor: string | null; page_number: number | null; section: string | null; paragraph: string | null; document_anchor: string | null; is_primary: boolean }>
    benefits: Array<{ benefit_type: string; label: string; amount_min: number | null; amount_max: number | null; percentage: number | null }>
    requirements: Array<{ requirement_type: string; name: string; required: boolean }>
    steps: Array<{ step_number: number; title: string; official_url: string | null }>
    windows: Array<{ window_type: string; opens_at: string | null; closes_at: string | null }>
    checks: Array<{ check_type: ReviewCheckType; status: ReviewCheckStatus; evidence: unknown; reviewer_note: string | null; reviewed_by: string | null; reviewed_at: string | null }>
  } | null
}

type ReviewCheckType = 'source' | 'eligibility' | 'benefit' | 'application' | 'window' | 'fine_print' | 'amendment'
type ReviewCheckStatus = 'pending' | 'passed' | 'failed' | 'not_applicable'

const REVIEW_CHECKS: Array<{ type: ReviewCheckType; label: string; required: boolean }> = [
  { type: 'source', label: 'Official source and precise anchor', required: true },
  { type: 'eligibility', label: 'Eligibility rules and unknown handling', required: true },
  { type: 'benefit', label: 'Benefit amounts and conditions', required: true },
  { type: 'application', label: 'Application steps and documents', required: true },
  { type: 'window', label: 'Current window and deadline status', required: true },
  { type: 'fine_print', label: 'Fine print, exclusions, and dependencies', required: true },
  { type: 'amendment', label: 'Amendments and corrigenda checked', required: false },
]

type ReviewPagination = {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
}

function jsonPreview(value: unknown) {
  return JSON.stringify(value ?? {}, null, 2)
}

function evidencePreview(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length === 0) return ''
  return jsonPreview(value)
}

function fetchedSourceEvidence(version: ReviewTask['opportunity_version'], checkType: ReviewCheckType) {
  const source = version?.sources?.find(item => item.is_primary) ?? version?.sources?.[0]
  if (!source) return ''
  const anchor = [
    source.source_anchor,
    source.page_number ? `page ${source.page_number}` : '',
    source.section ? `section ${source.section}` : '',
    source.paragraph ? `paragraph ${source.paragraph}` : '',
    source.document_anchor,
  ].filter(Boolean).join(' · ')
  const label = REVIEW_CHECKS.find(item => item.type === checkType)?.label ?? checkType
  return JSON.stringify({
    sourceUrl: source.source_url,
    anchor: anchor || 'Official source record',
    finding: `Record the exact finding that the fetched official source establishes for: ${label}.`,
  }, null, 2)
}

export default function CatalogReviewPage() {
  const [tasks, setTasks] = useState<ReviewTask[]>([])
  const [message, setMessage] = useState('Loading review queue…')
  const [busyTask, setBusyTask] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [authority, setAuthority] = useState('')
  const [authorityInput, setAuthorityInput] = useState('')
  const [pagination, setPagination] = useState<ReviewPagination>({ page: 1, pageSize: 10, total: 0, hasMore: false })
  const [authorityOptions, setAuthorityOptions] = useState<string[]>([])
  const [evidenceDrafts, setEvidenceDrafts] = useState<Record<string, string>>({})
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({})

  const loadQueue = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), pageSize: '10' })
    if (query) params.set('q', query)
    if (authority) params.set('authority', authority)
    try {
      const response = await fetch(`/api/admin/catalog/review?${params.toString()}`, { cache: 'no-store' })
      let payload: { data?: ReviewTask[]; pagination?: ReviewPagination; search?: string; authorityOptions?: string[]; error?: string } = {}
      try {
        payload = (await response.json()) as typeof payload
      } catch {
        setMessage(`Catalog queue request failed (HTTP ${response.status}). Refresh the page and sign in again if needed.`)
        return
      }
      if (!response.ok) {
        setMessage(payload.error ?? `Catalog queue request failed (HTTP ${response.status}).`)
        return
      }
      setTasks(payload.data ?? [])
      setAuthorityOptions(payload.authorityOptions ?? [])
      setPagination(payload.pagination ?? { page, pageSize: 10, total: payload.data?.length ?? 0, hasMore: false })
      setMessage(payload.data?.length ? '' : query || authority ? 'No review tasks match these filters.' : 'No open catalog review tasks.')
    } catch {
      setMessage('Catalog queue request could not reach the server. Refresh the page and sign in again if needed.')
    }
  }, [authority, page, query])

  useEffect(() => {
    void Promise.resolve().then(loadQueue)
  }, [loadQueue])

  async function act(taskId: string, action: 'approve' | 'reject' | 'request_changes' | 'confirm_rules') {
    const errorKey = `decision:${taskId}`
    const notes = noteDrafts[taskId]?.trim() ?? ''
    if ((action === 'reject' || action === 'request_changes') && !notes) {
      setInlineErrors(previous => ({ ...previous, [errorKey]: 'Add a reviewer note explaining the decision before continuing.' }))
      return
    }
    setInlineErrors(previous => ({ ...previous, [errorKey]: '' }))
    setBusyTask(taskId)
    const response = await fetch('/api/admin/catalog/review', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ taskId, action, notes }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyTask(null)
    if (!response.ok) {
      setInlineErrors(previous => ({ ...previous, [errorKey]: payload.error ?? 'The review action could not be completed.' }))
      return
    }
    await loadQueue()
  }

  async function recordCheck(taskId: string, checkType: ReviewCheckType, status: ReviewCheckStatus) {
    const evidenceKey = `${taskId}:${checkType}`
    const noteKey = `check:${evidenceKey}`
    const errorKey = `check-error:${evidenceKey}`
    const evidenceText = evidenceDrafts[evidenceKey]?.trim() ?? ''
    const notes = noteDrafts[noteKey]?.trim() ?? ''
    let evidence: Record<string, unknown> = {}
    if (evidenceText) {
      try {
        const parsed = JSON.parse(evidenceText) as unknown
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Evidence must be a JSON object.')
        evidence = parsed as Record<string, unknown>
      } catch (error) {
        setInlineErrors(previous => ({ ...previous, [errorKey]: error instanceof Error ? error.message : 'Evidence must be valid JSON.' }))
        return
      }
    }
    if (status === 'passed' && (Object.keys(evidence).length === 0 || typeof evidence.finding !== 'string' || !evidence.finding.trim())) {
      setInlineErrors(previous => ({ ...previous, [errorKey]: 'Add structured JSON evidence with the exact finding established by the source before passing this check.' }))
      return
    }
    if ((status === 'failed' || status === 'not_applicable') && !notes) {
      setInlineErrors(previous => ({ ...previous, [errorKey]: 'Add a reviewer note for failed or not-applicable checks.' }))
      return
    }
    setInlineErrors(previous => ({ ...previous, [errorKey]: '' }))
    setBusyTask(taskId)
    const response = await fetch('/api/admin/catalog/review', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ taskId, action: 'record_check', checkType, checkStatus: status, notes, evidence }),
    })
    const payload = (await response.json()) as { error?: string }
    setBusyTask(null)
    if (!response.ok) {
      setInlineErrors(previous => ({ ...previous, [errorKey]: payload.error ?? 'The editorial check could not be recorded.' }))
      return
    }
    await loadQueue()
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-6 py-10 text-[#111827] md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/catalog/edit" className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-indigo-600 px-6 py-5 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700">
          <span><span className="block text-lg font-black">Edit a published scheme</span><span className="block text-sm text-indigo-100">Fix a status, date, link or wording in one form. Each save becomes a new version with full history.</span></span>
          <span className="text-2xl" aria-hidden="true">→</span>
        </Link>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#3f46e8]">UdyamVeda catalog operations</p>
            <h1 className="text-3xl font-black tracking-tight">Review queue</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Approve only records with reviewed official provenance and at least 95% required-field completeness.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/admin/catalog/drafts" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Extracted drafts</a>
            <a href="/admin/catalog/sources" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source registry</a>
            <a href="/admin/catalog/coverage" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Coverage matrix</a>
            <a href="/admin/catalog/crosswalk" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Authority crosswalk</a>
            <a href="/admin/catalog/relationships" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Authority relationships</a>
            <a href="/admin/catalog/discoveries" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Discoveries</a>
            <a href="/admin/catalog/changes" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Source changes</a>
            <a href="/admin/catalog/source-failures" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 shadow-sm">Source failures</a>
            <a href="/admin/catalog/source-gaps" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm">Current source gaps</a>
            <a href="/admin/catalog/records" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Records</a>
            <a href="/admin/catalog/preflight" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Preflight</a>
            <a href="/admin/catalog/offline-review" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-sm">Offline review pack</a>
            <a href="/admin/catalog/gate" className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Beta gate</a>
            <button onClick={() => void loadQueue()} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm">Refresh queue</button>
          </div>
        </div>

        {message && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">{message}</div>}

        <form onSubmit={event => { event.preventDefault(); setQuery(searchInput.trim()); setAuthority(authorityInput.trim()); setPage(1) }} className="mb-5 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <label className="sr-only" htmlFor="catalog-review-search">Search review tasks</label>
          <input id="catalog-review-search" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search scheme name, slug, or summary" className="min-w-72 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2" />
          <label className="sr-only" htmlFor="catalog-review-authority">Filter by authority batch</label>
          <select id="catalog-review-authority" value={authorityInput} onChange={event => setAuthorityInput(event.target.value)} className="min-w-64 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-indigo-200 focus:ring-2">
            <option value="">All authority batches</option>
            {authorityOptions.map(option => <option key={option} value={option}>{option}</option>)}
          </select>
          <button type="submit" className="rounded-lg bg-[#3f46e8] px-4 py-2 text-sm font-semibold text-white">Search</button>
          {(query || authority) && <button type="button" onClick={() => { setSearchInput(''); setQuery(''); setAuthorityInput(''); setAuthority(''); setPage(1) }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">Clear</button>}
        </form>

        {query && <p className="mb-4 text-xs text-slate-500">Showing review tasks matching “{query}”.</p>}
        {authority && <p className="mb-4 text-xs text-slate-500">Showing the bounded review batch for authorities matching “{authority}”.</p>}

        <div className="grid gap-5">
          {tasks.map((task) => {
            const version = task.opportunity_version
            if (!version) return null
            const completeness = Math.round(Number(version.completeness) * 100)
            const checks = version.checks ?? []
            const canApprove = REVIEW_CHECKS.every(checkDefinition => {
              const status = checks.find(check => check.check_type === checkDefinition.type)?.status
              return checkDefinition.required ? status === 'passed' : status === 'passed' || status === 'not_applicable'
            })
            return (
              <article key={task.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">{version.opportunity?.opportunity_type ?? 'opportunity'}</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">{version.review_status}</span>
                    </div>
                    <h2 className="text-xl font-bold">{version.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{version.summary}</p>
                  </div>
                  <div className="min-w-40 rounded-xl bg-slate-50 p-4 text-sm">
                    <p className="text-slate-500">Completeness</p>
                    <p className="mt-1 text-2xl font-black">{completeness}%</p>
                    <p className="mt-1 text-xs text-slate-500">Confidence {Math.round(Number(version.confidence) * 100)}%</p>
                    <p className="mt-1 text-xs text-slate-500">Rules {version.rules?.length && version.rules.every(rule => rule.reviewed) ? 'reviewed' : 'need review'}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Sources</p>
                  <div className="mt-2 grid gap-2">
                    {version.sources.map((source) => (
                      <a key={source.source_url} href={source.source_url} target="_blank" rel="noreferrer" className="text-sm text-indigo-700 underline decoration-indigo-200 underline-offset-2">
                        <span className={source.source_registry_id ? 'mr-2 text-emerald-700' : 'mr-2 text-rose-700'}>{source.source_registry_id ? 'Registered provenance' : 'Unregistered provenance'}</span>
                        {source.is_primary ? 'Primary · ' : ''}{source.source_title ?? source.source_url}
                        {source.source_anchor ? ` · ${source.source_anchor}` : ''}
                        {[source.page_number ? `p. ${source.page_number}` : '', source.section ? `section: ${source.section}` : '', source.paragraph ? `paragraph: ${source.paragraph}` : '', source.document_anchor ? `anchor: ${source.document_anchor}` : ''].filter(Boolean).map(value => ` · ${value}`).join('')}
                      </a>
                    ))}
                  </div>
                </div>

                <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <summary className="cursor-pointer text-sm font-bold text-slate-700">Open structured review dossier</summary>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Objective</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{version.objective ?? 'Missing'}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Legal basis</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{version.legal_basis ?? 'Missing'}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Eligibility</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{jsonPreview(version.eligibility)}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Application</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{jsonPreview(version.application)}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Fine print</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{jsonPreview(version.fine_print)}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Benefit summary</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-[11px] leading-5 text-slate-600">{jsonPreview(version.benefit_summary)}</pre></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Structured benefits ({version.benefits?.length ?? 0})</p><div className="mt-2 space-y-2">{version.benefits?.map(benefit => <div key={`${benefit.benefit_type}-${benefit.label}`} className="rounded-lg bg-white p-3 text-xs text-slate-600"><span className="font-bold text-slate-800">{benefit.label}</span><span className="ml-2">{benefit.benefit_type}</span>{benefit.amount_max !== null ? <span className="ml-2">up to {benefit.amount_max}</span> : null}{benefit.percentage !== null ? <span className="ml-2">{benefit.percentage}%</span> : null}</div>)}{!version.benefits?.length ? <p className="text-xs text-rose-700">No structured benefits recorded.</p> : null}</div></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Requirements ({version.requirements?.length ?? 0})</p><div className="mt-2 space-y-2">{version.requirements?.map(requirement => <div key={requirement.name} className="rounded-lg bg-white p-3 text-xs text-slate-600"><span className="font-bold text-slate-800">{requirement.name}</span><span className="ml-2">{requirement.requirement_type}</span>{requirement.required ? <span className="ml-2 text-rose-600">required</span> : <span className="ml-2 text-slate-400">optional</span>}</div>)}{!version.requirements?.length ? <p className="text-xs text-rose-700">No requirements recorded.</p> : null}</div></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Application steps ({version.steps?.length ?? 0})</p><ol className="mt-2 space-y-2">{version.steps?.map(step => <li key={step.step_number} className="rounded-lg bg-white p-3 text-xs text-slate-600"><span className="mr-2 font-bold text-indigo-700">{step.step_number}.</span>{step.title}{step.official_url ? <a href={step.official_url} target="_blank" rel="noreferrer" className="ml-2 text-indigo-700 underline">Official route</a> : null}</li>)}{!version.steps?.length ? <p className="text-xs text-rose-700">No application steps recorded.</p> : null}</ol></div>
                    <div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Windows ({version.windows?.length ?? 0})</p><div className="mt-2 space-y-2">{version.windows?.map((window, index) => <div key={`${window.window_type}-${index}`} className="rounded-lg bg-white p-3 text-xs text-slate-600"><span className="font-bold text-slate-800">{window.window_type}</span><span className="ml-2">{window.opens_at ?? 'open'} → {window.closes_at ?? 'no fixed close'}</span></div>)}{!version.windows?.length ? <p className="text-xs text-rose-700">No application window or rolling-status record.</p> : null}</div></div>
                  </div>
                </details>

                <section className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4" aria-labelledby={`review-checklist-${task.id}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 id={`review-checklist-${task.id}`} className="text-sm font-bold text-slate-800">Editorial review checklist</h3>
                      <p className="mt-1 text-xs text-slate-600">Every required check must be explicitly passed before publication. Failed and not-applicable decisions require a note.</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${canApprove ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>{canApprove ? 'Ready for approval' : 'Review incomplete'}</span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {REVIEW_CHECKS.map(checkDefinition => {
                      const current = checks.find(check => check.check_type === checkDefinition.type)
                      const status = current?.status ?? 'pending'
                      const evidenceKey = `${task.id}:${checkDefinition.type}`
                      const evidenceValue = evidenceDrafts[evidenceKey] ?? evidencePreview(current?.evidence)
                      return <div key={checkDefinition.type} className="rounded-lg bg-white p-3 text-xs">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div><span className="font-semibold text-slate-800">{checkDefinition.label}</span>{!checkDefinition.required && <span className="ml-2 text-slate-500">optional</span>}{current?.reviewer_note && <p className="mt-1 text-slate-500">{current.reviewer_note}</p>}</div>
                          <span className={`rounded-full px-2 py-1 font-bold ${status === 'passed' ? 'bg-emerald-100 text-emerald-700' : status === 'failed' ? 'bg-rose-100 text-rose-700' : status === 'not_applicable' ? 'bg-slate-200 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>{status.replaceAll('_', ' ')}</span>
                        </div>
                        <div className="mt-3 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                          <label className="grid gap-1 text-[11px] font-semibold text-slate-500">Structured evidence JSON
                            <textarea aria-label={`${checkDefinition.label} structured evidence`} rows={3} value={evidenceValue} onChange={event => setEvidenceDrafts(previous => ({ ...previous, [evidenceKey]: event.target.value }))} placeholder={'{\"sourceUrl\":\"https://...\",\"anchor\":\"page or section\",\"finding\":\"what was verified\"}'} className="w-full rounded-lg border border-slate-200 bg-indigo-50/30 p-2 font-mono text-[11px] font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                            {version.sources?.length ? <button type="button" onClick={() => setEvidenceDrafts(previous => ({ ...previous, [evidenceKey]: fetchedSourceEvidence(version, checkDefinition.type) }))} className="justify-self-start rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1 font-bold text-indigo-700">Use fetched source</button> : null}
                          </label>
                          <label className="grid gap-1 text-[11px] font-semibold text-slate-500">Reviewer note <span className="font-normal">(required for fail/N/A)</span>
                            <textarea aria-label={`${checkDefinition.label} reviewer note`} rows={2} value={noteDrafts[`check:${evidenceKey}`] ?? current?.reviewer_note ?? ''} onChange={event => setNoteDrafts(previous => ({ ...previous, [`check:${evidenceKey}`]: event.target.value }))} placeholder="What did the official source establish?" className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px] font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                          </label>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button disabled={busyTask === task.id} onClick={() => void recordCheck(task.id, checkDefinition.type, 'passed')} className="rounded-lg border border-emerald-200 px-2 py-1 font-bold text-emerald-700 disabled:opacity-50">Pass</button>
                            <button disabled={busyTask === task.id} onClick={() => void recordCheck(task.id, checkDefinition.type, 'failed')} className="rounded-lg border border-rose-200 px-2 py-1 font-bold text-rose-700 disabled:opacity-50">Fail</button>
                            {!checkDefinition.required && <button disabled={busyTask === task.id} onClick={() => void recordCheck(task.id, checkDefinition.type, 'not_applicable')} className="rounded-lg border border-slate-300 px-2 py-1 font-bold text-slate-600 disabled:opacity-50">N/A</button>}
                          </div>
                        </div>
                        {inlineErrors[`check-error:${evidenceKey}`] && <p className="mt-2 text-[11px] font-semibold text-rose-700" role="alert">{inlineErrors[`check-error:${evidenceKey}`]}</p>}
                      </div>
                    })}
                  </div>
                </section>

                <div className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">Decision note <span className="font-normal text-slate-500">(required for reject or request changes)</span>
                    <textarea aria-label={`${version.title} decision note`} rows={2} value={noteDrafts[task.id] ?? ''} onChange={event => setNoteDrafts(previous => ({ ...previous, [task.id]: event.target.value }))} placeholder="Record the decision rationale or the correction required." className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm font-normal leading-5 text-slate-700 outline-none ring-indigo-200 focus:ring-2" />
                  </label>
                  {inlineErrors[`decision:${task.id}`] && <p className="text-xs font-semibold text-rose-700" role="alert">{inlineErrors[`decision:${task.id}`]}</p>}
                  <div className="flex flex-wrap gap-2">
                  <button disabled={busyTask === task.id || Boolean(version.rules?.length && version.rules.every(rule => rule.reviewed))} onClick={() => void act(task.id, 'confirm_rules')} className="rounded-xl border border-indigo-200 px-4 py-2 text-sm font-bold text-indigo-700 disabled:opacity-50">Confirm eligibility rules</button>
                  <button disabled={busyTask === task.id || !canApprove} onClick={() => void act(task.id, 'approve')} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Approve & publish</button>
                  <button disabled={busyTask === task.id} onClick={() => void act(task.id, 'request_changes')} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Request changes</button>
                  <button disabled={busyTask === task.id} onClick={() => void act(task.id, 'reject')} className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 disabled:opacity-50">Reject</button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {pagination.total > 0 && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
          <p className="text-slate-500">Showing {(pagination.page - 1) * pagination.pageSize + 1}–{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} open review tasks</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))} className="rounded-xl border border-slate-200 px-3 py-2 font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button disabled={!pagination.hasMore} onClick={() => setPage(current => current + 1)} className="rounded-xl bg-[#3f46e8] px-3 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Next</button>
          </div>
        </div>}
      </div>
    </main>
  )
}
