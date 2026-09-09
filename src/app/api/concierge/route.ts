import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

const requestTypes = ['application_assistance', 'document_review', 'registration_guidance', 'managed_concierge'] as const
type RequestType = typeof requestTypes[number]

function isRequestType(value: unknown): value is RequestType {
  return typeof value === 'string' && requestTypes.includes(value as RequestType)
}

function cleanDetails(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 12)
  return Object.fromEntries(entries.map(([key, entry]) => [key.slice(0, 80), typeof entry === 'string' ? entry.trim().slice(0, 1000) : entry]))
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ data: [] })

  const { data, error } = await supabase
    .from('concierge_requests')
    .select('id, application_id, request_type, status, consent_given, details, created_at, updated_at')
    .eq('business_id', business.id)
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return NextResponse.json({ error: 'Unable to load assistance requests.', detail: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as {
    businessId?: unknown
    applicationId?: unknown
    requestType?: unknown
    details?: unknown
    consentGiven?: unknown
  }
  if (!isRequestType(body.requestType)) return NextResponse.json({ error: 'Choose a valid assistance type.' }, { status: 400 })
  if (body.consentGiven !== true) return NextResponse.json({ error: 'Consent is required before an assistance request can be submitted.' }, { status: 422 })

  const requestedBusinessId = typeof body.businessId === 'string' ? body.businessId : undefined
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id, requestedBusinessId)
  if (businessError) return NextResponse.json({ error: 'Unable to load the selected business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const applicationId = typeof body.applicationId === 'string' ? body.applicationId : null
  if (applicationId) {
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('id')
      .eq('id', applicationId)
      .eq('business_id', business.id)
      .maybeSingle()
    if (applicationError) return NextResponse.json({ error: 'Unable to verify the application.', detail: applicationError.message }, { status: 500 })
    if (!application) return NextResponse.json({ error: 'Application not found in the selected business.' }, { status: 404 })
  }

  const details = cleanDetails(body.details)
  const { data, error } = await supabase
    .from('concierge_requests')
    .insert({
      business_id: business.id,
      requester_id: user.id,
      application_id: applicationId,
      request_type: body.requestType,
      consent_given: true,
      details,
    })
    .select('id, application_id, request_type, status, consent_given, details, created_at')
    .single()
  if (error || !data) return NextResponse.json({ error: 'Assistance requests are not initialized yet. Apply the UdyamVeda migration first.', detail: error?.message }, { status: 503 })

  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    business_id: business.id,
    entity_type: 'concierge_request',
    entity_id: data.id,
    action: 'concierge_request_submitted',
    metadata: { application_id: applicationId, request_type: body.requestType, consent_given: true },
  })

  return NextResponse.json({ data }, { status: 201 })
}
