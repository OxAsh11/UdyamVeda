import type { FlowFact, StartBundle, Text } from './types'

export type BundleRows = {
  questions: {
    id: string
    ask_stage: number
    sort_order: number
    answer_kind: string
    prompt_en: string
    prompt_hi: string
    prompt_mr: string
    help_en: string | null
    help_hi: string | null
    help_mr: string | null
    depends_on: unknown
  }[]
  questionFacts: { question_id: string; fact_key: string }[]
  facts: {
    key: string
    value_type: string
    allowed_values: { value: string; label_en: string; label_hi: string; label_mr: string }[] | null
    sensitive: boolean
    pack_ids: string[]
    label_en: string
    label_hi: string
    label_mr: string
  }[]
  activities: { id: string; label_en: string; label_hi: string; label_mr: string; synonyms: string[]; icon: string | null }[]
  activityPacks: { activity_id: string; pack_id: string }[]
}

const text = (en: string, hi: string, mr: string): Text => ({ en, hi, mr })

/** Reference data for the flow, in the form the screens use. Refuses anything half-empty. */
export function bundleFromRows(rows: BundleRows): StartBundle {
  const empty = Object.entries({ questions: rows.questions.length, facts: rows.facts.length, activities: rows.activities.length })
    .filter(([, count]) => count === 0).map(([name]) => name)
  if (empty.length) throw new Error(`The question data is incomplete: no ${empty.join(', ')}.`)

  const facts: Record<string, FlowFact> = {}
  for (const row of rows.facts) {
    facts[row.key] = {
      key: row.key,
      type: row.value_type,
      label: text(row.label_en, row.label_hi, row.label_mr),
      packIds: row.pack_ids,
      sensitive: row.sensitive,
      options: (row.allowed_values ?? []).map(option => ({ value: option.value, label: text(option.label_en, option.label_hi, option.label_mr) })),
    }
  }

  const factKeys = new Map<string, string[]>()
  for (const row of rows.questionFacts) factKeys.set(row.question_id, [...(factKeys.get(row.question_id) ?? []), row.fact_key])
  const activityPacks = new Map<string, string[]>()
  for (const row of rows.activityPacks) activityPacks.set(row.activity_id, [...(activityPacks.get(row.activity_id) ?? []), row.pack_id])

  return {
    facts,
    questions: rows.questions
      .map(row => ({
        id: row.id,
        stage: row.ask_stage,
        sort: row.sort_order,
        kind: row.answer_kind,
        prompt: text(row.prompt_en, row.prompt_hi, row.prompt_mr),
        help: row.help_en && row.help_hi && row.help_mr ? text(row.help_en, row.help_hi, row.help_mr) : null,
        dependsOn: row.depends_on,
        factKeys: factKeys.get(row.id) ?? [],
      }))
      .sort((left, right) => left.stage - right.stage || left.sort - right.sort),
    activities: rows.activities.map(row => ({
      id: row.id,
      label: text(row.label_en, row.label_hi, row.label_mr),
      synonyms: row.synonyms,
      icon: row.icon,
      packIds: activityPacks.get(row.id) ?? [],
    })),
  }
}
