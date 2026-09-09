import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { profileCompleteness, profileFromBusinessFacts } from '@/lib/businesses/profile'

type BusinessUpdate = {
  name?: unknown
  businessName?: unknown
  sector?: unknown
  lifecycleStage?: unknown
  stage?: unknown
  state?: unknown
  district?: unknown
  facts?: Record<string, unknown>
}

function clean(value: unknown, max = 200) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function serialize(business: NonNullable<Awaited<ReturnType<typeof getBusinessForUser>>['business']>, facts: Array<{ fact_key: string; fact_value: unknown }>) {
  const profile = profileFromBusinessFacts(business, facts)
  return {
    business: {
      id: business.id,
      name: business.name,
      state: business.state,
      district: business.district,
      sector: business.sector,
      lifecycle_stage: business.lifecycle_stage,
    },
    facts,
    profile,
    completeness: profileCompleteness(profile),
  }
}

async function authorizedContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, business: null, facts: [], error: 'Authentication required' }
  const { business, error } = await getBusinessForUser(supabase, user.id)
  if (error) return { supabase, user, business: null, facts: [], error: 'Unable to load the active business.' }
  if (!business) return { supabase, user, business: null, facts: [], error: null }
  const { data: facts, error: factsError } = await getBusinessFacts(supabase, business.id)
  if (factsError) return { supabase, user, business, facts: [], error: 'Unable to load the business facts.' }
  return { supabase, user, business, facts: facts ?? [], error: null }
}

export async function GET() {
  const result = await authorizedContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business) return NextResponse.json({ data: null })
  return NextResponse.json({ data: serialize(result.business, result.facts) })
}

export async function PATCH(request: Request) {
  const result = await authorizedContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const body = await request.json().catch(() => ({})) as BusinessUpdate
  const businessUpdate = {
    name: clean(body.name ?? body.businessName) || result.business.name,
    sector: clean(body.sector) || result.business.sector,
    lifecycle_stage: clean(body.lifecycleStage ?? body.stage) || result.business.lifecycle_stage,
    state: clean(body.state) || result.business.state,
    district: clean(body.district) || result.business.district,
  }

  const { error: updateError } = await result.supabase.from('businesses').update(businessUpdate).eq('id', result.business.id)
  if (updateError) return NextResponse.json({ error: 'Unable to update the business workspace.', detail: updateError.message }, { status: 500 })

  const factValues: Record<string, unknown> = {
    business_name: businessUpdate.name,
    sector: businessUpdate.sector,
    stage: businessUpdate.lifecycle_stage,
    state: businessUpdate.state,
    district: businessUpdate.district,
    ...(body.facts ?? {}),
  }
  const factRows = Object.entries(factValues)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([fact_key, value]) => ({ business_id: result.business!.id, fact_key, fact_value: { value }, source: 'user', confidence: 1 }))
  if (factRows.length) {
    const { error: factsError } = await result.supabase.from('business_facts').upsert(factRows, { onConflict: 'business_id,fact_key' })
    if (factsError) return NextResponse.json({ error: 'Business updated, but facts could not be saved.', detail: factsError.message }, { status: 500 })
  }

  const { data: refreshedBusiness, error: refreshedError } = await result.supabase
    .from('businesses')
    .select('id, name, lifecycle_stage, sector, state, district')
    .eq('id', result.business.id)
    .single()
  const { data: refreshedFacts, error: refreshedFactsError } = await getBusinessFacts(result.supabase, result.business.id)
  if (refreshedError || refreshedFactsError || !refreshedBusiness) return NextResponse.json({ error: 'Unable to reload the updated business workspace.' }, { status: 500 })
  return NextResponse.json({ data: serialize(refreshedBusiness, refreshedFacts ?? []) })
}
