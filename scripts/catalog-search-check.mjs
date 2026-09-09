import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const search = fs.readFileSync(path.join(root, 'src/lib/opportunities/published.ts'), 'utf8')
const route = fs.readFileSync(path.join(root, 'src/app/api/opportunities/route.ts'), 'utf8')
const page = fs.readFileSync(path.join(root, 'src/app/(dashboard)/dashboard/schemes/page.tsx'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260906290000_catalog_search.sql'), 'utf8')
const runtimeSmoke = fs.readFileSync(path.join(root, 'scripts/catalog-public-runtime-smoke.mjs'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog search check failed: ${message}`)
}

assert(search.includes(".ilike('search_text'"), 'opportunity names must be filtered in Postgres')
assert(search.includes(".textSearch('search_document'"), 'version content must be filtered with Postgres full-text search')
assert(search.includes('.limit(resultLimit)'), 'database opportunity results must be bounded')
assert(search.includes(".in('opportunity_version_id', versionIds)"), 'related benefits and windows must be fetched only for candidate versions')
assert(search.includes("source: 'unavailable'"), 'database failures must have an explicit unavailable state')
assert(search.includes("availability: 'available'"), 'healthy empty catalogs must be distinguishable from outages')
assert(!search.includes('const items = mapped.filter'), 'published search must not load and filter the whole catalog in application memory')
assert(route.includes('searchPublishedOpportunities(query, type, coverage, limit)'), 'opportunity API must pass its bounded limit into the data layer')
assert(route.includes("'Cache-Control': cacheControl") && route.includes("'CDN-Cache-Control': cacheControl"), 'healthy public catalog responses must use bounded CDN caching')
const detailRoute = fs.readFileSync(path.join(root, 'src/app/api/opportunities/[slug]/route.ts'), 'utf8')
assert(detailRoute.includes("s-maxage=60, stale-while-revalidate=300") && detailRoute.includes("'Cache-Control': 'no-store'"), 'public opportunity details must cache approved records but not not-found responses')
assert(page.includes('Search approved opportunities') && page.includes('searchQuery'), 'public catalog UI must expose approved-opportunity search')
assert(route.includes("retryable: result.availability === 'unavailable'"), 'opportunity API must expose retryable catalog outages')
assert(runtimeSmoke.includes('/api/opportunities?q=MSME&type=grant&coverage=central&limit=5'), 'runtime smoke must exercise bounded public search parameters')
assert(migration.includes('opportunities_search_trgm_idx'), 'opportunity trigram index is missing')
assert(migration.includes('opportunity_versions_search_idx'), 'opportunity full-text index is missing')

console.log('catalog search check passed: database-side filtering, bounded results, and candidate-only joins')
