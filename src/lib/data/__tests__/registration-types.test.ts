import { describe, expect, it } from 'vitest'
import { recommendRegistrationType } from '../registration-types'

describe('recommendRegistrationType', () => {
  it.each(['pre-launch', 'just-started', 'idea', 'setting_up'])('does not push a small solo founder at stage "%s" into a company', stage => {
    expect(recommendRegistrationType(stage, '₹1–5 lakh', 'general', 'Manufacturing').primary).toBe('sole-proprietor')
  })
})
