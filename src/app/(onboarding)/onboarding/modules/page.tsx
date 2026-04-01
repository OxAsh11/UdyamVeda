'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const MODULES = [
  {
    id: 'setup_schemes',
    icon: '◈',
    title: 'Setup & Schemes',
    tagline: 'Get your foundation right',
    features: [
      'Registration type guidance',
      'Platform price comparison',
      'Government scheme discovery',
      'Application step-by-step support',
      'Deadline & renewal reminders',
    ],
    bestFor: 'Just starting out or formalising your business',
  },
  {
    id: 'gtm_platform',
    icon: '◉',
    title: 'GTM Platform',
    tagline: 'Grow your visibility',
    features: [
      'AI-powered strategy & ICP',
      'Visual drawing board',
      'Campaign planning & content',
      'Publish to Instagram, WhatsApp, Email',
      'Track metrics & benchmarks',
    ],
    bestFor: 'Ready to reach your first or next set of customers',
  },
]

export default function ModuleSelectionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggleModule(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectBoth() {
    setSelected(new Set(MODULES.map(m => m.id)))
  }

  async function handleContinue() {
    if (selected.size === 0) {
      toast.error('Please select at least one module')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('module_selections').upsert({
      user_id: user.id,
      setup_schemes: selected.has('setup_schemes'),
      gtm_platform: selected.has('gtm_platform'),
    })

    if (error) {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="text-xl font-bold text-white tracking-tight">Center</div>
          <div className="text-white/40 text-xs font-medium">Step 2 of 2</div>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-1">What do you need help with?</h1>
        <p className="text-white/50 text-sm mb-8">You can change or hide modules anytime from Settings.</p>

        {/* Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {MODULES.map(mod => {
            const isSelected = selected.has(mod.id)
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => toggleModule(mod.id)}
                className={`glass text-left p-6 transition-all duration-200 ${
                  isSelected
                    ? 'border-[#4F8EF7] bg-[rgba(79,142,247,0.1)] shadow-[0_0_30px_rgba(79,142,247,0.15)]'
                    : 'hover:bg-white/[0.08]'
                }`}
              >
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`text-2xl ${isSelected ? 'text-[#4F8EF7]' : 'text-white/60'}`}>
                    {mod.icon}
                  </div>
                  <div>
                    <div className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-white/80'}`}>
                      {mod.title}
                    </div>
                    <div className="text-white/40 text-xs">{mod.tagline}</div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 mb-4" />

                {/* Features */}
                <ul className="flex flex-col gap-2 mb-5">
                  {mod.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <span className={`mt-0.5 text-xs ${isSelected ? 'text-[#34D399]' : 'text-white/30'}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Best for */}
                <div className={`text-xs px-3 py-2 rounded-lg ${isSelected ? 'bg-[rgba(79,142,247,0.15)] text-[#4F8EF7]' : 'bg-white/5 text-white/40'}`}>
                  Best for: {mod.bestFor}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="mt-4 flex items-center gap-2 text-[#4F8EF7] text-xs font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#4F8EF7] flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                    Selected
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Select Both */}
        <button
          type="button"
          onClick={selectBoth}
          className="w-full py-3 rounded-xl border border-white/15 bg-white/5 text-white/70 text-sm font-medium hover:bg-white/10 hover:text-white transition-all mb-4"
        >
          Select Both — Recommended
        </button>

        {/* Continue */}
        <button
          onClick={handleContinue}
          disabled={loading || selected.size === 0}
          className="btn-accent w-full py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up your workspace...' : `Continue with ${selected.size === 0 ? '...' : selected.size === 2 ? 'both modules' : MODULES.find(m => selected.has(m.id))?.title} →`}
        </button>
      </div>
    </div>
  )
}
