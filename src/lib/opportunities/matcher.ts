import type { BusinessProfileForMatching, Recommendation } from './types'

/**
 * Deprecated compatibility boundary.
 *
 * User-facing recommendations must use the async, approved-catalog matcher
 * in `published-recommendations.ts`. The former synchronous matcher consumed
 * the unverified static scheme list and is intentionally fail-closed.
 */
export function recommendOpportunities(profile: BusinessProfileForMatching): Recommendation[] {
  void profile
  return []
}
