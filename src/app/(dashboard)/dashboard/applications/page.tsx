import Link from 'next/link'
import { ArrowRight, ClipboardCheck, FileText, Landmark, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

function firstRelation<T>(value: T | T[] | null | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? null
}

export default async function ApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { business } = await getBusinessForUser(supabase, user.id)
  const { data: rows } = business
    ? await supabase.from('applications').select('id, opportunity_id, status, created_at, opportunity:opportunities(name, slug)').eq('business_id', business.id).limit(20).order('created_at', { ascending: false })
    : { data: [] }
  const applications = rows ?? []

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Start & Operate</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Applications workspace</h1><p className="mt-2 max-w-xl text-sm text-slate-500">Keep every opportunity, task, document, and official handoff in one place for {business?.name ?? 'your business'}.</p></div><Link href="/dashboard/schemes" className="btn-accent px-4 py-2.5 text-sm">Find an opportunity <ArrowRight size={15} /></Link></div>
      <div className="mb-6 grid gap-4 md:grid-cols-3"><div className="glass p-5"><div className="text-3xl font-black text-violet-600">{applications.length}</div><div className="mt-1 text-sm font-semibold text-slate-700">Applications started</div><div className="mt-1 text-xs text-slate-400">tracked in your workspace</div></div><div className="glass p-5"><div className="text-3xl font-black text-orange-500">{applications.filter(item => item.status === 'started').length}</div><div className="mt-1 text-sm font-semibold text-slate-700">Need your next task</div><div className="mt-1 text-xs text-slate-400">move one step forward today</div></div><div className="glass p-5"><div className="text-3xl font-black text-emerald-600">{applications.filter(item => item.status === 'approved').length}</div><div className="mt-1 text-sm font-semibold text-slate-700">Approved</div><div className="mt-1 text-xs text-slate-400">confirmed outcomes only</div></div></div>
      <section className="glass p-5 md:p-6"><div className="mb-5 flex items-center gap-2"><ClipboardCheck size={18} className="text-violet-600" /><h2 className="font-bold text-slate-900">Your application timeline</h2></div>{applications.length > 0 ? <div className="space-y-3">{applications.map(item => <Link href={`/dashboard/applications/${item.id}`} key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-violet-200 hover:bg-violet-50/40"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Landmark size={17} /></div><div className="flex-1"><div className="text-sm font-bold text-slate-800">{firstRelation(item.opportunity)?.name ?? `Opportunity ${item.opportunity_id}`}</div><div className="mt-1 text-xs text-slate-400">Started {new Date(item.created_at).toLocaleDateString('en-IN')}</div></div><span className="rounded-full bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">{item.status.replace('_', ' ')}</span><ArrowRight size={15} className="text-slate-300" /></Link>)}</div> : <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-8 text-center"><Sparkles className="mx-auto text-violet-500" size={24} /><h3 className="mt-3 font-bold text-violet-900">Your first application starts here</h3><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">Save an opportunity, review its requirements, and begin a guided checklist. We will keep the official portal handoff clear.</p><Link href="/dashboard/schemes" className="mt-4 inline-flex items-center text-xs font-bold text-violet-700">Explore opportunities <ArrowRight size={13} className="ml-1" />
      </Link></div>}</section>
      <section className="mt-6 grid gap-4 md:grid-cols-2"><div className="glass p-5"><FileText size={18} className="text-cyan-600" /><h3 className="mt-3 font-bold text-slate-900">Documents ready for reuse</h3><p className="mt-1 text-xs leading-5 text-slate-500">Store reviewed business documents once and attach them to the relevant applications.</p><Link href="/dashboard/documents" className="mt-4 inline-flex text-xs font-bold text-cyan-700">Open vault <ArrowRight size={13} className="ml-1" /></Link></div><div className="glass p-5"><ClipboardCheck size={18} className="text-emerald-600" /><h3 className="mt-3 font-bold text-slate-900">Need a human handoff?</h3><p className="mt-1 text-xs leading-5 text-slate-500">Request assisted preparation or a managed concierge handoff when you are ready.</p><button className="mt-4 text-xs font-bold text-emerald-700">Request help <ArrowRight size={13} className="ml-1 inline" /></button></div></section>
    </div>
  )
}
