import type { Metadata } from 'next'
import { CollectionPage } from '@/components/marketing/collection-page'
import { NEWS } from '@/lib/marketing/resources'

export const metadata: Metadata = { title: 'News & updates', description: 'Fresh policy and business updates with visible source context.' }
export default function NewsPage() { return <CollectionPage eyebrow="News & updates" title={<>Know what changed. <span>Know what it means.</span></>} description="A concise layer of policy, ecosystem, and business updates. Read the original source before making a consequential decision." resources={NEWS} accent="vv-collection-violet" /> }
