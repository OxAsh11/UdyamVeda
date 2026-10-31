import { describe, expect, it } from 'vitest'
import { catalogDataFromRows, hydrateCatalog, type CatalogRows } from '../catalog'

const rows: CatalogRows = {
  opportunities: [
    { id: 'o2', slug: 'zeta', opportunity_type: 'subsidy', status: 'active', geography: { coverage: 'state', locations: ['bihar'] }, current_version_id: 'v2', last_checked_at: '2026-10-01T00:00:00Z' },
    { id: 'o1', slug: 'alpha', opportunity_type: 'loan', status: 'closed', geography: null, current_version_id: 'v1', last_checked_at: null },
    { id: 'o3', slug: 'no-rules', opportunity_type: 'grant', status: 'active', geography: null, current_version_id: 'v3', last_checked_at: null },
    { id: 'o4', slug: 'not-approved', opportunity_type: 'grant', status: 'active', geography: null, current_version_id: 'v4', last_checked_at: null },
  ],
  versions: [{ id: 'v1', title: 'Alpha' }, { id: 'v2', title: 'Zeta' }, { id: 'v3', title: 'No rules' }],
  ruleSets: [{ opportunity_version_id: 'v1', rules: { all: [] } }, { opportunity_version_id: 'v2', rules: { any: [] } }, { opportunity_version_id: 'v4', rules: { all: [] } }],
  windows: [{ opportunity_version_id: 'v2', window_type: 'rolling', opens_at: null, closes_at: null }],
  requirements: [{ opportunity_version_id: 'v2' }, { opportunity_version_id: 'v2' }],
  steps: [{ opportunity_version_id: 'v2' }],
  rates: [{ opportunity_version_id: 'v2', priority: '10', area: 'any', project_types: ['any'], own_pct: '5', subsidy_pct: '25', subsidy_cap_inr: '700000', label_en: 'Rate', source_url: 'https://example.gov.in' }],
  packs: [{ opportunity_id: 'o2', pack_id: 'food' }, { opportunity_id: 'o2', pack_id: 'agri' }],
  relationships: [{ opportunity_a: 'o1', opportunity_b: 'o2', relation: 'exclusive', cap_rule: null, note_en: 'Note', source_url: 'https://example.gov.in' }],
  mappings: [{ legacy_field: 'gated', treatment: 'bank_check', fact_key: null, value_map: null, derive: null, check_note_en: 'The bank checks this.' }],
  definitions: [
    { key: 'state', value_type: 'enum', fixable: false, allowed_values: [{ value: 'bihar' }] },
    { key: 'has_pan', value_type: 'boolean', fixable: true, allowed_values: null },
  ],
  activityPacks: [{ activity_id: 'pond_fish', pack_id: 'livestock_fisheries' }, { activity_id: 'pond_fish', pack_id: 'agri' }],
}

describe('a catalog with a table missing', () => {
  it.each([
    ['rule sets', { ruleSets: [] }],
    ['versions', { versions: [] }],
    ['definitions', { definitions: [] }],
    ['mappings', { mappings: [] }],
    ['activity packs', { activityPacks: [] }],
    ['pack tags', { packs: [] }],
    ['windows', { windows: [] }],
  ])('with no %s is refused, not served', (_name, change) => {
    expect(() => catalogDataFromRows({ ...rows, ...change } as CatalogRows)).toThrow(/incomplete/)
  })
})

describe('catalogDataFromRows', () => {
  const data = catalogDataFromRows(rows)

  it('keeps only records with an approved version and reviewed rules, sorted by slug', () => {
    expect(data.records.map(record => record.slug)).toEqual(['alpha', 'zeta'])
  })

  it('joins everything onto the record', () => {
    expect(data.records[1]).toMatchObject({
      id: 'o2',
      title: 'Zeta',
      type: 'subsidy',
      versionId: 'v2',
      coverage: 'state',
      locations: ['bihar'],
      packIds: ['agri', 'food'],
      requiredCount: 2,
      stepCount: 1,
      windows: [{ windowType: 'rolling', opensAt: null, closesAt: null }],
      lastCheckedAt: '2026-10-01T00:00:00Z',
    })
  })

  it('turns database numbers into numbers', () => {
    expect(data.records[1].rates[0]).toMatchObject({ priority: 10, ownPct: 5, subsidyPct: 25, subsidyCapInr: 700000, loanCapInr: null })
  })

  it('treats a record with no geography as central, and no check date as null', () => {
    expect(data.records[0]).toMatchObject({ coverage: 'central', locations: [], lastCheckedAt: null, rates: [], packIds: [] })
  })

  it('maps relationships, definitions and activity packs', () => {
    expect(data.relationships[0]).toMatchObject({ a: 'o1', b: 'o2', relation: 'exclusive', noteEn: 'Note' })
    expect(data.definitions).toEqual([{ key: 'state', type: 'enum', fixable: false, values: ['bihar'] }, { key: 'has_pan', type: 'boolean', fixable: true }])
    expect(data.activityPacks).toEqual({ pond_fish: ['livestock_fisheries', 'agri'] })
  })

  it('survives the JSON the data cache stores it as, then hydrates', () => {
    const catalog = hydrateCatalog(JSON.parse(JSON.stringify(data)))
    expect(catalog.activityIds.has('pond_fish')).toBe(true)
    expect(catalog.context.fixableKeys.has('has_pan')).toBe(true)
    expect(catalog.context.reviewerChecks.get('gated')).toBe('The bank checks this.')
    expect(catalog.version).toBe(data.version)
  })
})
