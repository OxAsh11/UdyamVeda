import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { DOCUMENT_BUCKET } from '@/lib/documents/constants'

type RouteContext = { params: Promise<{ id: string }> }

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  const { business, error: businessError } = await getBusinessForUser(supabase, user.id)
  if (businessError) return NextResponse.json({ error: 'Unable to load the active business.' }, { status: 500 })
  if (!business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const { data: document, error } = await supabase.from('business_documents').select('id, storage_path, file_name').eq('id', id).eq('business_id', business.id).is('deleted_at', null).maybeSingle()
  if (error) return NextResponse.json({ error: 'Unable to load the document.', detail: error.message }, { status: 500 })
  if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })

  const { error: metadataError } = await supabase.from('business_documents').update({ deleted_at: new Date().toISOString() }).eq('id', id).eq('business_id', business.id)
  if (metadataError) return NextResponse.json({ error: 'Unable to mark the document for deletion.', detail: metadataError.message }, { status: 500 })
  const { error: storageError } = await supabase.storage.from(DOCUMENT_BUCKET).remove([document.storage_path])
  await supabase.from('audit_logs').insert({ actor_id: user.id, business_id: business.id, entity_type: 'business_document', entity_id: id, action: 'document_deleted', metadata: { file_name: document.file_name, storage_error: storageError?.message ?? null } })
  if (storageError) return NextResponse.json({ error: 'Document access was revoked, but storage cleanup needs retry.', detail: storageError.message }, { status: 502 })
  return NextResponse.json({ ok: true })
}
