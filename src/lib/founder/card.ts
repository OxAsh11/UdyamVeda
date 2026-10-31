import type { BenefitLines, InrRange } from '@/lib/opportunities/engine/calculator'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { CLOSED_WINDOW_TYPES, singleWindowState } from '@/lib/opportunities/engine/windows'
import { formatDate, formatInr, formatRange } from '@/lib/start/format'
import { t } from '@/lib/start/i18n'
import type { Lang, Text } from '@/lib/start/types'
import { labelReader } from './answers'
import { nextOpening, verdictFor, verdictStatesOpening, type Verdict } from './verdict'

export type CardMoney = {
  label: string
  value: string
  note: string | null
  // go: free money. plain: money you must pay back, or a plain figure. step: still to arrange.
  tone: 'go' | 'plain' | 'step'
}

export type CardContent = {
  verdict: Verdict
  // Both only for a scheme the founder can apply to now.
  why: string | null
  nextStep: string | null
  // The one amount the card leads with.
  money: CardMoney | null
  // Every line behind it, so a founder never has to trust one headline figure.
  moneyLines: CardMoney[]
  // A scheme the founder can apply to now, with no amount worked out for it.
  noAmount: boolean
  // The questions that would settle it, by name. Only for a scheme that is one step away.
  toAnswer: string[]
  // What to get first, as sentences. Leaves out the one the verdict already says.
  toObtain: string[]
  // What the scheme says it gives, for a scheme that is one step away.
  couldMean: string | null
  // When the scheme takes applications. Not for a scheme that is not for the founder.
  windowLine: string | null
  ifRenewed: boolean
  bankChecks: string[]
  checkedOn: string | null
  // The date is old, or there is none: the card shows it so the founder knows.
  checkedStale: boolean
  ownShortfall: string | null
  betterRate: string | null
}

export const hasAmount = (range: { max: number | null }) => range.max === null || range.max > 0

// Rates are whole numbers or halves; rounding only hides floating-point noise such as 4.9000000000000004.
export const roundedRate = (rate: number) => Math.round(rate * 100) / 100

function interestNote(lines: BenefitLines, lang: Lang) {
  const rate = lines.interestRatePct
  if (rate === null) return null
  const relief = lines.interestSubventionPct
  return relief ? t(lang, 'interestAfter', { rate, net: roundedRate(rate - relief) }) : t(lang, 'interest', { rate })
}

// With no own share stated, the loan figure is the most the scheme lends, not a worked-out amount.
export function loanValue(lines: BenefitLines, loan: InrRange, lang: Lang) {
  return lines.own === null && loan.max !== null ? t(lang, 'upTo', { amount: formatInr(loan.max) }) : formatRange(loan, lang)
}

// The line the main tile leads with: free money if there is any, else the loan.
function leadOf(lines: BenefitLines | null): 'subsidy' | 'loan' | null {
  if (!lines) return null
  if (hasAmount(lines.subsidy)) return 'subsidy'
  return lines.loan && hasAmount(lines.loan) ? 'loan' : null
}

/**
 * The one amount a card leads with: free money if there is any, else the loan.
 * Each line stands alone, so nothing is added into one "benefit" figure.
 */
function moneyOf(lines: BenefitLines | null, lang: Lang): CardMoney | null {
  if (!lines) return null
  const renewed = lines.ifRenewed

  const lead = leadOf(lines)
  if (lead === 'subsidy') {
    return { label: t(lang, renewed ? 'moneyFreeRenewed' : 'moneyFree'), value: formatRange(lines.subsidy, lang), note: null, tone: 'go' }
  }
  if (lead === 'loan' && lines.loan) {
    return { label: t(lang, renewed ? 'moneyLoanRenewed' : 'moneyLoan'), value: loanValue(lines, lines.loan, lang), note: interestNote(lines, lang), tone: 'plain' }
  }
  return null
}

/**
 * Each line the calculator worked out, in the order a founder reads a budget, except the one
 * the main tile already shows: the same amount and interest note twice would read as two loans.
 * With no main tile every line stays.
 */
function moneyLinesOf(lines: BenefitLines | null, lang: Lang): CardMoney[] {
  if (!lines) return []
  const lead = leadOf(lines)
  const list: CardMoney[] = [
    { label: t(lang, 'projectCost'), value: formatRange(lines.projectCost, lang), note: null, tone: 'plain' },
    { label: t(lang, 'ownMoney'), value: lines.own ? formatRange(lines.own, lang) : t(lang, 'ownNotStated'), note: null, tone: 'plain' },
  ]
  if (lead !== 'subsidy') {
    list.push({ label: t(lang, 'subsidy'), value: formatRange(lines.subsidy, lang), note: null, tone: 'plain' })
  }
  if (lead !== 'loan' && lines.loan && hasAmount(lines.loan)) {
    list.push({ label: t(lang, 'loan'), value: loanValue(lines, lines.loan, lang), note: interestNote(lines, lang), tone: 'plain' })
  }
  if (hasAmount(lines.uncovered)) {
    list.push({ label: t(lang, 'toArrange'), value: formatRange(lines.uncovered, lang), note: lines.own ? null : t(lang, 'toArrangeNote'), tone: 'step' })
  }
  return list
}

// Rows can be past or still to come, so every date here is read against `now`, never taken from the first row.
function windowLineOf(item: RecordResult, lang: Lang, now: Date): string | null {
  if (item.bucket === 'D') return null

  if (item.windowState === 'not_yet_open') {
    // A verdict that already says when it opens needs no second line saying it.
    if (verdictStatesOpening(item)) return null
    const opens = nextOpening(item, now)
    return opens ? t(lang, 'windowOpens', { from: formatDate(opens, lang) }) : null
  }
  if (item.windowState === 'closed') {
    const closes = item.windows
      .map(window => window.closesAt)
      .filter((closesAt): closesAt is string => !!closesAt && new Date(closesAt).getTime() <= now.getTime())
      .sort((left, right) => new Date(left).getTime() - new Date(right).getTime())
      .at(-1)
    return closes ? t(lang, 'windowUntil', { to: formatDate(closes, lang) }) : null
  }
  const current = item.windows.find(window =>
    window.opensAt && window.closesAt
    && !CLOSED_WINDOW_TYPES.has(window.windowType)
    && singleWindowState(window, now.getTime()) === 'open')
  if (current?.opensAt && current.closesAt) return t(lang, 'windowDates', { from: formatDate(current.opensAt, lang), to: formatDate(current.closesAt, lang) })
  return item.windows.some(window => window.windowType === 'rolling') ? null : t(lang, 'checkPortal')
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

const distinctKeys = (item: RecordResult, kind: 'answer' | 'obtain') =>
  [...new Set(item.steps.filter(step => step.kind === kind).map(step => step.factKey))]

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
  const labelOf = labelReader(labels, lang)
  const lines = item.lines
  const verdict = verdictFor(item, combination, lang, labelOf, now)

  return {
    verdict,
    why: whyItFits(item, lang, answerWords),
    nextStep: nextStepOf(item, lang),
    money: moneyOf(lines, lang),
    moneyLines: moneyLinesOf(lines, lang),
    noAmount: item.bucket === 'A' && !lines,
    toAnswer: item.bucket === 'B' ? distinctKeys(item, 'answer').map(labelOf) : [],
    // The verdict names the first of these when there is no question to answer; saying it twice adds nothing.
    toObtain: distinctKeys(item, 'obtain').map(key => t(lang, 'stepObtain', { label: labelOf(key) })).filter(text => text !== verdict.text),
    couldMean: item.bucket === 'B' ? item.benefitHeadline ?? null : null,
    windowLine: windowLineOf(item, lang, now),
    ifRenewed: lines?.ifRenewed ?? false,
    bankChecks: item.bucket === 'D' ? [] : item.bankChecks,
    checkedOn: formatDate(item.lastCheckedAt, lang) || null,
    checkedStale: item.freshness !== 'fresh',
    ownShortfall: lines?.ownShortfall ? t(lang, 'ownShortfall') : null,
    betterRate: lines?.betterIfAnswered.length ? t(lang, 'betterRate', { labels: lines.betterIfAnswered.map(labelOf).join(', ') }) : null,
  }
}
