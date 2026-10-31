export type Lang = 'en' | 'hi' | 'mr'
export type Text = Record<Lang, string>

export type FlowOption = { value: string; label: Text }

export type FlowFact = {
  key: string
  type: string
  label: Text
  packIds: string[]
  sensitive: boolean
  options: FlowOption[]
}

export type FlowQuestion = {
  id: string
  // 1–7 are the first-result screens (PRD §7.2), 8 is "about you", 9 is pack follow-ups.
  stage: number
  sort: number
  kind: string
  prompt: Text
  help: Text | null
  // Rule tree over facts already answered; the question is asked only when true.
  dependsOn: unknown
  factKeys: string[]
}

export type FlowActivity = {
  id: string
  label: Text
  synonyms: string[]
  icon: string | null
  packIds: string[]
}

export type StartBundle = {
  questions: FlowQuestion[]
  facts: Record<string, FlowFact>
  activities: FlowActivity[]
}
