import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

type SavedRequest = { opportunityId?: string }

async function loadContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, business: null, error: 'Authentication required' }
  const { business, error } = await getBusinessForUser(supabase, user.id)
  if (error) return { supabase, user, business: null, error: 'Unable to load the active business.' }
  return { supabase, user, business, error: null }
}

async function resolveOpportunity(supabase: Awaited<ReturnType<typeof createClient>>, value: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  return isUuid
    ? supabase.from('opportunities').select('id, slug, status').eq('id', value).maybeSingle()
    : supabase.from('opportunities').select('id, slug, status').eq('slug', value).maybeSingle()
}

export async function GET() {
  const result = await loadContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business) return NextResponse.json({ data: [] })

  const { data, error } = await result.supabase
    .from('saved_opportunities')
    .select('id, opportunity_id, status, created_at, opportunity:opportunities(id, slug, name)')
    .eq('business_id', result.business.id)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ data: [], setupRequired: true })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  const result = await loadContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  const body = await request.json().catch(() => ({})) as SavedRequest
  if (!result.business || !body.opportunityId) return NextResponse.json({ error: 'A business and opportunityId are required.' }, { status: 400 })

  const { data: opportunity, error: opportunityError } = await resolveOpportunity(result.supabase, body.opportunityId)
  if (opportunityError) return NextResponse.json({ error: 'Unable to load the opportunity.', detail: opportunityError.message }, { status: 500 })
  if (!opportunity || !['active', 'upcoming'].includes(opportunity.status)) return NextResponse.json({ error: 'Only active or upcoming published opportunities can be saved.' }, { status: 422 })

  const { data, error } = await result.supabase
    .from('saved_opportunities')
    .upsert({ business_id: result.business.id, opportunity_id: opportunity.id, status: 'saved' }, { onConflict: 'business_id,opportunity_id' })
    .select('id, opportunity_id, status, created_at')
    .single()
  if (error) return NextResponse.json({ error: 'Unable to save the opportunity.', detail: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const result = await loadContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  const body = await request.json().catch(() => ({})) as SavedRequest
  const opportunityId = body.opportunityId ?? request.nextUrl.searchParams.get('opportunityId') ?? undefined
  if (!result.business || !opportunityId) return NextResponse.json({ error: 'A business and opportunityId are required.' }, { status: 400 })

  const { data: opportunity, error: opportunityError } = await resolveOpportunity(result.supabase, opportunityId)
  if (opportunityError) return NextResponse.json({ error: 'Unable to load the opportunity.', detail: opportunityError.message }, { status: 500 })
  if (!opportunity) return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 })

  const { error } = await result.supabase.from('saved_opportunities').delete().eq('business_id', result.business.id).eq('opportunity_id', opportunity.id)
  if (error) return NextResponse.json({ error: 'Unable to remove the saved opportunity.', detail: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
