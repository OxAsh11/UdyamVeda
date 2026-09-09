import type { Metadata } from 'next'
import { ArrowUpRight, LibraryBig } from 'lucide-react'
import { ResourceBrowser } from '@/components/marketing/resource-browser'
import { SectionEyebrow, SiteShell } from '@/components/marketing/site-shell'
import { RESOURCES } from '@/lib/marketing/resources'

export const metadata: Metadata = { title: 'Resource library', description: 'Browse government portals, schemes, guides, news, and business intelligence.' }

export default function ResourcesPage() {
  return <SiteShell><section className="vv-page-hero"><div className="vv-container vv-page-hero-inner"><div><SectionEyebrow icon={LibraryBig}>The Vidyam Veda library</SectionEyebrow><h1>Useful information, <span>sorted for action.</span></h1><p>Browse government doorways, practical guides, and fresh context by the question you are trying to answer.</p></div><div className="vv-page-stat"><strong>{RESOURCES.length.toString().padStart(2, '0')}</strong><span>preview resources<br />across four tracks</span><ArrowUpRight size={18} /></div></div></section><section className="vv-section vv-resource-section"><div className="vv-container"><div className="vv-track-row"><a href="#all-resources">All resources</a><a href="#all-resources">Government</a><a href="#all-resources">Blogs & guides</a><a href="#all-resources">News & signals</a></div><div id="all-resources"><ResourceBrowser resources={RESOURCES} /></div></div></section></SiteShell>
}
