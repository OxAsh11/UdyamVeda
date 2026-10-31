import { NextResponse } from 'next/server'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { buildResults } from '@/lib/opportunities/engine/results'
import { loadStartBundle } from '@/lib/start/load-bundle'
import { nextStep } from '@/lib/start/next-screen'

const MAX_BODY_BYTES = 16 * 1024

// The next question and live counts. The browser holds the answers and sends
// them each time, so a founder needs no account; nothing here is stored.
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }
  const body = await request.text()
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }

  let parsed: { facts?: unknown; asked?: unknown } | null
  try {
    parsed = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const [catalog, bundle] = await Promise.all([loadEngineCatalog(), loadStartBundle()])
  if (!catalog || !bundle) return NextResponse.json({ error: 'unavailable' }, { status: 503 })

  const now = new Date()
  const { facts, nonAnswers } = cleanFacts(parsed?.facts, catalog.definitions, catalog.activityIds)
  const known = new Set(bundle.questions.map(question => question.id))
  const asked = Array.isArray(parsed?.asked) ? parsed.asked.filter((id): id is string => typeof id === 'string' && known.has(id)) : []

  return NextResponse.json({
    step: nextStep({ facts, nonAnswers, asked }, bundle, catalog, now),
    preview: buildResults(facts, nonAnswers, catalog, now).counts,
    factLabels: Object.fromEntries(Object.values(bundle.facts).map(fact => [fact.key, fact.label])),
  })
}
