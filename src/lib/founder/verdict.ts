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

// The earliest opening still ahead of us. Earlier rows may be past windows.
export function nextOpening(item: RecordResult, now: Date) {
  const ahead = item.windows
    .map(window => window.opensAt)
    .filter((opensAt): opensAt is string => !!opensAt)
    .filter(opensAt => new Date(opensAt).getTime() > now.getTime())
    .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())
  return ahead[0] ?? null
}

function openingText(item: RecordResult, lang: Lang, now: Date) {
  const date = formatDate(nextOpening(item, now), lang)
  return date ? t(lang, 'verdictOpens', { date }) : t(lang, 'verdictNotOpen')
}

/**
 * Whether the verdict for this scheme says when it opens. A renewal or a pause is said first,
 * and an upcoming scheme with no dated window has not opened yet, whatever the window state says.
 */
export function verdictStatesOpening(item: RecordResult) {
  return item.bucket === 'C'
    && item.status !== 'pending_renewal'
    && item.status !== 'paused'
    && (item.status === 'upcoming' || item.windowState === 'not_yet_open')
}

function waitingText(item: RecordResult, lang: Lang, now: Date) {
  if (item.status === 'pending_renewal') return t(lang, 'statusRenewal')
  if (item.status === 'paused') return t(lang, 'statusPaused')
  if (verdictStatesOpening(item)) return openingText(item, lang, now)
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
 * engine's decision; it never makes one. `now` only decides which opening date is still ahead.
 */
export function verdictFor(
  item: RecordResult,
  combination: Combination,
  lang: Lang,
  labelOf: (factKey: string) => string,
  now: Date = new Date(),
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
      return plain('wait', waitingText(item, lang, now))

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

/** A registration or licence is not a scheme to qualify for: it is on the founder's path. */
export const onPathVerdict = (lang: Lang): Verdict => plain('wait', t(lang, 'verdictOnPath'))

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
  if (REGISTRATION_TYPES.has(record.type)) return onPathVerdict(lang)
  if (outsideFounderState(record, facts)) {
    return plain('wait', t(lang, 'verdictStateOnly', { states: record.locations.map(stateName).join(', ') }))
  }
  return plain('wait', t(lang, 'verdictNotMatched'))
}
