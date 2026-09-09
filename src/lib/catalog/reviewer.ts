import { createClient } from '@/lib/supabase/server'

export async function getCatalogReviewer() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { supabase, user: null, reviewer: null, error: userError ?? null }
  }

  const { data: reviewer, error } = await supabase
    .from('catalog_reviewers')
    .select('user_id, email_snapshot, active')
    .eq('user_id', user.id)
    .eq('active', true)
    .maybeSingle()

  return { supabase, user, reviewer, error }
}
