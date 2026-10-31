import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import type { BenefitLines } from '@/lib/opportunities/engine/calculator'
import type { Combination, Relationship } from '@/lib/opportunities/engine/combination'
import type { RecordResult } from '@/lib/opportunities/engine/results'
import { t } from '@/lib/start/i18n'
import type { FounderResults } from '../load-results'
import {
  connectedSchemes, keepReady, loadRateQuote, loadSchemeState, moneyTiles, offersChecklist, recordSections, suggestionFor,
} from '../detail'
import { verdictFor } from '../verdict'
import { fisher as fisherFounder, NOW } from './ready-founder'

const KCC = 'kisan-credit-card-animal-husbandry-fisheries'
const MUDRA = 'pradhan-mantri-mudra-yojana'
const MKSSY = 'pradhan-mantri-matsya-kisan-samridhi-sah-yojana'
const NOT_FOR_YOU = 'credit-guarantee-scheme-cgtmse'
const OUTSIDE_STATE = 'cmegp-maharashtra'
const GST = 'gst-registration'

const fisher = fisherFounder()
const itemFor = (slug: string) => Object.values(fisher.results.buckets).flat().find(item => item.slug === slug)!
const labelOf = (factKey: string) => fisher.bundle.facts[factKey]?.label.en ?? factKey

function result(overrides: Partial<RecordResult> = {}): RecordResult {
  return {
    bucket: 'A',
    windowState: 'open',
    freshness: 'fresh',
    steps: [],
    bankChecks: [],
    blockers: [],
    decidedBy: [],
    failedFacts: [],
    id: 'rec-1',
    slug: 'a-scheme',
    title: 'A scheme',
    type: 'subsidy',
    status: 'active',
    lastCheckedAt: '2026-10-20T00:00:00Z',
    windows: [],
    applyRoute: null,
    benefitHeadline: null,
    aboveLimitInr: null,
    lines: null,
    ...overrides,
  }
}

function lines(overrides: Partial<BenefitLines> = {}): BenefitLines {
  return {
    projectCost: { min: 500000, max: 1000000 },
    own: null,
    subsidy: { min: 0, max: 0 },
    loan: null,
    uncovered: { min: 0, max: 0 },
    interestRatePct: null,
    interestSubventionPct: null,
    rateLabel: 'Standard rate',
    sourceUrl: 'https://example.gov.in',
    betterIfAnswered: [],
    ownShortfall: false,
    ceilingInr: null,
    aboveCeiling: false,
    straddlesCeiling: false,
    ifRenewed: false,
    ...overrides,
  }
}

const combination = (overrides: Partial<Combination> = {}): Combination => ({ recommended: [], alternatives: [], sequences: [], ...overrides })

describe('suggestionFor', () => {
  const START = 'Start here. This is in the best route we can confirm for your project.'

  it('suggests only for bucket A in the best route', () => {
    const inRoute = result({ id: 'a', lines: lines() })
    expect(suggestionFor(inRoute, combination({ recommended: ['a'] }), 'en')).toBe(START)
    // Open to the founder, but not in the best route.
    expect(suggestionFor(inRoute, combination({ recommended: ['b'] }), 'en')).toBeNull()
    expect(suggestionFor(inRoute, combination(), 'en')).toBeNull()
    // In the best route's list, but the rules do not say "apply now".
    for (const bucket of ['B', 'C', 'D'] as const) {
      expect(suggestionFor(result({ id: 'a', bucket, lines: lines() }), combination({ recommended: ['a'] }), 'en'), bucket).toBeNull()
    }
  })

  it('says what is left to arrange in the suggestion', () => {
    const kcc = itemFor(KCC)
    expect(suggestionFor(kcc, fisher.results.combination, 'en'))
      .toBe(`${START} You will still need to arrange ₹3,00,000 – ₹8,00,000 from another route.`)
    // Nothing left over: the first sentence stands alone.
    const covered = result({ id: 'a', lines: lines({ uncovered: { min: 0, max: 0 } }) })
    expect(suggestionFor(covered, combination({ recommended: ['a'] }), 'en')).toBe(START)
  })

  it('makes no suggestion when the amount is unknown', () => {
    expect(suggestionFor(result({ id: 'a', lines: null }), combination({ recommended: ['a'] }), 'en')).toBeNull()
  })
})

describe('moneyTiles', () => {
  it('shows loan, interest, free money and still to arrange', () => {
    expect(moneyTiles(itemFor(KCC).lines!, 'en')).toEqual([
      { label: 'Loan you can get', value: 'Up to ₹2,00,000', note: 'You repay this', tone: 'plain' },
      { label: 'Interest if you repay on time', value: '4%', note: '7% otherwise', tone: 'go' },
      { label: 'Free money', value: '₹0', note: 'This is credit, not a subsidy', tone: 'plain' },
      { label: 'Still to arrange', value: '₹3,00,000 – ₹8,00,000', note: 'From your own money or a bank. The scheme does not say how to split it.', tone: 'step' },
    ])
  })

  it('says "Up to" only when the scheme states no share of your own', () => {
    const loan = { min: 200000, max: 200000 }
    expect(moneyTiles(lines({ loan }), 'en')[0].value).toBe('Up to ₹2,00,000')
    const worked = moneyTiles(lines({ loan, own: { min: 50000, max: 50000 } }), 'en')
    expect(worked[0].value).toBe('₹2,00,000')
  })

  it('keeps the shortfall note off when the scheme splits the money itself', () => {
    const tiles = moneyTiles(lines({ own: { min: 50000, max: 50000 }, uncovered: { min: 100000, max: 200000 } }), 'en')
    expect(tiles.find(tile => tile.label === 'Still to arrange')).toEqual({ label: 'Still to arrange', value: '₹1,00,000 – ₹2,00,000', note: null, tone: 'step' })
  })

  it('shows free money in green, with no credit note, and leaves out a loan that is not there', () => {
    const tiles = moneyTiles(lines({ subsidy: { min: 200000, max: 400000 }, uncovered: { min: 300000, max: 600000 } }), 'en')
    expect(tiles.map(tile => tile.label)).toEqual(['Free money', 'Still to arrange'])
    expect(tiles[0]).toEqual({ label: 'Free money', value: '₹2,00,000 – ₹4,00,000', note: null, tone: 'go' })
  })

  it('leaves out a tile that has no value, and shows nothing when no line has one', () => {
    expect(moneyTiles(lines(), 'en')).toEqual([])
    // No subsidy and no loan: "credit, not a subsidy" would be untrue, so no free money tile.
    expect(moneyTiles(lines({ uncovered: { min: 100000, max: 200000 } }), 'en').map(tile => tile.label)).toEqual(['Still to arrange'])
  })

  it('shows the interest rate as it is when the scheme gives no relief, and rounds the net rate', () => {
    const loan = { min: 100000, max: 100000 }
    expect(moneyTiles(lines({ loan, interestRatePct: 9 }), 'en').find(tile => tile.label === 'Interest'))
      .toEqual({ label: 'Interest', value: '9%', note: null, tone: 'plain' })
    const rounded = moneyTiles(lines({ loan, interestRatePct: 7, interestSubventionPct: 2.1 }), 'en')
    expect(rounded.find(tile => tile.label === 'Interest if you repay on time')).toMatchObject({ value: '4.9%', note: '7% otherwise' })
  })

  it('says the figure depends on the scheme returning, when it does', () => {
    const tiles = moneyTiles(lines({ loan: { min: 100000, max: 100000 }, subsidy: { min: 1000, max: 2000 }, ifRenewed: true }), 'en')
    expect(tiles.map(tile => tile.label)).toEqual([
      'Loan, if it returns on the same terms', 'Free money, if it returns on the same terms',
    ])
  })
})

describe('keepReady', () => {
  const ask = (name: string, answers: Record<string, unknown>) => keepReady([{ name, required: true }], answers)[0]

  it('marks a document the founder said they have', () => {
    expect(ask('PAN card', { has_pan: true })).toEqual({ name: 'PAN card', required: true, have: true })
    expect(ask('PAN card', { has_pan: false }).have).toBe(false)
  })

  it('needs every fact for a combined document', () => {
    expect(ask('Aadhaar and PAN', { has_pan: true }).have).toBe(false)
    expect(ask('Aadhaar and PAN', { has_pan: true, aadhaar_mobile_linked: true }).have).toBe(true)
    expect(ask('Aadhaar, PAN and bank passbook', { has_pan: true, aadhaar_mobile_linked: true }).have).toBe(false)
  })

  it('does not claim a part of a document that no answer covers', () => {
    expect(ask('Aadhaar and address proof', { aadhaar_mobile_linked: true }).have).toBe(false)
    expect(ask('Project report and quotations', { has_pan: true }).have).toBe(false)
  })

  it('never marks "no" or "don\'t know" as having it', () => {
    for (const value of [false, 'no', 'dont_know', 'prefer_not', undefined, null]) {
      expect(ask('PAN card', { has_pan: value }).have, String(value)).toBe(false)
    }
    expect(ask('Udyam registration', { udyam_registered: 'dont_know' }).have).toBe(false)
  })

  it('reads the answers that are not yes or no, and counts only the ones that mean the founder has it', () => {
    const land = (value: string) => ask('Pond or land ownership papers or a registered lease', { land_or_pond_status: value }).have
    expect([land('owned'), land('family_owned'), land('registered_lease')]).toEqual([true, true, true])
    expect([land('informal_lease'), land('none'), land('dont_know')]).toEqual([false, false, false])
    const fssai = (value: string) => ask('FSSAI licence', { fssai_status: value }).have
    expect([fssai('basic_registration'), fssai('state_licence'), fssai('central_licence')]).toEqual([true, true, true])
    expect([fssai('none'), fssai('prefer_not')]).toEqual([false, false])
  })

  it('knows each document the brief names', () => {
    const cases: [string, string][] = [
      ['Aadhaar card', 'aadhaar_mobile_linked'],
      ['PAN card', 'has_pan'],
      ['Bank account passbook', 'has_bank_account'],
      ['Udyam registration', 'udyam_registered'],
      ['GST registration', 'gst_registered'],
      ['Shop Act licence', 'shop_act_registered'],
      ['Training certificate', 'training_certificate'],
      ['DPIIT recognition', 'dpiit_recognized'],
    ]
    for (const [name, factKey] of cases) expect(ask(name, { [factKey]: true }).have, name).toBe(true)
  })

  it('keeps what else the caller sent with each document, in order', () => {
    const kept = keepReady([{ name: 'PAN card', required: true, description: 'A copy' }, { name: 'Photo', required: false, description: null }], { has_pan: true })
    expect(kept).toEqual([
      { name: 'PAN card', required: true, description: 'A copy', have: true },
      { name: 'Photo', required: false, description: null, have: false },
    ])
  })
})

describe('connectedSchemes', () => {
  const kcc = itemFor(KCC)
  const mudra = itemFor(MUDRA)
  const mkssy = itemFor(MKSSY)
  const connected = (item: RecordResult) =>
    connectedSchemes(item, fisher.results, fisher.catalog.relationships, 'en', labelOf, NOW)

  it('links the best route and its alternatives both ways', () => {
    // The best route is just KCC; the other two are open to the founder but not confirmed with it.
    expect(connected(kcc).map(entry => entry.slug).sort()).toEqual([MKSSY, MUDRA].sort())
    expect(connected(mudra).map(entry => entry.slug)).toEqual([KCC])
    expect(connected(mkssy).map(entry => entry.slug)).toEqual([KCC])
  })

  it('gives each one its verdict from the same words as the cards, and says it is not confirmed together', () => {
    const [entry] = connected(mudra)
    expect(entry).toMatchObject({
      slug: KCC,
      title: kcc.title,
      verdict: verdictFor(kcc, fisher.results.combination, 'en', labelOf, NOW),
      note: t('en', 'notConfirmedWith', { names: mudra.title }),
    })
  })

  it('lists the other schemes of a best route as ones that can be taken together', () => {
    const a = result({ id: 'a', slug: 'a', title: 'Scheme A', lines: lines() })
    const b = result({ id: 'b', slug: 'b', title: 'Scheme B', lines: lines() })
    const results = { ...fisher.results, buckets: { ...fisher.results.buckets, A: [a, b] }, registrations: [], combination: combination({ recommended: ['a', 'b'] }) }
    expect(connectedSchemes(a, results, [], 'en', labelOf, NOW)).toEqual([
      { slug: 'b', title: 'Scheme B', verdict: { tone: 'go', text: t('en', 'verdictApplyFirst'), detail: null }, note: 'Can be taken together with this one.' },
    ])
  })

  it('explains a scheme that cannot be combined', () => {
    const a = result({ id: 'a', slug: 'a', title: 'Scheme A', lines: lines() })
    const b = result({ id: 'b', slug: 'b', title: 'Scheme B', lines: lines() })
    const exclusive = (noteEn: string | null): Relationship => ({ a: 'a', b: 'b', relation: 'exclusive', capRule: null, noteEn, sourceUrl: 'https://example.gov.in' })
    const results = {
      ...fisher.results,
      buckets: { ...fisher.results.buckets, A: [a, b] },
      registrations: [],
      combination: combination({ recommended: ['a'], alternatives: [{ id: 'b', excludedBy: ['a'], notConfirmedWith: [] }] }),
    }
    // Both ways, and the note is the one written for the pair.
    expect(connectedSchemes(a, results, [exclusive('B is not for anyone who took A.')], 'en', labelOf, NOW).map(entry => entry.note)).toEqual(['B is not for anyone who took A.'])
    expect(connectedSchemes(b, results, [exclusive('B is not for anyone who took A.')], 'en', labelOf, NOW).map(entry => entry.note)).toEqual(['B is not for anyone who took A.'])
    // No note written: the plain sentence names the scheme being read.
    expect(connectedSchemes(a, results, [exclusive(null)], 'en', labelOf, NOW)[0].note).toBe('Cannot be taken together with Scheme A.')
  })

  it('follows a stored relationship for a scheme the combination does not cover', () => {
    const waiting = itemFor('pmmsy-beneficiary-oriented-subsidy')
    const results = { ...fisher.results, combination: combination() }
    const row: Relationship = { a: waiting.id, b: kcc.id, relation: 'exclusive', capRule: null, noteEn: 'Not both.', sourceUrl: 'https://example.gov.in' }
    expect(connectedSchemes(waiting, results, [row], 'en', labelOf, NOW)).toMatchObject([{ slug: KCC, note: 'Not both.' }])
  })

  it('works for a scheme that is not in the founder\'s results, from the stored relationships alone', () => {
    const outside = fisher.catalog.records.find(record => record.slug === OUTSIDE_STATE)!
    const row: Relationship = { a: outside.id, b: kcc.id, relation: 'stackable', capRule: null, noteEn: null, sourceUrl: 'https://example.gov.in' }
    expect(connectedSchemes(outside, fisher.results, [row], 'en', labelOf, NOW).map(entry => entry.slug)).toEqual([KCC])
    expect(connectedSchemes(outside, fisher.results, fisher.catalog.relationships, 'en', labelOf, NOW)).toEqual([])
  })

  it('leaves out schemes that are not for the founder, and names a registration by where it is found', () => {
    const notForYou = itemFor(NOT_FOR_YOU)
    const registration = fisher.results.registrations.find(item => item.slug === GST)!
    const rows: Relationship[] = [
      { a: kcc.id, b: notForYou.id, relation: 'exclusive', capRule: null, noteEn: 'Not both.', sourceUrl: 'https://example.gov.in' },
      { a: registration.id, b: kcc.id, relation: 'sequential', capRule: null, noteEn: 'GST first.', sourceUrl: 'https://example.gov.in' },
    ]
    const entries = connectedSchemes(kcc, fisher.results, rows, 'en', labelOf, NOW)
    expect(entries.map(entry => entry.slug)).not.toContain(NOT_FOR_YOU)
    // A registration is on the founder's path, not a scheme to apply for.
    expect(entries.find(entry => entry.slug === GST)?.verdict).toEqual({ tone: 'wait', text: 'See Registrations & licences', detail: null })
  })

  it('lists a scheme once, however many ways it is connected', () => {
    const row: Relationship = { a: kcc.id, b: mudra.id, relation: 'conditional', capRule: null, noteEn: null, sourceUrl: 'https://example.gov.in' }
    const slugs = connectedSchemes(kcc, fisher.results, [row], 'en', labelOf, NOW).map(entry => entry.slug)
    expect(slugs.filter(slug => slug === MUDRA)).toHaveLength(1)
  })
})

describe('offersChecklist', () => {
  const ready = fisherFounder()

  it('offers the checklist for a scheme the founder can act on, and for a registration', () => {
    expect(offersChecklist(ready, KCC)).toBe(true)
    expect(offersChecklist(ready, 'pmmsy-beneficiary-oriented-subsidy')).toBe(true)
    expect(offersChecklist(ready, GST)).toBe(true)
  })

  it('does not offer it for a scheme the rules say is not for them, or one left out of their results', () => {
    expect(offersChecklist(ready, NOT_FOR_YOU)).toBe(false)
    expect(offersChecklist(ready, OUTSIDE_STATE)).toBe(false)
  })

  it('offers it when there is no verdict to go by', () => {
    const none: FounderResults[] = [{ status: 'no_answers', bundle: null }, { status: 'unavailable' }]
    for (const founder of none) expect(offersChecklist(founder, NOT_FOR_YOU)).toBe(true)
  })
})

describe('recordSections', () => {
  const record = (overrides: Partial<Parameters<typeof recordSections>[0]> = {}) =>
    recordSections({ eligibility: {}, application: {}, objective: null, legalBasis: null, steps: [], ...overrides })

  it('hides every section the record leaves empty', () => {
    expect(record()).toEqual({ eligibility: null, about: null, apply: null, steps: [] })
  })

  it('keeps who can apply, the objective, the legal basis, how to apply, selection and fees', () => {
    const sections = record({
      eligibility: { conditions: ['Aged 18 or more'], exclusions: ['Already got a subsidy'], thresholds: { max_project_cost: 1000000 }, entity_types: ['sole_proprietor'] },
      objective: 'Help new units start.',
      legalBasis: 'Scheme guidelines, 2024',
      application: { route: 'Apply on the portal.', selection: 'A district committee.', fees: 'No fee.' },
    })
    expect(sections.eligibility).toMatchObject({
      conditions: ['Aged 18 or more'],
      exclusions: ['Already got a subsidy'],
      chips: [{ label: 'Business types', values: ['Sole proprietor'] }],
      thresholds: [{ label: 'Max project cost', value: '10,00,000' }],
    })
    expect(sections.about).toEqual({ objective: 'Help new units start.', legalBasis: 'Scheme guidelines, 2024' })
    expect(sections.apply).toEqual({ route: 'Apply on the portal.', selection: 'A district committee.', fees: 'No fee.' })
  })

  it('shows one half of a pair when the other is empty', () => {
    expect(record({ legalBasis: 'The Act' }).about).toEqual({ objective: null, legalBasis: 'The Act' })
    expect(record({ application: { fees: 'No fee.' } }).apply).toEqual({ route: null, selection: null, fees: 'No fee.' })
  })

  it('leaves out a reviewer\'s working notes, wherever they sit', () => {
    const note = 'Do not infer an open call from this record.'
    const sections = record({
      objective: note,
      legalBasis: note,
      eligibility: { conditions: [note, 'Aged 18 or more'] },
      application: { route: note },
      steps: [
        { number: 1, title: note, description: null, officialUrl: null, expectedDays: null, dependsOn: [] },
        { number: 2, title: 'Visit a bank branch', description: null, officialUrl: null, expectedDays: null, dependsOn: [] },
      ],
    })
    expect(sections.about).toBeNull()
    expect(sections.apply).toBeNull()
    expect(sections.eligibility?.conditions).toEqual(['Aged 18 or more'])
    expect(sections.steps.map(step => step.title)).toEqual(['Visit a bank branch'])
  })
})

// Just enough of the Supabase client for the reads these helpers make.
type Table = { rows?: unknown[]; error?: { message: string }; throws?: boolean }
function fakeSupabase(tables: Record<string, Table>) {
  const reads: { table: string; filters: [string, string, unknown][] }[] = []
  const client = {
    from(table: string) {
      const read = { table, filters: [] as [string, string, unknown][] }
      reads.push(read)
      const config = tables[table] ?? {}
      const builder = {
        select: () => builder,
        order: () => builder,
        limit: () => builder,
        eq: (column: string, value: unknown) => { read.filters.push(['eq', column, value]); return builder },
        neq: (column: string, value: unknown) => { read.filters.push(['neq', column, value]); return builder },
        maybeSingle: async () => ({ data: config.rows?.[0] ?? null, error: config.error ?? null }),
        then: (done: (value: unknown) => void, fail: (reason: unknown) => void) => {
          if (config.throws) return fail(new Error('down'))
          return done({ data: config.error ? null : config.rows ?? [], error: config.error ?? null })
        },
      }
      return builder
    },
  } as unknown as SupabaseClient
  return { client, reads }
}

const BUSINESS: Record<string, Table> = {
  business_memberships: { rows: [{ business_id: 'business-1' }] },
  businesses: { rows: [{ id: 'business-1', active: true }] },
}

describe('loadSchemeState', () => {
  it('finds this founder\'s application for the scheme, and whether it is saved, by the scheme\'s slug', async () => {
    const { client, reads } = fakeSupabase({
      ...BUSINESS,
      applications: { rows: [{ id: 'app-1', status: 'started' }] },
      saved_opportunities: { rows: [{ status: 'saved' }] },
    })
    expect(await loadSchemeState(client, 'user-1', KCC)).toEqual({ applicationId: 'app-1', saved: true })
    for (const table of ['applications', 'saved_opportunities']) {
      const filters = reads.find(read => read.table === table)!.filters
      expect(filters, table).toContainEqual(['eq', 'business_id', 'business-1'])
      expect(filters, table).toContainEqual(['eq', 'opportunity.slug', KCC])
    }
    // A withdrawn application is over; starting again makes a new one.
    expect(reads.find(read => read.table === 'applications')!.filters).toContainEqual(['neq', 'status', 'withdrawn'])
  })

  it('says nothing is saved or started when the founder has done neither', async () => {
    const { client } = fakeSupabase({ ...BUSINESS, applications: { rows: [] }, saved_opportunities: { rows: [] } })
    expect(await loadSchemeState(client, 'user-1', KCC)).toEqual({ applicationId: null, saved: false })
  })

  it('does not call a scheme saved once it has become an application', async () => {
    const { client } = fakeSupabase({ ...BUSINESS, applications: { rows: [] }, saved_opportunities: { rows: [{ status: 'started' }] } })
    expect(await loadSchemeState(client, 'user-1', KCC)).toEqual({ applicationId: null, saved: false })
  })

  it('leaves the state out, rather than failing the page, when a read fails', async () => {
    const nothing = { applicationId: null, saved: false }
    for (const down of [{ error: { message: 'down' } }, { throws: true }]) {
      const { client } = fakeSupabase({ ...BUSINESS, applications: down, saved_opportunities: { rows: [{ status: 'saved' }] } })
      // The read that worked still counts.
      expect(await loadSchemeState(client, 'user-1', KCC)).toEqual({ ...nothing, saved: true })
    }
    const { client } = fakeSupabase({ business_memberships: { rows: [] } })
    expect(await loadSchemeState(client, 'user-1', KCC)).toEqual(nothing)
  })
})

describe('loadRateQuote', () => {
  const rows = [
    { label_en: 'General: 40%', quote: 'Forty per cent for general.', source_url: 'https://example.gov.in/a' },
    { label_en: 'Women: 60%', quote: 'Sixty per cent for women.', source_url: 'https://example.gov.in/b' },
  ]

  it('gives the quote of the rate the figures came from, and where it was said', async () => {
    const { client, reads } = fakeSupabase({ benefit_rates: { rows } })
    expect(await loadRateQuote(client, 'version-1', 'Women: 60%')).toEqual({ quote: 'Sixty per cent for women.', sourceUrl: 'https://example.gov.in/b' })
    expect(reads[0]).toEqual({ table: 'benefit_rates', filters: [['eq', 'opportunity_version_id', 'version-1']] })
  })

  it('gives no quote when no rate matches', async () => {
    const { client } = fakeSupabase({ benefit_rates: { rows } })
    expect(await loadRateQuote(client, 'version-1', 'Something else')).toBeNull()
    const none = fakeSupabase({ benefit_rates: { rows: [] } })
    expect(await loadRateQuote(none.client, 'version-1', 'Women: 60%')).toBeNull()
  })

  it('gives no quote, and does not fail the page, when the read fails', async () => {
    for (const down of [{ error: { message: 'down' } }, { throws: true }]) {
      const { client } = fakeSupabase({ benefit_rates: down })
      expect(await loadRateQuote(client, 'version-1', 'Women: 60%')).toBeNull()
    }
  })

  it('does not link a source that is not a secure address', async () => {
    const { client } = fakeSupabase({ benefit_rates: { rows: [{ label_en: 'A', quote: 'Said so.', source_url: 'javascript:alert(1)' }] } })
    expect(await loadRateQuote(client, 'version-1', 'A')).toBeNull()
  })

  it('does not show a quote that is empty', async () => {
    const { client } = fakeSupabase({ benefit_rates: { rows: [{ label_en: 'A', quote: '   ', source_url: 'https://example.gov.in' }] } })
    expect(await loadRateQuote(client, 'version-1', 'A')).toBeNull()
  })
})
