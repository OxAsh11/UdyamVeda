import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { fisher } from '@/lib/founder/__tests__/ready-founder'
import { answerWordsFor, factLabelsOf } from '@/lib/founder/answers'
import SchemesLoading from '@/app/(dashboard)/dashboard/schemes/loading'
import SchemeLoading from '@/app/(dashboard)/dashboard/schemes/[slug]/loading'
import VerdictCard from '../VerdictCard'

// Shows the props a link was given, which a plain render of a link would hide.
vi.mock('next/link', () => ({
  default: ({ href, prefetch, children }: { href: string; prefetch?: boolean; children: ReactNode }) =>
    createElement('a', { href, 'data-prefetch': String(prefetch) }, children),
}))

describe('the link from a scheme card to its details', () => {
  it('is not prefetched: every prefetch would look the founder up again, and across hosts on the start page', () => {
    const founder = fisher()
    const item = founder.results.buckets.A[0]
    const html = renderToStaticMarkup(createElement(VerdictCard, {
      item, combination: founder.results.combination, lang: 'en', labels: factLabelsOf(founder.bundle),
      answerWords: answerWordsFor(founder.answers, founder.bundle), detailHref: `/dashboard/schemes/${item.slug}`,
    }))
    expect(html).toMatch(new RegExp(`href="/dashboard/schemes/${item.slug}" data-prefetch="false"`))
  })
})

describe('the loading screens', () => {
  it.each([['schemes', SchemesLoading], ['one scheme', SchemeLoading]] as const)('%s tells a screen reader it is loading and shows a shape of the page', (_name, Loading) => {
    const html = renderToStaticMarkup(createElement(Loading))
    expect(html).toContain('role="status"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('Loading')
    expect(html).toContain('animate-pulse')
  })
})
