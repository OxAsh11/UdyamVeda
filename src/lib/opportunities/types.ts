export const OPPORTUNITY_TYPES = [
  'scheme',
  'grant',
  'equity_investment',
  'loan',
  'guarantee',
  'subsidy',
  'tax_benefit',
  'policy',
  'accelerator',
  'incubator',
  'challenge',
  'procurement',
  'training',
  'mentorship',
  'event',
  'registration',
  'licence',
  'compliance',
] as const

export type OpportunityType = typeof OPPORTUNITY_TYPES[number]
export type RecommendationStatus = 'eligible' | 'likely' | 'possible' | 'needs_information' | 'not_eligible'
export type RecommendationUrgency = 'urgent' | 'soon' | 'routine' | 'rolling' | 'closed' | 'unknown'
export type VerificationStatus = 'legacy_draft' | 'in_review' | 'verified' | 'stale'

export type RecommendationFact = {
  key: string
  verified: boolean
}

export type BenefitEstimate = {
  type: string
  label: string
  amountMin: number | null
  amountMax: number | null
  percentage: number | null
}

export type EffortEstimate = {
  level: 'low' | 'medium' | 'high'
  rationale: string
}

export type RecommendationRankingSignals = {
  eligibilityConfidence: number
  urgency: number
  relevance: number
  freshness: number
  supportFit: number
  benefitToEffort: number
}

export interface OpportunitySummary {
  id: string
  name: string
  shortName?: string
  type: OpportunityType
  category: string
  authority: string
  benefitLabel: string
  benefitType: string
  description: string
  officialUrl: string
  deadline: string
  // Plain-language window detail written by an editor; never reviewer notes.
  windowNote?: string
  processingTime: string
  tags: string[]
  status: 'in_review' | 'active' | 'upcoming' | 'paused' | 'closed' | 'superseded' | 'archived'
  coverage: 'central' | 'state' | 'local'
  sourceLabel: string
  verificationStatus: VerificationStatus
  lastVerifiedAt?: string
  completeness: number
}

export interface OpportunityDetail extends OpportunitySummary {
  objective: string | null
  legalBasis: string | null
  eligibility: Record<string, unknown>
  application: Record<string, unknown>
  finePrint: Record<string, unknown>
  benefits: Array<{
    type: string
    label: string
    amountMin: number | null
    amountMax: number | null
    percentage: number | null
  }>
  requirements: Array<{
    type: string
    name: string
    description: string | null
    required: boolean
    acceptedFormats: string[]
    maxSizeMb: number | null
  }>
  steps: Array<{
    number: number
    title: string
    description: string | null
    officialUrl: string | null
    expectedDays: number | null
    dependsOn: number[]
  }>
  sources: Array<{
    url: string
    kind: string
    title: string | null
    anchor: string | null
    pageNumber: number | null
    section: string | null
    paragraph: string | null
    documentAnchor: string | null
    isPrimary: boolean
  }>
}

export interface BusinessProfileForMatching {
  stage?: string | null
  founder_type?: string | null
  sector?: string | null
  state?: string | null
  initial_capital?: string | null
  business_name?: string | null
  turnover?: number | null
  employees?: number | null
  has_udyam?: boolean | null
  has_dpiit?: boolean | null
  verified_fact_keys?: string[]
}

export interface Recommendation extends OpportunitySummary {
  recommendationStatus: RecommendationStatus
  matchScore: number
  reasons: string[]
  missingFacts: string[]
  blockers: string[]
  factsUsed: RecommendationFact[]
  benefitEstimates: BenefitEstimate[]
  urgency: RecommendationUrgency
  effort: 'low' | 'medium' | 'high'
  effortEstimate: EffortEstimate
  sourceRevision: string | null
  rankingSignals: RecommendationRankingSignals
}
