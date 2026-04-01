import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/signup')

  const { data: business } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) redirect('/onboarding')

  const { data: modules } = await supabase
    .from('module_selections')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!modules) redirect('/onboarding/modules')

  redirect('/dashboard')
}
