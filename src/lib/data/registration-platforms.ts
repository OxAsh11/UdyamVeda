export interface Platform {
  id: string
  name: string
  logo: string              // emoji placeholder until real logos
  cost: number              // base cost in INR
  costDisplay: string
  rating: number
  reviewCount: string
  processingDays: string
  highlights: string[]
  url: string
  categories: ('most-used' | 'lowest-price' | 'top-rated')[]
}

export const PLATFORMS: Platform[] = [
  // ── MOST USED ──────────────────────────────────────────────────
  {
    id: 'vakilsearch',
    name: 'Vakilsearch',
    logo: '⚖️',
    cost: 2499,
    costDisplay: '₹2,499',
    rating: 4.5,
    reviewCount: '50K+',
    processingDays: '7–10 days',
    highlights: ['Largest legal services platform', 'Dedicated relationship manager', 'Free GST consultation'],
    url: 'https://vakilsearch.com',
    categories: ['most-used', 'top-rated'],
  },
  {
    id: 'indiafilings',
    name: 'IndiaFilings',
    logo: '🏢',
    cost: 2899,
    costDisplay: '₹2,899',
    rating: 4.3,
    reviewCount: '100K+',
    processingDays: '7–10 days',
    highlights: ['India\'s largest cloud compliance platform', 'Full compliance suite post-registration', 'GST & IT filing included'],
    url: 'https://www.indiafilings.com',
    categories: ['most-used'],
  },
  {
    id: 'razorpay-rize',
    name: 'Razorpay Rize',
    logo: '⚡',
    cost: 1499,
    costDisplay: '₹1,499',
    rating: 4.6,
    reviewCount: '20K+',
    processingDays: '7–10 days',
    highlights: ['Fintech-backed platform', 'Current account included', 'Startup community perks'],
    url: 'https://razorpay.com/rize',
    categories: ['most-used', 'top-rated', 'lowest-price'],
  },
  {
    id: 'cleartax',
    name: 'ClearTax',
    logo: '🧾',
    cost: 3499,
    costDisplay: '₹3,499',
    rating: 4.4,
    reviewCount: '80K+',
    processingDays: '10–15 days',
    highlights: ['Trusted tax filing platform', 'End-to-end compliance', 'CA-assisted process'],
    url: 'https://cleartax.in',
    categories: ['most-used'],
  },
  {
    id: 'legalwiz',
    name: 'LegalWiz',
    logo: '📋',
    cost: 1999,
    costDisplay: '₹1,999',
    rating: 4.2,
    reviewCount: '15K+',
    processingDays: '10–12 days',
    highlights: ['Transparent workflow tracking', 'IP protection services', 'Tech-enabled process'],
    url: 'https://www.legalwiz.in',
    categories: ['most-used'],
  },

  // ── LOWEST PRICE ──────────────────────────────────────────────
  {
    id: 'filingpoint',
    name: 'FilingPoint',
    logo: '📝',
    cost: 999,
    costDisplay: '₹999',
    rating: 3.9,
    reviewCount: '5K+',
    processingDays: '10–15 days',
    highlights: ['Lowest base price', 'Chennai-based experts', 'South India specialists'],
    url: 'https://www.filingpoint.com',
    categories: ['lowest-price'],
  },
  {
    id: 'startupwala',
    name: 'Startupwala',
    logo: '🚀',
    cost: 999,
    costDisplay: '₹999',
    rating: 4.1,
    reviewCount: '8K+',
    processingDays: '10–14 days',
    highlights: ['Flat pricing model', 'Quick response support', 'Accounting included'],
    url: 'https://www.startupwala.com',
    categories: ['lowest-price'],
  },
  {
    id: 'swarit-advisors',
    name: 'Swarit Advisors',
    logo: '💼',
    cost: 1299,
    costDisplay: '₹1,299',
    rating: 4.0,
    reviewCount: '6K+',
    processingDays: '8–12 days',
    highlights: ['Competitive pricing', 'License & compliance services', 'Pan-India coverage'],
    url: 'https://www.swaritadvisors.com',
    categories: ['lowest-price'],
  },
  {
    id: 'ebizfiling',
    name: 'eBizfiling',
    logo: '🏦',
    cost: 1499,
    costDisplay: '₹1,499',
    rating: 4.1,
    reviewCount: '12K+',
    processingDays: '8–10 days',
    highlights: ['Ahmedabad-based experts', 'FEMA & RBI compliance', 'International business support'],
    url: 'https://www.ebizfiling.com',
    categories: ['lowest-price'],
  },
  {
    id: 'registerkaro',
    name: 'RegisterKaro',
    logo: '✅',
    cost: 1499,
    costDisplay: '₹1,499',
    rating: 4.0,
    reviewCount: '7K+',
    processingDays: '10–14 days',
    highlights: ['Startup-focused platform', 'Free consultation call', 'Compliance calendar'],
    url: 'https://www.registerkaro.in',
    categories: ['lowest-price'],
  },
  {
    id: 'setindiabiz',
    name: 'SetIndiaBiz',
    logo: '🇮🇳',
    cost: 1999,
    costDisplay: '₹1,999',
    rating: 4.0,
    reviewCount: '5K+',
    processingDays: '10–12 days',
    highlights: ['Foreign national support', 'NRI-friendly process', 'Global compliance'],
    url: 'https://www.setindiabiz.com',
    categories: ['lowest-price'],
  },
  {
    id: 'companysuggestion',
    name: 'CompanySuggestion',
    logo: '💡',
    cost: 1799,
    costDisplay: '₹1,799',
    rating: 3.8,
    reviewCount: '3K+',
    processingDays: '10–15 days',
    highlights: ['Budget-friendly', 'Guidance on name approval', 'Post-registration support'],
    url: 'https://www.companysuggestion.com',
    categories: ['lowest-price'],
  },
  {
    id: 'biz-setup',
    name: 'BizSetup India',
    logo: '🔧',
    cost: 1299,
    costDisplay: '₹1,299',
    rating: 3.9,
    reviewCount: '4K+',
    processingDays: '12–15 days',
    highlights: ['Low cost guarantee', 'SME specialists', 'MSME registration included'],
    url: 'https://www.bizsetupindia.com',
    categories: ['lowest-price'],
  },
  {
    id: 'registrationwala',
    name: 'Registrationwala',
    logo: '📌',
    cost: 1999,
    costDisplay: '₹1,999',
    rating: 4.0,
    reviewCount: '9K+',
    processingDays: '10–12 days',
    highlights: ['End-to-end compliance', 'Trademark bundling available', 'Dedicated CA support'],
    url: 'https://www.registrationwala.com',
    categories: ['lowest-price'],
  },
  {
    id: 'taxmann',
    name: 'Taxmann',
    logo: '📊',
    cost: 2499,
    costDisplay: '₹2,499',
    rating: 4.2,
    reviewCount: '10K+',
    processingDays: '10–14 days',
    highlights: ['Tax publication heritage', 'Strong compliance depth', 'Advisory + registration'],
    url: 'https://www.taxmann.com',
    categories: ['lowest-price'],
  },

  // ── TOP RATED (not already in above) ──────────────────────────
  {
    id: 'indiamart-legal',
    name: 'LegalZoom India',
    logo: '🌟',
    cost: 3999,
    costDisplay: '₹3,999',
    rating: 4.5,
    reviewCount: '18K+',
    processingDays: '7–10 days',
    highlights: ['High satisfaction scores', 'Dedicated legal advisor', '30-day satisfaction guarantee'],
    url: 'https://www.legalzoom.in',
    categories: ['top-rated'],
  },
  {
    id: 'myonlineca',
    name: 'MyOnlineCA',
    logo: '🖥️',
    cost: 2999,
    costDisplay: '₹2,999',
    rating: 4.4,
    reviewCount: '14K+',
    processingDays: '8–12 days',
    highlights: ['Online-first experience', 'Chat support 7 days', 'Package deals available'],
    url: 'https://www.myonlineca.in',
    categories: ['top-rated'],
  },
  {
    id: 'caonweb',
    name: 'CAonWeb',
    logo: '👨‍💼',
    cost: 2499,
    costDisplay: '₹2,499',
    rating: 4.3,
    reviewCount: '11K+',
    processingDays: '8–10 days',
    highlights: ['CA-led process', 'Real-time status updates', 'GST compliance bundle'],
    url: 'https://www.caonweb.com',
    categories: ['top-rated'],
  },
]

// Segment platforms into the 3 buckets with overlap deduplication logic
export function getSegmentedPlatforms() {
  const mostUsed = PLATFORMS.filter(p => p.categories.includes('most-used')).slice(0, 5)
  const topRated = PLATFORMS.filter(p => p.categories.includes('top-rated')).slice(0, 5)

  // Lowest price: exclude those already in mostUsed or topRated, then fill
  const usedIds = new Set([...mostUsed, ...topRated].map(p => p.id))
  const lowestPrice = [
    ...PLATFORMS.filter(p => p.categories.includes('lowest-price') && !usedIds.has(p.id))
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 10),
  ]

  return { mostUsed, lowestPrice, topRated }
}
