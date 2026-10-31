import { describe, expect, it } from 'vitest'
import { stageLabel, stateLabel } from '../display'

describe('showing saved answers on older screens', () => {
  it.each([
    ['uttar_pradesh', 'Uttar Pradesh'],
    ['bihar', 'Bihar'],
    ['delhi', 'Delhi'],
    ['jammu_kashmir', 'Jammu and Kashmir'],
    ['andaman_nicobar', 'Andaman and Nicobar Islands'],
    ['dadra_nagar_haveli_daman_diu', 'Dadra and Nagar Haveli and Daman and Diu'],
  ])('shows the state %s as %s', (code, label) => {
    expect(stateLabel(code)).toBe(label)
  })

  it('leaves an old label alone', () => {
    expect(stateLabel('Maharashtra')).toBe('Maharashtra')
    expect(stateLabel('Jammu & Kashmir')).toBe('Jammu & Kashmir')
  })

  it.each([
    ['idea', 'Just an idea'],
    ['setting_up', 'Setting it up now'],
    ['running', 'Already running'],
  ])('shows the stage %s as %s', (code, label) => {
    expect(stageLabel(code)).toBe(label)
  })

  it('leaves an old stage alone', () => {
    expect(stageLabel('pre-launch')).toBe('pre-launch')
  })

  it('copes with nothing', () => {
    expect(stateLabel(null)).toBe('')
    expect(stageLabel(undefined)).toBe('')
  })
})
