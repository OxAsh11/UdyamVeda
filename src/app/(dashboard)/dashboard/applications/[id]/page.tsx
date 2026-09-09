import Link from 'next/link'
import { ArrowLeft, ExternalLink, Landmark } from 'lucide-react'
import { notFound } from 'next/navigation'
import ApplicationWorkspaceControls from '@/components/applications/ApplicationWorkspaceControls'
import DocumentLinker from '@/components/applications/DocumentLinker'
import ConciergeRequestForm from '@/components/applications/ConciergeRequestForm'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { createClient } from '@/lib/supabase/server'

function firstRelation<T>(value: T | T[] | null | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? null
}

type PageContext = { params: Promise<{ id: string }> }

export default async function ApplicationDetailPage(context: PageContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { business } = await getBusinessForUser(supabase, user.id)
  if (!business) notFound()
  const { data: application } = await supabase
    .from('applications')
    .select('id, opportunity_id, opportunity_version_id, status, eligibility_snapshot, official_portal_url, target_date, created_at, updated_at, opportunity:opportunities(name, slug)')
    .eq('id', id)
    .eq('business_id', business.id)
    .maybeSingle()
  if (!application) notFound()

  const [{ data: tasks }, { data: events }, { data: links }, { data: requirements }] = await Promise.all([
    supabase.from('application_tasks').select('id, title, description, status, due_date, owner_id, depends_on_task_ids, completed_at').eq('application_id', id).order('sort_order'),
    supabase.from('application_status_events').select('id, from_status, to_status, note, created_at').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('application_document_links').select('id, status, business_document:business_documents(file_name, mime_type, expires_at, scan_status), opportunity_requirement:opportunity_requirements(name, required)').eq('application_id', id).order('created_at', { ascending: false }),
    supabase.from('opportunity_requirements').select('id, name, required').eq('opportunity_version_id', application.opportunity_version_id).eq('requirement_type', 'document').order('name'),
  ])
  const snapshot = application.eligibility_snapshot && typeof application.eligibility_snapshot === 'object' && !Array.isArray(application.eligibility_snapshot)
    ? application.eligibility_snapshot as Record<string, unknown>
    : {}
  const missingFacts = Array.isArray(snapshot.missing_facts) ? snapshot.missing_facts : []
  const blockers = Array.isArray(snapshot.blockers) ? snapshot.blockers : []
  const opportunity = firstRelation(application.opportunity)

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <Link href="/dashboard/applications" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-700"><ArrowLeft size={14} /> Back to applications</Link>
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Application workspace</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{opportunity?.name ?? 'Government opportunity'}</h1><p className="mt-2 text-sm text-slate-500">Versioned evidence, next actions, and official handoff for {business.name}.</p></div>
        <div className="flex items-center gap-3"><span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-orange-700">{application.status.replace('_', ' ')}</span>{application.official_portal_url ? <a href={application.official_portal_url} target="_blank" rel="noreferrer" className="btn-accent px-4 py-2.5 text-sm">Open official portal <ExternalLink size={14} /></a> : null}</div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="glass p-5 md:p-6"><div className="mb-5 flex items-center gap-2"><Landmark size={18} className="text-violet-600" /><h2 className="font-bold text-slate-900">Application controls</h2></div><ApplicationWorkspaceControls applicationId={id} initialStatus={application.status} initialTargetDate={application.target_date} initialTasks={tasks ?? []} currentUserId={user.id} /></section>
        <div className="space-y-5">
          <section className="glass p-5"><div className="flex items-center gap-2"><Landmark size={17} className="text-violet-600" /><h2 className="font-bold text-slate-900">Eligibility snapshot</h2></div><p className="mt-3 text-sm font-semibold text-slate-700">{String(snapshot.status ?? 'needs_information').replace('_', ' ')}</p><p className="mt-1 text-xs text-slate-500">Catalog version {String(snapshot.catalog_version_number ?? 'unknown')} · evaluated {snapshot.evaluated_at ? new Date(String(snapshot.evaluated_at)).toLocaleDateString('en-IN') : 'not recorded'}</p>{missingFacts.length ? <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs text-orange-900"><strong>More information needed:</strong> {missingFacts.map(String).join(', ')}</div> : null}{blockers.length ? <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-900"><strong>Blocking conditions:</strong> {blockers.map(String).join(', ')}</div> : null}</section>
          <section className="glass p-5"><div className="flex items-center gap-2"><Landmark size={17} className="text-cyan-600" /><h2 className="font-bold text-slate-900">Linked documents</h2></div><DocumentLinker applicationId={id} requirements={requirements ?? []} initialLinks={links ?? []} /></section>
          <section className="glass p-5"><div className="flex items-center gap-2"><Landmark size={17} className="text-emerald-600" /><h2 className="font-bold text-slate-900">Need assistance?</h2></div><ConciergeRequestForm applicationId={id} /></section>
        </div>
      </div>
      <section className="glass mt-5 p-5 md:p-6"><h2 className="font-bold text-slate-900">Status history</h2>{events?.length ? <div className="mt-4 space-y-3">{events.map(event => <div key={event.id} className="flex gap-3 text-xs"><div className="mt-1 h-2 w-2 rounded-full bg-violet-500" /><div><span className="font-bold text-slate-700">{event.to_status.replace('_', ' ')}</span>{event.note ? <span className="text-slate-500"> — {event.note}</span> : null}<div className="mt-1 text-slate-400">{new Date(event.created_at).toLocaleString('en-IN')}</div></div></div>)}</div> : <p className="mt-3 text-xs text-slate-500">No status history recorded.</p>}</section>
    </div>
  )
}
