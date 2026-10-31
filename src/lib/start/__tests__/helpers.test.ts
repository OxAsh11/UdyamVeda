import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearDraft, emptyDraft, loadDraft, saveDraft } from '../draft'
import { formatDate, formatInr, formatRange } from '../format'
import { TEXT, t } from '../i18n'

function fakeStorage() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
    store,
  }
}

describe('the browser draft', () => {
  beforeEach(() => {
    clearDraft()
    vi.stubGlobal('localStorage', fakeStorage())
  })
  afterEach(() => vi.unstubAllGlobals())

  it('starts empty, in English', () => {
    expect(loadDraft()).toEqual(emptyDraft())
    expect(loadDraft().lang).toBe('en')
  })

  it('survives closing the tab', () => {
    saveDraft({ ...emptyDraft(), facts: { state: 'bihar' }, asked: ['q_state'], history: [['q_state']], lang: 'hi' })
    expect(loadDraft()).toMatchObject({ facts: { state: 'bihar' }, asked: ['q_state'], history: [['q_state']], lang: 'hi' })
  })

  it('still works, for this visit, when the browser blocks storage', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
      removeItem: () => { throw new Error('blocked') },
    })
    saveDraft({ ...emptyDraft(), facts: { state: 'bihar' } })
    expect(loadDraft().facts).toEqual({ state: 'bihar' })
    expect(() => clearDraft()).not.toThrow()
  })

  it('still works when there is no storage at all', () => {
    vi.stubGlobal('localStorage', undefined)
    saveDraft({ ...emptyDraft(), facts: { state: 'delhi' } })
    expect(loadDraft().facts).toEqual({ state: 'delhi' })
  })

  it.each([
    ['broken JSON', '{nope'],
    ['the wrong shape', '{"facts":"bihar","asked":7}'],
    ['a bare value', '12'],
  ])('starts fresh from %s', (_name, stored) => {
    localStorage.setItem('uv.start.draft.v1', stored)
    expect(loadDraft()).toEqual(emptyDraft())
  })

  it('ignores an unknown language', () => {
    localStorage.setItem('uv.start.draft.v1', JSON.stringify({ facts: {}, asked: [], history: [], lang: 'fr' }))
    expect(loadDraft().lang).toBe('en')
  })

  it('clears', () => {
    saveDraft({ ...emptyDraft(), facts: { state: 'bihar' } })
    clearDraft()
    expect(loadDraft()).toEqual(emptyDraft())
  })
})

describe('screen text', () => {
  const keys = Object.keys(TEXT.en)
  const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort()

  it.each(['hi', 'mr'] as const)('%s has every English line, with the same placeholders', lang => {
    expect(Object.keys(TEXT[lang]).sort()).toEqual([...keys].sort())
    for (const key of keys as (keyof typeof TEXT.en)[]) {
      expect(TEXT[lang][key].trim().length, key).toBeGreaterThan(0)
      expect(placeholders(TEXT[lang][key]), key).toEqual(placeholders(TEXT.en[key]))
    }
  })

  it('fills in placeholders', () => {
    expect(t('en', 'stepOf', { step: 2, total: 7 })).toBe('Step 2 of 7')
  })
})

describe('money and dates', () => {
  it('uses Indian grouping', () => {
    expect(formatInr(560000)).toBe('₹5,60,000')
    expect(formatInr(0)).toBe('₹0')
  })

  it('shows one figure when a range is exact', () => {
    expect(formatRange({ min: 200000, max: 200000 }, 'en')).toBe('₹2,00,000')
  })

  it('shows both ends otherwise', () => {
    expect(formatRange({ min: 125000, max: 250000 }, 'en')).toBe('₹1,25,000 – ₹2,50,000')
  })

  it('says "or more" for an open-ended range, in each language', () => {
    expect(formatRange({ min: 5000000, max: null }, 'en')).toBe('₹50,00,000 or more')
    expect(formatRange({ min: 5000000, max: null }, 'hi')).toBe('₹50,00,000 या अधिक')
    expect(formatRange({ min: 5000000, max: null }, 'mr')).toBe('₹50,00,000 किंवा अधिक')
  })

  it('formats a date for India, and survives a bad one', () => {
    expect(formatDate('2026-03-23T17:00:00+05:30', 'en')).toBe('23 Mar 2026')
    expect(formatDate(null, 'en')).toBe('')
    expect(formatDate('not a date', 'en')).toBe('')
  })
})
