import type { ActivityItem } from './api'
import type { Lang } from './types'

// The answers live in the browser until the founder signs in, so nobody needs
// an account to see results. Storage can be blocked or missing; the copy in
// memory keeps the flow working for this visit either way.
const KEY = 'uv.start.draft.v1'
const LANGS: readonly Lang[] = ['en', 'hi', 'mr']

export type Draft = {
  facts: Record<string, unknown>
  asked: string[]
  // Question ids per screen, so Back can undo one screen at a time.
  history: string[][]
  // The chosen activities with their labels, so coming back shows them by name.
  activityItems: ActivityItem[]
  lang: Lang
}

export function emptyDraft(): Draft {
  return { facts: {}, asked: [], history: [], activityItems: [], lang: 'en' }
}

let memory: Draft | null = null

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function parse(stored: string | null): Draft | null {
  if (!stored) return null
  try {
    const value: unknown = JSON.parse(stored)
    if (!isObject(value) || !isObject(value.facts) || !Array.isArray(value.asked) || !Array.isArray(value.history)) return null
    return {
      facts: value.facts,
      asked: value.asked.filter((id): id is string => typeof id === 'string'),
      history: value.history.filter((screen): screen is string[] => Array.isArray(screen) && screen.every(id => typeof id === 'string')),
      activityItems: Array.isArray(value.activityItems) ? value.activityItems.filter((item): item is ActivityItem => isObject(item) && typeof item.id === 'string' && isObject(item.label)) : [],
      lang: LANGS.includes(value.lang as Lang) ? (value.lang as Lang) : 'en',
    }
  } catch {
    return null
  }
}

export function loadDraft(): Draft {
  try {
    const stored = parse(localStorage.getItem(KEY))
    if (stored) return stored
  } catch {
    // Blocked storage: fall through to the copy in memory.
  }
  return memory ?? emptyDraft()
}

export function saveDraft(draft: Draft) {
  memory = draft
  try {
    localStorage.setItem(KEY, JSON.stringify(draft))
  } catch {
    // Blocked or full storage: the copy in memory still serves this visit.
  }
}

export function clearDraft() {
  memory = null
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Nothing stored to clear.
  }
}
