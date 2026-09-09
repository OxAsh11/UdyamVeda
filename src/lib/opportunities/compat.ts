import type { Scheme } from '@/lib/data/schemes'
import type { OpportunitySummary } from './types'

export type CatalogScheme = Scheme & {
  verificationStatus?: OpportunitySummary['verificationStatus']
  sourceLabel?: string
  completeness?: number
  lastVerifiedAt?: string
}

function categoryFor(opportunity: OpportunitySummary): Scheme['category'] {
  if (opportunity.coverage === 'state') return 'state'
  if (opportunity.type === 'loan' || opportunity.type === 'guarantee' || opportunity.benefitType === 'credit') return 'credit'
  if (opportunity.type === 'training' || opportunity.type === 'mentorship') return 'skill'
  if (opportunity.type === 'tax_benefit') return 'startup'
  if (opportunity.type === 'subsidy' || opportunity.type === 'registration' || opportunity.type === 'compliance') return 'msme'
  return 'startup'
}

function benefitTypeFor(opportunity: OpportunitySummary): Scheme['benefitType'] {
  if (opportunity.type === 'tax_benefit') return 'tax'
  if (opportunity.type === 'equity_investment' || opportunity.benefitType === 'equity_investment') return 'equity'
  if (opportunity.type === 'loan' || opportunity.type === 'guarantee' || opportunity.benefitType === 'credit') return 'credit'
  if (opportunity.type === 'training' || opportunity.type === 'mentorship') return 'training'
  if (opportunity.type === 'subsidy') return 'subsidy'
  if (opportunity.type === 'registration' || opportunity.type === 'policy') return 'recognition'
  return 'financial'
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
  }
}
