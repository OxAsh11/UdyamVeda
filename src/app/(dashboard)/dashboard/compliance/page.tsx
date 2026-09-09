'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  COMPLIANCE_ITEMS, CATEGORY_LABELS, PRIORITY_LABELS,
  filterCompliance, calculateHealthScore, getUpcomingDeadlines,
  type ComplianceItem, type ComplianceCategory,
} from '@/lib/data/compliance-roadmap'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Calendar, ClipboardList, AlertTriangle, Info, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

type Tab = 'checklist' | 'calendar'

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 }

const CATEGORY_ICONS: Record<ComplianceCategory, string> = {
  foundation: '⬡',
  tax: '₹',
  license: '◈',
  ip: '®',
  trade: '⟳',
  hr: '◉',
  corporate: '▣',
}

const CATEGORY_COLORS: Record<ComplianceCategory, { accent: string; tint: string; text: string }> = {
  foundation: { accent: '#059669', tint: '#ECFDF5', text: '#065F46' },
  tax: { accent: '#D99A00', tint: '#FFFBEB', text: '#92400E' },
  license: { accent: '#FF8A34', tint: '#FFF7ED', text: '#9A3412' },
  ip: { accent: '#7C3AED', tint: '#F5F3FF', text: '#5B21B6' },
  trade: { accent: '#0891B2', tint: '#ECFEFF', text: '#155E75' },
  hr: { accent: '#E95454', tint: '#FEF2F2', text: '#991B1B' },
  corporate: { accent: '#3F46E8', tint: '#EEF2FF', text: '#3730A3' },
}

export default function CompliancePage() {
  const [tab, setTab] = useState<Tab>('checklist')
  const [business, setBusiness] = useState<Record<string, string> | null>(null)
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  const applicable = business
    ? filterCompliance(COMPLIANCE_ITEMS, { sector: business.sector ?? '', stage: business.stage ?? '' })
    : COMPLIANCE_ITEMS

  const completedIds = Object.keys(progress).filter(id => progress[id])
  const { score, completed, total, byCategory } = calculateHealthScore(applicable, completedIds)
  const deadlines = getUpcomingDeadlines(applicable)

  useEffect(() => {
    async function load() {
      const [businessResponse, res] = await Promise.all([
        fetch('/api/businesses/current', { cache: 'no-store' }),
        fetch('/api/compliance'),
      ])
      const businessPayload = await businessResponse.json() as { data?: { business?: { district?: string | null }; profile?: Record<string, unknown> } }
      if (businessPayload.data?.profile) setBusiness({ ...businessPayload.data.profile, district: businessPayload.data.business?.district ?? '' } as Record<string, string>)

      const json = await res.json()
      if (json.progress) {
        const map: Record<string, boolean> = {}
        for (const [id, val] of Object.entries(json.progress as Record<string, { completed: boolean }>)) {
          map[id] = val.completed
        }
        setProgress(map)
      }

      setLoading(false)
    }
    load()
  }, [])

  const toggleItem = useCallback(async (item: ComplianceItem) => {
    const newVal = !progress[item.id]
    setProgress(prev => ({ ...prev, [item.id]: newVal }))
    setToggling(item.id)

    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: item.id, completed: newVal }),
      })
      if (!res.ok) throw new Error('Failed to save')
      if (newVal) toast.success(`${item.shortName} marked complete`)
    } catch {
      setProgress(prev => ({ ...prev, [item.id]: !newVal }))
      toast.error('Failed to save — try again')
    } finally {
      setToggling(null)
    }
  }, [progress])

  const grouped = applicable.reduce<Record<ComplianceCategory, ComplianceItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<ComplianceCategory, ComplianceItem[]>)

  const categoryOrder: ComplianceCategory[] = ['foundation', 'tax', 'license', 'ip', 'trade', 'hr', 'corporate']

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#f8f7f3] p-8 flex items-center justify-center">
        <div className="rounded-2xl border border-indigo-100 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">Loading your preparation profile...</div>
      </div>
    )
  }

  return (
    <main className="min-h-full bg-[#f8f7f3] p-5 text-slate-900 md:p-8">
      <div className="mx-auto max-w-5xl">
      {/* Header */}
      <section className="relative mb-8 overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-100 md:p-8">
        <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="relative">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-indigo-100"><Sparkles size={13} /> Start &amp; Operate · preparation workspace</div>
        <h1 className="mb-2 text-3xl font-black tracking-tight md:text-4xl">Make your business ready.</h1>
        <p className="max-w-2xl text-sm leading-6 text-indigo-100">
          {business?.business_name ? `${business.business_name} · ` : ''}Organise the registrations, filings, and licences your business may need
        </p>
        </div>
      </section>

      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-bold">Review-gated preparation tracker</p>
        <p className="mt-1 leading-6">These checklist items are planning guidance, not a legal determination that your business is compliant. Applicability, thresholds, deadlines, fees, and local requirements must be confirmed against the current official source before you act.</p>
        <a href="/dashboard/registration" className="mt-2 inline-flex font-bold text-amber-800 underline underline-offset-2">Open the registration preparation map</a>
      </div>

      {/* Preparation progress */}
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-8">
          {/* Ring */}
          <div className="relative shrink-0">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#3F46E8 ${score}%, #E0E7FF ${score}%)`,
              }}
            >
              <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{score}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          {/* Preparation breakdown */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <div className="flex items-center gap-2 text-base font-bold text-slate-800">
                <ShieldCheck size={17} className="text-emerald-500" />
                {score < 30 ? 'Just getting started' : score < 60 ? 'Preparation underway' : score < 85 ? 'Preparation well underway' : 'Preparation checklist complete'}
              </div>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              {completed} of {total} preparation items done
              {score < 100 && ` · ${total - completed} remaining`}
            </p>

            {/* Category breakdown */}
            <div className="grid grid-cols-3 gap-2">
              {categoryOrder.filter(cat => grouped[cat]?.length > 0).slice(0, 6).map(cat => {
                const b = byCategory[cat] ?? { completed: 0, total: 0 }
                const pct = b.total > 0 ? Math.round((b.completed / b.total) * 100) : 0
                return (
                  <div key={cat} className="rounded-xl border border-slate-200 p-2.5" style={{ backgroundColor: CATEGORY_COLORS[cat].tint }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold" style={{ color: CATEGORY_COLORS[cat].text }}>{CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}</span>
                      <span className="text-xs text-slate-500">{b.completed}/{b.total}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/70">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat].accent }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'checklist' as Tab, label: 'Compliance Checklist', icon: <ClipboardList size={14} /> },
          { key: 'calendar' as Tab, label: 'Filing Calendar', icon: <Calendar size={14} /> },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? 'border border-indigo-200 bg-indigo-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-700'
            }`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* CHECKLIST TAB */}
      {tab === 'checklist' && (
        <div className="flex flex-col gap-8">
          {categoryOrder.filter(cat => grouped[cat]?.length > 0).map(cat => {
            const items = [...(grouped[cat] ?? [])].sort(
              (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
            )
            const catCompleted = items.filter(i => progress[i.id]).length

            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-sm">{CATEGORY_ICONS[cat]}</span>
                    <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wide">{CATEGORY_LABELS[cat]}</div>
                  </div>
                  <span className="text-neutral-400 text-xs">{catCompleted}/{items.length} done</span>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map(item => {
                    const isDone = !!progress[item.id]
                    const isExpanded = expanded === item.id
                    const isToggling = toggling === item.id

                    return (
                      <div key={item.id}
                        className={`glass transition-all ${isDone ? 'opacity-70' : ''} ${isExpanded ? 'border-neutral-300' : ''}`}>
                        {/* Item header */}
                        <div className="flex items-start gap-3 p-4">
                          {/* Checkbox */}
                          <button
                            onClick={() => toggleItem(item)}
                            disabled={isToggling}
                            className="shrink-0 mt-0.5 text-neutral-400 hover:text-neutral-700 transition-colors disabled:opacity-40"
                          >
                            {isDone
                              ? <CheckCircle2 size={18} className="text-neutral-700" />
                              : <Circle size={18} />}
                          </button>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className={`font-medium text-sm ${isDone ? 'line-through text-neutral-400' : 'text-neutral-800'}`}>
                                {item.name}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                                item.priority === 'critical' ? 'bg-black/10 text-neutral-700' :
                                item.priority === 'high' ? 'bg-black/7 text-neutral-500' :
                                'bg-black/4 text-neutral-400'
                              }`}>
                                {PRIORITY_LABELS[item.priority]}
                              </span>
                            </div>
                            <p className="text-neutral-400 text-xs leading-relaxed">{item.description.slice(0, 120)}...</p>
                          </div>

                          {/* Right: cost + expand */}
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="text-neutral-400 text-xs">{item.cost}</span>
                            <button
                              onClick={() => setExpanded(isExpanded ? null : item.id)}
                              className="text-neutral-400 hover:text-neutral-600 transition-colors"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className="border-t border-neutral-200 px-5 pb-5 pt-4">
                            {/* Why it matters */}
                            <div className="bg-black/4 border border-neutral-200 rounded-xl px-4 py-3 mb-4">
                              <div className="flex items-start gap-2">
                                <Info size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                                <p className="text-neutral-500 text-sm leading-relaxed">{item.why}</p>
                              </div>
                            </div>

                            {/* Penalty */}
                            {item.penalty && (
                              <div className="flex items-start gap-2 bg-black/4 border border-neutral-200 rounded-xl px-4 py-3 mb-4">
                                <AlertTriangle size={13} className="text-neutral-400 shrink-0 mt-0.5" />
                                <p className="text-neutral-500 text-xs leading-relaxed">
                                  <span className="text-neutral-400 font-medium">Penalty for non-compliance: </span>{item.penalty}
                                </p>
                              </div>
                            )}

                            {/* Stats row */}
                            <div className="flex gap-4 mb-4">
                              <div className="bg-black/4 border border-neutral-200 rounded-xl p-3 flex-1">
                                <div className="text-neutral-400 text-xs mb-1">Cost</div>
                                <div className="text-neutral-700 text-sm font-medium">{item.cost}</div>
                              </div>
                              <div className="bg-black/4 border border-neutral-200 rounded-xl p-3 flex-1">
                                <div className="text-neutral-400 text-xs mb-1">Timeline</div>
                                <div className="text-neutral-700 text-sm font-medium">{item.timeline}</div>
                              </div>
                            </div>

                            {/* Documents */}
                            {item.documents.length > 0 && (
                              <div className="mb-4">
                                <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-2">Documents needed</div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {item.documents.map(doc => (
                                    <div key={doc} className="flex items-center gap-2 text-xs text-neutral-500">
                                      <span className="text-neutral-300">·</span>{doc}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Steps */}
                            <div className="mb-4">
                              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-2">How to complete</div>
                              <ol className="flex flex-col gap-2">
                                {item.steps.map((step, i) => (
                                  <li key={i} className="flex items-start gap-3 text-sm text-neutral-500">
                                    <span className="w-5 h-5 rounded-full bg-black/7 text-neutral-400 text-xs flex items-center justify-center shrink-0 mt-0.5">
                                      {i + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                              {item.officialUrl ? <a
                                href={item.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
                              >
                                View official source <ExternalLink size={13} />
                              </a> : <span className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">State source pack pending review</span>}
                              <button
                                onClick={() => toggleItem(item)}
                                disabled={isToggling}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 transition-all disabled:opacity-40"
                              >
                                {isDone ? <><Circle size={13} /> Mark incomplete</> : <><CheckCircle2 size={13} /> Mark complete</>}
                              </button>
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
      )}

      {/* CALENDAR TAB */}
      {tab === 'calendar' && (
        <div className="flex flex-col gap-4">
          <div className="glass p-5 mb-2">
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-1">Upcoming Filing Deadlines</div>
            <p className="text-neutral-400 text-sm">Next 20 compliance deadlines based on your business profile. Mark items complete on the Checklist tab to track your progress.</p>
          </div>

          {deadlines.length === 0 ? (
            <div className="glass p-8 text-center text-neutral-400 text-sm">
              No upcoming deadlines found for your business profile.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {deadlines.map(({ item, date, label }, i) => {
                const daysUntil = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                const isUrgent = daysUntil <= 7
                const isSoon = daysUntil <= 21

                return (
                  <div key={`${item.id}-${i}`}
                    className={`glass p-4 flex items-center gap-4 ${isUrgent ? 'border-neutral-400' : ''}`}>
                    {/* Date badge */}
                    <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                      isUrgent ? 'bg-black/12' : 'bg-black/5'
                    } border border-neutral-200`}>
                      <div className="text-neutral-700 font-bold text-base leading-none">{date.getDate()}</div>
                      <div className="text-neutral-400 text-xs mt-0.5">
                        {date.toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-neutral-800 font-medium text-sm mb-0.5">{label}</div>
                      <div className="text-neutral-400 text-xs">{CATEGORY_LABELS[item.category]}</div>
                    </div>

                    {/* Days until */}
                    <div className="shrink-0 text-right">
                      <div className={`text-sm font-semibold ${isUrgent ? 'text-neutral-800' : isSoon ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </div>
                      <div className="text-neutral-400 text-xs mt-0.5">
                        {item.calendar?.frequency === 'monthly' ? 'Monthly' : item.calendar?.frequency === 'quarterly' ? 'Quarterly' : 'Annual'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* GST Quick Reference */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <p className="font-bold">No verified filing deadlines are shown yet.</p>
            <p className="mt-1">Deadlines will appear only after the relevant official opportunity or compliance record has a reviewed current window. This prevents a generic calendar from being mistaken for a legal deadline for your business.</p>
            <a href="/dashboard/registration" className="mt-3 inline-flex font-bold text-amber-800 underline underline-offset-2">Open the registration preparation map</a>
          </div>
        </div>
      )}
      </div>
    </main>
  )
}
