import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { inngest } from '@/lib/ingest/inngest'
import { isOfficialSourceUrl } from '@/lib/opportunities/editorial'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

async function requireReviewer() {
  const context = await getCatalogReviewer()
  if (!context.user) return { response: errorResponse('Sign in is required.', 401) }
  if (context.error) return { response: errorResponse('Catalog operations are not provisioned yet.', 503) }
  if (!context.reviewer) return { response: errorResponse('Catalog reviewer access is required.', 403) }
  return context
}

function sourceSearchTerm(value: string) {
  return value.replace(/[,%()]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80)
}

export async function GET(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const requestedPage = Number(request.nextUrl.searchParams.get('page') ?? '1')
  const requestedPageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? '25')
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0
    ? Math.min(requestedPageSize, 50)
    : 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  const search = sourceSearchTerm(request.nextUrl.searchParams.get('q') ?? '')

  let sourceQuery = context.supabase
    .from('source_registry')
    .select('id, name, url, source_kind, coverage_level, cadence, active, last_checked_at, last_content_hash, expected_item_count, notes', { count: 'exact' })
  if (search) {
    const pattern = `%${search}%`
    sourceQuery = sourceQuery.or(`name.ilike.${pattern},url.ilike.${pattern},source_kind.ilike.${pattern},coverage_level.ilike.${pattern}`)
  }
  const { data, count, error } = await sourceQuery
    .order('authority_rank', { ascending: true })
    .order('name', { ascending: true })
    .range(from, to)

  if (error) return errorResponse('Unable to load the source registry.', 500)
  return NextResponse.json({
    data: data ?? [],
    pagination: { page, pageSize, total: count ?? 0, hasMore: (count ?? 0) > to + 1 },
    search,
  })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { sourceId?: string }
  try {
    body = (await request.json()) as { sourceId?: string }
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.sourceId) return errorResponse('sourceId is required.', 400)

  const { data: source, error } = await context.supabase
    .from('source_registry')
    .select('id, url, active')
    .eq('id', body.sourceId)
    .maybeSingle()
  if (error) return errorResponse('Unable to load the registered source.', 500)
  if (!source) return errorResponse('Registered source not found.', 404)
  if (!source.active) return errorResponse('This source is inactive.', 409)
  if (!isOfficialSourceUrl(source.url)) return errorResponse('Only registered official Government or allowlisted implementing-agency sources may be refreshed.', 422)

  const result = await inngest.send({
    name: 'catalog/source.refresh.requested',
    data: { sourceId: source.id, url: source.url, requestedBy: context.user.id },
  })

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'source_registry',
    entity_id: source.id,
    action: 'catalog_source_refresh_requested',
    metadata: { event_ids: result.ids },
  })

  return NextResponse.json({ ok: true, eventIds: result.ids }, { status: 202 })
}
