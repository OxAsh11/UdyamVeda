import { describe, expect, it } from 'vitest'
import { searchActivities } from '../activity-search'
import { seedBundle } from './seed-bundle'

const { activities } = seedBundle()
const ids = (query: string) => searchActivities(query, activities).map(activity => activity.id)

describe('searchActivities', () => {
  it.each([
    ['achaar', 'pickles_chutney'],
    ['pickle', 'pickles_chutney'],
    ['लोणचे', 'pickles_chutney'],
    ['अचार', 'pickles_chutney'],
    ['Pickles', 'pickles_chutney'],
    ['silai', 'tailoring_garments'],
    ['सिलाई', 'tailoring_garments'],
    ['pond', 'pond_fish'],
  ])('finds "%s" first', (query, expected) => {
    expect(ids(query)[0]).toBe(expected)
  })

  it('finds poultry from "murgi palan"', () => {
    expect(ids('murgi palan')[0]).toBe('poultry_broiler')
  })

  it('forgives a typing mistake', () => {
    expect(ids('pikle')).toContain('pickles_chutney')
    expect(ids('tailer')).toContain('tailoring_garments')
  })

  it('ignores case, punctuation and extra spaces', () => {
    expect(ids('  ACHAAR!! ')[0]).toBe('pickles_chutney')
  })

  it('gives a mix of starting points when nothing is typed', () => {
    const starters = searchActivities('', activities)
    expect(starters.length).toBeGreaterThan(0)
    expect(new Set(starters.flatMap(activity => activity.packIds)).size).toBeGreaterThanOrEqual(4)
  })

  it('finds nothing for nonsense', () => {
    expect(ids('zzqqxx')).toEqual([])
  })

  it('respects the limit', () => {
    expect(searchActivities('a', activities, 3).length).toBeLessThanOrEqual(3)
  })
})
