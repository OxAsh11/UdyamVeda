import { afterEach, describe, expect, it, vi } from 'vitest'
import { createClient } from '@/lib/supabase/server'
import { WINDOW_FALLBACK } from '../display'
import { AUTHORITY_FALLBACK, BENEFIT_FALLBACK, DESCRIPTION_FALLBACK, getPublishedOpportunity, PROCESSING_FALLBACK } from '../published'

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))

const full: Record<string, unknown> = {
  opportunities: { id: 'o-1', slug: 'a-scheme', name: 'A scheme', opportunity_type: 'loan', status: 'active', geography: null, canonical_url: null, authority_id: 'auth-1', current_version_id: 'v-1' },
  opportunity_versions: { id: 'v-1', opportunity_id: 'o-1', summary: 'About it', objective: null, legal_basis: null, eligibility: null, application: null, fine_print: null, benefit_summary: null, last_verified_at: null, completeness: 1, review_status: 'approved' },
  authorities: { id: 'auth-1', name: 'Ministry of Fisheries' },
}

// A record that says almost nothing: no summary, no authority, no benefit, no processing time, no window.
const thin: Record<string, unknown> = {
  opportunities: { ...(full.opportunities as object), authority_id: null },
  opportunity_versions: { ...(full.opportunity_versions as object), summary: null },
}

// Just enough of the Supabase client for the reads one scheme page makes.
function clientFor(rows: Record<string, unknown>) {
  return {
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
  } as unknown as Awaited<ReturnType<typeof createClient>>
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('the source label of a scheme', () => {
  it('always begins "Official source", even when unreviewed records are being shown', async () => {
    vi.mocked(createClient).mockResolvedValue(clientFor(full))
    for (const beta of ['false', 'true']) {
      vi.stubEnv('CATALOG_RESEARCH_BETA', beta)
      const opportunity = await getPublishedOpportunity('a-scheme')
      expect(opportunity?.sourceLabel, `beta ${beta}`).toBe('Official source · Ministry of Fisheries')
    }
  })
})

describe('the fixed words a thin record falls back to', () => {
  // The scheme page hides these instead of showing them as if they were the record's own words, so
  // the page and the record must read the same strings: the page imports them, never copies them.
  it('are the ones a record with nothing to say really gets', async () => {
    vi.mocked(createClient).mockResolvedValue(clientFor(thin))
    const opportunity = await getPublishedOpportunity('a-scheme')
    expect(opportunity).toMatchObject({
      authority: AUTHORITY_FALLBACK,
      description: DESCRIPTION_FALLBACK,
      benefitLabel: BENEFIT_FALLBACK,
      processingTime: PROCESSING_FALLBACK,
      deadline: WINDOW_FALLBACK,
    })
  })

  it('are not what a record that does say something gets', async () => {
    vi.mocked(createClient).mockResolvedValue(clientFor(full))
    const opportunity = await getPublishedOpportunity('a-scheme')
    expect(opportunity?.authority).not.toBe(AUTHORITY_FALLBACK)
    expect(opportunity?.description).not.toBe(DESCRIPTION_FALLBACK)
    // The summary is also what the benefit line falls back on, so the two say the same.
    expect(opportunity?.benefitLabel).toBe('About it')
  })
})
