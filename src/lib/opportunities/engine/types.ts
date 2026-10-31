import type { CanonicalFacts, DerivationContext, RuleFieldMapping } from '../fact-mapping'
import type { RecommendationWindow } from '../recommendation-ranking'

export type { CanonicalFacts }

// A: eligible now. B: blocked by a step the founder can take. C: window closed
// or status not confirmed. D: not for this founder (PRD §8.1).
export type Bucket = 'A' | 'B' | 'C' | 'D'
export type Freshness = 'fresh' | 'amber' | 'stale'
export type WindowState = 'open' | 'closed' | 'not_yet_open'
export type FounderStep = { kind: 'answer' | 'obtain'; factKey: string }
export type NonAnswer = 'dont_know' | 'declined'

export type FactDefinition = {
  key: string
  type: string
  fixable: boolean
  // Codes allowed for enum, multi_enum and band facts.
  values?: readonly string[]
}

export type BenefitRate = {
  priority: number
  appliesWhen: unknown
  area: 'rural' | 'urban' | 'any'
  projectTypes: readonly string[]
  ownPct: number
  subsidyPct: number
  subsidyCapInr: number | null
  subsidyFloorInr: number | null
  loanCapInr: number | null
  projectMinInr: number | null
  projectCapInr: number | null
  interestRatePct: number | null
  interestSubventionPct: number | null
  labelEn: string
  sourceUrl: string
}

export type EngineRecord = {
  id: string
  slug: string
  title: string
  type: string
  status: string
  versionId: string
  rules: unknown
  windows: RecommendationWindow[]
  lastCheckedAt: string | null
  packIds: string[]
  coverage: string
  locations: string[]
  rates: BenefitRate[]
  requiredCount: number
  stepCount: number
}

export type EngineContext = {
  mappings: RuleFieldMapping[]
  reviewerChecks: ReadonlyMap<string, string>
  factKeys: ReadonlySet<string>
  fixableKeys: ReadonlySet<string>
  derivation: DerivationContext
}

export type RecordVerdict = {
  bucket: Bucket
  windowState: WindowState
  freshness: Freshness
  steps: FounderStep[]
  bankChecks: string[]
  blockers: string[]
  // Founder facts this record's rules actually read to reach the result.
  decidedBy: string[]
}
