'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search, SlidersHorizontal, X } from 'lucide-react'
import type { Resource } from '@/lib/marketing/resources'
import { ResourceCard } from './resource-card'

const audienceMatches: Record<string, string[]> = {
  'New founders': ['New and growing MSMEs', 'Innovation-led startups', 'Founders building their operating base'],
  MSMEs: ['New and growing MSMEs', 'Micro businesses and first-time borrowers', 'Founders building their operating base', 'Founders navigating state-level requirements'],
  'Women founders': ['Women entrepreneurs'],
  'Fishing & seafood': ['Fishing and seafood businesses'],
}

export function ResourceBrowser({ resources }: { resources: Resource[] }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All resources')
  const [audience, setAudience] = useState('All audiences')

  const filtered = useMemo(() => resources.filter(resource => {
    const haystack = `${resource.title} ${resource.summary} ${resource.tags.join(' ')} ${resource.source}`.toLowerCase()
    const matchesQuery = !query.trim() || haystack.includes(query.toLowerCase().trim())
    const matchesType = type === 'All resources' || resource.type === type
    const matchesAudience = audience === 'All audiences' || audienceMatches[audience]?.includes(resource.audience)
    return matchesQuery && matchesType && matchesAudience
  }), [audience, query, resources, type])

  const hasFilters = Boolean(query || type !== 'All resources' || audience !== 'All audiences')

  function clearFilters() {
    setQuery('')
    setType('All resources')
    setAudience('All audiences')
  }

  return (
    <section className="vv-browser" aria-label="Browse resources">
      <div className="vv-browser-tools">
        <label className="vv-search"><Search size={18} /><span className="sr-only">Search resources</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by topic, sector, or need" /></label>
        <div className="vv-filter-label"><SlidersHorizontal size={16} /> Filter by</div>
        <label className="sr-only" htmlFor="resource-type">Resource type</label>
        <select id="resource-type" value={type} onChange={event => setType(event.target.value)}>{['All resources', 'Government portal', 'Scheme & support', 'Guide', 'News & update', 'Report & signal'].map(value => <option key={value}>{value}</option>)}</select>
        <label className="sr-only" htmlFor="resource-audience">Audience</label>
        <select id="resource-audience" value={audience} onChange={event => setAudience(event.target.value)}>{['All audiences', 'New founders', 'MSMEs', 'Women founders', 'Fishing & seafood'].map(value => <option key={value}>{value}</option>)}</select>
        {hasFilters && <button className="vv-clear-filter" onClick={clearFilters}><X size={14} /> Clear</button>}
      </div>
      <div className="vv-browser-result"><p><strong>{filtered.length}</strong> resources to explore</p><Link href="/methodology">How we review sources <ArrowUpRight size={14} /></Link></div>
      {filtered.length ? <div className="vv-resource-grid">{filtered.map(resource => <ResourceCard key={resource.slug} resource={resource} />)}</div> : <div className="vv-empty"><h3>No close matches yet</h3><p>Try a broader phrase or clear the filters to see the full library.</p><button onClick={clearFilters}>Show all resources</button></div>}
    </section>
  )
}
