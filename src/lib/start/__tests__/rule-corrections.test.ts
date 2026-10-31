import { describe, expect, it } from 'vitest'
import { catalogVersion, hydrateCatalog } from '@/lib/opportunities/engine/catalog'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { buildResults } from '@/lib/opportunities/engine/results'
import { factDefinitions, seed } from '@/lib/opportunities/engine/__tests__/seeds'
import { snapshotData } from '@/lib/opportunities/engine/__tests__/snapshot'

type Correction = { slug: string; reason: string; rules: unknown }

const corrections = seed<Correction[]>('m2-rule-corrections.json')
const data = snapshotData()
const patched = {
  ...data,
  definitions: factDefinitions.map(fact => ({
    key: fact.key,
    type: fact.type,
    fixable: fact.fixable,
    ...(fact.values ? { values: fact.values.map(value => String(value[0])) } : {}),
  })),
  records: data.records.map(record => {
    const correction = corrections.find(item => item.slug === record.slug)
    return correction ? { ...record, rules: correction.rules } : record
  }),
}
const catalog = hydrateCatalog({ ...patched, version: catalogVersion(patched) })
const now = new Date('2026-10-31T00:00:00Z')

function bucketOf(slug: string, raw: Record<string, unknown>) {
  const { facts, nonAnswers } = cleanFacts(raw, catalog.definitions, catalog.activityIds)
  const { buckets } = buildResults(facts, nonAnswers, catalog, now)
  return (['A', 'B', 'C', 'D'] as const).find(bucket => buckets[bucket].some(item => item.slug === slug)) ?? null
}

function fieldsIn(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const record = node as Record<string, unknown>
  if (Array.isArray(record.all)) return record.all.flatMap(fieldsIn)
  if (Array.isArray(record.any)) return record.any.flatMap(fieldsIn)
  return typeof record.field === 'string' ? [record.field] : []
}

describe('the corrections file', () => {
  it('corrects exactly the three schemes the owner was told about', () => {
    expect(corrections.map(item => item.slug).sort()).toEqual(['cmegp-maharashtra', 'mukhyamantri-rojgar-srijan-yojana-jharkhand', 'odop-margin-money-uttar-pradesh'])
  })

  it('gives a reason for each', () => {
    for (const item of corrections) expect(item.reason.trim().length, item.slug).toBeGreaterThan(10)
  })

  it('only reads fields the engine understands', () => {
    const known = new Set([...factDefinitions.map(fact => fact.key), ...data.mappings.map(mapping => mapping.legacy_field)])
    for (const item of corrections) for (const field of fieldsIn(item.rules)) expect(known.has(field), `${item.slug}: ${field}`).toBe(true)
  })
})

describe('UP ODOP', () => {
  const ODOP = 'odop-margin-money-uttar-pradesh'
  const up = { activity_codes: ['carpentry_furniture'], state: 'uttar_pradesh' }

  it('is open to a founder making the district product', () => {
    expect(bucketOf(ODOP, { ...up, matches_district_odop: true })).toBe('A')
  })

  it('is not for a founder making something else', () => {
    expect(bucketOf(ODOP, { ...up, matches_district_odop: false })).toBe('D')
  })

  it('asks when the founder has not said', () => {
    expect(bucketOf(ODOP, up)).toBe('B')
    expect(bucketOf(ODOP, { ...up, matches_district_odop: 'dont_know' })).toBe('B')
  })
})

describe('Jharkhand MRSY income limit of ₹5 lakh', () => {
  const MRSY = 'mukhyamantri-rojgar-srijan-yojana-jharkhand'
  const founder = { activity_codes: ['pond_fish'], state: 'jharkhand', applicant_age_years: 29, social_category: 'st', received_govt_subsidy_before: false }

  it('includes ₹3–5 lakh', () => {
    expect(bucketOf(MRSY, { ...founder, annual_family_income_band: '3l_5l' })).toBe('A')
  })

  it.each(['5l_6l', '6l_8l', 'above_8l'])('excludes %s', band => {
    expect(bucketOf(MRSY, { ...founder, annual_family_income_band: band })).toBe('D')
  })
})

describe('CMEGP', () => {
  const CMEGP = 'cmegp-maharashtra'
  const base = { state: 'maharashtra', applicant_age_years: 32, stage: 'setting_up', received_govt_subsidy_before: false, entity_type: 'proprietorship' }
  const parlour = { ...base, activity_codes: ['beauty_parlour_salon'], project_cost_band: '5l_10l' }

  it('is not for a trader', () => {
    expect(bucketOf(CMEGP, { ...base, activity_codes: ['kirana_store'], project_cost_band: '2l_5l' })).toBe('D')
  })

  it('accepts proprietorship, partnership, SHG, and someone not yet registered', () => {
    for (const entity_type of ['proprietorship', 'partnership', 'shg', 'not_registered']) {
      expect(bucketOf(CMEGP, { ...parlour, entity_type, education_level: 'class_10' }), entity_type).toBe('A')
    }
  })

  it('does not call an LLP or company eligible, but says it can be fixed', () => {
    expect(bucketOf(CMEGP, { ...parlour, entity_type: 'llp', education_level: 'class_10' })).toBe('B')
    expect(bucketOf(CMEGP, { ...parlour, entity_type: 'private_limited', education_level: 'class_10' })).toBe('B')
  })

  it('asks about education for a service project above ₹5 lakh', () => {
    expect(bucketOf(CMEGP, parlour)).toBe('B')
    expect(bucketOf(CMEGP, { ...parlour, education_level: 'class_10' })).toBe('A')
    expect(bucketOf(CMEGP, { ...parlour, education_level: 'below_8th' })).toBe('B')
  })

  it('does not ask about education for a service project up to ₹5 lakh', () => {
    expect(bucketOf(CMEGP, { ...parlour, project_cost_band: '2l_5l', education_level: 'below_8th' })).toBe('A')
  })

  it('does not ask about education for a manufacturing project up to ₹10 lakh', () => {
    expect(bucketOf(CMEGP, { ...base, activity_codes: ['pickles_chutney'], project_cost_band: '5l_10l', education_level: 'below_8th' })).toBe('A')
  })

  it('asks about education for a manufacturing project above ₹10 lakh', () => {
    expect(bucketOf(CMEGP, { ...base, activity_codes: ['pickles_chutney'], project_cost_band: '10l_25l' })).toBe('B')
  })

  it('still rules out a running business', () => {
    expect(bucketOf(CMEGP, { ...parlour, stage: 'running', education_level: 'class_10' })).toBe('D')
  })
})
