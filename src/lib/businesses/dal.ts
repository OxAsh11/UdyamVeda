import type { SupabaseClient } from '@supabase/supabase-js'

export type BusinessWorkspace = {
  id: string
  name: string
  lifecycle_stage: string | null
  sector: string | null
  state: string | null
  district: string | null
}

export async function getBusinessForUser(
  supabase: SupabaseClient,
  userId: string,
  requestedBusinessId?: string,
) {
  let membershipQuery = supabase
    .from('business_memberships')
    .select('business_id')
    .eq('user_id', userId)

  if (requestedBusinessId) membershipQuery = membershipQuery.eq('business_id', requestedBusinessId)
  else membershipQuery = membershipQuery.order('created_at', { ascending: true }).limit(1)

  const { data: membership, error: membershipError } = await membershipQuery.maybeSingle()
  if (membershipError) return { business: null as BusinessWorkspace | null, error: membershipError }
  if (!membership) return { business: null as BusinessWorkspace | null, error: null }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id, name, lifecycle_stage, sector, state, district')
    .eq('id', membership.business_id)
    .eq('active', true)
    .maybeSingle()

  return { business: (business ?? null) as BusinessWorkspace | null, error: businessError }
}

export async function getBusinessFacts(supabase: SupabaseClient, businessId: string) {
  return supabase
    .from('business_facts')
    .select('fact_key, fact_value, verified_at')
    .eq('business_id', businessId)
}
