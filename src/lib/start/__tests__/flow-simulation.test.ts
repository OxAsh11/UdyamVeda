import { describe, expect, it } from 'vitest'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { evaluateEligibilityRules } from '@/lib/opportunities/rules'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { MAX_REFINE_QUESTIONS, nextStep } from '../next-screen'
import { seedBundle } from './seed-bundle'

const catalog = snapshotCatalog()
const bundle = seedBundle()
const now = new Date('2026-10-31T00:00:00Z')

type Answers = Record<string, unknown>

// Plays a founder through the flow. A question they have no answer for is
// answered "don't know", which is what a real founder would tap.
function play(answers: Answers) {
  let raw: Answers = {}
  const asked: string[] = []
  const screens: { stage: number | null; ids: string[] }[] = []
  let firstScreens = 0
  let refineQuestions = 0
  let finished = false

  for (let turn = 0; turn < 80; turn += 1) {
    const { facts, nonAnswers } = cleanFacts(raw, catalog.definitions, catalog.activityIds)
    const step = nextStep({ facts, nonAnswers, asked }, bundle, catalog, now)
    if (step.phase === 'done') {
      finished = true
      break
    }
    if (step.phase === 'first') firstScreens += 1
    else refineQuestions += step.questions.length
    screens.push({ stage: step.stage, ids: step.questions.map(question => question.id) })
    // Like the page: a follow-up appears on the screen once its trigger is answered.
    for (const question of step.questions) {
      const current = cleanFacts(raw, catalog.definitions, catalog.activityIds).facts
      if (question.dependsOn && evaluateEligibilityRules(question.dependsOn, current).result !== true) continue
      asked.push(question.id)
      for (const fact of question.facts) raw = { ...raw, [fact.key]: fact.key in answers ? answers[fact.key] : 'dont_know' }
    }
  }
  return { screens, firstScreens, refineQuestions, finished, asked }
}

const personas: Record<string, Answers> = {
  'Sunita (home pickles, Nagpur)': { activity_codes: ['pickles_chutney'], state: 'maharashtra', district: 'Nagpur', area_type: 'urban', stage: 'setting_up', project_cost_band: '2l_5l', annual_turnover_band: '5l_20l', workers_count: 2, own_contribution_band: '25k_1l', needs_loan: true, premises_type: 'home', premises_owner: 'family', entity_type: 'not_registered', has_pan: true, gender: 'woman', applicant_age_years: 40 },
  'Rakesh (poultry + fish, Gaya)': { activity_codes: ['poultry_broiler', 'pond_fish'], state: 'bihar', district: 'Gaya', area_type: 'rural', stage: 'running', operating_since: '2022-04-01', project_cost_band: '5l_10l', annual_turnover_band: '5l_20l', workers_count: 3, own_contribution_band: '25k_1l', needs_loan: true, premises_type: 'pond_water', premises_owner: 'self', land_or_pond_status: 'owned', entity_type: 'not_registered', poultry_unit_type: 'broiler', poultry_bird_count: 500, social_category: 'sc', applicant_age_years: 34 },
  'Ganesh (cold store, Latur)': { activity_codes: ['cold_storage'], state: 'maharashtra', district: 'Latur', area_type: 'rural', stage: 'idea', project_cost_band: '1cr_2cr', annual_turnover_band: '40l_1_5cr', workers_count: 8, own_contribution_band: 'above_10l', needs_loan: true, premises_type: 'farm_land', premises_owner: 'self', land_or_pond_status: 'owned', entity_type: 'fpo' },
  'Imran (woodwork, Saharanpur)': { activity_codes: ['carpentry_furniture'], state: 'uttar_pradesh', district: 'Saharanpur', area_type: 'urban', stage: 'setting_up', project_cost_band: '2l_5l', annual_turnover_band: 'up_to_5l', workers_count: 2, own_contribution_band: '25k_1l', needs_loan: true, premises_type: 'rented_shop', premises_owner: 'landlord', entity_type: 'proprietorship', artisan_trade: 'carpenter', applicant_age_years: 31, matches_district_odop: true },
  'Pooja (parlour, Pune)': { activity_codes: ['beauty_parlour_salon'], state: 'maharashtra', district: 'Pune', area_type: 'urban', stage: 'setting_up', project_cost_band: '5l_10l', annual_turnover_band: '5l_20l', workers_count: 3, own_contribution_band: '25k_1l', needs_loan: true, premises_type: 'rented_shop', premises_owner: 'landlord', entity_type: 'proprietorship', gender: 'woman', applicant_age_years: 32 },
  'fisheries founder': { activity_codes: ['pond_fish'], state: 'jharkhand', district: 'Ranchi', area_type: 'rural', stage: 'setting_up', project_cost_band: '5l_10l', annual_turnover_band: '5l_20l', workers_count: 2, own_contribution_band: '25k_1l', needs_loan: true, premises_type: 'pond_water', premises_owner: 'self', land_or_pond_status: 'registered_lease', entity_type: 'not_registered', social_category: 'st', gender: 'woman', applicant_age_years: 29 },
  'poultry founder': { activity_codes: ['poultry_breeding_hatchery'], state: 'uttar_pradesh', district: 'Lucknow', area_type: 'rural', stage: 'setting_up', project_cost_band: '25l_50l', annual_turnover_band: '20l_40l', workers_count: 5, own_contribution_band: '5l_10l', needs_loan: true, premises_type: 'farm_land', premises_owner: 'self', land_or_pond_status: 'owned', entity_type: 'proprietorship', poultry_unit_type: 'hatchery', poultry_bird_count: 1200 },
  'tech founder': { activity_codes: ['software_it_services'], state: 'delhi', district: 'New Delhi', area_type: 'urban', stage: 'running', operating_since: '2024-01-15', project_cost_band: '10l_25l', annual_turnover_band: '5l_20l', workers_count: 4, own_contribution_band: '2_5l_5l', needs_loan: false, premises_type: 'rented_shop', premises_owner: 'landlord', entity_type: 'private_limited', dpiit_recognized: false },
}

describe.each(Object.entries(personas))('%s', (_name, answers) => {
  const session = play(answers)

  it('reaches a first result within 8 screens (FR-03)', () => {
    expect(session.firstScreens).toBeLessThanOrEqual(8)
    expect(session.firstScreens).toBeGreaterThan(0)
  })

  it('never repeats a question (FR-02)', () => {
    expect(new Set(session.asked).size).toBe(session.asked.length)
  })

  it('finishes, within the limit of further questions (PRD §7)', () => {
    expect(session.finished).toBe(true)
    expect(session.refineQuestions).toBeLessThanOrEqual(MAX_REFINE_QUESTIONS)
  })

  it('shows the first-result screens in PRD order', () => {
    const stages = session.screens.slice(0, session.firstScreens).map(screen => screen.stage)
    expect(stages).toEqual([...stages].sort((left, right) => (left ?? 0) - (right ?? 0)))
    expect(stages.slice(0, 2)).toEqual([1, 2])
  })
})

describe('a merged flow for two activities', () => {
  const session = play(personas['Rakesh (poultry + fish, Gaya)'])

  it('asks the land question once, though both activities need it', () => {
    expect(session.asked.filter(id => id === 'q_land_pond')).toHaveLength(1)
  })
})

describe('asking only what fits the founder', () => {
  const tailor = play({ activity_codes: ['tailoring_garments'], state: 'bihar', stage: 'setting_up' })

  it('never asks a tailor about goats, birds, ponds or FSSAI', () => {
    for (const id of ['q_goat_females', 'q_poultry_birds', 'q_land_pond', 'q_fssai', 'q_sows']) expect(tailor.asked).not.toContain(id)
  })

  it('asks the date a business started only if it is running', () => {
    expect(tailor.asked).not.toContain('q_operating_since')
    expect(play({ activity_codes: ['tailoring_garments'], stage: 'running' }).asked).toContain('q_operating_since')
  })

  it('asks a food founder about FSSAI', () => {
    expect(play({ activity_codes: ['pickles_chutney'] }).asked).toContain('q_fssai')
  })

  it('asks the ODOP question only in UP', () => {
    expect(tailor.asked).not.toContain('q_matches_odop')
  })

  it('hides a checklist item meant for another pack', () => {
    const { facts, nonAnswers } = cleanFacts({ activity_codes: ['tailoring_garments'], state: 'bihar', district: 'x', area_type: 'rural', stage: 'idea', project_cost_band: '2l_5l', annual_turnover_band: 'up_to_5l', workers_count: 1, own_contribution_band: 'none', needs_loan: true, premises_type: 'home', premises_owner: 'self' }, catalog.definitions, catalog.activityIds)
    const asked = ['q_activity', 'q_state', 'q_district', 'q_area', 'q_stage', 'q_project_cost', 'q_turnover', 'q_workers', 'q_own_money', 'q_needs_loan', 'q_premises', 'q_premises_owner']
    const step = nextStep({ facts, nonAnswers, asked }, bundle, catalog, now)
    const checklist = step.questions.find(question => question.id === 'q_have')!
    const keys = checklist.facts.map(fact => fact.key)
    expect(keys).toContain('has_pan')
    expect(keys).not.toContain('dpiit_recognized')
  })
})

describe('follow-up questions', () => {
  const stageThree = () => {
    const { facts, nonAnswers } = cleanFacts({ activity_codes: ['pond_fish'], state: 'bihar', district: 'Gaya', area_type: 'rural' }, catalog.definitions, catalog.activityIds)
    return nextStep({ facts, nonAnswers, asked: ['q_activity', 'q_state', 'q_district', 'q_area'] }, bundle, catalog, now)
  }

  it('come on the same screen as the answer that triggers them', () => {
    const step = stageThree()
    expect(step.stage).toBe(3)
    expect(step.questions.map(question => question.id)).toEqual(['q_stage', 'q_operating_since'])
    expect(step.questions[1].dependsOn).toBeTruthy()
  })

  it('are skipped later if their trigger never fired', () => {
    const { facts, nonAnswers } = cleanFacts({ activity_codes: ['pond_fish'], stage: 'idea' }, catalog.definitions, catalog.activityIds)
    const step = nextStep({ facts, nonAnswers, asked: ['q_activity', 'q_state', 'q_district', 'q_area', 'q_stage'] }, bundle, catalog, now)
    expect(step.stage).toBe(4)
  })

  it('are still asked if their trigger was answered on an earlier visit', () => {
    const { facts, nonAnswers } = cleanFacts({ activity_codes: ['pond_fish'], stage: 'running' }, catalog.definitions, catalog.activityIds)
    const step = nextStep({ facts, nonAnswers, asked: ['q_activity', 'q_state', 'q_district', 'q_area', 'q_stage'] }, bundle, catalog, now)
    expect(step.questions.map(question => question.id)).toEqual(['q_operating_since'])
  })
})

describe('a founder who answers nothing', () => {
  it('still reaches the end, with nothing repeated', () => {
    const session = play({})
    expect(session.finished).toBe(true)
    expect(new Set(session.asked).size).toBe(session.asked.length)
  })
})

describe('choosing the next refinement question', () => {
  const first = { activity_codes: ['beauty_parlour_salon'], state: 'maharashtra', area_type: 'urban', stage: 'setting_up', project_cost_band: '5l_10l' }
  const firstIds = bundle.questions.filter(question => question.stage <= 7).map(question => question.id)

  it('asks the question that settles the most schemes', () => {
    const { facts, nonAnswers } = cleanFacts(first, catalog.definitions, catalog.activityIds)
    const step = nextStep({ facts, nonAnswers, asked: firstIds }, bundle, catalog, now)
    expect(step.phase).toBe('refine')
    expect(step.questions).toHaveLength(1)
    expect(step.decides).toBeGreaterThan(0)

    for (const question of bundle.questions.filter(item => item.stage >= 8 && item.id !== step.questions[0].id)) {
      const other = nextStep({ facts, nonAnswers, asked: [...firstIds, ...bundle.questions.filter(item => item.stage >= 8 && item.id !== question.id).map(item => item.id)] }, bundle, catalog, now)
      if (other.phase === 'refine') expect(other.decides).toBeLessThanOrEqual(step.decides)
    }
  })

  it('asks nothing that would settle nothing', () => {
    const session = play(personas['Pooja (parlour, Pune)'])
    expect(session.asked).not.toContain('q_exports')
  })

  it('stops after the limit, even with questions left', () => {
    const { facts, nonAnswers } = cleanFacts(first, catalog.definitions, catalog.activityIds)
    const refine = bundle.questions.filter(question => question.stage >= 8).slice(0, MAX_REFINE_QUESTIONS).map(question => question.id)
    expect(nextStep({ facts, nonAnswers, asked: [...firstIds, ...refine] }, bundle, catalog, now).phase).toBe('done')
  })

  it('says how many are left', () => {
    const { facts, nonAnswers } = cleanFacts(first, catalog.definitions, catalog.activityIds)
    expect(nextStep({ facts, nonAnswers, asked: firstIds }, bundle, catalog, now).refineLeft).toBe(MAX_REFINE_QUESTIONS)
  })
})
