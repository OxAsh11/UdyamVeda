import { NextRequest, NextResponse } from 'next/server'
import { searchPublishedOpportunities, type CatalogSource } from '@/lib/opportunities/published'

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const query = params.get('q') ?? undefined
  const type = params.get('type') ?? undefined
  const coverage = params.get('coverage') ?? undefined
  const limit = Math.min(Math.max(Number(params.get('limit') ?? 24), 1), 100)

  const result = await searchPublishedOpportunities(query, type, coverage, limit)
  const catalog = result.items

  const source = result.source as CatalogSource
  const cacheControl = result.availability === 'available'
    ? 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'
    : 'no-store'

  return NextResponse.json({
    data: catalog,
    meta: {
      count: catalog.length,
      source: result.source,
      availability: result.availability,
      coverage: source === 'database'
        ? 'Published official-source catalog'
        : source === 'research_beta'
          ? 'Research beta catalog; review continues'
        : source === 'legacy_draft'
          ? 'Development-only legacy draft catalog'
          : source === 'empty_unpublished'
            ? 'No approved records are published yet'
            : 'Catalog data is temporarily unavailable',
      verification: source === 'database'
        ? 'Records shown here have an approved version in the catalog.'
        : source === 'research_beta'
          ? 'Records shown here are source-backed research records in founder-authorized beta mode. Confirm current terms on the official portal; they are not yet fully editorially approved.'
        : source === 'legacy_draft'
          ? 'Development-only records; no legacy record is a final eligibility decision.'
          : source === 'empty_unpublished'
            ? 'The catalog is being verified; unreviewed records are intentionally withheld.'
            : 'The catalog database could not be reached; no eligibility or opportunity count is being inferred.',
      retryable: result.availability === 'unavailable',
    },
  }, {
    status: result.availability === 'unavailable' ? 503 : 200,
    headers: {
      'Cache-Control': cacheControl,
      'CDN-Cache-Control': cacheControl,
    },
  })
}
