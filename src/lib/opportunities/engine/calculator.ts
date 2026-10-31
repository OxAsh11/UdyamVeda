import { BAND_RANGES, DERIVATIONS, type DerivationContext } from '../fact-mapping'
import { evaluateEligibilityRules, isAnyOf, isNumberRange } from '../rules'
import type { BenefitRate, CanonicalFacts } from './types'

// max null means no upper limit, which also keeps Infinity out of JSON.
export type InrRange = { min: number; max: number | null }

// Each line stands alone: nothing here adds them into one "benefit" figure.
export type BenefitLines = {
  projectCost: InrRange
  own: InrRange
  subsidy: InrRange
  loan: InrRange
  // Project cost that own money, subsidy and the loan limit leave unfunded.
  uncovered: InrRange
  interestRatePct: number | null
  interestSubventionPct: number | null
  rateLabel: string
  sourceUrl: string
  // Answers that could move this founder to a better rate.
  betterIfAnswered: string[]
  ownShortfall: boolean
  aboveCeiling: boolean
  // Shown as "if the scheme is renewed on the same terms".
  ifRenewed: boolean
}

export type BenefitRateRow = {
  priority: number | string
  applies_when?: unknown
  area: string
  project_types: readonly string[]
  own_pct: number | string
  subsidy_pct: number | string
  subsidy_cap_inr?: number | string | null
  subsidy_floor_inr?: number | string | null
  loan_cap_inr?: number | string | null
  project_min_inr?: number | string | null
  project_cap_inr?: number | string | null
  interest_rate_pct?: number | string | null
  interest_subvention_pct?: number | string | null
  label_en: string
  source_url: string
}

const optional = (value: number | string | null | undefined) => (value === null || value === undefined ? null : Number(value))

export function benefitRateFromRow(row: BenefitRateRow): BenefitRate {
  return {
    priority: Number(row.priority),
    appliesWhen: row.applies_when ?? null,
    area: row.area as BenefitRate['area'],
    projectTypes: row.project_types,
    ownPct: Number(row.own_pct),
    subsidyPct: Number(row.subsidy_pct),
    subsidyCapInr: optional(row.subsidy_cap_inr),
    subsidyFloorInr: optional(row.subsidy_floor_inr),
    loanCapInr: optional(row.loan_cap_inr),
    projectMinInr: optional(row.project_min_inr),
    projectCapInr: optional(row.project_cap_inr),
    interestRatePct: optional(row.interest_rate_pct),
    interestSubventionPct: optional(row.interest_subvention_pct),
    labelEn: row.label_en,
    sourceUrl: row.source_url,
  }
}

type RowFit = { fit: 'yes' | 'no' } | { fit: 'unknown'; missing: string[] }

function fitOf(rate: BenefitRate, facts: CanonicalFacts, context: DerivationContext): RowFit {
  const missing: string[] = []

  if (rate.appliesWhen) {
    const evaluation = evaluateEligibilityRules(rate.appliesWhen, facts)
    if (evaluation.result === false) return { fit: 'no' }
    if (evaluation.result === null) missing.push(...evaluation.missingFacts)
  }

  if (rate.area !== 'any') {
    if (facts.area_type === undefined) missing.push('area_type')
    else if (facts.area_type !== rate.area) return { fit: 'no' }
  }

  if (!rate.projectTypes.includes('any')) {
    const nature = DERIVATIONS.activity_nature(facts, context)
    if (nature === undefined) missing.push('activity_codes')
    else if (!isAnyOf(nature) || !rate.projectTypes.some(type => nature.anyOf.includes(type))) return { fit: 'no' }
  }

  return missing.length ? { fit: 'unknown', missing } : { fit: 'yes' }
}

const covers = (rate: BenefitRate, cost: number) => cost >= (rate.projectMinInr ?? 0) && cost <= (rate.projectCapInr ?? Number.POSITIVE_INFINITY)
const byPriority = (rates: BenefitRate[]) => [...rates].sort((left, right) => left.priority - right.priority)

/**
 * The first row that certainly fits this founder and this project cost. A more
 * generous row that might fit, but depends on an unanswered fact, is reported
 * as "could be better if answered" and never assumed.
 */
export function pickRate(
  rates: BenefitRate[],
  facts: CanonicalFacts,
  cost: number,
  context: DerivationContext,
): { rate: BenefitRate; betterIfAnswered: string[] } | null {
  const betterIfAnswered = new Set<string>()
  for (const rate of byPriority(rates)) {
    if (!covers(rate, cost)) continue
    const fit = fitOf(rate, facts, context)
    if (fit.fit === 'yes') return { rate, betterIfAnswered: [...betterIfAnswered] }
    if (fit.fit === 'unknown') fit.missing.forEach(key => betterIfAnswered.add(key))
  }
  return null
}

const share = (pct: number, cost: number) => (pct === 0 ? 0 : (pct / 100) * cost)

function amountsAt(rate: BenefitRate, cost: number) {
  const own = share(rate.ownPct, cost)
  const floored = Math.max(share(rate.subsidyPct, cost), rate.subsidyFloorInr ?? 0)
  const subsidy = Math.min(floored, rate.subsidyCapInr ?? Number.POSITIVE_INFINITY)
  const loanCap = rate.loanCapInr ?? Number.POSITIVE_INFINITY
  if (!Number.isFinite(cost)) {
    return { own, subsidy, loan: loanCap, uncovered: Number.isFinite(loanCap) ? Number.POSITIVE_INFINITY : 0 }
  }
  const balance = Math.max(0, cost - own - subsidy)
  const loan = Math.min(balance, loanCap)
  return { own, subsidy, loan, uncovered: balance - loan }
}

function range(low: number, high: number): InrRange {
  return { min: Math.round(low), max: Number.isFinite(high) ? Math.round(high) : null }
}

/** Own, subsidy and loan lines for this founder's project; null when they cannot be worked out yet. */
export function computeBenefit(
  rates: BenefitRate[],
  facts: CanonicalFacts,
  status: string,
  context: DerivationContext,
): BenefitLines | null {
  const cost = DERIVATIONS.project_cost_inr(facts, context)
  if (!isNumberRange(cost) || !rates.length) return null

  const fitting = rates.filter(rate => fitOf(rate, facts, context).fit !== 'no')
  if (!fitting.length) return null
  const ceiling = Math.max(...fitting.map(rate => rate.projectCapInr ?? Number.POSITIVE_INFINITY))
  const ifRenewed = status !== 'active'
  const ownMoney = typeof facts.own_contribution_band === 'string' ? BAND_RANGES.own_contribution_band[facts.own_contribution_band] : undefined

  if (cost.min > ceiling) {
    const nothing = { min: 0, max: 0 }
    return {
      projectCost: range(cost.min, cost.max),
      own: nothing, subsidy: nothing, loan: nothing, uncovered: nothing,
      interestRatePct: null, interestSubventionPct: null,
      rateLabel: fitting[0].labelEn, sourceUrl: fitting[0].sourceUrl,
      betterIfAnswered: [], ownShortfall: false, aboveCeiling: true, ifRenewed,
    }
  }

  const lowCost = cost.min
  const highCost = Math.min(cost.max, ceiling)
  const lowPick = pickRate(rates, facts, lowCost, context)
  const highPick = pickRate(rates, facts, highCost, context)
  if (!lowPick || !highPick) return null

  const low = amountsAt(lowPick.rate, lowCost)
  const high = amountsAt(highPick.rate, highCost)

  return {
    projectCost: range(lowCost, highCost),
    own: range(low.own, high.own),
    subsidy: range(low.subsidy, high.subsidy),
    loan: range(low.loan, high.loan),
    uncovered: range(low.uncovered, high.uncovered),
    interestRatePct: highPick.rate.interestRatePct,
    interestSubventionPct: highPick.rate.interestSubventionPct,
    rateLabel: highPick.rate.labelEn,
    sourceUrl: highPick.rate.sourceUrl,
    betterIfAnswered: [...new Set([...lowPick.betterIfAnswered, ...highPick.betterIfAnswered])],
    ownShortfall: ownMoney !== undefined && low.own > ownMoney.max,
    aboveCeiling: false,
    ifRenewed,
  }
}
