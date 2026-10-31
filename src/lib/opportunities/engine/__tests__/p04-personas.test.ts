import { describe, expect, it } from 'vitest'
import { evaluateEligibilityRules } from '../../rules'
import { statusFor } from '../../recommendation-ranking'
import { reviewerChecksFrom, ruleFactsFromCanonical } from '../../fact-mapping'
import { activityPacks, mappings, p04Catalog } from './seeds'

const context = { now: new Date('2026-10-25T00:00:00Z'), activityPacks }
const reviewerChecks = reviewerChecksFrom(mappings)
const rules: Record<string, unknown> = Object.fromEntries(p04Catalog.new_records.map(record => [record.slug, record.rules]))
rules.nlm = p04Catalog.corrections[0].changes.rules

const rakesh = { activity_codes: ['poultry_broiler', 'pond_fish'], state: 'bihar', applicant_age_years: 34, education_level: 'class_12' }

const cases: Array<[string, Record<string, unknown>, string, string]> = [
  ['Rakesh: 500 broilers + ponds, Bihar, SC, 12th pass, age 34', { ...rakesh, social_category: 'sc', poultry_unit_type: 'broiler', poultry_bird_count: 500 }, 'nlm', 'not_eligible'],
  ['Hatchery owner with 1,200 parent layers', { activity_codes: ['poultry_breeding_hatchery'], poultry_unit_type: 'hatchery', poultry_bird_count: 1200 }, 'nlm', 'eligible'],
  ['Goat breeder, 520 does + 26 bucks', { activity_codes: ['goat_sheep'], small_ruminant_females: 520, small_ruminant_males: 26 }, 'nlm', 'eligible'],
  ['Rakesh on PMMSY', rakesh, 'pmmsy-beneficiary-oriented-subsidy', 'eligible'],
  ['Rakesh on KCC', rakesh, 'kisan-credit-card-animal-husbandry-fisheries', 'eligible'],
  ['Rakesh on Bihar MMUY', rakesh, 'mukhyamantri-udyami-yojana-bihar', 'eligible'],
  ['Rakesh (income ₹1–2 lakh)', { state: 'bihar', applicant_age_years: 34, annual_family_income_band: '1l_2l' }, 'bihar-laghu-udyami-yojana', 'not_eligible'],
  ['Bihar founder, income under ₹72,000', { state: 'bihar', applicant_age_years: 30, annual_family_income_band: 'up_to_72k' }, 'bihar-laghu-udyami-yojana', 'eligible'],
  ['Pooja: Pune, 32, new parlour ₹8 lakh, no earlier subsidy', { state: 'maharashtra', applicant_age_years: 32, stage: 'setting_up', received_govt_subsidy_before: false, project_cost_band: '5l_10l' }, 'cmegp-maharashtra', 'eligible'],
  ['Pooja but in Bihar', { state: 'bihar', applicant_age_years: 32, stage: 'setting_up' }, 'cmegp-maharashtra', 'not_eligible'],
  ['Imran: UP, 31, class 10, no earlier subsidy', { state: 'uttar_pradesh', applicant_age_years: 31, education_level: 'class_10', received_govt_subsidy_before: false }, 'cm-yuva-uttar-pradesh', 'eligible'],
  ['UP founder aged 45', { state: 'uttar_pradesh', applicant_age_years: 45, education_level: 'class_10' }, 'cm-yuva-uttar-pradesh', 'not_eligible'],
  ['Jharkhand ST youth, 25, income ₹2–3 lakh', { state: 'jharkhand', applicant_age_years: 25, social_category: 'st', annual_family_income_band: '2l_3l', received_govt_subsidy_before: false }, 'mukhyamantri-rojgar-srijan-yojana-jharkhand', 'eligible'],
  ['Jharkhand general-category man, no disability', { state: 'jharkhand', applicant_age_years: 25, social_category: 'general', minority_community: 'no', has_disability: false, annual_family_income_band: '2l_3l', received_govt_subsidy_before: false }, 'mukhyamantri-rojgar-srijan-yojana-jharkhand', 'not_eligible'],
]

describe('P0.4 persona checks', () => {
  it.each(cases)('%s', (_who, facts, slug, expected) => {
    const mapped = ruleFactsFromCanonical(facts, mappings, context)
    const evaluation = evaluateEligibilityRules(rules[slug], mapped, { reviewerChecks })
    expect(statusFor(evaluation.result, evaluation.missingFacts, evaluation.blockers, true)).toBe(expected)
  })
})
