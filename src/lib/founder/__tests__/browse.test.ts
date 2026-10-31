import { describe, expect, it } from 'vitest'
import type { OpportunitySummary } from '@/lib/opportunities/types'
import { seedBundle } from '@/lib/start/__tests__/seed-bundle'
import { answersLine, browseHref, browseTabCount, browseView, chipFor, cleanQuery, forYouCount, forYouShown, listNeeded, requestHref, savedSchemes } from '../browse'
import { ft } from '../text'
import { verdictFor } from '../verdict'
import { fisher as fisherFounder, NOW } from './ready-founder'

const bundle = seedBundle()

const KCC = 'kisan-credit-card-animal-husbandry-fisheries'
const MRSY = 'mukhyamantri-rojgar-srijan-yojana-jharkhand'
const PMMSY_SUBSIDY = 'pmmsy-beneficiary-oriented-subsidy'
const NLM = 'national-livestock-mission-entrepreneurship-development'
const CMEGP = 'cmegp-maharashtra'
const GST = 'gst-registration'
const CENTRAL_OUTSIDE = 'antariksh-venture-capital-fund'

const fisher = fisherFounder()

const labelOf = (factKey: string) => fisher.bundle.facts[factKey]?.label.en ?? factKey
const itemFor = (slug: string) => Object.values(fisher.results.buckets).flat().find(item => item.slug === slug)!

function summary(overrides: Partial<OpportunitySummary> = {}): OpportunitySummary {
  return {
    id: 'a-scheme',
    name: 'A scheme',
    type: 'scheme',
    category: 'grant',
    authority: 'A ministry',
    benefitLabel: 'Up to ₹1,00,000',
    benefitType: 'financial',
    description: 'About the scheme',
    officialUrl: 'https://example.gov.in',
    deadline: 'Rolling',
    processingTime: 'Varies',
    tags: [],
    status: 'active',
    coverage: 'central',
    sourceLabel: 'Official source',
    verificationStatus: 'verified',
    completeness: 1,
    ...overrides,
  }
}

const rows = [
  summary({ id: 'grant-one', name: 'Grant one', category: 'innovation_grant' }),
  summary({ id: 'loan-one', name: 'Loan one', category: 'concessional_loan' }),
  summary({ id: 'loan-two', name: 'Loan two', category: 'credit_guarantee' }),
  summary({ id: 'subsidy-one', name: 'Subsidy one', category: 'capital_subsidy' }),
  summary({ id: 'incubator-one', name: 'Incubator one', category: 'incubator' }),
]
const idsOf = (list: OpportunitySummary[]) => list.map(row => row.id)
const view = (overrides: Partial<Parameters<typeof browseView>[0]> = {}) =>
  browseView({ rows, availability: 'available', query: '', type: '', group: '', ...overrides })

describe('the real results this file reads', () => {
  it('put the expected schemes where the tests below expect them', () => {
    const bucketOf = (slug: string) => (['A', 'B', 'C', 'D'] as const).find(bucket => fisher.results.buckets[bucket].some(item => item.slug === slug))
    expect(bucketOf(KCC)).toBe('A')
    expect(bucketOf(MRSY)).toBe('B')
    expect(bucketOf(PMMSY_SUBSIDY)).toBe('C')
    expect(bucketOf(NLM)).toBe('D')
    expect(fisher.results.registrations.some(item => item.slug === GST)).toBe(true)
  })
})

describe('chipFor', () => {
  it("gives a verdict chip to a scheme in the founder's results, the same words the card uses", () => {
    for (const slug of [KCC, MRSY, PMMSY_SUBSIDY, NLM]) {
      const item = itemFor(slug)
      expect(chipFor(slug, fisher, 'en', NOW), slug).toEqual(verdictFor(item, fisher.results.combination, 'en', labelOf, NOW))
    }
    expect(chipFor(KCC, fisher, 'en', NOW)).toMatchObject({ tone: 'go' })
    expect(chipFor(MRSY, fisher, 'en', NOW)).toMatchObject({ tone: 'step', text: 'Answer 6 questions to find out.' })
    expect(chipFor(PMMSY_SUBSIDY, fisher, 'en', NOW)).toMatchObject({ tone: 'wait' })
    expect(chipFor(NLM, fisher, 'en', NOW)).toMatchObject({ tone: 'wait', text: 'Not for you' })
  })

  it('gives a grey chip to one outside them, and never a green one', () => {
    expect(chipFor(CMEGP, fisher, 'en', NOW)).toEqual({ tone: 'wait', text: 'For Maharashtra only', detail: null })
    expect(chipFor(GST, fisher, 'en', NOW)).toEqual({ tone: 'wait', text: 'See Registrations & licences', detail: null })
    expect(chipFor(CENTRAL_OUTSIDE, fisher, 'en', NOW)).toEqual({ tone: 'wait', text: 'Not matched to your work', detail: null })
    expect(chipFor('no-such-scheme', fisher, 'en', NOW)).toEqual({ tone: 'wait', text: 'We cannot check this for you yet.', detail: null })
  })

  it('names the chip in the chosen language', () => {
    expect(chipFor(CMEGP, fisher, 'hi', NOW)?.text).not.toBe(chipFor(CMEGP, fisher, 'en', NOW)?.text)
  })

  it('gives no chip to a founder with no answers, or when results could not load', () => {
    expect(chipFor(KCC, { status: 'no_answers', bundle: null }, 'en')).toBeNull()
    expect(chipFor(KCC, { status: 'no_answers', bundle }, 'en')).toBeNull()
    expect(chipFor(KCC, { status: 'unavailable' }, 'en')).toBeNull()
  })
})

describe('forYouCount', () => {
  it('counts every card in A, B, C and D, and not the registrations', () => {
    const { counts } = fisher.results
    expect(forYouCount(fisher.results)).toBe(counts.A + counts.B + counts.C + counts.D)
    expect(forYouCount(fisher.results)).toBe(9)
    expect(fisher.results.registrations.length).toBeGreaterThan(0)
  })
})

describe('listNeeded', () => {
  it('skips the list for a ready founder on For you, where it is not shown', () => {
    expect(listNeeded(fisher, false)).toBe(false)
  })

  it('reads the list when it is shown: browsing, or the states that show it under their message', () => {
    expect(listNeeded(fisher, true)).toBe(true)
    expect(listNeeded({ status: 'no_answers', bundle: null }, false)).toBe(true)
    expect(listNeeded({ status: 'unavailable' }, false)).toBe(true)
    expect(listNeeded({ status: 'unavailable' }, true)).toBe(true)
  })
})

describe('forYouShown', () => {
  const nothing = [{ status: 'no_answers', bundle: null }, { status: 'unavailable' }] as const

  it('shows For you to a ready founder who is not browsing, and not to one who is', () => {
    expect(forYouShown(fisher, false)).toBe(true)
    expect(forYouShown(fisher, true)).toBe(false)
  })

  it('shows it to a founder with nothing to sort, browsing or not, since their message sits above the list', () => {
    for (const founder of nothing) {
      expect(forYouShown(founder, false)).toBe(true)
      expect(forYouShown(founder, true)).toBe(true)
    }
  })

  it('never leaves a founder with neither view', () => {
    for (const founder of [fisher, ...nothing]) {
      for (const browsing of [false, true]) expect(forYouShown(founder, browsing) || listNeeded(founder, browsing)).toBe(true)
    }
  })
})

describe('requestHref', () => {
  it('is the plain page when the founder was not browsing, so Try again returns to their own schemes', () => {
    expect(requestHref({ browsing: false, q: '', type: '', group: '' })).toBe('/dashboard/schemes')
  })

  it('is Browse all with the same search, type and kind when they were', () => {
    const link = new URL(requestHref({ browsing: true, q: "fish %'", type: 'loan', group: 'loan_credit' }), 'http://localhost')
    expect(link.pathname).toBe('/dashboard/schemes')
    expect(Object.fromEntries(link.searchParams)).toEqual({ view: 'all', q: "fish %'", type: 'loan', group: 'loan_credit' })
    expect(requestHref({ browsing: true, q: '', type: '', group: '' })).toBe('/dashboard/schemes?view=all')
  })
})

describe('browseTabCount', () => {
  const list = (count: number, availability: 'available' | 'unavailable' = 'available') => ({ items: Array.from({ length: count }, () => summary()), availability })

  it('takes the count from the catalog the results came from when the list was not read', () => {
    expect(browseTabCount(fisher, null, '')).toBe(fisher.catalog.records.length)
    expect(fisher.catalog.records.length).toBeGreaterThan(100)
  })

  it('takes the count from the list when it was read, but not for a search, which counts matches', () => {
    expect(browseTabCount(fisher, list(12), '')).toBe(12)
    expect(browseTabCount(fisher, list(3), 'fish')).toBeNull()
  })

  it('gives no count when the list could not be read, or when there is no tab to count', () => {
    expect(browseTabCount(fisher, list(0, 'unavailable'), '')).toBeNull()
    expect(browseTabCount({ status: 'no_answers', bundle: null }, null, '')).toBeNull()
    expect(browseTabCount({ status: 'unavailable' }, null, '')).toBeNull()
  })
})

describe('browseView', () => {
  it('lists every row when nothing narrows it', () => {
    const all = view()
    expect(all.kind).toBe('list')
    expect(idsOf(all.rows)).toEqual(idsOf(rows))
  })

  it('finds nothing without pretending the catalog is empty', () => {
    const found = view({ rows: [], query: 'zzzz' })
    expect(found.kind).toBe('none_found')
    expect(found.rows).toEqual([])
    expect(found.query).toBe('zzzz')
  })

  it('says when the catalog cannot be reached, whatever rows it was handed', () => {
    const down = view({ rows: [], availability: 'unavailable' })
    expect(down).toMatchObject({ kind: 'unavailable', rows: [], groups: [] })
    expect(view({ availability: 'unavailable' }).rows).toEqual([])
  })

  it('filters by type and by group', () => {
    const loans = view({ type: 'loan' })
    expect(idsOf(loans.rows)).toEqual(['loan-one', 'loan-two', 'subsidy-one'])
    expect(loans.groups).toEqual([
      { id: 'loan_credit', label: 'Loans & credit', count: 2 },
      { id: 'subsidy_incentive', label: 'Subsidies & incentives', count: 1 },
    ])

    // A group narrows the list, but the other groups stay on offer.
    const subsidies = view({ type: 'loan', group: 'subsidy_incentive' })
    expect(idsOf(subsidies.rows)).toEqual(['subsidy-one'])
    expect(subsidies.groups).toEqual(loans.groups)

    expect(idsOf(view({ group: 'grant' }).rows)).toEqual(['grant-one'])
    expect(view({ type: 'grant', group: 'skills' }).kind).toBe('none_found')
  })

  it('lists the groups in the taxonomy order, with counts for the whole list', () => {
    expect(view().groups.map(group => group.id)).toEqual(['grant', 'loan_credit', 'subsidy_incentive', 'incubation'])
    expect(view().groups.reduce((sum, group) => sum + group.count, 0)).toBe(rows.length)
  })

  it('ignores a type or group it does not know, including names every object has', () => {
    for (const unknown of ['bogus', 'constructor', '__proto__', 'toString']) {
      expect(idsOf(view({ type: unknown }).rows), unknown).toEqual(idsOf(rows))
      expect(idsOf(view({ group: unknown }).rows), unknown).toEqual(idsOf(rows))
    }
  })

  it('treats a search full of symbols as no matches, and keeps what was typed', () => {
    const symbols = view({ rows: [], query: "%' <" })
    expect(symbols.kind).toBe('none_found')
    expect(symbols.rows).toEqual([])
    expect(symbols.query).toBe("%' <")
    const link = new URL(browseHref({ q: symbols.query }), 'http://localhost')
    expect(link.pathname).toBe('/dashboard/schemes')
    expect(link.searchParams.get('q')).toBe("%' <")
  })
})

describe('browseHref', () => {
  it('keeps the search and the type on a filter link', () => {
    const link = new URL(browseHref({ q: 'fish farming', type: 'loan', group: 'loan_credit' }), 'http://localhost')
    expect(link.pathname).toBe('/dashboard/schemes')
    expect(Object.fromEntries(link.searchParams)).toEqual({ view: 'all', q: 'fish farming', type: 'loan', group: 'loan_credit' })
  })

  it('leaves out what is empty', () => {
    expect(browseHref({})).toBe('/dashboard/schemes?view=all')
    expect(browseHref({ q: '', type: 'grant' })).toBe('/dashboard/schemes?view=all&type=grant')
  })
})

describe('cleanQuery', () => {
  it('trims, takes the first of a repeated parameter, and drops what is not text', () => {
    expect(cleanQuery('  fish  ')).toBe('fish')
    expect(cleanQuery(['fish', 'poultry'])).toBe('fish')
    expect(cleanQuery(undefined)).toBe('')
    expect(cleanQuery([])).toBe('')
  })

  it('removes control characters a database cannot store, and keeps a very long search short', () => {
    expect(cleanQuery('fi\u0000sh\u001f farm')).toBe('fi sh  farm')
    expect(cleanQuery('x'.repeat(500))).toHaveLength(100)
  })

  it('keeps symbols, which are searched for as typed', () => {
    expect(cleanQuery("%' <")).toBe("%' <")
  })
})

describe('answersLine', () => {
  const labelFor = (factKey: string, value: string, lang: 'en' | 'hi' | 'mr' = 'en') =>
    bundle.facts[factKey].options.find(option => option.value === value)!.label[lang]
  const activity = (lang: 'en' | 'hi' | 'mr' = 'en') => bundle.activities.find(item => item.id === 'pond_fish')!.label[lang]

  it('sums up the answers in one line, in the order a person tells them', () => {
    const line = answersLine(fisher.answers, bundle, 'en')
    const wanted = [activity(), 'Ranchi', labelFor('state', 'jharkhand'), labelFor('stage', 'setting_up'), labelFor('project_cost_band', '5l_10l')]
    const places = wanted.map(label => line.indexOf(label))
    expect(places, line).not.toContain(-1)
    expect(places).toEqual([...places].sort((left, right) => left - right))
    expect(line.endsWith('project')).toBe(true)
  })

  it('leaves out what was not answered, and what was answered with "don\'t know" or "prefer not to say"', () => {
    const line = answersLine({ activity_codes: ['pond_fish'], state: 'jharkhand', stage: 'dont_know', district: 'prefer_not' }, bundle, 'en')
    expect(line).toBe(`${activity()}, ${labelFor('state', 'jharkhand')}`)
    expect(answersLine({}, bundle, 'en')).toBe('')
  })

  it('uses the exact project cost when the founder gave one', () => {
    const line = answersLine({ activity_codes: ['pond_fish'], project_cost_band: '5l_10l', project_cost_exact_inr: 800000 }, bundle, 'en')
    expect(line).toContain('₹8,00,000')
    expect(line).not.toContain(labelFor('project_cost_band', '5l_10l'))
  })

  it('names the answers in the chosen language', () => {
    const line = answersLine(fisher.answers, bundle, 'hi')
    expect(line).toContain(activity('hi'))
    expect(line).toContain(labelFor('state', 'jharkhand', 'hi'))
    expect(line).not.toContain(activity('en'))
  })
})

describe('savedSchemes', () => {
  const row = (opportunity: unknown, status = 'saved') => ({ id: 'row', opportunity_id: 'o1', status, created_at: '2026-10-30T00:00:00Z', opportunity })

  it('reads the joined scheme whether the database sends one object or a list of one', () => {
    expect(savedSchemes([
      row({ id: 'o1', slug: 'scheme-one', name: 'Scheme one' }),
      row([{ id: 'o2', slug: 'scheme-two', name: 'Scheme two' }]),
    ])).toEqual([{ slug: 'scheme-one', name: 'Scheme one' }, { slug: 'scheme-two', name: 'Scheme two' }])
  })

  it('keeps the order it was given', () => {
    const list = savedSchemes([row({ slug: 'b', name: 'B' }), row({ slug: 'a', name: 'A' })])
    expect(list.map(item => item.slug)).toEqual(['b', 'a'])
  })

  it('shows only what is saved for later, not a scheme that has moved on to an application', () => {
    expect(savedSchemes([row({ slug: 'a', name: 'A' }, 'started'), row({ slug: 'b', name: 'B' }, 'applied')])).toEqual([])
  })

  it('skips a row with no usable scheme, and reads nothing from what is not a list', () => {
    expect(savedSchemes([row(null), row([]), row({ slug: 'a' }), row({ name: 'A' }), row({ slug: 7, name: 'A' }), null, 'x'])).toEqual([])
    expect(savedSchemes(null)).toEqual([])
    expect(savedSchemes({ data: [] })).toEqual([])
  })
})

describe('ft', () => {
  it('fills in the values it is given', () => {
    expect(ft('tabForYou')).toBe('For you')
    expect(ft('tabForYouCount', { count: 9 })).toBe('For you (9)')
    expect(ft('noMatch', { query: "%' <" })).toContain("%' <")
  })

  it('carries the final decision line', () => {
    expect(ft('finalDecision')).toContain('The final decision is made by the bank or department')
  })
})
