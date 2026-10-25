import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Landmark, ShieldCheck } from 'lucide-react'
import { SectionEyebrow, SiteShell } from '@/components/marketing/site-shell'
import { searchPublishedOpportunities } from '@/lib/opportunities/published'
import { BENEFIT_TYPE_LABELS, OPPORTUNITY_GROUPS, opportunityGroup, type OpportunityGroup } from '@/lib/opportunities/taxonomy'
import type { OpportunitySummary } from '@/lib/opportunities/types'
import { humanize } from '@/lib/opportunities/display'

export const revalidate = 300

export const metadata = {
  title: 'Schemes & support',
  description: 'Every Central Government scheme, grant, loan, and compliance route — source-linked and explained in plain language.',
}

const TRACKS: Array<{ key: OpportunityGroup; blurb: string }> = [
  { key: 'grant', blurb: 'Grants, research funding, awards and challenges' },
  { key: 'loan_credit', blurb: 'Loans, guarantees and credit support' },
  { key: 'subsidy_incentive', blurb: 'Capital subsidies, PLI and other incentives' },
  { key: 'equity', blurb: 'Fund-of-funds and venture capital' },
  { key: 'tax', blurb: 'Income-tax and duty benefits' },
  { key: 'incubation', blurb: 'Incubators, accelerators and mentoring' },
  { key: 'market_access', blurb: 'Exports, procurement, fairs and exhibitions' },
  { key: 'registration_compliance', blurb: 'Registrations, licences, certification, standards' },
  { key: 'skills', blurb: 'Training, apprenticeships and skill programmes' },
  { key: 'enterprise_support', blurb: 'Technology, clusters, infrastructure and sector programmes' },
]

function statusBadge(status: OpportunitySummary['status']) {
  if (status === 'active') return { label: 'Open', tone: 'open' }
  if (status === 'upcoming') return { label: 'Upcoming', tone: 'upcoming' }
  if (status === 'paused') return { label: 'Paused', tone: 'upcoming' }
  if (status === 'pending_renewal') return { label: 'Renewal awaited', tone: 'upcoming' }
  if (status === 'closed') return { label: 'Closed', tone: 'closed' }
  return { label: status.replace('_', ' '), tone: 'other' }
}

export default async function SchemesPage() {
  // No limit: the overview counts and groups the whole published catalog.
  const result = await searchPublishedOpportunities()
  const records = result.items
  const available = result.availability === 'available'
  const total = records.length

  const open = records.filter(r => r.status === 'active').length
  const categories = Array.from(new Set(records.map(r => opportunityGroup(r.category))))
  const authorities = Array.from(new Set(records.map(r => r.authority)))
  // Open schemes first within each group, then alphabetical.
  const tracks = TRACKS
    .map(track => ({
      track,
      items: records
        .filter(r => opportunityGroup(r.category) === track.key)
        .sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active') || a.name.localeCompare(b.name)),
    }))
    .filter(({ items }) => items.length > 0)

  return <SiteShell>
    <section className="vv-page-hero vv-collection-blue">
      <div className="vv-container vv-page-hero-inner">
        <div>
          <SectionEyebrow icon={Landmark}>The source-linked catalog</SectionEyebrow>
          <h1>Every scheme, <span>source-linked.</span></h1>
          <p>
            {available && total > 0
              ? `${total} Central Government schemes, grants, loans, and compliance routes — each one linked to its official source and explained in plain language.`
              : 'A source-linked catalog of Central Government schemes, built record by record and published only after review.'}
          </p>
        </div>
        <div className="vv-page-stat">
          <strong>{available ? String(total).padStart(2, '0') : '—'}</strong>
          <span><CheckCircle2 size={14} /> source-linked records</span>
          <span><ShieldCheck size={14} /> official sources only</span>
        </div>
      </div>
    </section>

    <section className="vv-resource-section">
      <div className="vv-container">
        {available && total > 0 ? (
          <>
            <div className="vv-track-row" aria-label="Browse by track">
              {tracks.map(({ track }) => (
                <a key={track.key} href={`#track-${track.key}`}>{OPPORTUNITY_GROUPS[track.key]}</a>
              ))}
            </div>

            {tracks.map(({ track, items }) => (
              <div key={track.key} id={`track-${track.key}`} className="vv-scheme-track" style={{ marginBottom: 56 }}>
                <div className="vv-section-heading">
                  <div>
                    <SectionEyebrow icon={ShieldCheck}>{track.blurb}</SectionEyebrow>
                    <h2>{OPPORTUNITY_GROUPS[track.key]}</h2>
                  </div>
                  <span className="vv-track-count">{items.length} {items.length === 1 ? 'scheme' : 'schemes'}</span>
                </div>
                <div className="vv-featured-grid">
                  {items.slice(0, 6).map(record => <SchemeCard key={record.id} record={record} />)}
                </div>
                {items.length > 6 && (
                  <details className="vv-track-more">
                    <summary className="vv-text-link" style={{ cursor: 'pointer' }}>Show {items.length - 6} more</summary>
                    <div className="vv-featured-grid" style={{ marginTop: 24 }}>
                      {items.slice(6).map(record => <SchemeCard key={record.id} record={record} />)}
                    </div>
                  </details>
                )}
              </div>
            ))}

            <div className="vv-catalog-footnote">
              <ShieldCheck size={16} />
              <p>
                Coverage today: {categories.length} categories across {authorities.length} Central authorities — finance, startup, MSME, compliance, sector, and market-access routes.
                Official portals remain the final authority for eligibility and application decisions.
                {open > 0 && ` ${open} records are currently open.`}
              </p>
            </div>
          </>
        ) : (
          <div className="vv-empty">
            <h3>The catalog is being verified.</h3>
            <p>Records appear here only after source review. Nothing publishes unverified.</p>
            <Link className="vv-button vv-button-dark" href="/methodology">See how we verify <ArrowRight size={16} /></Link>
          </div>
        )}
      </div>
    </section>

    <section className="vv-closing">
      <div className="vv-container vv-closing-inner">
        <div>
          <SectionEyebrow>From record to application</SectionEyebrow>
          <h2>Found a scheme? Track it properly.</h2>
        </div>
        <a className="vv-button vv-button-light" href={`${process.env.NEXT_PUBLIC_APP_HOST ? `https://${process.env.NEXT_PUBLIC_APP_HOST}` : 'https://app.udyamveda.in'}/login`}>Open the workspace <ArrowRight size={17} /></a>
      </div>
    </section>
  </SiteShell>
}

// Some records hold a full sentence in `deadline`; a card tag needs a short label.
function shortDeadline(deadline: string) {
  if (deadline === 'rolling') return 'Rolling'
  return deadline.length > 36 ? 'See window details' : deadline
}

function SchemeCard({ record }: { record: OpportunitySummary }) {
  const badge = statusBadge(record.status)
  return (
    <article className={`vv-resource-card vv-scheme-card vv-scheme-${badge.tone}`}>
      <div className="vv-resource-card-top">
        <span className="vv-card-type">{OPPORTUNITY_GROUPS[opportunityGroup(record.category)]}</span>
        <span className={`vv-scheme-badge vv-scheme-badge-${badge.tone}`}>{badge.label}</span>
      </div>
      <Link href={`/schemes/${record.id}`} className="vv-card-title">{record.shortName ?? record.name}</Link>
      <p className="vv-card-summary">{record.benefitLabel || record.description}</p>
      <div className="vv-card-tags">
        <span>{BENEFIT_TYPE_LABELS[record.benefitType] ?? humanize(record.benefitType)}</span>
        {record.deadline && record.status === 'active' && <span title={record.deadline}><Clock3 size={11} style={{ display: 'inline', marginRight: 4 }} />{shortDeadline(record.deadline)}</span>}
      </div>
      <div className="vv-card-meta">
        <span><Landmark size={13} /> {record.authority}</span>
      </div>
      <div className="vv-card-source">
        <span className="vv-source-dot" />
        {record.verificationStatus === 'verified' || record.verificationStatus === 'in_review'
          ? `Source-linked · ${record.sourceLabel}`
          : record.sourceLabel}
      </div>
    </article>
  )
}
