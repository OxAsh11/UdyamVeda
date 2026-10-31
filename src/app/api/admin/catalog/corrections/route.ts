import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { CATALOG_CACHE_TAG } from '@/lib/opportunities/engine/catalog'

// Publishes a correction of one catalog record as a new approved version via
// the publish_catalog_correction database function (one transaction, full
// publication contract, audit trail).
const ALLOWED_KEYS = new Set([
  'status', 'official_url', 'title', 'summary', 'objective', 'legal_basis',
  'eligibility', 'application', 'fine_print', 'benefit_summary', 'window', 'steps', 'requirements',
])

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(request: NextRequest) {
  const context = await getCatalogReviewer()
  if (!context.user) return errorResponse('Authentication required.', 401)
  if (!context.reviewer) return errorResponse('Catalog reviewer access is required.', 403)

  const body = await request.json().catch(() => null) as { slug?: unknown; changes?: unknown; reason?: unknown } | null
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : ''
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : ''
  const changes = body?.changes && typeof body.changes === 'object' && !Array.isArray(body.changes)
    ? body.changes as Record<string, unknown>
    : null

  if (!slug) return errorResponse('Choose a scheme to correct.', 422)
  if (!reason) return errorResponse('Add a short reason for the change.', 422)
  if (!changes || Object.keys(changes).length === 0) return errorResponse('Nothing has changed yet.', 422)
  const unknownKeys = Object.keys(changes).filter(key => !ALLOWED_KEYS.has(key))
  if (unknownKeys.length) return errorResponse(`Unsupported fields: ${unknownKeys.join(', ')}`, 422)

  const { data, error } = await context.supabase.rpc('publish_catalog_correction', {
    p_slug: slug,
    p_changes: changes,
    p_reason: reason,
  })
  if (error) return errorResponse(error.message, error.code === '42501' ? 403 : 422)

  revalidatePath('/schemes')
  revalidatePath(`/schemes/${slug}`)
  revalidateTag(CATALOG_CACHE_TAG, { expire: 0 })
  return NextResponse.json({ data })
}
