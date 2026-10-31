import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { CATALOG_CACHE_TAG } from '@/lib/opportunities/engine/catalog'

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

// "I opened the official source today and the status still holds": a fresh date
// and an audit entry, without publishing a new version (PRD §10.4).
export async function POST(request: NextRequest) {
  const context = await getCatalogReviewer()
  if (!context.user) return errorResponse('Authentication required.', 401)
  if (!context.reviewer) return errorResponse('Catalog reviewer access is required.', 403)

  const body = await request.json().catch(() => null) as { slug?: unknown; note?: unknown } | null
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const note = typeof body?.note === 'string' && body.note.trim() ? body.note.trim() : null
  if (!slug) return errorResponse('Choose a scheme to mark as checked.', 422)

  const { data, error } = await context.supabase.rpc('mark_opportunity_checked', { p_slug: slug, p_note: note })
  if (error) return errorResponse(error.message, error.code === '42501' ? 403 : 422)

  revalidateTag(CATALOG_CACHE_TAG, { expire: 0 })
  return NextResponse.json({ checkedAt: data })
}
