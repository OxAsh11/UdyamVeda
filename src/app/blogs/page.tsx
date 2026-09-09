import type { Metadata } from 'next'
import { CollectionPage } from '@/components/marketing/collection-page'
import { BLOGS } from '@/lib/marketing/resources'

export const metadata: Metadata = { title: 'Blogs & guides', description: 'Plain-language business guides for founders and operators.' }
export default function BlogsPage() { return <CollectionPage eyebrow="Blogs & guides" title={<>The useful read for <span>the work in front of you.</span></>} description="Understand the decision behind the form, the authority behind the programme, and the practical next step." resources={BLOGS} accent="vv-collection-blue" /> }
