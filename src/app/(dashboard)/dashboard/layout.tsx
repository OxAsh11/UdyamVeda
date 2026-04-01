import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: modules } = await supabase
    .from('module_selections')
    .select('setup_schemes, gtm_platform')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userName={profile?.full_name ?? 'You'}
        setupSchemes={modules?.setup_schemes ?? false}
        gtmPlatform={modules?.gtm_platform ?? false}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
