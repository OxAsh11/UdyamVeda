import { NextResponse } from 'next/server'
import { getPublishedOpportunity } from '@/lib/opportunities/published'

type OpportunityRouteContext = { params: Promise<{ slug: string }> }

export async function GET(_request: Request, context: OpportunityRouteContext) {
  const { slug } = await context.params
  const opportunity = await getPublishedOpportunity(slug)

  if (!opportunity) {
    return NextResponse.json(
      { error: 'Published opportunity not found.' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const cacheControl = 'public, max-age=0, s-maxage=60, stale-while-revalidate=300'

  return NextResponse.json({ data: opportunity }, {
    headers: {
      'Cache-Control': cacheControl,
      'CDN-Cache-Control': cacheControl,
    },
  })
}
