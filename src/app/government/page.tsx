import type { Metadata } from 'next'
import { CollectionPage } from '@/components/marketing/collection-page'
import { GOVERNMENT_RESOURCES } from '@/lib/marketing/resources'

export const metadata: Metadata = { title: 'Government resources', description: 'Government portals and support pathways, organised around the action you need to take.' }
export default function GovernmentPage() { return <CollectionPage eyebrow="Government resources" title={<>Start from the <span>official doorway.</span></>} description="Find portals, schemes, and support pathways, then use the official source for current eligibility and application decisions." resources={GOVERNMENT_RESOURCES} accent="vv-collection-orange" actionHref="/methodology" actionLabel="Our source standards" /> }
