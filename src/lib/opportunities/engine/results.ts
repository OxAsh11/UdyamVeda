import { effortFor, type RecommendationWindow } from '../recommendation-ranking'
import { computeBenefit, type BenefitLines } from './calculator'
import { classifyRecord } from './classify'
import { chooseCombination, type Combination } from './combination'
import type { EngineCatalog } from './catalog'
import type { Bucket, CanonicalFacts, EngineRecord, Freshness, RecordVerdict } from './types'

export type RecordResult = RecordVerdict & {
  id: string
  slug: string
  title: string
  type: string
  status: string
  lastCheckedAt: string | null
  windows: RecommendationWindow[]
  // Set when the project is above this scheme's limit.
  aboveLimitInr: number | null
  lines: BenefitLines | null
}

export type ResultsPayload = {
  catalogVersion: string
  counts: Record<Bucket, number>
  buckets: Record<Bucket, RecordResult[]>
  // Registrations and licences are not schemes to qualify for: they feed the
  // ordered roadmap instead of the four buckets (PRD §1).
  registrations: RecordResult[]
  combination: Combination
  nonAnswers: Record<string, string>
}

const EFFORT_ORDER = { low: 0, medium: 1, high: 2 }
const FRESHNESS_ORDER: Record<Freshness, number> = { fresh: 0, amber: 1, stale: 2 }
const PROJECT_SIZE_FACTS = ['project_cost_band', 'project_cost_exact_inr']
const REGISTRATION_TYPES = new Set(['registration', 'licence'])

function founderPacks(facts: CanonicalFacts, activityPacks: Readonly<Record<string, readonly string[]>>) {
  const activities = facts.activity_codes
  if (!Array.isArray(activities) || !activities.length) return null
  return new Set(activities.flatMap(id => activityPacks[id as string] ?? []))
}

function outsideFounderState(record: EngineRecord, facts: CanonicalFacts) {
  return record.coverage === 'state' && typeof facts.state === 'string' && !record.locations.includes(facts.state)
}

// PLI, shipbuilding and other untagged records stay hidden unless the founder's
// entity type and project size were actually tested and passed (PRD §4); a rule
// made only of bank checks passes for everyone and proves nothing.
function untaggedQualifies(verdict: RecordVerdict) {
  return verdict.bucket === 'A'
    && verdict.decidedBy.includes('entity_type')
    && verdict.decidedBy.some(key => PROJECT_SIZE_FACTS.includes(key))
}

// Rules know the scheme, rates know its project limit, so the limit is settled
// here. Above it the scheme is not for this project; a band that crosses it can
// only be decided by the exact cost.
function settleProjectLimit(verdict: RecordVerdict, lines: BenefitLines | null) {
  if (lines?.aboveCeiling) {
    const limit = lines.ceilingInr === null ? '' : ` of ₹${lines.ceilingInr.toLocaleString('en-IN')}`
    return { ...verdict, bucket: 'D' as const, steps: [], blockers: [...verdict.blockers, `Project cost is above this scheme's limit${limit}`], aboveLimitInr: lines.ceilingInr, lines: null }
  }
  if (lines?.straddlesCeiling) {
    const steps = [...verdict.steps, { kind: 'answer' as const, factKey: 'project_cost_exact_inr' }]
    return verdict.bucket === 'A' ? { ...verdict, bucket: 'B' as const, steps, aboveLimitInr: null, lines: null } : { ...verdict, steps, aboveLimitInr: null, lines }
  }
  return { ...verdict, aboveLimitInr: null, lines }
}

const subsidyOf = (item: RecordResult) => item.lines?.subsidy.max ?? item.lines?.subsidy.min ?? -1

/** Sorts the published catalog into the four buckets for one founder. Same input, same output. */
export function buildResults(facts: CanonicalFacts, nonAnswers: Record<string, string>, catalog: EngineCatalog, now: Date): ResultsPayload {
  const context = { ...catalog.context, derivation: { ...catalog.context.derivation, now } }
  const packs = founderPacks(facts, context.derivation.activityPacks)
  const buckets: Record<Bucket, RecordResult[]> = { A: [], B: [], C: [], D: [] }
  const registrations: RecordResult[] = []
  const records = new Map(catalog.records.map(record => [record.id, record]))

  for (const record of catalog.records) {
    if (outsideFounderState(record, facts)) continue
    const tagged = record.packIds.length > 0
    if (tagged && packs && !record.packIds.some(pack => packs.has(pack))) continue

    const verdict = classifyRecord(record, facts, context, now)
    if (!tagged && !untaggedQualifies(verdict)) continue

    const isRegistration = REGISTRATION_TYPES.has(record.type)
    const showsAmount = !isRegistration && (verdict.bucket === 'A' || verdict.bucket === 'C')
    const settled = settleProjectLimit(verdict, showsAmount ? computeBenefit(record.rates, facts, record.status, context.derivation) : null)
    const list = isRegistration ? registrations : buckets[settled.bucket]
    list.push({
      ...settled,
      // Someone who chose "prefer not to say" is not asked again.
      steps: settled.steps.filter(step => !(step.kind === 'answer' && nonAnswers[step.factKey] === 'declined')),
      id: record.id,
      slug: record.slug,
      title: record.title,
      type: record.type,
      status: record.status,
      lastCheckedAt: record.lastCheckedAt,
      windows: record.windows,
      lines: settled.lines && {
        ...settled.lines,
        betterIfAnswered: settled.lines.betterIfAnswered.filter(key => nonAnswers[key] !== 'declined'),
        // Any figure in C is conditional, including on an active scheme whose date has passed.
        ifRenewed: settled.lines.ifRenewed || settled.bucket === 'C',
      },
    })
  }

  const effortOf = (item: RecordResult) => {
    const record = records.get(item.id)!
    return EFFORT_ORDER[effortFor(record.requiredCount, record.stepCount).level]
  }
  const byValue = (left: RecordResult, right: RecordResult) => subsidyOf(right) - subsidyOf(left)
    || effortOf(left) - effortOf(right)
    || FRESHNESS_ORDER[left.freshness] - FRESHNESS_ORDER[right.freshness]
    || left.slug.localeCompare(right.slug)

  buckets.A.sort(byValue)
  buckets.B.sort((left, right) => left.steps.length - right.steps.length || byValue(left, right))
  buckets.C.sort(byValue)
  buckets.D.sort((left, right) => left.slug.localeCompare(right.slug))

  const candidates = buckets.A.map(item => ({ id: item.id, lines: item.lines }))

  return {
    catalogVersion: catalog.version,
    counts: { A: buckets.A.length, B: buckets.B.length, C: buckets.C.length, D: buckets.D.length },
    buckets,
    registrations: registrations.sort((left, right) => left.slug.localeCompare(right.slug)),
    combination: chooseCombination(candidates, catalog.relationships),
    nonAnswers,
  }
}
