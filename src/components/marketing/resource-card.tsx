import Link from 'next/link'
import { ArrowUpRight, Clock3, MapPin, Quote } from 'lucide-react'
import type { Resource } from '@/lib/marketing/resources'
import { ResourceTypeIcon } from './site-shell'

export function ResourceCard({ resource, compact = false }: { resource: Resource; compact?: boolean }) {
  return (
    <article className={`vv-resource-card vv-accent-${resource.accent} ${compact ? 'vv-resource-card-compact' : ''}`}>
      <div className="vv-resource-card-top">
        <ResourceTypeIcon />
        <span className="vv-card-type">{resource.type}</span>
        <span className="vv-card-arrow"><ArrowUpRight size={17} /></span>
      </div>
      <Link href={`/resources/${resource.slug}`} className="vv-card-title">{resource.title}</Link>
      <p className="vv-card-summary">{resource.summary}</p>
      <div className="vv-card-tags">{resource.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
      <div className="vv-card-meta"><span><MapPin size={13} /> {resource.location}</span><span><Clock3 size={13} /> {resource.updated}</span></div>
      {!compact && <div className="vv-card-source"><span className="vv-source-dot" /> {resource.source}</div>}
    </article>
  )
}

export function SignalCard({ resource }: { resource: Resource }) {
  return (
    <Link href={`/resources/${resource.slug}`} className="vv-signal-card">
      <div className="vv-signal-chart" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
      <div><p className="vv-card-type">{resource.type}</p><h3>{resource.title}</h3><p>{resource.summary}</p></div>
      <Quote size={22} className="vv-signal-quote" />
    </Link>
  )
}
