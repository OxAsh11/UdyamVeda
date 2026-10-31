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
const props = { lang: 'en' as const, answerHref: ANSWER_HREF, retryHref: '/dashboard/schemes', saved: [] }

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
    // Back to the same page, not to Browse all.
    expect(html).toContain('href="/dashboard/schemes"')
    expect(html).not.toContain('view=all')
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
  const browseProps = { lang: 'en' as const, type: '', group: '', retryHref: '/dashboard/schemes' }
  const row = (overrides: Partial<OpportunitySummary>): OpportunitySummary => ({
    id: 'a-scheme', name: 'A scheme', type: 'scheme', category: 'grant', authority: 'A ministry', benefitLabel: 'Up to ₹1,00,000',
    benefitType: 'financial', description: '', officialUrl: '#', deadline: 'Rolling', processingTime: '', tags: [], status: 'active',
    coverage: 'central', sourceLabel: '', verificationStatus: 'verified', completeness: 1, ...overrides,
  })

  it('shows each scheme as a link with its name, authority, benefit and the verdict for the founder', () => {
    const rows = [row({ id: 'kisan-credit-card-animal-husbandry-fisheries', name: 'Kisan Credit Card' }), row({ id: 'cmegp-maharashtra', name: 'CMEGP' })]
    const view = browseView({ rows, availability: 'available', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder: fisher() }))
    expect(html).toContain('href="/dashboard/schemes/kisan-credit-card-animal-husbandry-fisheries"')
    expect(html).toContain('You qualify. We suggest you apply first.')
    expect(html).toContain('For Maharashtra only')
    expect(html).toContain('A ministry')
    expect(html).toContain('Up to ₹1,00,000')
  })

  it('shows no verdict beside a scheme when there are no answers to judge by', () => {
    const view = browseView({ rows: [row({})], availability: 'available', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder }))
    expect(html).toContain('A scheme')
    expect(html).not.toContain('You qualify')
    expect(html).not.toContain('Not matched')
  })

  it('keeps what was typed in the search box and says nothing matched', () => {
    const view = browseView({ rows: [], availability: 'available', query: "%' <", type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder }))
    expect(html).toContain('value="%&#x27; &lt;"')
    expect(html).toContain('No scheme matches')
    expect(html).not.toContain('temporarily unavailable')
  })

  it('says the schemes are temporarily unavailable when they could not be reached', () => {
    const view = browseView({ rows: [], availability: 'unavailable', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder }))
    expect(html).toContain('Schemes are temporarily unavailable')
    expect(html).not.toContain('No scheme matches')
  })

  it('sends Try again to the address it was given, not always to Browse all', () => {
    const view = browseView({ rows: [], availability: 'unavailable', query: '', type: '', group: '' })
    const html = renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder, retryHref: '/somewhere-else' }))
    expect(html).toContain('href="/somewhere-else"')
    expect(html).not.toContain('view=all')
  })

  describe('when a filter leaves nothing', () => {
    const empty = (query: string, type: string, group: string) => {
      const view = browseView({ rows: [], availability: 'available', query, type, group })
      return renderToStaticMarkup(createElement(BrowseAll, { ...browseProps, view, founder, type, group }))
    }

    it('says no scheme matches the filter, not that nothing is listed, and offers a way to clear it', () => {
      for (const [type, group] of [['grant', ''], ['', 'skills'], ['loan', 'skills']]) {
        const html = empty('', type, group)
        expect(html, `${type}/${group}`).toContain('No scheme matches this filter.')
        expect(html, `${type}/${group}`).not.toContain('listed here yet')
        expect(html, `${type}/${group}`).toContain('Clear the filter')
        // The way out drops the type and the kind, and nothing else.
        expect(html, `${type}/${group}`).toContain('href="/dashboard/schemes?view=all"')
      }
    })

    it('keeps the search when it clears the filter, and names the search in the message', () => {
      const html = empty('fish', 'grant', '')
      expect(html).toContain('No scheme matches “fish” in this filter.')
      expect(html).toContain('href="/dashboard/schemes?view=all&amp;q=fish"')
    })

    it('still says nothing is listed only when there is no filter and no search', () => {
      expect(empty('', '', '')).toContain('No schemes are listed here yet.')
      expect(empty('fish', '', '')).toContain('No scheme matches “fish”.')
      expect(empty('fish', '', '')).not.toContain('Clear the filter')
    })
  })
})
