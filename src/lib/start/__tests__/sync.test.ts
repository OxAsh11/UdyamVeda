import { describe, expect, it } from 'vitest'
import type { FounderState } from '../api'
import { emptyDraft, type Draft } from '../draft'
import { resolveDraft, shouldSaveDraft } from '../sync'

const draftWith = (overrides: Partial<Draft> = {}): Draft => ({ ...emptyDraft(), facts: { state: 'bihar' }, asked: ['q_state'], ...overrides })
const anonymous: FounderState = { status: 'anonymous', userId: null, facts: {}, asked: [], activityItems: [] }
const unknown: FounderState = { status: 'unknown', userId: null, facts: {}, asked: [], activityItems: [] }
const signedIn = (facts: Record<string, unknown> = {}): FounderState => ({ status: 'signed_in', userId: 'user-b', facts, asked: Object.keys(facts).map(key => `q_${key}`), activityItems: [] })

describe('resolveDraft', () => {
  describe('someone who is not signed in', () => {
    it('keeps working from their anonymous draft, without saving it', () => {
      expect(resolveDraft(draftWith(), anonymous)).toEqual({ kind: 'use_draft', save: false })
    })

    it('starts the questions when there is nothing yet', () => {
      expect(resolveDraft(emptyDraft(), anonymous)).toEqual({ kind: 'start' })
    })

    it('forgets a draft that belonged to an account, so the next person cannot see it', () => {
      expect(resolveDraft(draftWith({ ownerId: 'user-a' }), anonymous)).toEqual({ kind: 'forget' })
    })
  })

  describe('when we cannot tell who this is', () => {
    it('keeps the draft on screen and changes nothing', () => {
      expect(resolveDraft(draftWith({ ownerId: 'user-a' }), unknown)).toEqual({ kind: 'use_draft', save: false })
    })

    it('starts the questions when there is nothing yet', () => {
      expect(resolveDraft(emptyDraft(), unknown)).toEqual({ kind: 'start' })
    })
  })

  describe('a signed-in founder', () => {
    it('saves their own draft', () => {
      expect(resolveDraft(draftWith({ ownerId: 'user-b' }), signedIn({ state: 'delhi' }))).toEqual({ kind: 'use_draft', save: true })
    })

    it('saves an anonymous draft into an account with nothing saved: this is "Save my results"', () => {
      expect(resolveDraft(draftWith(), signedIn())).toEqual({ kind: 'use_draft', save: true })
    })

    it('never overwrites saved answers with an anonymous draft: it asks', () => {
      expect(resolveDraft(draftWith(), signedIn({ state: 'delhi' }))).toEqual({ kind: 'ask' })
    })

    it('never takes a draft belonging to another account, whatever this account holds', () => {
      expect(resolveDraft(draftWith({ ownerId: 'user-a' }), signedIn({ state: 'delhi' }))).toEqual({ kind: 'use_account' })
      expect(resolveDraft(draftWith({ ownerId: 'user-a' }), signedIn())).toEqual({ kind: 'start' })
    })

    it('picks up saved answers on a new device', () => {
      expect(resolveDraft(emptyDraft(), signedIn({ state: 'delhi' }))).toEqual({ kind: 'use_account' })
    })

    it('starts the questions when neither side has answers', () => {
      expect(resolveDraft(emptyDraft(), signedIn())).toEqual({ kind: 'start' })
    })

    it('treats blanked-out answers as no answers', () => {
      expect(resolveDraft({ ...emptyDraft(), facts: { activity_codes: undefined } }, signedIn({ state: 'delhi' }))).toEqual({ kind: 'use_account' })
    })
  })
})

describe('shouldSaveDraft', () => {
  it('saves only once the first-result screens are finished, so a half-done draft cannot replace saved answers', () => {
    expect(shouldSaveDraft({ kind: 'use_draft', save: true }, 'first')).toBe(false)
    expect(shouldSaveDraft({ kind: 'use_draft', save: true }, 'refine')).toBe(true)
    expect(shouldSaveDraft({ kind: 'use_draft', save: true }, 'done')).toBe(true)
  })

  it('never saves what it was told not to', () => {
    expect(shouldSaveDraft({ kind: 'use_draft', save: false }, 'done')).toBe(false)
    expect(shouldSaveDraft({ kind: 'use_account' }, 'done')).toBe(false)
    expect(shouldSaveDraft({ kind: 'ask' }, 'done')).toBe(false)
  })
})
