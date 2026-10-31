import Link from 'next/link'
import BrowseAll, { pillClass } from '@/components/founder/BrowseAll'
import SchemesForYou from '@/components/founder/SchemesForYou'
import { PageHeader } from '@/components/ui/founder'
import { AUTH_REQUIRED } from '@/lib/auth/mode'
import { browseHref, browseTabCount, browseView, cleanQuery, forYouCount, forYouShown, knownGroup, knownType, listNeeded, requestHref, SCHEMES_PATH, type SavedScheme } from '@/lib/founder/browse'
import type { FounderResults } from '@/lib/founder/load-results'
import { loadSchemesFounder } from '@/lib/founder/load-schemes-view'
import { ft } from '@/lib/founder/text'
import { searchPublishedOpportunities } from '@/lib/opportunities/published'
import { createClient } from '@/lib/supabase/server'
import type { Lang } from '@/lib/start/types'

// The page is English for now; the words are translated in M5.
const LANG: Lang = 'en'
// Where a founder answers what a card still needs and changes the answers the list is sorted by.
// Task 10 gives this its own page; until then it is where the answers live.
const ANSWER_HREF = '/start/results'

type Query = Record<'view' | 'q' | 'type' | 'group', string | string[] | undefined>

/** The founder's results and saved schemes. Anyone we cannot look up is shown the same as someone with no answers. */
async function loadFounder(browsing: boolean): Promise<{ founder: FounderResults; saved: SavedScheme[] }> {
  const nobody = { founder: { status: 'no_answers', bundle: null } as const, saved: [] }
  if (!AUTH_REQUIRED) return nobody

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return nobody

  return loadSchemesFounder(supabase, user.id, browsing)
}

export default async function SchemesPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams
  const query = cleanQuery(params.q)
  const type = knownType(params.type)
  const group = knownGroup(params.group)
  // A search or a shortcut from Home is a request to browse.
  const browsing = params.view === 'all' || query !== '' || type !== ''

  // The type and the kind are narrowed here, not by the database, so only a search is sent to it.
  const readList = () => searchPublishedOpportunities(query || undefined, undefined, undefined, 500)
  // Browse all needs the list whoever is looking, so it is read alongside the founder; otherwise
  // it is read only for a founder with nothing to sort, once that is known.
  const earlyList = browsing ? readList() : null
  const { founder, saved } = await loadFounder(browsing)
  const list = earlyList ? await earlyList : listNeeded(founder, browsing) ? await readList() : null

  const ready = founder.status === 'ready' ? founder : null
  // Someone with nothing to sort sees their prompt first and the whole list under it; no tabs, as there is nothing to switch to.
  const showForYou = forYouShown(founder, browsing)
  const showBrowse = listNeeded(founder, browsing)
  const total = browseTabCount(founder, list, query)
  // Try again returns to the view that failed: someone who asked for their own schemes is not sent to Browse all.
  const retryHref = requestHref({ browsing, q: query, type, group })

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-5 md:p-8">
      <PageHeader title={ft('title')} sub={ready ? ft('finalDecision') : undefined} />

      {ready ? (
        <nav aria-label={ft('viewsLabel')}>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href={SCHEMES_PATH} aria-current={browsing ? undefined : 'page'} className={pillClass(!browsing)}>
                {ft('tabForYouCount', { count: forYouCount(ready.results) })}
              </Link>
            </li>
            <li>
              <Link href={browseHref({})} aria-current={browsing ? 'page' : undefined} className={pillClass(browsing)}>
                {total === null ? ft('tabBrowse') : ft('tabBrowseCount', { count: total })}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}

      {showForYou ? (
        <SchemesForYou
          founder={founder}
          lang={LANG}
          answerHref={ANSWER_HREF}
          retryHref={retryHref}
          saved={saved}
        />
      ) : null}

      {showBrowse && list ? (
        <BrowseAll
          view={browseView({ rows: list.items, availability: list.availability, query, type, group })}
          founder={founder}
          lang={LANG}
          type={type}
          group={group}
          retryHref={retryHref}
        />
      ) : null}
    </div>
  )
}
