import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import CorrectionForm, { type CorrectionInitial } from '@/components/admin/CorrectionForm'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function lines(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string').join('\n') : ''
}

// <input type="date"> works in calendar days; the catalog is India-facing.
function istDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) : ''
}

export default async function EditSchemePage({ params }: PageProps) {
  const { slug } = await params
  const { supabase, reviewer } = await getCatalogReviewer()
  if (!reviewer) {
    return <main className="mx-auto max-w-3xl p-8"><h1 className="text-2xl font-black">Catalog reviewer access is required</h1></main>
  }

  const { data: opportunity } = await supabase
    .from('opportunities')
    .select('slug, name, status, canonical_url, current_version_id, authority:authorities!opportunities_authority_id_fkey(name)')
    .eq('slug', slug)
    .maybeSingle()
  if (!opportunity?.current_version_id) notFound()

  const [{ data: version }, { data: windows }, { data: benefits }] = await Promise.all([
    supabase.from('opportunity_versions').select('version_number, summary, benefit_summary, application, eligibility, fine_print, last_verified_at').eq('id', opportunity.current_version_id).maybeSingle(),
    supabase.from('opportunity_windows').select('window_type, opens_at, closes_at, label').eq('opportunity_version_id', opportunity.current_version_id).limit(1),
    supabase.from('opportunity_benefits').select('label').eq('opportunity_version_id', opportunity.current_version_id).limit(1),
  ])
  if (!version) notFound()

  const authority = Array.isArray(opportunity.authority) ? opportunity.authority[0] : opportunity.authority
  const benefitSummary = record(version.benefit_summary)
  const application = record(version.application)
  const eligibility = record(version.eligibility)
  const window = windows?.[0]

  const initial: CorrectionInitial = {
    status: opportunity.status,
    officialUrl: opportunity.canonical_url ?? '',
    headline: text(benefitSummary.headline) || benefits?.[0]?.label || text(benefitSummary.summary),
    summary: version.summary ?? '',
    windowType: window?.window_type ?? 'rolling',
    opensAt: istDate(window?.opens_at ?? null),
    closesAt: istDate(window?.closes_at ?? null),
    windowNote: text(application.window_note),
    route: text(application.route),
    selection: text(application.selection),
    fees: text(application.fees),
    conditions: lines(eligibility.conditions),
    exclusions: lines(eligibility.exclusions),
    internalNote: text(record(version.fine_print).review_note),
  }

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/admin/catalog/edit" className="text-sm font-bold text-indigo-700 underline underline-offset-2">← All schemes</Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{authority?.name ?? 'Government authority'}</p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{opportunity.name}</h1>
        <p className="mt-2 text-sm text-slate-500">Version {version.version_number}{version.last_verified_at ? ` · last checked ${new Date(version.last_verified_at).toLocaleDateString('en-IN')}` : ''} · <a className="font-semibold text-indigo-700 underline" href={`/schemes/${opportunity.slug}`} target="_blank" rel="noreferrer">View public page</a></p>
        {window?.label && <details className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><summary className="cursor-pointer font-semibold text-slate-800">Reviewer note on the application window (internal, never shown to users)</summary><p className="mt-2 leading-6">{window.label}</p></details>}
        <CorrectionForm slug={opportunity.slug} initial={initial} />
      </div>
    </main>
  )
}
