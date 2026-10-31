import type { FounderState } from './api'
import { emptyDraft, type Draft } from './draft'
import type { Lang } from './types'

// What to do when a draft in this browser meets the account signed in on it.
// Saved answers are never replaced without the founder choosing that: a phone
// can be shared, and a draft can be half finished.
export type DraftDecision =
  | { kind: 'start' }
  | { kind: 'forget' }
  | { kind: 'use_draft'; save: boolean }
  | { kind: 'use_account' }
  | { kind: 'ask' }

export const hasAnswers = (draft: Draft) => Object.values(draft.facts).some(value => value !== undefined)

export function resolveDraft(draft: Draft, founder: FounderState): DraftDecision {
  if (founder.status === 'unknown') return hasAnswers(draft) ? { kind: 'use_draft', save: false } : { kind: 'start' }

  if (founder.status === 'anonymous') {
    // It belonged to an account whose session has ended: not for the next person.
    if (draft.ownerId) return { kind: 'forget' }
    return hasAnswers(draft) ? { kind: 'use_draft', save: false } : { kind: 'start' }
  }

  const accountHasAnswers = Object.keys(founder.facts).length > 0
  const someoneElses = Boolean(draft.ownerId) && draft.ownerId !== founder.userId
  if (someoneElses || !hasAnswers(draft)) return accountHasAnswers ? { kind: 'use_account' } : { kind: 'start' }
  if (draft.ownerId === founder.userId || !accountHasAnswers) return { kind: 'use_draft', save: true }
  return { kind: 'ask' }
}

/** A draft is saved only once the first-result screens are done, so a half-done one cannot replace saved answers. */
export function shouldSaveDraft(decision: DraftDecision, phase: string) {
  return decision.kind === 'use_draft' && decision.save && phase !== 'first'
}

export function draftFromAccount(founder: FounderState, lang: Lang): Draft {
  return { ...emptyDraft(), lang, facts: founder.facts, asked: founder.asked, activityItems: founder.activityItems, ownerId: founder.userId }
}
