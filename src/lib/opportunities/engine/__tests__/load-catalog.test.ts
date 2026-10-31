import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadEngineCatalog } from '../load-catalog'

type Row = Record<string, unknown>
type Tables = Record<string, Row[]>

const state = vi.hoisted(() => ({
  tables: {} as Record<string, Record<string, unknown>[]>,
  failing: new Set<string>(),
  largestIn: 0,
}))

vi.mock('next/cache', () => ({ unstable_cache: (fn: unknown) => fn }))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from(table: string) {
      let rows = state.tables[table] ?? []
      const builder = {
        select: () => builder,
        order: () => builder,
        eq: (column: string, value: unknown) => {
          rows = rows.filter(row => row[column] === value)
          return builder
        },
        in: (column: string, values: unknown[]) => {
          state.largestIn = Math.max(state.largestIn, values.length)
          rows = rows.filter(row => values.includes(row[column]))
          return builder
        },
        range: async (from: number, to: number) => (state.failing.has(table)
          ? { data: null, error: { message: `${table} failed` } }
          : { data: rows.slice(from, to + 1), error: null }),
      }
      return builder
    },
  }),
}))

function healthyTables(recordCount: number): Tables {
  const ids = Array.from({ length: recordCount }, (_, index) => String(index).padStart(4, '0'))
  return {
    opportunities: ids.map(id => ({ id: `o${id}`, slug: `scheme-${id}`, opportunity_type: 'subsidy', status: 'active', geography: null, current_version_id: `v${id}`, last_checked_at: '2026-10-30T00:00:00Z' })),
    opportunity_versions: ids.map(id => ({ id: `v${id}`, title: `Scheme ${id}`, review_status: 'approved' })),
    eligibility_rule_sets: ids.map(id => ({ opportunity_version_id: `v${id}`, rules: { all: [] }, reviewed: true })),
    opportunity_windows: ids.map(id => ({ opportunity_version_id: `v${id}`, window_type: 'rolling', opens_at: null, closes_at: null })),
    opportunity_requirements: ids.flatMap(id => Array.from({ length: 15 }, () => ({ opportunity_version_id: `v${id}` }))),
    opportunity_steps: ids.map(id => ({ opportunity_version_id: `v${id}` })),
    benefit_rates: [],
    opportunity_packs: ids.map(id => ({ opportunity_id: `o${id}`, pack_id: 'food' })),
    scheme_relationships: [],
    rule_field_mappings: [{ legacy_field: 'gated', treatment: 'bank_check', fact_key: null, value_map: null, derive: null, check_note_en: 'Checked.' }],
    fact_definitions: [{ key: 'state', value_type: 'enum', fixable: false, allowed_values: [{ value: 'bihar' }], active: true }],
    activity_packs: [{ activity_id: 'pond_fish', pack_id: 'food' }],
  }
}

describe('loadEngineCatalog', () => {
  beforeEach(() => {
    state.tables = healthyTables(187)
    state.failing = new Set()
    state.largestIn = 0
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  it('builds the catalog from every table', async () => {
    const catalog = await loadEngineCatalog()
    expect(catalog?.records).toHaveLength(187)
    expect(catalog?.activityIds.has('pond_fish')).toBe(true)
  })

  it('keeps the request URL short by asking for at most 100 versions at a time', async () => {
    await loadEngineCatalog()
    expect(state.largestIn).toBeGreaterThan(0)
    expect(state.largestIn).toBeLessThanOrEqual(100)
  })

  it('reads past the 1000-row limit, so counts are not silently short', async () => {
    const catalog = await loadEngineCatalog()
    expect(catalog?.records[0].requiredCount).toBe(15)
    expect(catalog?.records[186].requiredCount).toBe(15)
  })

  it.each(['opportunities', 'eligibility_rule_sets', 'benefit_rates', 'fact_definitions', 'opportunity_packs'])('returns null, not a partial catalog, when %s fails', async table => {
    state.failing.add(table)
    expect(await loadEngineCatalog()).toBeNull()
  })

  it.each(['opportunities', 'eligibility_rule_sets', 'opportunity_versions', 'opportunity_packs', 'opportunity_windows', 'fact_definitions', 'rule_field_mappings', 'activity_packs'])('returns null when %s comes back empty', async table => {
    state.tables[table] = []
    expect(await loadEngineCatalog()).toBeNull()
  })

  it('comes back on its own once the database does', async () => {
    state.failing.add('opportunities')
    expect(await loadEngineCatalog()).toBeNull()
    state.failing.clear()
    expect((await loadEngineCatalog())?.records).toHaveLength(187)
  })
})
