import { createClient } from '@/lib/supabase/server'
import { searchPublishedOpportunities } from './published'
import { evaluateEligibilityRules, type RuleFactMap } from './rules'
import {
  benefitToEffortScore,
  effortFor,
  eligibilityConfidence,
  freshnessScore,
  relevanceScore,
  scoreRecommendation,
  statusFor,
  supportFitScore,
  urgencyFor,
  type RecommendationWindow,
} from './recommendation-ranking'
import type { BusinessProfileForMatching, Recommendation } from './types'

type PublishedOpportunityRow = { id: string; slug: string; current_version_id: string | null }
type RuleSetRow = { opportunity_version_id: string; rules: unknown; reviewed: boolean }
type VersionMetaRow = { id: string; version_number: number; last_verified_at: string | null }
type BenefitRow = {
  opportunity_version_id: string
  benefit_type: string
  label: string
  amount_min: number | null
  amount_max: number | null
  percentage: number | null
}
type WindowRow = {
  opportunity_version_id: string
  window_type: string
  opens_at: string | null
  closes_at: string | null
}
type RequirementRow = { opportunity_version_id: string; required: boolean }
type StepRow = { opportunity_version_id: string }

// Rules compare codes such as `food_processing`; the current onboarding saves
// display labels such as "Agriculture & Food". Passing a label makes a
// matching founder fail the rule, so only code-shaped values are used and a
// label is treated as unknown until onboarding stores activity codes.
function sectorCode(value: string | null | undefined) {
  return value && /^[a-z][a-z0-9_]*$/.test(value) ? value : null
}

function factsFromProfile(profile: BusinessProfileForMatching): RuleFactMap {
  const sector = sectorCode(profile.sector)
  return {
    ...profile,
    sector,
    lifecycle_stage: profile.stage,
    enterprise_stage: profile.stage,
    founder_category: profile.founder_type,
    industry: sector,
    udyam_registered: profile.has_udyam,
    dpiit_recognized: profile.has_dpiit,
  }
}

function countByVersion<T extends { opportunity_version_id: string }>(rows: T[]) {
  const counts = new Map<string, number>()
  for (const row of rows) counts.set(row.opportunity_version_id, (counts.get(row.opportunity_version_id) ?? 0) + 1)
  return counts
}

export async function recommendPublishedOpportunities(profile: BusinessProfileForMatching) {
  const catalog = await searchPublishedOpportunities()
  if (catalog.source !== 'database' || catalog.items.length === 0) {
    return { items: [] as Recommendation[], source: catalog.source, availability: catalog.availability }
  }

  const supabase = await createClient()
  const { data: rows, error: rowsError } = await supabase
    .from('opportunities')
    .select('id, slug, current_version_id')
    .in('status', ['active', 'upcoming'])

  if (rowsError) return { items: [] as Recommendation[], source: 'database' as const, availability: 'unavailable' as const }
  if (!rows?.length) return { items: [] as Recommendation[], source: 'empty_unpublished' as const, availability: 'available' as const }

  const publishedRows = rows as PublishedOpportunityRow[]
  const versionIds = publishedRows.map(row => row.current_version_id).filter((id): id is string => Boolean(id))
  if (!versionIds.length) return { items: [] as Recommendation[], source: 'empty_unpublished' as const, availability: 'available' as const }

  const [rulesResult, versionsResult, benefitsResult, windowsResult, requirementsResult, stepsResult] = await Promise.all([
    supabase.from('eligibility_rule_sets').select('opportunity_version_id, rules, reviewed').in('opportunity_version_id', versionIds),
    supabase.from('opportunity_versions').select('id, version_number, last_verified_at').in('id', versionIds).eq('review_status', 'approved'),
    supabase.from('opportunity_benefits').select('opportunity_version_id, benefit_type, label, amount_min, amount_max, percentage').in('opportunity_version_id', versionIds),
    supabase.from('opportunity_windows').select('opportunity_version_id, window_type, opens_at, closes_at').in('opportunity_version_id', versionIds),
    supabase.from('opportunity_requirements').select('opportunity_version_id, required').in('opportunity_version_id', versionIds),
    supabase.from('opportunity_steps').select('opportunity_version_id').in('opportunity_version_id', versionIds),
  ])

  if (rulesResult.error || versionsResult.error || benefitsResult.error || windowsResult.error || requirementsResult.error || stepsResult.error) {
    return { items: [] as Recommendation[], source: 'database' as const, availability: 'unavailable' as const }
  }

  const summaries = new Map(catalog.items.map(item => [item.id, item]))
  const ruleByVersion = new Map(((rulesResult.data ?? []) as RuleSetRow[]).map(rule => [rule.opportunity_version_id, rule]))
  const versionById = new Map(((versionsResult.data ?? []) as VersionMetaRow[]).map(version => [version.id, version]))
  const benefitsByVersion = new Map<string, BenefitRow[]>()
  for (const benefit of (benefitsResult.data ?? []) as BenefitRow[]) {
    benefitsByVersion.set(benefit.opportunity_version_id, [...(benefitsByVersion.get(benefit.opportunity_version_id) ?? []), benefit])
  }
  const windowsByVersion = new Map<string, WindowRow[]>()
  for (const window of (windowsResult.data ?? []) as WindowRow[]) {
    windowsByVersion.set(window.opportunity_version_id, [...(windowsByVersion.get(window.opportunity_version_id) ?? []), window])
  }
  const requiredCounts = countByVersion((requirementsResult.data ?? []) as RequirementRow[])
  const stepCounts = countByVersion((stepsResult.data ?? []) as StepRow[])
  const facts = factsFromProfile(profile)
  const verifiedFactKeys = new Set(profile.verified_fact_keys ?? [])

  const items = publishedRows.flatMap(row => {
    const summary = summaries.get(row.slug)
    if (!summary || !row.current_version_id) return []

    const version = versionById.get(row.current_version_id)
    const ruleSet = ruleByVersion.get(row.current_version_id)
    const hasReviewedRules = Boolean(ruleSet?.reviewed)
    const evaluation = hasReviewedRules
      ? evaluateEligibilityRules(ruleSet!.rules, facts)
      : { result: null, reasons: [], missingFacts: ['reviewed eligibility rules'], blockers: [], usedFacts: [] }
    const status = statusFor(evaluation.result, evaluation.missingFacts, evaluation.blockers, hasReviewedRules)
    const windows = (windowsByVersion.get(row.current_version_id) ?? []).map(window => ({
      windowType: window.window_type,
      opensAt: window.opens_at,
      closesAt: window.closes_at,
    } satisfies RecommendationWindow))
    const urgency = urgencyFor(windows)
    const effortEstimate = effortFor(requiredCounts.get(row.current_version_id) ?? 0, stepCounts.get(row.current_version_id) ?? 0)
    const benefits = benefitsByVersion.get(row.current_version_id) ?? []
    const verifiedAt = version?.last_verified_at ?? summary.lastVerifiedAt ?? null
    const rankingSignals = {
      eligibilityConfidence: eligibilityConfidence(status),
      urgency: urgency.score,
      relevance: relevanceScore(evaluation.reasons),
      freshness: freshnessScore(verifiedAt),
      supportFit: supportFitScore(summary.type, profile),
      benefitToEffort: benefitToEffortScore(benefits.length, effortEstimate.level),
    }

    return [{
      ...summary,
      lastVerifiedAt: verifiedAt ?? undefined,
      recommendationStatus: status,
      matchScore: scoreRecommendation(rankingSignals),
      reasons: evaluation.reasons,
      missingFacts: evaluation.missingFacts,
      blockers: evaluation.blockers,
      factsUsed: evaluation.usedFacts.map(key => ({ key, verified: verifiedFactKeys.has(key) })),
      benefitEstimates: benefits.map(benefit => ({
        type: benefit.benefit_type,
        label: benefit.label,
        amountMin: benefit.amount_min,
        amountMax: benefit.amount_max,
        percentage: benefit.percentage,
      })),
      urgency: urgency.urgency,
      effort: effortEstimate.level,
      effortEstimate,
      sourceRevision: version ? `v${version.version_number}` : null,
      rankingSignals,
    }]
  })

  return { items: items.sort((left, right) => right.matchScore - left.matchScore), source: 'database' as const, availability: 'available' as const }
}
