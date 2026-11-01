import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import type { BenefitLines } from '@/lib/opportunities/engine/calculator'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { formatDate, formatRange } from '@/lib/start/format'
import { TEXT } from '@/lib/start/i18n'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import type { Lang, Text } from '@/lib/start/types'
import { answerWordsFor, factLabelsOf } from '../answers'
import { cardContent } from '../card'

const NOW = new Date('2026-10-31T00:00:00Z')
const bundle = seedBundle()
const labels = factLabelsOf(bundle)
const words: Record<string, Text> = answerWordsFor({ activity_codes: ['pond_fish'], state: 'jharkhand', area_type: 'rural' }, bundle)

function result(overrides: Partial<RecordResult> = {}): RecordResult {
  return {
    bucket: 'A',
    windowState: 'open',
    freshness: 'fresh',
    steps: [],
    bankChecks: [],
    blockers: [],
    decidedBy: ['activity_codes'],
    failedFacts: [],
    id: 'rec-1',
    slug: 'a-scheme',
    title: 'A scheme',
    type: 'subsidy',
    status: 'active',
    lastCheckedAt: '2026-10-20T00:00:00Z',
    windows: [],
    applyRoute: null,
    benefitHeadline: null,
    aboveLimitInr: null,
    lines: null,
    ...overrides,
  }
}

function lines(overrides: Partial<BenefitLines> = {}): BenefitLines {
  return {
    projectCost: { min: 500000, max: 1000000 },
    own: null,
    subsidy: { min: 0, max: 0 },
    loan: null,
    uncovered: { min: 0, max: 0 },
    interestRatePct: null,
    interestSubventionPct: null,
    rateLabel: 'Standard rate',
    sourceUrl: 'https://example.gov.in',
    betterIfAnswered: [],
    ownShortfall: false,
    ceilingInr: null,
    aboveCeiling: false,
    straddlesCeiling: false,
    ifRenewed: false,
    ...overrides,
  }
}

const combination: Combination = { recommended: [], alternatives: [], sequences: [] }
const content = (item: RecordResult, lang: Lang = 'en', answerWords: Record<string, Text> = words) =>
  cardContent(item, combination, lang, labels, answerWords, NOW)
const answer = (factKey: string) => ({ kind: 'answer' as const, factKey })
const obtain = (factKey: string) => ({ kind: 'obtain' as const, factKey })

describe('cardContent, the verdict', () => {
  it('leads with the verdict the rules engine gave', () => {
    expect(content(result()).verdict).toEqual({ tone: 'go', text: 'You qualify. Apply now.', detail: null })
    expect(content(result({ bucket: 'D', failedFacts: ['state'] })).verdict).toMatchObject({ tone: 'wait', text: 'Not for you' })
  })
})

describe('cardContent, why it fits and the next step', () => {
  it("says why it fits using the founder's own answer", () => {
    expect(content(result()).why).toBe('Why it fits you: you said Pond fish farming.')
  })

  it('joins several answers in the order the rule read them, and skips what the founder did not give', () => {
    const item = result({ decidedBy: ['state', 'applicant_age_years', 'activity_codes'] })
    expect(content(item).why).toBe('Why it fits you: you said Jharkhand, Pond fish farming.')
  })

  it('says it in the chosen language', () => {
    expect(content(result(), 'hi').why).toContain('तालाब में मछली पालन')
    expect(content(result(), 'mr').why).toContain('तलावातील मत्स्यपालन')
  })

  it('says nothing when no answer sits behind the rule', () => {
    expect(content(result({ decidedBy: [] })).why).toBeNull()
    expect(content(result({ decidedBy: ['applicant_age_years'] })).why).toBeNull()
    expect(content(result(), 'en', {}).why).toBeNull()
  })

  it('does not read an inherited property as an answer', () => {
    expect(content(result({ decidedBy: ['constructor', 'toString'] })).why).toBeNull()
  })

  describe('for a founder with many answers', () => {
    const upFounder = answerWordsFor({
      state: 'uttar_pradesh', applicant_age_years: 30, minority_community: 'no', received_govt_subsidy_before: false, udyam_registered: true,
    }, bundle)
    const read = ['state', 'applicant_age_years', 'minority_community', 'received_govt_subsidy_before', 'udyam_registered']
    const why = (lang: Lang, decidedBy = read) => content(result({ decidedBy }), lang, upFounder).why

    it('puts the label beside an answer that cannot stand alone, in every language', () => {
      for (const lang of ['en', 'hi', 'mr'] as const) {
        const text = why(lang, ['state', 'applicant_age_years', 'received_govt_subsidy_before'])
        expect(text, lang).toContain(upFounder.state[lang])
        expect(text, lang).toContain(`${labels.applicant_age_years[lang]}: 30`)
        expect(text, lang).toContain(`${labels.received_govt_subsidy_before[lang]}: ${upFounder.received_govt_subsidy_before[lang]}`)
        // A named choice reads fine alone.
        expect(text, lang).not.toContain(`${labels.state[lang]}:`)
      }
    })

    it('shows three answers at most and says there is more', () => {
      expect(why('en')).toBe(`Why it fits you: you said Uttar Pradesh, ${labels.applicant_age_years.en}: 30, ${labels.minority_community.en}: No, and more.`)
      for (const lang of ['hi', 'mr'] as const) {
        const text = why(lang)!
        expect(text, lang).toContain(`${labels.applicant_age_years[lang]}: 30`)
        expect(text, lang).not.toContain(labels.received_govt_subsidy_before[lang])
        expect(text, lang).not.toBe(why('en'))
      }
    })

    it('does not say "and more" when everything fits', () => {
      expect(why('en', ['state', 'applicant_age_years', 'minority_community'])).toBe(`Why it fits you: you said Uttar Pradesh, ${labels.applicant_age_years.en}: 30, ${labels.minority_community.en}: No.`)
    })

    it('leaves out a non-answer', () => {
      const unsure = answerWordsFor({ state: 'uttar_pradesh', gender: 'prefer_not', social_category: 'dont_know' }, bundle)
      expect(content(result({ decidedBy: ['gender', 'social_category', 'state'] }), 'en', unsure).why).toBe('Why it fits you: you said Uttar Pradesh.')
    })
  })

  it('gives the application route as the next step', () => {
    const item = result({ applyRoute: 'Go to any bank branch with your pond details.' })
    expect(content(item).nextStep).toBe('Your next step: Go to any bank branch with your pond details.')
  })

  it('falls back to the official source when no route is stored', () => {
    const official = 'Your next step: open the official source and follow how to apply.'
    expect(content(result({ applyRoute: null })).nextStep).toBe(official)
    // An older stored catalog has no such field at all.
    expect(content(result({ applyRoute: undefined as unknown as null })).nextStep).toBe(official)
    expect(content(result({ applyRoute: '' })).nextStep).toBe(official)
  })

  it('gives a why and a next step only for a scheme the founder can apply to now', () => {
    for (const bucket of ['B', 'C', 'D'] as const) {
      const item = result({ bucket, applyRoute: 'Go to the bank', decidedBy: ['activity_codes'] })
      expect(content(item).why, bucket).toBeNull()
      expect(content(item).nextStep, bucket).toBeNull()
    }
  })
})

describe('cardContent, the money tile', () => {
  it('shows free money in green when there is a subsidy', () => {
    const subsidy = { min: 300000, max: 800000 }
    const money = content(result({ lines: lines({ subsidy, loan: { min: 1, max: 2 } }) })).money
    expect(money).toEqual({ label: 'Free money you can get', value: formatRange(subsidy, 'en'), note: null, tone: 'go' })
    expect(money?.value).toBe('₹3,00,000 – ₹8,00,000')
  })

  it('counts an open-ended subsidy as above zero', () => {
    expect(content(result({ lines: lines({ subsidy: { min: 0, max: null } }) })).money?.tone).toBe('go')
  })

  it('shows a loan as a plain tile with the interest note', () => {
    const item = result({ lines: lines({ loan: { min: 150000, max: 200000 }, interestRatePct: 7, interestSubventionPct: 3 }) })
    expect(content(item).money).toEqual({
      label: 'Loan you can get',
      value: 'Up to ₹2,00,000',
      note: '7% interest, effectively 4% if repaid on time',
      tone: 'plain',
    })
  })

  it('gives the plain interest rate when there is no interest relief', () => {
    const item = result({ lines: lines({ loan: { min: 200000, max: 200000 }, interestRatePct: 7 }) })
    expect(content(item).money?.note).toBe('7% interest')
  })

  it('gives no note when the interest rate is not stated', () => {
    expect(content(result({ lines: lines({ loan: { min: 200000, max: 200000 } }) })).money?.note).toBeNull()
  })

  it('says "Up to" only when the scheme states no own share, because then the loan is a limit', () => {
    const loan = { min: 150000, max: 200000 }
    expect(content(result({ lines: lines({ loan, own: null }) })).money?.value).toBe('Up to ₹2,00,000')
    const worked = content(result({ lines: lines({ loan, own: { min: 50000, max: 100000 } }) })).money
    expect(worked?.value).toBe(formatRange(loan, 'en'))
    expect(worked?.value).not.toContain('Up to')
  })

  it('never writes "Up to" before an amount that has no top', () => {
    const loan = { min: 150000, max: null }
    expect(content(result({ lines: lines({ loan, own: null }) })).money?.value).toBe(formatRange(loan, 'en'))
  })

  it('shows free money before a loan when a scheme has both', () => {
    const item = result({ lines: lines({ subsidy: { min: 100000, max: 100000 }, loan: { min: 200000, max: 200000 } }) })
    expect(content(item).money?.label).toBe('Free money you can get')
  })

  it('shows no tile for a loan of nothing', () => {
    expect(content(result({ lines: lines({ loan: { min: 0, max: 0 } }) })).money).toBeNull()
  })

  it('writes interest relief without floating-point noise', () => {
    const item = result({ lines: lines({ loan: { min: 1, max: 2 }, interestRatePct: 8.4, interestSubventionPct: 3.5 }) })
    expect(content(item).money?.note).toBe('8.4% interest, effectively 4.9% if repaid on time')
  })

  it('shows no tile when there is neither a subsidy nor a loan', () => {
    expect(content(result({ lines: lines() })).money).toBeNull()
    expect(content(result({ lines: null })).money).toBeNull()
  })

  it('does not ask for a project cost the founder gave', () => {
    const item = result({ lines: null })
    expect(content(item).noAmount).toBe(true)
    expect(TEXT.en.noAmount).toBe('We have not worked out an amount yet.')
    expect(TEXT.en.noAmount).not.toMatch(/project cost/i)
  })

  it('says an amount is missing only for a scheme the founder can apply to now', () => {
    expect(content(result({ lines: lines() })).noAmount).toBe(false)
    expect(content(result({ bucket: 'B', lines: null })).noAmount).toBe(false)
    expect(content(result({ bucket: 'C', lines: null })).noAmount).toBe(false)
  })

  it('words the money in the chosen language', () => {
    const item = result({ lines: lines({ subsidy: { min: 100000, max: 100000 } }) })
    expect(content(item, 'hi').money?.label).toBe(TEXT.hi.moneyFree)
    expect(content(item, 'mr').money?.label).toBe(TEXT.mr.moneyFree)
  })
})

describe('cardContent, one step away', () => {
  const stepItem = (overrides: Partial<RecordResult> = {}) => result({
    bucket: 'B',
    decidedBy: [],
    steps: [answer('applicant_age_years'), answer('social_category'), answer('applicant_age_years'), obtain('udyam_registered')],
    benefitHeadline: '40% subsidy on a loan at 6%',
    ...overrides,
  })

  it('lists what to answer, and what it could mean', () => {
    const found = content(stepItem())
    expect(found.toAnswer).toEqual([labels.applicant_age_years.en, labels.social_category.en])
    expect(found.couldMean).toBe('40% subsidy on a loan at 6%')
  })

  it('names the questions in the chosen language', () => {
    expect(content(stepItem(), 'hi').toAnswer).toEqual([labels.applicant_age_years.hi, labels.social_category.hi])
  })

  it('leaves out steps that are about getting something, not answering', () => {
    expect(content(stepItem({ steps: [obtain('udyam_registered')] })).toAnswer).toEqual([])
  })

  it('shows what it could mean for one step away only, and not when none is stored', () => {
    expect(content(stepItem({ benefitHeadline: null })).couldMean).toBeNull()
    expect(content(stepItem({ benefitHeadline: undefined as unknown as null })).couldMean).toBeNull()
    for (const bucket of ['A', 'C', 'D'] as const) {
      expect(content(result({ bucket, benefitHeadline: '25% subsidy' })).couldMean, bucket).toBeNull()
    }
  })

  it('lists questions for one step away only, not for a waiting scheme', () => {
    expect(content(result({ bucket: 'C', steps: [answer('social_category')] })).toAnswer).toEqual([])
    expect(content(stepItem()).toAnswer).toHaveLength(2)
  })

  it('lists no questions for a scheme with none left', () => {
    expect(content(result()).toAnswer).toEqual([])
  })

  it('lists what to get first next to the questions, when a scheme needs both', () => {
    const found = content(stepItem())
    expect(found.toAnswer).toEqual([labels.applicant_age_years.en, labels.social_category.en])
    expect(found.verdict.text).toBe('Answer 2 questions to find out.')
    expect(found.toObtain).toEqual([`Get this first: ${labels.udyam_registered.en}`])
  })

  it('names what to get first in the chosen language, once each', () => {
    const item = stepItem({ steps: [answer('social_category'), obtain('udyam_registered'), obtain('udyam_registered')] })
    expect(content(item, 'hi').toObtain).toEqual([TEXT.hi.stepObtain.replace('{label}', labels.udyam_registered.hi)])
  })

  it('does not repeat in the list the one thing the verdict already says to get first', () => {
    const item = stepItem({ steps: [obtain('udyam_registered'), obtain('social_category')] })
    const found = content(item)
    expect(found.verdict.text).toBe(`Get this first: ${labels.udyam_registered.en}`)
    expect(found.toObtain).toEqual([`Get this first: ${labels.social_category.en}`])
    expect(content(stepItem({ steps: [obtain('udyam_registered')] })).toObtain).toEqual([])
  })

  it('lists what to get first for a waiting scheme too', () => {
    const found = content(result({ bucket: 'C', status: 'pending_renewal', steps: [obtain('udyam_registered')] }))
    expect(found.toObtain).toEqual([`Get this first: ${labels.udyam_registered.en}`])
  })

  it('lists nothing to get first when nothing is needed', () => {
    expect(content(result()).toObtain).toEqual([])
    expect(content(stepItem({ steps: [answer('social_category')] })).toObtain).toEqual([])
  })

  it('says it cannot check a scheme where nothing about the founder was tested', () => {
    const found = content(stepItem({ steps: [], decidedBy: [] }))
    expect(found.verdict.text).toBe('We cannot check this for you yet.')
    expect(found.toAnswer).toEqual([])
  })
})

describe('cardContent, the application window', () => {
  const window = (windowType: string, opensAt: string | null, closesAt: string | null) => ({ windowType, opensAt, closesAt })

  it('gives the dates of an open window', () => {
    const item = result({ windows: [window('fixed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z')] })
    expect(content(item).windowLine).toBe('Window: 1 Oct 2026 to 31 Dec 2026')
  })

  it('says the dates in the chosen language', () => {
    const item = result({ windows: [window('fixed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z')] })
    expect(content(item, 'hi').windowLine).toBe(
      TEXT.hi.windowDates.replace('{from}', formatDate('2026-10-01T00:00:00Z', 'hi')).replace('{to}', formatDate('2026-12-31T00:00:00Z', 'hi')),
    )
  })

  it('sends the founder to the official portal when the dates are not stored', () => {
    expect(content(result({ windows: [] })).windowLine).toBe('Check the official portal for dates')
    expect(content(result({ windows: [window('fixed', null, null)] })).windowLine).toBe('Check the official portal for dates')
    expect(content(result({ windows: [window('fixed', null, '2026-12-31T00:00:00Z')] })).windowLine).toBe('Check the official portal for dates')
  })

  it('says nothing for a scheme that is always open', () => {
    expect(content(result({ windows: [window('rolling', null, null)] })).windowLine).toBeNull()
  })

  it('says when a closed window ended', () => {
    const item = result({ bucket: 'C', status: 'closed', windowState: 'closed', windows: [window('fixed', '2026-01-01T00:00:00Z', '2026-03-31T00:00:00Z')] })
    expect(content(item).windowLine).toBe('Window closed on 31 Mar 2026')
  })

  it('says nothing when a closed scheme has no end date', () => {
    expect(content(result({ bucket: 'C', status: 'closed', windowState: 'closed', windows: [] })).windowLine).toBeNull()
  })

  it('does not say the opening date twice when the verdict already says it', () => {
    const item = result({
      bucket: 'C',
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [window('fixed', '2026-11-05T00:00:00Z', '2026-12-31T00:00:00Z')],
    })
    const found = content(item)
    expect(found.verdict.text).toBe('Opens on 5 Nov 2026')
    expect(found.windowLine).toBeNull()
  })

  describe('with a past window and a later one', () => {
    // Rows can come oldest first: a call that has ended, then the next one.
    const ended = window('fixed', '2026-04-01T00:00:00Z', '2026-06-30T00:00:00Z')
    const ahead = window('fixed', '2026-11-05T00:00:00Z', '2026-12-31T00:00:00Z')
    const current = window('fixed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z')

    it('never gives the opening date of the past window next to a verdict that gives the next one', () => {
      for (const windows of [[ended, ahead], [ahead, ended]]) {
        const found = content(result({ bucket: 'C', status: 'upcoming', windowState: 'not_yet_open', windows }))
        expect(found.verdict.text).toBe('Opens on 5 Nov 2026')
        expect(found.windowLine).toBeNull()
      }
    })

    it('gives the next opening, not a past one, when the verdict is about something else', () => {
      for (const windows of [[ended, ahead], [ahead, ended]]) {
        const found = content(result({ bucket: 'C', status: 'pending_renewal', windowState: 'not_yet_open', windows }))
        expect(found.verdict.text).toBe('Renewal awaited')
        expect(found.windowLine).toBe('Opens on 5 Nov 2026')
      }
    })

    it('gives no opening date when none is ahead', () => {
      const found = content(result({ bucket: 'C', status: 'pending_renewal', windowState: 'not_yet_open', windows: [ended] }))
      expect(found.windowLine).toBeNull()
    })

    it('gives the dates of the window that is open now, not of an earlier one', () => {
      for (const windows of [[ended, current], [current, ended], [ended, current, ahead]]) {
        expect(content(result({ windows })).windowLine).toBe('Window: 1 Oct 2026 to 31 Dec 2026')
      }
    })

    it('sends the founder to the official portal when no window with dates is open now', () => {
      expect(content(result({ windows: [ended, ahead] })).windowLine).toBe('Check the official portal for dates')
    })
  })

  it('does not take a window of a closed kind for the window that is open', () => {
    const windows = [window('closed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z'), window('fixed', '2026-10-15T00:00:00Z', '2027-01-15T00:00:00Z')]
    expect(content(result({ windows })).windowLine).toBe('Window: 15 Oct 2026 to 15 Jan 2027')
  })

  it('does not say a window closed on a date that has not come', () => {
    const item = result({ bucket: 'C', status: 'closed', windowState: 'closed', windows: [window('fixed', '2026-01-01T00:00:00Z', '2026-12-31T00:00:00Z')] })
    expect(content(item).windowLine).toBeNull()
  })

  it('says the latest end that has passed for a closed scheme', () => {
    const windows = [window('fixed', '2026-01-01T00:00:00Z', '2026-03-31T00:00:00Z'), window('fixed', '2026-05-01T00:00:00Z', '2026-06-30T00:00:00Z')]
    expect(content(result({ bucket: 'C', status: 'closed', windowState: 'closed', windows })).windowLine).toBe('Window closed on 30 Jun 2026')
  })

  it('says nothing for a scheme that is not for the founder', () => {
    const item = result({ bucket: 'D', windows: [window('fixed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z')] })
    expect(content(item).windowLine).toBeNull()
  })

  it('gives the window for one step away and a waiting scheme', () => {
    const windows = [window('fixed', '2026-10-01T00:00:00Z', '2026-12-31T00:00:00Z')]
    expect(content(result({ bucket: 'B', windows })).windowLine).toBe('Window: 1 Oct 2026 to 31 Dec 2026')
    expect(content(result({ bucket: 'C', status: 'pending_renewal', windows })).windowLine).toBe('Window: 1 Oct 2026 to 31 Dec 2026')
  })
})

describe('cardContent, every money line', () => {
  it('lists each line of a scheme with a subsidy, except the free money the main tile already shows', () => {
    const item = result({
      lines: lines({
        projectCost: { min: 500000, max: 1000000 },
        own: { min: 50000, max: 100000 },
        subsidy: { min: 300000, max: 800000 },
        loan: { min: 100000, max: 100000 },
        uncovered: { min: 10000, max: 20000 },
        interestRatePct: 7,
        interestSubventionPct: 3,
      }),
    })
    expect(content(item).money).toMatchObject({ label: 'Free money you can get', value: '₹3,00,000 – ₹8,00,000', tone: 'go' })
    expect(content(item).moneyLines).toEqual([
      { label: 'Project cost', value: '₹5,00,000 – ₹10,00,000', note: null, tone: 'plain' },
      { label: 'Your own money', value: '₹50,000 – ₹1,00,000', note: null, tone: 'plain' },
      { label: 'Loan', value: '₹1,00,000', note: '7% interest, effectively 4% if repaid on time', tone: 'plain' },
      { label: 'Still to arrange', value: '₹10,000 – ₹20,000', note: null, tone: 'step' },
    ])
  })

  it('lists each line of a credit-only scheme, except the loan and its interest the main tile already shows', () => {
    const item = result({
      lines: lines({
        projectCost: { min: 500000, max: 1000000 },
        own: null,
        subsidy: { min: 0, max: 0 },
        loan: { min: 150000, max: 200000 },
        uncovered: { min: 300000, max: 800000 },
        interestRatePct: 7,
      }),
    })
    expect(content(item).money).toEqual({ label: 'Loan you can get', value: 'Up to ₹2,00,000', note: '7% interest', tone: 'plain' })
    expect(content(item).moneyLines).toEqual([
      { label: 'Project cost', value: '₹5,00,000 – ₹10,00,000', note: null, tone: 'plain' },
      { label: 'Your own money', value: 'Not stated by the scheme', note: null, tone: 'plain' },
      { label: 'Subsidy or grant', value: '₹0', note: null, tone: 'plain' },
      {
        label: 'Still to arrange',
        value: '₹3,00,000 – ₹8,00,000',
        note: 'From your own money or a bank. The scheme does not say how to split it.',
        tone: 'step',
      },
    ])
  })

  it('never shows the same amount or interest note twice on one card', () => {
    const credit = content(result({ lines: lines({ own: null, loan: { min: 150000, max: 200000 }, interestRatePct: 7, interestSubventionPct: 3 }) }))
    const subsidy = content(result({ lines: lines({ subsidy: { min: 300000, max: 800000 }, loan: { min: 100000, max: 100000 }, interestRatePct: 7 }) }))
    for (const card of [credit, subsidy]) {
      const shown = [card.money, ...card.moneyLines].filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      const notes = shown.map(entry => entry.note).filter(note => note !== null)
      expect(new Set(notes).size, JSON.stringify(shown)).toBe(notes.length)
    }
    expect(credit.money?.note).toBe('7% interest, effectively 4% if repaid on time')
    expect(credit.moneyLines.map(line => line.note)).not.toContain(credit.money?.note)
  })

  it('shows every line when there is no main tile', () => {
    // No free money and no loan: the tile has nothing to lead with, so nothing is left out.
    const item = result({ lines: lines({ own: { min: 50000, max: 100000 }, subsidy: { min: 0, max: 0 }, loan: null, uncovered: { min: 10000, max: 20000 } }) })
    expect(content(item).money).toBeNull()
    expect(content(item).moneyLines.map(line => line.label)).toEqual(['Project cost', 'Your own money', 'Subsidy or grant', 'Still to arrange'])
  })

  it('leaves out the loan when the scheme gives none to show', () => {
    const labelsShown = content(result({ lines: lines({ subsidy: { min: 1, max: 2 }, loan: null }) })).moneyLines.map(line => line.label)
    expect(labelsShown).not.toContain('Loan')
  })

  it('leaves out a loan of nothing, which the main tile also hides', () => {
    for (const own of [null, { min: 1, max: 2 }]) {
      const item = result({ lines: lines({ own, subsidy: { min: 1, max: 2 }, loan: { min: 0, max: 0 } }) })
      expect(content(item).moneyLines.map(line => line.label), String(own)).not.toContain('Loan')
    }
  })

  it('keeps a loan that has no top, and one that starts at nothing', () => {
    // Free money leads the tile, so the loan is the line that has to say it.
    const free = { min: 1, max: 2 }
    const open = content(result({ lines: lines({ own: { min: 1, max: 2 }, subsidy: free, loan: { min: 100000, max: null } }) })).moneyLines
    expect(open.find(line => line.label === 'Loan')?.value).toBe('₹1,00,000 or more')
    const wide = content(result({ lines: lines({ own: { min: 1, max: 2 }, subsidy: free, loan: { min: 0, max: 100000 } }) })).moneyLines
    expect(wide.find(line => line.label === 'Loan')?.value).toBe('₹0 – ₹1,00,000')
  })

  it('leaves out what is still to arrange when it is nothing, and keeps it when it has no top', () => {
    const none = content(result({ lines: lines({ uncovered: { min: 0, max: 0 } }) })).moneyLines.map(line => line.label)
    expect(none).not.toContain('Still to arrange')
    const open = content(result({ lines: lines({ uncovered: { min: 100000, max: null } }) })).moneyLines
    expect(open.find(line => line.label === 'Still to arrange')?.value).toBe('₹1,00,000 or more')
  })

  it('explains the split only when the scheme states no own share', () => {
    const stated = content(result({ lines: lines({ own: { min: 1, max: 2 }, uncovered: { min: 5, max: 6 } }) })).moneyLines
    expect(stated.find(line => line.label === 'Still to arrange')?.note).toBeNull()
  })

  it('has no lines when no amount was worked out', () => {
    expect(content(result({ lines: null })).moneyLines).toEqual([])
    expect(content(result({ bucket: 'B', lines: null })).moneyLines).toEqual([])
  })

  it('words the lines in the chosen language', () => {
    const item = result({ lines: lines({ subsidy: { min: 100000, max: 100000 }, uncovered: { min: 5, max: 6 } }) })
    expect(content(item, 'hi').moneyLines.map(line => line.label)).toEqual([
      TEXT.hi.projectCost, TEXT.hi.ownMoney, TEXT.hi.toArrange,
    ])
  })
})

describe('cardContent, a scheme that has closed or is waiting', () => {
  const waiting = (overrides: Partial<BenefitLines> = {}) => result({
    bucket: 'C',
    status: 'pending_renewal',
    lines: lines({ subsidy: { min: 200000, max: 400000 }, ifRenewed: true, ...overrides }),
  })

  it('shows what a renewed scheme could be worth, and that it depends on the scheme returning', () => {
    const found = content(waiting())
    expect(found.ifRenewed).toBe(true)
    expect(found.money).toEqual({
      label: 'Free money, if it returns on the same terms',
      value: '₹2,00,000 – ₹4,00,000',
      note: null,
      tone: 'go',
    })
  })

  it('says the same of a loan', () => {
    const found = content(waiting({ subsidy: { min: 0, max: 0 }, loan: { min: 100000, max: 100000 }, own: { min: 1, max: 1 } }))
    expect(found.money?.label).toBe('Loan, if it returns on the same terms')
    expect(found.money?.tone).toBe('plain')
  })

  it('does not promise anything for a scheme that is open', () => {
    expect(content(result({ lines: lines({ subsidy: { min: 1, max: 2 } }) })).ifRenewed).toBe(false)
    expect(content(result({ lines: null })).ifRenewed).toBe(false)
  })

  it('says the scheme is waiting, in the verdict', () => {
    expect(content(waiting()).verdict).toEqual({ tone: 'wait', text: 'Renewal awaited', detail: null })
  })
})

describe('cardContent, the date and the checks', () => {
  it('gives the date the scheme was last checked', () => {
    const found = content(result({ lastCheckedAt: '2026-10-25T08:00:00Z' }))
    expect(found.checkedOn).toBe('25 Oct 2026')
    expect(found.checkedStale).toBe(false)
  })

  it('marks a stale date for the card', () => {
    const found = content(result({ lastCheckedAt: '2026-08-01T00:00:00Z', freshness: 'stale' }))
    expect(found.checkedOn).toBe('1 Aug 2026')
    expect(found.checkedStale).toBe(true)
  })

  it('marks a date that is getting old, too', () => {
    expect(content(result({ freshness: 'amber' })).checkedStale).toBe(true)
  })

  it('gives no date when the scheme was never checked, and marks that as stale', () => {
    const found = content(result({ lastCheckedAt: null, freshness: 'stale' }))
    expect(found.checkedOn).toBeNull()
    expect(found.checkedStale).toBe(true)
  })

  it('writes the date in the chosen language', () => {
    const hindi = content(result({ lastCheckedAt: '2026-10-25T08:00:00Z' }), 'hi').checkedOn
    expect(hindi).toBe(formatDate('2026-10-25T08:00:00Z', 'hi'))
    expect(hindi).not.toBe('25 Oct 2026')
  })

  it('keeps what the bank or department will check', () => {
    expect(content(result({ bankChecks: ['Income proof'] })).bankChecks).toEqual(['Income proof'])
    expect(content(result({ bucket: 'D', bankChecks: ['Income proof'] })).bankChecks).toEqual([])
  })

  it('keeps the warning that the own share is more than the founder can put in', () => {
    const short = content(result({ lines: lines({ ownShortfall: true }) }))
    expect(short.ownShortfall).toBe('This is more than you said you can put in.')
    expect(content(result({ lines: lines() })).ownShortfall).toBeNull()
    expect(content(result({ lines: null })).ownShortfall).toBeNull()
  })

  it('keeps the questions that could get a better rate, in the founder\'s language', () => {
    const better = content(result({ lines: lines({ betterIfAnswered: ['social_category', 'applicant_age_years'] }) }), 'hi')
    expect(better.betterRate).toBe(TEXT.hi.betterRate.replace('{labels}', `${labels.social_category.hi}, ${labels.applicant_age_years.hi}`))
    expect(content(result({ lines: lines() })).betterRate).toBeNull()
    expect(content(result({ lines: null })).betterRate).toBeNull()
  })

  it('falls back to a plain phrase for a question that has no name', () => {
    const found = content(result({ bucket: 'B', steps: [answer('some_new_fact')] }))
    expect(found.toAnswer).toEqual(['some new fact'])
  })
})

describe('the scheme card colours', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'src/components/founder/VerdictCard.tsx'), 'utf8')

  it('never uses red: nothing on a scheme card is a deadline or a penalty, a shortfall is one thing needed', () => {
    expect(source).not.toMatch(/urgent/i)
  })

  it('shows the own-money shortfall as an amber chip, with its icon and words', () => {
    expect(source).toMatch(/<StatusChip tone="step" text=\{card\.ownShortfall\}/)
  })
})
