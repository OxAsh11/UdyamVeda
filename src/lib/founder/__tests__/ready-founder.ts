// Test-only: a founder whose results are ready, built from the real catalog snapshot and the seed question list.
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { buildResults } from '@/lib/opportunities/engine/results'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { withNonAnswers } from '../answers'
import type { FounderResults } from '../load-results'

export const NOW = new Date('2026-10-31T00:00:00Z')

export type ReadyFounder = Extract<FounderResults, { status: 'ready' }>

export function readyFounder(raw: Record<string, unknown>): ReadyFounder {
  const catalog = snapshotCatalog()
  const { facts, nonAnswers } = cleanFacts(raw, catalog.definitions, catalog.activityIds)
  return { status: 'ready', facts, nonAnswers, answers: withNonAnswers(facts, nonAnswers), results: buildResults(facts, nonAnswers, catalog, NOW), bundle: seedBundle(), catalog }
}

// A fish farmer in Jharkhand, with a project of 5 to 10 lakh: 3 can apply, 1 is a step away, 3 wait, 2 are not for them.
export const fisher = (): ReadyFounder => readyFounder({
  activity_codes: ['pond_fish'],
  state: 'jharkhand',
  district: 'Ranchi',
  area_type: 'rural',
  stage: 'setting_up',
  project_cost_band: '5l_10l',
})
