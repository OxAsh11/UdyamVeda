import Link from 'next/link'
import BrowseAll, { pillClass } from '@/components/founder/BrowseAll'
import SchemesForYou from '@/components/founder/SchemesForYou'
import { PageHeader } from '@/components/ui/founder'
import { AUTH_REQUIRED } from '@/lib/auth/mode'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { browseHref, browseView, cleanQuery, forYouCount, knownGroup, knownType, savedSchemes, SCHEMES_PATH, type SavedScheme } from '@/lib/founder/browse'
import { loadFounderResults, type FounderResults } from '@/lib/founder/load-results'
import { ft } from '@/lib/founder/text'
import { searchPublishedOpportunities } from '@/lib/opportunities/published'
import { createClient } from '@/lib/supabase/server'
import type { Lang } from '@/lib/start/types'

// The page is English for now; the words are translated in M5.
const LANG: Lang = 'en'
// Where a card sends someone to answer what it still needs. Task 10 gives these questions their own page.
const ANSWER_HREF = '/start/results'
// Where a founder changes the answers the list is sorted by.
const CHANGE_HREF = '/dashboard/settings'

type Query = Record<'view' | 'q' | 'type' | 'group', string | string[] | undefined>

/** The founder's results and saved schemes. Anyone we cannot look up is shown the same as someone with no answers. */
async function loadFounder(): Promise<{ founder: FounderResults; saved: SavedScheme[] }> {
  const nobody = { founder: { status: 'no_answers', bundle: null } as const, saved: [] }
  if (!AUTH_REQUIRED) return nobody

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return nobody

  const [founder, saved] = await Promise.all([loadFounderResults(supabase, user.id), loadSaved(supabase, user.id)])
  return { founder, saved }
}

/** Saved schemes, read the way the saved-schemes route reads them. If the read fails the list is left out, not the page. */
async function loadSaved(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<SavedScheme[]> {
  try {
    const { business } = await getBusinessForUser(supabase, userId)
    if (!business) return []
    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('id, opportunity_id, status, created_at, opportunity:opportunities(id, slug, name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
    return error ? [] : savedSchemes(data)
  } catch {
    return []
  }
}

export default async function SchemesPage({ searchParams }: { searchParams: Promise<Query> }) {
  const params = await searchParams
  const query = cleanQuery(params.q)
  const type = knownType(params.type)
  const group = knownGroup(params.group)
  // A search or a shortcut from Home is a request to browse.
  const browsing = params.view === 'all' || query !== '' || type !== ''

  // The type and the kind are narrowed here, not by the database, so only a search needs its own request.
  const [{ founder, saved }, catalog] = await Promise.all([
    loadFounder(),
    searchPublishedOpportunities(query || undefined, undefined, undefined, 500),
  ])

  const ready = founder.status === 'ready' ? founder : null
  // Someone with nothing to sort sees their prompt first and the whole list under it; no tabs, as there is nothing to switch to.
  const showForYou = !ready || !browsing
  const showBrowse = !ready || browsing
  // The whole list is counted only when it was fetched whole; with a search typed, its length is the number of matches.
  const total = query === '' && catalog.availability === 'available' ? catalog.items.length : null

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
          changeHref={CHANGE_HREF}
          retryHref={browseHref({ q: query, type, group })}
          saved={saved}
        />
      ) : null}

      {showBrowse ? (
        <BrowseAll
          view={browseView({ rows: catalog.items, availability: catalog.availability, query, type, group })}
          founder={founder}
          lang={LANG}
          type={type}
          group={group}
        />
      ) : null}
    </div>
  )
}
