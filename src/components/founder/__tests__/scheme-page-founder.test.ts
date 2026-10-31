import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fisher } from '@/lib/founder/__tests__/ready-founder'
import { loadFounderResults } from '@/lib/founder/load-results'
import { getPublishedOpportunity } from '@/lib/opportunities/published'
import type { OpportunityDetail } from '@/lib/opportunities/types'
import SchemePage from '@/app/(dashboard)/dashboard/schemes/[slug]/page'

// A signed-in founder whose results are the real ones for a fish farmer in Jharkhand.
vi.mock('@/lib/auth/mode', () => ({ AUTH_REQUIRED: true }))
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'user-1' } } }) } }),
}))
vi.mock('@/lib/founder/load-results', () => ({ loadFounderResults: vi.fn() }))
vi.mock('@/lib/founder/detail', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/founder/detail')>(),
  loadSchemeState: async () => ({ applicationId: null, saved: false }),
  loadRateQuote: async () => null,
}))
vi.mock('@/lib/opportunities/published', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/opportunities/published')>(),
  getPublishedOpportunity: vi.fn(),
}))

const KCC = 'kisan-credit-card-animal-husbandry-fisheries'
const NOT_FOR_YOU = 'credit-guarantee-scheme-cgtmse'

function record(name: string): OpportunityDetail {
  return {
    id: 'a-scheme', name, type: 'loan', category: 'loan', authority: 'Ministry of Fisheries', benefitLabel: 'A loan', benefitType: 'loan',
    description: 'Credit for fish farmers.', officialUrl: 'https://example.gov.in', deadline: 'Open year-round', processingTime: '30 days',
    tags: [], status: 'active', coverage: 'central', sourceLabel: 'Official source · Ministry of Fisheries', verificationStatus: 'verified', completeness: 1,
    objective: null, legalBasis: null, eligibility: {}, application: {}, finePrint: {}, benefits: [], requirements: [], steps: [], sources: [],
  }
}

async function pageFor(slug: string) {
  vi.mocked(getPublishedOpportunity).mockResolvedValue(record(slug))
  const element = await SchemePage({ params: Promise.resolve({ slug }) })
  return renderToStaticMarkup(createElement('div', null, element))
}

// The part of the page that lists the answers behind the verdict.
const checkedList = (html: string) => html.slice(html.indexOf('What we checked'), html.indexOf('</ul>', html.indexOf('What we checked')))

describe('the answers a scheme page lists as checked', () => {
  beforeEach(() => {
    vi.mocked(loadFounderResults).mockResolvedValue(fisher())
  })

  it('tick an answer that matched', async () => {
    const list = checkedList(await pageFor(KCC))
    expect(list).toContain('You said: Pond fish farming')
    expect(list).toContain('lucide-check')
    expect(list).not.toContain('Does not match what the scheme asks')
  })

  it('do not tick the answer that ruled the scheme out, under a verdict that says it is not for the founder', async () => {
    const html = await pageFor(NOT_FOR_YOU)
    expect(html).toContain('Not for you')
    const list = checkedList(html)
    expect(list).toContain('You said: Pond fish farming')
    expect(list).toContain('Does not match what the scheme asks')
    expect(list).not.toContain('lucide-check')
    expect(list).toContain('lucide-minus')
  })
})

describe('the suggestion on a scheme page', () => {
  it('says what the scheme covers, between starting and what is left to arrange', async () => {
    vi.mocked(loadFounderResults).mockResolvedValue(fisher())
    const html = await pageFor(KCC)
    expect(html).toContain('Start here. This is in the best route we can confirm for your project. It can lend you up to ₹2,00,000. You will still need to arrange ₹3,00,000 – ₹8,00,000 from another route.')
  })
})
