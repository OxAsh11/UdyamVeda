'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { BENEFIT_TYPE_LABELS, OPPORTUNITY_GROUPS, type OpportunityGroup } from '@/lib/opportunities/taxonomy'
import { opportunityToScheme, TYPE_FILTERS, type CatalogScheme } from '@/lib/opportunities/compat'
import type { OpportunityDetail, OpportunitySummary } from '@/lib/opportunities/types'
import { Bookmark, BookmarkPlus, Check, CheckCircle2, ChevronDown, ChevronUp, Clock, ExternalLink, Landmark, Link2, Loader2, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { AUTH_REQUIRED } from '@/lib/auth/mode'

type SavedStatus = 'saved' | 'started' | 'applied' | 'approved' | 'rejected' | 'withdrawn'
type SavedMap = Record<string, SavedStatus>
type StepMap = Record<string, Record<number, boolean>>
type ApplicationState = { id: string; status: string; tasks: Array<{ id: string; sort_order: number; status: string }> }
type ApplicationMap = Record<string, ApplicationState>

function firstRelation<T>(value: T | T[] | null | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? null
}

async function readJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(payload.error ?? 'Request failed')
  return payload
}

function initialParam(name: string) {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? ''
}

export default function SchemesPage() {
  const [matched, setMatched] = useState<CatalogScheme[]>([])
  const [saved, setSaved] = useState<SavedMap>({})
  const [steps, setSteps] = useState<StepMap>({})
  const [applications, setApplications] = useState<ApplicationMap>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('all')
  // `?q=` comes from the header search box, `?type=` from the dashboard tiles.
  const [searchQuery, setSearchQuery] = useState(() => initialParam('q'))
  const [searchInput, setSearchInput] = useState(() => initialParam('q'))
  const [typeFilter, setTypeFilter] = useState(() => {
    const type = initialParam('type')
    return TYPE_FILTERS[type] ? type : ''
  })
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [catalogSource, setCatalogSource] = useState<'database' | 'research_beta' | 'legacy_draft' | 'empty_unpublished' | 'unavailable'>('unavailable')
  const [catalogAvailability, setCatalogAvailability] = useState<'available' | 'unavailable'>('unavailable')
  const [catalogDetails, setCatalogDetails] = useState<Record<string, OpportunityDetail>>({})
  const [copied, setCopied] = useState(false)

  const loadApplications = useCallback(async () => {
    if (!AUTH_REQUIRED) {
      setApplications({})
      setSteps({})
      return
    }
    const response = await fetch('/api/applications', { cache: 'no-store' })
    if (!response.ok) return
    const payload = await response.json() as { data?: Array<{ id: string; opportunity_id: string; status: string; opportunity?: unknown; tasks?: ApplicationState['tasks'] }> }
    const applicationMap: ApplicationMap = {}
    const stepMap: StepMap = {}
    for (const item of payload.data ?? []) {
      const opportunity = firstRelation(item.opportunity) as { slug?: string } | null
      const key = opportunity?.slug ?? item.opportunity_id
      applicationMap[key] = { id: item.id, status: item.status, tasks: item.tasks ?? [] }
      stepMap[key] = {}
      for (const task of item.tasks ?? []) {
        if (task.sort_order < 1000) stepMap[key][task.sort_order - 1] = task.status === 'done'
      }
    }
    setApplications(applicationMap)
    setSteps(stepMap)
  }, [])

  useEffect(() => {
    async function load() {
      // Catalog, saved items and applications load in parallel; the timeout
      // turns a stalled request into an error message instead of endless loading.
      const [catalogResponse, savedResponse] = await Promise.all([
        fetch(`/api/opportunities?limit=500${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`, { signal: AbortSignal.timeout(30000) }),
        AUTH_REQUIRED ? fetch('/api/saved-opportunities', { cache: 'no-store', signal: AbortSignal.timeout(30000) }) : Promise.resolve(null),
        loadApplications(),
      ])
      const catalogPayload = await catalogResponse.json() as { data?: OpportunitySummary[]; meta?: { source?: 'database' | 'research_beta' | 'legacy_draft' | 'empty_unpublished' | 'unavailable'; availability?: 'available' | 'unavailable' } }
      const source = catalogPayload.meta?.source ?? 'unavailable'
      setCatalogSource(source)
      setCatalogAvailability(catalogPayload.meta?.availability ?? 'unavailable')
      setMatched((catalogPayload.data ?? []).map(opportunityToScheme))

      if (savedResponse?.ok) {
        const savedPayload = await savedResponse.json() as { data?: Array<{ opportunity_id: string; status: SavedStatus; opportunity?: unknown }> }
        const nextSaved: SavedMap = {}
        for (const item of savedPayload.data ?? []) {
          const opportunity = firstRelation(item.opportunity) as { slug?: string } | null
          nextSaved[opportunity?.slug ?? item.opportunity_id] = item.status
        }
        setSaved(nextSaved)
      }
      setLoading(false)
    }
    load().catch(() => {
      toast.error('Unable to load the opportunity workspace')
      setLoading(false)
    })
  }, [loadApplications, searchQuery])

  async function handleExpand(opportunityId: string) {
    if (expanded === opportunityId) {
      setExpanded(null)
      return
    }
    setExpanded(opportunityId)
    if (['database', 'research_beta'].includes(catalogSource) && !catalogDetails[opportunityId]) {
      const response = await fetch(`/api/opportunities/${opportunityId}`)
      if (!response.ok) return
      const payload = await response.json() as { data: OpportunityDetail }
      setCatalogDetails(previous => ({ ...previous, [opportunityId]: payload.data }))
      setMatched(previous => previous.map(item => item.id === opportunityId
        ? { ...item, description: payload.data.description, applicationSteps: payload.data.steps.map(step => step.title) }
        : item))
    }
  }

  const toggleStep = useCallback(async (opportunityId: string, stepIndex: number) => {
    const application = applications[opportunityId]
    const task = application?.tasks.find(item => item.sort_order === stepIndex + 1)
    if (!application || !task) {
      toast.error('Start the guided application before tracking tasks.')
      return
    }
    const current = steps[opportunityId]?.[stepIndex] ?? false
    const completed = !current
    setSteps(previous => ({ ...previous, [opportunityId]: { ...(previous[opportunityId] ?? {}), [stepIndex]: completed } }))
    try {
      await readJson(await fetch(`/api/applications/${application.id}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: completed ? 'done' : 'todo' }),
      }))
      setApplications(previous => ({ ...previous, [opportunityId]: { ...previous[opportunityId], tasks: previous[opportunityId].tasks.map(item => item.id === task.id ? { ...item, status: completed ? 'done' : 'todo' } : item) } }))
    } catch (error) {
      setSteps(previous => ({ ...previous, [opportunityId]: { ...(previous[opportunityId] ?? {}), [stepIndex]: current } }))
      toast.error(error instanceof Error ? error.message : 'Failed to save task progress')
    }
  }, [applications, steps])

  async function toggleSave(scheme: CatalogScheme) {
    if (catalogSource !== 'database') {
      toast.error('Only published official catalog records can be saved.')
      return
    }
    setLoadingAction(scheme.id)
    try {
      if (saved[scheme.id]) {
        await readJson(await fetch(`/api/saved-opportunities?opportunityId=${encodeURIComponent(scheme.id)}`, { method: 'DELETE' }))
        setSaved(previous => { const next = { ...previous }; delete next[scheme.id]; return next })
        toast.success('Removed from saved opportunities')
      } else {
        await readJson(await fetch('/api/saved-opportunities', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ opportunityId: scheme.id }) }))
        setSaved(previous => ({ ...previous, [scheme.id]: 'saved' }))
        toast.success('Saved to your business workspace')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update saved opportunities')
    } finally {
      setLoadingAction(null)
    }
  }

  async function startApplication(scheme: CatalogScheme) {
    if (catalogSource !== 'database') {
      toast.error('Applications open only for published official catalog records.')
      return
    }
    setLoadingAction(scheme.id)
    try {
      await readJson(await fetch('/api/applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ opportunityId: scheme.id }) }))
      setSaved(previous => ({ ...previous, [scheme.id]: 'started' }))
      await loadApplications()
      toast.success('Guided application workspace started')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to start the application')
    } finally {
      setLoadingAction(null)
    }
  }

  function shareEligibility() {
    const text = `I found ${matched.length} government opportunities on UdyamVeda.\n\nExplore source-linked opportunities: ${window.location.origin}/dashboard/schemes`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Share text copied to clipboard')
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => toast.error('Copy failed — please copy manually'))
  }

  const typed = typeFilter ? matched.filter(item => TYPE_FILTERS[typeFilter].groups.includes(item.group)) : matched
  const categories = ['all', ...Array.from(new Set(typed.map(item => item.group)))]
  const displayed = filterCategory === 'all' ? typed : typed.filter(item => item.group === filterCategory)
  const savedSchemes = matched.filter(item => saved[item.id])
  const startedCount = Object.values(saved).filter(status => ['started', 'applied'].includes(status)).length
  const catalogCountLabel = catalogSource === 'database'
    ? 'Published opportunities'
    : catalogSource === 'research_beta'
      ? 'Research beta opportunities'
    : catalogSource === 'legacy_draft'
      ? 'Development draft records'
      : catalogSource === 'empty_unpublished'
        ? 'Approved opportunities'
        : 'Opportunities available'

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center p-8"><div className="text-sm text-slate-400">Loading the opportunity catalog...</div></div>

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Start & Operate</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Government opportunities</h1><p className="mt-2 max-w-xl text-sm text-slate-500">Evidence-backed opportunities ranked for your business, with official provenance and a guided application path.</p></div><button onClick={shareEligibility} className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100">{copied ? <><Check size={13} /> Copied</> : <><Share2 size={13} /> Share</>}</button></div>
      <form onSubmit={event => { event.preventDefault(); setSearchQuery(searchInput.trim()); setFilterCategory('all'); setExpanded(null); setLoading(true) }} className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><label className="sr-only" htmlFor="opportunity-search">Search approved opportunities</label><input id="opportunity-search" value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Search approved schemes, grants, loans, policies, or authorities" className="min-w-72 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none ring-indigo-200 focus:ring-2" /><button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white">Search</button>{searchQuery && <button type="button" onClick={() => { setSearchInput(''); setSearchQuery(''); setFilterCategory('all'); setExpanded(null); setLoading(true) }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Clear</button>}</form>
      <div className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${catalogAvailability === 'unavailable' ? 'border-rose-200 bg-rose-50 text-rose-900' : catalogSource === 'database' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : catalogSource === 'research_beta' || catalogSource === 'legacy_draft' ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-indigo-200 bg-indigo-50 text-indigo-900'}`}><div className="font-semibold">Catalog status: {catalogAvailability === 'unavailable' ? 'catalog connection unavailable' : catalogSource === 'database' ? 'published official records' : catalogSource === 'research_beta' ? 'research beta records' : catalogSource === 'legacy_draft' ? 'development-only draft records' : 'official review in progress'}</div><p className="mt-1 text-xs leading-5">{catalogAvailability === 'unavailable' ? 'The catalog database could not be reached. No Government opportunity count or eligibility decision is being inferred; retry after the connection is restored.' : catalogSource === 'database' ? 'Each record has an approved catalog version and official-source provenance. Confirm current terms on the authority portal before applying.' : catalogSource === 'research_beta' ? 'These source-backed research records are visible in founder-authorized beta mode while editorial review continues. Confirm current terms on the official portal before acting; saving, recommendations, and applications remain disabled until approval.' : catalogSource === 'legacy_draft' ? 'Draft records are visible only for interface testing and cannot be saved or used to start applications.' : 'Unreviewed Government records are intentionally withheld until source, eligibility, and current-term review is complete.'}</p></div>
      <div className="mb-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-sm"><div className="text-3xl font-black">{matched.length}</div><div className="mt-1 text-sm font-semibold text-indigo-100">{catalogCountLabel}</div><div className="mt-1 text-xs text-indigo-200">{catalogSource === 'database' ? 'approved catalog records' : catalogSource === 'research_beta' ? 'research records; not yet fully approved' : catalogSource === 'legacy_draft' ? 'not publishable or actionable' : catalogSource === 'empty_unpublished' ? 'official review is in progress' : 'catalog connection required'}</div></div><div className="rounded-2xl bg-orange-50 p-5 text-orange-950"><div className="text-3xl font-black text-orange-600">{Object.values(saved).filter(status => status === 'saved').length}</div><div className="mt-1 text-sm font-semibold">Saved to review</div><div className="mt-1 text-xs text-orange-700">kept in your business workspace</div></div><div className="rounded-2xl bg-emerald-50 p-5 text-emerald-950"><div className="text-3xl font-black text-emerald-600">{startedCount}</div><div className="mt-1 text-sm font-semibold">Applications started</div><div className="mt-1 text-xs text-emerald-700">with versioned task tracking</div></div></div>
      {typeFilter ? <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">Showing <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-bold text-indigo-700">{TYPE_FILTERS[typeFilter].label}</span><button type="button" onClick={() => { setTypeFilter(''); setFilterCategory('all'); window.history.replaceState(null, '', '/dashboard/schemes') }} className="font-semibold text-indigo-600 hover:underline">Show all</button></div> : null}
      <div className="mb-6 flex flex-wrap gap-2">{categories.map(category => <button key={category} onClick={() => setFilterCategory(category)} className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${filterCategory === category ? 'bg-indigo-600 text-white' : 'border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-700'}`}>{category === 'all' ? `All (${typed.length})` : `${OPPORTUNITY_GROUPS[category as OpportunityGroup] ?? category} (${typed.filter(item => item.group === category).length})`}</button>)}</div>
      {displayed.length === 0 ? <div className={`rounded-2xl border p-6 text-sm ${catalogAvailability === 'unavailable' ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-indigo-200 bg-indigo-50 text-indigo-900'}`}><p className="font-semibold">{catalogAvailability === 'unavailable' ? 'Government opportunities are temporarily unavailable.' : searchQuery ? 'No approved opportunities match this search.' : 'No approved opportunities are available yet.'}</p><p className="mt-2 leading-6">{catalogAvailability === 'unavailable' ? 'This is a connection state, not an eligibility result. Try again once the catalog service is reachable.' : searchQuery ? 'Try a broader term or clear the search. Only approved official records are shown here.' : 'UdyamVeda is completing official-source review before showing Government opportunities as actionable recommendations.'}</p></div> : <div className="space-y-4">{displayed.map(scheme => {
        const isExpanded = expanded === scheme.id
        const isSaved = Boolean(saved[scheme.id])
        const application = applications[scheme.id]
        const schemeSteps = steps[scheme.id] ?? {}
        const completedSteps = Object.values(schemeSteps).filter(Boolean).length
        const totalSteps = scheme.applicationSteps.length
        const detail = catalogDetails[scheme.id]
        return <article key={scheme.id} className={`rounded-2xl border bg-white shadow-sm transition ${isExpanded ? 'border-indigo-200 shadow-indigo-100' : 'border-slate-100'}`}>
          <button className="w-full p-5 text-left" onClick={() => handleExpand(scheme.id)}><div className="flex items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">{OPPORTUNITY_GROUPS[scheme.group]}</span><span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">{BENEFIT_TYPE_LABELS[scheme.benefitType] ?? scheme.benefitType}</span>{application ? <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Application {application.status.replace('_', ' ')}</span> : null}</div><h2 className="text-base font-bold text-slate-900">{scheme.name}</h2><p className="mt-1 text-xs text-slate-500">{scheme.ministry}</p>{scheme.sourceLabel ? <p className="mt-1 text-[10px] text-slate-400">{scheme.sourceLabel}</p> : null}</div><div className="w-36 shrink-0 text-right sm:w-56"><div className="line-clamp-2 text-sm font-bold text-slate-800" title={scheme.benefitHeadline}>{scheme.benefitHeadline}</div><div className="mt-1 line-clamp-2 text-xs text-slate-400" title={scheme.deadline}>{scheme.deadline === 'rolling' ? 'Rolling' : scheme.deadline}</div><div className="mt-3 text-slate-300">{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div></div></div></button>
          {isExpanded ? <div className="border-t border-slate-100 px-5 pb-5"><p className="mt-4 text-sm leading-6 text-slate-600">{scheme.description}</p><div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><Clock size={13} /> {scheme.processingTime}</span><span className="inline-flex items-center gap-1.5"><Landmark size={13} /> {scheme.deadline === 'rolling' ? 'Open year-round' : scheme.deadline}</span>{scheme.lastVerifiedAt ? <span>Last checked {new Date(scheme.lastVerifiedAt).toLocaleDateString('en-IN')}</span> : null}</div><div className="mt-4 flex flex-wrap gap-2">{scheme.tags.map(tag => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{tag}</span>)}</div><div className="mt-6"><div className="mb-3 flex items-center justify-between"><div className="text-xs font-bold uppercase tracking-wide text-slate-500">Guided application steps</div>{application ? <span className="text-xs text-slate-400">{completedSteps}/{totalSteps} complete</span> : null}</div><ol className="space-y-2">{scheme.applicationSteps.map((step, index) => { const done = Boolean(schemeSteps[index]); return <li key={`${scheme.id}-${index}`} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">{application ? <button aria-label={`${done ? 'Reopen' : 'Complete'} step ${index + 1}`} onClick={() => toggleStep(scheme.id, index)} className={done ? 'text-emerald-600' : 'text-slate-300 hover:text-indigo-500'}>{done ? <CheckCircle2 size={17} /> : <span className="block h-[17px] w-[17px] rounded-full border-2 border-current" />}</button> : <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">{index + 1}</span>}<span className={`text-sm ${done ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{step}</span></li> })}</ol></div><div className="mt-6 flex flex-wrap items-center gap-3"><a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">Official portal <ExternalLink size={13} /></a><Link href={`/dashboard/schemes/${scheme.id}`} className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100">Evidence detail</Link><button disabled={loadingAction === scheme.id || Boolean(application)} onClick={() => toggleSave(scheme)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${isSaved ? 'border-slate-200 bg-slate-50 text-slate-600' : 'border-indigo-100 text-indigo-700 hover:bg-indigo-50'} disabled:cursor-not-allowed disabled:opacity-50`}>{loadingAction === scheme.id ? <Loader2 size={14} className="animate-spin" /> : isSaved ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}{application ? 'Application linked' : isSaved ? 'Saved' : 'Save opportunity'}</button>{isSaved && !application ? <button disabled={loadingAction === scheme.id} onClick={() => startApplication(scheme)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"><Link2 size={14} /> Start guided application</button> : null}</div>{!isSaved ? <p className="mt-3 text-xs text-slate-400">Save this opportunity first, then start a versioned application workspace.</p> : null}{detail?.requirements.length ? <p className="mt-4 text-xs text-slate-500">{detail.requirements.filter(item => item.required).length} required document or registration items are recorded in the approved version.</p> : null}</div> : null}
        </article>
      })}</div>}
      {savedSchemes.length > 0 ? <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2"><Bookmark size={17} className="text-orange-500" /><h2 className="font-bold text-slate-900">Saved opportunities</h2></div><div className="grid gap-3 md:grid-cols-2">{savedSchemes.map(item => <div key={item.id} className="rounded-xl bg-orange-50/70 p-4"><div className="text-sm font-bold text-slate-800">{item.name}</div><div className="mt-1 text-xs text-slate-500">{saved[item.id] === 'started' ? 'Guided application started' : 'Saved for review'}</div></div>)}</div></section> : null}
    </div>
  )
}
