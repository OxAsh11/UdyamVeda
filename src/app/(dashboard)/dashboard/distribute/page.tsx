'use client'

import { useEffect, useState } from 'react'
import { ExternalLink, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Campaign {
  id: string
  name: string
  channel: string
  content_draft: string
  status: string
  week_number: number
}

const CHANNEL_CONFIG = {
  Instagram: {
    icon: '📸',
    color: 'rgba(255,255,255,0.08)',
    steps: ['Open Instagram app or Creator Studio', 'Paste the caption from your content draft', 'Add relevant images or Reels', 'Schedule or publish immediately'],
    setupUrl: 'https://business.instagram.com',
    setupLabel: 'Open Instagram Business',
  },
  WhatsApp: {
    icon: '💬',
    color: 'rgba(255,255,255,0.06)',
    steps: ['Open WhatsApp Business app', 'Go to Broadcasts → New Broadcast', 'Paste your message', 'Select contacts and send'],
    setupUrl: 'https://business.whatsapp.com',
    setupLabel: 'Open WhatsApp Business',
  },
  Email: {
    icon: '📧',
    color: 'rgba(255,255,255,0.05)',
    steps: ['Open your email tool (Gmail, Mailchimp, etc.)', 'Create a new campaign', 'Paste the subject line and body from draft', 'Send to your list'],
    setupUrl: 'https://mailchimp.com',
    setupLabel: 'Open Mailchimp',
  },
}

export default function DistributePage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gtm/campaigns')
      .then(r => r.json())
      .then(d => {
        const approved = (d.campaigns as Campaign[]).filter(c => ['approved', 'scheduled', 'live'].includes(c.status))
        setCampaigns(approved)
        setLoading(false)
      })
  }, [])

  async function markLive(id: string) {
    setMarking(id)
    await fetch('/api/gtm/campaigns', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'live' }),
    })
    setCampaigns(cs => cs.map(c => c.id === id ? { ...c, status: 'live' } : c))
    setMarking(null)
    toast.success('Campaign marked as live!')
  }

  function copyContent(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  // Group by channel
  const byChannel = campaigns.reduce((acc, c) => {
    if (!acc[c.channel]) acc[c.channel] = []
    acc[c.channel].push(c)
    return acc
  }, {} as Record<string, Campaign[]>)

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-white/40 text-sm">Loading publish queue...</div>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Distribute</h1>
          <p className="text-white/40 text-sm">Approved campaigns ready to publish</p>
        </div>
        <button onClick={() => router.push('/dashboard/track')}
          className="btn-accent flex items-center gap-2 px-4 py-2 text-sm">
          Track <ArrowRight size={13} />
        </button>
      </div>

      {/* Empty state */}
      {campaigns.length === 0 && (
        <div className="glass p-10 text-center">
          <div className="text-white/20 text-4xl mb-4">📭</div>
          <div className="text-white/60 font-medium text-sm mb-1">No approved campaigns yet</div>
          <p className="text-white/35 text-xs mb-5">Go to Campaigns, review your content drafts, and approve them to start distributing.</p>
          <button onClick={() => router.push('/dashboard/campaigns')}
            className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm mx-auto">
            Go to Campaigns <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Stats */}
      {campaigns.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Ready to publish', value: campaigns.filter(c => c.status === 'approved').length },
            { label: 'Live', value: campaigns.filter(c => c.status === 'live').length },
            { label: 'Channels', value: Object.keys(byChannel).length },
          ].map(s => (
            <div key={s.label} className="glass p-4">
              <div className="text-xl font-semibold text-white">{s.value}</div>
              <div className="text-white/35 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Channels */}
      {Object.entries(byChannel).map(([channel, cList]) => {
        const config = CHANNEL_CONFIG[channel as keyof typeof CHANNEL_CONFIG]
        if (!config) return null

        return (
          <div key={channel} className="mb-6">
            {/* Channel header */}
            <div className="glass p-5 mb-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{config.icon}</div>
                  <div>
                    <div className="text-white/85 font-semibold text-sm">{channel}</div>
                    <div className="text-white/35 text-xs">{cList.length} campaign{cList.length > 1 ? 's' : ''} queued</div>
                  </div>
                </div>
                <a href={config.setupUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/45 hover:text-white/75 hover:border-white/20 transition-all">
                  {config.setupLabel} <ExternalLink size={11} />
                </a>
              </div>

              {/* How to publish steps */}
              <div className="bg-white/[0.03] border border-white/07 rounded-xl p-3">
                <div className="text-white/30 text-xs uppercase tracking-wide mb-2">How to publish</div>
                <ol className="flex flex-col gap-1.5">
                  {config.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                      <span className="w-4 h-4 rounded-full bg-white/07 text-white/30 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Campaign cards */}
            <div className="flex flex-col gap-2 pl-3 border-l border-white/07">
              {cList.map(campaign => (
                <div key={campaign.id} className="glass p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/75 font-medium text-sm">{campaign.name}</span>
                        {campaign.status === 'live' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60 flex items-center gap-1">
                            <CheckCircle2 size={9} /> Live
                          </span>
                        )}
                        {campaign.status === 'approved' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/06 text-white/40 flex items-center gap-1">
                            <Clock size={9} /> Ready
                          </span>
                        )}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">Week {campaign.week_number}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="bg-white/[0.03] border border-white/07 rounded-xl p-3 mb-3">
                    <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{campaign.content_draft}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => copyContent(campaign.id, campaign.content_draft)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/45 hover:text-white/75 transition-all">
                      {copied === campaign.id ? <><CheckCircle2 size={11} /> Copied</> : 'Copy content'}
                    </button>
                    {campaign.status === 'approved' && (
                      <button onClick={() => markLive(campaign.id)} disabled={marking === campaign.id}
                        className="btn-accent flex items-center gap-1.5 px-4 py-1.5 text-xs disabled:opacity-40">
                        <CheckCircle2 size={11} />
                        {marking === campaign.id ? 'Marking...' : 'Mark as published'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
