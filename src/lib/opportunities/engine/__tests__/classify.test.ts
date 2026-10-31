import { describe, expect, it } from 'vitest'
import { reviewerChecksFrom } from '../../fact-mapping'
import { cleanFacts } from '../facts'
import { classifyRecord, freshnessOf, windowState } from '../classify'
import type { EngineContext, EngineRecord, FactDefinition } from '../types'
import { activityIds, activityPacks, factDefinitions, mappings, p04Catalog } from './seeds'

const now = new Date('2026-10-31T00:00:00Z')
const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString()
const daysAhead = (days: number) => new Date(now.getTime() + days * 86_400_000).toISOString()

const context: EngineContext = {
  mappings,
  reviewerChecks: reviewerChecksFrom(mappings),
  factKeys: new Set(factDefinitions.map(fact => fact.key)),
  fixableKeys: new Set(factDefinitions.filter(fact => fact.fixable).map(fact => fact.key)),
  derivation: { now, activityPacks },
}

const definitions: FactDefinition[] = factDefinitions.map(fact => ({
  key: fact.key,
  type: fact.type,
  fixable: fact.fixable,
  values: fact.values?.map(value => String(value[0])),
}))
const knownActivities = new Set(activityIds)

function record(rules: unknown, overrides: Partial<EngineRecord> = {}): EngineRecord {
  return {
    id: 'record-1',
    slug: 'test-scheme',
    title: 'Test scheme',
    type: 'subsidy',
    status: 'active',
    versionId: 'version-1',
    rules,
    windows: [{ windowType: 'rolling', opensAt: null, closesAt: null }],
    lastCheckedAt: daysAgo(10),
    packIds: ['food'],
    coverage: 'central',
    locations: ['India'],
    rates: [],
    requiredCount: 0,
    stepCount: 0,
    ...overrides,
  }
}

const inMaharashtra = { field: 'state', operator: 'equals', value: 'maharashtra' }
const hasUdyam = { field: 'udyam_registered', operator: 'equals', value: true }
const hasTraining = { field: 'training_certificate', operator: 'equals', value: true }
const ageLimit = { field: 'applicant_age_years', operator: 'less_than_or_equal', value: 45 }
const passes = { all: [inMaharashtra] }
const maharashtra = { state: 'maharashtra' }

describe('hard and fixable answers', () => {
  it('a failed hard rule is D even when another fact is unknown', () => {
    const verdict = classifyRecord(record({ all: [inMaharashtra, ageLimit] }), { state: 'bihar' }, context, now)
    expect(verdict.bucket).toBe('D')
    expect(verdict.blockers.length).toBeGreaterThan(0)
  })

  it('a failed fixable rule is B and names the thing to get', () => {
    const verdict = classifyRecord(record({ all: [hasUdyam] }), { udyam_registered: false }, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual([{ kind: 'obtain', factKey: 'udyam_registered' }])
  })

  it('lists every fixable blocker', () => {
    const verdict = classifyRecord(record({ all: [hasUdyam, hasTraining] }), { udyam_registered: false, training_certificate: false }, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual(expect.arrayContaining([
      { kind: 'obtain', factKey: 'udyam_registered' },
      { kind: 'obtain', factKey: 'training_certificate' },
    ]))
    expect(verdict.steps).toHaveLength(2)
  })

  it('leaves out a fixable "no" that the rule does not use', () => {
    const verdict = classifyRecord(record({ all: [hasUdyam] }), { udyam_registered: false, training_certificate: false }, context, now)
    expect(verdict.steps).toEqual([{ kind: 'obtain', factKey: 'udyam_registered' }])
  })

  it('a hard failure wins over a fixable one', () => {
    const verdict = classifyRecord(record({ all: [inMaharashtra, hasUdyam] }), { state: 'bihar', udyam_registered: false }, context, now)
    expect(verdict.bucket).toBe('D')
  })

  it('an unanswered rule is B and asks the question', () => {
    const verdict = classifyRecord(record({ all: [ageLimit] }), {}, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual([{ kind: 'answer', factKey: 'applicant_age_years' }])
  })

  it('asks about a dictionary fact that a rule reads directly', () => {
    const rule = { all: [{ field: 'annual_family_income_band', operator: 'in', value: ['up_to_72k'] }] }
    const verdict = classifyRecord(record(rule), {}, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual([{ kind: 'answer', factKey: 'annual_family_income_band' }])
  })

  it('has no question to ask for a rule field outside the dictionary', () => {
    const verdict = classifyRecord(record({ all: [{ field: 'not_a_real_rule_field', operator: 'equals', value: true }] }), {}, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual([])
  })

  it('traces an unanswered derived rule to the question behind it', () => {
    const verdict = classifyRecord(record({ all: [{ field: 'sc_st_owned', operator: 'equals', value: true }] }), {}, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.steps).toEqual([{ kind: 'answer', factKey: 'social_category' }])
  })

  it('tells a keeper of 40 goats plainly that a 500-doe scheme is not for them', () => {
    const nlm = p04Catalog.corrections[0].changes.rules
    const verdict = classifyRecord(record(nlm), { activity_codes: ['goat_sheep'], small_ruminant_females: 40, small_ruminant_males: 5 }, context, now)
    expect(verdict.bucket).toBe('D')
  })

  it('a bank check never blocks a founder who qualifies, and is listed', () => {
    const bankCheck = mappings.find(mapping => mapping.treatment === 'bank_check')!
    const rule = { all: [inMaharashtra, { field: bankCheck.legacy_field, operator: 'equals', value: true }] }
    const verdict = classifyRecord(record(rule), maharashtra, context, now)
    expect(verdict.bucket).toBe('A')
    expect(verdict.bankChecks).toEqual([bankCheck.check_note_en])
  })

  it('is never "eligible now" when only bank checks passed and nothing about the founder was tested', () => {
    const bankCheck = mappings.find(mapping => mapping.treatment === 'bank_check')!
    const verdict = classifyRecord(record({ all: [{ field: bankCheck.legacy_field, operator: 'equals', value: true }] }), maharashtra, context, now)
    expect(verdict.bucket).toBe('B')
    expect(verdict.decidedBy).toEqual([])
    expect(verdict.bankChecks).toEqual([bankCheck.check_note_en])
  })

  it('an empty rule set is never "eligible now"', () => {
    expect(classifyRecord(record({ all: [] }), maharashtra, context, now).bucket).toBe('B')
  })

  it('a malformed rule never reaches A', () => {
    expect(classifyRecord(record({ nonsense: true }), maharashtra, context, now).bucket).toBe('B')
  })
})

describe('non-answers', () => {
  it('turn "prefer not to say" into unknown, so the record stays open', () => {
    const { facts, nonAnswers } = cleanFacts({ social_category: 'prefer_not' }, definitions, knownActivities)
    expect(facts).toEqual({})
    expect(nonAnswers).toEqual({ social_category: 'declined' })
    const rule = { all: [{ field: 'social_category', operator: 'in', value: ['sc', 'st'] }] }
    expect(classifyRecord(record(rule), facts, context, now).bucket).toBe('B')
  })

  it('turn "don\'t know" into unknown on any fact', () => {
    const { facts, nonAnswers } = cleanFacts({ udyam_registered: 'dont_know' }, definitions, knownActivities)
    expect(facts).toEqual({})
    expect(nonAnswers).toEqual({ udyam_registered: 'dont_know' })
  })
})

describe('cleaning what a caller sends', () => {
  const clean = (raw: unknown) => cleanFacts(raw, definitions, knownActivities).facts

  it('drops keys outside the dictionary', () => {
    expect(clean({ pan_number: 'ABCDE1234F', aadhaar: '123412341234', state: 'bihar' })).toEqual({ state: 'bihar' })
  })

  it('drops a value outside an enum', () => {
    expect(clean({ state: 'atlantis', social_category: 'sc' })).toEqual({ social_category: 'sc' })
  })

  it('drops the wrong type', () => {
    expect(clean({ udyam_registered: 'yes', applicant_age_years: '34' })).toEqual({})
  })

  it('drops negative and non-finite numbers', () => {
    expect(clean({ applicant_age_years: -3, workers_count: 'NaN', poultry_bird_count: Number.POSITIVE_INFINITY })).toEqual({})
  })

  it('keeps only known activities, at most five', () => {
    expect(clean({ activity_codes: ['pond_fish', 'made_up'] })).toEqual({ activity_codes: ['pond_fish'] })
    const six = activityIds.slice(0, 6)
    expect(clean({ activity_codes: six })).toEqual({ activity_codes: six.slice(0, 5) })
  })

  it('ignores anything that is not an object', () => {
    expect(clean('state=bihar')).toEqual({})
    expect(clean(null)).toEqual({})
    expect(clean(['bihar'])).toEqual({})
  })

  it('fills the project band from an exact cost, because rules read the band', () => {
    expect(clean({ project_cost_exact_inr: 800000 })).toEqual({ project_cost_exact_inr: 800000, project_cost_band: '5l_10l' })
  })

  it('lets an exact cost correct a band that disagrees with it', () => {
    expect(clean({ project_cost_exact_inr: 1200000, project_cost_band: '5l_10l' })).toEqual({ project_cost_exact_inr: 1200000, project_cost_band: '10l_25l' })
  })

  it('puts a very large exact cost in the open-ended band', () => {
    expect(clean({ project_cost_exact_inr: 50000000 }).project_cost_band).toBe('above_2cr')
  })

  it('keeps good answers as they are', () => {
    expect(clean({ state: 'bihar', applicant_age_years: 34, udyam_registered: false, project_cost_band: '5l_10l' }))
      .toEqual({ state: 'bihar', applicant_age_years: 34, udyam_registered: false, project_cost_band: '5l_10l' })
  })
})

describe('freshness', () => {
  it.each([
    [10, 'fresh'],
    [30, 'fresh'],
    [45, 'amber'],
    [60, 'amber'],
    [61, 'stale'],
  ])('checked %i days ago is %s', (days, expected) => {
    expect(freshnessOf(daysAgo(days), now)).toBe(expected)
  })

  it('never checked is stale', () => {
    expect(freshnessOf(null, now)).toBe('stale')
    expect(freshnessOf('not a date', now)).toBe('stale')
  })

  it.each([
    [10, 'A'],
    [45, 'A'],
    [60, 'A'],
    [61, 'C'],
  ])('rules true, checked %i days ago is bucket %s', (days, expected) => {
    expect(classifyRecord(record(passes, { lastCheckedAt: daysAgo(days) }), maharashtra, context, now).bucket).toBe(expected)
  })

  it('rules true, never checked is C', () => {
    const verdict = classifyRecord(record(passes, { lastCheckedAt: null }), maharashtra, context, now)
    expect(verdict.bucket).toBe('C')
    expect(verdict.freshness).toBe('stale')
  })
})

describe('status and windows', () => {
  it.each(['pending_renewal', 'closed', 'paused', 'upcoming'])('rules true with status %s is C', status => {
    expect(classifyRecord(record(passes, { status }), maharashtra, context, now).bucket).toBe('C')
  })

  it('a hard failure with a closed window is still D', () => {
    expect(classifyRecord(record(passes, { status: 'closed' }), { state: 'bihar' }, context, now).bucket).toBe('D')
  })

  it('a fixable failure with a closed window is C and keeps its steps', () => {
    const verdict = classifyRecord(record({ all: [hasUdyam] }, { status: 'closed' }), { udyam_registered: false }, context, now)
    expect(verdict.bucket).toBe('C')
    expect(verdict.steps).toEqual([{ kind: 'obtain', factKey: 'udyam_registered' }])
  })

  it('an active record whose only dated window has passed is C, not A', () => {
    const windows = [{ windowType: 'annual', opensAt: '2025-01-01', closesAt: '2025-03-01' }]
    expect(windowState(windows, 'active', now)).toBe('closed')
    expect(classifyRecord(record(passes, { windows }), maharashtra, context, now).bucket).toBe('C')
  })

  it.each(['closed', 'closed_or_claim_only'])('window type %s with no dates is closed', windowType => {
    const windows = [{ windowType, opensAt: null, closesAt: null }]
    expect(windowState(windows, 'active', now)).toBe('closed')
    expect(classifyRecord(record(passes, { windows }), maharashtra, context, now).bucket).toBe('C')
  })

  it('a window opening next month is not yet open', () => {
    const windows = [{ windowType: 'fixed', opensAt: daysAhead(30), closesAt: daysAhead(60) }]
    expect(windowState(windows, 'active', now)).toBe('not_yet_open')
    expect(classifyRecord(record(passes, { windows }), maharashtra, context, now).bucket).toBe('C')
  })

  it('a window open today is open', () => {
    expect(windowState([{ windowType: 'fixed', opensAt: daysAgo(5), closesAt: daysAhead(5) }], 'active', now)).toBe('open')
  })

  it.each([
    ['rolling', [{ windowType: 'rolling', opensAt: null, closesAt: null }]],
    ['undated static', [{ windowType: 'static', opensAt: null, closesAt: null }]],
    ['rolling beside a closed row', [{ windowType: 'closed', opensAt: null, closesAt: null }, { windowType: 'rolling', opensAt: null, closesAt: null }]],
    ['no window at all', []],
  ])('%s is open, so rules true is A', (_name, windows) => {
    expect(classifyRecord(record(passes, { windows }), maharashtra, context, now).bucket).toBe('A')
  })
})
