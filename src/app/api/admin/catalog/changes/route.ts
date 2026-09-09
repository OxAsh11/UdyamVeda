import { NextRequest, NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { buildLineDiff } from '@/lib/ingest/line-diff'

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

export async function GET() {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const { data: events, error } = await context.supabase
    .from('change_events')
    .select('id, source_registry_id, source_snapshot_id, previous_snapshot_id, event_type, previous_content_hash, content_hash, summary, review_status, reviewer_note, reviewed_at, created_at, source_registry:source_registry(name, url)')
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) return errorResponse('Unable to load source changes.', 500)

  const snapshotIds = (events ?? [])
    .flatMap(event => [event.source_snapshot_id, event.previous_snapshot_id])
    .filter((id): id is string => Boolean(id))
  const { data: snapshots } = snapshotIds.length
    ? await context.supabase.from('source_snapshots').select('id, body_markdown, content_hash, created_at').in('id', snapshotIds)
    : { data: [] }
  const snapshotMap = new Map((snapshots ?? []).map(snapshot => [snapshot.id, snapshot]))

  return NextResponse.json({
    data: (events ?? []).map(event => {
      const currentSnapshot = snapshotMap.get(event.source_snapshot_id) ?? null
      const previousSnapshot = event.previous_snapshot_id ? snapshotMap.get(event.previous_snapshot_id) ?? null : null
      return {
        ...event,
        current_snapshot: currentSnapshot,
        previous_snapshot: previousSnapshot,
        diff: event.event_type === 'changed' && previousSnapshot && currentSnapshot
          ? buildLineDiff(previousSnapshot.body_markdown, currentSnapshot.body_markdown)
          : null,
      }
    }),
  })
}

export async function POST(request: NextRequest) {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  let body: { changeId?: string; action?: 'review' | 'ignore'; reviewerNote?: string }
  try {
    body = await request.json() as typeof body
  } catch {
    return errorResponse('The request body must be valid JSON.', 400)
  }
  if (!body.changeId || !body.action || !['review', 'ignore'].includes(body.action)) {
    return errorResponse('changeId and a valid action are required.', 400)
  }

  if (body.action === 'ignore' && !body.reviewerNote?.trim()) {
    return errorResponse('A reviewer note is required when ignoring a source event.', 422)
  }

  const { error } = await context.supabase.from('change_events').update({
    review_status: body.action === 'review' ? 'reviewed' : 'ignored',
    reviewer_note: body.reviewerNote?.trim() || null,
    reviewed_by: context.user.id,
    reviewed_at: new Date().toISOString(),
  }).eq('id', body.changeId)
  if (error) return errorResponse('Unable to update the change review state.', 500)

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'change_event',
    entity_id: body.changeId,
    action: body.action === 'review' ? 'catalog_change_reviewed' : 'catalog_change_ignored',
    metadata: {},
  })
  return NextResponse.json({ ok: true })
}
