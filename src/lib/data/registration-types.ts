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
  officialSource: string
}

/**
 * Entity orientation only. These records intentionally avoid fixed fees,
 * tax rates, timelines, turnover cut-offs, or universal eligibility claims.
 * Current incorporation and tax rules belong in reviewed catalog versions.
 */
export const REGISTRATION_TYPES: RegType[] = [
  {
    id: 'pvt-ltd',
    name: 'Private Limited Company',
    shortName: 'Pvt Ltd',
    tagline: 'A separate company structure for teams and growth plans',
    pros: ['Separate legal identity', 'Limited liability framework', 'Designed for shareholding and formal governance'],
    cons: ['More governance and filing responsibilities', 'Requires current MCA forms and supporting evidence', 'Professional advice may be appropriate'],
    costRange: 'Confirm current MCA and professional fees',
    govtFees: 'Confirm current MCA fees for the selected capital and filings',
    timeline: 'Depends on the current MCA route and clarifications',
    minFounders: 2,
    maxFounders: 200,
    documents: ['Identity and address evidence', 'Registered-office evidence', 'Subscriber/director declarations', 'Digital-signature readiness'],
    taxHighlight: 'Tax treatment depends on the entity, elections, income, and current law',
    bestFor: ['Teams planning a company structure', 'Businesses considering formal shareholding', 'Founders evaluating future capital or governance needs'],
    officialSource: 'https://www.mca.gov.in/',
  },
  {
    id: 'llp',
    name: 'Limited Liability Partnership',
    shortName: 'LLP',
    tagline: 'A partner-led structure with a separate legal identity',
    pros: ['Limited liability framework for partners', 'Flexible partner arrangement', 'Separate legal identity'],
    cons: ['Requires an LLP agreement and ongoing filings', 'Funding and governance options differ from a company', 'Current MCA requirements must be confirmed'],
    costRange: 'Confirm current MCA and professional fees',
    govtFees: 'Confirm current MCA fees and contribution-related requirements',
    timeline: 'Depends on the current MCA route and clarifications',
    minFounders: 2,
    maxFounders: null,
    documents: ['Partner identity and address evidence', 'Registered-office evidence', 'LLP agreement information', 'Digital-signature readiness'],
    taxHighlight: 'Tax treatment depends on the entity and current law',
    bestFor: ['Professional or partner-led businesses', 'Teams comparing flexible governance with a company structure'],
    officialSource: 'https://www.mca.gov.in/',
  },
  {
    id: 'opc',
    name: 'One Person Company',
    shortName: 'OPC',
    tagline: 'A company structure for a single founder to evaluate',
    pros: ['Separate legal identity', 'Limited liability framework', 'Single-founder structure'],
    cons: ['Nominee and governance requirements apply', 'Conversion and eligibility rules must be checked', 'Current MCA forms and conditions are decisive'],
    costRange: 'Confirm current MCA and professional fees',
    govtFees: 'Confirm current MCA fees',
    timeline: 'Depends on the current MCA route and clarifications',
    minFounders: 1,
    maxFounders: 1,
    documents: ['Founder identity and address evidence', 'Registered-office evidence', 'Nominee information', 'Digital-signature readiness'],
    taxHighlight: 'Tax treatment depends on the entity and current law',
    bestFor: ['Solo founders evaluating a company structure', 'Founders comparing control and limited-liability options'],
    officialSource: 'https://www.mca.gov.in/',
  },
  {
    id: 'sole-proprietor',
    name: 'Sole Proprietorship',
    shortName: 'Proprietorship',
    tagline: 'An individual-led operating structure to compare with formal entities',
    pros: ['Simple operating model', 'Direct owner control', 'Can be suitable for some early operating contexts'],
    cons: ['No separate legal identity', 'Personal-liability and tax consequences require review', 'Local, sector, tax, and banking registrations may still apply'],
    costRange: 'Depends on the registrations and providers required',
    govtFees: 'Confirm current fees for each applicable registration',
    timeline: 'Depends on the applicable registration and business activity',
    minFounders: 1,
    maxFounders: 1,
    documents: ['Owner identity and address evidence', 'Business address evidence', 'Activity-specific documents'],
    taxHighlight: 'Tax treatment depends on the owner and current law',
    bestFor: ['Solo operators comparing structures', 'Founders assessing whether formal incorporation is needed'],
    officialSource: 'https://www.india.gov.in/',
  },
  {
    id: 'partnership',
    name: 'Partnership Firm',
    shortName: 'Partnership',
    tagline: 'A partner-led operating structure to compare with an LLP',
    pros: ['Partner agreement can define responsibilities', 'Flexible operating arrangement', 'May suit some closely held businesses'],
    cons: ['Liability and registration consequences require review', 'Partner rights and duties depend on the agreement and current law', 'State-specific requirements may apply'],
    costRange: 'Confirm current state and professional fees',
    govtFees: 'Confirm current state registration and filing fees',
    timeline: 'Depends on the state route and documents',
    minFounders: 2,
    maxFounders: null,
    documents: ['Partner identity and address evidence', 'Partnership-deed information', 'Business address evidence'],
    taxHighlight: 'Tax treatment depends on the firm and current law',
    bestFor: ['Partner-led businesses comparing structures', 'Founders evaluating LLP versus partnership trade-offs'],
    officialSource: 'https://www.india.gov.in/',
  },
]

export function recommendRegistrationType(
  stage: string,
  capital: string,
  founderType: string,
  sector: string,
  numFounders?: number,
): { primary: RegistrationType; alternatives: RegistrationType[]; reasoning: string } {
  const isPreLaunch = ['pre-launch', 'just-started', 'idea', 'setting_up'].includes(stage)
  const isLowCapital = capital === 'Under ₹1 lakh' || capital === '₹1–5 lakh'
  const isSolo = numFounders === 1 || founderType === 'general'
  const isProfessional = ['Professional Services', 'Finance & FinTech', 'IT & Software'].includes(sector)

  if (isPreLaunch && isLowCapital && isSolo) {
    return {
      primary: 'sole-proprietor',
      alternatives: ['opc', 'llp'],
      reasoning: 'Orientation only: compare a simple operating structure with limited-liability alternatives against current activity, tax, banking, and registration requirements.',
    }
  }

  if (isSolo && !isLowCapital) {
    return {
      primary: 'opc',
      alternatives: ['pvt-ltd', 'sole-proprietor'],
      reasoning: 'Orientation only: compare solo-founder company options, governance, liability, funding plans, and current eligibility before choosing a structure.',
    }
  }

  if (isProfessional && !isSolo) {
    return {
      primary: 'llp',
      alternatives: ['pvt-ltd', 'partnership'],
      reasoning: 'Orientation only: compare partner governance, liability, funding needs, professional registrations, and current MCA/state rules.',
    }
  }

  return {
    primary: 'pvt-ltd',
    alternatives: ['llp', 'opc'],
    reasoning: 'Orientation only: a company structure is one option to compare for a growing business; verify current MCA requirements and obtain professional advice where needed.',
  }
}
