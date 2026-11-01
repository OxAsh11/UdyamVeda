import { describe, expect, it } from 'vitest'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { buildResults } from '@/lib/opportunities/engine/results'
import { factKeysForRuleField, ruleFactsFromCanonical } from '@/lib/opportunities/fact-mapping'
import { evaluateEligibilityRules } from '@/lib/opportunities/rules'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { answerWordsFor, checkedFacts, factLabelsOf, withNonAnswers } from '../answers'

const NOW = new Date('2026-11-01T06:00:00Z')
const catalog = snapshotCatalog()
const bundle = seedBundle()
const labels = factLabelsOf(bundle)
const records = new Map(catalog.records.map(record => [record.id, record]))

// A small deterministic generator, so a failure can be repeated.
let seed = 4242
const random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 2 ** 32
}
const pick = <T,>(options: T[]): T => options[Math.floor(random() * options.length)]

function founder(): Record<string, unknown> {
  const facts: Record<string, unknown> = { activity_codes: [pick(bundle.activities.map(activity => activity.id))] }
  const set = (key: string, options: unknown[]) => {
    const value = pick(options)
    if (value !== undefined) facts[key] = value
  }
  set('state', ['jharkhand', 'bihar', 'uttar_pradesh', 'maharashtra', 'dont_know', undefined])
  set('stage', ['idea', 'setting_up', 'running'])
  set('gender', ['woman', 'man', 'prefer_not', undefined])
  set('social_category', ['general', 'sc', 'st', 'obc', 'prefer_not', 'dont_know', undefined])
  set('project_cost_band', ['up_to_1l', '5l_10l', '25l_50l', 'dont_know', undefined])
  set('applicant_age_years', [19, 30, 48, 60, undefined])
  set('minority_community', ['yes', 'no', undefined])
  set('education_level', [...(catalog.definitions.find(definition => definition.key === 'education_level')?.values ?? []), undefined])
  for (const key of ['has_disability', 'udyam_registered', 'gst_registered', 'received_govt_subsidy_before']) set(key, [true, false, undefined])
  return facts
}

type Node = { any?: Node[]; all?: Node[]; field?: string; operator?: string; value?: unknown }

// The facts a rule failed on, one leaf at a time. Inside an "any", a branch another branch rescued is not
// why anything failed, and while the "any" is undecided a dead branch only counts for a fact that nothing
// still in play reads (a live branch, or a leaf outside any "any" that passed).
function failedKeysOf(root: Node | undefined, facts: Record<string, unknown>): Set<string> {
  const failed = new Set<string>()
  if (!root) return failed
  const evaluate = (rule: Node) => evaluateEligibilityRules(rule, facts, { reviewerChecks: catalog.context.reviewerChecks })
  const keysOf = (leaf: Node) => {
    const keys = factKeysForRuleField(leaf.field ?? '', catalog.context.mappings)
    return keys.length ? keys : [leaf.field ?? '']
  }
  const leavesOf = (rule: Node): Node[] => (rule.any ?? rule.all)?.flatMap(leavesOf) ?? (rule.field ? [rule] : [])
  const outsideAny = (rule: Node): Node[] => (rule.all ? rule.all.flatMap(outsideAny) : rule.any ? [] : rule.field ? [rule] : [])
  const standing = new Set(outsideAny(root).filter(leaf => evaluate(leaf).result === true).flatMap(keysOf))

  const visit = (node: Node) => {
    if (node.all) return node.all.forEach(visit)
    if (node.any) {
      const result = evaluate(node).result
      if (result === true) return
      const live = new Set(node.any.filter(branch => evaluate(branch).result !== false).flatMap(leavesOf).flatMap(keysOf))
      for (const leaf of leavesOf(node)) {
        if (evaluate(leaf).result !== false) continue
        for (const key of keysOf(leaf)) if (result === false || !(live.has(key) || standing.has(key))) failed.add(key)
      }
      return
    }
    if (node.field && evaluate(node).result === false) keysOf(node).forEach(key => failed.add(key))
  }
  visit(root)
  return failed
}

describe('a ticked answer', () => {
  it('never failed the rule on its own', () => {
    let ticks = 0
    for (let index = 0; index < 400; index++) {
      const { facts, nonAnswers } = cleanFacts(founder(), catalog.definitions, catalog.activityIds)
      if (!Array.isArray(facts.activity_codes) || !facts.activity_codes.length) continue
      const results = buildResults(facts, nonAnswers, catalog, NOW)
      const words = answerWordsFor(withNonAnswers(facts, nonAnswers), bundle)
      const ruleFacts = ruleFactsFromCanonical(facts, catalog.context.mappings, { ...catalog.context.derivation, now: NOW })
      for (const bucket of ['A', 'B', 'C', 'D'] as const) {
        for (const item of results.buckets[bucket]) {
          const failedKeys = failedKeysOf(records.get(item.id)?.rules as Node, ruleFacts)
          for (const fact of checkedFacts(item, words, labels, 'en')) {
            if (!fact.met) continue
            ticks++
            expect(failedKeys.has(fact.key), `${item.slug}: ${fact.label} ticked but failed`).toBe(false)
          }
        }
      }
    }
    expect(ticks).toBeGreaterThan(100)
  })
})
