import type { Draft } from './draft'
import type { ActivityItem } from './api'
import type { TextKey } from './i18n'
import type { ScreenQuestion } from './next-screen'

const isAnswered = (value: unknown) => value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)

/** Adds answers to the facts. A new cost band replaces any exact cost, which would otherwise override it. */
export function applyAnswers(facts: Record<string, unknown>, changes: Record<string, unknown>) {
  const next = { ...facts, ...changes }
  if ('project_cost_band' in changes) delete next.project_cost_exact_inr
  return next
}

const NUMBER_CHECKS: Record<string, { min: number; max?: number; message: TextKey }> = {
  applicant_age_years: { min: 14, max: 100, message: 'checkAge' },
  // "8" typed for ₹8 lakh would otherwise count as an ₹8 project.
  project_cost_exact_inr: { min: 1000, message: 'checkCost' },
}

/** A typed number that is probably a slip, with what to tell the founder. */
export function numberProblem(question: ScreenQuestion, facts: Record<string, unknown>): TextKey | null {
  for (const fact of question.facts) {
    const value = facts[fact.key]
    const check = NUMBER_CHECKS[fact.key]
    if (check && typeof value === 'number' && (value < check.min || (check.max !== undefined && value > check.max))) return check.message
  }
  return null
}

/** undefined: still searching. null: the search itself failed, which is not the same as finding nothing. */
export function pickerState(query: string, results: ActivityItem[] | null | undefined) {
  if (results === undefined) return 'loading'
  if (results === null) return 'failed'
  return query.trim() && !results.length ? 'none' : 'list'
}

/** True when a shown question has no answer yet. A checklist counts as answered: unticked means no. */
export function answersMissing(visible: ScreenQuestion[], facts: Record<string, unknown>) {
  return visible.some(question => question.kind !== 'multi' && question.facts.some(fact => !isAnswered(facts[fact.key])))
}

/**
 * Records one finished screen. Unticked checklist items become "no". A follow-up
 * that is no longer shown loses its old answer, so changing "running" to "idea"
 * does not leave a stale start date behind.
 */
export function withScreenAnswers(draft: Draft, questions: ScreenQuestion[], visible: ScreenQuestion[]): Draft {
  const facts = { ...draft.facts }
  const shown = new Set(visible.map(question => question.id))

  for (const question of questions) {
    if (!shown.has(question.id)) {
      for (const fact of question.facts) delete facts[fact.key]
    } else if (question.kind === 'multi') {
      for (const fact of question.facts) if (facts[fact.key] === undefined) facts[fact.key] = false
    }
  }

  const ids = visible.map(question => question.id)
  return {
    ...draft,
    facts,
    asked: [...draft.asked, ...ids.filter(id => !draft.asked.includes(id))],
    history: [...draft.history, ids],
  }
}
