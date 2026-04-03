'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { REGISTRATION_TYPES, recommendRegistrationType, type RegType } from '@/lib/data/registration-types'
import { getSegmentedPlatforms, type Platform } from '@/lib/data/registration-platforms'
import { CheckCircle2, XCircle, Clock, FileText, ExternalLink, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { COMPLIANCE_ITEMS, CATEGORY_LABELS as COMPLIANCE_CATEGORY_LABELS, filterCompliance } from '@/lib/data/compliance-roadmap'

type TabKey = 'most-used' | 'lowest-price' | 'top-rated'

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: 'most-used', label: '5 Most Used' },
  { key: 'lowest-price', label: '10 Lowest Price' },
  { key: 'top-rated', label: '5 Top Rated' },
]

export default function RegistrationPage() {
  const [business, setBusiness] = useState<Record<string, string> | null>(null)
  const [primaryType, setPrimaryType] = useState<RegType | null>(null)
  const [alternatives, setAlternatives] = useState<RegType[]>([])
  const [reasoning, setReasoning] = useState('')
  const [selectedType, setSelectedType] = useState<RegType | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('most-used')
  const [expandedDocs, setExpandedDocs] = useState(false)
  const [platforms, setPlatforms] = useState(getSegmentedPlatforms())

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setBusiness(data)
        const rec = recommendRegistrationType(
          data.stage,
          data.initial_capital,
          data.founder_type,
          data.sector
        )
        const primary = REGISTRATION_TYPES.find(r => r.id === rec.primary)!
        const alts = rec.alternatives
          .map(id => REGISTRATION_TYPES.find(r => r.id === id)!)
          .filter(Boolean)

        setPrimaryType(primary)
        setAlternatives(alts)
        setReasoning(rec.reasoning)
        setSelectedType(primary)
      }
    }
    load()
  }, [])

  function handlePlatformClick(platform: Platform) {
    const utmUrl = `${platform.url}?utm_source=center&utm_medium=referral&utm_campaign=registration`
    window.open(utmUrl, '_blank', 'noopener,noreferrer')
  }

  function getTabPlatforms() {
    if (activeTab === 'most-used') return platforms.mostUsed
    if (activeTab === 'lowest-price') return platforms.lowestPrice
    return platforms.topRated
  }

  if (!primaryType) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Loading your recommendation...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Registration Guide</h1>
        <p className="text-neutral-400 text-sm">
          Based on your business profile — {business?.sector}, {business?.stage?.replace('-', ' ')}
        </p>
      </div>

      {/* Recommendation Banner */}
      <div className="glass p-6 mb-5 border-neutral-200">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-1">Recommended for you</div>
            <h2 className="text-xl font-semibold text-neutral-900">{primaryType.name}</h2>
            <p className="text-neutral-500 text-sm mt-0.5">{primaryType.tagline}</p>
          </div>
          <div className="glass px-4 py-2 text-neutral-700 text-sm font-medium shrink-0">
            {primaryType.shortName}
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-black/4 border border-neutral-200 rounded-xl p-4 mb-5">
          <p className="text-neutral-500 text-sm leading-relaxed">{reasoning}</p>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: <FileText size={14} />, label: 'Cost', value: primaryType.costRange },
            { icon: <Clock size={14} />, label: 'Timeline', value: primaryType.timeline },
            { icon: <FileText size={14} />, label: 'Govt Fees', value: primaryType.govtFees },
          ].map(stat => (
            <div key={stat.label} className="bg-black/4 border border-neutral-200 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-neutral-400 text-xs mb-1.5">
                {stat.icon}
                {stat.label}
              </div>
              <div className="text-neutral-800 text-sm font-medium">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tax highlight */}
        <div className="bg-black/4 border border-neutral-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
          <span className="text-neutral-400 text-xs">Tax:</span>
          <span className="text-neutral-600 text-sm">{primaryType.taxHighlight}</span>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-2">Advantages</div>
            <ul className="flex flex-col gap-2">
              {primaryType.pros.map(p => (
                <li key={p} className="flex items-start gap-2 text-sm text-neutral-600">
                  <CheckCircle2 size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-2">Limitations</div>
            <ul className="flex flex-col gap-2">
              {primaryType.cons.map(c => (
                <li key={c} className="flex items-start gap-2 text-sm text-neutral-600">
                  <XCircle size={14} className="text-neutral-400 mt-0.5 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Documents required — collapsible */}
        <button
          onClick={() => setExpandedDocs(d => !d)}
          className="flex items-center gap-2 text-neutral-400 text-sm hover:text-neutral-600 transition-colors"
        >
          {expandedDocs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          Documents required ({primaryType.documents.length})
        </button>
        {expandedDocs && (
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {primaryType.documents.map(doc => (
              <li key={doc} className="flex items-center gap-2 text-sm text-neutral-500">
                <div className="w-1.5 h-1.5 rounded-full bg-white/25 shrink-0" />
                {doc}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div className="mb-8">
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-3">Also consider</div>
          <div className="grid grid-cols-2 gap-3">
            {alternatives.map(alt => (
              <button
                key={alt.id}
                onClick={() => setSelectedType(alt)}
                className={`glass text-left p-4 transition-all ${
                  selectedType?.id === alt.id ? 'border-neutral-300 bg-black/6' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-neutral-700 text-sm font-medium">{alt.name}</div>
                  <div className="text-neutral-400 text-xs">{alt.shortName}</div>
                </div>
                <p className="text-neutral-500 text-xs leading-relaxed">{alt.tagline}</p>
                <div className="flex gap-3 mt-3">
                  <span className="text-neutral-400 text-xs">{alt.costRange}</span>
                  <span className="text-neutral-300 text-xs">·</span>
                  <span className="text-neutral-400 text-xs">{alt.timeline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All 5 types quick reference */}
      <div className="mb-8">
        <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-3">All registration types</div>
        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Type</th>
                <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Cost</th>
                <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Timeline</th>
                <th className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">Founders</th>
              </tr>
            </thead>
            <tbody>
              {REGISTRATION_TYPES.map((type, i) => (
                <tr
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={`border-b border-neutral-100 last:border-0 cursor-pointer transition-all hover:bg-black/4 ${
                    selectedType?.id === type.id ? 'bg-black/5' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className={`font-medium ${selectedType?.id === type.id ? 'text-neutral-900' : 'text-neutral-600'}`}>
                      {type.shortName}
                    </div>
                    {type.id === primaryType?.id && (
                      <span className="text-[10px] text-neutral-400 bg-black/7 px-1.5 py-0.5 rounded-full ml-0 mt-1 inline-block">
                        Recommended
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-neutral-500">{type.costRange}</td>
                  <td className="p-4 text-neutral-500">{type.timeline}</td>
                  <td className="p-4 text-neutral-500">
                    {type.minFounders}–{type.maxFounders ?? '∞'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Comparison */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-neutral-800 font-semibold">Where to register</h3>
            <p className="text-neutral-400 text-xs mt-0.5">Compare 20 platforms — pick what works for you</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TAB_LABELS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-black/10 text-neutral-800 border border-neutral-300'
                  : 'text-neutral-400 hover:text-neutral-600 hover:bg-white/05'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Platform Cards */}
        <div className="flex flex-col gap-3">
          {getTabPlatforms().map(platform => (
            <div key={platform.id} className="glass p-4 flex items-center gap-4">
              {/* Logo placeholder */}
              <div className="w-10 h-10 rounded-xl bg-black/7 flex items-center justify-center text-lg shrink-0">
                {platform.logo}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-neutral-800 font-medium text-sm">{platform.name}</span>
                  <span className="text-neutral-400 text-xs">★ {platform.rating}</span>
                  <span className="text-neutral-300 text-xs">({platform.reviewCount} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {platform.highlights.map(h => (
                    <span key={h} className="text-neutral-400 text-xs">{h}</span>
                  ))}
                </div>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-neutral-800 font-semibold text-sm">{platform.costDisplay}</div>
                <div className="text-neutral-400 text-xs">{platform.processingDays}</div>
                <button
                  onClick={() => handlePlatformClick(platform)}
                  className="flex items-center gap-1.5 btn-accent px-3 py-1.5 text-xs"
                >
                  Register here <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Skip CTA */}
        <div className="mt-6 flex items-center justify-between glass p-4">
          <div>
            <div className="text-neutral-600 text-sm font-medium">Already registered or want to skip?</div>
            <div className="text-neutral-400 text-xs mt-0.5">You can proceed directly to finding government schemes.</div>
          </div>
          <a href="/dashboard/schemes" className="btn-accent px-4 py-2 text-sm">
            Go to Schemes →
          </a>
        </div>
      </div>

      {/* Sector compliance checklist */}
      {business && (() => {
        const sectorItems = filterCompliance(COMPLIANCE_ITEMS, {
          sector: business.sector ?? '',
          stage: business.stage ?? '',
        })
        const criticalItems = sectorItems.filter(i => i.priority === 'critical' || i.priority === 'high')

        return (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-neutral-800 font-semibold">Your compliance checklist</h3>
                <p className="text-neutral-400 text-xs mt-0.5">
                  {criticalItems.length} critical compliance items for a {business.sector} business in {business.stage?.replace(/-/g, ' ')} stage
                </p>
              </div>
              <a href="/dashboard/compliance" className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                Track progress <ArrowRight size={13} />
              </a>
            </div>

            <div className="flex flex-col gap-2">
              {criticalItems.slice(0, 8).map(item => (
                <div key={item.id} className="glass p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-neutral-700 font-medium text-sm">{item.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                        item.priority === 'critical' ? 'bg-black/10 text-neutral-600' : 'bg-black/6 text-neutral-400'
                      }`}>
                        {item.priority === 'critical' ? 'Critical' : 'Important'}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-xs leading-relaxed">{item.description.slice(0, 100)}...</p>
                    <div className="flex gap-3 mt-1.5 text-xs text-neutral-400">
                      <span>Cost: {item.cost}</span>
                      <span>·</span>
                      <span>{item.timeline}</span>
                    </div>
                  </div>
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-700 border border-neutral-200 hover:border-neutral-300 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Portal <ExternalLink size={10} />
                  </a>
                </div>
              ))}
            </div>

            {criticalItems.length > 8 && (
              <a href="/dashboard/compliance"
                className="mt-3 flex items-center justify-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors py-3">
                View all {criticalItems.length} compliance items <ArrowRight size={13} />
              </a>
            )}
          </div>
        )
      })()}
    </div>
  )
}
