'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowRight, Loader2, Check, Globe, ChevronLeft, Sparkles } from 'lucide-react'

// ─── Question definitions ────────────────────────────────────────────────────

type StepType = 'textarea' | 'chips' | 'multiselect' | 'chips+text'

interface Step {
  id: string
  question: string
  subtext: string
  type: StepType
  options?: string[]
  placeholder?: string
  optional?: boolean
}

const STEPS: Step[] = [
  {
    id: 'what_you_sell',
    question: 'What does your business actually sell?',
    subtext: 'Be specific — product name, format, price range. The more real this is, the better every AI feature works.',
    type: 'textarea',
    placeholder: 'e.g. Handmade silver jewellery priced ₹500–₹3,500, minimalist designs for working women. Made in Jaipur, sold via Instagram DMs and our website.',
    optional: false,
  },
  {
    id: 'target_customer',
    question: 'Describe your ideal customer like a real person — not a demographic.',
    subtext: 'Give them a life. Where do they live, what do they care about, what problem do they have that you solve?',
    type: 'textarea',
    placeholder: 'e.g. Priya, 28, works in a Bengaluru tech company, hates loud jewellery, buys gifts for herself after a good month. Follows slow fashion accounts on Instagram.',
    optional: false,
  },
  {
    id: 'customer_location',
    question: 'Where are most of your customers based?',
    subtext: '',
    type: 'chips',
    options: ['My city / town', 'Across my state', 'Multiple Indian states', 'Pan-India', 'India + international'],
    optional: false,
  },
  {
    id: 'differentiator',
    question: 'Why would someone choose you over every other option?',
    subtext: 'Pick what fits or write it yourself. This becomes your positioning.',
    type: 'chips+text',
    options: ['Handmade / artisanal', 'Better price', 'Faster delivery', 'Stronger brand story', 'Better quality', 'Highly personalised', 'Serves a niche no one else does', 'Founder-led & authentic'],
    placeholder: 'Or describe in your own words...',
    optional: false,
  },
  {
    id: 'brand_voice',
    question: 'What does your brand sound like? Select all that apply.',
    subtext: 'This shapes the tone of every caption, email, and message we generate for you.',
    type: 'multiselect',
    options: ['Warm & personal', 'Professional & credible', 'Bold & confident', 'Fun & playful', 'Minimal & premium', 'Earthy & authentic', 'Educational & informative', 'Aspirational'],
    optional: false,
  },
  {
    id: 'channels',
    question: 'Which channels do you use or want to grow?',
    subtext: 'Select all that apply. This determines which plays and content we prioritise for you.',
    type: 'multiselect',
    options: ['Instagram', 'WhatsApp', 'Facebook', 'YouTube / Shorts', 'Email newsletter', 'Website / blog', 'LinkedIn', 'Offline / events'],
    optional: false,
  },
  {
    id: 'what_works',
    question: 'Has anything worked really well for you so far?',
    subtext: 'A post, a campaign, a channel, even a single conversation. Anecdotal evidence counts.',
    type: 'textarea',
    placeholder: 'e.g. A reel showing our packaging process got 40k views and drove 20 orders in 2 days. Or: nothing has worked yet, still figuring it out.',
    optional: true,
  },
  {
    id: 'context',
    question: 'Anything else we should know?',
    subtext: 'Paste a mission statement, a past pitch, your competitor names, seasonal goals — anything that adds context.',
    type: 'textarea',
    placeholder: 'e.g. We\'re trying to break into corporate gifting this Diwali. Our main competitor is X. We can\'t do paid ads yet. Our biggest bottleneck is...',
    optional: true,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function truncate(val: string | string[], max = 55): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return ''
    if (val.length === 1) return val[0]
    return `${val[0]} +${val.length - 1} more`
  }
  return val.length > max ? val.slice(0, max) + '…' : val
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function BrandPage() {
  const router = useRouter()

  // -1 = website intro step, 0–7 = question steps
  const [step, setStep] = useState<number>(-1)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [textVal, setTextVal] = useState('')
  const [multiVal, setMultiVal] = useState<string[]>([])
  const [chipTextVal, setChipTextVal] = useState('')

  // Website extraction
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [extracted, setExtracted] = useState<Record<string, string> | null>(null)

  const [saving, setSaving] = useState(false)
  const [businessName, setBusinessName] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Load business name for personalised questions
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const businessResponse = await fetch('/api/businesses/current', { cache: 'no-store' })
      const businessPayload = await businessResponse.json() as { data?: { profile?: { business_name?: string | null } } }
      if (businessPayload.data?.profile?.business_name) setBusinessName(businessPayload.data.profile.business_name)

      // If brand intelligence already filled, skip to dashboard
      const { data: existing } = await supabase
        .from('brand_intelligence')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (existing) router.replace('/dashboard')
    }
    load()
  }, [router])

  // Focus textarea when step changes
  useEffect(() => {
    if (textareaRef.current) setTimeout(() => textareaRef.current?.focus(), 100)
  }, [step])

  // Reset per-step input when step advances
  useEffect(() => {
    const currentStep = STEPS[step]
    if (!currentStep) return
    const saved = answers[currentStep.id]
    if (currentStep.type === 'textarea') {
      setTextVal(typeof saved === 'string' ? saved : '')
    } else if (currentStep.type === 'multiselect') {
      setMultiVal(Array.isArray(saved) ? saved : [])
    } else if (currentStep.type === 'chips+text') {
      setChipTextVal(typeof saved === 'string' ? saved : '')
    }
  }, [step])  // eslint-disable-line react-hooks/exhaustive-deps

  async function extractWebsite() {
    if (!websiteUrl.trim()) return
    setExtracting(true)
    try {
      const res = await fetch('/api/brand/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExtracted(data.extracted)

      // Pre-fill answers from extracted data
      const prefilled: Record<string, string> = {}
      if (data.extracted.what_you_sell) prefilled.what_you_sell = data.extracted.what_you_sell
      if (data.extracted.target_customer) prefilled.target_customer = data.extracted.target_customer
      if (data.extracted.differentiator) prefilled.differentiator = data.extracted.differentiator
      if (Object.keys(prefilled).length > 0) {
        setAnswers(prev => ({ ...prev, ...prefilled }))
        toast.success('Brand info extracted — review and refine the pre-filled answers')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not extract from this URL')
    } finally {
      setExtracting(false)
    }
  }

  function currentStep() { return STEPS[step] }

  function recordAnswer(val: string | string[]) {
    const s = currentStep()
    if (!s) return
    setAnswers(prev => ({ ...prev, [s.id]: val }))
  }

  function advance() {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      saveAndFinish()
    }
  }

  function goBack() {
    if (step === -1) return
    if (step === 0) { setStep(-1); return }
    setStep(s => s - 1)
  }

  function handleChipsAnswer(val: string) {
    recordAnswer(val)
    setTimeout(advance, 200) // brief visual feedback then advance
  }

  function handleMultiselectToggle(val: string) {
    setMultiVal(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  function handleTextContinue() {
    const s = currentStep()
    if (!s) return
    const val = s.type === 'chips+text' ? chipTextVal : textVal
    if (!val.trim() && !s.optional) { toast.error('Please answer this question'); return }
    recordAnswer(val.trim())
    advance()
  }

  function handleMultiselectContinue() {
    const s = currentStep()
    if (!s) return
    if (multiVal.length === 0 && !s.optional) { toast.error('Select at least one option'); return }
    recordAnswer(multiVal)
    advance()
  }

  function skipStep() {
    advance()
  }

  async function saveAndFinish() {
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const payload = {
        user_id: user.id,
        website_url: websiteUrl || null,
        website_summary: extracted?.summary || null,
        what_you_sell: answers.what_you_sell || null,
        target_customer: answers.target_customer || null,
        customer_location: answers.customer_location || null,
        differentiator: answers.differentiator || null,
        brand_voice: Array.isArray(answers.brand_voice) ? answers.brand_voice : null,
        channels: Array.isArray(answers.channels) ? answers.channels : null,
        what_works: answers.what_works || null,
        additional_context: answers.context || null,
        raw_answers: answers,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('brand_intelligence').upsert(payload, { onConflict: 'user_id' })
      if (error) throw new Error(error.message)

      toast.success('Brand profile saved!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save')
      setSaving(false)
    }
  }

  // ── Progress ──
  const totalSteps = STEPS.length
  const completedSteps = step === -1 ? 0 : step
  const progressPct = Math.round((completedSteps / totalSteps) * 100)

  const cs = currentStep()

  // ─── INTRO / WEBSITE STEP ────────────────────────────────────────────────

  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="glass p-10 w-full max-w-xl">
          <div className="flex items-center justify-between mb-8">
            <div className="text-xl font-bold text-neutral-900 tracking-tight">UdyamVeda</div>
            <div className="text-neutral-400 text-xs font-medium">Step 3 of 3</div>
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Let&apos;s build your brand profile
          </h1>
          <p className="text-neutral-500 text-sm mb-8 leading-relaxed">
            8 quick questions. Every AI feature — strategy, content, compliance — runs off this. The more specific you are, the less generic the output.
          </p>

          {/* Website extraction */}
          <div className="bg-black/4 border border-neutral-200 rounded-2xl p-5 mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-neutral-500" />
              <span className="text-neutral-700 text-sm font-medium">Extract from your website or Instagram</span>
              <span className="text-neutral-400 text-xs ml-auto">Optional</span>
            </div>
            <p className="text-neutral-400 text-xs mb-4 leading-relaxed">
              Paste a URL and we&apos;ll read your existing brand content to pre-fill the questions below.
            </p>
            <div className="flex gap-2">
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && extractWebsite()}
                placeholder="https://yourbrand.com or https://instagram.com/yourbrand"
                className="glass-input flex-1 px-3 py-2 text-sm"
              />
              <button
                onClick={extractWebsite}
                disabled={extracting || !websiteUrl.trim()}
                className="btn-accent flex items-center gap-1.5 px-4 py-2 text-sm shrink-0 disabled:opacity-40"
              >
                {extracting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                Extract
              </button>
            </div>

            {extracted && (
              <div className="mt-4 p-3 rounded-xl bg-white/60 border border-neutral-200">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Check size={12} className="text-emerald-500" />
                  <span className="text-neutral-600 text-xs font-medium">Brand info extracted</span>
                </div>
                <p className="text-neutral-500 text-xs leading-relaxed">{extracted.summary}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setStep(0)}
            className="btn-accent w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            Start brand profile <ArrowRight size={14} />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full mt-3 py-2 text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            Skip for now — I&apos;ll do this later
          </button>
        </div>
      </div>
    )
  }

  // ─── QUESTION STEPS ──────────────────────────────────────────────────────

  if (!cs) return null

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={goBack} className="flex items-center gap-1.5 text-neutral-400 hover:text-neutral-600 text-sm transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1 mx-4">
            <div className="w-full bg-neutral-100 rounded-full h-1.5">
              <div
                className="bg-neutral-800 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <span className="text-neutral-400 text-xs font-medium shrink-0">{step + 1} / {totalSteps}</span>
        </div>

        {/* Answered trail */}
        {step > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {STEPS.slice(0, step).map(s => {
              const ans = answers[s.id]
              if (!ans || (Array.isArray(ans) && ans.length === 0)) return null
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(STEPS.indexOf(s))}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-500 text-xs hover:bg-neutral-200 transition-colors"
                >
                  <Check size={10} className="text-neutral-400" />
                  {truncate(ans)}
                </button>
              )
            })}
          </div>
        )}

        {/* Question card */}
        <div className="glass p-8">
          {/* Business name personalisation */}
          {businessName && step === 0 && (
            <div className="text-neutral-400 text-xs font-medium uppercase tracking-wide mb-3">
              About {businessName}
            </div>
          )}

          <h2 className="text-xl font-semibold text-neutral-900 mb-2 leading-snug">{cs.question}</h2>
          {cs.subtext && (
            <p className="text-neutral-400 text-sm mb-6 leading-relaxed">{cs.subtext}</p>
          )}
          {!cs.subtext && <div className="mb-6" />}

          {/* ── TEXTAREA ── */}
          {cs.type === 'textarea' && (
            <div>
              <textarea
                ref={textareaRef}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleTextContinue()
                }}
                placeholder={cs.placeholder}
                rows={4}
                className="glass-input w-full px-4 py-3 text-sm resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-neutral-400 text-xs">⌘ + Enter to continue</p>
                <div className="flex gap-2">
                  {cs.optional && (
                    <button onClick={skipStep} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                      Skip
                    </button>
                  )}
                  <button onClick={handleTextContinue} className="btn-accent flex items-center gap-2 px-5 py-2 text-sm">
                    Continue <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── CHIPS (single select) ── */}
          {cs.type === 'chips' && (
            <div className="flex flex-col gap-2">
              {cs.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleChipsAnswer(opt)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                    answers[cs.id] === opt
                      ? 'border-neutral-400 bg-black/7 text-neutral-900 font-medium'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-black/4'
                  }`}
                >
                  {opt}
                </button>
              ))}
              {cs.optional && (
                <button onClick={skipStep} className="mt-2 text-center text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                  Skip
                </button>
              )}
            </div>
          )}

          {/* ── MULTISELECT ── */}
          {cs.type === 'multiselect' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {cs.options?.map(opt => {
                  const selected = multiVal.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => handleMultiselectToggle(opt)}
                      className={`px-4 py-2 rounded-full border text-sm transition-all ${
                        selected
                          ? 'border-neutral-400 bg-black/8 text-neutral-900 font-medium'
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-black/4'
                      }`}
                    >
                      {selected && <span className="mr-1.5">✓</span>}
                      {opt}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 text-xs">{multiVal.length} selected</span>
                <div className="flex gap-2">
                  {cs.optional && (
                    <button onClick={skipStep} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                      Skip
                    </button>
                  )}
                  <button onClick={handleMultiselectContinue} className="btn-accent flex items-center gap-2 px-5 py-2 text-sm">
                    Continue <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── CHIPS + TEXT ── */}
          {cs.type === 'chips+text' && (
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {cs.options?.map(opt => {
                  const isSelected = chipTextVal === opt
                  return (
                    <button
                      key={opt}
                      onClick={() => setChipTextVal(isSelected ? '' : opt)}
                      className={`px-3 py-1.5 rounded-full border text-sm transition-all ${
                        isSelected
                          ? 'border-neutral-400 bg-black/8 text-neutral-900 font-medium'
                          : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-black/4'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              <textarea
                value={chipTextVal}
                onChange={e => setChipTextVal(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleTextContinue()
                }}
                placeholder={cs.placeholder}
                rows={3}
                className="glass-input w-full px-4 py-3 text-sm resize-none"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-neutral-400 text-xs">Click a chip or write your own</p>
                <div className="flex gap-2">
                  {cs.optional && (
                    <button onClick={skipStep} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-600 transition-colors">
                      Skip
                    </button>
                  )}
                  <button onClick={handleTextContinue} className="btn-accent flex items-center gap-2 px-5 py-2 text-sm">
                    Continue <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Last step save */}
        {step === STEPS.length - 1 && (
          <p className="text-center text-neutral-400 text-xs mt-4">
            This is the last question — hitting Continue will save your brand profile.
          </p>
        )}

        {/* Saving overlay */}
        {saving && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin text-neutral-400" />
              <p className="text-neutral-500 text-sm">Saving your brand profile...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
