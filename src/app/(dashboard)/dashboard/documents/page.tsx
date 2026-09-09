'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Download, FileLock2, Files, Loader2, ShieldCheck, Trash2, UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

type DocumentRecord = {
  id: string
  file_name: string
  mime_type: string
  size_bytes: number
  sensitivity: string
  expires_at: string | null
  scan_status: 'pending' | 'clean' | 'rejected' | 'failed'
  scan_provider: string | null
  scanned_at: string | null
  created_at: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function scanLabel(status: DocumentRecord['scan_status']) {
  if (status === 'clean') return 'Scanned and available'
  if (status === 'rejected') return 'Rejected by scanner'
  if (status === 'failed') return 'Scan failed'
  return 'Pending malware scan'
}

export default function DocumentsPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sensitivity, setSensitivity] = useState('standard')
  const [expiresAt, setExpiresAt] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadDocuments() {
    const response = await fetch('/api/documents', { cache: 'no-store' })
    const payload = await response.json().catch(() => ({})) as { data?: DocumentRecord[]; error?: string }
    if (!response.ok) throw new Error(payload.error ?? 'Unable to load documents')
    setDocuments(payload.data ?? [])
  }

  useEffect(() => {
    loadDocuments().catch(error => toast.error(error instanceof Error ? error.message : 'Unable to load documents')).finally(() => setLoading(false))
  }, [])

  async function uploadDocument() {
    if (!selectedFile) {
      toast.error('Choose a document first')
      return
    }
    setUploading(true)
    try {
      const form = new FormData()
      form.set('file', selectedFile)
      form.set('sensitivity', sensitivity)
      if (expiresAt) form.set('expiresAt', expiresAt)
      const response = await fetch('/api/documents', { method: 'POST', body: form })
      const payload = await response.json().catch(() => ({})) as { data?: DocumentRecord; error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Upload failed')
      if (payload.data) setDocuments(previous => [payload.data!, ...previous])
      setSelectedFile(null)
      setExpiresAt('')
      if (inputRef.current) inputRef.current.value = ''
      toast.success('Document uploaded and queued for malware scanning')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function downloadDocument(document: DocumentRecord) {
    setBusyId(document.id)
    try {
      const response = await fetch(`/api/documents/${document.id}/signed-url`, { method: 'POST' })
      const payload = await response.json().catch(() => ({})) as { data?: { signedUrl: string }; error?: string }
      if (!response.ok || !payload.data?.signedUrl) throw new Error(payload.error ?? 'Download link unavailable')
      window.open(payload.data.signedUrl, '_blank', 'noopener,noreferrer')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Download link unavailable')
    } finally {
      setBusyId(null)
    }
  }

  async function deleteDocument(document: DocumentRecord) {
    if (!window.confirm(`Delete ${document.file_name}?`)) return
    setBusyId(document.id)
    try {
      const response = await fetch(`/api/documents/${document.id}`, { method: 'DELETE' })
      const payload = await response.json().catch(() => ({})) as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Unable to delete document')
      setDocuments(previous => previous.filter(item => item.id !== document.id))
      toast.success('Document deleted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete document')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 md:p-8">
      <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Start & Operate</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">Document Vault</h1><p className="mt-2 max-w-xl text-sm text-slate-500">A private, reusable home for the documents your business needs across registrations, licences, and government applications.</p></div>
      <section className="mb-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-cyan-50 p-5"><FileLock2 size={20} className="text-cyan-600" /><h2 className="mt-4 font-bold text-slate-900">Private by design</h2><p className="mt-1 text-xs leading-5 text-slate-600">Files are stored in a private business-scoped bucket and never exposed through public URLs.</p></div><div className="rounded-2xl bg-emerald-50 p-5"><ShieldCheck size={20} className="text-emerald-600" /><h2 className="mt-4 font-bold text-slate-900">Evidence trail</h2><p className="mt-1 text-xs leading-5 text-slate-600">Checksums, scan state, expiry, sensitivity, and audit events travel with every file.</p></div><div className="rounded-2xl bg-violet-50 p-5"><UploadCloud size={20} className="text-violet-600" /><h2 className="mt-4 font-bold text-slate-900">Upload once</h2><p className="mt-1 text-xs leading-5 text-slate-600">Reuse clean documents across application checklists without re-uploading them.</p></div></section>
      <section className="mb-6 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Upload a business document</h2><p className="mt-1 text-xs text-slate-500">PDF, JPG, PNG, Office, or CSV · maximum 10 MB</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">Scanner required before download</span></div><div className="grid gap-3 md:grid-cols-[1fr_170px_170px_auto] md:items-end"><label className="block text-xs font-semibold text-slate-600">File<input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.csv,.doc,.docx,.xls,.xlsx" onChange={event => setSelectedFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" /></label><label className="block text-xs font-semibold text-slate-600">Sensitivity<select value={sensitivity} onChange={event => setSensitivity(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"><option value="standard">Standard</option><option value="sensitive">Sensitive</option><option value="highly_sensitive">Highly sensitive</option></select></label><label className="block text-xs font-semibold text-slate-600">Expires (optional)<input type="date" value={expiresAt} onChange={event => setExpiresAt(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" /></label><button onClick={uploadDocument} disabled={uploading || !selectedFile} className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 text-xs font-bold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50">{uploading ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />} Upload</button></div></section>
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Your documents</h2><p className="mt-1 text-xs text-slate-500">{documents.length} active document{documents.length === 1 ? '' : 's'}</p></div><Link href="/dashboard/applications" className="inline-flex items-center gap-1 text-xs font-bold text-cyan-700">View applications <ArrowRight size={13} /></Link></div>{loading ? <div className="flex items-center gap-2 py-8 text-sm text-slate-400"><Loader2 size={16} className="animate-spin" /> Loading vault...</div> : documents.length === 0 ? <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50/50 p-8 text-center"><Files className="mx-auto text-cyan-500" size={25} /><p className="mt-3 text-sm font-semibold text-cyan-900">No documents yet</p><p className="mt-1 text-xs text-slate-500">Upload a clean copy of a document you reuse for business workflows.</p></div> : <div className="space-y-3">{documents.map(document => <div key={document.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><Files size={17} /></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold text-slate-800">{document.file_name}</div><div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-400"><span>{formatSize(document.size_bytes)}</span><span>{document.sensitivity.replace('_', ' ')}</span>{document.expires_at ? <span>Expires {document.expires_at}</span> : null}</div></div><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${document.scan_status === 'clean' ? 'bg-emerald-50 text-emerald-700' : document.scan_status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{scanLabel(document.scan_status)}</span><div className="flex items-center gap-2">{document.scan_status === 'clean' ? <button onClick={() => downloadDocument(document)} disabled={busyId === document.id} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 px-3 py-1.5 text-xs font-bold text-cyan-700 hover:bg-cyan-50 disabled:opacity-50">{busyId === document.id ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />} Download</button> : null}<button onClick={() => deleteDocument(document)} disabled={busyId === document.id} aria-label={`Delete ${document.file_name}`} className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} /></button></div></div>)}</div>}</section>
    </div>
  )
}
