// A founder's saved answers, put into the words they used. Pages show these
// next to a verdict ("Because you said: State, Jharkhand"), so a fact key or an
// option code must never be shown: anything that cannot be named comes back null.
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { formatInr } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang, StartBundle, Text } from '@/lib/start/types'

const NON_ANSWER_VALUES: Record<string, string> = { declined: 'prefer_not', dont_know: 'dont_know' }

/** Cleaned facts, with "don't know" and "prefer not to say" put back as the answers the flow understands. */
export function withNonAnswers(facts: Record<string, unknown>, nonAnswers: Record<string, string>): Record<string, unknown> {
  const answers: Record<string, unknown> = { ...facts }
  for (const [key, state] of Object.entries(nonAnswers)) answers[key] = NON_ANSWER_VALUES[state]
  return answers
}

export function factLabelsOf(bundle: StartBundle): Record<string, Text> {
  return Object.fromEntries(Object.values(bundle.facts).map(fact => [fact.key, fact.label]))
}

/** The founder-facing name of a question; a question with no label is named by its key put into words. */
export function labelReader(labels: Record<string, Text>, lang: Lang): (factKey: string) => string {
  return factKey => (Object.hasOwn(labels, factKey) ? labels[factKey][lang] : factKey.replace(/_/g, ' '))
}

function namesOf(factKey: string, values: unknown[], bundle: StartBundle, lang: Lang) {
  const labels = new Map<string, string>(factKey === 'activity_codes'
    ? bundle.activities.map(activity => [activity.id, activity.label[lang]])
    : (bundle.facts[factKey]?.options ?? []).map(option => [option.value, option.label[lang]]))
  const names = values.map(value => (typeof value === 'string' ? labels.get(value) : undefined)).filter((name): name is string => !!name)
  return names.length ? names.join(', ') : null
}

/** One saved answer in words, in the chosen language, or null when there is nothing safe to show. */
export function answerText(factKey: string, value: unknown, bundle: StartBundle, lang: Lang): string | null {
  if (value === undefined || value === null || value === '') return null
  if (Array.isArray(value)) return value.length ? namesOf(factKey, value, bundle, lang) : null
  if (value === 'dont_know') return t(lang, 'dontKnow')
  if (value === 'prefer_not') return t(lang, 'preferNot')
  if (typeof value === 'boolean') return t(lang, value ? 'yes' : 'no')
  if (typeof value === 'number') return factKey === 'project_cost_exact_inr' ? formatInr(value) : String(value)
  if (typeof value !== 'string') return null

  const options = bundle.facts[factKey]?.options ?? []
  // A fact with options only ever holds one of them; a value with no label is a code, not words.
  if (!options.length) return value
  return options.find(option => option.value === value)?.label[lang] ?? null
}

/** Every answered key in all three languages, so a page can switch language without asking again. */
export function answerWordsFor(answers: Record<string, unknown>, bundle: StartBundle): Record<string, Text> {
  const words: Record<string, Text> = {}
  for (const [key, value] of Object.entries(answers)) {
    const en = answerText(key, value, bundle, 'en')
    const hi = answerText(key, value, bundle, 'hi')
    const mr = answerText(key, value, bundle, 'mr')
    if (en !== null && hi !== null && mr !== null) words[key] = { en, hi, mr }
  }
  return words
}

/** The answers behind one verdict: what the rule read and the founder gave, in the order the rule read it. */
export function checkedFacts(
  item: RecordResult,
  answerWords: Record<string, Text>,
  labels: Record<string, Text>,
  lang: Lang,
): { key: string; label: string; answer: string }[] {
  return item.decidedBy
    .filter(key => Object.hasOwn(answerWords, key) && Object.hasOwn(labels, key))
    .map(key => ({ key, label: labels[key][lang], answer: answerWords[key][lang] }))
}
