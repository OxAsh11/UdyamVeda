import { NextResponse } from 'next/server'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { buildResults } from '@/lib/opportunities/engine/results'

const MAX_BODY_BYTES = 16 * 1024

// Public on purpose: a founder sees results before making an account (FR-15).
// Nothing a caller sends is stored here or echoed back.
export async function POST(request: Request) {
  const body = await request.text()
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const catalog = await loadEngineCatalog()
  if (!catalog) return NextResponse.json({ error: 'catalog_unavailable' }, { status: 503 })

  const rawFacts = parsed && typeof parsed === 'object' ? (parsed as { facts?: unknown }).facts : undefined
  const { facts, nonAnswers } = cleanFacts(rawFacts, catalog.definitions, catalog.activityIds)
  return NextResponse.json(buildResults(facts, nonAnswers, catalog, new Date()))
}
