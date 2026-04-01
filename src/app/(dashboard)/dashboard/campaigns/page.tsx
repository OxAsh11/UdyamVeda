'use client'

import { useEffect, useState } from 'react'
import { Loader2, Wand2, ChevronDown, ChevronUp, Copy, CheckCircle2, ArrowRight, Edit3 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string
  name: string
  channel: string
  goal: string
  week_number: number
  brief: string
  content_draft: string
  status: 'draft' | 'approved' | 'scheduled' | 'live' | 'completed'
}

const CHANNEL_ICON: Record<string, string> = { Instagram: '📸', WhatsApp: '💬', Email: '📧' }
const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-white/06 text-white/40',
  approved: 'bg-white/10 text-white/70',
  scheduled: 'bg-white/10 text-white/70',
  live: 'bg-white/12 text-white/80',
  completed: 'bg-white/08 text-white/50',
}

const MONTHS = [
  { label: 'Month 1', weeks: [1, 2, 3, 4] },
  { label: 'Month 2', weeks: [5, 6, 7, 8] },
  { label: 'Month 3', weeks: [9, 10, 11, 12] },
]

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gtm/campaigns')
      .then(r => r.json())
      .then(d => { setCampaigns(d.campaigns); setLoading(false) })
  }, [])

  async function generate() {
    setGenerating(true)
    const res = await fetch('/api/gtm/campaigns', { method: 'POST' })
    const data = await res.json()
    if (data.error) { toast.error(data.error); setGenerating(false); return }
    setCampaigns(data.campaigns)
    toast.success('9 campaigns generated across 3 months')
    setGenerating(false)
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch('/api/gtm/campaigns', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    const data = await res.json()
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, ...data.campaign } : c))
    toast.success(`Marked as ${status}`)
  }

  async function saveContentEdit(id: string) {
    await fetch('/api/gtm/campaigns', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, content_draft: editContent }),
    })
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, content_draft: editContent } : c))
    setEditing(null)
    toast.success('Content saved')
  }

  function copyContent(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-white/40 text-sm">Loading campaigns...</div>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Campaigns</h1>
          <p className="text-white/40 text-sm">Your 90-day campaign plan with ready-to-use content</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={generate} disabled={generating}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all disabled:opacity-40">
            {generating ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
            {generating ? 'Generating...' : campaigns.length ? 'Regenerate' : 'Generate campaigns'}
          </button>
          {campaigns.some(c => c.status === 'approved') && (
            <button onClick={() => router.push('/dashboard/distribute')}
              className="btn-accent flex items-center gap-2 px-4 py-2 text-sm">
              Distribute <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Generating overlay */}
      {generating && (
        <div className="glass p-10 flex flex-col items-center gap-3 mb-6">
          <Loader2 size={24} className="animate-spin text-white/40" />
          <div className="text-white/50 text-sm text-center">
            Building your 9-campaign plan...<br />
            <span className="text-white/30 text-xs">15–20 seconds</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!generating && campaigns.length === 0 && (
        <div className="glass p-10 text-center">
          <div className="text-white/20 text-4xl mb-4">📋</div>
          <div className="text-white/60 font-medium text-sm mb-1">No campaigns yet</div>
          <p className="text-white/35 text-xs mb-5">Generate your GTM strategy first, then come back to build your campaign plan.</p>
          <button onClick={generate} className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm mx-auto">
            <Wand2 size={13} /> Generate campaigns
          </button>
        </div>
      )}

      {/* Stats bar */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: campaigns.length },
            { label: 'Draft', value: campaigns.filter(c => c.status === 'draft').length },
            { label: 'Approved', value: campaigns.filter(c => c.status === 'approved').length },
            { label: 'Completed', value: campaigns.filter(c => c.status === 'completed').length },
          ].map(s => (
            <div key={s.label} className="glass p-4">
              <div className="text-xl font-semibold text-white">{s.value}</div>
              <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Campaign list by month */}
      {MONTHS.map(month => {
        const monthCampaigns = campaigns.filter(c => month.weeks.includes(c.week_number))
        if (monthCampaigns.length === 0) return null

        return (
          <div key={month.label} className="mb-6">
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-3">{month.label}</div>
            <div className="flex flex-col gap-3">
              {monthCampaigns.map(campaign => {
                const isExpanded = expanded === campaign.id
                const isEditing = editing === campaign.id

                return (
                  <div key={campaign.id} className={`glass transition-all ${isExpanded ? 'border-white/15' : ''}`}>
                    {/* Card header */}
                    <div className="p-4 flex items-center gap-3 cursor-pointer"
                      onClick={() => setExpanded(isExpanded ? null : campaign.id)}>
                      <div className="text-xl shrink-0">{CHANNEL_ICON[campaign.channel] ?? '📢'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-white/80 font-medium text-sm">{campaign.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize font-medium ${STATUS_STYLES[campaign.status]}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/35 text-xs">
                          <span>{campaign.channel}</span>
                          <span>·</span>
                          <span>Week {campaign.week_number}</span>
                          <span>·</span>
                          <span>{campaign.goal}</span>
                        </div>
                      </div>
                      <div className="text-white/25 shrink-0">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="border-t border-white/07 px-4 pb-4">
                        {/* Brief */}
                        <div className="mt-4 mb-4">
                          <div className="text-white/35 text-xs uppercase tracking-wide mb-2">Campaign Brief</div>
                          <p className="text-white/60 text-sm leading-relaxed">{campaign.brief}</p>
                        </div>

                        {/* Content draft */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-white/35 text-xs uppercase tracking-wide">Content Draft</div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditing(campaign.id); setEditContent(campaign.content_draft) }}
                                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors">
                                <Edit3 size={11} /> Edit
                              </button>
                              <button onClick={() => copyContent(campaign.id, campaign.content_draft)}
                                className="flex items-center gap-1.5 text-xs text-white/35 hover:text-white/65 transition-colors">
                                {copied === campaign.id ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                                {copied === campaign.id ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="flex flex-col gap-2">
                              <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                rows={5}
                                className="glass-input w-full px-3 py-2.5 text-sm resize-none"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => saveContentEdit(campaign.id)}
                                  className="btn-accent px-4 py-1.5 text-xs">Save</button>
                                <button onClick={() => setEditing(null)}
                                  className="px-4 py-1.5 text-xs rounded-lg border border-white/10 text-white/40 hover:text-white/70 transition-all">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white/[0.03] border border-white/07 rounded-xl p-3">
                              <p className="text-white/65 text-sm leading-relaxed whitespace-pre-wrap">{campaign.content_draft}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {campaign.status === 'draft' && (
                            <button onClick={() => updateStatus(campaign.id, 'approved')}
                              className="btn-accent flex items-center gap-1.5 px-4 py-2 text-xs">
                              <CheckCircle2 size={12} /> Approve content
                            </button>
                          )}
                          {campaign.status === 'approved' && (
                            <button onClick={() => router.push('/dashboard/distribute')}
                              className="btn-accent flex items-center gap-1.5 px-4 py-2 text-xs">
                              <ArrowRight size={12} /> Schedule in Distribute
                            </button>
                          )}
                          {campaign.status === 'live' && (
                            <button onClick={() => updateStatus(campaign.id, 'completed')}
                              className="flex items-center gap-1.5 px-4 py-2 text-xs rounded-xl border border-white/10 text-white/50 hover:text-white/80 transition-all">
                              <CheckCircle2 size={12} /> Mark completed
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
