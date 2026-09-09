import Link from 'next/link'
import { ArrowUpRight, LibraryBig } from 'lucide-react'
import type { Resource } from '@/lib/marketing/resources'
import { ResourceCard } from './resource-card'
import { SectionEyebrow, SiteShell } from './site-shell'

export function CollectionPage({ eyebrow, title, description, resources, accent = 'vv-collection-orange', actionHref = '/resources', actionLabel = 'View all resources' }: { eyebrow: string; title: React.ReactNode; description: string; resources: Resource[]; accent?: string; actionHref?: string; actionLabel?: string }) {
  return <SiteShell><section className={`vv-page-hero ${accent}`}><div className="vv-container vv-collection-hero"><div><SectionEyebrow icon={LibraryBig}>{eyebrow}</SectionEyebrow><h1>{title}</h1><p>{description}</p></div><Link className="vv-button vv-button-dark" href={actionHref}>{actionLabel} <ArrowUpRight size={16} /></Link></div></section><section className="vv-section"><div className="vv-container"><div className="vv-section-heading"><div><SectionEyebrow>Curated for clarity</SectionEyebrow><h2>{resources.length.toString().padStart(2, '0')} resources in this collection.</h2></div><span className="vv-collection-note">Source and update information is visible on every card.</span></div><div className="vv-featured-grid">{resources.map(resource => <ResourceCard key={resource.slug} resource={resource} />)}</div></div></section></SiteShell>
}
