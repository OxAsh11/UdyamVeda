'use client'

import { FormEvent, useState } from 'react'
import { HandHelping, Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

const requestTypes = [
  { value: 'application_assistance', label: 'Application preparation' },
  { value: 'document_review', label: 'Document review' },
  { value: 'registration_guidance', label: 'Registration guidance' },
  { value: 'managed_concierge', label: 'Managed concierge handoff' },
] as const

export default function ConciergeRequestForm({ applicationId }: { applicationId?: string }) {
  const [requestType, setRequestType] = useState<(typeof requestTypes)[number]['value']>('application_assistance')
  const [details, setDetails] = useState('')
  const [consent, setConsent] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!consent) {
      toast.error('Please provide consent before requesting assistance.')
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, requestType, details: { message: details }, consentGiven: true }),
      })
      const payload = await response.json().catch(() => ({})) as { data?: { status: string }; error?: string }
      if (!response.ok || !payload.data) throw new Error(payload.error ?? 'Unable to submit the assistance request.')
      setSubmitted(true)
      setDetails('')
      setConsent(false)
      toast.success('Assistance request submitted')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit the assistance request.')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) {
    return <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">Request received. Our internal team will review the intake and contact you through the configured support channel. UdyamVeda will not submit government forms or handle OTPs on your behalf.</div>
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-xs leading-5 text-emerald-900"><HandHelping className="mb-2 text-emerald-600" size={17} />Beta assistance means consented intake and internal handoff. It does not make UdyamVeda a government filing portal.</div>
      <label className="block text-[11px] font-semibold text-slate-600">Assistance type<select value={requestType} onChange={event => setRequestType(event.target.value as typeof requestType)} disabled={saving} className="mt-1 w-full rounded-lg border border-emerald-200 bg-white px-2.5 py-2 text-xs text-slate-700">{requestTypes.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <label className="block text-[11px] font-semibold text-slate-600">What do you need help with?<textarea value={details} onChange={event => setDetails(event.target.value.slice(0, 1000))} disabled={saving} className="mt-1 min-h-20 w-full rounded-lg border border-emerald-200 bg-white px-2.5 py-2 text-xs font-normal text-slate-700" placeholder="Tell us what is blocking you. Do not include passwords, OTPs, or full identity numbers." /></label>
      <label className="flex items-start gap-2 text-[11px] leading-5 text-slate-600"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} disabled={saving} className="mt-0.5 accent-emerald-600" />I consent to UdyamVeda recording this request and sharing the intake with an internal professional for follow-up.</label>
      <button type="submit" disabled={saving || !consent} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />} Request assistance</button>
    </form>
  )
}
