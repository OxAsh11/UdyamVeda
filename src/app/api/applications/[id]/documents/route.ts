import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const body = await request.json().catch(() => ({})) as { businessDocumentId?: string; opportunityRequirementId?: string }
  if (!body.businessDocumentId) return NextResponse.json({ error: 'businessDocumentId is required.' }, { status: 400 })
  const { data: application, error: applicationError } = await supabase.from('applications').select('id, opportunity_version_id').eq('id', id).eq('business_id', business.id).maybeSingle()
  if (applicationError) return NextResponse.json({ error: 'Unable to load the application.' }, { status: 500 })
  if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  const { data: document, error: documentError } = await supabase.from('business_documents').select('id, scan_status').eq('id', body.businessDocumentId).eq('business_id', business.id).is('deleted_at', null).maybeSingle()
  if (documentError) return NextResponse.json({ error: 'Unable to load the document.' }, { status: 500 })
  if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
  if (document.scan_status !== 'clean') return NextResponse.json({ error: 'Only malware-scanned documents can be linked to applications.' }, { status: 422 })

  if (body.opportunityRequirementId) {
    const { data: requirement } = await supabase.from('opportunity_requirements').select('id').eq('id', body.opportunityRequirementId).eq('opportunity_version_id', application.opportunity_version_id).maybeSingle()
    if (!requirement) return NextResponse.json({ error: 'Requirement does not belong to this application version.' }, { status: 422 })
  }
  const { data, error } = await supabase.from('application_document_links').insert({ application_id: id, business_document_id: body.businessDocumentId, opportunity_requirement_id: body.opportunityRequirementId ?? null }).select('id, application_id, business_document_id, opportunity_requirement_id, status, created_at').single()
  if (error) return NextResponse.json({ error: 'Unable to link the document.', detail: error.message }, { status: 500 })
  const { error: auditError } = await supabase.from('audit_logs').insert({ actor_id: user.id, business_id: business.id, entity_type: 'application_document_link', entity_id: data.id, action: 'document_linked_to_application', metadata: { application_id: id, business_document_id: body.businessDocumentId, opportunity_requirement_id: body.opportunityRequirementId ?? null } })
  if (auditError) {
    await supabase.from('application_document_links').delete().eq('id', data.id).eq('application_id', id)
    return NextResponse.json({ error: 'Document link was rolled back because its audit event could not be recorded.' }, { status: 503 })
  }
  return NextResponse.json({ data }, { status: 201 })
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })
  const body = await request.json().catch(() => ({})) as { linkId?: string }
  if (!body.linkId) return NextResponse.json({ error: 'linkId is required.' }, { status: 400 })
  const { data: application } = await supabase.from('applications').select('id').eq('id', id).eq('business_id', business.id).maybeSingle()
  if (!application) return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  const { error } = await supabase.from('application_document_links').delete().eq('id', body.linkId).eq('application_id', id)
  if (error) return NextResponse.json({ error: 'Unable to unlink the document.', detail: error.message }, { status: 500 })
  await supabase.from('audit_logs').insert({ actor_id: user.id, business_id: business.id, entity_type: 'application_document_link', entity_id: body.linkId, action: 'document_unlinked_from_application', metadata: { application_id: id } })
  return NextResponse.json({ ok: true })
}
