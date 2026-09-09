import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { DOCUMENT_BUCKET, SIGNED_URL_SECONDS } from '@/lib/documents/constants'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const { data: document, error } = await supabase.from('business_documents').select('id, storage_path, file_name, scan_status, expires_at').eq('id', id).eq('business_id', business.id).is('deleted_at', null).maybeSingle()
  if (error) return NextResponse.json({ error: 'Unable to load the document.', detail: error.message }, { status: 500 })
  if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
  if (document.scan_status !== 'clean') return NextResponse.json({ error: 'This document is not available until malware scanning is complete.', scanStatus: document.scan_status }, { status: 423 })
  if (document.expires_at && new Date(document.expires_at) < new Date()) return NextResponse.json({ error: 'This document has expired and cannot be downloaded.' }, { status: 410 })

  const { data: signed, error: signedError } = await supabase.storage.from(DOCUMENT_BUCKET).createSignedUrl(document.storage_path, SIGNED_URL_SECONDS, { download: document.file_name })
  if (signedError || !signed?.signedUrl) return NextResponse.json({ error: 'Unable to create a temporary document link.', detail: signedError?.message }, { status: 503 })
  const { error: auditError } = await supabase.from('audit_logs').insert({ actor_id: user.id, business_id: business.id, entity_type: 'business_document', entity_id: id, action: 'document_signed_url_created', metadata: { expires_in_seconds: SIGNED_URL_SECONDS } })
  if (auditError) return NextResponse.json({ error: 'Temporary document access was not issued because its audit event could not be recorded.' }, { status: 503 })
  return NextResponse.json({ data: { signedUrl: signed.signedUrl, expiresInSeconds: SIGNED_URL_SECONDS, fileName: document.file_name } })
}
