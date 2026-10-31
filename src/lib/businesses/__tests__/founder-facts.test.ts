import { describe, expect, it } from 'vitest'
import { founderFactsFromRows } from '../founder-facts'

const row = (fact_key: string, value: unknown, answer_state?: string) => ({ fact_key, fact_value: { value }, answer_state })

describe('founderFactsFromRows', () => {
  it('reads answers saved by the new flow as they are', () => {
    expect(founderFactsFromRows([row('state', 'uttar_pradesh'), row('applicant_age_years', 31), row('udyam_registered', false), row('activity_codes', ['pond_fish'])]))
      .toEqual({ state: 'uttar_pradesh', applicant_age_years: 31, udyam_registered: false, activity_codes: ['pond_fish'] })
  })

  it('turns saved non-answers back into what the flow sends', () => {
    expect(founderFactsFromRows([
      { fact_key: 'social_category', fact_value: {}, answer_state: 'declined' },
      { fact_key: 'udyam_registered', fact_value: {}, answer_state: 'dont_know' },
    ])).toEqual({ social_category: 'prefer_not', udyam_registered: 'dont_know' })
  })

  describe('old-style accounts', () => {
    it.each([
      ['Maharashtra', 'maharashtra'],
      ['Delhi', 'delhi'],
      ['Uttar Pradesh', 'uttar_pradesh'],
      ['Jammu & Kashmir', 'jammu_kashmir'],
      ['Andaman & Nicobar', 'andaman_nicobar'],
      ['Dadra & Nagar Haveli', 'dadra_nagar_haveli_daman_diu'],
      ['Daman & Diu', 'dadra_nagar_haveli_daman_diu'],
    ])('reads the state "%s"', (label, code) => {
      expect(founderFactsFromRows([row('state', label)]).state).toBe(code)
    })

    it.each([
      ['pre-launch', 'idea'],
      ['just-started', 'running'],
      ['1-2-years', 'running'],
      ['2-plus', 'running'],
    ])('reads the stage "%s"', (label, stage) => {
      expect(founderFactsFromRows([row('stage', label)]).stage).toBe(stage)
    })

    it('reads what the old founder type can tell us', () => {
      expect(founderFactsFromRows([row('founder_type', 'women')])).toEqual({ gender: 'woman' })
      expect(founderFactsFromRows([row('founder_type', 'ex-serviceman')])).toEqual({ ex_serviceman: true })
    })

    it('does not guess from an answer that could mean two things', () => {
      expect(founderFactsFromRows([row('founder_type', 'sc-st')])).toEqual({})
      expect(founderFactsFromRows([row('founder_type', 'general')])).toEqual({})
    })

    it('ignores old labels that mean nothing to the rules', () => {
      expect(founderFactsFromRows([row('sector', 'Agriculture & Food'), row('initial_capital', '₹1–5 lakh'), row('business_name', 'Sunrise')])).toEqual({})
    })

    it('lets a new answer win over an old one', () => {
      expect(founderFactsFromRows([row('founder_type', 'women'), row('gender', 'man')]).gender).toBe('man')
      expect(founderFactsFromRows([row('gender', 'man'), row('founder_type', 'women')]).gender).toBe('man')
    })

    it('leaves a value that is already a code alone', () => {
      expect(founderFactsFromRows([row('state', 'bihar'), row('stage', 'setting_up')])).toEqual({ state: 'bihar', stage: 'setting_up' })
    })
  })

  it('lets a value saved later in Settings win over an earlier "don\'t know"', () => {
    expect(founderFactsFromRows([{ fact_key: 'state', fact_value: { value: 'Bihar' }, answer_state: 'dont_know' }])).toEqual({ state: 'bihar' })
  })

  it.each([
    ['Just an idea', 'idea'],
    ['Setting it up now', 'setting_up'],
    ['Already running', 'running'],
  ])('reads back the stage shown in Settings: %s', (label, code) => {
    expect(founderFactsFromRows([row('stage', label)]).stage).toBe(code)
  })

  it.each([
    ['Jammu and Kashmir', 'jammu_kashmir'],
    ['Andaman and Nicobar Islands', 'andaman_nicobar'],
    ['Dadra and Nagar Haveli and Daman and Diu', 'dadra_nagar_haveli_daman_diu'],
  ])('reads back the state shown in Settings: %s', (label, code) => {
    expect(founderFactsFromRows([row('state', label)]).state).toBe(code)
  })

  it('copes with a bare value, or a missing one', () => {
    expect(founderFactsFromRows([{ fact_key: 'state', fact_value: 'bihar' }])).toEqual({ state: 'bihar' })
    expect(founderFactsFromRows([{ fact_key: 'state', fact_value: {} }, { fact_key: 'stage', fact_value: null }])).toEqual({})
  })
})
