'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, LayoutGrid, Plug, ChevronRight, ExternalLink, Save, Loader2 } from 'lucide-react'

type Tab = 'profile' | 'modules' | 'integrations'

interface Profile { full_name: string }
interface Business { business_name: string; sector: string; stage: string; state: string; district: string }
interface Modules { setup_schemes: boolean; gtm_platform: boolean }

const INTEGRATIONS = [
  { id: 'ga4', name: 'Google Analytics 4', icon: '📊', purpose: 'Track website traffic and conversions', url: 'https://analytics.google.com', category: 'Analytics' },
  { id: 'gsc', name: 'Google Search Console', icon: '🔍', purpose: 'Monitor SEO and keyword rankings', url: 'https://search.google.com/search-console', category: 'Analytics' },
  { id: 'instagram', name: 'Instagram Business', icon: '📸', purpose: 'Publish and track Instagram campaigns', url: 'https://business.instagram.com', category: 'Distribution' },
  { id: 'whatsapp', name: 'WhatsApp Business', icon: '💬', purpose: 'Send broadcast messages to customers', url: 'https://business.whatsapp.com', category: 'Distribution' },
  { id: 'mailchimp', name: 'Mailchimp', icon: '📧', purpose: 'Send and track email campaigns', url: 'https://mailchimp.com', category: 'Distribution' },
]

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile')
  const [profile, setProfile] = useState<Profile>({ full_name: '' })
  const [business, setBusiness] = useState<Business>({ business_name: '', sector: '', stage: '', state: '', district: '' })
  const [modules, setModules] = useState<Modules>({ setup_schemes: false, gtm_platform: false })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: p }, { data: b }, { data: m }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('business_profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('module_selections').select('*').eq('user_id', user.id).single(),
      ])

      if (p) setProfile({ full_name: p.full_name ?? '' })
      if (b) setBusiness({ business_name: b.business_name ?? '', sector: b.sector ?? '', stage: b.stage ?? '', state: b.state ?? '', district: b.district ?? '' })
      if (m) setModules({ setup_schemes: m.setup_schemes, gtm_platform: m.gtm_platform })
      setLoading(false)
    }
    load()
  }, [])

  async function saveProfile() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await Promise.all([
      supabase.from('profiles').update({ full_name: profile.full_name }).eq('id', user.id),
      supabase.from('business_profiles').update(business).eq('user_id', user.id),
    ])

    setSaving(false)
    toast.success('Profile saved')
  }

  async function saveModules() {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('module_selections').update(modules).eq('user_id', user.id)
    setSaving(false)
    toast.success('Modules updated — reload the sidebar to see changes')
  }

  const TABS = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'modules' as Tab, label: 'Modules', icon: LayoutGrid },
    { id: 'integrations' as Tab, label: 'Integrations', icon: Plug },
  ]

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[60vh]">
      <div className="text-white/40 text-sm">Loading settings...</div>
    </div>
  )

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your profile, modules, and integrations</p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6 glass p-1 w-fit rounded-xl">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-white/10 text-white/90' : 'text-white/40 hover:text-white/65'
            }`}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="glass p-6 flex flex-col gap-5">
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wide">Your details</div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs uppercase tracking-wide">Full Name</label>
            <input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
              className="glass-input w-full px-4 py-2.5 text-sm" placeholder="Your name" />
          </div>

          <div className="border-t border-white/08 pt-5">
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-4">Business details</div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs uppercase tracking-wide">Business Name</label>
                <input value={business.business_name} onChange={e => setBusiness(b => ({ ...b, business_name: e.target.value }))}
                  className="glass-input w-full px-4 py-2.5 text-sm" placeholder="Your business name" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-wide">Sector</label>
                  <input value={business.sector} onChange={e => setBusiness(b => ({ ...b, sector: e.target.value }))}
                    className="glass-input w-full px-4 py-2.5 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-wide">Stage</label>
                  <input value={business.stage} onChange={e => setBusiness(b => ({ ...b, stage: e.target.value }))}
                    className="glass-input w-full px-4 py-2.5 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-wide">State</label>
                  <input value={business.state} onChange={e => setBusiness(b => ({ ...b, state: e.target.value }))}
                    className="glass-input w-full px-4 py-2.5 text-sm" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/50 text-xs uppercase tracking-wide">District</label>
                  <input value={business.district} onChange={e => setBusiness(b => ({ ...b, district: e.target.value }))}
                    className="glass-input w-full px-4 py-2.5 text-sm" />
                </div>
              </div>
            </div>
          </div>

          <button onClick={saveProfile} disabled={saving}
            className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm w-fit disabled:opacity-40">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      )}

      {/* Modules tab */}
      {tab === 'modules' && (
        <div className="flex flex-col gap-4">
          <div className="glass p-6">
            <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-5">Active modules</div>
            <div className="flex flex-col gap-3">
              {[
                { key: 'setup_schemes' as keyof Modules, label: 'Setup & Schemes', desc: 'Registration guidance + Government scheme discovery' },
                { key: 'gtm_platform' as keyof Modules, label: 'GTM Platform', desc: 'Strategy, campaigns, distribution, and tracking' },
              ].map(mod => (
                <div key={mod.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  modules[mod.key] ? 'border-white/15 bg-white/[0.05]' : 'border-white/07 bg-white/[0.02]'
                }`}>
                  <div>
                    <div className={`font-medium text-sm ${modules[mod.key] ? 'text-white/85' : 'text-white/45'}`}>{mod.label}</div>
                    <div className="text-white/35 text-xs mt-0.5">{mod.desc}</div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={() => setModules(m => ({ ...m, [mod.key]: !m[mod.key] }))}
                    className={`relative w-10 h-5.5 rounded-full transition-all shrink-0 ${modules[mod.key] ? 'bg-white/30' : 'bg-white/10'}`}
                    style={{ height: 22, width: 40 }}
                  >
                    <span className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-all ${modules[mod.key] ? 'left-5' : 'left-0.5'}`}
                      style={{ width: 18, height: 18, left: modules[mod.key] ? 20 : 2 }} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={saveModules} disabled={saving}
              className="btn-accent flex items-center gap-2 px-5 py-2.5 text-sm mt-5 disabled:opacity-40">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {saving ? 'Saving...' : 'Save module settings'}
            </button>
          </div>

          <div className="glass p-4 flex items-start gap-3">
            <div className="text-white/25 text-xs mt-0.5">ℹ</div>
            <p className="text-white/35 text-xs leading-relaxed">
              Turning off a module hides it from your sidebar but does not delete your data. You can re-enable it anytime.
            </p>
          </div>
        </div>
      )}

      {/* Integrations tab */}
      {tab === 'integrations' && (
        <div className="flex flex-col gap-4">
          {['Analytics', 'Distribution'].map(category => (
            <div key={category} className="glass p-6">
              <div className="text-white/40 text-xs font-semibold uppercase tracking-wide mb-4">{category}</div>
              <div className="flex flex-col gap-3">
                {INTEGRATIONS.filter(i => i.category === category).map(integration => (
                  <div key={integration.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/07">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{integration.icon}</span>
                      <div>
                        <div className="text-white/75 font-medium text-sm">{integration.name}</div>
                        <div className="text-white/35 text-xs mt-0.5">{integration.purpose}</div>
                      </div>
                    </div>
                    <a href={integration.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-white/10 text-white/45 hover:text-white/80 hover:border-white/20 transition-all shrink-0">
                      Open <ExternalLink size={10} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="glass p-4 flex items-start gap-3">
            <div className="text-white/25 text-xs mt-0.5">ℹ</div>
            <p className="text-white/35 text-xs leading-relaxed">
              Direct one-click integrations are on the roadmap. For now, open these tools directly and enter your metrics manually in Track.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
