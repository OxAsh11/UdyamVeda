import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET, PUT } from '@/app/api/founder/facts/route'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { loadStartBundle } from '../load-bundle'
import { seedBundle } from './seed-bundle'

type Row = Record<string, unknown>

const db = vi.hoisted(() => ({
  user: null as { id: string; email?: string; phone?: string } | null,
  memberships: [] as Record<string, unknown>[],
  businesses: [] as Record<string, unknown>[],
  facts: [] as Record<string, unknown>[],
  deleted: [] as string[],
  updates: [] as Record<string, unknown>[],
  failFacts: false,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: db.user } }) },
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
        maybeSingle: async () => ({ data: rows()[0] ?? null, error: null }),
        single: async () => ({ data: rows()[0] ?? null, error: null }),
        then: (done: (value: unknown) => void) => done({ data: rows(), error: null }),
        insert: (row: Row) => {
          const created = { id: 'business-new', active: true, ...row }
          db.businesses.push(created)
          return { select: () => ({ single: async () => ({ data: created, error: null }) }) }
        },
        upsert: async (input: Row | Row[]) => {
          if (table === 'business_facts' && db.failFacts) return { error: { message: 'nope' } }
          const list = Array.isArray(input) ? input : [input]
          if (table === 'business_memberships') db.memberships.push(...list)
          else for (const row of list) {
            db.facts = db.facts.filter(existing => existing.fact_key !== row.fact_key)
            db.facts.push(row)
          }
          return { error: null }
        },
        update: (values: Row) => {
          db.updates.push(values)
          return { eq: async () => ({ error: null }) }
        },
        delete: () => ({
          eq: () => ({
            in: async (_column: string, keys: string[]) => {
              db.deleted.push(...keys)
              db.facts = db.facts.filter(row => !keys.includes(row.fact_key as string))
              return { error: null }
            },
          }),
        }),
      }
      return builder
    },
  }),
}))
vi.mock('@/lib/opportunities/engine/load-catalog', () => ({ loadEngineCatalog: vi.fn() }))
vi.mock('../load-bundle', () => ({ loadStartBundle: vi.fn() }))

const put = (body: unknown) => PUT(new Request('https://app.udyamveda.in/api/founder/facts', {
  method: 'PUT',
  headers: { 'content-type': 'application/json' },
  body: typeof body === 'string' ? body : JSON.stringify(body),
}))
const saved = (key: string) => db.facts.find(row => row.fact_key === key)

describe('/api/founder/facts', () => {
  beforeEach(() => {
    db.user = { id: 'user-1', email: 'founder@example.com' }
    db.memberships = []
    db.businesses = []
    db.facts = []
    db.deleted = []
    db.updates = []
    db.failFacts = false
    vi.mocked(loadEngineCatalog).mockResolvedValue(snapshotCatalog())
    vi.mocked(loadStartBundle).mockResolvedValue(seedBundle())
  })

  it('tells an anonymous visitor they are not signed in', async () => {
    db.user = null
    expect((await GET()).status).toBe(401)
    expect((await put({ facts: { state: 'bihar' } })).status).toBe(401)
    expect(db.facts).toEqual([])
  })

  it('saves answers, and creates a workspace for a founder without one', async () => {
    const response = await put({ facts: { state: 'bihar', applicant_age_years: 34 } })
    expect(response.status).toBe(200)
    expect(db.businesses).toHaveLength(1)
    expect(db.memberships[0]).toMatchObject({ business_id: 'business-new', user_id: 'user-1', role: 'owner' })
    expect(saved('state')).toMatchObject({ business_id: 'business-new', fact_value: { value: 'bihar' }, answer_state: 'answered', source: 'user' })
  })

  it('works for a founder who signed in by mobile, with no email', async () => {
    db.user = { id: 'user-2', phone: '919876543210' }
    expect((await put({ facts: { state: 'bihar' } })).status).toBe(200)
    expect(db.businesses[0]).toMatchObject({ owner_id: 'user-2' })
  })

  it('reuses an existing workspace', async () => {
    db.memberships = [{ business_id: 'business-1', user_id: 'user-1' }]
    db.businesses = [{ id: 'business-1', name: 'Mine', active: true }]
    await put({ facts: { state: 'bihar' } })
    expect(db.businesses).toHaveLength(1)
    expect(saved('state')).toMatchObject({ business_id: 'business-1' })
  })

  it('keeps the workspace location and stage in step', async () => {
    await put({ facts: { state: 'bihar', district: 'Gaya', stage: 'running' } })
    expect(db.updates[0]).toMatchObject({ state: 'bihar', district: 'Gaya', lifecycle_stage: 'running' })
  })

  it('drops junk and identity numbers before saving', async () => {
    await put({ facts: { state: 'atlantis', pan_number: 'ABCDE1234F', applicant_age_years: 31 } })
    expect(saved('state')).toBeUndefined()
    expect(saved('pan_number')).toBeUndefined()
    expect(saved('applicant_age_years')).toBeDefined()
  })

  it('saves "don\'t know" and "prefer not to say" as such', async () => {
    await put({ facts: { social_category: 'prefer_not', udyam_registered: 'dont_know' } })
    expect(saved('social_category')).toMatchObject({ answer_state: 'declined', fact_value: {} })
    expect(saved('udyam_registered')).toMatchObject({ answer_state: 'dont_know', fact_value: {} })
  })

  it('removes an answer the founder took back, and leaves old non-dictionary rows alone', async () => {
    db.memberships = [{ business_id: 'business-1', user_id: 'user-1' }]
    db.businesses = [{ id: 'business-1', active: true }]
    db.facts = [
      { business_id: 'business-1', fact_key: 'operating_since', fact_value: { value: '2020-01-01' } },
      { business_id: 'business-1', fact_key: 'business_name', fact_value: { value: 'Sunrise' } },
    ]
    await put({ facts: { stage: 'idea' } })
    expect(saved('operating_since')).toBeUndefined()
    expect(saved('business_name')).toBeDefined()
    expect(db.deleted).not.toContain('business_name')
  })

  it('reads saved answers back, with the questions they answer', async () => {
    db.memberships = [{ business_id: 'business-1', user_id: 'user-1' }]
    db.businesses = [{ id: 'business-1', active: true }]
    db.facts = [
      { business_id: 'business-1', fact_key: 'state', fact_value: { value: 'Maharashtra' }, answer_state: 'answered' },
      { business_id: 'business-1', fact_key: 'gender', fact_value: {}, answer_state: 'declined' },
    ]
    const payload = await (await GET()).json()
    expect(payload.facts).toEqual({ state: 'maharashtra', gender: 'prefer_not' })
    expect(payload.asked).toEqual(expect.arrayContaining(['q_state', 'q_gender']))
    expect(payload.asked).not.toContain('q_age')
  })

  it('gives an empty answer to a signed-in founder with nothing saved', async () => {
    expect(await (await GET()).json()).toEqual({ facts: {}, asked: [] })
    expect(db.businesses).toEqual([])
  })

  it('says so when saving fails, or the dictionary is down', async () => {
    db.failFacts = true
    expect((await put({ facts: { state: 'bihar' } })).status).toBe(500)
    vi.mocked(loadEngineCatalog).mockResolvedValue(null)
    expect((await put({ facts: { state: 'bihar' } })).status).toBe(503)
  })

  it('rejects bad JSON and oversized bodies', async () => {
    expect((await put('{nope')).status).toBe(400)
    expect((await put({ facts: { district: 'क'.repeat(6000) } })).status).toBe(413)
  })
})
