import type { SupabaseClient } from '@supabase/supabase-js'
import { getBusinessForUser } from '@/lib/businesses/dal'
import { forYouShown, savedSchemes, type SavedScheme } from './browse'
import { loadFounderResults, type FounderResults } from './load-results'

/** Saved schemes, read the way the saved-schemes route reads them. If the read fails the list is left out, not the page. */
async function loadSaved(supabase: SupabaseClient, userId: string): Promise<SavedScheme[]> {
  try {
    const { business } = await getBusinessForUser(supabase, userId)
    if (!business) return []
    const { data, error } = await supabase
      .from('saved_opportunities')
      .select('id, opportunity_id, status, created_at, opportunity:opportunities(id, slug, name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
    return error ? [] : savedSchemes(data)
  } catch {
    return []
  }
}

/**
 * What the Schemes page needs about the founder: their results, and the schemes they saved, which
 * only the For you view shows. Everyone who is not browsing sees For you, so its list is read
 * alongside the results; when browsing, only a founder with nothing to sort sees it, which is
 * known once the results are in, so a ready founder on Browse all never has it read.
 */
export async function loadSchemesFounder(
  supabase: SupabaseClient,
  userId: string,
  browsing: boolean,
): Promise<{ founder: FounderResults; saved: SavedScheme[] }> {
  const alongside = browsing ? null : loadSaved(supabase, userId)
  const founder = await loadFounderResults(supabase, userId)
  const saved = alongside ? await alongside : forYouShown(founder, browsing) ? await loadSaved(supabase, userId) : []
  return { founder, saved }
}
