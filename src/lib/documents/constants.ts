export const DOCUMENT_BUCKET = 'business-documents'
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024
export const SIGNED_URL_SECONDS = 5 * 60

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const

export type DocumentScanStatus = 'pending' | 'clean' | 'rejected' | 'failed'

export function safeFileName(name: string) {
  const normalized = name.normalize('NFKC').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return normalized.slice(0, 120) || 'document'
}

export function isDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}
