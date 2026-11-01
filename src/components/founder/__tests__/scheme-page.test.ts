import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WINDOW_FALLBACK } from '@/lib/opportunities/display'
import { AUTHORITY_FALLBACK, BENEFIT_FALLBACK, DESCRIPTION_FALLBACK, getPublishedOpportunity, PROCESSING_FALLBACK } from '@/lib/opportunities/published'
import type { OpportunityDetail } from '@/lib/opportunities/types'
import SchemePage from '@/app/(dashboard)/dashboard/schemes/[slug]/page'

// Nobody is signed in, so the page needs no database but the record itself.
vi.mock('@/lib/auth/mode', () => ({ AUTH_REQUIRED: false }))
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }))
vi.mock('@/lib/opportunities/published', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/opportunities/published')>(),
  getPublishedOpportunity: vi.fn(),
}))

function record(overrides: Partial<OpportunityDetail> = {}): OpportunityDetail {
  return {
    id: 'a-scheme',
    name: 'A scheme',
    type: 'loan',
    category: 'loan',
    authority: 'Ministry of Fisheries',
    benefitLabel: '40% subsidy on a loan',
    benefitType: 'loan',
    description: 'Credit for fish farmers.',
    officialUrl: 'https://example.gov.in',
    deadline: 'Open year-round',
    processingTime: '30 days',
    tags: [],
    status: 'active',
    coverage: 'central',
    sourceLabel: 'Official source · Ministry of Fisheries',
    verificationStatus: 'verified',
    completeness: 1,
    objective: null,
    legalBasis: null,
    eligibility: {},
    application: {},
    finePrint: {},
    benefits: [],
    requirements: [],
    steps: [],
    sources: [],
    ...overrides,
  }
}

// A record that says almost nothing, so every line the page could fill is one of the fixed fallbacks.
const THIN = record({
  authority: AUTHORITY_FALLBACK,
  description: DESCRIPTION_FALLBACK,
  benefitLabel: BENEFIT_FALLBACK,
  deadline: WINDOW_FALLBACK,
  processingTime: PROCESSING_FALLBACK,
  sourceLabel: 'Official source · Government authority',
  officialUrl: '#',
})

async function pageFor(opportunity: OpportunityDetail) {
  vi.mocked(getPublishedOpportunity).mockResolvedValue(opportunity)
  const element = await SchemePage({ params: Promise.resolve({ slug: 'a-scheme' }) })
  return renderToStaticMarkup(createElement('div', null, element))
}

describe('the scheme page for a record that says almost nothing', () => {
  beforeEach(() => {
    vi.mocked(getPublishedOpportunity).mockReset()
  })

  it('shows none of the fixed fallback words, as if they were the record\'s own', async () => {
    const html = await pageFor(THIN)
    for (const filler of [BENEFIT_FALLBACK, DESCRIPTION_FALLBACK, PROCESSING_FALLBACK, AUTHORITY_FALLBACK, WINDOW_FALLBACK, 'Government authority']) {
      expect(html, filler).not.toContain(filler)
    }
    // And no heading or label is left standing over nothing.
    for (const label of ['What the scheme gives', 'What it means in money', 'Application window', 'Processing time']) {
      expect(html, label).not.toContain(label)
    }
    expect(html).toContain('<h1')
    expect(html).toContain('A scheme')
  })

  it('still shows the page for the founder: the tell-us card, the fixed links and the final decision line', async () => {
    const html = await pageFor(THIN)
    expect(html).toContain('Tell us about you')
    expect(html).toContain('href="/dashboard/registration"')
    expect(html).toContain('href="/dashboard/documents"')
  })

  it('does not show the benefit as a tile when it only repeats the description', async () => {
    const html = await pageFor(record({ benefitLabel: 'Credit for fish farmers.' }))
    expect(html).not.toContain('What the scheme gives')
    expect(html.split('Credit for fish farmers.')).toHaveLength(2)
  })
})

describe('the words on the scheme page', () => {
  it('never show a code from the record, such as the groups the Credit Guarantee Scheme leaves out', async () => {
    const html = await pageFor(record({
      eligibility: { exclusions: ['agriculture', 'self_help_group', 'joint_liability_group'], entity_types: ['private_limited_company'] },
      application: { fees: 'free' },
    }))
    for (const words of ['Agriculture', 'Self help group', 'Joint liability group', 'Private limited company']) expect(html, words).toContain(words)
    expect(html).not.toMatch(/\b[a-z]+_[a-z_]+\b/)
  })
})

describe('the scheme page for a record that has its say', () => {
  it('shows what the record says, once each', async () => {
    const html = await pageFor(record())
    for (const text of ['Ministry of Fisheries', 'Credit for fish farmers.', 'Application window: Open year-round', 'Processing time: 30 days', 'In short', '40% subsidy on a loan']) {
      expect(html, text).toContain(text)
    }
    expect(html).toContain('href="https://example.gov.in"')
  })
})
