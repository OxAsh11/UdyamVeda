export type ResourceType = 'Government portal' | 'Scheme & support' | 'Guide' | 'News & update' | 'Report & signal'

export type Resource = {
  slug: string
  title: string
  type: ResourceType
  category: 'government' | 'blogs' | 'news' | 'insights'
  summary: string
  audience: string
  location: string
  updated: string
  source: string
  sourceUrl: string
  accent: 'orange' | 'teal' | 'violet' | 'blue'
  tags: string[]
  detail: string
  bullets: string[]
}

export const RESOURCES: Resource[] = [
  {
    slug: 'udyam-registration-start-here',
    title: 'Udyam Registration: the first clean step for an MSME',
    type: 'Guide',
    category: 'blogs',
    summary: 'A plain-language walkthrough of what the registration is, what to keep ready, and where the official process begins.',
    audience: 'New and growing MSMEs',
    location: 'India',
    updated: 'Reviewed 09 Sep 2026',
    source: 'Ministry of MSME',
    sourceUrl: 'https://udyamregistration.gov.in',
    accent: 'orange',
    tags: ['Start here', 'MSME', 'Registration'],
    detail: 'Udyam Registration is the official entry point for businesses that want to be recognised as a micro, small, or medium enterprise. Udyam Veda helps you understand the process and then points you back to the official portal.',
    bullets: ['Keep the proprietor, partner, or authorised signatory details ready.', 'Use the official portal for the application and certificate.', 'Check the details carefully before submitting any declaration.'],
  },
  {
    slug: 'startup-india-recognition',
    title: 'Startup India: recognition and the support landscape',
    type: 'Government portal',
    category: 'government',
    summary: 'Find the official starting point for startup recognition, incubator pathways, and related support programmes.',
    audience: 'Innovation-led startups',
    location: 'India',
    updated: 'Source checked 09 Sep 2026',
    source: 'DPIIT · Startup India',
    sourceUrl: 'https://www.startupindia.gov.in',
    accent: 'violet',
    tags: ['Startup', 'Recognition', 'DPIIT'],
    detail: 'Startup India brings together recognition, learning, ecosystem, and funding pathways for eligible startups. The official portal remains the authority for current eligibility and application rules.',
    bullets: ['Review the current definition and eligibility before applying.', 'Keep incorporation and business-description documents accessible.', 'Use the portal to discover incubators and programme updates.'],
  },
  {
    slug: 'mudra-credit-pathways',
    title: 'Understanding the MUDRA credit pathways',
    type: 'Scheme & support',
    category: 'government',
    summary: 'A decision guide for early-stage founders comparing working-capital and small-business credit conversations.',
    audience: 'Micro businesses and first-time borrowers',
    location: 'India',
    updated: 'Source checked 08 Sep 2026',
    source: 'MUDRA',
    sourceUrl: 'https://www.mudra.org.in',
    accent: 'teal',
    tags: ['Credit', 'Micro business', 'Working capital'],
    detail: 'MUDRA supports micro-enterprise lending through participating financial institutions. The right conversation depends on the business stage, purpose of funds, repayment ability, and lender requirements.',
    bullets: ['Describe exactly what the funds will be used for.', 'Bring identity, business, and cash-flow information to the lender.', 'Confirm current terms directly with the participating institution.'],
  },
  {
    slug: 'women-entrepreneurship-platform',
    title: 'Women Entrepreneurship Platform: find the right doorway',
    type: 'Government portal',
    category: 'government',
    summary: 'A map of the support ecosystem for women founders, including learning, networks, mentors, and opportunities.',
    audience: 'Women entrepreneurs',
    location: 'India',
    updated: 'Source checked 08 Sep 2026',
    source: 'NITI Aayog · WEP',
    sourceUrl: 'https://www.wep.gov.in',
    accent: 'orange',
    tags: ['Women founders', 'Mentorship', 'Networks'],
    detail: 'The Women Entrepreneurship Platform connects women entrepreneurs with information, community, and support providers. Use it as an ecosystem map, then verify each opportunity with its implementing organisation.',
    bullets: ['Start with your current business stage and immediate need.', 'Compare support providers by fit, not only by headline benefit.', 'Save the source page for any opportunity you plan to pursue.'],
  },
  {
    slug: 'the-small-business-compliance-stack',
    title: 'The small-business compliance stack, explained',
    type: 'Guide',
    category: 'blogs',
    summary: 'A practical way to think about registrations, licences, filings, and renewals without losing the thread.',
    audience: 'Founders building their operating base',
    location: 'India',
    updated: 'Published 05 Sep 2026',
    source: 'Udyam Veda editorial',
    sourceUrl: '/methodology',
    accent: 'blue',
    tags: ['Compliance', 'Operations', 'Checklist'],
    detail: 'Compliance is easier to manage when it is treated as a sequence of decisions rather than a pile of forms. This guide introduces a simple operating rhythm for finding obligations, checking applicability, and recording evidence.',
    bullets: ['Separate universal registrations from sector-specific licences.', 'Record the issuing authority and renewal cadence for every obligation.', 'Re-check requirements when the business, location, or activity changes.'],
  },
  {
    slug: 'policy-watch-msme-digital-readiness',
    title: 'Policy watch: what digital readiness changes for MSMEs',
    type: 'News & update',
    category: 'news',
    summary: 'A concise briefing on the policy and market signals that can influence how small businesses adopt digital tools.',
    audience: 'MSMEs planning their next operating upgrade',
    location: 'India',
    updated: 'Briefed 06 Sep 2026',
    source: 'Udyam Veda signal desk',
    sourceUrl: '/methodology',
    accent: 'violet',
    tags: ['Policy', 'Digital', 'MSME'],
    detail: 'This preview briefing shows how Udyam Veda will connect news and policy movement to a business decision. External intelligence is kept separate from the official opportunity catalogue and carries its own freshness and confidence markers.',
    bullets: ['Read the original announcement before acting on a summary.', 'Check whether a signal is national, state-specific, or sector-specific.', 'Treat market commentary as context, not as an official eligibility statement.'],
  },
  {
    slug: 'fisheries-signal-board',
    title: 'Fisheries signal board: prices, advisories, and routes to support',
    type: 'Report & signal',
    category: 'insights',
    summary: 'A preview of the sector intelligence layer for fishing businesses, built around market movement and next actions.',
    audience: 'Fishing and seafood businesses',
    location: 'Tamil Nadu · India',
    updated: 'Preview model · 04 Sep 2026',
    source: 'Udyam Veda intelligence layer',
    sourceUrl: '/methodology',
    accent: 'teal',
    tags: ['Fisheries', 'Market prices', 'Advisories'],
    detail: 'The fisheries board is a product preview for a future personalised intelligence layer. It is designed to bring market, weather, notice, cold-chain, export, and scheme signals together while keeping each source and source date visible.',
    bullets: ['Compare price movement by species, market, date, and trading level.', 'Keep fisheries notices and weather advisories visibly separate from market data.', 'Connect relevant support programmes only after checking sector and location fit.'],
  },
  {
    slug: 'state-business-portals',
    title: 'State business portals: build a local starting map',
    type: 'Government portal',
    category: 'government',
    summary: 'Why location matters, and how to find the state and local authorities that sit behind a business process.',
    audience: 'Founders navigating state-level requirements',
    location: 'States & UTs',
    updated: 'Guide updated 03 Sep 2026',
    source: 'Udyam Veda editorial',
    sourceUrl: '/methodology',
    accent: 'blue',
    tags: ['State support', 'Local', 'Portals'],
    detail: 'A business journey often crosses central, state, and local authorities. This guide explains how Udyam Veda will help users identify the right layer before they spend time on a form or application.',
    bullets: ['Start with the business location and activity, not only the scheme name.', 'Identify the implementing authority for the action you need.', 'Look for local variations in documents, timelines, and application routes.'],
  },
]

export const BLOGS = RESOURCES.filter(resource => resource.category === 'blogs')
export const GOVERNMENT_RESOURCES = RESOURCES.filter(resource => resource.category === 'government')
export const NEWS = RESOURCES.filter(resource => resource.category === 'news')
export const INSIGHTS = RESOURCES.filter(resource => resource.category === 'insights')

export function getResource(slug: string) {
  return RESOURCES.find(resource => resource.slug === slug)
}

export const resourceTypes = ['All resources', 'Government portal', 'Scheme & support', 'Guide', 'News & update', 'Report & signal'] as const
export const resourceAudiences = ['All audiences', 'New founders', 'MSMEs', 'Women founders', 'Fishing & seafood'] as const
