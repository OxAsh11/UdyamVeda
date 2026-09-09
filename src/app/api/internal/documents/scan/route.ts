import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DOCUMENT_BUCKET, type DocumentScanStatus } from '@/lib/documents/constants'

const scanStatuses: DocumentScanStatus[] = ['clean', 'rejected', 'failed']

export async function POST(request: Request) {
  const configuredSecret = process.env.DOCUMENT_SCAN_WEBHOOK_SECRET
  const requestSecret = request.headers.get('x-document-scan-secret')
  if (!configuredSecret || !requestSecret || requestSecret !== configuredSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { documentId?: string; status?: DocumentScanStatus; provider?: string; error?: string; checksum?: string }
  if (!body.documentId || !body.status || !scanStatuses.includes(body.status)) return NextResponse.json({ error: 'documentId and a terminal scan status are required.' }, { status: 400 })

  const supabase = createAdminClient()
  const { data: document, error: documentError } = await supabase.from('business_documents').select('id, business_id, storage_path, checksum').eq('id', body.documentId).is('deleted_at', null).maybeSingle()
  if (documentError) return NextResponse.json({ error: 'Unable to load the document.', detail: documentError.message }, { status: 500 })
  if (!document) return NextResponse.json({ error: 'Document not found.' }, { status: 404 })
  if (body.checksum && body.checksum !== document.checksum) return NextResponse.json({ error: 'Scanner checksum does not match the uploaded file.' }, { status: 409 })

  const { error: updateError } = await supabase.from('business_documents').update({ scan_status: body.status, scan_provider: body.provider ?? process.env.DOCUMENT_SCANNER_PROVIDER ?? 'external', scanned_at: new Date().toISOString(), scan_error: body.status === 'clean' ? null : (body.error ?? 'Document failed malware scanning.') }).eq('id', document.id)
  if (updateError) return NextResponse.json({ error: 'Unable to update scan status.', detail: updateError.message }, { status: 500 })
  if (body.status !== 'clean') await supabase.storage.from(DOCUMENT_BUCKET).remove([document.storage_path])
  await supabase.from('audit_logs').insert({ business_id: document.business_id, entity_type: 'business_document', entity_id: document.id, action: `document_scan_${body.status}`, metadata: { provider: body.provider ?? null, error: body.error ?? null } })
  return NextResponse.json({ ok: true, status: body.status })
}
