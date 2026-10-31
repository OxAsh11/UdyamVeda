import { describe, expect, it } from 'vitest'
import { emptyDraft } from '../draft'
import type { ScreenQuestion } from '../next-screen'
import { answersMissing, withScreenAnswers } from '../screen'

const fact = (key: string) => ({ key, type: 'boolean', label: { en: key, hi: key, mr: key }, packIds: [], sensitive: false, options: [] })
const question = (id: string, kind: string, keys: string[], dependsOn: unknown = null): ScreenQuestion => ({
  id, kind, stage: 3, sort: 1, prompt: { en: id, hi: id, mr: id }, help: null, dependsOn, factKeys: keys, facts: keys.map(fact),
})

const stage = question('q_stage', 'single', ['stage'])
const since = question('q_since', 'date', ['operating_since'], { all: [{ field: 'stage', operator: 'equals', value: 'running' }] })
const have = question('q_have', 'multi', ['has_pan', 'udyam_registered'])

describe('answersMissing', () => {
  it('flags a shown question with no answer', () => {
    expect(answersMissing([stage], {})).toBe(true)
    expect(answersMissing([stage], { stage: '' })).toBe(true)
  })

  it('accepts an answer, a "no", a zero, or "don\'t know"', () => {
    expect(answersMissing([stage], { stage: 'idea' })).toBe(false)
    expect(answersMissing([stage], { stage: false })).toBe(false)
    expect(answersMissing([stage], { stage: 0 })).toBe(false)
    expect(answersMissing([stage], { stage: 'dont_know' })).toBe(false)
  })

  it('treats an empty activity list as unanswered', () => {
    expect(answersMissing([question('q_activity', 'activity_search', ['activity_codes'])], { activity_codes: [] })).toBe(true)
  })

  it('never blocks on a checklist', () => {
    expect(answersMissing([have], {})).toBe(false)
  })
})

describe('withScreenAnswers', () => {
  it('records the screen for Back and marks its questions as asked', () => {
    const updated = withScreenAnswers({ ...emptyDraft(), facts: { stage: 'idea' } }, [stage, since], [stage])
    expect(updated.asked).toEqual(['q_stage'])
    expect(updated.history).toEqual([['q_stage']])
  })

  it('turns unticked checklist items into "no" and keeps ticked ones', () => {
    const updated = withScreenAnswers({ ...emptyDraft(), facts: { has_pan: true } }, [have], [have])
    expect(updated.facts).toEqual({ has_pan: true, udyam_registered: false })
  })

  it('keeps "don\'t know" on a checklist', () => {
    const updated = withScreenAnswers({ ...emptyDraft(), facts: { has_pan: 'dont_know', udyam_registered: 'dont_know' } }, [have], [have])
    expect(updated.facts).toEqual({ has_pan: 'dont_know', udyam_registered: 'dont_know' })
  })

  it('drops the answer to a follow-up that is no longer shown', () => {
    const draft = { ...emptyDraft(), facts: { stage: 'idea', operating_since: '2020-01-01' } }
    expect(withScreenAnswers(draft, [stage, since], [stage]).facts).toEqual({ stage: 'idea' })
  })

  it('does not list a question twice when coming back through a screen', () => {
    const draft = { ...emptyDraft(), facts: { stage: 'idea' }, asked: ['q_stage'] }
    expect(withScreenAnswers(draft, [stage], [stage]).asked).toEqual(['q_stage'])
  })

  it('does not change the draft it was given', () => {
    const draft = { ...emptyDraft(), facts: { stage: 'idea', operating_since: '2020-01-01' } }
    withScreenAnswers(draft, [stage, since], [stage])
    expect(draft.facts).toEqual({ stage: 'idea', operating_since: '2020-01-01' })
  })
})
