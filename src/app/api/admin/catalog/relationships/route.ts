import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'

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

export async function GET(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const requestedPage = Number(request.nextUrl.searchParams.get('page') ?? '1')
  const requestedPageSize = Number(request.nextUrl.searchParams.get('pageSize') ?? '25')
  const requestedStatus = request.nextUrl.searchParams.get('status')
  const status = ['pending', 'confirmed', 'rejected', 'all'].includes(requestedStatus ?? '') ? requestedStatus : 'pending'
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const pageSize = Number.isInteger(requestedPageSize) && requestedPageSize > 0 ? Math.min(requestedPageSize, 50) : 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = context.supabase
    .from('authority_relationships')
    .select('id, relationship_type, source_url, source_anchor, evidence_note, review_status, reviewed_at, child_authority:authorities!authority_relationships_child_authority_id_fkey(id, name, ministry, department, official_url), parent_coverage:authority_coverage!authority_relationships_parent_coverage_id_fkey(id, authority_level, authority_name, authority_url)', { count: 'exact' })
    .order('review_status', { ascending: true })
    .order('created_at', { ascending: true })
  if (status !== 'all') query = query.eq('review_status', status)
  const { data, count, error } = await query.range(from, to)
  if (error) return errorResponse('Unable to load authority relationship candidates.', 500)

  return NextResponse.json({
    data: data ?? [],
    pagination: { page, pageSize, total: count ?? 0, hasMore: (count ?? 0) > to + 1 },
  })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { relationshipId?: string; action?: 'confirm' | 'reject'; reviewNote?: string }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.relationshipId || !body.action || !['confirm', 'reject'].includes(body.action)) {
    return errorResponse('relationshipId, action, and a valid action are required.', 400)
  }
  if (!body.reviewNote?.trim()) return errorResponse('A reviewer note is required for every relationship decision.', 422)

  const { data: relationship, error: relationshipError } = await context.supabase
    .from('authority_relationships')
    .select('id, review_status, evidence_note, child_authority:authorities!authority_relationships_child_authority_id_fkey(name), parent_coverage:authority_coverage!authority_relationships_parent_coverage_id_fkey(authority_name)')
    .eq('id', body.relationshipId)
    .maybeSingle()
  if (relationshipError) return errorResponse('Unable to load the authority relationship.', 500)
  if (!relationship) return errorResponse('Authority relationship not found.', 404)
  if (relationship.review_status !== 'pending') return errorResponse('This relationship has already been decided.', 409)

  const { error: updateError } = await context.supabase
    .from('authority_relationships')
    .update({
      review_status: body.action === 'confirm' ? 'confirmed' : 'rejected',
      reviewed_by: context.user.id,
      reviewed_at: new Date().toISOString(),
      evidence_note: {
        ...(relationship.evidence_note && typeof relationship.evidence_note === 'object' && !Array.isArray(relationship.evidence_note) ? relationship.evidence_note : {}),
        reviewer_note: body.reviewNote.trim(),
      },
    })
    .eq('id', body.relationshipId)
  if (updateError) return errorResponse('Unable to save the authority relationship decision.', 500)

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'authority_relationship',
    entity_id: body.relationshipId,
    action: body.action === 'confirm' ? 'authority_relationship_confirmed' : 'authority_relationship_rejected',
    metadata: { review_note: body.reviewNote.trim() },
  })

  return NextResponse.json({ ok: true, reviewStatus: body.action === 'confirm' ? 'confirmed' : 'rejected' })
}
