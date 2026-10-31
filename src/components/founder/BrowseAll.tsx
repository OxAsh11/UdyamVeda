import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Card, StatusChip } from '@/components/ui/founder'
import { browseHref, chipFor, SCHEMES_PATH, type BrowseView } from '@/lib/founder/browse'
import type { FounderResults } from '@/lib/founder/load-results'
import { ft } from '@/lib/founder/text'
import { TYPE_FILTERS } from '@/lib/opportunities/compat'
import { t } from '@/lib/start/i18n'
import type { Lang } from '@/lib/start/types'
import { cn } from '@/lib/utils'

const PILL = 'inline-flex min-h-11 items-center rounded-xl border px-4 text-sm font-semibold'
const LINK = 'inline-flex min-h-11 items-center text-sm font-bold text-act-ink underline underline-offset-2'

/** A tab or filter: dark when it is the one showing. */
export const pillClass = (on: boolean) => cn(PILL, on ? 'border-ink bg-ink text-paper' : 'border-line bg-card text-ink-2')

// An empty list is "nothing matches" for a search or a filter, and "nothing listed" only when neither narrowed it.
function emptyMessage(query: string, filtered: boolean) {
  if (filtered) return query ? ft('noMatchQueryFilter', { query }) : ft('noMatchFilter')
  return query ? ft('noMatch', { query }) : ft('noSchemes')
}

type Props = {
  view: BrowseView
  founder: FounderResults
  lang: Lang
  // Both already checked against the ones we have.
  type: string
  group: string
  // The page as it was asked for, for Try again.
  retryHref: string
}

/** Every scheme in the list, with the founder's verdict beside each. Search is a plain form and the filters are links, so none of it needs scripts. */
export default function BrowseAll({ view, founder, lang, type, group, retryHref }: Props) {
  const { query } = view
  const filtered = type !== '' || group !== ''
  const total = view.groups.reduce((sum, item) => sum + item.count, 0)
  const current = view.groups.find(item => item.id === group)

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-ink">{ft('browseTitle')}</h2>

      <form action={SCHEMES_PATH} role="search" className="flex flex-wrap gap-2">
        <input type="hidden" name="view" value="all" />
        {type ? <input type="hidden" name="type" value={type} /> : null}
        <label htmlFor="scheme-search" className="sr-only">{ft('searchLabel')}</label>
        <input
          id="scheme-search"
          name="q"
          type="search"
          defaultValue={query}
          maxLength={100}
          placeholder={ft('searchPlaceholder')}
          className="min-h-11 min-w-0 flex-[1_1_14rem] rounded-xl border border-line bg-card px-4 text-base text-ink"
        />
        <button type="submit" className={pillClass(true)}>{ft('searchButton')}</button>
        {query ? <Link href={browseHref({ type })} className={pillClass(false)}>{ft('clearSearch')}</Link> : null}
      </form>

      {type ? (
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-ink-2">
          {ft('showing')}
          <span className="rounded-full bg-act-soft px-2.5 py-1 text-xs font-bold text-act-ink">{TYPE_FILTERS[type].label}</span>
          <Link href={browseHref({ q: query })} className={LINK}>{ft('showAllTypes')}</Link>
        </p>
      ) : null}

      {view.kind === 'unavailable' ? (
        <Card>
          <div role="alert" className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-ink">{ft('browseUnavailableTitle')}</h3>
            <p className="text-sm text-ink-2">{ft('browseUnavailableBody')}</p>
            <div><Link href={retryHref} className={LINK}>{t(lang, 'tryAgain')}</Link></div>
          </div>
        </Card>
      ) : null}

      {view.groups.length > 1 ? (
        // Folded away so a phone sees the results first; the open one still shows in the summary.
        <details className="group rounded-2xl border border-line bg-card">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm font-semibold text-ink">
            <span className="min-w-0 break-words">{ft('groupsCurrent', { current: current ? ft('groupCount', { label: current.label, count: current.count }) : ft('groupAll', { count: total }) })}</span>
            <ChevronDown className="size-4 shrink-0 transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <nav aria-label={ft('groupsLabel')} className="px-4 pb-4">
            <ul className="flex flex-wrap gap-2">
              <li>
                <Link href={browseHref({ q: query, type })} aria-current={group ? undefined : 'true'} className={pillClass(!group)}>
                  {ft('groupAll', { count: total })}
                </Link>
              </li>
              {view.groups.map(item => (
                <li key={item.id}>
                  <Link
                    href={browseHref({ q: query, type, group: item.id })}
                    aria-current={group === item.id ? 'true' : undefined}
                    className={pillClass(group === item.id)}
                  >
                    {ft('groupCount', { label: item.label, count: item.count })}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      ) : null}

      {view.kind === 'none_found' ? (
        <Card>
          <div className="flex flex-col gap-3">
            <p className="text-sm text-ink-2">{emptyMessage(query, filtered)}</p>
            {filtered ? <div><Link href={browseHref({ q: query })} className={LINK}>{ft('clearFilter')}</Link></div> : null}
          </div>
        </Card>
      ) : null}

      {view.kind === 'list' ? (
        <ul className="flex flex-col gap-2">
          {view.rows.map(row => {
            const chip = chipFor(row.id, founder, lang)
            return (
              <li key={row.id}>
                <Link
                  href={`/dashboard/schemes/${encodeURIComponent(row.id)}`}
                  prefetch={false}
                  className="flex flex-col gap-1.5 rounded-2xl border border-line bg-card p-4 text-ink hover:border-act"
                >
                  {chip ? <span><StatusChip tone={chip.tone} text={chip.text} /></span> : null}
                  <span className="text-base leading-snug font-bold break-words">{row.name}</span>
                  <span className="text-sm break-words text-ink-2">{row.authority}</span>
                  <span className="text-sm break-words">{row.benefitLabel}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </section>
  )
}
