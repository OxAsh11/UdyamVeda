import { createHash, randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { ALLOWED_DOCUMENT_MIME_TYPES, DOCUMENT_BUCKET, MAX_DOCUMENT_BYTES, safeFileName, isDate } from '@/lib/documents/constants'

const publicDocumentFields = 'id, file_name, mime_type, size_bytes, checksum, sensitivity, expires_at, scan_status, scan_provider, scanned_at, created_at'

async function authorizedContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, business: null, error: 'Authentication required' }
  const { business, error } = await getBusinessForUser(supabase, user.id)
  if (error) return { supabase, user, business: null, error: 'Unable to load the active business.' }
  return { supabase, user, business, error: null }
}

export async function GET() {
  const result = await authorizedContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business) return NextResponse.json({ data: [] })

  const { data, error } = await result.supabase
    .from('business_documents')
    .select(publicDocumentFields)
    .eq('business_id', result.business.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ data: [], setupRequired: true })
  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  const result = await authorizedContext()
  if (!result.user) return NextResponse.json({ error: result.error }, { status: 401 })
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
  if (!result.business) return NextResponse.json({ error: 'Business workspace not found.' }, { status: 404 })

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!file || typeof file !== 'object' || !('arrayBuffer' in file) || !('name' in file) || !('type' in file) || !('size' in file)) {
    return NextResponse.json({ error: 'A document file is required.' }, { status: 400 })
  }
  const uploadedFile = file as File
  if (uploadedFile.size <= 0 || uploadedFile.size > MAX_DOCUMENT_BYTES) return NextResponse.json({ error: 'Documents must be between 1 byte and 10 MB.' }, { status: 413 })
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(uploadedFile.type as typeof ALLOWED_DOCUMENT_MIME_TYPES[number])) return NextResponse.json({ error: 'This file type is not allowed.' }, { status: 415 })

  const sensitivity = form?.get('sensitivity')
  const allowedSensitivity = ['standard', 'sensitive', 'highly_sensitive']
  const normalizedSensitivity = typeof sensitivity === 'string' && allowedSensitivity.includes(sensitivity) ? sensitivity : 'standard'
  const expiresAt = form?.get('expiresAt')
  if (expiresAt !== null && expiresAt !== undefined && expiresAt !== '' && !isDate(expiresAt)) return NextResponse.json({ error: 'expiresAt must be YYYY-MM-DD.' }, { status: 400 })

  const bytes = new Uint8Array(await uploadedFile.arrayBuffer())
  const checksum = createHash('sha256').update(bytes).digest('hex')
  const storagePath = `${result.business.id}/${randomUUID()}-${safeFileName(uploadedFile.name)}`
  const { error: uploadError } = await result.supabase.storage.from(DOCUMENT_BUCKET).upload(storagePath, bytes, {
    contentType: uploadedFile.type,
    upsert: false,
  })
  if (uploadError) return NextResponse.json({ error: 'Unable to upload the document. Confirm the private storage bucket is provisioned.', detail: uploadError.message }, { status: 503 })

  const { data, error } = await result.supabase
    .from('business_documents')
    .insert({
      business_id: result.business.id,
      storage_path: storagePath,
      file_name: uploadedFile.name.slice(0, 255),
      mime_type: uploadedFile.type,
      size_bytes: uploadedFile.size,
      checksum,
      sensitivity: normalizedSensitivity,
      expires_at: typeof expiresAt === 'string' && expiresAt ? expiresAt : null,
      created_by: result.user.id,
      scan_status: 'pending',
      scan_provider: process.env.DOCUMENT_SCANNER_PROVIDER ?? null,
    })
    .select(publicDocumentFields)
    .single()
  if (error || !data) {
    await result.supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath])
    return NextResponse.json({ error: 'Unable to record the document metadata.', detail: error?.message }, { status: 503 })
  }

  const { error: auditError } = await result.supabase.from('audit_logs').insert({
    actor_id: result.user.id,
    business_id: result.business.id,
    entity_type: 'business_document',
    entity_id: data.id,
    action: 'document_uploaded',
    metadata: { file_name: data.file_name, mime_type: data.mime_type, size_bytes: data.size_bytes, checksum: data.checksum },
  })
  if (auditError) {
    await result.supabase.from('business_documents').delete().eq('id', data.id).eq('business_id', result.business.id)
    await result.supabase.storage.from(DOCUMENT_BUCKET).remove([storagePath])
    return NextResponse.json({ error: 'Document upload was rolled back because its audit event could not be recorded.', detail: auditError.message }, { status: 503 })
  }
  return NextResponse.json({ data }, { status: 201 })
}
