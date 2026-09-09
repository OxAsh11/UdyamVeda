'use client'

import { useEffect, useState } from 'react'
import { Calendar, Loader2, Check, X, Edit3, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const CHANNEL_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-600 border-pink-200',
  WhatsApp: 'bg-green-50 text-green-600 border-green-200',
  Email: 'bg-blue-50 text-blue-600 border-blue-200',
}

const STATUS_DOT: Record<string, string> = {
  draft: 'bg-neutral-300',
  ready: 'bg-amber-400',
  published: 'bg-emerald-400',
}

interface ActivePlay {
  id: string
  template_id: string
  name: string
  status: string
  start_date: string
}

interface ContentSlot {
  id: string
  play_id: string
  week_number: number
  channel: string
  slot_type: string
  title: string
  content: string
  status: string
}

export default function CalendarPage() {
  const [plays, setPlays] = useState<ActivePlay[]>([])
  const [allSlots, setAllSlots] = useState<ContentSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [channelFilter, setChannelFilter] = useState<string>('All')
  const [playFilter, setPlayFilter] = useState<string>('All')
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [slotContent, setSlotContent] = useState('')
  const [generatingSlot, setGeneratingSlot] = useState<string | null>(null)

  const CHANNELS = ['All', 'Instagram', 'WhatsApp', 'Email']

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/plays')
      const data = await res.json()
      const activePlays: ActivePlay[] = (data.plays ?? []).filter((p: ActivePlay) => p.status !== 'completed')
      setPlays(activePlays)

      // Load slots for all active plays
      const slotArrays = await Promise.all(
        activePlays.map(async (play) => {
          const r = await fetch(`/api/plays/${play.id}`)
          const d = await r.json()
          return (d.slots ?? []) as ContentSlot[]
        })
      )
      setAllSlots(slotArrays.flat())
      setLoading(false)
    }
    load()
  }, [])

  async function saveSlotContent(slot: ContentSlot) {
    const res = await fetch(`/api/plays/${slot.play_id}/slots`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slot.id, content: slotContent }),
    })
    const data = await res.json()
    setAllSlots(prev => prev.map(s => s.id === slot.id ? data.slot : s))
    setEditingSlot(null)
    toast.success('Saved')
  }

  async function generateContent(slot: ContentSlot) {
    setGeneratingSlot(slot.id)
    try {
      const res = await fetch(`/api/plays/${slot.play_id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slot.id }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.detail ?? data.error)
      setAllSlots(prev => prev.map(s => s.id === slot.id ? data.slot : s))
      toast.success('Content generated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGeneratingSlot(null)
    }
  }

  async function updateStatus(slot: ContentSlot, status: string) {
    const res = await fetch(`/api/plays/${slot.play_id}/slots`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slot.id, status }),
    })
    const data = await res.json()
    setAllSlots(prev => prev.map(s => s.id === slot.id ? data.slot : s))
  }

  // Filter slots
  const filtered = allSlots.filter(s => {
    if (channelFilter !== 'All' && s.channel !== channelFilter) return false
    if (playFilter !== 'All' && s.play_id !== playFilter) return false
    return true
  })

  // Group by week
  const maxWeek = filtered.reduce((max, s) => Math.max(max, s.week_number), 0)
  const weeks = Array.from({ length: maxWeek }, (_, i) => i + 1)

  function slotsForWeek(week: number) {
    return filtered.filter(s => s.week_number === week)
  }

  function getPlayName(playId: string) {
    return plays.find(p => p.id === playId)?.name ?? ''
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={20} className="animate-spin text-neutral-300" />
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Calendar</h1>
          <p className="text-neutral-400 text-sm">All your active play content, week by week</p>
        </div>
        <Link href="/dashboard/plays" className="btn-accent flex items-center gap-2 px-4 py-2 text-sm">
          Manage plays
        </Link>
      </div>

      {plays.length === 0 ? (
        <div className="glass p-12 text-center">
          <Calendar size={28} className="text-neutral-300 mx-auto mb-3" />
          <div className="text-neutral-500 text-sm font-medium mb-1">No active plays</div>
          <div className="text-neutral-400 text-xs mb-5">Activate a play to see its content schedule here</div>
          <Link href="/dashboard/plays" className="btn-accent px-4 py-2 text-sm inline-flex items-center gap-2">
            Go to Plays
          </Link>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl">
              {CHANNELS.map(ch => (
                <button key={ch} onClick={() => setChannelFilter(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    channelFilter === ch ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                  }`}>
                  {ch}
                </button>
              ))}
            </div>

            {plays.length > 1 && (
              <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl">
                <button onClick={() => setPlayFilter('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${playFilter === 'All' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
                  All plays
                </button>
                {plays.map(p => (
                  <button key={p.id} onClick={() => setPlayFilter(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all truncate max-w-[120px] ${playFilter === p.id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center gap-3 ml-auto text-xs text-neutral-400">
              {[['draft', 'Draft'], ['ready', 'Ready'], ['published', 'Published']].map(([k, label]) => (
                <div key={k} className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[k]}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Week columns */}
          {weeks.length === 0 ? (
            <div className="glass p-8 text-center text-neutral-400 text-sm">No content matches your filters</div>
          ) : (
            <div className="flex flex-col gap-4">
              {weeks.map(week => {
                const weekSlots = slotsForWeek(week)
                if (weekSlots.length === 0) return null
                return (
                  <div key={week} className="glass overflow-hidden">
                    <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-neutral-700 font-semibold text-sm">Week {week}</span>
                      <span className="text-neutral-400 text-xs">{weekSlots.length} piece{weekSlots.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="divide-y divide-neutral-100">
                      {weekSlots.map(slot => (
                        <div key={slot.id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[slot.status] ?? 'bg-neutral-300'}`} />
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CHANNEL_COLORS[slot.channel] ?? 'bg-neutral-100 text-neutral-400 border-neutral-200'}`}>
                                  {slot.channel}
                                </span>
                                <span className="text-neutral-400 text-[10px]">{slot.slot_type}</span>
                                {plays.length > 1 && (
                                  <span className="text-neutral-400 text-[10px] truncate">· {getPlayName(slot.play_id)}</span>
                                )}
                              </div>

                              <div className="text-neutral-700 text-sm font-medium">{slot.title}</div>

                              {editingSlot === slot.id ? (
                                <div className="mt-2">
                                  <textarea
                                    value={slotContent}
                                    onChange={e => setSlotContent(e.target.value)}
                                    placeholder="Write your content here..."
                                    rows={3}
                                    className="glass-input w-full px-3 py-2 text-xs resize-none"
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button onClick={() => saveSlotContent(slot)}
                                      className="btn-accent flex items-center gap-1 px-3 py-1.5 text-xs">
                                      <Check size={11} /> Save
                                    </button>
                                    <button onClick={() => setEditingSlot(null)}
                                      className="px-3 py-1.5 text-xs rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-all">
                                      <X size={11} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                slot.content ? (
                                  <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed">{slot.content}</p>
                                ) : (
                                  <p className="text-neutral-300 text-xs mt-1 italic">No content written yet</p>
                                )
                              )}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <select
                                value={slot.status}
                                onChange={e => updateStatus(slot, e.target.value)}
                                className="text-xs border border-neutral-200 rounded-lg px-2 py-1 text-neutral-500 bg-white appearance-none cursor-pointer"
                              >
                                <option value="draft">Draft</option>
                                <option value="ready">Ready</option>
                                <option value="published">Published</option>
                              </select>
                              <button
                                onClick={() => generateContent(slot)}
                                disabled={generatingSlot === slot.id}
                                title="Generate content with AI"
                                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-all disabled:opacity-40"
                              >
                                {generatingSlot === slot.id
                                  ? <Loader2 size={12} className="animate-spin" />
                                  : <Sparkles size={12} />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSlot(editingSlot === slot.id ? null : slot.id)
                                  setSlotContent(slot.content ?? '')
                                }}
                                className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-all"
                              >
                                <Edit3 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
