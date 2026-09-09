'use client'

import { useEffect, useState } from 'react'
import { FilePlus2, FileText, Link2, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

type DocumentRecord = {
  id: string
  file_name: string
  mime_type: string
  size_bytes: number
  expires_at: string | null
  scan_status: 'pending' | 'clean' | 'rejected' | 'failed'
}

type Requirement = {
  id: string
  name: string
  required: boolean
}

type Relation<T> = T | T[] | null | undefined

type ExistingLink = {
  id: string
  status: string
  business_document: Relation<Pick<DocumentRecord, 'file_name' | 'mime_type' | 'expires_at' | 'scan_status'>>
  opportunity_requirement?: Relation<Pick<Requirement, 'name' | 'required'>>
}

function firstRelation<T>(value: Relation<T>) {
  return (Array.isArray(value) ? value[0] : value) ?? null
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentLinker({
  applicationId,
  requirements,
  initialLinks,
}: {
  applicationId: string
  requirements: Requirement[]
  initialLinks: ExistingLink[]
}) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([])
  const [links, setLinks] = useState<ExistingLink[]>(initialLinks)
  const [documentId, setDocumentId] = useState('')
  const [requirementId, setRequirementId] = useState('')
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [busyLinkId, setBusyLinkId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/documents', { cache: 'no-store' })
      .then(async response => {
        const payload = await response.json().catch(() => ({})) as { data?: DocumentRecord[]; error?: string }
        if (!response.ok) throw new Error(payload.error ?? 'Unable to load the document vault')
        if (!cancelled) setDocuments(payload.data ?? [])
      })
      .catch(error => {
        if (!cancelled) toast.error(error instanceof Error ? error.message : 'Unable to load the document vault')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  async function linkDocument() {
    if (!documentId) {
      toast.error('Choose a clean document first')
      return
    }
    setAdding(true)
    try {
      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDocumentId: documentId, ...(requirementId ? { opportunityRequirementId: requirementId } : {}) }),
      })
      const payload = await response.json().catch(() => ({})) as { data?: { id: string; status: string }; error?: string }
      if (!response.ok || !payload.data) throw new Error(payload.error ?? 'Unable to link document')
      const document = documents.find(item => item.id === documentId)
      const requirement = requirements.find(item => item.id === requirementId)
      if (document) {
        setLinks(previous => [{ id: payload.data!.id, status: payload.data!.status, business_document: document, opportunity_requirement: requirement ?? null }, ...previous])
      }
      setDocumentId('')
      setRequirementId('')
      toast.success('Document linked to this application')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to link document')
    } finally {
      setAdding(false)
    }
  }

  async function unlinkDocument(linkId: string) {
    setBusyLinkId(linkId)
    try {
      const response = await fetch(`/api/applications/${applicationId}/documents`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      })
      const payload = await response.json().catch(() => ({})) as { error?: string }
      if (!response.ok) throw new Error(payload.error ?? 'Unable to unlink document')
      setLinks(previous => previous.filter(link => link.id !== linkId))
      toast.success('Document unlinked')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to unlink document')
    } finally {
      setBusyLinkId(null)
    }
  }

  const cleanDocuments = documents.filter(document => document.scan_status === 'clean')

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
        <p className="text-xs leading-5 text-cyan-900">Attach a clean document from your private vault to this application. The official portal still receives the final submission from you.</p>
        <div className="mt-3 grid gap-2 md:grid-cols-[1fr_1fr_auto]">
          <label className="block text-[11px] font-semibold text-slate-600">Vault document<select value={documentId} onChange={event => setDocumentId(event.target.value)} disabled={loading || adding} className="mt-1 w-full rounded-lg border border-cyan-200 bg-white px-2.5 py-2 text-xs text-slate-700"><option value="">{loading ? 'Loading documents...' : cleanDocuments.length ? 'Choose a clean document' : 'No clean documents available'}</option>{cleanDocuments.map(document => <option key={document.id} value={document.id}>{document.file_name} · {formatSize(document.size_bytes)}</option>)}</select></label>
          <label className="block text-[11px] font-semibold text-slate-600">Requirement (optional)<select value={requirementId} onChange={event => setRequirementId(event.target.value)} disabled={loading || adding} className="mt-1 w-full rounded-lg border border-cyan-200 bg-white px-2.5 py-2 text-xs text-slate-700"><option value="">General application document</option>{requirements.map(requirement => <option key={requirement.id} value={requirement.id}>{requirement.name}{requirement.required ? ' · required' : ''}</option>)}</select></label>
          <button type="button" onClick={linkDocument} disabled={loading || adding || !documentId} className="inline-flex h-9 items-center justify-center gap-1.5 self-end rounded-lg bg-cyan-600 px-3 text-xs font-bold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50">{adding ? <Loader2 size={13} className="animate-spin" /> : <FilePlus2 size={13} />}Link document</button>
        </div>
        {!requirements.length ? <p className="mt-2 text-[11px] text-slate-500">This opportunity version has no document requirements in the reviewed catalog.</p> : null}
      </div>

      {links.length ? <div className="space-y-2">{links.map(link => { const document = firstRelation(link.business_document); const requirement = firstRelation(link.opportunity_requirement); return <div key={link.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-xs"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600"><FileText size={14} /></div><div className="min-w-0 flex-1"><div className="truncate font-semibold text-slate-700">{document?.file_name ?? 'Document'}</div><div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-400"><span>{requirement?.name ?? 'General application document'}</span><span>· {link.status}</span></div></div><button type="button" onClick={() => unlinkDocument(link.id)} disabled={busyLinkId === link.id} aria-label={`Unlink ${document?.file_name ?? 'document'}`} className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50 disabled:opacity-50">{busyLinkId === link.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}</button></div> })}</div> : <div className="rounded-xl border border-dashed border-cyan-200 bg-cyan-50/30 p-4 text-xs leading-5 text-slate-500"><Link2 className="mb-2 text-cyan-600" size={16} />No documents linked yet. Upload and scan a document in the <a href="/dashboard/documents" className="font-bold text-cyan-700 hover:underline">Document Vault</a>, then attach it here.</div>}
    </div>
  )
}
