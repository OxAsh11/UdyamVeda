import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock3, Landmark, ShieldCheck } from 'lucide-react'
import { SectionEyebrow, SiteShell } from '@/components/marketing/site-shell'
import { searchPublishedOpportunities } from '@/lib/opportunities/published'
import { CATEGORY_LABELS, BENEFIT_TYPE_LABELS } from '@/lib/opportunities/taxonomy'
import type { OpportunitySummary } from '@/lib/opportunities/types'

export const revalidate = 300

export const metadata = {
  title: 'Schemes & support',
  description: 'Every Central Government scheme, grant, loan, and compliance route — source-linked, verified, and explained in plain language.',
}

const TRACKS: Array<{ key: string; label: string; blurb: string }> = [
  { key: 'finance', label: 'Finance', blurb: 'Grants, credit, guarantees, subsidies' },
  { key: 'startup', label: 'Startup', blurb: 'Recognition, incubation, equity' },
  { key: 'compliance', label: 'Compliance', blurb: 'Registrations, licences, standards' },
  { key: 'sector', label: 'Sector', blurb: 'Agriculture, defence, fisheries' },
  { key: 'market_access', label: 'Market access', blurb: 'Exports, procurement, exhibitions' },
]

function statusBadge(status: OpportunitySummary['status']) {
  if (status === 'active') return { label: 'Open', tone: 'open' }
  if (status === 'upcoming') return { label: 'Upcoming', tone: 'upcoming' }
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
  const categories = Array.from(new Set(records.map(r => r.category))).sort()
  const authorities = Array.from(new Set(records.map(r => r.authority)))

  return <SiteShell>
    <section className="vv-page-hero vv-collection-blue">
      <div className="vv-container vv-page-hero-inner">
        <div>
          <SectionEyebrow icon={Landmark}>The verified catalog</SectionEyebrow>
          <h1>Every scheme, <span>source-linked.</span></h1>
          <p>
            {available && total > 0
              ? `${total} Central Government schemes, grants, loans, and compliance routes — each one traced to its official source, reviewed, and explained in plain language.`
              : 'A source-linked catalog of Central Government schemes, built record by record and published only after review.'}
          </p>
        </div>
        <div className="vv-page-stat">
          <strong>{available ? String(total).padStart(2, '0') : '—'}</strong>
          <span><CheckCircle2 size={14} /> reviewed records</span>
          <span><ShieldCheck size={14} /> official sources only</span>
        </div>
      </div>
    </section>

    <section className="vv-resource-section">
      <div className="vv-container">
        {available && total > 0 ? (
          <>
            <div className="vv-track-row" aria-label="Browse by track">
              {TRACKS.map(track => (
                <a key={track.key} href={`#track-${track.key}`}>{track.label}</a>
              ))}
            </div>

            {TRACKS.map(track => {
              const items = records.filter(r => r.category === track.key || (r.tags ?? []).some(t => t.toLowerCase().includes(track.key.split('_')[0])))
              if (!items.length) return null
              return <div key={track.key} id={`track-${track.key}`} className="vv-scheme-track" style={{ marginBottom: 56 }}>
                <div className="vv-section-heading">
                  <div>
                    <SectionEyebrow icon={ShieldCheck}>{track.blurb}</SectionEyebrow>
                    <h2>{track.label}</h2>
                  </div>
                  <span className="vv-track-count">{items.length} records</span>
                </div>
                <div className="vv-featured-grid">
                  {items.slice(0, 6).map(record => <SchemeCard key={record.id} record={record} />)}
                </div>
                {items.length > 6 && (
                  <p className="vv-track-more">
                    + {items.length - 6} more {track.label.toLowerCase()} records —{' '}
                    <Link className="vv-text-link" href="/resources">browse the full library</Link>
                  </p>
                )}
              </div>
            })}

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

function SchemeCard({ record }: { record: OpportunitySummary }) {
  const badge = statusBadge(record.status)
  return (
    <article className={`vv-resource-card vv-scheme-card vv-scheme-${badge.tone}`}>
      <div className="vv-resource-card-top">
        <span className="vv-card-type">{CATEGORY_LABELS[record.category] ?? record.category}</span>
        <span className={`vv-scheme-badge vv-scheme-badge-${badge.tone}`}>{badge.label}</span>
      </div>
      <Link href={`/schemes/${record.id}`} className="vv-card-title">{record.shortName ?? record.name}</Link>
      <p className="vv-card-summary">{record.benefitLabel || record.description}</p>
      <div className="vv-card-tags">
        <span>{BENEFIT_TYPE_LABELS[record.benefitType] ?? record.benefitType}</span>
        {record.deadline && record.status === 'active' && <span><Clock3 size={11} style={{ display: 'inline', marginRight: 4 }} />{record.deadline}</span>}
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
