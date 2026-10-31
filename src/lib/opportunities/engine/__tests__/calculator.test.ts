import { describe, expect, it } from 'vitest'
import { benefitRateFromRow, computeBenefit, pickRate, type BenefitRateRow } from '../calculator'
import type { BenefitRate } from '../types'
import { activityPacks, seed } from './seeds'

const context = { now: new Date('2026-10-31T00:00:00Z'), activityPacks }
const rows = seed<(BenefitRateRow & { slug: string })[]>('benefit-rates.json')
const ratesFor = (slug: string): BenefitRate[] => rows.filter(row => row.slug === slug).map(benefitRateFromRow)

const cmegp = ratesFor('cmegp-maharashtra')
const LAKH = 100_000
const exact = (value: number) => ({ min: value, max: value })

function rate(overrides: Partial<BenefitRate>): BenefitRate {
  return {
    priority: 10,
    appliesWhen: null,
    area: 'any',
    projectTypes: ['any'],
    ownPct: 0,
    includesLoan: true,
    provisional: false,
    subsidyPct: 0,
    subsidyCapInr: null,
    subsidyFloorInr: null,
    loanCapInr: null,
    projectMinInr: null,
    projectCapInr: null,
    interestRatePct: null,
    interestSubventionPct: null,
    labelEn: 'Test rate',
    sourceUrl: 'https://example.gov.in',
    ...overrides,
  }
}

const pooja = { activity_codes: ['beauty_parlour_salon'], gender: 'woman', area_type: 'urban' }

describe('the PRD worked example', () => {
  it('CMEGP, woman, urban, ₹8 lakh: own 40,000, subsidy 2,00,000, loan 5,60,000', () => {
    const lines = computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH }, 'active', context)!
    expect(lines.projectCost).toEqual(exact(8 * LAKH))
    expect(lines.own).toEqual(exact(40_000))
    expect(lines.straddlesCeiling).toBe(false)
    expect(lines.subsidy).toEqual(exact(2 * LAKH))
    expect(lines.loan).toEqual(exact(5.6 * LAKH))
    expect(lines.uncovered).toEqual(exact(0))
    expect(lines.aboveCeiling).toBe(false)
    expect(lines.ifRenewed).toBe(false)
  })

  it('a band gives a range, not a guess', () => {
    const lines = computeBenefit(cmegp, { ...pooja, project_cost_band: '5l_10l' }, 'active', context)!
    expect(lines.subsidy).toEqual({ min: 1.25 * LAKH, max: 2.5 * LAKH })
    expect(lines.own).toEqual({ min: 25_000, max: 50_000 })
    expect(lines.loan).toEqual({ min: 3.5 * LAKH, max: 7 * LAKH })
  })
})

describe('choosing the rate', () => {
  it('uses the general rate when gender is unanswered, and says it could be higher', () => {
    const lines = computeBenefit(cmegp, { activity_codes: ['beauty_parlour_salon'], area_type: 'urban', project_cost_exact_inr: 8 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(1.2 * LAKH))
    expect(lines.own).toEqual(exact(80_000))
    expect(lines.betterIfAnswered).toEqual(expect.arrayContaining(['gender']))
  })

  it('does not suggest more answers when the founder is already on the best rate', () => {
    const lines = computeBenefit(cmegp, { activity_codes: ['pickles_chutney'], gender: 'woman', area_type: 'rural', project_cost_exact_inr: 8 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(2.8 * LAKH))
    expect(lines.betterIfAnswered).toEqual([])
  })

  it('uses the lowest rate until area and activity are known', () => {
    const lines = computeBenefit(cmegp, { gender: 'woman', project_cost_exact_inr: 8 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(1.2 * LAKH))
    expect(lines.betterIfAnswered).toEqual(expect.arrayContaining(['area_type', 'activity_codes']))
  })

  it('a rural general founder never sees the urban rate', () => {
    const picked = pickRate(cmegp, { activity_codes: ['beauty_parlour_salon'], gender: 'man', social_category: 'general', ex_serviceman: false, has_disability: false, area_type: 'rural' }, 8 * LAKH, context)!
    expect(picked.rate.subsidyPct).toBe(25)
    expect(picked.betterIfAnswered).toEqual([])
  })

  it('picks a slab by project cost: UP ODOP', () => {
    const odop = ratesFor('odop-margin-money-uttar-pradesh')
    const subsidyAt = (cost: number) => computeBenefit(odop, { project_cost_exact_inr: cost }, 'active', context)!.subsidy
    expect(subsidyAt(20 * LAKH)).toEqual(exact(5 * LAKH))
    expect(subsidyAt(30 * LAKH)).toEqual(exact(6.25 * LAKH))
    expect(subsidyAt(40 * LAKH)).toEqual(exact(8 * LAKH))
    expect(subsidyAt(100 * LAKH)).toEqual(exact(10 * LAKH))
    expect(subsidyAt(120 * LAKH)).toEqual(exact(12 * LAKH))
    expect(subsidyAt(300 * LAKH)).toEqual(exact(20 * LAKH))
  })

  it('applies Jharkhand MRSY: 10% own share, subsidy on the loan, at 6%', () => {
    const lines = computeBenefit(ratesFor('mukhyamantri-rojgar-srijan-yojana-jharkhand'), { project_cost_exact_inr: 10 * LAKH }, 'active', context)!
    expect(lines.own).toEqual(exact(1 * LAKH))
    expect(lines.subsidy).toEqual(exact(3.6 * LAKH))
    expect(lines.loan).toEqual(exact(5.4 * LAKH))
    expect(lines.interestRatePct).toBe(6)
  })

  it('picks the NLM cap by activity and qualifying herd', () => {
    const nlm = ratesFor('national-livestock-mission-entrepreneurship-development')
    const subsidyFor = (facts: Record<string, unknown>) => computeBenefit(nlm, { ...facts, project_cost_exact_inr: 120 * LAKH }, 'active', context)!.subsidy
    expect(subsidyFor({ activity_codes: ['goat_sheep'], small_ruminant_females: 500, small_ruminant_males: 25 })).toEqual(exact(50 * LAKH))
    expect(subsidyFor({ activity_codes: ['piggery'], sow_count: 100, boar_count: 25 })).toEqual(exact(30 * LAKH))
    expect(subsidyFor({ activity_codes: ['poultry_breeding_hatchery'], poultry_bird_count: 1000 })).toEqual(exact(25 * LAKH))
  })

  it('does not give a hatchery the goat cap because it also keeps 40 goats', () => {
    const nlm = ratesFor('national-livestock-mission-entrepreneurship-development')
    const lines = computeBenefit(nlm, { activity_codes: ['poultry_breeding_hatchery', 'goat_sheep'], poultry_bird_count: 1200, small_ruminant_females: 40, small_ruminant_males: 5, project_cost_exact_inr: 80 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(25 * LAKH))
  })

  it('shows no NLM amount for an activity the source gives no amount for', () => {
    const nlm = ratesFor('national-livestock-mission-entrepreneurship-development')
    expect(computeBenefit(nlm, { activity_codes: ['animal_feed'], project_cost_exact_inr: 80 * LAKH }, 'active', context)).toBeNull()
  })

  it('shows no CMEGP amount for a trader, because the lowest-rate row is only for while the activity is unknown', () => {
    expect(computeBenefit(cmegp, { activity_codes: ['kirana_store'], area_type: 'urban', project_cost_exact_inr: 8 * LAKH }, 'active', context)).toBeNull()
  })

  it('applies CM-YUVA: own share by category, subsidy capped at ₹50,000, loan capped at ₹5 lakh', () => {
    const yuva = ratesFor('cm-yuva-uttar-pradesh')
    const at = (facts: Record<string, unknown>, cost: number) => computeBenefit(yuva, { ...facts, project_cost_exact_inr: cost }, 'active', context)!
    const general = at({ social_category: 'general', has_disability: false }, 4 * LAKH)
    expect(general.own).toEqual(exact(60_000))
    expect(general.subsidy).toEqual(exact(40_000))
    expect(general.loan).toEqual(exact(3 * LAKH))
    expect(at({ social_category: 'obc', has_disability: false }, 4 * LAKH).own).toEqual(exact(50_000))
    expect(at({ social_category: 'sc' }, 4 * LAKH).own).toEqual(exact(40_000))
    const large = at({ social_category: 'general', has_disability: false }, 200 * LAKH)
    expect(large.subsidy).toEqual(exact(50_000))
    expect(large.loan).toEqual(exact(5 * LAKH))
  })

  it('caps the PMMSY subsidy for women at ₹1.5 crore', () => {
    const pmmsy = ratesFor('pmmsy-beneficiary-oriented-subsidy')
    expect(computeBenefit(pmmsy, { gender: 'woman', project_cost_exact_inr: 500 * LAKH }, 'pending_renewal', context)!.subsidy).toEqual(exact(150 * LAKH))
  })

  it('gives PMMSY 60% to women and 40% to others', () => {
    const pmmsy = ratesFor('pmmsy-beneficiary-oriented-subsidy')
    expect(computeBenefit(pmmsy, { gender: 'woman', project_cost_exact_inr: 10 * LAKH }, 'pending_renewal', context)!.subsidy).toEqual(exact(6 * LAKH))
    expect(computeBenefit(pmmsy, { gender: 'man', social_category: 'general', project_cost_exact_inr: 10 * LAKH }, 'pending_renewal', context)!.subsidy).toEqual(exact(4 * LAKH))
  })
})

describe('never inventing a split the source does not state', () => {
  it('shows own share as not stated, and the balance as still to arrange: UP ODOP', () => {
    const lines = computeBenefit(ratesFor('odop-margin-money-uttar-pradesh'), { project_cost_exact_inr: 40 * LAKH }, 'active', context)!
    expect(lines.own).toBeNull()
    expect(lines.loan).toBeNull()
    expect(lines.subsidy).toEqual(exact(8 * LAKH))
    expect(lines.uncovered).toEqual(exact(32 * LAKH))
  })

  it('claims no loan on a grant-only scheme: Bihar Laghu', () => {
    const lines = computeBenefit(ratesFor('bihar-laghu-udyami-yojana'), { project_cost_exact_inr: 5 * LAKH }, 'paused', context)!
    expect(lines.loan).toBeNull()
    expect(lines.subsidy).toEqual(exact(2 * LAKH))
    expect(lines.uncovered).toEqual(exact(3 * LAKH))
  })

  it('still shows a stated loan when the own share is not stated: KCC', () => {
    const lines = computeBenefit(ratesFor('kisan-credit-card-animal-husbandry-fisheries'), { project_cost_exact_inr: 1 * LAKH }, 'active', context)!
    expect(lines.own).toBeNull()
    expect(lines.loan).toEqual(exact(1 * LAKH))
  })

  it('cannot flag too little own money when the own share is not stated', () => {
    const lines = computeBenefit(ratesFor('odop-margin-money-uttar-pradesh'), { project_cost_exact_inr: 40 * LAKH, own_contribution_band: 'none' }, 'active', context)!
    expect(lines.ownShortfall).toBe(false)
  })

  it('open-ended cost with no stated own share is still valid JSON', () => {
    const lines = computeBenefit(ratesFor('national-livestock-mission-entrepreneurship-development'), { activity_codes: ['goat_sheep'], small_ruminant_females: 500, small_ruminant_males: 25, project_cost_band: 'above_2cr' }, 'active', context)!
    expect(lines.uncovered.max).toBeNull()
    expect(JSON.parse(JSON.stringify(lines))).toEqual(lines)
  })
})

describe('limits', () => {
  it('applies the subsidy cap', () => {
    const lines = computeBenefit([rate({ subsidyPct: 50, subsidyCapInr: 25 * LAKH })], { project_cost_exact_inr: 80 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(25 * LAKH))
  })

  it('caps the loan and reports the gap: Bihar MMUY on ₹12 lakh', () => {
    const lines = computeBenefit(ratesFor('mukhyamantri-udyami-yojana-bihar'), { gender: 'woman', project_cost_exact_inr: 12 * LAKH }, 'paused', context)!
    expect(lines.subsidy).toEqual(exact(5 * LAKH))
    expect(lines.loan).toEqual(exact(5 * LAKH))
    expect(lines.uncovered).toEqual(exact(2 * LAKH))
    expect(lines.interestRatePct).toBe(0)
  })

  it('shows credit-only schemes with their interest help: KCC', () => {
    const lines = computeBenefit(ratesFor('kisan-credit-card-animal-husbandry-fisheries'), { project_cost_exact_inr: 3 * LAKH }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(0))
    expect(lines.loan).toEqual(exact(2 * LAKH))
    expect(lines.uncovered).toEqual(exact(1 * LAKH))
    expect(lines.interestRatePct).toBe(7)
    expect(lines.interestSubventionPct).toBe(3)
  })

  it('shows no amounts above the scheme ceiling', () => {
    const lines = computeBenefit([rate({ subsidyPct: 25, projectCapInr: 50 * LAKH })], { project_cost_exact_inr: 60 * LAKH }, 'active', context)!
    expect(lines.aboveCeiling).toBe(true)
    expect(lines.ceilingInr).toBe(50 * LAKH)
    expect(lines.subsidy).toEqual(exact(0))
    expect(lines.loan).toEqual(exact(0))
    expect(lines.own).toEqual(exact(0))
  })

  it('clips a band that crosses the ceiling', () => {
    const lines = computeBenefit([rate({ subsidyPct: 25, projectCapInr: 50 * LAKH })], { project_cost_band: '50l_1cr' }, 'active', context)!
    expect(lines.aboveCeiling).toBe(false)
    expect(lines.straddlesCeiling).toBe(true)
    expect(lines.ceilingInr).toBe(50 * LAKH)
    expect(lines.projectCost.max).toBe(50 * LAKH)
    expect(lines.subsidy.max).toBe(12.5 * LAKH)
  })

  it('an open-ended cost has no upper figure and survives JSON', () => {
    const lines = computeBenefit([rate({ ownPct: 10, subsidyPct: 25 })], { project_cost_band: 'above_2cr' }, 'active', context)!
    expect(lines.projectCost).toEqual({ min: 200 * LAKH, max: null })
    expect(lines.subsidy).toEqual({ min: 50 * LAKH, max: null })
    expect(lines.own?.max).toBeNull()
    expect(JSON.parse(JSON.stringify(lines))).toEqual(lines)
  })

  it('an open-ended cost still respects a subsidy cap and a loan cap', () => {
    const lines = computeBenefit([rate({ subsidyPct: 25, subsidyCapInr: 20 * LAKH, loanCapInr: 100 * LAKH })], { project_cost_band: 'above_2cr' }, 'active', context)!
    expect(lines.subsidy).toEqual(exact(20 * LAKH))
    expect(lines.loan).toEqual(exact(100 * LAKH))
    expect(lines.uncovered).toEqual({ min: 80 * LAKH, max: null })
    expect(JSON.parse(JSON.stringify(lines))).toEqual(lines)
  })

  it('never produces NaN when a share is zero on an open-ended cost', () => {
    const lines = computeBenefit([rate({ subsidyPct: 25 })], { project_cost_band: 'above_2cr' }, 'active', context)!
    expect(lines.own).toEqual(exact(0))
    expect(lines.loan).toEqual({ min: 150 * LAKH, max: null })
  })
})

describe('flags', () => {
  it('flags too little own money', () => {
    const lines = computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH, own_contribution_band: 'up_to_25k' }, 'active', context)!
    expect(lines.ownShortfall).toBe(true)
  })

  it('does not flag enough own money, or an unanswered band', () => {
    expect(computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH, own_contribution_band: '25k_1l' }, 'active', context)!.ownShortfall).toBe(false)
    expect(computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH }, 'active', context)!.ownShortfall).toBe(false)
  })

  it.each(['pending_renewal', 'paused', 'closed'])('marks %s amounts as "if renewed"', status => {
    expect(computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH }, status, context)!.ifRenewed).toBe(true)
  })
})

describe('nothing to show', () => {
  it('returns null with no rates', () => {
    expect(computeBenefit([], { project_cost_exact_inr: 8 * LAKH }, 'active', context)).toBeNull()
  })

  it('returns null with no project cost', () => {
    expect(computeBenefit(cmegp, pooja, 'active', context)).toBeNull()
  })

  it('returns null when no rate applies to this founder', () => {
    const onlyRural = [rate({ subsidyPct: 25, area: 'rural' })]
    expect(computeBenefit(onlyRural, { area_type: 'urban', project_cost_exact_inr: 8 * LAKH }, 'active', context)).toBeNull()
  })
})

describe('honesty', () => {
  it('has no total or sum field', () => {
    const lines = computeBenefit(cmegp, { ...pooja, project_cost_exact_inr: 8 * LAKH }, 'active', context)!
    for (const key of Object.keys(lines)) expect(key).not.toMatch(/total|sum/i)
  })
})
