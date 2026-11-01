import { describe, expect, it } from 'vitest'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { answerText, answerWordsFor, checkedFacts, factLabelsOf, withNonAnswers } from '../answers'

const bundle = seedBundle()

function result(decidedBy: string[]): RecordResult {
  return {
    bucket: 'A',
    windowState: 'open',
    freshness: 'fresh',
    steps: [],
    bankChecks: [],
    blockers: [],
    decidedBy,
    failedFacts: [],
    id: 'rec-1',
    slug: 'a-scheme',
    title: 'A scheme',
    type: 'subsidy',
    status: 'active',
    lastCheckedAt: null,
    windows: [],
    applyRoute: null,
    benefitHeadline: null,
    aboveLimitInr: null,
    lines: null,
  }
}

describe('answerText', () => {
  it('names an option in the chosen language', () => {
    expect(answerText('state', 'jharkhand', bundle, 'en')).toBe('Jharkhand')
    expect(answerText('state', 'jharkhand', bundle, 'hi')).toBe('झारखंड')
    expect(answerText('area_type', 'rural', bundle, 'en')).toBe('Village (rural)')
    expect(answerText('area_type', 'rural', bundle, 'mr')).toBe('गाव (ग्रामीण)')
  })

  it('never lets a code reach a founder when the option has no label', () => {
    expect(answerText('state', 'atlantis', bundle, 'en')).toBeNull()
    expect(answerText('area_type', 'underwater', bundle, 'hi')).toBeNull()
  })

  it('names chosen activities', () => {
    expect(answerText('activity_codes', ['pond_fish'], bundle, 'en')).toBe('Pond fish farming')
    expect(answerText('activity_codes', ['pond_fish'], bundle, 'hi')).toBe('तालाब में मछली पालन')
    const two = answerText('activity_codes', ['pond_fish', 'poultry_broiler'], bundle, 'en')
    expect(two?.split(', ')).toHaveLength(2)
    expect(two?.startsWith('Pond fish farming, ')).toBe(true)
  })

  it('leaves out an activity it cannot name, and says nothing if none can be named', () => {
    expect(answerText('activity_codes', ['pond_fish', 'no_such_activity'], bundle, 'en')).toBe('Pond fish farming')
    expect(answerText('activity_codes', ['no_such_activity'], bundle, 'en')).toBeNull()
  })

  it('names the options of a list of choices', () => {
    expect(answerText('prior_schemes', ['pmegp', 'mudra'], bundle, 'en')).toBe('PMEGP, Mudra loan')
  })

  it('says Yes and No', () => {
    expect(answerText('udyam_registered', true, bundle, 'en')).toBe('Yes')
    expect(answerText('udyam_registered', false, bundle, 'en')).toBe('No')
    expect(answerText('udyam_registered', true, bundle, 'hi')).toBe('हां')
    expect(answerText('udyam_registered', false, bundle, 'mr')).toBe('नाही')
  })

  it('says a non-answer in words', () => {
    expect(answerText('social_category', 'dont_know', bundle, 'en')).toBe("Don't know")
    expect(answerText('social_category', 'prefer_not', bundle, 'en')).toBe('Prefer not to say')
    expect(answerText('gender', 'prefer_not', bundle, 'hi')).toBe('नहीं बताना चाहते')
    expect(answerText('udyam_registered', 'dont_know', bundle, 'mr')).toBe('माहीत नाही')
  })

  it('writes the exact project cost as rupees and other numbers plainly', () => {
    expect(answerText('project_cost_exact_inr', 800000, bundle, 'en')).toBe('₹8,00,000')
    expect(answerText('applicant_age_years', 34, bundle, 'en')).toBe('34')
    expect(answerText('poultry_bird_count', 1200, bundle, 'hi')).toBe('1200')
    expect(answerText('pond_area_hectares', 0, bundle, 'en')).toBe('0')
  })

  it('prints a plain text answer as it is', () => {
    expect(answerText('district', 'Gaya', bundle, 'en')).toBe('Gaya')
  })

  it('returns null rather than a raw value for a fact it does not know', () => {
    expect(answerText('not_a_fact', 'abc', bundle, 'en')).toBeNull()
    expect(answerText('constructor', 'abc', bundle, 'en')).toBeNull()
  })

  it('returns null for a text answer on a fact that is a number, a yes or no, or has options but none are loaded', () => {
    expect(answerText('applicant_age_years', 'thirty', bundle, 'en')).toBeNull()
    expect(answerText('udyam_registered', 'maybe', bundle, 'en')).toBeNull()
    const noOptions = { ...bundle, facts: { ...bundle.facts, state: { ...bundle.facts.state, options: [] } } }
    expect(answerText('state', 'jharkhand', noOptions, 'en')).toBeNull()
  })

  it('writes a date as a date', () => {
    expect(answerText('operating_since', '2019-05-01', bundle, 'en')).toBe('1 May 2019')
    expect(answerText('operating_since', 'not a date', bundle, 'en')).toBeNull()
  })

  it('returns null for no answer', () => {
    expect(answerText('state', undefined, bundle, 'en')).toBeNull()
    expect(answerText('state', null, bundle, 'en')).toBeNull()
    expect(answerText('district', '', bundle, 'en')).toBeNull()
    expect(answerText('activity_codes', [], bundle, 'en')).toBeNull()
  })
})

describe('factLabelsOf', () => {
  it('gives every fact its name in all three languages', () => {
    const labels = factLabelsOf(bundle)
    expect(labels.state).toEqual({ en: 'State', hi: 'राज्य', mr: 'राज्य' })
    expect(Object.keys(labels)).toEqual(Object.keys(bundle.facts))
  })
})

describe('withNonAnswers', () => {
  it('puts "don\'t know" and "prefer not to say" back next to the answers', () => {
    expect(withNonAnswers({ state: 'bihar' }, { gender: 'declined', udyam_registered: 'dont_know' })).toEqual({
      state: 'bihar',
      gender: 'prefer_not',
      udyam_registered: 'dont_know',
    })
  })

  it('does not change what it was given', () => {
    const facts = { state: 'bihar' }
    withNonAnswers(facts, { gender: 'declined' })
    expect(facts).toEqual({ state: 'bihar' })
  })
})

describe('answerWordsFor', () => {
  const answers = { activity_codes: ['pond_fish'], state: 'jharkhand', udyam_registered: true, gender: 'prefer_not', project_cost_exact_inr: 800000 }

  it('words every answered key in all three languages', () => {
    const words = answerWordsFor(answers, bundle)
    expect(Object.keys(words).sort()).toEqual(Object.keys(answers).sort())
    expect(words.state).toEqual({ en: 'Jharkhand', hi: 'झारखंड', mr: 'झारखंड' })
    expect(words.udyam_registered).toEqual({ en: 'Yes', hi: 'हां', mr: 'हो' })
    expect(words.gender.en).toBe('Prefer not to say')
    expect(words.project_cost_exact_inr.mr).toBe('₹8,00,000')
    expect(words.activity_codes.en).toBe('Pond fish farming')
  })

  it('skips a key it has nothing safe to say about', () => {
    expect(answerWordsFor({ state: 'atlantis', district: 'Gaya' }, bundle)).toEqual({ district: { en: 'Gaya', hi: 'Gaya', mr: 'Gaya' } })
  })
})

describe('checkedFacts', () => {
  const labels = factLabelsOf(bundle)
  const words = answerWordsFor({ state: 'jharkhand', udyam_registered: true, district: 'Gaya' }, bundle)

  it('lists only what the rule read and the founder answered', () => {
    const checked = checkedFacts(result(['udyam_registered', 'social_category', 'state']), words, labels, 'en')
    expect(checked).toEqual([
      { key: 'udyam_registered', label: 'Has Udyam registration', answer: 'Yes', met: true },
      { key: 'state', label: 'State', answer: 'Jharkhand', met: true },
    ])
  })

  it('follows the order the rule read the facts, not the order of the answers', () => {
    expect(checkedFacts(result(['state', 'udyam_registered']), words, labels, 'en').map(item => item.key)).toEqual(['state', 'udyam_registered'])
    expect(checkedFacts(result(['udyam_registered', 'state']), words, labels, 'en').map(item => item.key)).toEqual(['udyam_registered', 'state'])
  })

  it('speaks the chosen language', () => {
    expect(checkedFacts(result(['state']), words, labels, 'hi')).toEqual([{ key: 'state', label: 'राज्य', answer: 'झारखंड', met: true }])
  })

  it('has nothing to list when the rule read nothing the founder answered', () => {
    expect(checkedFacts(result([]), words, labels, 'en')).toEqual([])
    expect(checkedFacts(result(['social_category']), words, labels, 'en')).toEqual([])
  })

  describe('which of them matched', () => {
    const mark = (item: RecordResult) => checkedFacts(item, words, labels, 'en').map(fact => [fact.key, fact.met])
    const read = ['state', 'udyam_registered', 'district']

    it('counts what the rule read as a match, when nothing failed', () => {
      expect(mark(result(read))).toEqual([['state', true], ['udyam_registered', true], ['district', true]])
    })

    it('does not count an answer that failed the rule: it is read by the rule, but it did not match', () => {
      const notForYou: RecordResult = { ...result(read), bucket: 'D', failedFacts: ['state'] }
      expect(mark(notForYou)).toEqual([['state', false], ['udyam_registered', true], ['district', true]])
    })

    it('does not count an answer the founder has to change first', () => {
      const waiting: RecordResult = { ...result(read), bucket: 'C', steps: [{ kind: 'obtain', factKey: 'udyam_registered' }] }
      expect(mark(waiting)).toEqual([['state', true], ['udyam_registered', false], ['district', true]])
    })

    it('does not count a fact as failed because the founder still has a question to answer on it', () => {
      const asked: RecordResult = { ...result(read), bucket: 'B', steps: [{ kind: 'answer', factKey: 'state' }] }
      expect(mark(asked)).toEqual([['state', true], ['udyam_registered', true], ['district', true]])
    })

    it('keeps the order the rule read them in, whatever failed', () => {
      const item: RecordResult = { ...result(['district', 'state']), bucket: 'D', failedFacts: ['state', 'district'] }
      expect(mark(item)).toEqual([['district', false], ['state', false]])
    })
  })

  it('leaves out a non-answer, which is not an answer a rule was met by', () => {
    const answered = answerWordsFor({ state: 'jharkhand', gender: 'prefer_not', social_category: 'dont_know' }, bundle)
    expect(checkedFacts(result(['gender', 'state', 'social_category']), answered, labels, 'en').map(item => item.key)).toEqual(['state'])
    expect(checkedFacts(result(['gender', 'state']), answered, labels, 'hi').map(item => item.key)).toEqual(['state'])
  })

  it('never shows a fact key as its own name', () => {
    expect(checkedFacts(result(['mystery_fact']), { mystery_fact: { en: 'x', hi: 'x', mr: 'x' } }, labels, 'en')).toEqual([])
  })
})
