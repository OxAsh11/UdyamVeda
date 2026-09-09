import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, FileText, Landmark, ShieldCheck } from 'lucide-react'
import { SectionEyebrow, SiteShell } from '@/components/marketing/site-shell'
import { getPublishedOpportunity } from '@/lib/opportunities/published'
import { CATEGORY_LABELS, BENEFIT_TYPE_LABELS } from '@/lib/opportunities/taxonomy'

export const revalidate = 300

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const record = await getPublishedOpportunity(slug)
  if (!record) return { title: 'Scheme not found' }
  return {
    title: record.shortName ?? record.name,
    description: record.benefitLabel || record.description,
  }
}

function asTextArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  return []
}

export default async function SchemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const record = await getPublishedOpportunity(slug)
  if (!record) notFound()

  const primarySource = record.sources.find(s => s.isPrimary) ?? record.sources[0]
  const eligibilityNotes = asTextArray(record.eligibility?.notes).length
    ? asTextArray(record.eligibility.notes)
    : Object.values(record.eligibility ?? {}).slice(0, 6).map(String)
  const applicationSteps = Array.isArray(record.steps) ? record.steps : []
  const benefits = Array.isArray(record.benefits) ? record.benefits : []
  const requirements = Array.isArray(record.requirements) ? record.requirements : []

  const amount = (b: typeof benefits[number]) => {
    if (b.amountMin != null && b.amountMax != null) return `₹${b.amountMin.toLocaleString('en-IN')} – ₹${b.amountMax.toLocaleString('en-IN')}`
    if (b.amountMax != null) return `Up to ₹${b.amountMax.toLocaleString('en-IN')}`
    if (b.percentage != null) return `${b.percentage}%`
    return null
  }

  return <SiteShell>
    <section className="vv-page-hero vv-collection-blue">
      <div className="vv-container">
        <Link href="/schemes" className="vv-back-link"><ArrowLeft size={15} /> All schemes</Link>
        <div className="vv-scheme-hero-inner">
          <div>
            <SectionEyebrow icon={Landmark}>{record.authority}</SectionEyebrow>
            <h1>{record.shortName ?? record.name}</h1>
            <p>{record.benefitLabel || record.description}</p>
            <div className="vv-hero-proof">
              <span><CheckCircle2 size={15} /> {CATEGORY_LABELS[record.category] ?? record.category}</span>
              <span><ShieldCheck size={15} /> {BENEFIT_TYPE_LABELS[record.benefitType] ?? record.benefitType}</span>
              {record.deadline && <span><Clock3 size={15} /> {record.deadline}</span>}
            </div>
          </div>
          {record.officialUrl && (
            <a className="vv-button vv-button-primary" href={record.officialUrl} target="_blank" rel="noopener noreferrer">
              Official portal <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </div>
    </section>

    <section className="vv-resource-section vv-detail-page">
      <div className="vv-container vv-scheme-detail-layout">

        <div className="vv-scheme-main">
          {record.objective && (
            <div className="vv-scheme-block">
              <SectionEyebrow>What it is</SectionEyebrow>
              <p className="vv-scheme-lead">{record.objective}</p>
            </div>
          )}

          {benefits.length > 0 && (
            <div className="vv-scheme-block">
              <SectionEyebrow>What you get</SectionEyebrow>
              <ul className="vv-scheme-list">
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <strong>{benefit.label}</strong>
                    {amount(benefit) && <span>{amount(benefit)}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {eligibilityNotes.length > 0 && (
            <div className="vv-scheme-block">
              <SectionEyebrow>Who it is for</SectionEyebrow>
              <ul className="vv-scheme-checklist">
                {eligibilityNotes.map((note, index) => <li key={index}>{note}</li>)}
              </ul>
            </div>
          )}

          {applicationSteps.length > 0 && (
            <div className="vv-scheme-block">
              <SectionEyebrow>How to apply</SectionEyebrow>
              <ol className="vv-scheme-steps">
                {applicationSteps.map(step => (
                  <li key={step.number}>
                    <span className="vv-step-num">{step.number}</span>
                    <div>
                      <strong>{step.title}</strong>
                      {step.description && <p>{step.description}</p>}
                      {step.officialUrl && <a href={step.officialUrl} target="_blank" rel="noopener noreferrer">Official step <ArrowUpRight size={13} /></a>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {requirements.length > 0 && (
            <div className="vv-scheme-block">
              <SectionEyebrow>Keep ready</SectionEyebrow>
              <div className="vv-card-tags vv-scheme-reqs">
                {requirements.map((requirement, index) => (
                  <span key={index}>{requirement.name}{requirement.required ? '' : ' (if applicable)'}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="vv-scheme-evidence">
          <div className="vv-evidence-card">
            <SectionEyebrow icon={ShieldCheck}>Evidence</SectionEyebrow>
            <p className="vv-evidence-lead">This record is built from official sources. The authority&apos;s portal remains the final word on eligibility and deadlines.</p>
            {record.sources.map((source, index) => (
              <a key={index} className="vv-evidence-source" href={source.url} target="_blank" rel="noopener noreferrer">
                <FileText size={15} />
                <div>
                  <strong>{source.title ?? source.kind}</strong>
                  <small>
                    {source.kind}{source.section ? ` · ${source.section}` : ''}{source.pageNumber ? ` · p.${source.pageNumber}` : ''}
                    {source.isPrimary ? ' · primary' : ''}
                  </small>
                </div>
                <ArrowUpRight size={14} />
              </a>
            ))}
            <div className="vv-evidence-meta">
              <span><CheckCircle2 size={13} /> {record.sourceLabel}</span>
              {record.lastVerifiedAt && <span><Clock3 size={13} /> Last verified {new Date(record.lastVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
            </div>
          </div>

          {primarySource && (
            <a className="vv-button vv-button-dark vv-evidence-cta" href={primarySource.url} target="_blank" rel="noopener noreferrer">
              Read the official source <ArrowUpRight size={15} />
            </a>
          )}
        </aside>

      </div>
    </section>
  </SiteShell>
}
