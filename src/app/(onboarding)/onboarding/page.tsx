'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const SECTORS = [
  'Agriculture & Food', 'Automotive', 'Construction & Real Estate',
  'Consumer Goods', 'E-commerce & Retail', 'Education & EdTech',
  'Energy & Cleantech', 'Fashion & Apparel', 'Finance & FinTech',
  'Healthcare & MedTech', 'Hospitality & Travel', 'IT & Software',
  'Logistics & Supply Chain', 'Manufacturing', 'Media & Entertainment',
  'Professional Services', 'Telecom', 'Other',
]

const STAGES = [
  { value: 'pre-launch', label: 'Pre-launch', desc: 'Still building the product/service' },
  { value: 'just-started', label: 'Just started', desc: 'Operating for less than 6 months' },
  { value: '1-2-years', label: '1–2 years', desc: 'Established and growing' },
  { value: '2-plus', label: '2+ years', desc: 'Scaling up' },
]

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman & Nicobar', 'Lakshadweep', 'Dadra & Nagar Haveli', 'Daman & Diu',
]

const FOUNDER_TYPES = [
  { value: 'general', label: 'General' },
  { value: 'women', label: 'Women' },
  { value: 'sc-st', label: 'SC / ST' },
  { value: 'ex-serviceman', label: 'Ex-Serviceman' },
]

const CAPITAL_RANGES = [
  'Under ₹1 lakh', '₹1–5 lakh', '₹5–10 lakh',
  '₹10–25 lakh', '₹25–50 lakh', '₹50 lakh – ₹1 crore', 'Above ₹1 crore',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    business_name: '',
    sector: '',
    stage: '',
    state: '',
    district: '',
    founder_type: '',
    initial_capital: '',
  })

  function set(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.sector || !form.stage || !form.state || !form.founder_type || !form.initial_capital) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { router.push('/login'); return }

    const { error } = await supabase.from('business_profiles').upsert({
      user_id: user.id,
      ...form,
    })

    if (error) {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    router.push('/onboarding/modules')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="glass p-10 w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xl font-bold text-neutral-900 tracking-tight">Center</div>
          <div className="text-neutral-400 text-xs font-medium">Step 1 of 2</div>
        </div>

        <h1 className="text-2xl font-semibold text-neutral-900 mb-1">Tell us about your business</h1>
        <p className="text-neutral-500 text-sm mb-8">We&apos;ll personalise everything based on this.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Business Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Business Name</label>
            <input
              type="text"
              placeholder="e.g. Sunrise Traders"
              value={form.business_name}
              onChange={e => set('business_name', e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm"
            />
          </div>

          {/* Sector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Sector</label>
            <select
              required
              value={form.sector}
              onChange={e => set('sector', e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm appearance-none"
            >
              <option value="" disabled>Select your sector</option>
              {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Business Stage */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Business Stage</label>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set('stage', s.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.stage === s.value
                      ? 'border-neutral-400 bg-black/7'
                      : 'border-neutral-200 bg-black/5 hover:border-neutral-300'
                  }`}
                >
                  <div className={`text-sm font-medium ${form.stage === s.value ? 'text-neutral-800' : 'text-neutral-700'}`}>
                    {s.label}
                  </div>
                  <div className="text-neutral-400 text-xs mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* State + District */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">State</label>
              <select
                required
                value={form.state}
                onChange={e => set('state', e.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm appearance-none"
              >
                <option value="" disabled>Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">District</label>
              <input
                type="text"
                placeholder="e.g. Pune"
                value={form.district}
                onChange={e => set('district', e.target.value)}
                className="glass-input w-full px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          {/* Founder Type */}
          <div className="flex flex-col gap-2">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Founder Type</label>
            <div className="flex flex-wrap gap-2">
              {FOUNDER_TYPES.map(f => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => set('founder_type', f.value)}
                  className={`chip ${form.founder_type === f.value ? 'selected' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Capital */}
          <div className="flex flex-col gap-1.5">
            <label className="text-neutral-500 text-xs font-medium uppercase tracking-wide">Initial Capital</label>
            <select
              required
              value={form.initial_capital}
              onChange={e => set('initial_capital', e.target.value)}
              className="glass-input w-full px-4 py-2.5 text-sm appearance-none"
            >
              <option value="" disabled>Select range</option>
              {CAPITAL_RANGES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-accent w-full py-3 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Continue →'}
          </button>
        </form>
      </div>
    </div>
  )
}
