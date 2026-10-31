// What the Schemes page works out before it draws anything: a chip for each scheme in
// the list, how the list is narrowed, the one-line summary of the founder's answers,
// and the links between the two views. None of it decides eligibility; chips come
// from the same wording as the cards.
import { stateLabel } from '@/lib/businesses/display'
import { TYPE_FILTERS } from '@/lib/opportunities/compat'
import type { ResultsPayload } from '@/lib/opportunities/engine/results'
import type { CatalogAvailability } from '@/lib/opportunities/published'
import { OPPORTUNITY_GROUPS, opportunityGroup, type OpportunityGroup } from '@/lib/opportunities/taxonomy'
import type { OpportunitySummary } from '@/lib/opportunities/types'
import type { Lang, StartBundle } from '@/lib/start/types'
import { answerText, factLabelsOf } from './answers'
import type { FounderResults } from './load-results'
import { ft } from './text'
import { outsideVerdict, verdictFor, type Verdict } from './verdict'

export const SCHEMES_PATH = '/dashboard/schemes'

const MAX_QUERY_LENGTH = 100

// A page address can repeat a name (?q=a&q=b); the first one is used.
type Param = string | string[] | undefined
const paramText = (value: Param) => (Array.isArray(value) ? value[0] : value) ?? ''

/** What was typed in the search box, made safe to search for. Symbols are kept: they are searched for as typed. */
export function cleanQuery(value: Param): string {
  // Control characters cannot be stored by the database, so a search holding one would fail as if the service were down.
  const text = paramText(value).replace(/\p{Cc}/gu, ' ').trim()
  return [...text].slice(0, MAX_QUERY_LENGTH).join('')
}

/** The type shortcut from a page address, or '' for one we do not have. */
export function knownType(value: Param): string {
  const type = paramText(value)
  return Object.hasOwn(TYPE_FILTERS, type) ? type : ''
}

/** The kind of scheme from a page address, or '' for one we do not have. */
export function knownGroup(value: Param): string {
  const group = paramText(value)
  return Object.hasOwn(OPPORTUNITY_GROUPS, group) ? group : ''
}

/** A link into Browse all that keeps the search and the type, so a filter never loses what was typed. */
export function browseHref({ q, type, group }: { q?: string; type?: string; group?: string }): string {
  const params = new URLSearchParams({ view: 'all' })
  if (q) params.set('q', q)
  if (type) params.set('type', type)
  if (group) params.set('group', group)
  return `${SCHEMES_PATH}?${params}`
}

/**
 * The short verdict beside a scheme in Browse all. A scheme in the founder's results
 * says what the card says; one outside them says why, in grey. Nothing is guessed for
 * a founder whose results are not ready.
 */
export function chipFor(slug: string, founder: FounderResults, lang: Lang, now: Date = new Date()): Verdict | null {
  if (founder.status !== 'ready') return null
  const { results, catalog, facts, bundle } = founder

  const item = Object.values(results.buckets).flat().find(result => result.slug === slug)
  if (item) {
    const labels = factLabelsOf(bundle)
    const labelOf = (factKey: string) => (Object.hasOwn(labels, factKey) ? labels[factKey][lang] : factKey.replace(/_/g, ' '))
    return verdictFor(item, results.combination, lang, labelOf, now)
  }
  return outsideVerdict(catalog.records.find(record => record.slug === slug), facts, lang, stateLabel)
}

/**
 * Whether the whole list has to be read. Only a view that shows it needs it: Browse all, or the
 * states with nothing to sort, which show it under their message. A ready founder on For you does not.
 */
export function listNeeded(founder: FounderResults, browsing: boolean): boolean {
  return browsing || founder.status !== 'ready'
}

/**
 * Whether the For you view is on the page, and with it the saved schemes it shows. A founder with
 * results sees it only when not browsing; one with nothing to sort sees it above their list either way.
 */
export function forYouShown(founder: FounderResults, browsing: boolean): boolean {
  return !browsing || founder.status !== 'ready'
}

/** The page as it was asked for, so "Try again" returns to the view that failed and not to another one. */
export function requestHref({ browsing, q, type, group }: { browsing: boolean; q: string; type: string; group: string }): string {
  return browsing ? browseHref({ q, type, group }) : SCHEMES_PATH
}

/**
 * The number on the Browse all tab, which only a ready founder has. Without the list it is the
 * size of the catalog their results came from; with it, the length of the list, but not for a
 * search, where the length is the number of matches and not the number of schemes.
 */
export function browseTabCount(
  founder: FounderResults,
  list: { items: readonly unknown[]; availability: CatalogAvailability } | null,
  query: string,
): number | null {
  if (list === null) return founder.status === 'ready' ? founder.catalog.records.length : null
  return query === '' && list.availability === 'available' ? list.items.length : null
}

/** The number of cards on For you: the four buckets, not the registrations. */
export function forYouCount(results: ResultsPayload): number {
  const { A, B, C, D } = results.counts
  return A + B + C + D
}

export type BrowseGroup = { id: string; label: string; count: number }
export type BrowseView = {
  kind: 'list' | 'none_found' | 'unavailable'
  rows: OpportunitySummary[]
  // The kinds present in the list before a kind is chosen, so choosing one keeps the others on offer.
  groups: BrowseGroup[]
  // What was typed, kept as typed so the search box still shows it when nothing matched.
  query: string
}

/**
 * Narrows the list for Browse all. An empty list is "none found", never "no schemes exist":
 * only an unreachable catalog is called unavailable.
 */
export function browseView({ rows, availability, query, type, group }: {
  rows: OpportunitySummary[]
  availability: CatalogAvailability
  query: string
  type: string
  group: string
}): BrowseView {
  const kept = query.trim()
  if (availability === 'unavailable') return { kind: 'unavailable', rows: [], groups: [], query: kept }

  const typeFilter = knownType(type)
  const chosen = knownGroup(group)
  const tagged = rows.map(row => ({ row, group: opportunityGroup(row.category) }))
  const ofType = typeFilter ? tagged.filter(entry => TYPE_FILTERS[typeFilter].groups.includes(entry.group)) : tagged

  const groups = (Object.keys(OPPORTUNITY_GROUPS) as OpportunityGroup[]).flatMap(id => {
    const count = ofType.filter(entry => entry.group === id).length
    return count > 0 ? [{ id, label: OPPORTUNITY_GROUPS[id], count }] : []
  })
  const shown = (chosen ? ofType.filter(entry => entry.group === chosen) : ofType).map(entry => entry.row)

  return { kind: shown.length > 0 ? 'list' : 'none_found', rows: shown, groups, query: kept }
}

// "I don't know" and "prefer not to say" are answers, but not ones to sort by.
const NOT_SORTED_BY = new Set(['dont_know', 'prefer_not'])

/** The founder's own answers in one line: what they do, where, how far along, and how big. */
export function answersLine(answers: Record<string, unknown>, bundle: StartBundle, lang: Lang): string {
  const named = (factKey: string) => {
    const value = answers[factKey]
    return typeof value === 'string' && NOT_SORTED_BY.has(value) ? null : answerText(factKey, value, bundle, lang)
  }
  const cost = named('project_cost_exact_inr') ?? named('project_cost_band')
  const parts = [
    ...['activity_codes', 'district', 'state', 'stage'].map(named),
    cost === null ? null : ft('answersProject', { cost }),
  ]
  return parts.filter((part): part is string => part !== null).join(', ')
}

export type SavedScheme = { slug: string; name: string }

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * The schemes a founder saved for later, from the rows the saved-schemes read returns.
 * A scheme that has moved on to an application is no longer "saved for later".
 */
export function savedSchemes(rows: unknown): SavedScheme[] {
  if (!Array.isArray(rows)) return []
  return rows.flatMap((row: unknown) => {
    if (!isRecord(row) || row.status !== 'saved') return []
    // The database sends a joined row as one object or as a list of one, depending on how it knows the link.
    const joined = Array.isArray(row.opportunity) ? row.opportunity[0] : row.opportunity
    if (!isRecord(joined) || typeof joined.slug !== 'string' || typeof joined.name !== 'string' || !joined.slug || !joined.name) return []
    return [{ slug: joined.slug, name: joined.name }]
  })
}
