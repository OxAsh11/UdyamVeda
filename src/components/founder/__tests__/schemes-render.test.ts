import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { browseView } from '@/lib/founder/browse'
import { fisher } from '@/lib/founder/__tests__/ready-founder'
import type { OpportunitySummary } from '@/lib/opportunities/types'
import BrowseAll from '../BrowseAll'
import SchemesForYou from '../SchemesForYou'

// A made-up address, so a test shows the page uses the one it is given.
const ANSWER_HREF = '/answers-here'
const props = { lang: 'en' as const, answerHref: ANSWER_HREF, retryHref: '/dashboard/schemes?view=all', saved: [] }

describe('SchemesForYou', () => {
  it('sorts the schemes for a founder by verdict, with the ones that are not for them folded away', () => {
    const html = renderToStaticMarkup(createElement(SchemesForYou, { ...props, founder: fisher(), saved: [{ slug: 'a-scheme', name: 'A scheme' }] }))
    const order = ['Pond fish farming, Ranchi', 'You can apply now (3)', 'One step away (1)', 'Closed or waiting (3)', 'Saved for later', 'Not for you (2)']
    const places = order.map(text => html.indexOf(text))
    expect(places, html.slice(0, 300)).not.toContain(-1)
    expect(places).toEqual([...places].sort((left, right) => left - right))
    expect(html.match(/<article/g)).toHaveLength(9)
    expect(html).toMatch(/<details class="group[^>]*>s*<summary/)
    expect(html).not.toMatch(/<details[^>]* open/)
    expect(html).toContain('href="/dashboard/schemes/kisan-credit-card-animal-husbandry-fisheries"')
    // Both the card's question button and "Change my details" go where answers are changed.
    expect(html.match(new RegExp(`href="${ANSWER_HREF}"`, 'g'))!.length).toBeGreaterThanOrEqual(2)
    expect(html).toContain('Change my details')
    expect(html).not.toContain('/dashboard/settings')
  })

  it('hides a section with nothing in it, and says so when nothing fits at all', () => {
    const none = fisher()
    none.results = { ...none.results, counts: { A: 0, B: 0, C: 0, D: 0 }, buckets: { A: [], B: [], C: [], D: [] } }
    const html = renderToStaticMarkup(createElement(SchemesForYou, { ...props, founder: none }))
    expect(html).not.toContain('You can apply now')
    expect(html).not.toContain('Not for you')
    expect(html).toContain('Nothing fits your answers yet')
  })

  it('offers the questions, and no verdict, to someone with no answers', () => {
    const html = renderToStaticMarkup(createElement(SchemesForYou, { ...props, founder: { status: 'no_answers', bundle: null } }))
    expect(html).toContain('Tell us about you')
    expect(html).toContain(`href="${ANSWER_HREF}"`)
    expect(html).not.toContain('href="/start"')
    expect(html).not.toContain('Saved for later')
  })

  it('says results could not load, with a way to try again', () => {
    const html = renderToStaticMarkup(createElement(SchemesForYou, { ...props, founder: { status: 'unavailable' } }))
    expect(html).toContain('We could not load this just now')
    expect(html).toContain('href="/dashboard/schemes?view=all"')
  })

  it('lists saved schemes with a link to each, and leaves the list out when there are none', () => {
    const founder = { status: 'no_answers', bundle: null } as const
    const html = renderToStaticMarkup(createElement(SchemesForYou, { ...props, founder, saved: [{ slug: 'a-scheme', name: 'A <scheme>' }] }))
    expect(html).toContain('Saved for later')
    expect(html).toContain('href="/dashboard/schemes/a-scheme"')
    expect(html).toContain('A &lt;scheme&gt;')
  })
})

describe('BrowseAll', () => {
  const founder = { status: 'no_answers', bundle: null } as const
  const row = (overrides: Partial<OpportunitySummary>): OpportunitySummary => ({
    id: 'a-scheme', name: 'A scheme', type: 'scheme', category: 'grant', authority: 'A ministry', benefitLabel: 'Up to ₹1,00,000',
    benefitType: 'financial', description: '', officialUrl: '#', deadline: 'Rolling', processingTime: '', tags: [], status: 'active',
    coverage: 'central', sourceLabel: '', verificationStatus: 'verified', completeness: 1, ...overrides,
  })

  it('shows each scheme as a link with its name, authority, benefit and the verdict for the founder', () => {
    const rows = [row({ id: 'kisan-credit-card-animal-husbandry-fisheries', name: 'Kisan Credit Card' }), row({ id: 'cmegp-maharashtra', name: 'CMEGP' })]
    const view = browseView({ rows, availability: 'available', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { view, founder: fisher(), lang: 'en', type: '', group: '' }))
    expect(html).toContain('href="/dashboard/schemes/kisan-credit-card-animal-husbandry-fisheries"')
    expect(html).toContain('You qualify. We suggest you apply first.')
    expect(html).toContain('For Maharashtra only')
    expect(html).toContain('A ministry')
    expect(html).toContain('Up to ₹1,00,000')
  })

  it('shows no verdict beside a scheme when there are no answers to judge by', () => {
    const view = browseView({ rows: [row({})], availability: 'available', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { view, founder, lang: 'en', type: '', group: '' }))
    expect(html).toContain('A scheme')
    expect(html).not.toContain('You qualify')
    expect(html).not.toContain('Not matched')
  })

  it('keeps what was typed in the search box and says nothing matched', () => {
    const view = browseView({ rows: [], availability: 'available', query: "%' <", type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { view, founder, lang: 'en', type: '', group: '' }))
    expect(html).toContain('value="%&#x27; &lt;"')
    expect(html).toContain('No scheme matches')
    expect(html).not.toContain('temporarily unavailable')
  })

  it('says the schemes are temporarily unavailable when they could not be reached', () => {
    const view = browseView({ rows: [], availability: 'unavailable', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { view, founder, lang: 'en', type: '', group: '' }))
    expect(html).toContain('Schemes are temporarily unavailable')
    expect(html).not.toContain('No scheme matches')
  })
})
