import type { SupabaseClient } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { loadStartBundle } from '@/lib/start/load-bundle'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { loadSchemesFounder } from '../load-schemes-view'

vi.mock('@/lib/opportunities/engine/load-catalog', () => ({ loadEngineCatalog: vi.fn() }))
vi.mock('@/lib/start/load-bundle', () => ({ loadStartBundle: vi.fn() }))

type Row = Record<string, unknown>
const db = {
  facts: [] as Row[],
  saved: [] as Row[],
  failSaved: false,
  throwSaved: false,
  // Every table the page asked for, in order.
  reads: [] as string[],
}

// Just enough of the Supabase client for the reads the founder's schemes page makes.
const supabase = {
  from(table: string) {
    db.reads.push(table)
    const rows = () => {
      if (table === 'business_memberships') return [{ business_id: 'business-1', user_id: 'user-1' }]
      if (table === 'businesses') return [{ id: 'business-1', active: true }]
      if (table === 'saved_opportunities') return db.saved
      return db.facts
    }
    const builder = {
      select: () => builder,
      order: () => builder,
      limit: () => builder,
      eq: () => builder,
      maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
      then: (done: (value: unknown) => void, fail: (reason: unknown) => void) => {
        if (table === 'saved_opportunities' && db.throwSaved) return fail(new Error('down'))
        return done(table === 'saved_opportunities' && db.failSaved ? { data: null, error: { message: 'down' } } : { data: rows(), error: null })
      },
    }
    return builder
  },
} as unknown as SupabaseClient

const answered = (fact_key: string, value: unknown): Row => ({ business_id: 'business-1', fact_key, fact_value: { value }, answer_state: 'answered' })
const savedRow = (slug: string, status = 'saved'): Row => ({ id: slug, opportunity_id: slug, status, created_at: '2026-10-30T00:00:00Z', opportunity: { id: slug, slug, name: `Scheme ${slug}` } })
const run = (browsing: boolean) => loadSchemesFounder(supabase, 'user-1', browsing)
const readSaved = () => db.reads.includes('saved_opportunities')

describe('loadSchemesFounder', () => {
  beforeEach(() => {
    db.facts = [answered('activity_codes', ['pond_fish']), answered('state', 'jharkhand')]
    db.saved = [savedRow('one'), savedRow('two', 'started')]
    db.failSaved = false
    db.throwSaved = false
    db.reads = []
    vi.mocked(loadEngineCatalog).mockReset().mockResolvedValue(snapshotCatalog())
    vi.mocked(loadStartBundle).mockReset().mockResolvedValue(seedBundle())
  })

  it('reads the saved schemes for a ready founder on For you, where they are shown', async () => {
    const { founder, saved } = await run(false)
    expect(founder.status).toBe('ready')
    expect(saved).toEqual([{ slug: 'one', name: 'Scheme one' }])
  })

  it('does not read them for a ready founder on Browse all, where they are never shown', async () => {
    const { founder, saved } = await run(true)
    expect(founder.status).toBe('ready')
    expect(saved).toEqual([])
    expect(readSaved()).toBe(false)
  })

  it('reads them for a founder with nothing to sort, whose For you view shows them under the list, browsing or not', async () => {
    db.facts = [answered('state', 'jharkhand')]
    for (const browsing of [false, true]) {
      db.reads = []
      const { founder, saved } = await run(browsing)
      expect(founder.status, String(browsing)).toBe('no_answers')
      expect(saved, String(browsing)).toEqual([{ slug: 'one', name: 'Scheme one' }])
    }
  })

  it('reads them when results could not load, browsing or not', async () => {
    vi.mocked(loadEngineCatalog).mockResolvedValue(null)
    for (const browsing of [false, true]) {
      db.reads = []
      const { founder, saved } = await run(browsing)
      expect(founder.status, String(browsing)).toBe('unavailable')
      expect(saved.length, String(browsing)).toBe(1)
    }
  })

  it('leaves the list out, not the page, when the saved read fails or throws', async () => {
    db.failSaved = true
    expect((await run(false)).saved).toEqual([])
    db.failSaved = false
    db.throwSaved = true
    const failed = await run(false)
    expect(failed.founder.status).toBe('ready')
    expect(failed.saved).toEqual([])
  })
})
