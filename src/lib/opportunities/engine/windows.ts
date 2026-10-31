// How one application window stands against the clock. Kept apart from classify.ts, which
// holds the rules, so a page that only words a result can read it without bringing the rules along.
import type { RecommendationWindow } from '../recommendation-ranking'
import type { WindowState } from './types'

export const CLOSED_WINDOW_TYPES = new Set(['closed', 'closed_or_claim_only'])

export function timeOf(value: string | null): number | null {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export function singleWindowState(window: RecommendationWindow, now: number): WindowState {
  if (window.windowType === 'rolling') return 'open'
  const closes = timeOf(window.closesAt)
  if (closes !== null && closes < now) return 'closed'
  const opens = timeOf(window.opensAt)
  if (opens !== null && opens > now) return 'not_yet_open'
  return 'open'
}
