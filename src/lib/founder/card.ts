import type { BenefitLines } from '@/lib/opportunities/engine/calculator'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { formatDate, formatInr, formatRange } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang, Text } from '@/lib/start/types'
import { verdictFor, type Verdict } from './verdict'

export type CardMoney = {
  label: string
  value: string
  note: string | null
  // go: free money. plain: money you must pay back. step: something to do first.
  tone: 'go' | 'plain' | 'step'
}

export type CardContent = {
  verdict: Verdict
  // Both only for a scheme the founder can apply to now.
  why: string | null
  nextStep: string | null
  money: CardMoney | null
  // A scheme the founder can apply to now, with no amount worked out for it.
  noAmount: boolean
  // The questions that would settle it, by name.
  toAnswer: string[]
  // What the scheme says it gives, for a scheme that is one step away.
  couldMean: string | null
  ifRenewed: boolean
  bankChecks: string[]
  checkedOn: string | null
  // The date is old, or there is none: the card shows it so the founder knows.
  checkedStale: boolean
  ownShortfall: string | null
  betterRate: string | null
}

const hasAmount = (range: { max: number | null }) => range.max === null || range.max > 0

// Rates are whole numbers or halves; rounding only hides floating-point noise such as 4.9000000000000004.
const roundedRate = (rate: number) => Math.round(rate * 100) / 100

function interestNote(lines: BenefitLines, lang: Lang) {
  const rate = lines.interestRatePct
  if (rate === null) return null
  const relief = lines.interestSubventionPct
  return relief ? t(lang, 'interestAfter', { rate, net: roundedRate(rate - relief) }) : t(lang, 'interest', { rate })
}

/**
 * The one amount a card leads with: free money if there is any, else the loan.
 * Each line stands alone, so nothing is added into one "benefit" figure.
 */
function moneyOf(lines: BenefitLines | null, lang: Lang): CardMoney | null {
  if (!lines) return null
  const renewed = lines.ifRenewed

  if (hasAmount(lines.subsidy)) {
    return { label: t(lang, renewed ? 'moneyFreeRenewed' : 'moneyFree'), value: formatRange(lines.subsidy, lang), note: null, tone: 'go' }
  }
  if (lines.loan && hasAmount(lines.loan)) {
    // With no own share stated, the loan figure is the most the scheme lends, not a worked-out amount.
    const value = lines.own === null && lines.loan.max !== null
      ? t(lang, 'upTo', { amount: formatInr(lines.loan.max) })
      : formatRange(lines.loan, lang)
    return { label: t(lang, renewed ? 'moneyLoanRenewed' : 'moneyLoan'), value, note: interestNote(lines, lang), tone: 'plain' }
  }
  return null
}

function whyItFits(item: RecordResult, lang: Lang, answerWords: Record<string, Text>) {
  if (item.bucket !== 'A') return null
  const answers = item.decidedBy.filter(key => Object.hasOwn(answerWords, key)).map(key => answerWords[key][lang])
  return answers.length ? t(lang, 'whyFits', { answers: answers.join(', ') }) : null
}

function nextStepOf(item: RecordResult, lang: Lang) {
  if (item.bucket !== 'A') return null
  // An older stored catalog has no route at all, so this reads as missing, not as null.
  return item.applyRoute ? t(lang, 'nextStepRoute', { route: item.applyRoute }) : t(lang, 'nextStepSource')
}

/**
 * Everything one scheme card says, as words in the founder's language. The page
 * only lays it out, so the same scheme reads the same wherever it is shown.
 * `now` only decides which opening date is still ahead.
 */
export function cardContent(
  item: RecordResult,
  combination: Combination,
  lang: Lang,
  labels: Record<string, Text>,
  answerWords: Record<string, Text>,
  now: Date = new Date(),
): CardContent {
  const labelOf = (factKey: string) => (Object.hasOwn(labels, factKey) ? labels[factKey][lang] : factKey.replace(/_/g, ' '))
  const lines = item.lines
  const checkedOn = formatDate(item.lastCheckedAt, lang) || null

  return {
    verdict: verdictFor(item, combination, lang, labelOf, now),
    why: whyItFits(item, lang, answerWords),
    nextStep: nextStepOf(item, lang),
    money: moneyOf(lines, lang),
    noAmount: item.bucket === 'A' && !lines,
    toAnswer: [...new Set(item.steps.filter(step => step.kind === 'answer').map(step => step.factKey))].map(labelOf),
    couldMean: item.bucket === 'B' ? item.benefitHeadline ?? null : null,
    ifRenewed: lines?.ifRenewed ?? false,
    bankChecks: item.bucket === 'D' ? [] : item.bankChecks,
    checkedOn,
    checkedStale: item.freshness !== 'fresh',
    ownShortfall: lines?.ownShortfall ? t(lang, 'ownShortfall') : null,
    betterRate: lines?.betterIfAnswered.length ? t(lang, 'betterRate', { labels: lines.betterIfAnswered.map(labelOf).join(', ') }) : null,
  }
}
