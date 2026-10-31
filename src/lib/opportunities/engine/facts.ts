import { BAND_RANGES } from '../fact-mapping'
import type { CanonicalFacts, FactDefinition, NonAnswer } from './types'

const NON_ANSWERS: Readonly<Record<string, NonAnswer>> = { prefer_not: 'declined', dont_know: 'dont_know' }
const MAX_ACTIVITIES = 5
const MAX_TEXT_LENGTH = 100
const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

function cleanValue(value: unknown, definition: FactDefinition, activityIds: ReadonlySet<string>): unknown {
  switch (definition.type) {
    case 'boolean':
      return typeof value === 'boolean' ? value : undefined
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
    case 'enum':
    case 'band':
      return typeof value === 'string' && definition.values?.includes(value) ? value : undefined
    case 'multi_enum': {
      if (!Array.isArray(value)) return undefined
      const kept = [...new Set(value)].filter(item => typeof item === 'string' && definition.values?.includes(item))
      return kept.length ? kept : undefined
    }
    case 'activity_list': {
      if (!Array.isArray(value)) return undefined
      const kept = [...new Set(value)].filter(item => typeof item === 'string' && activityIds.has(item)).slice(0, MAX_ACTIVITIES)
      return kept.length ? kept : undefined
    }
    case 'date':
      return typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(new Date(value).getTime()) ? value : undefined
    case 'text': {
      if (typeof value !== 'string') return undefined
      return value.trim().slice(0, MAX_TEXT_LENGTH) || undefined
    }
    default:
      return undefined
  }
}

/**
 * Keeps only answers the fact dictionary recognises. "Prefer not to say" and
 * "don't know" are recorded separately and leave the fact unknown, because a
 * founder who declined has not said no.
 */
export function cleanFacts(
  raw: unknown,
  definitions: readonly FactDefinition[],
  activityIds: ReadonlySet<string>,
): { facts: CanonicalFacts; nonAnswers: Record<string, NonAnswer> } {
  const facts: CanonicalFacts = {}
  const nonAnswers: Record<string, NonAnswer> = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { facts, nonAnswers }

  const input = raw as Record<string, unknown>
  for (const definition of definitions) {
    const value = input[definition.key]
    if (typeof value === 'string' && value in NON_ANSWERS) {
      nonAnswers[definition.key] = NON_ANSWERS[value]
      continue
    }
    const cleaned = cleanValue(value, definition, activityIds)
    if (cleaned !== undefined) facts[definition.key] = cleaned
  }

  // Eligibility rules read the band, so an exact cost has to set it too.
  if (typeof facts.project_cost_exact_inr === 'number') {
    const cost = facts.project_cost_exact_inr
    const band = Object.entries(BAND_RANGES.project_cost_band).find(([, range]) => cost >= range.min && cost <= range.max)
    if (band) facts.project_cost_band = band[0]
  }
  return { facts, nonAnswers }
}
