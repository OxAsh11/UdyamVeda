import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, FileCheck2, Landmark, ShieldCheck } from 'lucide-react'
import { getPublishedOpportunity } from '@/lib/opportunities/published'
import { applicationView, eligibilityView, humanize, isInternalNote } from '@/lib/opportunities/display'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
}

const INR = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

function benefitAmount(benefit: { amountMin: number | null; amountMax: number | null; percentage: number | null }) {
  if (benefit.amountMin !== null && benefit.amountMax !== null) return `₹${INR.format(benefit.amountMin)} – ₹${INR.format(benefit.amountMax)}`
  if (benefit.amountMax !== null) return `Up to ₹${INR.format(benefit.amountMax)}`
  if (benefit.percentage !== null) return `${benefit.percentage}%`
  return null
}

function publicText(value: string | null | undefined) {
  return value && !isInternalNote(value) ? value : null
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params
  const opportunity = await getPublishedOpportunity(slug)
  if (!opportunity) notFound()

  const eligibility = eligibilityView(opportunity.eligibility)
  const application = applicationView(opportunity.application)
  const objective = publicText(opportunity.objective)
  const legalBasis = publicText(opportunity.legalBasis)
  const steps = opportunity.steps.filter(step => !isInternalNote(step.title))

  return (
    <main className="min-h-screen bg-[#f8f7f3] px-4 py-6 text-[#111827] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/dashboard/schemes" className="text-sm font-bold text-indigo-700 underline underline-offset-2">← Back to opportunities</Link>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">Source-linked record</span>
        </div>

        <section className="rounded-[1.75rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-200 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-indigo-100">{opportunity.authority} · {humanize(opportunity.coverage)} scheme</p>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">{opportunity.name}</h1>
              <p className="mt-4 text-sm leading-6 text-indigo-100">{opportunity.description}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-white/15 px-3 py-2">{humanize(opportunity.benefitType)}</span><span className="rounded-full bg-white/15 px-3 py-2">{humanize(opportunity.status)}</span><span className="rounded-full bg-white/15 px-3 py-2">Last checked {opportunity.lastVerifiedAt ? new Date(opportunity.lastVerifiedAt).toLocaleDateString('en-IN') : 'date unavailable'}</span></div>
            </div>
            <a href={opportunity.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-indigo-700">Open official portal <ExternalLink size={14} /></a>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-orange-700">What you get</p><p className="mt-2 text-lg font-black text-orange-950">{opportunity.benefitLabel}</p></div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Application window</p><p className="mt-2 text-lg font-black text-cyan-950">{opportunity.deadline}</p>{opportunity.windowNote && <p className="mt-2 text-xs leading-5 text-cyan-900">{opportunity.windowNote}</p>}<p className="mt-2 text-xs text-cyan-800">Processing: {opportunity.processingTime}</p></div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Source</p><p className="mt-2 text-sm font-bold text-emerald-950">{opportunity.sourceLabel}</p><p className="mt-2 text-xs text-emerald-800">Always confirm current terms on the official portal before applying.</p></div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-600" /><h2 className="font-black">Who can apply</h2></div>
            {eligibility.chips.map(group => <div key={group.label} className="mt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{group.label}</p><div className="mt-2 flex flex-wrap gap-1.5">{group.values.map(value => <span key={value} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{value}</span>)}</div></div>)}
            {eligibility.conditions.length > 0 && <ul className="mt-4 space-y-2">{eligibility.conditions.map(condition => <li key={condition} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{condition}</li>)}</ul>}
            {eligibility.thresholds.length > 0 && <dl className="mt-4 grid gap-2 text-sm">{eligibility.thresholds.map(item => <div key={item.label} className="rounded-xl bg-slate-50 p-3"><dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{item.label}</dt><dd className="mt-1 text-slate-700">{item.value}</dd></div>)}</dl>}
            {eligibility.exclusions.length > 0 && <div className="mt-4"><p className="text-[11px] font-bold uppercase tracking-wide text-rose-700">Not eligible if</p><ul className="mt-2 space-y-2">{eligibility.exclusions.map(exclusion => <li key={exclusion} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />{exclusion}</li>)}</ul></div>}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2"><Landmark size={17} className="text-indigo-600" /><h2 className="font-black">About the scheme</h2></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{objective ?? opportunity.description}</p>
            {legalBasis && <p className="mt-4 text-xs leading-5 text-slate-500"><span className="font-bold text-slate-600">Legal basis: </span>{legalBasis}</p>}
            {(application.route || application.selection || application.fees) && <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-700">
              {application.route && <p><span className="font-bold text-slate-900">How to apply: </span>{application.route}</p>}
              {application.selection && <p><span className="font-bold text-slate-900">Selection: </span>{application.selection}</p>}
              {application.fees && <p><span className="font-bold text-slate-900">Fees: </span>{application.fees}</p>}
            </div>}
          </section>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><FileCheck2 size={17} className="text-orange-600" /><h2 className="font-black">Benefits</h2></div><div className="mt-4 space-y-3">{opportunity.benefits.length ? opportunity.benefits.map((benefit, index) => <div key={`${benefit.type}-${index}`} className="rounded-xl bg-orange-50 p-4 text-sm"><p className="font-bold text-orange-950">{isInternalNote(benefit.label) ? humanize(benefit.type) : benefit.label}</p><p className="mt-1 text-xs text-orange-800">{humanize(benefit.type)}{benefitAmount(benefit) ? ` · ${benefitAmount(benefit)}` : ''}</p></div>) : <p className="text-sm text-slate-500">See the official portal for benefit details.</p>}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Keep ready</h2><div className="mt-4 space-y-3">{opportunity.requirements.length ? opportunity.requirements.map(requirement => <div key={requirement.name} className="rounded-xl bg-slate-50 p-4 text-sm"><div className="flex flex-wrap justify-between gap-2"><span className="font-bold text-slate-800">{requirement.name}</span><span className={requirement.required ? 'text-xs font-bold text-rose-700' : 'text-xs text-slate-500'}>{requirement.required ? 'Required' : 'If applicable'}</span></div>{publicText(requirement.description) && <p className="mt-1 text-xs leading-5 text-slate-600">{requirement.description}</p>}{requirement.acceptedFormats.length > 0 && <p className="mt-2 text-[11px] text-slate-500">Formats: {requirement.acceptedFormats.join(', ')}{requirement.maxSizeMb ? ` · Max ${requirement.maxSizeMb} MB` : ''}</p>}</div>) : <p className="text-sm text-slate-500">See the official portal for required documents.</p>}</div></section>
        </div>

        {steps.length > 0 && <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Application steps</h2><ol className="mt-4 grid gap-3 md:grid-cols-2">{steps.map(step => <li key={step.number} className="rounded-xl bg-indigo-50 p-4"><div className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{step.number}</span><div><p className="font-bold text-indigo-950">{step.title}</p>{publicText(step.description) && <p className="mt-1 text-xs leading-5 text-indigo-900">{step.description}</p>}{step.expectedDays !== null && <p className="mt-2 text-[11px] text-indigo-700">Expected time: {step.expectedDays} days</p>}{step.officialUrl && <a href={step.officialUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-indigo-700 underline">Official step route</a>}</div></div></li>)}</ol></section>}

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-black">Official sources</h2><div className="mt-4 space-y-3">{opportunity.sources.map(source => <div key={`${source.url}-${source.anchor}`} className="rounded-xl bg-slate-50 p-4 text-xs"><div className="flex flex-wrap gap-2"><span className={source.isPrimary ? 'font-bold text-emerald-700' : 'text-slate-500'}>{source.isPrimary ? 'Primary source' : 'Supporting source'}</span><span className="text-slate-500">{humanize(source.kind)}</span></div><a href={source.url} target="_blank" rel="noreferrer" className="mt-2 block break-all font-semibold text-indigo-700 underline">{source.title ?? source.url}</a>{(source.pageNumber || source.section) && <p className="mt-2 text-slate-600">{source.pageNumber ? `Page ${source.pageNumber}` : ''}{source.pageNumber && source.section ? ' · ' : ''}{source.section ? `Section ${source.section}` : ''}</p>}</div>)}</div></section>
      </div>
    </main>
  )
}
