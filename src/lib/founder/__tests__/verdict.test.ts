import { describe, expect, it } from 'vitest'
import type { Combination } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import type { EngineRecord } from '@/lib/opportunities/engine/types'
import { formatDate, formatInr } from '@/lib/start/format'
import { TEXT } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'
import { outsideVerdict, verdictFor } from '../verdict'

function result(overrides: Partial<RecordResult> = {}): RecordResult {
  return {
    bucket: 'A',
    windowState: 'open',
    freshness: 'fresh',
    steps: [],
    bankChecks: [],
    blockers: [],
    decidedBy: ['state'],
    failedFacts: [],
    id: 'rec-1',
    slug: 'a-scheme',
    title: 'A scheme',
    type: 'subsidy',
    status: 'active',
    lastCheckedAt: '2026-10-20T00:00:00Z',
    windows: [],
    aboveLimitInr: null,
    lines: null,
    ...overrides,
  }
}

function record(overrides: Partial<EngineRecord> = {}): EngineRecord {
  return {
    id: 'rec-1',
    slug: 'a-scheme',
    title: 'A scheme',
    type: 'subsidy',
    status: 'active',
    versionId: 'v1',
    rules: null,
    windows: [],
    lastCheckedAt: null,
    packIds: [],
    coverage: 'national',
    locations: [],
    rates: [],
    requiredCount: 1,
    stepCount: 1,
    ...overrides,
  }
}

const combination = (recommended: string[] = []): Combination => ({ recommended, alternatives: [], sequences: [] })
const labelOf = (factKey: string) => ({ udyam: 'Udyam', state: 'State', category: 'Category', age: 'Age' })[factKey] ?? factKey
const stateName = (code: string) => ({ bihar: 'Bihar', jharkhand: 'Jharkhand', odisha: 'Odisha' })[code] ?? code
const founderFacts = { state: 'odisha' }
const NOW = new Date('2026-10-31T00:00:00Z')
const verdict = (item: RecordResult, recommended: string[] = [], lang: Lang = 'en', now: Date = NOW) =>
  verdictFor(item, combination(recommended), lang, labelOf, now)
const answer = (factKey: string) => ({ kind: 'answer' as const, factKey })
const obtain = (factKey: string) => ({ kind: 'obtain' as const, factKey })

describe('verdictFor, bucket A', () => {
  it('says to apply first when the scheme is in the best route', () => {
    expect(verdict(result(), ['rec-1'])).toEqual({ tone: 'go', text: 'You qualify. We suggest you apply first.', detail: null })
  })

  it('says to apply now when the scheme is not in the best route', () => {
    expect(verdict(result(), ['other'])).toEqual({ tone: 'go', text: 'You qualify. Apply now.', detail: null })
  })

  it('says it qualifies only on what could be checked when the bank checks part of it', () => {
    expect(verdict(result({ bankChecks: ['Income proof'] }), ['rec-1'])).toEqual({
      tone: 'go', text: 'You qualify on what we could check.', detail: null,
    })
  })

  it('does not promise a plain "Apply now" when the bank checks part of it, recommended or not', () => {
    expect(verdict(result({ bankChecks: ['Income proof'] }), []).text).toBe('You qualify on what we could check.')
  })
})

describe('verdictFor, bucket B', () => {
  const inB = (overrides: Partial<RecordResult>) => result({ bucket: 'B', ...overrides })

  it('counts the questions to answer', () => {
    const item = inB({ steps: [answer('state'), answer('category'), answer('age')] })
    expect(verdict(item)).toEqual({ tone: 'step', text: 'Answer 3 questions to find out.', detail: null })
  })

  it('says question, not questions, for one', () => {
    expect(verdict(inB({ steps: [answer('state')] }))).toEqual({ tone: 'step', text: 'Answer 1 question to find out.', detail: null })
  })

  it('counts a fact once however often it appears', () => {
    const item = inB({ steps: [answer('state'), answer('state'), answer('age')] })
    expect(verdict(item).text).toBe('Answer 2 questions to find out.')
    expect(verdict(inB({ steps: [answer('state'), answer('state')] })).text).toBe('Answer 1 question to find out.')
  })

  it('names the one thing to get first', () => {
    expect(verdict(inB({ steps: [obtain('udyam')] }))).toEqual({ tone: 'step', text: 'Get this first: Udyam', detail: null })
  })

  it('counts only the answers when there is also something to get', () => {
    const item = inB({ steps: [obtain('udyam'), answer('state'), answer('category')] })
    expect(verdict(item)).toEqual({ tone: 'step', text: 'Answer 2 questions to find out.', detail: null })
  })

  it('says it cannot check yet when nothing was tested and there is nothing to ask', () => {
    expect(verdict(inB({ steps: [], decidedBy: [] }))).toEqual({ tone: 'step', text: 'We cannot check this for you yet.', detail: null })
  })

  it('says the same when the founder declined the question', () => {
    expect(verdict(inB({ steps: [], decidedBy: ['state'] }))).toEqual({ tone: 'step', text: 'We cannot check this for you yet.', detail: null })
  })
})

describe('verdictFor, bucket C', () => {
  const inC = (overrides: Partial<RecordResult>) => result({ bucket: 'C', ...overrides })

  it('says the renewal is awaited, even when the check is stale', () => {
    expect(verdict(inC({ status: 'pending_renewal', freshness: 'stale' }))).toEqual({ tone: 'wait', text: 'Renewal awaited', detail: null })
    expect(verdict(inC({ status: 'pending_renewal', windowState: 'closed' })).text).toBe('Renewal awaited')
  })

  it('says paused', () => {
    expect(verdict(inC({ status: 'paused' }))).toEqual({ tone: 'wait', text: 'Paused', detail: null })
  })

  it('gives the date it opens', () => {
    const item = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [{ windowType: 'fixed', opensAt: '2026-12-01T00:00:00Z', closesAt: '2027-01-31T00:00:00Z' }],
    })
    const found = verdict(item)
    expect(found.tone).toBe('wait')
    expect(found.text).toBe(`Opens on ${formatDate('2026-12-01T00:00:00Z', 'en')}`)
    expect(found.text).toMatch(/2026/)
    expect(found.detail).toBeNull()
  })

  it('gives the next opening, not a past one, when an earlier window is listed first', () => {
    const item = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [
        { windowType: 'fixed', opensAt: '2025-04-01T00:00:00Z', closesAt: '2025-06-30T00:00:00Z' },
        { windowType: 'fixed', opensAt: '2026-12-01T00:00:00Z', closesAt: '2027-01-31T00:00:00Z' },
      ],
    })
    expect(verdict(item).text).toBe(`Opens on ${formatDate('2026-12-01T00:00:00Z', 'en')}`)
    expect(verdict(item).text).not.toMatch(/2025/)
  })

  it('gives the earliest of several coming openings, whatever order they are listed in', () => {
    const item = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [
        { windowType: 'fixed', opensAt: '2027-03-01T00:00:00Z', closesAt: null },
        { windowType: 'fixed', opensAt: '2026-12-01T00:00:00Z', closesAt: null },
      ],
    })
    expect(verdict(item).text).toBe(`Opens on ${formatDate('2026-12-01T00:00:00Z', 'en')}`)
  })

  it('judges "coming" against the date it is given, and against today when none is given', () => {
    const item = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [{ windowType: 'fixed', opensAt: '2026-12-01T00:00:00Z', closesAt: null }],
    })
    expect(verdict(item, [], 'en', new Date('2026-12-02T00:00:00Z')).text).toBe('Not open yet')
    const farAway = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [{ windowType: 'fixed', opensAt: '2999-01-01T00:00:00Z', closesAt: null }],
    })
    expect(verdictFor(farAway, combination(), 'en', labelOf).text).toBe(`Opens on ${formatDate('2999-01-01T00:00:00Z', 'en')}`)
  })

  it('says not open yet when every date has already passed', () => {
    const item = inC({
      status: 'upcoming',
      windowState: 'not_yet_open',
      windows: [{ windowType: 'fixed', opensAt: '2025-04-01T00:00:00Z', closesAt: '2025-06-30T00:00:00Z' }],
    })
    expect(verdict(item).text).toBe('Not open yet')
  })

  it('says not open yet, not closed, for an upcoming scheme with no dated window', () => {
    expect(verdict(inC({ status: 'upcoming', windowState: 'open', windows: [] }))).toEqual({ tone: 'wait', text: 'Not open yet', detail: null })
    const undated = inC({ status: 'upcoming', windowState: 'open', windows: [{ windowType: 'fixed', opensAt: null, closesAt: null }] })
    expect(verdict(undated)).toEqual({ tone: 'wait', text: 'Not open yet', detail: null })
  })

  it('keeps renewal and paused ahead of an upcoming scheme', () => {
    expect(verdict(inC({ status: 'pending_renewal', windowState: 'not_yet_open' })).text).toBe('Renewal awaited')
    expect(verdict(inC({ status: 'paused', windowState: 'not_yet_open' })).text).toBe('Paused')
  })

  it('says not open yet when no date is known', () => {
    expect(verdict(inC({ status: 'upcoming', windowState: 'not_yet_open', windows: [] }))).toEqual({ tone: 'wait', text: 'Not open yet', detail: null })
    const undated = inC({ windowState: 'not_yet_open', windows: [{ windowType: 'fixed', opensAt: null, closesAt: null }] })
    expect(verdict(undated).text).toBe('Not open yet')
  })

  it('says not open yet when the date cannot be read', () => {
    const broken = inC({ windowState: 'not_yet_open', windows: [{ windowType: 'fixed', opensAt: 'not a date', closesAt: null }] })
    expect(verdict(broken).text).toBe('Not open yet')
  })

  it('says the status is not confirmed for an active scheme not checked lately', () => {
    expect(verdict(inC({ status: 'active', freshness: 'stale' }))).toEqual({ tone: 'wait', text: 'Status not confirmed', detail: null })
  })

  it('otherwise says closed', () => {
    expect(verdict(inC({ status: 'active', windowState: 'closed' }))).toEqual({ tone: 'wait', text: 'Closed', detail: null })
    expect(verdict(inC({ status: 'closed', windowState: 'closed' })).text).toBe('Closed')
  })
})

describe('verdictFor, bucket D', () => {
  const inD = (overrides: Partial<RecordResult>) => result({ bucket: 'D', ...overrides })

  it('says not for you and names the answers that rule it out', () => {
    expect(verdict(inD({ failedFacts: ['state', 'category'] }))).toEqual({
      tone: 'wait',
      text: 'Not for you',
      detail: 'This scheme does not fit your answer on: State, Category',
    })
  })

  it('gives the limit when the project is above it', () => {
    expect(verdict(inD({ aboveLimitInr: 5000000 }))).toEqual({
      tone: 'wait',
      text: 'Not for you',
      detail: `Your project is above this scheme's limit of ${formatInr(5000000)}.`,
    })
    expect(verdict(inD({ aboveLimitInr: 5000000 })).detail).toContain('₹50,00,000')
  })

  it('prefers the limit over the answers when both are present', () => {
    expect(verdict(inD({ aboveLimitInr: 5000000, failedFacts: ['state'] })).detail).toContain('limit of ₹50,00,000')
  })

  it('has no detail when nothing is known about why', () => {
    expect(verdict(inD({ failedFacts: [], aboveLimitInr: null }))).toEqual({ tone: 'wait', text: 'Not for you', detail: null })
  })

  it('gives a detail only for bucket D', () => {
    expect(verdict(result({ failedFacts: ['state'], aboveLimitInr: 5000000 })).detail).toBeNull()
    expect(verdict(result({ bucket: 'B', steps: [answer('state')], failedFacts: ['state'] })).detail).toBeNull()
    expect(verdict(result({ bucket: 'C', status: 'paused', failedFacts: ['state'] })).detail).toBeNull()
  })
})

describe('outsideVerdict', () => {
  it('says a state scheme is for that state only', () => {
    const scheme = record({ coverage: 'state', locations: ['bihar'] })
    expect(outsideVerdict(scheme, founderFacts, 'en', stateName)).toEqual({ tone: 'wait', text: 'For Bihar only', detail: null })
  })

  it('lists every state a scheme covers', () => {
    const scheme = record({ coverage: 'state', locations: ['bihar', 'jharkhand'] })
    expect(outsideVerdict(scheme, { state: 'goa' }, 'en', stateName).text).toBe('For Bihar, Jharkhand only')
  })

  it('sends a registration to the path', () => {
    for (const type of ['registration', 'licence']) {
      expect(outsideVerdict(record({ type }), founderFacts, 'en', stateName)).toEqual({
        tone: 'wait', text: 'See Registrations & licences', detail: null,
      })
    }
  })

  it('sends a registration to the path even when it belongs to another state', () => {
    const scheme = record({ type: 'registration', coverage: 'state', locations: ['bihar'] })
    expect(outsideVerdict(scheme, founderFacts, 'en', stateName).text).toBe('See Registrations & licences')
  })

  it('says a record from another industry is not matched', () => {
    const scheme = record({ coverage: 'national', packIds: ['fisheries'] })
    expect(outsideVerdict(scheme, founderFacts, 'en', stateName)).toEqual({ tone: 'wait', text: 'Not matched to your work', detail: null })
  })

  it('says not matched for a state record in the founder\'s own state', () => {
    const scheme = record({ coverage: 'state', locations: ['odisha'] })
    expect(outsideVerdict(scheme, founderFacts, 'en', stateName).text).toBe('Not matched to your work')
  })

  it('says not matched for a state record when the founder\'s state is not known', () => {
    const scheme = record({ coverage: 'state', locations: ['bihar'] })
    expect(outsideVerdict(scheme, {}, 'en', stateName).text).toBe('Not matched to your work')
  })

  it('never returns go, including for an unknown slug', () => {
    expect(outsideVerdict(undefined, founderFacts, 'en', stateName)).toEqual({ tone: 'wait', text: 'We cannot check this for you yet.', detail: null })
    const cases = [
      undefined,
      record(),
      record({ type: 'registration' }),
      record({ type: 'licence' }),
      record({ coverage: 'state', locations: ['bihar'] }),
      record({ packIds: ['fisheries'] }),
    ]
    for (const scheme of cases) {
      for (const lang of ['en', 'hi', 'mr'] as const) {
        expect(outsideVerdict(scheme, founderFacts, lang, stateName).tone).toBe('wait')
      }
    }
  })
})

describe('verdict words in every language', () => {
  const VERDICT_KEYS = [
    'verdictApplyFirst', 'verdictApply', 'verdictChecked', 'verdictAnswerOne', 'verdictAnswerMany',
    'verdictCannotCheck', 'verdictOpens', 'verdictNotOpen', 'verdictNotForYou', 'verdictStateOnly',
    'verdictOnPath', 'verdictNotMatched',
  ] as const
  const DEVANAGARI = /[ऀ-ॿ]/

  it('has every verdict word in Hindi and Marathi', () => {
    for (const lang of ['hi', 'mr'] as const) {
      for (const key of VERDICT_KEYS) {
        const text = TEXT[lang][key]
        expect(text.trim().length, `${lang} ${key}`).toBeGreaterThan(0)
        expect(text, `${lang} ${key}`).toMatch(DEVANAGARI)
        expect(text, `${lang} ${key} is not left in English`).not.toBe(TEXT.en[key])
      }
    }
  })

  it('writes each verdict in the chosen language, with no placeholder left open', () => {
    const dated = result({
      bucket: 'C',
      windowState: 'not_yet_open',
      windows: [{ windowType: 'fixed', opensAt: '2026-12-01T00:00:00Z', closesAt: null }],
    })
    const items = [
      result(),
      result({ bankChecks: ['x'] }),
      result({ bucket: 'B', steps: [answer('state')] }),
      result({ bucket: 'B', steps: [answer('state'), answer('age')] }),
      result({ bucket: 'B', steps: [obtain('udyam')] }),
      result({ bucket: 'B', steps: [], decidedBy: [] }),
      result({ bucket: 'C', status: 'pending_renewal' }),
      result({ bucket: 'C', status: 'paused' }),
      dated,
      result({ bucket: 'C', windowState: 'not_yet_open' }),
      result({ bucket: 'C', freshness: 'stale' }),
      result({ bucket: 'C', windowState: 'closed' }),
      result({ bucket: 'D', failedFacts: ['state'] }),
      result({ bucket: 'D', aboveLimitInr: 5000000 }),
    ]
    for (const lang of ['hi', 'mr'] as const) {
      for (const item of items) {
        const found = verdict(item, ['rec-1'], lang)
        const words = [found.text, found.detail ?? ''].join(' ')
        expect(words, `${lang} ${item.bucket} ${found.text}`).not.toMatch(/\{\w+\}/)
        expect(found.text, `${lang} ${item.bucket}`).toMatch(DEVANAGARI)
      }
    }
    const state = record({ coverage: 'state', locations: ['bihar'] })
    for (const lang of ['hi', 'mr'] as const) {
      for (const scheme of [undefined, record({ type: 'licence' }), state, record()]) {
        const found = outsideVerdict(scheme, founderFacts, lang, stateName)
        expect(found.text, lang).not.toMatch(/\{\w+\}/)
        expect(found.text, lang).toMatch(DEVANAGARI)
      }
    }
  })
})
