'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { matchSchemes, SCHEMES, CATEGORY_LABELS, BENEFIT_TYPE_LABELS, type Scheme } from '@/lib/data/schemes'
import { BookmarkPlus, Bookmark, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Clock, Landmark, Share2, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type SavedMap = Record<string, string>       // scheme_id → status
type StepMap = Record<string, Record<number, boolean>>  // scheme_id → step_index → completed

function formatCrore(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(0)} crore`
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)} lakh`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export default function SchemesPage() {
  const [business, setBusiness] = useState<Record<string, string> | null>(null)
  const [matched, setMatched] = useState<Scheme[]>([])
  const [saved, setSaved] = useState<SavedMap>({})
  const [steps, setSteps] = useState<StepMap>({})
  const [loadingSteps, setLoadingSteps] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data: biz } = await supabase
        .from('business_profiles')
        .select('stage, founder_type, sector, state, initial_capital, business_name')
        .eq('user_id', user.id)
        .single()

      if (biz) {
        setBusiness(biz)
        setMatched(matchSchemes(biz))
      }

      const { data: savedData } = await supabase
        .from('saved_schemes')
        .select('scheme_id, status')
        .eq('user_id', user.id)

      if (savedData) {
        const map: SavedMap = {}
        savedData.forEach(s => { map[s.scheme_id] = s.status })
        setSaved(map)
      }

      // Load all scheme step progress at once
      const stepsRes = await fetch('/api/scheme-steps')
      const stepsJson = await stepsRes.json()
      if (stepsJson.progress) setSteps(stepsJson.progress)

      setLoading(false)
    }
    load()
  }, [])

  // Load steps for a specific scheme when expanded (lazy)
  async function handleExpand(schemeId: string) {
    if (expanded === schemeId) {
      setExpanded(null)
      return
    }
    setExpanded(schemeId)

    if (!steps[schemeId] && saved[schemeId]) {
      setLoadingSteps(schemeId)
      const res = await fetch(`/api/scheme-steps?scheme_id=${schemeId}`)
      const json = await res.json()
      if (json.progress?.[schemeId]) {
        setSteps(prev => ({ ...prev, [schemeId]: json.progress[schemeId] }))
      }
      setLoadingSteps(null)
    }
  }

  const toggleStep = useCallback(async (schemeId: string, stepIndex: number) => {
    const current = steps[schemeId]?.[stepIndex] ?? false
    const newVal = !current

    setSteps(prev => ({
      ...prev,
      [schemeId]: { ...(prev[schemeId] ?? {}), [stepIndex]: newVal },
    }))

    try {
      await fetch('/api/scheme-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheme_id: schemeId, step_index: stepIndex, completed: newVal }),
      })
    } catch {
      setSteps(prev => ({
        ...prev,
        [schemeId]: { ...(prev[schemeId] ?? {}), [stepIndex]: current },
      }))
      toast.error('Failed to save step')
    }
  }, [steps])

  async function toggleSave(scheme: Scheme) {
    if (!userId) return
    const supabase = createClient()

    if (saved[scheme.id]) {
      await supabase.from('saved_schemes').delete()
        .eq('user_id', userId).eq('scheme_id', scheme.id)
      setSaved(prev => { const n = { ...prev }; delete n[scheme.id]; return n })
      toast.success('Removed from saved schemes')
    } else {
      await supabase.from('saved_schemes').insert({ user_id: userId, scheme_id: scheme.id, status: 'saved' })
      setSaved(prev => ({ ...prev, [scheme.id]: 'saved' }))
      toast.success('Saved! Track your application progress below.')
    }
  }

  async function markApplied(scheme: Scheme) {
    if (!userId) return
    const supabase = createClient()
    await supabase.from('saved_schemes').upsert({ user_id: userId, scheme_id: scheme.id, status: 'applied' })
    setSaved(prev => ({ ...prev, [scheme.id]: 'applied' }))
    toast.success('Marked as applied!')
  }

  function shareEligibility() {
    const totalValue = matched.reduce((s, sch) => s + sch.benefitValue, 0)
    const sectorText = business?.sector ?? 'your sector'
    const stateText = business?.state ?? 'your state'
    const text = `I just found ${matched.length} government schemes worth ${formatCrore(totalValue)} that I'm eligible for as a ${sectorText} business in ${stateText}.\n\nCheck if you qualify too → ${window.location.origin}/signup`

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Share text copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    }).catch(() => {
      toast.error('Copy failed — please copy manually')
    })
  }

  const categories = ['all', ...Array.from(new Set(matched.map(s => s.category)))]
  const displayed = filterCategory === 'all' ? matched : matched.filter(s => s.category === filterCategory)
  const savedSchemes = SCHEMES.filter(s => saved[s.id])

  // Savings calculator
  const totalEligible = matched.reduce((s, sch) => s + sch.benefitValue, 0)
  const totalClaimed = matched.filter(s => saved[s.id] === 'applied').reduce((s, sch) => s + sch.benefitValue, 0)
  const claimedCount = Object.values(saved).filter(s => s === 'applied').length

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Finding your eligible schemes...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Scheme Matcher</h1>
          <p className="text-neutral-400 text-sm">
            Government schemes you are eligible for — ranked by benefit value
          </p>
        </div>
        <button
          onClick={shareEligibility}
          className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-all"
        >
          {copied ? <><Check size={13} /> Copied!</> : <><Share2 size={13} /> Share eligibility</>}
        </button>
      </div>

      {/* Savings Calculator */}
      <div className="glass p-6 mb-6">
        <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-4">Your Scheme Potential</div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{formatCrore(totalEligible)}</div>
            <div className="text-neutral-400 text-sm">Total eligible benefits</div>
            <div className="text-neutral-400 text-xs mt-0.5">across {matched.length} schemes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{formatCrore(totalClaimed)}</div>
            <div className="text-neutral-400 text-sm">In progress / applied</div>
            <div className="text-neutral-400 text-xs mt-0.5">{claimedCount} scheme{claimedCount !== 1 ? 's' : ''} applied for</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-neutral-900 mb-1">{formatCrore(totalEligible - totalClaimed)}</div>
            <div className="text-neutral-500 text-sm">Still unclaimed</div>
            <div className="text-neutral-400 text-xs mt-0.5">{matched.length - claimedCount} schemes not yet applied</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-neutral-400 mb-1.5">
            <span>Claimed: {totalEligible > 0 ? Math.round((totalClaimed / totalEligible) * 100) : 0}%</span>
            <span>{matched.length - claimedCount} schemes remaining</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-700 rounded-full transition-all"
              style={{ width: `${totalEligible > 0 ? (totalClaimed / totalEligible) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Schemes found', value: matched.length },
          { label: 'Saved', value: Object.values(saved).filter(s => s === 'saved').length },
          { label: 'Applied', value: claimedCount },
        ].map(stat => (
          <div key={stat.label} className="glass p-4 flex flex-col gap-1">
            <div className="text-2xl font-semibold text-neutral-900">{stat.value}</div>
            <div className="text-neutral-400 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`chip ${filterCategory === cat ? 'selected' : ''}`}
          >
            {cat === 'all' ? `All (${matched.length})` : `${CATEGORY_LABELS[cat] ?? cat} (${matched.filter(s => s.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Scheme list */}
      <div className="flex flex-col gap-3 mb-10">
        {displayed.map(scheme => {
          const isExpanded = expanded === scheme.id
          const isSaved = !!saved[scheme.id]
          const isApplied = saved[scheme.id] === 'applied'
          const schemeSteps = steps[scheme.id] ?? {}
          const completedSteps = Object.values(schemeSteps).filter(Boolean).length
          const totalSteps = scheme.applicationSteps.length

          return (
            <div
              key={scheme.id}
              className={`glass transition-all ${isExpanded ? 'border-neutral-300' : ''}`}
            >
              {/* Card header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => handleExpand(scheme.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/7 text-neutral-500">
                        {CATEGORY_LABELS[scheme.category]}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/5 text-neutral-400">
                        {BENEFIT_TYPE_LABELS[scheme.benefitType]}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/7 text-neutral-500 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Applied
                        </span>
                      )}
                      {isSaved && !isApplied && completedSteps > 0 && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/5 text-neutral-400">
                          {completedSteps}/{totalSteps} steps done
                        </span>
                      )}
                    </div>

                    <h3 className="text-neutral-800 font-semibold text-sm leading-snug mb-1">{scheme.name}</h3>
                    <p className="text-neutral-500 text-xs">{scheme.ministry}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="text-neutral-700 font-semibold text-sm text-right">{scheme.benefitHeadline}</div>
                    <div className="text-neutral-400 text-xs text-right">{scheme.benefitEstimate}</div>
                    <div className="text-neutral-400 mt-1">
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="border-t border-neutral-200 px-5 pb-5">
                  <p className="text-neutral-500 text-sm leading-relaxed mt-4 mb-5">{scheme.description}</p>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <Clock size={12} />Processing: {scheme.processingTime}
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <Landmark size={12} />
                      Deadline: {scheme.deadline === 'rolling' ? 'Open year-round' : scheme.deadline === 'annual' ? 'Annual cycle' : scheme.deadline}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {scheme.tags.map(tag => (
                      <span key={tag} className="chip text-xs py-1 px-3">{tag}</span>
                    ))}
                  </div>

                  {/* Application Steps + tracker */}
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">
                        How to apply {isSaved && `· ${completedSteps}/${totalSteps} done`}
                      </div>
                      {isSaved && (
                        <div className="w-20 h-1 bg-neutral-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-700 rounded-full transition-all"
                            style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {loadingSteps === scheme.id ? (
                      <div className="flex items-center gap-2 text-neutral-400 text-sm py-2">
                        <Loader2 size={13} className="animate-spin" /> Loading progress...
                      </div>
                    ) : (
                      <ol className="flex flex-col gap-2">
                        {scheme.applicationSteps.map((step, i) => {
                          const stepDone = !!schemeSteps[i]
                          return (
                            <li key={i} className="flex items-start gap-3">
                              {/* Checkbox — only when saved */}
                              {isSaved ? (
                                <button
                                  onClick={e => { e.stopPropagation(); toggleStep(scheme.id, i) }}
                                  className={`shrink-0 mt-0.5 transition-colors ${stepDone ? 'text-neutral-700' : 'text-neutral-300 hover:text-neutral-500'}`}
                                >
                                  {stepDone
                                    ? <CheckCircle2 size={16} />
                                    : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                </button>
                              ) : (
                                <span className="w-5 h-5 rounded-full bg-black/7 text-neutral-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                              )}
                              <span className={`text-sm ${stepDone ? 'text-neutral-400 line-through' : 'text-neutral-500'}`}>{step}</span>
                            </li>
                          )
                        })}
                      </ol>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={scheme.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      Apply on official portal <ExternalLink size={13} />
                    </a>

                    <button
                      onClick={() => toggleSave(scheme)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-all ${
                        isSaved
                          ? 'border-neutral-300 bg-black/7 text-neutral-600'
                          : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
                      }`}
                    >
                      {isSaved ? <Bookmark size={14} /> : <BookmarkPlus size={14} />}
                      {isSaved ? 'Saved' : 'Save & track'}
                    </button>

                    {isSaved && !isApplied && (
                      <button
                        onClick={() => markApplied(scheme)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-all"
                      >
                        <CheckCircle2 size={14} />
                        Mark as applied
                      </button>
                    )}
                  </div>

                  {!isSaved && (
                    <p className="text-neutral-400 text-xs mt-3">Save this scheme to track your application steps</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* My Schemes tracker */}
      {savedSchemes.length > 0 && (
        <div>
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-3">My Schemes</div>
          <div className="glass overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Scheme</th>
                  <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Benefit</th>
                  <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Progress</th>
                  <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {savedSchemes.map(scheme => {
                  const schemeSteps = steps[scheme.id] ?? {}
                  const completedSteps = Object.values(schemeSteps).filter(Boolean).length
                  const totalSteps = scheme.applicationSteps.length
                  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

                  return (
                    <tr key={scheme.id} className="border-b border-neutral-100 last:border-0">
                      <td className="p-4">
                        <div className="text-neutral-700 font-medium text-sm">{scheme.shortName}</div>
                        <div className="text-neutral-400 text-xs mt-0.5">{scheme.ministry}</div>
                      </td>
                      <td className="p-4 text-neutral-500 text-sm">{scheme.benefitHeadline}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1 bg-neutral-200 rounded-full overflow-hidden">
                            <div className="h-full bg-neutral-600 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-neutral-400 text-xs">{completedSteps}/{totalSteps}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          saved[scheme.id] === 'applied'
                            ? 'bg-black/10 text-neutral-600'
                            : 'bg-black/6 text-neutral-500'
                        }`}>
                          {saved[scheme.id] === 'applied' ? '✓ Applied' : 'Saved'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
