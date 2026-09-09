import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, ExternalLink, MapPin, ShieldCheck } from 'lucide-react'
import { notFound } from 'next/navigation'
import { SiteShell, SectionEyebrow } from '@/components/marketing/site-shell'
import { getResource, RESOURCES } from '@/lib/marketing/resources'

export function generateStaticParams() { return RESOURCES.map(resource => ({ slug: resource.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resource = getResource((await params).slug)
  return resource ? { title: resource.title, description: resource.summary } : { title: 'Resource not found' }
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const resource = getResource((await params).slug)
  if (!resource) notFound()
  const related = RESOURCES.filter(item => item.slug !== resource.slug && (item.category === resource.category || item.tags.some(tag => resource.tags.includes(tag)))).slice(0, 3)
  const isInternal = resource.sourceUrl.startsWith('/')
  return <SiteShell><article className="vv-detail-page"><div className="vv-container"><Link href="/resources" className="vv-back-link"><ArrowLeft size={15} /> Back to resources</Link><div className={`vv-detail-kicker vv-accent-${resource.accent}`}><span className="vv-detail-type">{resource.type}</span><span>{resource.updated}</span></div><div className="vv-detail-layout"><div className="vv-detail-main"><SectionEyebrow>{resource.audience}</SectionEyebrow><h1>{resource.title}</h1><p className="vv-detail-lede">{resource.detail}</p><div className="vv-detail-actions"><a className="vv-button vv-button-primary" href={resource.sourceUrl} target={isInternal ? undefined : '_blank'} rel={isInternal ? undefined : 'noreferrer'}>Open source <ExternalLink size={16} /></a><span className="vv-detail-source"><ShieldCheck size={16} /> Source-linked by Udyam Veda</span></div><div className="vv-detail-block"><h2>What to keep in mind</h2><div className="vv-detail-bullets">{resource.bullets.map(bullet => <div key={bullet}><CheckCircle2 size={17} /><p>{bullet}</p></div>)}</div></div></div><aside className="vv-detail-aside"><div className="vv-aside-card"><p className="vv-aside-label">At a glance</p><div><MapPin size={16} /><span><small>Coverage</small><strong>{resource.location}</strong></span></div><div><Clock3 size={16} /><span><small>Freshness</small><strong>{resource.updated}</strong></span></div><div><ShieldCheck size={16} /><span><small>Source</small><strong>{resource.source}</strong></span></div></div><div className="vv-aside-note"><p>Use this page to orient yourself, then confirm current rules and eligibility with the official source.</p><Link href="/methodology">See our source standards <ArrowUpRight size={15} /></Link></div></aside></div>{related.length > 0 && <div className="vv-related"><div className="vv-section-heading"><div><SectionEyebrow>Keep exploring</SectionEyebrow><h2>Related resources</h2></div><Link href="/resources" className="vv-text-link">View library <ArrowUpRight size={15} /></Link></div><div className="vv-related-grid">{related.map(item => <Link key={item.slug} href={`/resources/${item.slug}`}><span>{item.type}</span><strong>{item.title}</strong><ArrowUpRight size={16} /></Link>)}</div></div>}</div></article></SiteShell>
}
