'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  FileCheck2,
  FileText,
  Globe2,
  Landmark,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { recommendRegistrationType, REGISTRATION_TYPES, type RegType } from '@/lib/data/registration-types'
import {
  NATIONAL_REGISTRATION_JOURNEYS,
  type RegistrationJourney,
} from '@/lib/data/national-registration-journeys'

type JourneyFilter = 'all' | RegistrationJourney['category']
type BusinessProfile = Record<string, string>

const DEFAULT_PROFILE: BusinessProfile = {
  sector: 'your business',
  stage: 'planning',
  initial_capital: '',
  founder_type: '',
  district: '',
}

const FILTERS: Array<{ id: JourneyFilter; label: string; color: string }> = [
  { id: 'all', label: 'All journeys', color: '#3F46E8' },
  { id: 'foundation', label: 'Start the business', color: '#059669' },
  { id: 'tax', label: 'Tax identity', color: '#D99A00' },
  { id: 'recognition', label: 'Recognition', color: '#7C3AED' },
  { id: 'trade', label: 'Trade', color: '#0891B2' },
  { id: 'food', label: 'Food', color: '#FF8A34' },
  { id: 'workforce', label: 'Workforce', color: '#E95454' },
  { id: 'state', label: 'State & local', color: '#64748B' },
]

const CATEGORY_META: Record<RegistrationJourney['category'], { label: string; color: string; tint: string }> = {
  foundation: { label: 'Start & Operate', color: '#059669', tint: '#ECFDF5' },
  tax: { label: 'Tax readiness', color: '#B77900', tint: '#FFFBEB' },
  recognition: { label: 'Government recognition', color: '#7C3AED', tint: '#F5F3FF' },
  trade: { label: 'Trade readiness', color: '#0891B2', tint: '#ECFEFF' },
  food: { label: 'Sector licence', color: '#EA6A10', tint: '#FFF7ED' },
  workforce: { label: 'Workforce compliance', color: '#D13B3B', tint: '#FEF2F2' },
  state: { label: 'Expanding coverage', color: '#64748B', tint: '#F1F5F9' },
}

function displayStage(stage: string) {
  return stage.replace(/-/g, ' ')
}

export default function RegistrationPage() {
  const [business, setBusiness] = useState<BusinessProfile>(DEFAULT_PROFILE)
  const [primaryType, setPrimaryType] = useState<RegType | null>(null)
  const [filter, setFilter] = useState<JourneyFilter>('all')
  const [selectedId, setSelectedId] = useState(NATIONAL_REGISTRATION_JOURNEYS[0]?.id ?? '')
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  useEffect(() => {
    const controller = new AbortController()

    async function loadBusiness() {
      try {
        const response = await fetch('/api/businesses/current', { cache: 'no-store', signal: controller.signal })
        if (!response.ok) return
        const payload = await response.json() as {
          data?: { business?: { district?: string | null }; profile?: Record<string, unknown> }
        }
        const profile = payload.data?.profile
        if (!profile) return

        const nextBusiness = { ...DEFAULT_PROFILE, ...profile, district: payload.data?.business?.district ?? '' } as BusinessProfile
        setBusiness(nextBusiness)
        const recommendation = recommendRegistrationType(nextBusiness.stage, nextBusiness.initial_capital, nextBusiness.founder_type, nextBusiness.sector)
        setPrimaryType(REGISTRATION_TYPES.find((type) => type.id === recommendation.primary) ?? null)
      } catch {
        // The guide remains useful in preview mode when the profile API is unavailable.
      }
    }

    void loadBusiness()
    return () => controller.abort()
  }, [])

  const visibleJourneys = useMemo(
    () => filter === 'all' ? NATIONAL_REGISTRATION_JOURNEYS : NATIONAL_REGISTRATION_JOURNEYS.filter((journey) => journey.category === filter),
    [filter],
  )
  const selectedJourney = NATIONAL_REGISTRATION_JOURNEYS.find((journey) => journey.id === selectedId) ?? visibleJourneys[0]
  const completedCount = completedSteps.size
  const totalSteps = NATIONAL_REGISTRATION_JOURNEYS.reduce((total, journey) => total + journey.steps.length, 0)
  const profileLocation = business.district ? `${business.district}, India` : 'India-wide beta'

  function toggleStep(journeyId: string, stepIndex: number) {
    const key = `${journeyId}:${stepIndex}`
    setCompletedSteps((current) => {
      const next = new Set(current)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  function openOfficialRoute(journey: RegistrationJourney) {
    if (journey.officialUrl) window.open(journey.officialUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[1.75rem] border border-indigo-100 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100"><Sparkles size={14} /> Start &amp; Operate <span className="rounded-full bg-white/15 px-2.5 py-1 tracking-normal text-white">Preparation workspace</span></div>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Build the right foundation.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">A guided path through India&apos;s registrations, licences and recognition routes — with the official source, documents and next action visible at every step.</p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold"><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><Globe2 size={14} /> Central coverage first</span><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><ShieldCheck size={14} /> Review-gated guidance</span><span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2"><MapPin size={14} /> {profileLocation}</span></div>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/12 p-5 backdrop-blur-sm"><div className="flex items-center justify-between text-xs text-indigo-100"><span>Your setup progress</span><span className="font-bold text-white">{completedCount}/{totalSteps} tasks</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-orange-300 transition-all" style={{ width: `${totalSteps ? (completedCount / totalSteps) * 100 : 0}%` }} /></div><p className="mt-4 text-xs leading-5 text-indigo-100">Tick preparation tasks as you complete them. Official submission always happens on the government or bank portal.</p></div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'National journeys', value: NATIONAL_REGISTRATION_JOURNEYS.filter((journey) => journey.status === 'review-gated').length, note: 'seeded for review', icon: Landmark, color: '#3F46E8', tint: '#EEF2FF' },
            { label: 'Official handoffs', value: NATIONAL_REGISTRATION_JOURNEYS.filter((journey) => journey.officialUrl).length, note: 'source-linked routes', icon: ExternalLink, color: '#059669', tint: '#ECFDF5' },
            { label: 'State coverage', value: 'Expanding', note: 'shown transparently', icon: MapPin, color: '#FF8A34', tint: '#FFF7ED' },
          ].map((stat) => <div key={stat.label} className="glass flex items-center gap-4 p-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: stat.tint, color: stat.color }}><stat.icon size={20} /></div><div><div className="text-xl font-black text-slate-900">{stat.value}</div><div className="text-xs font-semibold text-slate-600">{stat.label}</div><div className="mt-0.5 text-[11px] text-slate-400">{stat.note}</div></div></div>)}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Your national setup map</p><h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Choose what you&apos;re working on</h2><p className="mt-1 text-sm text-slate-500">Every route is preparation-first until a reviewer confirms the current official requirements.</p></div><a href="/dashboard/compliance" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800">Open compliance tracker <ArrowRight size={15} /></a></div>
            <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{FILTERS.map((item) => <button key={item.id} onClick={() => setFilter(item.id)} className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-bold transition-all ${filter === item.id ? 'border-transparent text-white shadow-md' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-700'}`} style={filter === item.id ? { backgroundColor: item.color } : undefined}>{item.label}</button>)}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleJourneys.map((journey) => {
                const meta = CATEGORY_META[journey.category]
                const done = journey.steps.filter((_, index) => completedSteps.has(`${journey.id}:${index}`)).length
                const selected = selectedJourney?.id === journey.id
                return <button key={journey.id} onClick={() => setSelectedId(journey.id)} className={`glass group text-left p-5 transition-all ${selected ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}`}><div className="flex items-start justify-between gap-3"><span className="rounded-xl p-2.5" style={{ backgroundColor: meta.tint, color: meta.color }}>{journey.category === 'foundation' ? <Building2 size={19} /> : journey.category === 'workforce' ? <Users size={19} /> : journey.category === 'state' ? <MapPin size={19} /> : <FileText size={19} />}</span><span className="rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: journey.status === 'expanding' ? '#F1F5F9' : '#FEF3C7', color: journey.status === 'expanding' ? '#64748B' : '#A16207' }}>{journey.status === 'expanding' ? 'Expanding' : 'Review required'}</span></div><div className="mt-4 text-base font-extrabold text-slate-900">{journey.shortTitle}</div><p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">{journey.description}</p><div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400"><span>{done}/{journey.steps.length} preparation tasks</span><ChevronRight size={16} className="text-indigo-500 transition-transform group-hover:translate-x-1" /></div></button>
              })}
            </div>
          </div>

          {selectedJourney && <aside className="glass h-fit overflow-hidden lg:sticky lg:top-5"><div className="p-5" style={{ background: `linear-gradient(135deg, ${CATEGORY_META[selectedJourney.category].tint}, #fff)` }}><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: CATEGORY_META[selectedJourney.category].color }}><FileCheck2 size={15} /> {CATEGORY_META[selectedJourney.category].label}</div><h3 className="mt-2 text-xl font-black text-slate-900">{selectedJourney.title}</h3><p className="mt-2 text-sm leading-5 text-slate-600">{selectedJourney.whyItMatters}</p></div><div className="space-y-5 p-5"><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400"><CheckCircle2 size={14} className="text-emerald-500" /> Prerequisites</div><ul className="space-y-2">{selectedJourney.prerequisites.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{item}</li>)}</ul></div><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400"><FileText size={14} className="text-indigo-500" /> Documents to prepare</div><ul className="space-y-2">{selectedJourney.documents.map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />{item}</li>)}</ul></div><div><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400"><Clock3 size={14} className="text-orange-500" /> Preparation checklist</div><div className="space-y-2">{selectedJourney.steps.map((step, index) => { const key = `${selectedJourney.id}:${index}`; const done = completedSteps.has(key); return <button key={step} onClick={() => toggleStep(selectedJourney.id, index)} className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left text-xs leading-5 transition-colors ${done ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-200'}`}><span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>{done && <Check size={11} />}</span>{step}</button> })}</div></div><div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><span className="font-bold">Review gate:</span> {selectedJourney.reviewNote}</div><div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4"><div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Source</div><div className="truncate text-xs font-semibold text-slate-700">{selectedJourney.sourceLabel}</div></div><button disabled={!selectedJourney.officialUrl} onClick={() => openOfficialRoute(selectedJourney)} className="btn-accent shrink-0 px-3 py-2 text-xs disabled:cursor-not-allowed"><ExternalLink size={13} /> View official source</button></div></div></aside>}
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-2"><div className="glass p-5 sm:p-6"><div className="flex items-start gap-3"><div className="rounded-xl bg-orange-50 p-2.5 text-orange-500"><CircleHelp size={19} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-orange-600">Structure orientation</p><h2 className="mt-1 text-lg font-black text-slate-900">Start with the right entity</h2><p className="mt-1 text-sm leading-5 text-slate-500">{primaryType ? `Based on your ${displayStage(business.stage)} profile, ${primaryType.name} is the current starting point.` : 'Complete your business profile to receive an entity-structure starting point.'}</p></div></div>{primaryType && <div className="mt-4 flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3"><span className="text-sm font-extrabold text-orange-900">{primaryType.shortName}</span><span className="text-xs font-semibold text-orange-700">Orientation only · verify current rules</span></div>}</div><div className="glass p-5 sm:p-6"><div className="flex items-start gap-3"><div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600"><Landmark size={19} /></div><div><p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Important boundary</p><h2 className="mt-1 text-lg font-black text-slate-900">We prepare. You submit.</h2><p className="mt-1 text-sm leading-5 text-slate-500">UdyamVeda does not impersonate applicants, store passwords or OTPs, or present itself as an authorised government filing portal.</p></div></div><Link href="/dashboard/schemes" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800">Continue to opportunities <ArrowRight size={15} /></Link></div></section>
      </div>
    </main>
  )
}
