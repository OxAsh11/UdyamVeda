// Test-only access to the reviewed seed data in supabase/seed/mvp/.
import fs from 'node:fs'
import path from 'node:path'
import type { RuleFieldMapping } from '../../fact-mapping'

function seed<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'supabase', 'seed', 'mvp', name), 'utf8')) as T
}

export type SeedFact = {
  key: string
  type: string
  fixable: boolean
  stage: number
  values?: unknown[][]
}

type SeedActivity = { id: string; packs: string[] }
type SeedPack = { id: string }
type SeedRecord = { slug: string; rules: unknown }
type SeedCorrection = { slug?: string; changes: { rules?: unknown } }

export const mappings = seed<RuleFieldMapping[]>('rule-field-map.json')
export const factDefinitions = seed<{ facts: SeedFact[] }>('facts.json').facts
export const packs = seed<SeedPack[]>('packs.json')
const activities = seed<SeedActivity[]>('activities.json')
export const activityIds = activities.map(activity => activity.id)
export const activityPacks: Record<string, string[]> = Object.fromEntries(activities.map(activity => [activity.id, activity.packs]))
export const p04Catalog = seed<{ new_records: SeedRecord[]; corrections: SeedCorrection[] }>('p04-catalog.json')
