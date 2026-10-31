import { afterEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import { getPublishedOpportunity } from '../published'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))

const rows: Record<string, unknown> = {
  opportunities: { id: 'o-1', slug: 'a-scheme', name: 'A scheme', opportunity_type: 'loan', status: 'active', geography: null, canonical_url: null, authority_id: 'auth-1', current_version_id: 'v-1' },
  opportunity_versions: { id: 'v-1', opportunity_id: 'o-1', summary: 'About it', objective: null, legal_basis: null, eligibility: null, application: null, fine_print: null, benefit_summary: null, last_verified_at: null, completeness: 1, review_status: 'approved' },
  authorities: { id: 'auth-1', name: 'Ministry of Fisheries' },
}

// Just enough of the Supabase client for the reads one scheme page makes.
const supabase = {
  from(table: string) {
    const builder = {
      select: () => builder,
      eq: () => builder,
      in: () => builder,
      order: () => builder,
      maybeSingle: async () => ({ data: rows[table] ?? null, error: null }),
      then: (done: (value: unknown) => void) => done({ data: [], error: null }),
    }
    return builder
  },
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('the source label of a scheme', () => {
  it('always begins "Official source", even when unreviewed records are being shown', async () => {
    vi.mocked(createClient).mockResolvedValue(supabase as unknown as Awaited<ReturnType<typeof createClient>>)
    for (const beta of ['false', 'true']) {
      vi.stubEnv('CATALOG_RESEARCH_BETA', beta)
      const opportunity = await getPublishedOpportunity('a-scheme')
      expect(opportunity?.sourceLabel, `beta ${beta}`).toBe('Official source · Ministry of Fisheries')
    }
  })
})
