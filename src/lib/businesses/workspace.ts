import type { SupabaseClient } from '@supabase/supabase-js'
import { getBusinessForUser } from './dal'

/** The founder's workspace, created on first save, so saving results never needs a form first. */
export async function ensureBusiness(supabase: SupabaseClient, userId: string): Promise<{ businessId: string } | { error: string }> {
  const { business, error } = await getBusinessForUser(supabase, userId)
  if (error) return { error: error.message }
  if (business) return { businessId: business.id }

  const { data: created, error: createError } = await supabase
    .from('businesses')
    .insert({ owner_id: userId, name: 'My business' })
    .select('id')
    .single()
  if (createError || !created) return { error: createError?.message ?? 'Unable to create your workspace.' }

  const { error: membershipError } = await supabase.from('business_memberships').upsert({
    business_id: created.id,
    user_id: userId,
    role: 'owner',
  })
  if (membershipError) return { error: membershipError.message }

  return { businessId: created.id }
}
