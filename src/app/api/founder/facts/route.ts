import { NextResponse } from 'next/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { founderFactsFromRows } from '@/lib/businesses/founder-facts'
import { ensureBusiness } from '@/lib/businesses/workspace'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { loadStartBundle } from '@/lib/start/load-bundle'
import { createClient } from '@/lib/supabase/server'

const MAX_BODY_BYTES = 16 * 1024
const NON_ANSWER_VALUES: Record<string, string> = { declined: 'prefer_not', dont_know: 'dont_know' }
const NO_STORE = { 'Cache-Control': 'no-store' }

/** A signed-in founder's saved answers, so they can pick up on another device. */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'not_signed_in' }, { status: 401, headers: NO_STORE })

  const [catalog, bundle] = await Promise.all([loadEngineCatalog(), loadStartBundle()])
  if (!catalog || !bundle) return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })

  const { business, error } = await getBusinessForUser(supabase, user.id)
  if (error) return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })
  if (!business) return NextResponse.json({ userId: user.id, facts: {}, asked: [], activityItems: [] }, { headers: NO_STORE })

  const { data, error: factsError } = await getBusinessFacts(supabase, business.id)
  if (factsError) return NextResponse.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })

  // Only answers the flow can use count as answered, so free text from an older
  // screen ("Mumbai" as a state) brings the question back instead of hiding it.
  const { facts, nonAnswers } = cleanFacts(founderFactsFromRows(data ?? []), catalog.definitions, catalog.activityIds)
  const answers: Record<string, unknown> = { ...facts }
  for (const [key, state] of Object.entries(nonAnswers)) answers[key] = NON_ANSWER_VALUES[state]

  const chosen = Array.isArray(facts.activity_codes) ? facts.activity_codes : []
  return NextResponse.json({
    userId: user.id,
    facts: answers,
    asked: bundle.questions.filter(question => question.factKeys.some(key => key in answers)).map(question => question.id),
    activityItems: bundle.activities
      .filter(activity => chosen.includes(activity.id))
      .map(({ id, label, icon, packIds }) => ({ id, label, icon, packIds })),
  }, { headers: NO_STORE })
}

/** Replaces the founder's answers with what the flow sent. Other saved rows are left alone. */
export async function PUT(request: Request) {
  if (Number(request.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }
  const body = await request.text()
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'too_large' }, { status: 413 })
  }

  let parsed: { facts?: unknown } | null
  try {
    parsed = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'not_signed_in' }, { status: 401 })

  const catalog = await loadEngineCatalog()
  if (!catalog) return NextResponse.json({ error: 'unavailable' }, { status: 503 })

  const { facts, nonAnswers } = cleanFacts(parsed?.facts, catalog.definitions, catalog.activityIds)
  // This request replaces the saved answers, so an empty one would erase them all.
  if (!Object.keys(facts).length && !Object.keys(nonAnswers).length) {
    return NextResponse.json({ error: 'nothing_to_save' }, { status: 400 })
  }

  const workspace = await ensureBusiness(supabase, user.id)
  if ('error' in workspace) return NextResponse.json({ error: 'save_failed' }, { status: 500 })
  const { businessId } = workspace

  const answered = Object.entries(facts).map(([fact_key, value]) => ({
    business_id: businessId, fact_key, fact_value: { value }, source: 'user', confidence: 1, answer_state: 'answered',
  }))
  const unanswered = Object.entries(nonAnswers).map(([fact_key, answer_state]) => ({
    business_id: businessId, fact_key, fact_value: {}, source: 'user', confidence: 1, answer_state,
  }))
  const rows = [...answered, ...unanswered]
  const { error } = await supabase.from('business_facts').upsert(rows, { onConflict: 'business_id,fact_key' })
  if (error) return NextResponse.json({ error: 'save_failed' }, { status: 500 })

  const kept = new Set(rows.map(row => row.fact_key))
  const takenBack = catalog.definitions.map(definition => definition.key).filter(key => !kept.has(key))
  if (takenBack.length) {
    const { error: deleteError } = await supabase.from('business_facts').delete().eq('business_id', businessId).in('fact_key', takenBack)
    if (deleteError) return NextResponse.json({ error: 'save_failed' }, { status: 500 })
  }

  // Older screens still read these from the workspace itself.
  const workspaceFields = Object.fromEntries(Object.entries({ state: facts.state, district: facts.district, lifecycle_stage: facts.stage }).filter(([, value]) => value !== undefined))
  if (Object.keys(workspaceFields).length) await supabase.from('businesses').update(workspaceFields).eq('id', businessId)

  return NextResponse.json({ saved: rows.length })
}
