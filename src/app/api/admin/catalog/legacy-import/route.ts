import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'
import { legacyCatalogDrafts } from '@/lib/opportunities/legacy'

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

function hashPayload(payload: unknown) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

export async function POST() {
  const context = await requireReviewer()
  if ('response' in context) return context.response

  const drafts = legacyCatalogDrafts()
  let imported = 0
  let skipped = 0
  const failures: string[] = []

  for (const draft of drafts) {
    const contentHash = hashPayload(draft)
    const sourceUrl = draft.source.source_url

    let source = (await context.supabase.from('source_registry').select('id').eq('url', sourceUrl).maybeSingle()).data
    if (!source) {
      const sourceResult = await context.supabase.from('source_registry').insert({
        name: 'Legacy draft source: ' + draft.opportunity.name,
        url: sourceUrl,
        source_kind: 'legacy_import',
        coverage_level: draft.opportunity.geography.coverage,
        cadence: 'monthly',
        authority_rank: 9,
        verification_required: true,
        notes: 'Imported from the former static UI catalog. This source is a lead only until its current official authority record is verified.',
      }).select('id').single()
      if (sourceResult.error || !sourceResult.data) {
        failures.push(draft.opportunity.slug)
        continue
      }
      source = sourceResult.data
    }

    let snapshot = (await context.supabase.from('source_snapshots').select('id').eq('source_registry_id', source.id).eq('content_hash', contentHash).maybeSingle()).data
    if (!snapshot) {
      const snapshotResult = await context.supabase.from('source_snapshots').insert({
        source_registry_id: source.id,
        content_hash: contentHash,
        content_type: 'application/json',
        body_markdown: JSON.stringify(draft, null, 2),
        extracted_payload: draft,
        status: 'needs_review',
      }).select('id').single()
      if (snapshotResult.error || !snapshotResult.data) {
        failures.push(draft.opportunity.slug)
        continue
      }
      snapshot = snapshotResult.data
    }

    const existingDraft = (await context.supabase
      .from('opportunity_drafts')
      .select('id')
      .eq('source_snapshot_id', snapshot.id)
      .eq('extraction_model', 'legacy-static-import')
      .maybeSingle()).data
    if (existingDraft) {
      skipped += 1
      continue
    }

    const draftResult = await context.supabase.from('opportunity_drafts').insert({
      source_snapshot_id: snapshot.id,
      payload: draft,
      completeness: 0,
      validation_errors: ['Legacy imported record requires official-source review before promotion.'],
      validation_warnings: ['Eligibility, benefit amounts, dates, and application instructions must be re-established from current official sources.'],
      extraction_model: 'legacy-static-import',
      status: 'needs_review',
    })
    if (draftResult.error) {
      failures.push(draft.opportunity.slug)
      continue
    }
    imported += 1
  }

  await context.supabase.from('audit_logs').insert({
    actor_id: context.user.id,
    entity_type: 'catalog',
    action: 'legacy_catalog_imported',
    metadata: { total: drafts.length, imported, skipped, failures },
  })

  return NextResponse.json({ ok: failures.length === 0, total: drafts.length, imported, skipped, failures }, { status: failures.length ? 207 : 200 })
}
