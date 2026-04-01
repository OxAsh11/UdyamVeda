import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Building2, Landmark, Lightbulb, BarChart2, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: business }, { data: modules }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    supabase.from('business_profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('module_selections').select('*').eq('user_id', user.id).single(),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Good morning, {firstName}</h1>
          <p className="text-neutral-400 text-sm mt-1">
            {business?.business_name ? `${business.business_name} · ` : ''}{business?.sector ?? ''}
          </p>
        </div>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">

        {/* Setup & Schemes */}
        {modules?.setup_schemes && (
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black/8 flex items-center justify-center">
                  <Building2 size={18} className="text-neutral-600" />
                </div>
                <div>
                  <div className="text-neutral-900 font-semibold text-sm">Setup & Schemes</div>
                  <div className="text-neutral-400 text-xs">Registration + Government schemes</div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 mb-5" />

            <div className="flex flex-col gap-3 mb-6">
              <Link href="/dashboard/registration" className="flex items-center justify-between p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all group">
                <div className="flex items-center gap-2.5">
                  <Building2 size={15} className="text-neutral-500" />
                  <div>
                    <div className="text-neutral-700 text-sm font-medium">Registration Guide</div>
                    <div className="text-neutral-400 text-xs">Find the right structure for your business</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" />
              </Link>

              <Link href="/dashboard/schemes" className="flex items-center justify-between p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all group">
                <div className="flex items-center gap-2.5">
                  <Landmark size={15} className="text-neutral-500" />
                  <div>
                    <div className="text-neutral-700 text-sm font-medium">Scheme Matcher</div>
                    <div className="text-neutral-400 text-xs">Discover eligible government schemes</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" />
              </Link>
            </div>

            <Link href="/dashboard/schemes" className="btn-accent inline-flex items-center gap-2 px-4 py-2 text-sm">
              Find my schemes <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* GTM Platform */}
        {modules?.gtm_platform && (
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black/8 flex items-center justify-center">
                  <Lightbulb size={18} className="text-neutral-600" />
                </div>
                <div>
                  <div className="text-neutral-900 font-semibold text-sm">GTM Platform</div>
                  <div className="text-neutral-400 text-xs">Strategy · Campaigns · Distribute · Track</div>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-200 mb-5" />

            <div className="flex flex-col gap-3 mb-6">
              <Link href="/dashboard/ideate" className="flex items-center justify-between p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all group">
                <div className="flex items-center gap-2.5">
                  <Lightbulb size={15} className="text-neutral-500" />
                  <div>
                    <div className="text-neutral-700 text-sm font-medium">Build your GTM strategy</div>
                    <div className="text-neutral-400 text-xs">ICP, channels, benchmarks & case studies</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" />
              </Link>

              <Link href="/dashboard/track" className="flex items-center justify-between p-3 rounded-xl bg-black/5 hover:bg-black/10 transition-all group">
                <div className="flex items-center gap-2.5">
                  <BarChart2 size={15} className="text-neutral-500" />
                  <div>
                    <div className="text-neutral-700 text-sm font-medium">Track performance</div>
                    <div className="text-neutral-400 text-xs">Metrics, benchmarks & AI insights</div>
                  </div>
                </div>
                <ArrowRight size={14} className="text-neutral-400 group-hover:text-neutral-500 transition-colors" />
              </Link>
            </div>

            <Link href="/dashboard/ideate" className="btn-accent inline-flex items-center gap-2 px-4 py-2 text-sm">
              Start ideating <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="glass p-5">
        <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wide mb-4">Quick Actions</div>
        <div className="flex flex-wrap gap-3">
          {modules?.setup_schemes && (
            <>
              <Link href="/dashboard/registration" className="chip hover:border-neutral-300 hover:text-neutral-800">
                → Registration guide
              </Link>
              <Link href="/dashboard/schemes" className="chip hover:border-neutral-300 hover:text-neutral-800">
                → Find schemes
              </Link>
            </>
          )}
          {modules?.gtm_platform && (
            <>
              <Link href="/dashboard/ideate" className="chip hover:border-neutral-300 hover:text-neutral-800">
                → Build GTM strategy
              </Link>
              <Link href="/dashboard/campaigns" className="chip hover:border-neutral-300 hover:text-neutral-800">
                → View campaigns
              </Link>
            </>
          )}
          <Link href="/dashboard/settings" className="chip hover:border-neutral-300 hover:text-neutral-800">
            → Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
