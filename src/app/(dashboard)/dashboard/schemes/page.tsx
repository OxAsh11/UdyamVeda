'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { matchSchemes, SCHEMES, CATEGORY_LABELS, BENEFIT_TYPE_LABELS, type Scheme } from '@/lib/data/schemes'
import { BookmarkPlus, Bookmark, ExternalLink, ChevronDown, ChevronUp, CheckCircle2, Clock, Landmark } from 'lucide-react'
import { toast } from 'sonner'

type SavedMap = Record<string, string> // scheme_id → status

export default function SchemesPage() {
  const [matched, setMatched] = useState<Scheme[]>([])
  const [saved, setSaved] = useState<SavedMap>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUserId(user.id)

      const { data: business } = await supabase
        .from('business_profiles')
        .select('stage, founder_type, sector, state, initial_capital')
        .eq('user_id', user.id)
        .single()

      if (business) {
        const results = matchSchemes(business)
        setMatched(results)
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

      setLoading(false)
    }
    load()
  }, [])

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
      toast.success('Saved! Find it in My Schemes.')
    }
  }

  async function markApplied(scheme: Scheme) {
    if (!userId) return
    const supabase = createClient()
    await supabase.from('saved_schemes').upsert({
      user_id: userId, scheme_id: scheme.id, status: 'applied'
    })
    setSaved(prev => ({ ...prev, [scheme.id]: 'applied' }))
    toast.success('Marked as applied!')
  }

  const categories = ['all', ...Array.from(new Set(matched.map(s => s.category)))]
  const displayed = filterCategory === 'all'
    ? matched
    : matched.filter(s => s.category === filterCategory)

  const savedSchemes = SCHEMES.filter(s => saved[s.id])

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Scheme Matcher</h1>
        <p className="text-neutral-400 text-sm">
          Government schemes you are eligible for — ranked by benefit value
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Schemes found', value: matched.length },
          { label: 'Saved', value: Object.values(saved).filter(s => s === 'saved').length },
          { label: 'Applied', value: Object.values(saved).filter(s => s === 'applied').length },
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

          return (
            <div
              key={scheme.id}
              className={`glass transition-all ${isExpanded ? 'border-neutral-300' : ''}`}
            >
              {/* Card header */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : scheme.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/7 text-neutral-500">
                        {CATEGORY_LABELS[scheme.category]}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/05 text-neutral-400">
                        {BENEFIT_TYPE_LABELS[scheme.benefitType]}
                      </span>
                      {isApplied && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-black/7 text-neutral-500 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Applied
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
                  {/* Description */}
                  <p className="text-neutral-500 text-sm leading-relaxed mt-4 mb-5">{scheme.description}</p>

                  {/* Metadata row */}
                  <div className="flex flex-wrap gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                      <Clock size={12} />
                      Processing: {scheme.processingTime}
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

                  {/* Application steps */}
                  <div className="mb-5">
                    <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-3">How to apply</div>
                    <ol className="flex flex-col gap-2.5">
                      {scheme.applicationSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-500">
                          <span className="w-5 h-5 rounded-full bg-black/7 text-neutral-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
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
                      {isSaved ? 'Saved' : 'Save'}
                    </button>

                    {!isApplied && (
                      <button
                        onClick={() => markApplied(scheme)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-all"
                      >
                        <CheckCircle2 size={14} />
                        Mark as applied
                      </button>
                    )}
                  </div>
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
                  <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {savedSchemes.map(scheme => (
                  <tr key={scheme.id} className="border-b border-neutral-100 last:border-0">
                    <td className="p-4">
                      <div className="text-neutral-700 font-medium text-sm">{scheme.shortName}</div>
                      <div className="text-neutral-400 text-xs mt-0.5">{scheme.ministry}</div>
                    </td>
                    <td className="p-4 text-neutral-500 text-sm">{scheme.benefitHeadline}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
