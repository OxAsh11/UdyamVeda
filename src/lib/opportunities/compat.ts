import type { Scheme } from '@/lib/data/schemes'
import type { OpportunitySummary } from './types'

export type CatalogScheme = Scheme & {
  verificationStatus?: OpportunitySummary['verificationStatus']
  sourceLabel?: string
  completeness?: number
  lastVerifiedAt?: string
  // Raw catalog type (e.g. `concessional_loan`), kept for keyword filters.
  opportunityType?: string
}

// The live catalog uses many specific types (`innovation_grant`,
// `concessional_loan`, `credit_guarantee`…), so group them by keyword
// rather than by exact value.
const CREDIT = /loan|credit|guarantee|microfinance|finance/
const SKILL = /training|skill|mentor|apprentice/
const EQUITY = /equity|venture/
const RECOGNITION = /registration|licen[cs]e|certification|compliance|approval|policy/
const SUBSIDY = /subsid|reimburse|incentive/

function rawTypeOf(opportunity: OpportunitySummary) {
  return `${opportunity.category} ${opportunity.type}`.toLowerCase()
}

function categoryFor(opportunity: OpportunitySummary): Scheme['category'] {
  const raw = rawTypeOf(opportunity)
  if (opportunity.coverage === 'state') return 'state'
  if (CREDIT.test(raw) || opportunity.benefitType === 'credit') return 'credit'
  if (SKILL.test(raw)) return 'skill'
  if (RECOGNITION.test(raw)) return 'msme'
  if (/manufactur|production_linked|shipbuild|shipyard|cluster|sector|tribal|artisan|industry/.test(raw)) return 'sector'
  if (/subsid|infrastructure|productivity|enterprise|business|market_access|procurement/.test(raw)) return 'msme'
  return 'startup'
}

function benefitTypeFor(opportunity: OpportunitySummary): Scheme['benefitType'] {
  const raw = rawTypeOf(opportunity)
  if (raw.includes('tax')) return 'tax'
  if (EQUITY.test(raw) || opportunity.benefitType === 'equity_investment') return 'equity'
  if (CREDIT.test(raw) || opportunity.benefitType === 'credit') return 'credit'
  if (SKILL.test(raw)) return 'training'
  if (SUBSIDY.test(raw)) return 'subsidy'
  if (RECOGNITION.test(raw)) return 'recognition'
  return 'financial'
}

// Keyword groups behind the dashboard's `?type=` shortcuts.
export const TYPE_FILTERS: Record<string, { label: string; pattern: RegExp }> = {
  grant: { label: 'Grants', pattern: /grant|award|challenge|innovation/ },
  loan: { label: 'Loans & subsidies', pattern: /loan|credit|guarantee|microfinance|finance|subsid|reimburse/ },
  accelerator: { label: 'Accelerators & incubators', pattern: /accelerat|incubat|mentor|startup_support/ },
}

export function opportunityToScheme(opportunity: OpportunitySummary): CatalogScheme {
  return {
    id: opportunity.id,
    name: opportunity.name,
    shortName: opportunity.shortName ?? opportunity.name,
    ministry: opportunity.authority,
    category: categoryFor(opportunity),
    benefitType: benefitTypeFor(opportunity),
    benefitHeadline: opportunity.benefitLabel,
    benefitEstimate: opportunity.benefitLabel,
    benefitValue: 0,
    description: opportunity.description,
    eligibility: {},
    applicationSteps: ['Review the official eligibility and requirements', 'Open the official application portal', 'Submit the application through the official process'],
    officialUrl: opportunity.officialUrl,
    deadline: opportunity.deadline,
    processingTime: opportunity.processingTime,
    tags: opportunity.tags,
    verificationStatus: opportunity.verificationStatus,
    sourceLabel: opportunity.sourceLabel,
    completeness: opportunity.completeness,
    lastVerifiedAt: opportunity.lastVerifiedAt,
    opportunityType: opportunity.category,
  }
}
