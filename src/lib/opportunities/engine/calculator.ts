import { BAND_RANGES, DERIVATIONS, type DerivationContext } from '../fact-mapping'
import { evaluateEligibilityRules, isAnyOf, isNumberRange } from '../rules'
import type { BenefitRate, CanonicalFacts } from './types'

// max null means no upper limit, which also keeps Infinity out of JSON.
export type InrRange = { min: number; max: number | null }

// Each line stands alone: nothing here adds them into one "benefit" figure.
export type BenefitLines = {
  projectCost: InrRange
  // null: the source does not state an own share, so none is shown.
  own: InrRange | null
  subsidy: InrRange
  // null: the source gives no loan to show; the balance is in `uncovered`.
  loan: InrRange | null
  // Still to arrange after the lines above.
  uncovered: InrRange
  interestRatePct: number | null
  interestSubventionPct: number | null
  rateLabel: string
  sourceUrl: string
  // Answers that could move this founder to a better rate.
  betterIfAnswered: string[]
  ownShortfall: boolean
  ceilingInr: number | null
  aboveCeiling: boolean
  // The founder's cost band crosses the ceiling; only the exact cost can decide.
  straddlesCeiling: boolean
  // Shown as "if the scheme is renewed on the same terms".
  ifRenewed: boolean
}

export type BenefitRateRow = {
  priority: number | string
  applies_when?: unknown
  area: string
  project_types: readonly string[]
  own_pct?: number | string | null
  includes_loan?: boolean
  provisional?: boolean
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
    ownPct: optional(row.own_pct),
    includesLoan: row.includes_loan ?? true,
    provisional: row.provisional ?? false,
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
 * as "could be better if answered" and never assumed. A provisional row only
 * stands in while such an answer is outstanding: once the facts are known and
 * no real row fits, there is no amount to show.
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
    if (fit.fit === 'unknown') fit.missing.forEach(key => betterIfAnswered.add(key))
    if (fit.fit !== 'yes' || (rate.provisional && !betterIfAnswered.size)) continue
    return { rate, betterIfAnswered: [...betterIfAnswered] }
  }
  return null
}

const share = (pct: number, cost: number) => (pct === 0 ? 0 : (pct / 100) * cost)

function amountsAt(rate: BenefitRate, cost: number) {
  const own = rate.ownPct === null ? null : share(rate.ownPct, cost)
  const floored = Math.max(share(rate.subsidyPct, cost), rate.subsidyFloorInr ?? 0)
  const subsidy = Math.min(floored, rate.subsidyCapInr ?? Number.POSITIVE_INFINITY)

  // Without a stated own share or loan limit, a loan figure would be a guess
  // at how the founder splits the balance, so it all stays "to arrange".
  const hasLoanLine = rate.includesLoan && (rate.ownPct !== null || rate.loanCapInr !== null)
  const loanCap = rate.loanCapInr ?? Number.POSITIVE_INFINITY

  if (!Number.isFinite(cost)) {
    const loan = hasLoanLine ? loanCap : null
    return { own, subsidy, loan, uncovered: loan === Number.POSITIVE_INFINITY ? 0 : Number.POSITIVE_INFINITY }
  }
  const balance = Math.max(0, cost - (own ?? 0) - subsidy)
  const loan = hasLoanLine ? Math.min(balance, loanCap) : null
  return { own, subsidy, loan, uncovered: balance - (loan ?? 0) }
}

function range(low: number, high: number): InrRange {
  return { min: Math.round(low), max: Number.isFinite(high) ? Math.round(high) : null }
}

const optionalRange = (low: number | null, high: number | null) => (low === null || high === null ? null : range(low, high))

/** Own, subsidy and loan lines for this founder's project; null when they cannot be worked out yet. */
export function computeBenefit(
  rates: BenefitRate[],
  facts: CanonicalFacts,
  status: string,
  context: DerivationContext,
): BenefitLines | null {
  const cost = DERIVATIONS.project_cost_inr(facts, context)
  if (!isNumberRange(cost)) return null

  const fitting = rates.filter(rate => fitOf(rate, facts, context).fit !== 'no')
  if (!fitting.some(rate => !rate.provisional)) return null

  const ceiling = Math.max(...fitting.map(rate => rate.projectCapInr ?? Number.POSITIVE_INFINITY))
  const ceilingInr = Number.isFinite(ceiling) ? ceiling : null
  const ifRenewed = status !== 'active'
  const ownMoney = typeof facts.own_contribution_band === 'string' ? BAND_RANGES.own_contribution_band[facts.own_contribution_band] : undefined

  if (cost.min > ceiling) {
    const nothing = { min: 0, max: 0 }
    return {
      projectCost: range(cost.min, cost.max),
      own: nothing, subsidy: nothing, loan: nothing, uncovered: nothing,
      interestRatePct: null, interestSubventionPct: null,
      rateLabel: fitting[0].labelEn, sourceUrl: fitting[0].sourceUrl,
      betterIfAnswered: [], ownShortfall: false, ceilingInr, aboveCeiling: true, straddlesCeiling: false, ifRenewed,
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
    own: optionalRange(low.own, high.own),
    subsidy: range(low.subsidy, high.subsidy),
    loan: optionalRange(low.loan, high.loan),
    uncovered: range(low.uncovered, high.uncovered),
    interestRatePct: highPick.rate.interestRatePct,
    interestSubventionPct: highPick.rate.interestSubventionPct,
    rateLabel: highPick.rate.labelEn,
    sourceUrl: highPick.rate.sourceUrl,
    betterIfAnswered: [...new Set([...lowPick.betterIfAnswered, ...highPick.betterIfAnswered])],
    ownShortfall: ownMoney !== undefined && low.own !== null && low.own > ownMoney.max,
    ceilingInr,
    aboveCeiling: false,
    straddlesCeiling: cost.max > ceiling,
    ifRenewed,
  }
}
