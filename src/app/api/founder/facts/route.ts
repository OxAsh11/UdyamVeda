import { NextResponse } from 'next/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { founderFactsFromRows } from '@/lib/businesses/founder-facts'
import { ensureBusiness } from '@/lib/businesses/workspace'
import { cleanFacts } from '@/lib/opportunities/engine/facts'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { loadStartBundle } from '@/lib/start/load-bundle'
import { createClient } from '@/lib/supabase/server'

const MAX_BODY_BYTES = 16 * 1024

/** A signed-in founder's saved answers, so they can pick up on another device. */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'not_signed_in' }, { status: 401 })

  const { business, error } = await getBusinessForUser(supabase, user.id)
  if (error) return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  if (!business) return NextResponse.json({ facts: {}, asked: [] })

  const { data, error: factsError } = await getBusinessFacts(supabase, business.id)
  if (factsError) return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  const facts = founderFactsFromRows(data ?? [])

  const bundle = await loadStartBundle()
  const asked = (bundle?.questions ?? []).filter(question => question.factKeys.some(key => key in facts)).map(question => question.id)
  return NextResponse.json({ facts, asked })
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
  if (rows.length) {
    const { error } = await supabase.from('business_facts').upsert(rows, { onConflict: 'business_id,fact_key' })
    if (error) return NextResponse.json({ error: 'save_failed' }, { status: 500 })
  }

  const kept = new Set(rows.map(row => row.fact_key))
  const takenBack = catalog.definitions.map(definition => definition.key).filter(key => !kept.has(key))
  if (takenBack.length) {
    const { error } = await supabase.from('business_facts').delete().eq('business_id', businessId).in('fact_key', takenBack)
    if (error) return NextResponse.json({ error: 'save_failed' }, { status: 500 })
  }

  // Older screens still read these from the workspace itself.
  const workspaceFields = Object.fromEntries(Object.entries({ state: facts.state, district: facts.district, lifecycle_stage: facts.stage }).filter(([, value]) => value !== undefined))
  if (Object.keys(workspaceFields).length) await supabase.from('businesses').update(workspaceFields).eq('id', businessId)

  return NextResponse.json({ saved: rows.length })
}
