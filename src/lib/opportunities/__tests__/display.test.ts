import { describe, expect, it } from 'vitest'
import { applicationView, eligibilityView, publicText, readableText } from '../display'

describe('readableText', () => {
  it('turns a code into words', () => {
    expect(readableText('self_help_group')).toBe('Self help group')
    expect(readableText('joint_liability_group')).toBe('Joint liability group')
    expect(readableText('state_or_trifed')).toBe('State or trifed')
  })

  it('gives a lone lowercase word a capital, as a name', () => {
    expect(readableText('agriculture')).toBe('Agriculture')
    expect(readableText('free')).toBe('Free')
  })

  it('turns a code inside a sentence into words, and leaves the rest of the sentence alone', () => {
    expect(readableText('Open to self_help_group and joint_liability_group members.')).toBe('Open to self help group and joint liability group members.')
    expect(readableText('(self_help_group), joint_liability_group; or none')).toBe('(self help group), joint liability group; or none')
  })

  it('keeps a code that begins with a number readable too', () => {
    expect(readableText('10050000000_initial_close_context_only')).toBe('10050000000 initial close context only')
  })

  it('leaves ordinary text, names and numbers exactly as they are', () => {
    for (const text of ['Apply at a bank branch', 'PAN card', 'Up to ₹5 lakh', 'MSME', 'Udyam-registered MSE', '2024-25', 'SC/ST', 'Rs. 2.00 Lakhs (wherever Interest Subvention is available)']) {
      expect(readableText(text), text).toBe(text)
    }
  })

  it('leaves web addresses and file names alone, though they hold underscores', () => {
    for (const text of [
      'Apply at https://udyami.bihar.gov.in/pdf/docs/bihar_laghu_udyami.pdf today',
      'See bihar_laghu_udyami.pdf for the form',
      'Write to help_desk@example.gov.in',
      'https://example.gov.in/apply?scheme_id=12',
    ]) {
      expect(readableText(text), text).toBe(text)
    }
  })

  it('does not touch the end of a sentence that holds a code', () => {
    expect(readableText('Not open to self_help_group.')).toBe('Not open to self help group.')
  })
})

describe('eligibilityView, words and not codes', () => {
  it('writes the exclusions of the Credit Guarantee Scheme as words', () => {
    const view = eligibilityView({ exclusions: ['agriculture', 'self_help_group', 'joint_liability_group'] })
    expect(view.exclusions).toEqual(['Agriculture', 'Self help group', 'Joint liability group'])
  })

  it('writes conditions and chips as words', () => {
    const view = eligibilityView({
      conditions: ['Only for self_help_group members', 'IT PAN is required before availing the credit facility'],
      entity_types: ['private_limited_company'],
    })
    expect(view.conditions).toEqual(['Only for self help group members', 'IT PAN is required before availing the credit facility'])
    expect(view.chips).toEqual([{ label: 'Business types', values: ['Private limited company'] }])
  })

  it('writes the value of a threshold as words, and still shows a number as a number', () => {
    const view = eligibilityView({ thresholds: { claims: 'once_per_year', max_project_cost: 1000000 } })
    expect(view.thresholds).toEqual([
      { label: 'Claims', value: 'Once per year' },
      { label: 'Max project cost', value: '10,00,000' },
    ])
  })

  it('hides a reviewer\'s working note even when it is written as a code', () => {
    const note = 'sunset_for_new_units_from_2020; do_not_present_as_current_benefit_without_legal_confirmation'
    const view = eligibilityView({ thresholds: { status: note, kept: 'full' }, conditions: [note, 'Aged 18 or more'], exclusions: [note] })
    expect(view.thresholds).toEqual([{ label: 'Kept', value: 'Full' }])
    expect(view.conditions).toEqual(['Aged 18 or more'])
    expect(view.exclusions).toEqual([])
  })
})

describe('what an applicant is told in words', () => {
  it('writes the fees, selection and route of how to apply as words', () => {
    expect(applicationView({ fees: 'free', selection: 'by_district_committee', route: 'Apply online' })).toEqual({
      route: 'Apply online',
      selection: 'By district committee',
      fees: 'Free',
    })
  })

  it('gives no text for a value that is empty or only a working note', () => {
    expect(publicText('   ')).toBeNull()
    expect(publicText(42)).toBeNull()
    expect(publicText('do_not_infer_an_open_call')).toBeNull()
    expect(publicText('  open_year_round ')).toBe('Open year round')
  })
})
