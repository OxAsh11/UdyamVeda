import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBusinessForUser } from '@/lib/businesses/dal'
import Sidebar from '@/components/layout/Sidebar'
import { MapPin, Search, ChevronDown } from 'lucide-react'
import { AUTH_REQUIRED } from '@/lib/auth/mode'
import NotificationCenter from '@/components/layout/NotificationCenter'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let profile: { full_name?: string | null } | null = null
  let modules: { setup_schemes?: boolean | null; gtm_platform?: boolean | null } | null = null
  let business: { business_name?: string | null; state?: string | null } | null = null

  if (AUTH_REQUIRED) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const [{ data: profileData }, { data: modulesData }] = await Promise.all([
      supabase.from('profiles').select('full_name').eq('id', user.id).single(),
      supabase.from('module_selections').select('setup_schemes, gtm_platform').eq('user_id', user.id).single(),
    ])
    const { business: workspace, error: workspaceError } = await getBusinessForUser(supabase, user.id)
    // A signed-in user without a business has nothing to match against yet.
    // Only redirect on a clean "no business" answer, never on a lookup error.
    if (!workspace && !workspaceError) redirect('/onboarding')
    profile = profileData
    modules = modulesData
    business = workspace ? { business_name: workspace.name, state: workspace.state } : null
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userName={profile?.full_name ?? 'You'}
        setupSchemes={modules?.setup_schemes ?? false}
        gtmPlatform={modules?.gtm_platform ?? false}
      />
      <main className="min-w-0 flex-1 overflow-auto pt-14 md:pt-0">
        <header className="sticky top-0 z-20 hidden h-[72px] items-center justify-between border-b border-slate-200/80 bg-[#f8f7f3]/85 px-8 backdrop-blur-xl md:flex">
          <div className="relative w-full max-w-md">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="glass-input h-10 w-full pl-10 pr-16 text-sm" placeholder="Search schemes, grants, licences…" aria-label="Search UdyamVeda" />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">⌘ K</kbd>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5 text-slate-500"><MapPin size={15} className="text-indigo-500" />{business?.state || 'India'}<ChevronDown size={14} /></div>
            <NotificationCenter />
            <div className="flex items-center gap-2 border-l border-slate-200 pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-orange-100 text-sm font-bold text-indigo-700">{(profile?.full_name ?? 'Y').charAt(0).toUpperCase()}</div>
              <div className="hidden lg:block"><div className="text-xs font-semibold text-slate-800">{profile?.full_name ?? 'Your profile'}</div><div className="text-[10px] text-slate-400">{business?.business_name ?? 'Active business'}</div></div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
