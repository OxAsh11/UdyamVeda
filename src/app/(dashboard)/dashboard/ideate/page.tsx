'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw, ArrowRight, Users, Target, Megaphone, BookOpen, BarChart2, Calendar, Zap } from 'lucide-react'
import { toast } from 'sonner'

const BUDGETS = ['Under ₹5,000/mo', '₹5K–₹15K/mo', '₹15K–₹50K/mo', '₹50K–₹1L/mo', 'Above ₹1L/mo']
const GEOGRAPHIES = ['Local (my city/district)', 'State-wide', 'Pan-India', 'Global']
const CHALLENGES = [
  { value: 'awareness', label: 'No one knows we exist' },
  { value: 'conversion', label: 'Traffic but no conversions' },
  { value: 'retention', label: 'Need more repeat customers' },
  { value: 'new-market', label: 'Entering a new market' },
]

interface Strategy {
  icp: { profile: string; demographics: string; psychographics: string; painPoints: string[]; whereToFindThem: string[] }
  positioning: { valueProposition: string; messagingPillars: string[]; toneOfVoice: string }
  channels: { name: string; priority: string; reasoning: string; tactics: string[]; estimatedCAC: string; timeToResults: string; effort: string }[]
  caseStudies: { brand: string; sector: string; strategy: string; result: string; lessonForYou: string }[]
  benchmarks: { avgCAC: string; conversionRate: string; ltv: string; bestChannel: string; contentFrequency: string }
  ninetyDayPlan: { days1to30: string; days31to60: string; days61to90: string }
  quickWins: string[]
}

const EFFORT_COLOR: Record<string, string> = {
  low: 'text-neutral-500',
  medium: 'text-neutral-500',
  high: 'text-neutral-500',
}

export default function IdeatePage() {
  const router = useRouter()
  const [business, setBusiness] = useState<Record<string, string> | null>(null)
  const [form, setForm] = useState({ product: '', targetCustomer: '', geography: '', budget: '', challenge: '' })
  const [strategy, setStrategy] = useState<Strategy | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: biz } = await supabase.from('business_profiles').select('*').eq('user_id', user.id).single()
      if (biz) setBusiness(biz)

      // Load existing strategy if any
      const res = await fetch('/api/gtm/strategy')
      const json = await res.json()
      if (json.strategy) {
        setStrategy(json.strategy)
        if (json.context) setForm(json.context)
      }
      setLoadingExisting(false)
    }
    load()
  }, [])

  async function generateStrategy(e: React.FormEvent) {
    e.preventDefault()
    if (!form.product || !form.targetCustomer || !form.geography || !form.budget || !form.challenge) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    setStrategy(null)

    try {
      const res = await fetch('/api/gtm/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          sector: business?.sector ?? '',
          stage: business?.stage ?? '',
          state: business?.state ?? '',
        }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setStrategy(json.strategy)
      toast.success('Strategy generated!')
    } catch {
      toast.error('Failed to generate strategy. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingExisting) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Ideate</h1>
        <p className="text-neutral-400 text-sm">Tell us about your business and we'll generate your GTM strategy</p>
      </div>

      {/* Context Form */}
      <form onSubmit={generateStrategy}>
        <div className="glass p-6 mb-6">
          <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide mb-5">Your business context</div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">What do you sell?</label>
              <input
                value={form.product}
                onChange={e => set('product', e.target.value)}
                placeholder="e.g. Handmade leather bags for working professionals"
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Who is your target customer?</label>
              <input
                value={form.targetCustomer}
                onChange={e => set('targetCustomer', e.target.value)}
                placeholder="e.g. Urban professionals aged 25–40 who value premium quality"
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Geography</label>
                <div className="flex flex-col gap-1.5">
                  {GEOGRAPHIES.map(g => (
                    <button key={g} type="button" onClick={() => set('geography', g)}
                      className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                        form.geography === g ? 'border-neutral-300 bg-black/7 text-neutral-800' : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Monthly Budget</label>
                <div className="flex flex-col gap-1.5">
                  {BUDGETS.map(b => (
                    <button key={b} type="button" onClick={() => set('budget', b)}
                      className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                        form.budget === b ? 'border-neutral-300 bg-black/7 text-neutral-800' : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Biggest challenge right now</label>
              <div className="grid grid-cols-2 gap-2">
                {CHALLENGES.map(c => (
                  <button key={c.value} type="button" onClick={() => set('challenge', c.value)}
                    className={`px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                      form.challenge === c.value ? 'border-neutral-300 bg-black/7 text-neutral-800' : 'border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button type="submit" disabled={loading}
              className="btn-accent flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-40">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Generating strategy...</> : <>Generate my GTM strategy <ArrowRight size={14} /></>}
            </button>
            {strategy && (
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl border border-neutral-200 text-neutral-500 hover:text-neutral-600 hover:border-neutral-300 transition-all">
                <RefreshCw size={13} /> Regenerate
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div className="glass p-10 flex flex-col items-center gap-4 mb-6">
          <Loader2 size={28} className="animate-spin text-neutral-400" />
          <div className="text-neutral-500 text-sm text-center">
            Analysing your business and generating strategy...<br />
            <span className="text-neutral-400 text-xs">This takes 10–20 seconds</span>
          </div>
        </div>
      )}

      {/* Strategy output */}
      {strategy && !loading && (
        <div className="flex flex-col gap-5">

          {/* Quick Wins */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Do this week</div>
            </div>
            <div className="flex flex-col gap-2">
              {strategy.quickWins?.map((win, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/4 border border-neutral-200">
                  <span className="w-5 h-5 rounded-full bg-black/7 text-neutral-500 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-neutral-600 text-sm">{win}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ICP */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Ideal Customer Profile</div>
            </div>
            <p className="text-neutral-600 text-sm mb-4 leading-relaxed">{strategy.icp.profile}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-neutral-400 text-xs mb-1.5 uppercase tracking-wide">Demographics</div>
                <p className="text-neutral-500 text-sm">{strategy.icp.demographics}</p>
              </div>
              <div>
                <div className="text-neutral-400 text-xs mb-1.5 uppercase tracking-wide">Mindset</div>
                <p className="text-neutral-500 text-sm">{strategy.icp.psychographics}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-neutral-400 text-xs mb-2 uppercase tracking-wide">Pain points</div>
                <ul className="flex flex-col gap-1.5">
                  {strategy.icp.painPoints?.map((p, i) => (
                    <li key={i} className="text-neutral-500 text-sm flex items-start gap-2">
                      <span className="text-neutral-400 mt-1">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-neutral-400 text-xs mb-2 uppercase tracking-wide">Where to find them</div>
                <ul className="flex flex-col gap-1.5">
                  {strategy.icp.whereToFindThem?.map((p, i) => (
                    <li key={i} className="text-neutral-500 text-sm flex items-start gap-2">
                      <span className="text-neutral-400 mt-1">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Positioning */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Positioning</div>
            </div>
            <div className="bg-black/4 border border-neutral-200 rounded-xl p-4 mb-4">
              <div className="text-neutral-400 text-xs mb-2 uppercase tracking-wide">Value Proposition</div>
              <p className="text-neutral-700 text-sm leading-relaxed italic">"{strategy.positioning.valueProposition}"</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-neutral-400 text-xs mb-2 uppercase tracking-wide">Messaging pillars</div>
                <ul className="flex flex-col gap-1.5">
                  {strategy.positioning.messagingPillars?.map((p, i) => (
                    <li key={i} className="text-neutral-500 text-sm flex items-start gap-2">
                      <span className="text-neutral-400 mt-1">·</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-neutral-400 text-xs mb-2 uppercase tracking-wide">Tone of voice</div>
                <p className="text-neutral-500 text-sm">{strategy.positioning.toneOfVoice}</p>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Recommended Channels</div>
            </div>
            <div className="flex flex-col gap-3">
              {strategy.channels?.map((ch, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/4 border border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-black/10 text-neutral-500 text-xs flex items-center justify-center">{i + 1}</span>
                      <span className="text-neutral-800 font-medium text-sm">{ch.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/6 text-neutral-400 capitalize">{ch.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <span>CAC: {ch.estimatedCAC}</span>
                      <span>·</span>
                      <span>{ch.timeToResults}</span>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-sm mb-2">{ch.reasoning}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ch.tactics?.map((t, j) => (
                      <span key={j} className="chip text-xs py-0.5 px-2.5">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benchmarks */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Industry Benchmarks — Your Category</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Avg CAC', value: strategy.benchmarks?.avgCAC },
                { label: 'Conversion Rate', value: strategy.benchmarks?.conversionRate },
                { label: 'Customer LTV', value: strategy.benchmarks?.ltv },
                { label: 'Best Channel', value: strategy.benchmarks?.bestChannel },
                { label: 'Content Frequency', value: strategy.benchmarks?.contentFrequency },
              ].map(b => (
                <div key={b.label} className="bg-black/4 border border-neutral-200 rounded-xl p-3">
                  <div className="text-neutral-400 text-xs mb-1.5">{b.label}</div>
                  <div className="text-neutral-700 text-sm font-medium">{b.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Studies */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">Case Studies — Apply to your business</div>
            </div>
            <div className="flex flex-col gap-4">
              {strategy.caseStudies?.map((cs, i) => (
                <div key={i} className="p-4 rounded-xl bg-black/4 border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-neutral-700 font-semibold text-sm">{cs.brand}</span>
                    <span className="text-neutral-400 text-xs">·</span>
                    <span className="text-neutral-400 text-xs">{cs.sector}</span>
                  </div>
                  <p className="text-neutral-500 text-sm mb-1.5"><span className="text-neutral-400">What they did:</span> {cs.strategy}</p>
                  <p className="text-neutral-500 text-sm mb-2"><span className="text-neutral-400">Result:</span> {cs.result}</p>
                  <div className="bg-black/4 border border-neutral-200 rounded-lg px-3 py-2">
                    <span className="text-neutral-400 text-xs">Apply this: </span>
                    <span className="text-neutral-600 text-sm">{cs.lessonForYou}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 90-Day Plan */}
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} className="text-neutral-500" />
              <div className="text-neutral-400 text-xs font-semibold uppercase tracking-wide">90-Day Focus Plan</div>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Month 1 — Days 1–30', value: strategy.ninetyDayPlan?.days1to30 },
                { label: 'Month 2 — Days 31–60', value: strategy.ninetyDayPlan?.days31to60 },
                { label: 'Month 3 — Days 61–90', value: strategy.ninetyDayPlan?.days61to90 },
              ].map((phase, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-black/4 border border-neutral-200">
                  <span className="w-6 h-6 rounded-full bg-black/7 text-neutral-400 text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <div className="text-neutral-400 text-xs mb-1">{phase.label}</div>
                    <p className="text-neutral-600 text-sm">{phase.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA to Drawing Board */}
          <div className="glass p-5 flex items-center justify-between">
            <div>
              <div className="text-neutral-700 font-medium text-sm">Strategy looks good?</div>
              <div className="text-neutral-400 text-xs mt-0.5">Build your visual campaign map on the Drawing Board</div>
            </div>
            <button onClick={() => router.push('/dashboard/drawing-board')}
              className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm">
              Go to Drawing Board <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
