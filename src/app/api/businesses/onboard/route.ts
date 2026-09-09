import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type OnboardingPayload = {
  business_name?: string
  sector?: string
  stage?: string
  state?: string
  district?: string
  founder_type?: string
  initial_capital?: string
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim().slice(0, 200) : ''
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as OnboardingPayload
  const form = {
    business_name: clean(body.business_name),
    sector: clean(body.sector),
    stage: clean(body.stage),
    state: clean(body.state),
    district: clean(body.district),
    founder_type: clean(body.founder_type),
    initial_capital: clean(body.initial_capital),
  }

  if (!form.sector || !form.stage || !form.state || !form.founder_type || !form.initial_capital) {
    return NextResponse.json({ error: 'Business sector, stage, state, founder type and capital range are required.' }, { status: 422 })
  }

  const { data: existing, error: existingError } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .eq('active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (existingError) return NextResponse.json({ error: 'Unable to load your business workspace.', detail: existingError.message }, { status: 500 })

  let businessId = existing?.id as string | undefined
  if (businessId) {
    const { error } = await supabase.from('businesses').update({
      name: form.business_name || 'My business',
      state: form.state,
      district: form.district || null,
      sector: form.sector,
      lifecycle_stage: form.stage,
    }).eq('id', businessId)
    if (error) return NextResponse.json({ error: 'Unable to update your business workspace.', detail: error.message }, { status: 500 })
  } else {
    const { data: created, error } = await supabase.from('businesses').insert({
      owner_id: user.id,
      name: form.business_name || 'My business',
      state: form.state,
      district: form.district || null,
      sector: form.sector,
      lifecycle_stage: form.stage,
    }).select('id').single()
    if (error || !created) return NextResponse.json({ error: 'Unable to create your business workspace.', detail: error?.message }, { status: 500 })
    businessId = created.id
  }

  const { error: membershipError } = await supabase.from('business_memberships').upsert({
    business_id: businessId,
    user_id: user.id,
    role: 'owner',
  })
  if (membershipError) return NextResponse.json({ error: 'Unable to initialize business membership.', detail: membershipError.message }, { status: 500 })

  const facts = [
    ['business_name', form.business_name || 'My business'],
    ['sector', form.sector],
    ['stage', form.stage],
    ['state', form.state],
    ['district', form.district],
    ['founder_type', form.founder_type],
    ['initial_capital', form.initial_capital],
  ].filter(([, value]) => value)
    .map(([fact_key, value]) => ({ business_id: businessId, fact_key, fact_value: { value }, source: 'user', confidence: 1 }))

  const { error: factsError } = await supabase.from('business_facts').upsert(facts, { onConflict: 'business_id,fact_key' })
  if (factsError) return NextResponse.json({ error: 'Unable to save your business facts.', detail: factsError.message }, { status: 500 })

  return NextResponse.json({ data: { businessId } }, { status: 201 })
}
