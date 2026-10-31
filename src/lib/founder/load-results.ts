import type { SupabaseClient } from '@supabase/supabase-js'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { founderFactsFromRows } from '@/lib/businesses/founder-facts'
import type { EngineCatalog } from '@/lib/opportunities/engine/catalog'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { buildResults, type ResultsPayload } from '@/lib/opportunities/engine/results'
import type { CanonicalFacts, NonAnswer } from '@/lib/opportunities/engine/types'
import { loadStartBundle } from '@/lib/start/load-bundle'
import type { StartBundle } from '@/lib/start/types'
import { withNonAnswers } from './answers'

export type FounderResults =
  // Nothing to sort yet. The bundle is there so a page can still offer the questions.
  | { status: 'no_answers'; bundle: StartBundle | null }
  | { status: 'unavailable' }
  | {
    status: 'ready'
    facts: CanonicalFacts
    nonAnswers: Record<string, NonAnswer>
    // The facts plus "don't know" and "prefer not to say", as the answers API gives them.
    answers: Record<string, unknown>
    results: ResultsPayload
    bundle: StartBundle
    catalog: EngineCatalog
  }

/**
 * A signed-in founder's results, worked out once for every page that shows them.
 * Without a chosen activity there is nothing to sort, so that is "no answers",
 * not an outage; a failed read is never passed off as "no answers".
 */
export async function loadFounderResults(supabase: SupabaseClient, userId: string, now: Date = new Date()): Promise<FounderResults> {
  const { business, error } = await getBusinessForUser(supabase, userId)
  if (error) return { status: 'unavailable' }
  if (!business) return { status: 'no_answers', bundle: await loadStartBundle() }

  const { data, error: factsError } = await getBusinessFacts(supabase, business.id)
  if (factsError) return { status: 'unavailable' }

  const founderFacts = founderFactsFromRows(data ?? [])
  if (!Array.isArray(founderFacts.activity_codes)) return { status: 'no_answers', bundle: await loadStartBundle() }

  const [catalog, bundle] = await Promise.all([loadEngineCatalog(), loadStartBundle()])
  if (!catalog || !bundle) return { status: 'unavailable' }

  // Only answers the flow can use count, so free text from an older screen is not an activity.
  const { facts, nonAnswers } = cleanFacts(founderFacts, catalog.definitions, catalog.activityIds)
  if (!Array.isArray(facts.activity_codes) || !facts.activity_codes.length) return { status: 'no_answers', bundle }

  return {
    status: 'ready',
    facts,
    nonAnswers,
    answers: withNonAnswers(facts, nonAnswers),
    results: buildResults(facts, nonAnswers, catalog, now),
    bundle,
    catalog,
  }
}
