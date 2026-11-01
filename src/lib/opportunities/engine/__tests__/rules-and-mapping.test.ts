import { describe, expect, it } from 'vitest'
import { evaluateEligibilityRules } from '../../rules'
import { DERIVATION_INPUTS, DERIVATIONS, factKeysForRuleField } from '../../fact-mapping'
import { activityPacks, factDefinitions, mappings } from './seeds'

const context = { now: new Date('2026-10-31T00:00:00Z'), activityPacks }
const factKeys = factDefinitions.map(fact => fact.key)

describe('exists on founder answers', () => {
  it('is unknown, not false, when the fact is unanswered', () => {
    const evaluation = evaluateEligibilityRules({ all: [{ field: 'entity_type', operator: 'exists' }] }, {})
    expect(evaluation.result).toBeNull()
    expect(evaluation.missingFacts).toEqual(['entity_type'])
  })

  it('is true when the fact is answered', () => {
    expect(evaluateEligibilityRules({ all: [{ field: 'entity_type', operator: 'exists' }] }, { entity_type: 'llp' }).result).toBe(true)
  })
})

describe('tracing rule fields back to founder facts', () => {
  it('lists the inputs of every derivation, each one a dictionary fact', () => {
    expect(Object.keys(DERIVATION_INPUTS).sort()).toEqual(Object.keys(DERIVATIONS).sort())
    for (const inputs of Object.values(DERIVATION_INPUTS)) {
      for (const key of inputs) expect(factKeys).toContain(key)
    }
  })

  it('leaves every derivation undefined when nothing is answered', () => {
    for (const [name, derive] of Object.entries(DERIVATIONS)) {
      expect(derive({}, context), name).toBeUndefined()
    }
  })

  it('leaves every derivation undefined when only unrelated facts are answered', () => {
    for (const [name, derive] of Object.entries(DERIVATIONS)) {
      const inputs = new Set<string>(DERIVATION_INPUTS[name])
      const unrelated = { state: 'bihar', workers_count: 3, stage: 'running', gender: 'woman' }
      const facts = Object.fromEntries(Object.entries(unrelated).filter(([key]) => !inputs.has(key)))
      expect(derive(facts, context), name).toBeUndefined()
    }
  })

  it('traces a derived rule field to its facts', () => {
    expect(factKeysForRuleField('sc_st_owned', mappings)).toEqual(['social_category'])
  })

  it('traces a plain fact rule field to its fact', () => {
    expect(factKeysForRuleField('udyam_registered', mappings)).toEqual(['udyam_registered'])
  })

  it('traces a bank check or unmapped field to nothing', () => {
    const bankCheck = mappings.find(mapping => mapping.treatment === 'bank_check')!
    expect(factKeysForRuleField(bankCheck.legacy_field, mappings)).toEqual([])
    expect(factKeysForRuleField('not_a_real_rule_field', mappings)).toEqual([])
  })
})

describe('answers that are only partly known', () => {
  const category = (facts: Record<string, unknown>) => DERIVATIONS.founder_category_legacy(facts, context)
  const standUp = { all: [{ field: 'founder_category', operator: 'in', value: ['women', 'woman', 'sc', 'st'] }] }
  const outcome = (facts: Record<string, unknown>) => evaluateEligibilityRules(standUp, { founder_category: category(facts) }).result

  it('a man who declined his category might still be SC or ST, so it stays unknown', () => {
    expect(outcome({ gender: 'man' })).toBeNull()
  })

  it('someone who declined gender and said general might be a woman, so it stays unknown', () => {
    expect(outcome({ social_category: 'general' })).toBeNull()
  })

  it('a woman qualifies even if her category is unanswered', () => {
    expect(outcome({ gender: 'woman' })).toBe(true)
  })

  it('a general-category man is a certain no', () => {
    expect(outcome({ gender: 'man', social_category: 'general' })).toBe(false)
  })

  it('applicant_type stays unknown until all its inputs are answered', () => {
    const route = { all: [{ field: 'applicant', operator: 'in', value: ['msme'] }] }
    const result = (facts: Record<string, unknown>) => evaluateEligibilityRules(route, { applicant: DERIVATIONS.applicant_type(facts, context) }).result
    expect(result({ dpiit_recognized: false })).toBeNull()
    expect(result({ udyam_registered: true })).toBe(true)
    expect(result({ dpiit_recognized: false, udyam_registered: false, entity_type: 'llp' })).toBe(false)
  })
})

describe('what kind of work an activity is', () => {
  it('counts a fish shop as trading only, even though it sits in the fisheries pack', () => {
    expect(DERIVATIONS.activity_nature({ activity_codes: ['fish_retail'] }, context)).toEqual({ anyOf: ['trading'] })
  })

  it('still counts a fish farm as agro', () => {
    expect((DERIVATIONS.activity_nature({ activity_codes: ['pond_fish'] }, context) as { anyOf: string[] }).anyOf).toContain('agri_allied')
  })
})

describe('family income limits', () => {
  const limit = (value: number) => ({ all: [{ field: 'annual_family_income_inr', operator: 'less_than_or_equal', value }] })
  const income = (band: string) => ({ annual_family_income_inr: DERIVATIONS.annual_family_income_inr({ annual_family_income_band: band }, context) })

  it('gives a clear no for a band just above a limit, not "unknown" forever', () => {
    expect(evaluateEligibilityRules(limit(500000), income('5l_6l')).result).toBe(false)
    expect(evaluateEligibilityRules(limit(800000), income('above_8l')).result).toBe(false)
  })

  it('gives a clear yes for the band ending at the limit', () => {
    expect(evaluateEligibilityRules(limit(500000), income('3l_5l')).result).toBe(true)
  })
})

describe('exact project cost', () => {
  it('wins over the band', () => {
    expect(DERIVATIONS.project_cost_inr({ project_cost_exact_inr: 800000, project_cost_band: '5l_10l' }, context)).toEqual({ min: 800000, max: 800000 })
  })

  it('falls back to the band', () => {
    expect(DERIVATIONS.project_cost_inr({ project_cost_band: '5l_10l' }, context)).toEqual({ min: 500000, max: 1000000 })
  })

  it('is in the fact dictionary', () => {
    const fact = factDefinitions.find(definition => definition.key === 'project_cost_exact_inr')
    expect(fact).toMatchObject({ type: 'number', fixable: false, stage: 4 })
  })
})

describe('the facts an "any" rule reports using', () => {
  const category = { field: 'social_category', operator: 'in', value: ['sc', 'st'] }
  const minority = { field: 'minority_community', operator: 'equals', value: 'yes' }
  const disability = { field: 'has_disability', operator: 'equals', value: true }
  const used = (rules: unknown, facts: Record<string, unknown>) => evaluateEligibilityRules(rules, facts).usedFacts

  it('are only those of the branches that passed, when it passes', () => {
    const evaluation = evaluateEligibilityRules({ any: [category, minority] }, { social_category: 'general', minority_community: 'yes' })
    expect(evaluation.result).toBe(true)
    // "General" did not match, so it is not why the rule passed.
    expect(evaluation.usedFacts).toEqual(['minority_community'])
  })

  it('are those of every branch that passed', () => {
    const facts = { social_category: 'sc', minority_community: 'yes', has_disability: false }
    const evaluation = evaluateEligibilityRules({ any: [category, minority, disability] }, facts)
    expect(evaluation.result).toBe(true)
    expect(evaluation.usedFacts).toEqual(['social_category', 'minority_community'])
  })

  it('include everything a passing branch read, when that branch is a whole rule of its own', () => {
    const branch = { all: [{ field: 'state', operator: 'equals', value: 'jharkhand' }, minority] }
    const evaluation = evaluateEligibilityRules({ any: [category, branch] }, { social_category: 'general', state: 'jharkhand', minority_community: 'yes' })
    expect(evaluation.usedFacts).toEqual(['state', 'minority_community'])
  })

  it('are all of them when the rule fails', () => {
    const evaluation = evaluateEligibilityRules({ any: [category, minority] }, { social_category: 'general', minority_community: 'no' })
    expect(evaluation.result).toBe(false)
    expect(evaluation.usedFacts).toEqual(['social_category', 'minority_community'])
    expect(evaluation.failedFields).toEqual(['social_category', 'minority_community'])
  })

  it('leave out a branch that failed when the rule is still unknown', () => {
    // One branch failed, the other cannot be told yet: only the branch still in play says what was used or is missing.
    const undecided = { all: [{ field: 'state', operator: 'equals', value: 'jharkhand' }, minority] }
    const evaluation = evaluateEligibilityRules({ any: [category, undecided] }, { social_category: 'general', state: 'jharkhand' })
    expect(evaluation.result).toBeNull()
    expect(evaluation.usedFacts).toEqual(['state'])
    expect(evaluation.missingFacts).toEqual(['minority_community'])
    expect(evaluation.failedFields).toEqual([])
  })

  it('do not count facts missing only from a branch that already failed', () => {
    const deadBranch = { all: [{ field: 'state', operator: 'equals', value: 'bihar' }, minority] }
    const live = { field: 'has_disability', operator: 'equals', value: true }
    const evaluation = evaluateEligibilityRules({ any: [deadBranch, live] }, { state: 'jharkhand' })
    expect(evaluation.result).toBeNull()
    expect(evaluation.missingFacts).toEqual(['has_disability'])
  })

  it('leave a rule that passes without any "any" exactly as they were', () => {
    expect(used({ all: [category, minority] }, { social_category: 'sc', minority_community: 'yes' })).toEqual(['social_category', 'minority_community'])
  })

  it('keep what the bank will check, whichever branch passed', () => {
    const evaluation = evaluateEligibilityRules({ any: [category, { field: 'bank_only', operator: 'equals', value: true }] }, { social_category: 'general' }, { reviewerChecks: new Map([['bank_only', 'The bank checks this']]) })
    expect(evaluation.result).toBe(true)
    expect(evaluation.bankChecks).toEqual(['The bank checks this'])
    expect(evaluation.usedFacts).toEqual([])
  })
})
