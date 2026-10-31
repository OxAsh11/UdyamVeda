import type { Tone } from '@/lib/design/tones'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import type { CanonicalFacts, EngineRecord } from '@/lib/opportunities/engine/types'
import { formatDate, formatInr } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'

export type Verdict = { tone: Tone; text: string; detail: string | null }

const REGISTRATION_TYPES = new Set(['registration', 'licence'])

const plain = (tone: Tone, text: string): Verdict => ({ tone, text, detail: null })

function openingText(item: RecordResult, lang: Lang) {
  const date = item.windows.map(window => formatDate(window.opensAt, lang)).find(Boolean)
  return date ? t(lang, 'verdictOpens', { date }) : t(lang, 'verdictNotOpen')
}

function waitingText(item: RecordResult, lang: Lang) {
  if (item.status === 'pending_renewal') return t(lang, 'statusRenewal')
  if (item.status === 'paused') return t(lang, 'statusPaused')
  if (item.windowState === 'not_yet_open') return openingText(item, lang)
  if (item.status === 'active' && item.freshness === 'stale') return t(lang, 'statusUnconfirmed')
  return t(lang, 'statusClosed')
}

function notForYouDetail(item: RecordResult, lang: Lang, labelOf: (factKey: string) => string) {
  if (item.aboveLimitInr !== null) return t(lang, 'aboveLimit', { limit: formatInr(item.aboveLimitInr) })
  if (item.failedFacts.length) return t(lang, 'whyFacts', { labels: item.failedFacts.map(labelOf).join(', ') })
  return null
}

/**
 * Turns one engine result into the words and colour a founder sees. Every page
 * uses this, so the same scheme never says two different things. It words the
 * engine's decision; it never makes one.
 */
export function verdictFor(
  item: RecordResult,
  combination: Combination,
  lang: Lang,
  labelOf: (factKey: string) => string,
): Verdict {
  switch (item.bucket) {
    case 'A':
      // A bank check means part of the rule is not ours to test, so never a plain "Apply now".
      if (item.bankChecks.length) return plain('go', t(lang, 'verdictChecked'))
      return plain('go', t(lang, combination.recommended.includes(item.id) ? 'verdictApplyFirst' : 'verdictApply'))

    case 'B': {
      const questions = new Set(item.steps.filter(step => step.kind === 'answer').map(step => step.factKey)).size
      if (questions === 1) return plain('step', t(lang, 'verdictAnswerOne'))
      if (questions > 1) return plain('step', t(lang, 'verdictAnswerMany', { count: questions }))
      const first = item.steps.find(step => step.kind === 'obtain')
      if (first) return plain('step', t(lang, 'stepObtain', { label: labelOf(first.factKey) }))
      return plain('step', t(lang, 'verdictCannotCheck'))
    }

    case 'C':
      return plain('wait', waitingText(item, lang))

    case 'D':
      return { tone: 'wait', text: t(lang, 'verdictNotForYou'), detail: notForYouDetail(item, lang, labelOf) }
  }
}

// Mirrors the engine's own test for leaving out a scheme from another state.
const outsideFounderState = (record: EngineRecord, facts: CanonicalFacts) =>
  record.coverage === 'state'
  && record.locations.length > 0
  && typeof facts.state === 'string'
  && !record.locations.includes(facts.state)

/**
 * Words for a scheme the engine left out of this founder's results, for a page
 * that was opened on it anyway. It is never "go": the engine did not qualify them.
 */
export function outsideVerdict(
  record: EngineRecord | undefined,
  facts: CanonicalFacts,
  lang: Lang,
  stateName: (code: string) => string,
): Verdict {
  if (!record) return plain('wait', t(lang, 'verdictCannotCheck'))
  if (REGISTRATION_TYPES.has(record.type)) return plain('wait', t(lang, 'verdictOnPath'))
  if (outsideFounderState(record, facts)) {
    return plain('wait', t(lang, 'verdictStateOnly', { states: record.locations.map(stateName).join(', ') }))
  }
  return plain('wait', t(lang, 'verdictNotMatched'))
}
