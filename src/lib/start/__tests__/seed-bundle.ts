// Test-only: the bundle built from the reviewed seed files, through the same
// mapping the database rows go through.
import { factDefinitions, seed } from '@/lib/opportunities/engine/__tests__/seeds'
import { bundleFromRows, type BundleRows } from '../bundle'

type SeedQuestion = {
  id: string
  stage: number
  sort: number
  kind: string
  facts: string[]
  en: string
  hi: string
  mr: string
  help_en?: string
  help_hi?: string
  help_mr?: string
  depends_on?: unknown
}

type SeedFactRow = { key: string; type: string; packs?: string[]; sensitive?: boolean; en: string; hi: string; mr: string; values?: unknown[][] }
type SeedActivity = { id: string; en: string; hi: string; mr: string; synonyms: string[]; icon?: string; packs: string[] }

export const seedQuestions = seed<SeedQuestion[]>('questions.json')

export function seedRows(): BundleRows {
  const activities = seed<SeedActivity[]>('activities.json')
  return {
    questions: seedQuestions.map(question => ({
      id: question.id,
      ask_stage: question.stage,
      sort_order: question.sort,
      answer_kind: question.kind,
      prompt_en: question.en,
      prompt_hi: question.hi,
      prompt_mr: question.mr,
      help_en: question.help_en ?? null,
      help_hi: question.help_hi ?? null,
      help_mr: question.help_mr ?? null,
      depends_on: question.depends_on ?? null,
    })),
    questionFacts: seedQuestions.flatMap(question => question.facts.map(fact_key => ({ question_id: question.id, fact_key }))),
    facts: (factDefinitions as unknown as SeedFactRow[]).map(fact => ({
      key: fact.key,
      value_type: fact.type,
      allowed_values: fact.values?.map(([value, label_en, label_hi, label_mr]) => ({ value: String(value), label_en: String(label_en), label_hi: String(label_hi), label_mr: String(label_mr) })) ?? null,
      sensitive: fact.sensitive ?? false,
      pack_ids: fact.packs ?? [],
      label_en: fact.en,
      label_hi: fact.hi,
      label_mr: fact.mr,
    })),
    activities: activities.map(activity => ({
      id: activity.id,
      label_en: activity.en,
      label_hi: activity.hi,
      label_mr: activity.mr,
      synonyms: activity.synonyms,
      icon: activity.icon ?? null,
    })),
    activityPacks: activities.flatMap(activity => activity.packs.map(pack_id => ({ activity_id: activity.id, pack_id }))),
  }
}

export const seedBundle = () => bundleFromRows(seedRows())
