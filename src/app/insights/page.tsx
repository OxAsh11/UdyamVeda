import type { Metadata } from 'next'
import { CollectionPage } from '@/components/marketing/collection-page'
import { INSIGHTS } from '@/lib/marketing/resources'

export const metadata: Metadata = { title: 'Insights & signals', description: 'Market and sector intelligence with source, freshness, and confidence in view.' }
export default function InsightsPage() { return <CollectionPage eyebrow="Insights & signals" title={<>See the pattern behind <span>the next move.</span></>} description="The intelligence layer connects market movement, advisories, and opportunity context without blurring official facts and external signals." resources={INSIGHTS} accent="vv-collection-teal" actionHref="/sectors/fisheries" actionLabel="View sector preview" /> }
