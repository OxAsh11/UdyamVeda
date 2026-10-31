import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { CATALOG_CACHE_TAG } from '@/lib/opportunities/engine/catalog'
import { bundleFromRows, type BundleRows } from './bundle'
import type { StartBundle } from './types'

async function fetchBundle(): Promise<StartBundle> {
  // Public reference data, read with the anon role, so one copy serves everyone.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const [questions, questionFacts, facts, activities, activityPacks] = await Promise.all([
    supabase.from('questions').select('id, ask_stage, sort_order, answer_kind, prompt_en, prompt_hi, prompt_mr, help_en, help_hi, help_mr, depends_on').eq('active', true),
    supabase.from('question_facts').select('question_id, fact_key'),
    supabase.from('fact_definitions').select('key, value_type, allowed_values, sensitive, pack_ids, label_en, label_hi, label_mr').eq('active', true),
    supabase.from('activities').select('id, label_en, label_hi, label_mr, synonyms, icon').eq('active', true).order('sort_order'),
    supabase.from('activity_packs').select('activity_id, pack_id'),
  ])
  const failed = [questions, questionFacts, facts, activities, activityPacks].find(result => result.error)
  if (failed?.error) throw new Error(failed.error.message)

  return bundleFromRows({
    questions: questions.data as BundleRows['questions'],
    questionFacts: questionFacts.data as BundleRows['questionFacts'],
    facts: facts.data as BundleRows['facts'],
    activities: activities.data as BundleRows['activities'],
    activityPacks: activityPacks.data as BundleRows['activityPacks'],
  })
}

// A failure throws inside the cached function, so an outage is never cached.
const cachedBundle = unstable_cache(fetchBundle, ['start-bundle'], { revalidate: 300, tags: [CATALOG_CACHE_TAG] })

/** Questions, fact labels and activities, or null when they cannot be read right now. */
export async function loadStartBundle(): Promise<StartBundle | null> {
  try {
    return await cachedBundle()
  } catch (error) {
    console.error('Unable to load the question data', error)
    return null
  }
}
