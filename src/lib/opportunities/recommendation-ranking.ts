import type {
  BusinessProfileForMatching,
  EffortEstimate,
  OpportunityType,
  RecommendationRankingSignals,
  RecommendationStatus,
  RecommendationUrgency,
} from './types'

export type RecommendationWindow = {
  windowType: string
  opensAt: string | null
  closesAt: string | null
}

const relevanceFields = ['sector', 'industry', 'state', 'founder', 'stage', 'lifecycle']

export function statusFor(
  result: boolean | null,
  missingFacts: string[],
  blockers: string[],
  hasReviewedRules: boolean,
): RecommendationStatus {
  if (result === true) return 'eligible'
  if (result === false && missingFacts.length === 0) return 'not_eligible'
  if (!hasReviewedRules) return 'needs_information'
  if (missingFacts.length <= 1 && blockers.length === 0) return 'likely'
  if (missingFacts.length > 0 || blockers.length > 0) return 'possible'
  return 'needs_information'
}

export function eligibilityConfidence(status: RecommendationStatus) {
  return {
    eligible: 1,
    likely: 0.82,
    possible: 0.62,
    needs_information: 0.4,
    not_eligible: 0.05,
  }[status]
}

export function urgencyFor(windows: RecommendationWindow[], now = new Date()): { urgency: RecommendationUrgency; score: number } {
  if (windows.some(window => window.windowType === 'rolling')) return { urgency: 'rolling', score: 0.45 }

  const closingDates = windows
    .map(window => window.closesAt ? new Date(window.closesAt) : null)
    .filter((date): date is Date => date !== null && !Number.isNaN(date.getTime()) && date.getTime() >= now.getTime())
    .sort((left, right) => left.getTime() - right.getTime())

  if (!closingDates.length) return { urgency: 'unknown', score: 0.25 }
  const daysRemaining = (closingDates[0].getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  if (daysRemaining <= 14) return { urgency: 'urgent', score: 1 }
  if (daysRemaining <= 45) return { urgency: 'soon', score: 0.8 }
  return { urgency: 'routine', score: 0.5 }
}

export function freshnessScore(lastVerifiedAt: string | null | undefined, now = new Date()) {
  if (!lastVerifiedAt) return 0.15
  const verifiedAt = new Date(lastVerifiedAt)
  if (Number.isNaN(verifiedAt.getTime())) return 0.15
  const ageDays = Math.max(0, (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60 * 24))
  if (ageDays <= 30) return 0.95
  if (ageDays <= 90) return 0.8
  return 0.25
}

export function relevanceScore(reasons: string[]) {
  const matches = reasons.filter(reason => relevanceFields.some(field => reason.toLowerCase().includes(field))).length
  return Math.min(1, 0.55 + matches * 0.15)
}

export function supportFitScore(type: OpportunityType, profile: BusinessProfileForMatching) {
  if (['loan', 'guarantee'].includes(type)) return profile.initial_capital ? 0.9 : 0.65
  if (['grant', 'subsidy', 'equity_investment'].includes(type)) return profile.stage || profile.sector ? 0.85 : 0.65
  if (['training', 'mentorship', 'accelerator', 'incubator'].includes(type)) return profile.stage || profile.founder_type ? 0.8 : 0.65
  if (['registration', 'licence', 'compliance'].includes(type)) return 0.75
  return 0.6
}

export function effortFor(requiredDocumentCount: number, stepCount: number): EffortEstimate {
  if (requiredDocumentCount >= 6 || stepCount >= 6) {
    return { level: 'high', rationale: 'The official workflow has many required documents or steps.' }
  }
  if (requiredDocumentCount <= 2 && stepCount <= 3) {
    return { level: 'low', rationale: 'The official workflow has a small document and step burden.' }
  }
  return { level: 'medium', rationale: 'The official workflow has a moderate document and step burden.' }
}

export function benefitToEffortScore(benefitCount: number, effort: EffortEstimate['level']) {
  if (benefitCount === 0) return 0.3
  if (effort === 'low') return 0.95
  if (effort === 'medium') return 0.8
  return 0.6
}

export function scoreRecommendation(signals: RecommendationRankingSignals) {
  const score = (
    signals.eligibilityConfidence * 0.45
    + signals.urgency * 0.1
    + signals.relevance * 0.15
    + signals.freshness * 0.15
    + signals.supportFit * 0.1
    + signals.benefitToEffort * 0.05
  ) * 100
  return Math.round(Math.max(0, Math.min(100, score)))
}
