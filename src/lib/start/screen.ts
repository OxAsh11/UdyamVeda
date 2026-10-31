import type { Draft } from './draft'
import type { ScreenQuestion } from './next-screen'

const isAnswered = (value: unknown) => value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)

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
