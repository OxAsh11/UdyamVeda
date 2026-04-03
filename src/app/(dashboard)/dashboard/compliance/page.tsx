'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  COMPLIANCE_ITEMS, CATEGORY_LABELS, PRIORITY_LABELS,
  filterCompliance, calculateHealthScore, getUpcomingDeadlines,
  type ComplianceItem, type ComplianceCategory,
} from '@/lib/data/compliance-roadmap'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, ExternalLink, Calendar, ClipboardList, AlertTriangle, Info } from 'lucide-react'
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
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: biz }, res] = await Promise.all([
        supabase.from('business_profiles').select('*').eq('user_id', user.id).single(),
        fetch('/api/compliance'),
      ])

      if (biz) setBusiness(biz)

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
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Loading your compliance profile...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Compliance Centre</h1>
        <p className="text-neutral-400 text-sm">
          {business?.business_name ? `${business.business_name} · ` : ''}Track every registration, filing, and license your business needs
        </p>
      </div>

      {/* Health Score */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center gap-8">
          {/* Ring */}
          <div className="relative shrink-0">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#0C0C0C ${score}%, #e5e7eb ${score}%)`,
              }}
            >
              <div className="w-20 h-20 rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900">{score}</span>
                <span className="text-xs text-neutral-400">/ 100</span>
              </div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-neutral-800 font-semibold text-base">
                {score < 30 ? 'Just getting started' : score < 60 ? 'Making progress' : score < 85 ? 'Mostly compliant' : 'Fully compliant'}
              </div>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              {completed} of {total} compliance items done
              {score < 100 && ` · ${total - completed} remaining`}
            </p>

            {/* Category breakdown */}
            <div className="grid grid-cols-3 gap-2">
              {categoryOrder.filter(cat => grouped[cat]?.length > 0).slice(0, 6).map(cat => {
                const b = byCategory[cat] ?? { completed: 0, total: 0 }
                const pct = b.total > 0 ? Math.round((b.completed / b.total) * 100) : 0
                return (
                  <div key={cat} className="bg-black/4 border border-neutral-200 rounded-xl p-2.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-neutral-500 text-xs">{CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}</span>
                      <span className="text-neutral-400 text-xs">{b.completed}/{b.total}</span>
                    </div>
                    <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-700 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: 'checklist' as Tab, label: 'Compliance Checklist', icon: <ClipboardList size={14} /> },
          { key: 'calendar' as Tab, label: 'Filing Calendar', icon: <Calendar size={14} /> },
        ]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === t.key ? 'bg-black/10 text-neutral-900 border border-neutral-300' : 'text-neutral-400 hover:text-neutral-600 hover:bg-black/5'
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
                              <a
                                href={item.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-accent flex items-center gap-2 px-4 py-2 text-sm"
                              >
                                Open official portal <ExternalLink size={13} />
                              </a>
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
          <div className="glass p-5 mt-2">
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-4">Monthly GST Calendar</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { date: '11th', label: 'GSTR-1', desc: 'Outward supplies return' },
                { date: '20th', label: 'GSTR-3B', desc: 'Summary return + tax payment' },
              ].map(item => (
                <div key={item.label} className="bg-black/4 border border-neutral-200 rounded-xl p-4">
                  <div className="text-neutral-400 text-xs mb-1">Every month</div>
                  <div className="text-2xl font-bold text-neutral-800 mb-1">{item.date}</div>
                  <div className="text-neutral-700 text-sm font-medium">{item.label}</div>
                  <div className="text-neutral-400 text-xs mt-0.5">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Annual compliance */}
          <div className="glass p-5">
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-4">Key Annual Deadlines</div>
            <div className="flex flex-col gap-2">
              {[
                { date: '31st July', label: 'ITR Filing (Proprietors / Individuals)', note: '31st Oct for audited businesses' },
                { date: '30th Sept', label: 'Company AGM + Director KYC (DIR-3)', note: 'MGT-7A due by 29th Nov' },
                { date: '29th Nov', label: 'ROC Annual Return (MGT-7A)', note: 'For companies with March 31 year-end' },
                { date: '31st May', label: 'FSSAI Annual Return (Form D1)', note: 'For State & Central license holders' },
                { date: '15th June/Sept/Dec/Mar', label: 'Advance Tax Installments', note: '15%, 45%, 75%, 100% of estimated tax' },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-4 p-3 rounded-xl bg-black/4 border border-neutral-200">
                  <div className="w-28 shrink-0 text-neutral-700 text-sm font-semibold">{row.date}</div>
                  <div>
                    <div className="text-neutral-600 text-sm">{row.label}</div>
                    <div className="text-neutral-400 text-xs mt-0.5">{row.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
