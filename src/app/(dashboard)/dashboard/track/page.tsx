'use client'

import { useCallback, useEffect, useState } from 'react'
import { TrendingUp, ExternalLink, Plus, Save } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MetricRow {
  id?: string
  week: string
  channel: string
  reach: number
  clicks: number
  conversions: number
  spend: number
}

interface Benchmark {
  avgCAC: string
  conversionRate: string
  ltv: string
  bestChannel: string
  contentFrequency: string
}

const CHANNELS = ['Instagram', 'WhatsApp', 'Email']

const INTEGRATIONS = [
  { name: 'Google Analytics 4', icon: '📊', purpose: 'Website traffic & conversions', url: 'https://analytics.google.com', badge: 'Analytics' },
  { name: 'Google Search Console', icon: '🔍', purpose: 'SEO & keyword performance', url: 'https://search.google.com/search-console', badge: 'SEO' },
]

const CHART_COLORS = { reach: '#9ca3af', clicks: '#6b7280', conversions: '#374151' }

export default function TrackPage() {
  const [metrics, setMetrics] = useState<MetricRow[]>([])
  const [benchmarks, setBenchmarks] = useState<Benchmark | null>(null)
  const [addingRow, setAddingRow] = useState(false)
  const [newRow, setNewRow] = useState<MetricRow>({ week: '', channel: 'Instagram', reach: 0, clicks: 0, conversions: 0, spend: 0 })
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<string[]>([])
  const [chartMetric, setChartMetric] = useState<'reach' | 'clicks' | 'conversions'>('reach')

  const generateInsights = useCallback((m: MetricRow[], bench: Benchmark) => {
    const ins: string[] = []
    if (m.length === 0) {
      ins.push('Add your first week\'s metrics to start seeing insights.')
      setInsights(ins)
      return
    }

    const totalSpend = m.reduce((s, r) => s + Number(r.spend), 0)
    const totalConv = m.reduce((s, r) => s + Number(r.conversions), 0)
    const totalClicks = m.reduce((s, r) => s + Number(r.clicks), 0)
    const totalReach = m.reduce((s, r) => s + Number(r.reach), 0)

    const cac = totalConv > 0 ? Math.round(totalSpend / totalConv) : 0
    const ctr = totalReach > 0 ? ((totalClicks / totalReach) * 100).toFixed(1) : 0
    const cvr = totalClicks > 0 ? ((totalConv / totalClicks) * 100).toFixed(1) : 0

    if (cac > 0) ins.push(`Your current CAC is ₹${cac}. Benchmark for your category: ${bench.avgCAC}.`)
    if (ctr) ins.push(`Your click-through rate is ${ctr}%. Industry median for digital campaigns is 1.5–3%.`)
    if (cvr) ins.push(`Conversion rate: ${cvr}%. Benchmark: ${bench.conversionRate}. ${Number(cvr) < 1 ? 'Consider testing a different CTA or landing page.' : 'You\'re performing well here.'}`)

    const byChannel = CHANNELS.map(ch => ({
      ch, conv: m.filter(r => r.channel === ch).reduce((s, r) => s + Number(r.conversions), 0)
    })).sort((a, b) => b.conv - a.conv)

    if (byChannel[0].conv > 0) ins.push(`${byChannel[0].ch} is your best performing channel with ${byChannel[0].conv} conversions. Double down here.`)

    setInsights(ins)
  }, [])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/gtm/metrics')
      const data = await res.json()
      setMetrics(data.metrics ?? [])

      const stratRes = await fetch('/api/gtm/strategy')
      const stratData = await stratRes.json()
      if (stratData.strategy?.benchmarks) {
        setBenchmarks(stratData.strategy.benchmarks)
        generateInsights(data.metrics ?? [], stratData.strategy.benchmarks)
      }

      setLoading(false)
    }
    load()
  }, [generateInsights])

  async function addMetric() {
    if (!newRow.week || !newRow.channel) { toast.error('Fill in week and channel'); return }
    const res = await fetch('/api/gtm/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRow),
    })
    const data = await res.json()
    const updated = [...metrics, data.metric]
    setMetrics(updated)
    if (benchmarks) generateInsights(updated, benchmarks)
    setAddingRow(false)
    setNewRow({ week: '', channel: 'Instagram', reach: 0, clicks: 0, conversions: 0, spend: 0 })
    toast.success('Metrics added')
  }

  // Aggregate per week for chart (sum across channels)
  const chartData = Array.from(
    metrics.reduce((map, row) => {
      const existing = map.get(row.week) ?? { week: row.week, reach: 0, clicks: 0, conversions: 0 }
      existing.reach += Number(row.reach)
      existing.clicks += Number(row.clicks)
      existing.conversions += Number(row.conversions)
      map.set(row.week, existing)
      return map
    }, new Map<string, { week: string; reach: number; clicks: number; conversions: number }>())
  ).map(([, v]) => v)

  const totalReach = metrics.reduce((s, r) => s + Number(r.reach), 0)
  const totalClicks = metrics.reduce((s, r) => s + Number(r.clicks), 0)
  const totalConversions = metrics.reduce((s, r) => s + Number(r.conversions), 0)
  const totalSpend = metrics.reduce((s, r) => s + Number(r.spend), 0)
  const cac = totalConversions > 0 ? Math.round(totalSpend / totalConversions) : 0

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-neutral-400 text-sm">Loading...</div>
    </div>
  )

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Track</h1>
        <p className="text-neutral-400 text-sm">Monitor your campaign performance and compare against benchmarks</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total Reach', value: totalReach.toLocaleString() },
          { label: 'Clicks', value: totalClicks.toLocaleString() },
          { label: 'Conversions', value: totalConversions },
          { label: 'Total Spend', value: `₹${totalSpend.toLocaleString()}` },
          { label: 'CAC', value: cac > 0 ? `₹${cac}` : '—' },
        ].map(kpi => (
          <div key={kpi.label} className="glass p-4">
            <div className="text-lg font-semibold text-neutral-900">{kpi.value}</div>
            <div className="text-neutral-400 text-xs mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="glass p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Performance over time</div>
            <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg">
              {(['reach', 'clicks', 'conversions'] as const).map(m => (
                <button key={m} onClick={() => setChartMetric(m)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    chartMetric === m ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                  }`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: 4 }}
              />
              <Line
                type="monotone"
                dataKey={chartMetric}
                stroke={CHART_COLORS[chartMetric]}
                strokeWidth={2}
                dot={{ fill: CHART_COLORS[chartMetric], r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Benchmarks */}
      {benchmarks && (
        <div className="glass p-5 mb-6">
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-4">Your Category Benchmarks</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Avg CAC', benchmark: benchmarks.avgCAC, yours: cac > 0 ? `₹${cac}` : null },
              { label: 'Conversion Rate', benchmark: benchmarks.conversionRate, yours: totalClicks > 0 ? `${((totalConversions / totalClicks) * 100).toFixed(1)}%` : null },
              { label: 'Best Channel', benchmark: benchmarks.bestChannel, yours: null },
              { label: 'LTV', benchmark: benchmarks.ltv, yours: null },
              { label: 'Content Frequency', benchmark: benchmarks.contentFrequency, yours: null },
            ].map(b => (
              <div key={b.label} className="bg-black/4 border border-neutral-200 rounded-xl p-3">
                <div className="text-neutral-400 text-xs mb-1">{b.label}</div>
                <div className="text-neutral-600 text-sm font-medium">{b.benchmark}</div>
                {b.yours && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-neutral-400 text-xs">You:</span>
                    <span className="text-neutral-500 text-xs font-medium">{b.yours}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="glass p-5 mb-6">
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-3">Insights</div>
          <div className="flex flex-col gap-2">
            {insights.map((ins, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/4 border border-neutral-200">
                <TrendingUp size={13} className="text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-neutral-500 text-sm">{ins}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect analytics */}
      <div className="glass p-5 mb-6">
        <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-4">Connect your analytics tools</div>
        <div className="grid grid-cols-2 gap-3">
          {INTEGRATIONS.map(tool => (
            <div key={tool.name} className="flex items-center justify-between p-3 rounded-xl bg-black/4 border border-neutral-200">
              <div className="flex items-center gap-3">
                <span className="text-xl">{tool.icon}</span>
                <div>
                  <div className="text-neutral-600 text-sm font-medium">{tool.name}</div>
                  <div className="text-neutral-400 text-xs">{tool.purpose}</div>
                </div>
              </div>
              <a href={tool.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-all shrink-0">
                Open <ExternalLink size={10} />
              </a>
            </div>
          ))}
        </div>
        <p className="text-neutral-400 text-xs mt-3">Enter metrics manually below. Direct API integration coming in a future update.</p>
      </div>

      {/* Metrics table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Weekly Metrics</div>
          <button onClick={() => setAddingRow(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 transition-all">
            <Plus size={11} /> Add week
          </button>
        </div>

        <div className="glass overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200">
                {['Week', 'Channel', 'Reach', 'Clicks', 'Conversions', 'Spend'].map(h => (
                  <th key={h} className="text-left text-neutral-400 text-xs font-semibold p-4 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((row, i) => (
                <tr key={row.id ?? i} className="border-b border-neutral-100 last:border-0">
                  <td className="p-4 text-neutral-600 text-sm">{row.week}</td>
                  <td className="p-4 text-neutral-600 text-sm">{row.channel}</td>
                  <td className="p-4 text-neutral-600 text-sm">{Number(row.reach).toLocaleString()}</td>
                  <td className="p-4 text-neutral-600 text-sm">{Number(row.clicks).toLocaleString()}</td>
                  <td className="p-4 text-neutral-600 text-sm">{row.conversions}</td>
                  <td className="p-4 text-neutral-600 text-sm">₹{Number(row.spend).toLocaleString()}</td>
                </tr>
              ))}

              {metrics.length === 0 && !addingRow && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400 text-sm">
                    No metrics yet — add your first week&apos;s data above
                  </td>
                </tr>
              )}

              {addingRow && (
                <tr className="border-t border-neutral-200 bg-black/3">
                  <td className="p-3">
                    <input value={newRow.week} onChange={e => setNewRow(r => ({ ...r, week: e.target.value }))}
                      placeholder="Week 1" className="glass-input w-full px-2 py-1.5 text-xs" />
                  </td>
                  <td className="p-3">
                    <select value={newRow.channel} onChange={e => setNewRow(r => ({ ...r, channel: e.target.value }))}
                      className="glass-input w-full px-2 py-1.5 text-xs appearance-none">
                      {CHANNELS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  {(['reach', 'clicks', 'conversions', 'spend'] as const).map(field => (
                    <td key={field} className="p-3">
                      <input type="number" value={newRow[field]} onChange={e => setNewRow(r => ({ ...r, [field]: Number(e.target.value) }))}
                        className="glass-input w-full px-2 py-1.5 text-xs" min={0} />
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={addMetric} className="btn-accent p-1.5 rounded-lg"><Save size={12} /></button>
                      <button onClick={() => setAddingRow(false)} className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-600 transition-all">✕</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
