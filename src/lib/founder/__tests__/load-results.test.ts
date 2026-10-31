import type { SupabaseClient } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { loadStartBundle } from '@/lib/start/load-bundle'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { loadFounderResults } from '../load-results'

vi.mock('@/lib/opportunities/engine/load-catalog', () => ({ loadEngineCatalog: vi.fn() }))
vi.mock('@/lib/start/load-bundle', () => ({ loadStartBundle: vi.fn() }))

const KCC = 'kisan-credit-card-animal-husbandry-fisheries'
const NOW = new Date('2026-10-31T00:00:00Z')

type Row = Record<string, unknown>
const db = {
  memberships: [] as Row[],
  businesses: [] as Row[],
  facts: [] as Row[],
  failBusiness: false,
  failFacts: false,
}

// Just enough of the Supabase client for the two reads the loader makes.
const supabase = {
  from(table: string) {
    const filters: [string, unknown][] = []
    const rows = () => {
      const source = table === 'business_memberships' ? db.memberships : table === 'businesses' ? db.businesses : db.facts
      return source.filter(row => filters.every(([column, value]) => row[column] === value))
    }
    const builder = {
      select: () => builder,
      order: () => builder,
      limit: () => builder,
      eq: (column: string, value: unknown) => {
        filters.push([column, value])
        return builder
      },
      maybeSingle: async () => db.failBusiness
        ? { data: null, error: { message: 'down' } }
        : { data: rows()[0] ?? null, error: null },
      then: (done: (value: unknown) => void) => done(db.failFacts ? { data: null, error: { message: 'down' } } : { data: rows(), error: null }),
    }
    return builder
  },
} as unknown as SupabaseClient

const answered = (fact_key: string, value: unknown): Row => ({ business_id: 'business-1', fact_key, fact_value: { value }, answer_state: 'answered' })
const run = () => loadFounderResults(supabase, 'user-1', NOW)

describe('loadFounderResults', () => {
  beforeEach(() => {
    db.memberships = [{ business_id: 'business-1', user_id: 'user-1' }]
    db.businesses = [{ id: 'business-1', active: true }]
    db.facts = []
    db.failBusiness = false
    db.failFacts = false
    vi.mocked(loadEngineCatalog).mockReset().mockResolvedValue(snapshotCatalog())
    vi.mocked(loadStartBundle).mockReset().mockResolvedValue(seedBundle())
  })

  it('is no_answers without an activity', async () => {
    db.facts = [answered('state', 'jharkhand')]
    const loaded = await run()
    expect(loaded).toMatchObject({ status: 'no_answers' })
    expect(loaded.status === 'no_answers' && loaded.bundle?.activities.length).toBeGreaterThan(0)
  })

  it('does not need the catalog to say there are no answers', async () => {
    db.facts = [answered('state', 'jharkhand')]
    vi.mocked(loadEngineCatalog).mockResolvedValue(null)
    expect((await run()).status).toBe('no_answers')
    expect(loadEngineCatalog).not.toHaveBeenCalled()
  })

  it('is no_answers for a founder with no workspace yet', async () => {
    db.memberships = []
    expect(await run()).toMatchObject({ status: 'no_answers' })
  })

  it('is no_answers when old free text is all there is', async () => {
    db.facts = [answered('state', 'Mumbai'), answered('sector', 'Food')]
    expect(await run()).toMatchObject({ status: 'no_answers' })
  })

  it('is no_answers when the only activity is one the catalog does not know', async () => {
    db.facts = [answered('activity_codes', ['no_such_activity']), answered('state', 'jharkhand')]
    expect(await run()).toMatchObject({ status: 'no_answers' })
  })

  it('keeps the answers screen going with no bundle when the bundle is down', async () => {
    vi.mocked(loadStartBundle).mockResolvedValue(null)
    expect(await run()).toEqual({ status: 'no_answers', bundle: null })
  })

  it('is unavailable when the catalog is down', async () => {
    db.facts = [answered('activity_codes', ['pond_fish']), answered('state', 'jharkhand')]
    vi.mocked(loadEngineCatalog).mockResolvedValue(null)
    expect(await run()).toEqual({ status: 'unavailable' })
  })

  it('is unavailable when the question data is down, once there are answers to show', async () => {
    db.facts = [answered('activity_codes', ['pond_fish'])]
    vi.mocked(loadStartBundle).mockResolvedValue(null)
    expect(await run()).toEqual({ status: 'unavailable' })
  })

  it('is unavailable when the facts cannot be read', async () => {
    db.facts = [answered('activity_codes', ['pond_fish'])]
    db.failFacts = true
    expect(await run()).toEqual({ status: 'unavailable' })
  })

  it('is unavailable when the workspace cannot be read, not "no answers"', async () => {
    db.failBusiness = true
    expect(await run()).toEqual({ status: 'unavailable' })
  })

  it('is ready with results for a real founder', async () => {
    db.facts = [
      answered('activity_codes', ['pond_fish']),
      answered('state', 'jharkhand'),
      { business_id: 'business-1', fact_key: 'social_category', fact_value: {}, answer_state: 'declined' },
      { business_id: 'business-1', fact_key: 'udyam_registered', fact_value: {}, answer_state: 'dont_know' },
      answered('pan_number', 'ABCDE1234F'),
    ]
    const loaded = await run()
    if (loaded.status !== 'ready') throw new Error(`expected ready, got ${loaded.status}`)

    expect(loaded.facts).toEqual({ activity_codes: ['pond_fish'], state: 'jharkhand' })
    expect(loaded.nonAnswers).toEqual({ social_category: 'declined', udyam_registered: 'dont_know' })
    // The same shape the answers API gives the flow.
    expect(loaded.answers).toEqual({ activity_codes: ['pond_fish'], state: 'jharkhand', social_category: 'prefer_not', udyam_registered: 'dont_know' })
    expect(loaded.results.buckets.A.map(item => item.slug)).toContain(KCC)
    expect(loaded.results.counts.A).toBe(loaded.results.buckets.A.length)
    expect(loaded.results.nonAnswers).toEqual(loaded.nonAnswers)
    expect(loaded.bundle.activities.length).toBeGreaterThan(0)
    expect(loaded.catalog.version).toBe(loaded.results.catalogVersion)
  })

  it('judges the windows as of the date it is given', async () => {
    db.facts = [answered('activity_codes', ['pond_fish']), answered('state', 'jharkhand')]
    const loaded = await loadFounderResults(supabase, 'user-1', new Date('2026-10-31T00:00:00Z'))
    const later = await loadFounderResults(supabase, 'user-1', new Date('2031-10-31T00:00:00Z'))
    if (loaded.status !== 'ready' || later.status !== 'ready') throw new Error('expected ready')
    const states = (payload: typeof loaded.results) => payload.buckets.A.concat(payload.buckets.B, payload.buckets.C).map(item => `${item.slug}:${item.bucket}`)
    expect(states(later.results)).not.toEqual(states(loaded.results))
  })
})
