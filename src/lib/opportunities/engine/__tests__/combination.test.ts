import { describe, expect, it } from 'vitest'
import type { BenefitLines } from '../calculator'
import { chooseCombination, type Relationship } from '../combination'

const LAKH = 100_000

function candidate(id: string, subsidy: number, cost = 10 * LAKH): { id: string; lines: BenefitLines } {
  const exact = (value: number) => ({ min: value, max: value })
  return {
    id,
    lines: {
      projectCost: exact(cost),
      own: exact(0),
      subsidy: exact(subsidy),
      loan: exact(cost - subsidy),
      uncovered: exact(0),
      interestRatePct: null,
      interestSubventionPct: null,
      rateLabel: 'Test',
      sourceUrl: 'https://example.gov.in',
      betterIfAnswered: [],
      ownShortfall: false,
      aboveCeiling: false,
      ifRenewed: false,
    },
  }
}

function relation(a: string, b: string, kind: Relationship['relation'], capRule: Relationship['capRule'] = null): Relationship {
  return { a, b, relation: kind, capRule, noteEn: null, sourceUrl: 'https://example.gov.in' }
}

describe('chooseCombination', () => {
  it('never recommends two exclusive schemes together', () => {
    const result = chooseCombination([candidate('cmegp', 2 * LAKH), candidate('pmfme', 1 * LAKH)], [relation('cmegp', 'pmfme', 'exclusive')])
    expect(result.recommended).toEqual(['cmegp'])
    expect(result.alternatives).toEqual([{ id: 'pmfme', excludedBy: ['cmegp'], notConfirmedWith: [] }])
  })

  it('treats a pair with no stored relationship as not confirmed', () => {
    const result = chooseCombination([candidate('big', 3 * LAKH), candidate('small', 1 * LAKH)], [])
    expect(result.recommended).toEqual(['big'])
    expect(result.alternatives).toEqual([{ id: 'small', excludedBy: [], notConfirmedWith: ['big'] }])
  })

  it('never infers stacking from an explicit unknown either', () => {
    const result = chooseCombination([candidate('big', 3 * LAKH), candidate('small', 1 * LAKH)], [relation('big', 'small', 'unknown')])
    expect(result.recommended).toEqual(['big'])
    expect(result.alternatives[0].notConfirmedWith).toEqual(['big'])
  })

  it('recommends a confirmed stackable pair together', () => {
    const result = chooseCombination([candidate('a', 3 * LAKH), candidate('b', 1 * LAKH)], [relation('a', 'b', 'stackable')])
    expect(result.recommended).toEqual(['a', 'b'])
    expect(result.alternatives).toEqual([])
  })

  it('ignores the order a pair was stored in', () => {
    const result = chooseCombination([candidate('a', 3 * LAKH), candidate('b', 1 * LAKH)], [relation('b', 'a', 'exclusive')])
    expect(result.recommended).toEqual(['a'])
    expect(result.alternatives[0].excludedBy).toEqual(['a'])
  })

  it('allows a conditional pair within its cap', () => {
    const result = chooseCombination(
      [candidate('a', 2 * LAKH), candidate('b', 2 * LAKH)],
      [relation('a', 'b', 'conditional', { max_total_subsidy_pct: 50 })],
    )
    expect(result.recommended).toEqual(['a', 'b'])
  })

  it('splits a conditional pair over its cap', () => {
    const result = chooseCombination(
      [candidate('a', 4 * LAKH), candidate('b', 2 * LAKH)],
      [relation('a', 'b', 'conditional', { max_total_subsidy_pct: 50 })],
    )
    expect(result.recommended).toEqual(['a'])
  })

  it('splits a conditional pair with no usable cap', () => {
    const result = chooseCombination([candidate('a', 4 * LAKH), candidate('b', 2 * LAKH)], [relation('a', 'b', 'conditional')])
    expect(result.recommended).toEqual(['a'])
  })

  it('reports the order of a sequential pair', () => {
    const result = chooseCombination([candidate('udyam', 0), candidate('pmegp', 2 * LAKH)], [relation('udyam', 'pmegp', 'sequential')])
    expect([...result.recommended].sort()).toEqual(['pmegp', 'udyam'])
    expect(result.sequences).toEqual([{ before: 'udyam', after: 'pmegp' }])
  })

  it('prefers two stackable small schemes over one exclusive big one when they give more', () => {
    const result = chooseCombination(
      [candidate('big', 3 * LAKH), candidate('x', 2 * LAKH), candidate('y', 2 * LAKH)],
      [relation('big', 'x', 'exclusive'), relation('big', 'y', 'exclusive'), relation('x', 'y', 'stackable')],
    )
    expect(result.recommended).toEqual(['x', 'y'])
  })

  it('only combines the top ten, and lists the rest as alternatives', () => {
    const many = Array.from({ length: 11 }, (_, index) => candidate(`s${String(index).padStart(2, '0')}`, (11 - index) * 10_000))
    const result = chooseCombination(many, [])
    expect(result.recommended).toEqual(['s00'])
    expect(result.alternatives.map(item => item.id)).toContain('s10')
    expect(result.alternatives).toHaveLength(10)
  })

  it('gives the same answer every run for a tie', () => {
    const first = chooseCombination([candidate('b', 2 * LAKH), candidate('a', 2 * LAKH)], [])
    const second = chooseCombination([candidate('a', 2 * LAKH), candidate('b', 2 * LAKH)], [])
    expect(first).toEqual(second)
    expect(first.recommended).toEqual(['a'])
  })

  it('copes with no candidates', () => {
    expect(chooseCombination([], [])).toEqual({ recommended: [], alternatives: [], sequences: [] })
  })

  it('ignores relationships about records not in play', () => {
    const result = chooseCombination([candidate('a', 2 * LAKH)], [relation('a', 'gone', 'exclusive'), relation('x', 'y', 'sequential')])
    expect(result).toEqual({ recommended: ['a'], alternatives: [], sequences: [] })
  })

  it('has no total or sum field', () => {
    const result = chooseCombination([candidate('a', 2 * LAKH)], [])
    for (const key of Object.keys(result)) expect(key).not.toMatch(/total|sum/i)
  })
})
