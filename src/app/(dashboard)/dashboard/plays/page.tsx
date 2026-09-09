'use client'

import { useEffect, useState } from 'react'
import { PLAY_TEMPLATES, PlayTemplate } from '@/lib/data/plays'
import { Play, ArrowRight, Calendar, BarChart2, X, Check, Loader2, Pause, ChevronDown, ChevronUp, Edit3, Trash2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const CHANNEL_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-600 border-pink-200',
  WhatsApp: 'bg-green-50 text-green-600 border-green-200',
  Email: 'bg-blue-50 text-blue-600 border-blue-200',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600',
  paused: 'bg-amber-50 text-amber-600',
  completed: 'bg-neutral-100 text-neutral-400',
}

interface ActivePlay {
  id: string
  template_id: string
  name: string
  status: string
  start_date: string
  target_metric: string
  context: Record<string, string>
}

interface ContentSlot {
  id: string
  week_number: number
  channel: string
  slot_type: string
  title: string
  content: string
  status: string
}

export default function PlaysPage() {
  const [tab, setTab] = useState<'library' | 'active'>('library')
  const [activePlays, setActivePlays] = useState<ActivePlay[]>([])
  const [loading, setLoading] = useState(true)

  // Activate modal
  const [activating, setActivating] = useState<PlayTemplate | null>(null)
  const [activateName, setActivateName] = useState('')
  const [activateContext, setActivateContext] = useState<Record<string, string>>({})
  const [activating2, setActivating2] = useState(false)

  // Expanded play detail
  const [expandedPlay, setExpandedPlay] = useState<string | null>(null)
  const [playSlots, setPlaySlots] = useState<Record<string, ContentSlot[]>>({})
  const [editingSlot, setEditingSlot] = useState<string | null>(null)
  const [slotContent, setSlotContent] = useState('')
  const [generatingSlot, setGeneratingSlot] = useState<string | null>(null)

  useEffect(() => {
    loadPlays()
  }, [])

  async function loadPlays() {
    const res = await fetch('/api/plays')
    const data = await res.json()
    setActivePlays(data.plays ?? [])
    setLoading(false)
  }

  async function activatePlay() {
    if (!activating || !activateName.trim()) {
      toast.error('Give this play a name')
      return
    }
    setActivating2(true)
    try {
      const res = await fetch('/api/plays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: activating.id,
          name: activateName,
          context: activateContext,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setActivePlays(prev => [data.play, ...prev])
      setActivating(null)
      setActivateName('')
      setActivateContext({})
      setTab('active')
      toast.success(`"${activateName}" is now active`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to activate play')
    } finally {
      setActivating2(false)
    }
  }

  async function loadSlots(playId: string) {
    if (playSlots[playId]) return
    const res = await fetch(`/api/plays/${playId}`)
    const data = await res.json()
    setPlaySlots(prev => ({ ...prev, [playId]: data.slots ?? [] }))
  }

  async function toggleExpand(playId: string) {
    if (expandedPlay === playId) {
      setExpandedPlay(null)
    } else {
      setExpandedPlay(playId)
      await loadSlots(playId)
    }
  }

  async function saveSlotContent(slot: ContentSlot, playId: string) {
    const res = await fetch(`/api/plays/${playId}/slots`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slot.id, content: slotContent }),
    })
    const data = await res.json()
    setPlaySlots(prev => ({
      ...prev,
      [playId]: prev[playId].map(s => s.id === slot.id ? data.slot : s),
    }))
    setEditingSlot(null)
    toast.success('Saved')
  }

  async function generateContent(slot: ContentSlot, playId: string) {
    setGeneratingSlot(slot.id)
    try {
      const res = await fetch(`/api/plays/${playId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: slot.id }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.detail ?? data.error)
      setPlaySlots(prev => ({
        ...prev,
        [playId]: prev[playId].map(s => s.id === slot.id ? data.slot : s),
      }))
      toast.success('Content generated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setGeneratingSlot(null)
    }
  }

  async function updateSlotStatus(slot: ContentSlot, playId: string, status: string) {
    const res = await fetch(`/api/plays/${playId}/slots`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_id: slot.id, status }),
    })
    const data = await res.json()
    setPlaySlots(prev => ({
      ...prev,
      [playId]: prev[playId].map(s => s.id === slot.id ? data.slot : s),
    }))
  }

  async function updatePlayStatus(playId: string, status: string) {
    await fetch(`/api/plays/${playId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setActivePlays(prev => prev.map(p => p.id === playId ? { ...p, status } : p))
  }

  async function deletePlay(playId: string) {
    if (!confirm('Remove this play? All its content slots will be deleted.')) return
    await fetch(`/api/plays/${playId}`, { method: 'DELETE' })
    setActivePlays(prev => prev.filter(p => p.id !== playId))
    if (expandedPlay === playId) setExpandedPlay(null)
    toast.success('Play removed')
  }

  // Group slots by week
  function groupByWeek(slots: ContentSlot[]) {
    const map: Record<number, ContentSlot[]> = {}
    slots.forEach(s => {
      if (!map[s.week_number]) map[s.week_number] = []
      map[s.week_number].push(s)
    })
    return map
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Plays</h1>
          <p className="text-neutral-400 text-sm">Pre-built GTM playbooks — pick one and run it</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/calendar" className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-all">
            <Calendar size={12} /> Calendar
          </Link>
          <Link href="/dashboard/track" className="flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-all">
            <BarChart2 size={12} /> Track
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6 w-fit">
        {(['library', 'active'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
              tab === t ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t === 'active' ? `Active${activePlays.length > 0 ? ` (${activePlays.length})` : ''}` : 'Library'}
          </button>
        ))}
      </div>

      {/* Library tab */}
      {tab === 'library' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PLAY_TEMPLATES.map(play => (
            <div key={play.id} className="glass p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-neutral-900 font-semibold text-sm">{play.name}</div>
                  <div className="text-neutral-400 text-xs mt-0.5">{play.tagline}</div>
                </div>
                <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full shrink-0 ml-2">
                  {play.duration_weeks}w
                </span>
              </div>

              <p className="text-neutral-500 text-xs leading-relaxed mb-3">{play.objective}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {play.channels.map(ch => (
                  <span key={ch} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${CHANNEL_COLORS[ch] ?? 'bg-neutral-100 text-neutral-500 border-neutral-200'}`}>
                    {ch}
                  </span>
                ))}
              </div>

              <div className="text-neutral-400 text-xs mb-4">
                <span className="text-neutral-300">Ideal for:</span> {play.ideal_for}
              </div>

              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <div className="text-neutral-400 text-xs">{play.content_slots.length} content pieces</div>
                <button
                  onClick={() => {
                    setActivating(play)
                    setActivateName(play.name)
                    setActivateContext({})
                  }}
                  className="btn-accent flex items-center gap-1.5 px-3 py-1.5 text-xs"
                >
                  <Play size={10} /> Activate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active tab */}
      {tab === 'active' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin text-neutral-300" />
            </div>
          ) : activePlays.length === 0 ? (
            <div className="glass p-12 text-center">
              <Play size={28} className="text-neutral-300 mx-auto mb-3" />
              <div className="text-neutral-500 text-sm font-medium mb-1">No active plays yet</div>
              <div className="text-neutral-400 text-xs mb-5">Go to the Library and activate a play to get started</div>
              <button onClick={() => setTab('library')} className="btn-accent px-4 py-2 text-sm inline-flex items-center gap-2">
                Browse library <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activePlays.map(play => {
                const template = PLAY_TEMPLATES.find(t => t.id === play.template_id)
                const isExpanded = expandedPlay === play.id
                const slots = playSlots[play.id] ?? []
                const weekGroups = groupByWeek(slots)
                const doneCount = slots.filter(s => s.status === 'published' || s.status === 'ready').length

                return (
                  <div key={play.id} className="glass overflow-hidden">
                    {/* Play header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-neutral-900 font-semibold text-sm truncate">{play.name}</div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${STATUS_STYLES[play.status]}`}>
                              {play.status}
                            </span>
                          </div>
                          <div className="text-neutral-400 text-xs">{template?.name} · {template?.duration_weeks} weeks · {play.target_metric}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-4 shrink-0">
                          {play.status === 'active' ? (
                            <button onClick={() => updatePlayStatus(play.id, 'paused')}
                              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-amber-500 hover:border-amber-200 transition-all"
                              title="Pause play">
                              <Pause size={13} />
                            </button>
                          ) : play.status === 'paused' ? (
                            <button onClick={() => updatePlayStatus(play.id, 'active')}
                              className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-emerald-500 hover:border-emerald-200 transition-all"
                              title="Resume play">
                              <Play size={13} />
                            </button>
                          ) : null}
                          <button onClick={() => deletePlay(play.id)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-red-400 hover:border-red-200 transition-all"
                            title="Remove play">
                            <Trash2 size={13} />
                          </button>
                          <button onClick={() => toggleExpand(play.id)}
                            className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-all">
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {template && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-neutral-400 text-xs">{doneCount}/{template.content_slots.length} pieces done</span>
                            <span className="text-neutral-400 text-xs">Started {new Date(play.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                          </div>
                          <div className="w-full bg-neutral-100 rounded-full h-1.5">
                            <div
                              className="bg-neutral-400 h-1.5 rounded-full transition-all"
                              style={{ width: `${template.content_slots.length > 0 ? (doneCount / template.content_slots.length) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded content slots */}
                    {isExpanded && (
                      <div className="border-t border-neutral-100">
                        {slots.length === 0 ? (
                          <div className="p-6 text-center text-neutral-400 text-sm">
                            <Loader2 size={16} className="animate-spin mx-auto mb-2" />
                            Loading content...
                          </div>
                        ) : (
                          Object.entries(weekGroups).map(([week, weekSlots]) => (
                            <div key={week} className="border-b border-neutral-100 last:border-0">
                              <div className="px-5 py-2.5 bg-neutral-50">
                                <span className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Week {week}</span>
                              </div>
                              <div className="divide-y divide-neutral-100">
                                {weekSlots.map(slot => (
                                  <div key={slot.id} className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${CHANNEL_COLORS[slot.channel] ?? 'bg-neutral-100 text-neutral-400 border-neutral-200'}`}>
                                            {slot.channel}
                                          </span>
                                          <span className="text-neutral-400 text-[10px]">{slot.slot_type}</span>
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
                                              <button onClick={() => saveSlotContent(slot, play.id)}
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
                                            <p className="text-neutral-500 text-xs mt-1.5 leading-relaxed line-clamp-2">{slot.content}</p>
                                          ) : null
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        {/* Status toggle */}
                                        <select
                                          value={slot.status}
                                          onChange={e => updateSlotStatus(slot, play.id, e.target.value)}
                                          className="text-xs border border-neutral-200 rounded-lg px-2 py-1 text-neutral-500 bg-white appearance-none cursor-pointer"
                                        >
                                          <option value="draft">Draft</option>
                                          <option value="ready">Ready</option>
                                          <option value="published">Published</option>
                                        </select>
                                        <button
                                          onClick={() => generateContent(slot, play.id)}
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
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Activate modal */}
      {activating && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-neutral-900 font-semibold">{activating.name}</div>
                <div className="text-neutral-400 text-xs mt-0.5">{activating.duration_weeks} weeks · {activating.content_slots.length} content pieces</div>
              </div>
              <button onClick={() => setActivating(null)} className="text-neutral-400 hover:text-neutral-600 p-1">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-3 mb-5">
              <div>
                <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">Play name</label>
                <input
                  value={activateName}
                  onChange={e => setActivateName(e.target.value)}
                  placeholder={`e.g. Diwali ${activating.name}`}
                  className="glass-input w-full px-3 py-2 text-sm"
                />
              </div>

              {activating.context_fields.map(field => (
                <div key={field.key}>
                  <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide block mb-1.5">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={activateContext[field.key] ?? ''}
                      onChange={e => setActivateContext(c => ({ ...c, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={2}
                      className="glass-input w-full px-3 py-2 text-sm resize-none"
                    />
                  ) : (
                    <input
                      value={activateContext[field.key] ?? ''}
                      onChange={e => setActivateContext(c => ({ ...c, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="glass-input w-full px-3 py-2 text-sm"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={activatePlay} disabled={activating2}
                className="btn-accent flex items-center gap-2 px-4 py-2 text-sm flex-1 justify-center disabled:opacity-40">
                {activating2 ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
                Activate play
              </button>
              <button onClick={() => setActivating(null)}
                className="px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-700 transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
