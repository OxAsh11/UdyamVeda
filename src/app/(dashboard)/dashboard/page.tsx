import Link from 'next/link'
import {
  ArrowRight,
  BellRing,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Files,
  Landmark,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { profileFromBusinessFacts } from '@/lib/businesses/profile'
import type { BusinessProfileForMatching } from '@/lib/opportunities/types'
import { COMPLIANCE_ITEMS, calculateHealthScore, filterCompliance } from '@/lib/data/compliance-roadmap'
import { recommendPublishedOpportunities } from '@/lib/opportunities/published-recommendations'
import { AUTH_REQUIRED } from '@/lib/auth/mode'

const categories = [
  { label: 'Government schemes', count: 'Central catalog', icon: Landmark, color: 'bg-indigo-50 text-indigo-700', href: '/dashboard/schemes' },
  { label: 'Startup grants', count: 'Seed & innovation', icon: Rocket, color: 'bg-orange-50 text-orange-700', href: '/dashboard/schemes?type=grant' },
  { label: 'Loans & subsidies', count: 'Capital support', icon: TrendingUp, color: 'bg-amber-50 text-amber-700', href: '/dashboard/schemes?type=loan' },
  { label: 'Registration & licences', count: 'Build your base', icon: Building2, color: 'bg-emerald-50 text-emerald-700', href: '/dashboard/registration' },
  { label: 'Accelerators', count: 'Incubation & mentors', icon: Sparkles, color: 'bg-violet-50 text-violet-700', href: '/dashboard/schemes?type=accelerator' },
  { label: 'Compliance', count: 'Stay ready', icon: ShieldCheck, color: 'bg-cyan-50 text-cyan-700', href: '/dashboard/compliance' },
]

function formatBenefit(value: string) {
  return value.replace('Government of ', '').slice(0, 28)
}

function recommendationLabel(status: string) {
  return {
    eligible: 'Eligible',
    likely: 'Likely eligible',
    possible: 'Possibly eligible',
    needs_information: 'More information required',
    not_eligible: 'Not eligible',
  }[status] ?? 'Under review'
}

function factLabel(value: string) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, character => character.toUpperCase())
}

export default async function DashboardPage() {
  let profile: { full_name?: string | null } | null = null
  let business: BusinessProfileForMatching | null = null
  let complianceRows: { item_id: string; completed: boolean }[] = []
  let applications: { id: string; status: string }[] = []

  if (AUTH_REQUIRED) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [{ data: profileData }, { data: complianceData }] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('compliance_progress').select('item_id, completed').eq('user_id', user.id),
    ])
    const { business: workspace } = await getBusinessForUser(supabase, user.id)
    const { data: facts } = workspace ? await getBusinessFacts(supabase, workspace.id) : { data: [] }
    const { data: applicationData } = workspace
      ? await supabase.from('applications').select('id, status').eq('business_id', workspace.id).limit(20)
      : { data: [] }
    profile = profileData
    business = workspace ? profileFromBusinessFacts(workspace, facts ?? []) : null
    complianceRows = complianceData ?? []
    applications = applicationData ?? []
  }

  const applicable = business ? filterCompliance(COMPLIANCE_ITEMS, { sector: business.sector ?? '', stage: business.stage ?? '' }) : COMPLIANCE_ITEMS
  const completedIds = (complianceRows ?? []).filter(row => row.completed).map(row => row.item_id)
  const { score, completed: complianceDone, total: complianceTotal } = calculateHealthScore(applicable, completedIds)
  const recommendationResult = business
    ? await recommendPublishedOpportunities(business)
    : { items: [], source: 'no_business' as const, availability: 'available' as const }
  const recommendations = recommendationResult.items.filter(item => item.recommendationStatus !== 'not_eligible').slice(0, 3)
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const activeApplications = (applications ?? []).filter(item => !['approved', 'rejected', 'withdrawn'].includes(item.status)).length

  return (
    <div className="mx-auto max-w-[1500px] p-5 md:p-8">
      <section className="uv-gradient uv-hero-grid relative mb-6 overflow-hidden rounded-[1.5rem] border border-indigo-100 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm"><Sparkles size={13} /> Your business command centre</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">Discover. Apply. Grow.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Welcome back, {firstName}. UdyamVeda brings your registrations, government opportunities, compliance, and growth plans into one clear workspace.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/schemes" className="btn-accent px-4 py-2.5 text-sm">Explore opportunities <ArrowRight size={15} /></Link>
            <Link href="/dashboard/registration" className="rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-indigo-800 hover:bg-white">Complete setup</Link>
          </div>
        </div>
        <div className="absolute -right-10 -top-16 hidden h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl md:block" />
        <div className="absolute -bottom-20 right-20 hidden h-56 w-56 rounded-full bg-orange-300/30 blur-3xl md:block" />
        <div className="absolute right-12 top-8 hidden text-[9rem] font-black leading-none text-white/70 md:block">✦</div>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Link href="/dashboard/registration" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">
          <div className="relative z-10"><div className="mb-8 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Building2 size={21} /></span><ArrowRight className="transition group-hover:translate-x-1" size={18} /></div><div className="text-xl font-bold">Start & Operate</div><p className="mt-1 max-w-sm text-sm leading-5 text-indigo-100">Choose the right structure, unlock support, stay compliant, and keep every document ready.</p><div className="mt-5 flex gap-2 text-xs text-indigo-100"><span className="rounded-full bg-white/15 px-2.5 py-1">Registration</span><span className="rounded-full bg-white/15 px-2.5 py-1">Schemes</span><span className="rounded-full bg-white/15 px-2.5 py-1">Compliance</span></div></div>
          <div className="absolute -bottom-16 -right-8 h-44 w-44 rounded-full border-[24px] border-white/10" />
        </Link>
        <Link href="/dashboard/strategy" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 p-6 text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5">
          <div className="relative z-10"><div className="mb-8 flex items-center justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15"><Target size={21} /></span><ArrowRight className="transition group-hover:translate-x-1" size={18} /></div><div className="text-xl font-bold">Grow</div><p className="mt-1 max-w-sm text-sm leading-5 text-orange-50">Turn your positioning into a practical growth system with strategy, plays, campaigns, and tracking.</p><div className="mt-5 flex gap-2 text-xs text-orange-50"><span className="rounded-full bg-white/15 px-2.5 py-1">Strategy</span><span className="rounded-full bg-white/15 px-2.5 py-1">Plays</span><span className="rounded-full bg-white/15 px-2.5 py-1">Track</span></div></div>
          <div className="absolute -right-8 -top-12 h-44 w-44 rounded-full border-[24px] border-white/10" />
        </Link>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Opportunities for you', value: recommendations.length || '—', note: 'matched to your profile', icon: Landmark, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Applications in progress', value: activeApplications, note: 'keep moving forward', icon: ClipboardCheck, color: 'text-orange-600 bg-orange-50' },
          { label: 'Readiness score', value: `${score}%`, note: `${complianceDone}/${complianceTotal} items complete`, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Next action', value: complianceTotal > complianceDone ? '1 task' : 'Ready', note: 'make progress today', icon: CheckCircle2, color: 'text-violet-600 bg-violet-50' },
        ].map(item => (
          <div key={item.label} className="glass p-4 md:p-5"><div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${item.color}`}><item.icon size={17} /></div><div className="text-xl font-extrabold text-slate-900">{item.value}</div><div className="mt-1 text-xs font-semibold text-slate-600">{item.label}</div><div className="mt-1 text-[11px] text-slate-400">{item.note}</div></div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <section className="mb-6">
            <div className="mb-3 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-500">Explore the ecosystem</p><h2 className="mt-1 text-xl font-bold text-slate-900">Find support for every stage</h2></div><Link href="/dashboard/schemes" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">View all <ArrowRight size={13} className="ml-1 inline" /></Link></div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {categories.map(item => <Link key={item.label} href={item.href} className="glass group p-4 hover:-translate-y-0.5"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}><item.icon size={18} /></div><div className="text-sm font-bold text-slate-800">{item.label}</div><div className="mt-1 text-[11px] text-slate-400">{item.count}</div><ArrowRight size={14} className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" /></Link>)}
            </div>
          </section>

          <section className="glass p-5 md:p-6">
            <div className="mb-5 flex items-start justify-between"><div><div className="flex items-center gap-2"><BellRing size={17} className="text-orange-500" /><h2 className="font-bold text-slate-900">Recommended for you</h2></div><p className="mt-1 text-xs text-slate-400">Based on your current business profile · each match has an explanation</p></div><Link href="/dashboard/schemes" className="text-xs font-semibold text-indigo-600">See all</Link></div>
            <div className="space-y-3">
              {recommendations.length > 0 ? recommendations.map(item => <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/75 p-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm"><Landmark size={17} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-bold text-slate-800">{item.name}</h3><span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">{recommendationLabel(item.recommendationStatus)}</span></div><p className="mt-1 text-xs text-slate-500">{item.benefitLabel}</p><p className="mt-2 text-[11px] text-slate-400">{formatBenefit(item.authority)} · {item.sourceLabel}</p><p className="mt-2 text-[11px] text-slate-500">{item.reasons[0] ?? item.blockers[0] ?? 'Matched against the reviewed eligibility rules.'}</p><p className="mt-2 text-[11px] text-slate-400">{item.factsUsed.filter(fact => fact.verified).map(fact => factLabel(fact.key)).join(', ') || 'No separately verified business facts used'} · {item.missingFacts.length ? `Needs: ${item.missingFacts.map(factLabel).join(', ')}` : 'No missing profile facts'} · {item.urgency} · deadline {item.deadline}</p><p className="mt-1 text-[11px] text-slate-400">source {item.sourceRevision ?? 'unavailable'} · {item.lastVerifiedAt ? `verified ${new Date(item.lastVerifiedAt).toLocaleDateString('en-IN')}` : 'verification date unavailable'}</p></div></div><Link href="/dashboard/schemes" className="shrink-0 rounded-lg border border-indigo-100 bg-white px-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">View details</Link></div>) : <div className={`rounded-xl border border-dashed p-5 text-sm ${recommendationResult.availability === 'unavailable' ? 'border-rose-200 bg-rose-50/70 text-rose-900' : 'border-indigo-200 bg-indigo-50/50 text-slate-600'}`}><div className={`flex items-center gap-2 font-semibold ${recommendationResult.availability === 'unavailable' ? 'text-rose-800' : 'text-indigo-800'}`}><Lightbulb size={16} /> {recommendationResult.availability === 'unavailable' ? 'Opportunity catalog is temporarily unavailable' : recommendationResult.source === 'empty_unpublished' ? 'Catalog verification is in progress' : 'Complete your profile to unlock matches'}</div><p className="mt-2 text-xs leading-5 text-slate-500">{recommendationResult.availability === 'unavailable' ? 'Recommendations are paused until the catalog connection is restored. No eligibility result is being inferred.' : recommendationResult.source === 'empty_unpublished' ? 'We are reviewing official sources before showing Government opportunities as actionable recommendations.' : 'We need more business facts before we can explain which published opportunities fit.'}</p><Link href="/dashboard/schemes" className="mt-3 inline-flex text-xs font-bold text-indigo-600">Explore catalog status <ArrowRight size={13} className="ml-1" /></Link></div>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="glass p-5"><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Your next move</p><h2 className="mt-1 font-bold text-slate-900">Readiness roadmap</h2></div><span className="text-2xl font-black text-emerald-600">{score}</span></div><div className="mb-4 h-2 overflow-hidden rounded-full bg-emerald-50"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} /></div><p className="text-xs leading-5 text-slate-500">{complianceTotal > complianceDone ? `You have ${complianceTotal - complianceDone} readiness items left before your next milestone.` : 'Your current checklist is complete. Keep your source documents fresh.'}</p><Link href="/dashboard/compliance" className="mt-4 inline-flex items-center text-xs font-bold text-emerald-700">Open checklist <ArrowRight size={13} className="ml-1" /></Link></section>
          <section className="glass p-5"><div className="mb-4 flex items-center gap-2"><CalendarDays size={17} className="text-violet-500" /><h2 className="font-bold text-slate-900">Workspace shortcuts</h2></div><div className="space-y-2"><Link href="/dashboard/applications" className="flex items-center gap-3 rounded-xl bg-violet-50/70 p-3 text-xs font-semibold text-violet-800 hover:bg-violet-100"><ClipboardCheck size={15} />Applications workspace<ArrowRight size={13} className="ml-auto" /></Link><Link href="/dashboard/documents" className="flex items-center gap-3 rounded-xl bg-cyan-50/70 p-3 text-xs font-semibold text-cyan-800 hover:bg-cyan-100"><Files size={15} />Document vault<ArrowRight size={13} className="ml-auto" /></Link><Link href="/dashboard/calendar" className="flex items-center gap-3 rounded-xl bg-orange-50/70 p-3 text-xs font-semibold text-orange-800 hover:bg-orange-100"><CalendarDays size={15} />Growth calendar<ArrowRight size={13} className="ml-auto" /></Link></div></section>
        </aside>
      </div>
    </div>
  )
}
