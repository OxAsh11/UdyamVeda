import { NATIONAL_REGISTRATION_JOURNEYS } from './national-registration-journeys'

export type ComplianceCategory = 'foundation' | 'tax' | 'license' | 'ip' | 'trade' | 'hr' | 'corporate'
export type CompliancePriority = 'critical' | 'high' | 'medium' | 'low'

export interface CalendarEntry {
  label: string
  dayOfMonth?: number
  month?: number
  months?: number[]
  frequency: 'monthly' | 'quarterly' | 'annual' | 'once'
  note?: string
}

export interface ComplianceItem {
  id: string
  name: string
  shortName: string
  category: ComplianceCategory
  priority: CompliancePriority
  description: string
  why: string
  cost: string
  timeline: string
  officialUrl: string | null
  scoreWeight: number
  applicableSectors: string[]
  applicableStages: string[]
  documents: string[]
  steps: string[]
  calendar?: CalendarEntry
  penalty?: string
}

const categoryFor = {
  foundation: 'foundation',
  tax: 'tax',
  recognition: 'corporate',
  trade: 'trade',
  food: 'license',
  workforce: 'hr',
  state: 'license',
} as const

const priorityFor = {
  foundation: 'critical',
  tax: 'high',
  recognition: 'medium',
  trade: 'medium',
  food: 'medium',
  workforce: 'medium',
  state: 'low',
} as const

/**
 * Preparation-only compliance tracker.
 *
 * These rows are derived from the review-gated registration journeys. They
 * deliberately contain no hard-coded universal thresholds, deadlines, fees,
 * penalties, or entitlement claims. Those values belong in approved catalog
 * versions once the relevant official evidence has been reviewed.
 */
export const COMPLIANCE_ITEMS: ComplianceItem[] = NATIONAL_REGISTRATION_JOURNEYS.map((journey) => ({
  id: journey.id,
  name: journey.title,
  shortName: journey.shortTitle,
  category: categoryFor[journey.category],
  priority: priorityFor[journey.category],
  description: journey.description,
  why: journey.whyItMatters,
  cost: 'Confirm current official or provider-specific fees',
  timeline: 'Depends on the current official route',
  officialUrl: journey.officialUrl ?? null,
  scoreWeight: journey.category === 'foundation' ? 2 : 1,
  applicableSectors: [],
  applicableStages: [],
  documents: journey.documents,
  steps: journey.steps,
}))

export const CATEGORY_LABELS: Record<ComplianceCategory, string> = {
  foundation: 'Business foundation',
  tax: 'Tax readiness',
  license: 'Licences and permits',
  ip: 'Intellectual property',
  trade: 'Trade readiness',
  hr: 'Workforce readiness',
  corporate: 'Recognition and governance',
}

export const PRIORITY_LABELS: Record<CompliancePriority, string> = {
  critical: 'Start here',
  high: 'Important',
  medium: 'Plan next',
  low: 'Expanding coverage',
}

export function filterCompliance(
  items: ComplianceItem[],
  profile: { sector?: string; stage?: string },
) {
  return items.filter((item) => {
    const sectorMatches = item.applicableSectors.length === 0 || item.applicableSectors.some((sector) => profile.sector?.toLowerCase().includes(sector.toLowerCase()))
    const stageMatches = item.applicableStages.length === 0 || item.applicableStages.includes(profile.stage ?? '')
    return sectorMatches && stageMatches
  })
}

export function calculateHealthScore(items: ComplianceItem[], completedIds: string[]) {
  const completed = new Set(completedIds)
  const totalWeight = items.reduce((sum, item) => sum + item.scoreWeight, 0)
  const completedWeight = items.reduce((sum, item) => sum + (completed.has(item.id) ? item.scoreWeight : 0), 0)
  const score = totalWeight ? Math.round((completedWeight / totalWeight) * 100) : 0
  const byCategory = items.reduce<Record<ComplianceCategory, { completed: number; total: number }>>((result, item) => {
    result[item.category] ??= { completed: 0, total: 0 }
    result[item.category].total += 1
    if (completed.has(item.id)) result[item.category].completed += 1
    return result
  }, {} as Record<ComplianceCategory, { completed: number; total: number }>)
  return { score, completed: items.filter((item) => completed.has(item.id)).length, total: items.length, byCategory }
}

/** No deadline is shown until a reviewed catalog window supplies current evidence. */
export function getUpcomingDeadlines(_items: ComplianceItem[]) {
  void _items
  return [] as Array<{ item: ComplianceItem; date: Date; label: string }>
}
