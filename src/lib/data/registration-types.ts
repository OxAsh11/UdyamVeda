export type RegistrationType = 'pvt-ltd' | 'llp' | 'opc' | 'sole-proprietor' | 'partnership'

export interface RegType {
  id: RegistrationType
  name: string
  shortName: string
  tagline: string
  pros: string[]
  cons: string[]
  costRange: string
  govtFees: string
  timeline: string
  minFounders: number
  maxFounders: number | null
  documents: string[]
  taxHighlight: string
  bestFor: string[]
}

export const REGISTRATION_TYPES: RegType[] = [
  {
    id: 'pvt-ltd',
    name: 'Private Limited Company',
    shortName: 'Pvt Ltd',
    tagline: 'Most preferred for startups & funded businesses',
    pros: [
      'Limited liability — personal assets protected',
      'Easier to raise funding from investors',
      'Separate legal entity — can own property, sue/be sued',
      'ESOP friendly for hiring talent',
      'DPIIT/Startup India recognition eligible',
    ],
    cons: [
      'Higher compliance cost (annual filings, audit)',
      'Minimum 2 directors and 2 shareholders required',
      'More paperwork to set up',
    ],
    costRange: '₹6,000 – ₹15,000',
    govtFees: '₹1,000 – ₹7,000 (varies by capital)',
    timeline: '10–15 working days',
    minFounders: 2,
    maxFounders: 200,
    documents: ['PAN card', 'Aadhaar card', 'Passport-size photo', 'Address proof', 'Digital Signature Certificate (DSC)', 'Director Identification Number (DIN)'],
    taxHighlight: '22% flat corporate tax (after Startup India: 3 years tax-free)',
    bestFor: ['Startups seeking investment', 'Teams of 2+', 'Tech/SaaS/D2C', 'Businesses planning to scale'],
  },
  {
    id: 'llp',
    name: 'Limited Liability Partnership',
    shortName: 'LLP',
    tagline: 'Best for professional services with 2+ partners',
    pros: [
      'Limited liability for all partners',
      'Lower compliance than Pvt Ltd',
      'No minimum capital requirement',
      'Flexible profit sharing agreement',
      'No mandatory audit (below ₹40L turnover)',
    ],
    cons: [
      'Cannot raise equity funding from VCs',
      'Not eligible for Startup India recognition',
      'Less trusted by large enterprise clients',
    ],
    costRange: '₹3,000 – ₹8,000',
    govtFees: '₹500 – ₹5,600 (varies by capital)',
    timeline: '7–12 working days',
    minFounders: 2,
    maxFounders: null,
    documents: ['PAN card', 'Aadhaar card', 'Address proof', 'Digital Signature Certificate (DSC)', 'Proof of registered office'],
    taxHighlight: 'Partners taxed individually — no dividend distribution tax',
    bestFor: ['CA / legal / consulting firms', 'Service-based businesses', 'Partners who want lower compliance', 'Freelancer collectives'],
  },
  {
    id: 'opc',
    name: 'One Person Company',
    shortName: 'OPC',
    tagline: 'Limited liability for solo founders',
    pros: [
      'Single founder — full ownership & control',
      'Limited liability protection',
      'Separate legal entity',
      'Lower compliance than Pvt Ltd',
      'Nominee protection built-in',
    ],
    cons: [
      'Cannot raise VC funding (must convert to Pvt Ltd)',
      'Only Indian residents can be directors',
      'Mandatory conversion if turnover exceeds ₹2 crore',
    ],
    costRange: '₹4,000 – ₹10,000',
    govtFees: '₹500 – ₹2,000',
    timeline: '7–10 working days',
    minFounders: 1,
    maxFounders: 1,
    documents: ['PAN card', 'Aadhaar card', 'Address proof', 'Nominee details', 'Digital Signature Certificate (DSC)'],
    taxHighlight: 'Same as Pvt Ltd — 22% flat corporate tax',
    bestFor: ['Solo founders', 'Freelancers formalising', 'Consultants', 'Single-person service businesses'],
  },
  {
    id: 'sole-proprietor',
    name: 'Sole Proprietorship',
    shortName: 'Proprietorship',
    tagline: 'Simplest structure — zero registration cost',
    pros: [
      'Zero registration cost or formality',
      'Complete owner control',
      'Easiest and fastest to start',
      'Minimal compliance burden',
      'Direct tax — income taxed as personal income',
    ],
    cons: [
      'Unlimited personal liability',
      'Cannot raise funding',
      'No separate legal identity',
      'Ends with the owner — not transferable',
    ],
    costRange: '₹0 – ₹2,000 (just GST/Shop Act)',
    govtFees: '₹0 (optional registrations only)',
    timeline: '1–3 days',
    minFounders: 1,
    maxFounders: 1,
    documents: ['PAN card', 'Aadhaar card', 'Bank account in business name (optional)', 'GST registration (if turnover > ₹20L)'],
    taxHighlight: 'Business income taxed as personal income (0–30% slab)',
    bestFor: ['Micro businesses', 'Street vendors', 'Small shops', 'Testing an idea before formalising'],
  },
  {
    id: 'partnership',
    name: 'Partnership Firm',
    shortName: 'Partnership',
    tagline: 'Simple structure for 2–20 partners',
    pros: [
      'Simple to set up with a partnership deed',
      'No minimum capital requirement',
      'Flexible management structure',
      'Low compliance cost',
    ],
    cons: [
      'Unlimited personal liability for all partners',
      'Cannot raise VC/equity funding',
      'Partners personally liable for each other\'s actions',
    ],
    costRange: '₹1,000 – ₹3,000',
    govtFees: '₹0 – ₹5,000 (optional registration)',
    timeline: '3–7 days',
    minFounders: 2,
    maxFounders: 20,
    documents: ['PAN card', 'Aadhaar card', 'Partnership deed', 'Address proof of firm'],
    taxHighlight: 'Firm taxed at 30% + surcharge; partners taxed on profit share',
    bestFor: ['Family businesses', '2–3 partner businesses', 'Low-risk traditional businesses'],
  },
]

// Recommendation engine
export function recommendRegistrationType(
  stage: string,
  capital: string,
  founderType: string,
  sector: string,
  numFounders?: number
): { primary: RegistrationType; alternatives: RegistrationType[]; reasoning: string } {
  const isPreLaunch = stage === 'pre-launch' || stage === 'just-started'
  const isLowCapital = capital === 'Under ₹1 lakh' || capital === '₹1–5 lakh'
  const isSolo = numFounders === 1 || founderType === 'general'
  const isProfessional = ['Professional Services', 'Finance & FinTech', 'IT & Software'].includes(sector)
  const isMicro = isLowCapital && isPreLaunch

  if (isMicro && isSolo) {
    return {
      primary: 'sole-proprietor',
      alternatives: ['opc', 'llp'],
      reasoning: 'Given your early stage and low capital, a Sole Proprietorship lets you start immediately with zero cost. Upgrade to OPC or Pvt Ltd when you cross ₹20L turnover or want limited liability.',
    }
  }

  if (isSolo && !isLowCapital) {
    return {
      primary: 'opc',
      alternatives: ['pvt-ltd', 'sole-proprietor'],
      reasoning: 'As a solo founder with some capital, an OPC gives you limited liability and a proper legal identity without needing a co-founder. Convert to Pvt Ltd when you seek investment.',
    }
  }

  if (isProfessional && !isSolo) {
    return {
      primary: 'llp',
      alternatives: ['pvt-ltd', 'partnership'],
      reasoning: 'For a professional services business with partners, an LLP offers limited liability with lower compliance than Pvt Ltd — and better credibility than a simple partnership.',
    }
  }

  return {
    primary: 'pvt-ltd',
    alternatives: ['llp', 'opc'],
    reasoning: 'A Private Limited Company is the most versatile structure. It gives you limited liability, the ability to raise funding, and Startup India recognition — ideal for a growing business.',
  }
}
