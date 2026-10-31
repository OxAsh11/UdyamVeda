import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { CATALOG_CACHE_TAG, catalogDataFromRows, hydrateCatalog, type CatalogRows, type EngineCatalog, type EngineCatalogData } from './catalog'

const PAGE_SIZE = 1000
// All 187 ids in one request make a URL of about 8 KB, near common gateway limits.
const IDS_PER_REQUEST = 100
const PUBLISHED_STATUSES = ['active', 'upcoming', 'paused', 'pending_renewal', 'closed']

type Page<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>
type Filtered<T> = { eq(column: string, value: unknown): Filtered<T>; order(column: string): Filtered<T>; range(from: number, to: number): Page<T> }

// Supabase returns at most 1000 rows per request; a silently short list would
// give founders wrong results, so every table is read to the end.
async function readAll<T>(page: (from: number, to: number) => Page<T>): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    rows.push(...(data ?? []))
    if ((data ?? []).length < PAGE_SIZE) return rows
  }
}

async function fetchCatalogData(): Promise<EngineCatalogData> {
  // Public reference data, read with the anon role and no session, so one
  // cached copy can serve every founder.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const opportunities = await readAll<CatalogRows['opportunities'][number]>((from, to) => supabase.from('opportunities')
    .select('id, slug, opportunity_type, status, geography, current_version_id, last_checked_at')
    .in('status', PUBLISHED_STATUSES).order('slug').range(from, to))
  if (!opportunities.length) throw new Error('The catalog returned no records.')

  const versionIds = opportunities.map(row => row.current_version_id).filter((id): id is string => Boolean(id))
  const idChunks = Array.from({ length: Math.ceil(versionIds.length / IDS_PER_REQUEST) }, (_, index) => versionIds.slice(index * IDS_PER_REQUEST, (index + 1) * IDS_PER_REQUEST))
  const byIds = async <T>(table: string, columns: string, idColumn: string, equals: Record<string, unknown> = {}) => (await Promise.all(idChunks.map(chunk => readAll<T>((from, to) => {
    let query = supabase.from(table).select(columns).in(idColumn, chunk) as unknown as Filtered<T>
    for (const [column, value] of Object.entries(equals)) query = query.eq(column, value)
    return query.order('id').range(from, to)
  })))).flat()
  const byVersion = <T>(table: string, columns: string) => byIds<T>(table, columns, 'opportunity_version_id')

  const [versions, ruleSets, windows, requirements, steps, rates, packs, relationships, mappings, definitions, activityPacks] = await Promise.all([
    byIds<CatalogRows['versions'][number]>('opportunity_versions', 'id, title, application, benefit_summary', 'id', { review_status: 'approved' }),
    byIds<CatalogRows['ruleSets'][number]>('eligibility_rule_sets', 'opportunity_version_id, rules', 'opportunity_version_id', { reviewed: true }),
    byVersion<CatalogRows['windows'][number]>('opportunity_windows', 'opportunity_version_id, window_type, opens_at, closes_at'),
    byVersion<CatalogRows['requirements'][number]>('opportunity_requirements', 'opportunity_version_id'),
    byVersion<CatalogRows['steps'][number]>('opportunity_steps', 'opportunity_version_id'),
    byVersion<CatalogRows['rates'][number]>('benefit_rates', 'opportunity_version_id, priority, applies_when, area, project_types, own_pct, includes_loan, provisional, subsidy_pct, subsidy_cap_inr, subsidy_floor_inr, loan_cap_inr, project_min_inr, project_cap_inr, interest_rate_pct, interest_subvention_pct, label_en, source_url'),
    readAll<CatalogRows['packs'][number]>((from, to) => supabase.from('opportunity_packs')
      .select('opportunity_id, pack_id').order('opportunity_id').order('pack_id').range(from, to)),
    readAll<CatalogRows['relationships'][number]>((from, to) => supabase.from('scheme_relationships')
      .select('opportunity_a, opportunity_b, relation, cap_rule, note_en, source_url').order('id').range(from, to)),
    readAll<CatalogRows['mappings'][number]>((from, to) => supabase.from('rule_field_mappings')
      .select('legacy_field, treatment, fact_key, value_map, derive, check_note_en').order('legacy_field').range(from, to)),
    readAll<CatalogRows['definitions'][number]>((from, to) => supabase.from('fact_definitions')
      .select('key, value_type, fixable, allowed_values').eq('active', true).order('key').range(from, to)),
    readAll<CatalogRows['activityPacks'][number]>((from, to) => supabase.from('activity_packs')
      .select('activity_id, pack_id').order('activity_id').order('pack_id').range(from, to)),
  ])

  return catalogDataFromRows({ opportunities, versions, ruleSets, windows, requirements, steps, rates, packs, relationships, mappings, definitions, activityPacks })
}

// A failure throws inside the cached function, so an outage is never cached
// and the catalog comes back as soon as the database does.
const cachedCatalogData = unstable_cache(fetchCatalogData, ['engine-catalog'], { revalidate: 300, tags: [CATALOG_CACHE_TAG] })

/** The published catalog, or null when it cannot be read right now. */
export async function loadEngineCatalog(): Promise<EngineCatalog | null> {
  try {
    return hydrateCatalog(await cachedCatalogData())
  } catch (error) {
    console.error('Unable to load the results catalog', error)
    return null
  }
}
