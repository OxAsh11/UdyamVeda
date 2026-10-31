import { factKeysForRuleField, ruleFactsFromCanonical } from '../fact-mapping'
import type { RecommendationWindow } from '../recommendation-ranking'
import { evaluateEligibilityRules } from '../rules'
import type { Bucket, CanonicalFacts, EngineContext, EngineRecord, FounderStep, Freshness, RecordVerdict, WindowState } from './types'

const DAY_MS = 86_400_000
const AMBER_AFTER_DAYS = 30
const STALE_AFTER_DAYS = 60
const CLOSED_WINDOW_TYPES = new Set(['closed', 'closed_or_claim_only'])

function timeOf(value: string | null): number | null {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export function freshnessOf(lastCheckedAt: string | null, now: Date): Freshness {
  const checkedAt = timeOf(lastCheckedAt)
  if (checkedAt === null) return 'stale'
  const ageDays = (now.getTime() - checkedAt) / DAY_MS
  if (ageDays <= AMBER_AFTER_DAYS) return 'fresh'
  return ageDays <= STALE_AFTER_DAYS ? 'amber' : 'stale'
}

function singleWindowState(window: RecommendationWindow, now: number): WindowState {
  if (window.windowType === 'rolling') return 'open'
  const closes = timeOf(window.closesAt)
  if (closes !== null && closes < now) return 'closed'
  const opens = timeOf(window.opensAt)
  if (opens !== null && opens > now) return 'not_yet_open'
  return 'open'
}

// An undated window or no window at all counts as open: the page sends the
// founder to the official portal for dates.
export function windowState(windows: RecommendationWindow[], status: string, now: Date): WindowState {
  if (status === 'closed') return 'closed'
  if (!windows.length) return status === 'upcoming' ? 'not_yet_open' : 'open'
  const live = windows.filter(window => !CLOSED_WINDOW_TYPES.has(window.windowType))
  if (!live.length) return 'closed'
  const states = live.map(window => singleWindowState(window, now.getTime()))
  if (states.includes('open')) return 'open'
  return states.includes('not_yet_open') ? 'not_yet_open' : 'closed'
}

function without(facts: CanonicalFacts, keys: readonly string[]): CanonicalFacts {
  const kept = { ...facts }
  for (const key of keys) delete kept[key]
  return kept
}

/**
 * Sorts one record into a bucket for this founder. A failed rule is hard unless
 * taking away the fixable answers (Udyam, training, premises…) rescues it.
 */
export function classifyRecord(record: EngineRecord, facts: CanonicalFacts, context: EngineContext, now: Date): RecordVerdict {
  const evaluate = (candidate: CanonicalFacts) => evaluateEligibilityRules(
    record.rules,
    ruleFactsFromCanonical(candidate, context.mappings, context.derivation),
    { reviewerChecks: context.reviewerChecks },
  )

  const evaluation = evaluate(facts)
  const window = windowState(record.windows, record.status, now)
  const freshness = freshnessOf(record.lastCheckedAt, now)
  const bankChecks = evaluation.bankChecks ?? []
  const verdict = (bucket: Bucket, steps: FounderStep[]): RecordVerdict => ({
    bucket, windowState: window, freshness, steps, bankChecks, blockers: evaluation.blockers,
  })

  const obtain: FounderStep[] = []
  if (evaluation.result === false) {
    const answeredFixable = Object.keys(facts).filter(key => context.fixableKeys.has(key)).sort()
    let trial = without(facts, answeredFixable)
    if (evaluate(trial).result === false) return verdict('D', [])

    // Put each fixable answer back; those that bring the failure back are the
    // ones the founder has to change.
    for (const key of answeredFixable) {
      const withKey = { ...trial, [key]: facts[key] }
      if (evaluate(withKey).result === false) obtain.push({ kind: 'obtain', factKey: key })
      else trial = withKey
    }
  }

  const unanswered = evaluation.missingFacts
    .flatMap(field => factKeysForRuleField(field, context.mappings))
    .filter(key => facts[key] === undefined)
  const answer: FounderStep[] = [...new Set(unanswered)].map(factKey => ({ kind: 'answer', factKey }))
  const steps = [...obtain, ...answer]

  if (record.status !== 'active' || window !== 'open' || freshness === 'stale') return verdict('C', steps)
  return verdict(evaluation.result === true ? 'A' : 'B', steps)
}
