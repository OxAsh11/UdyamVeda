import type { ActivityItem } from './api'
import type { Lang } from './types'

// The answers live in the browser until the founder signs in, so nobody needs
// an account to see results. Storage can be blocked or missing; the copy in
// memory keeps the flow working for this visit either way.
const KEY = 'uv.start.draft.v1'
const LANGS: readonly Lang[] = ['en', 'hi', 'mr']
// Answers can include category or income, and phones are shared.
const KEEP_FOR_MS = 7 * 24 * 60 * 60 * 1000

export type Draft = {
  facts: Record<string, unknown>
  asked: string[]
  // Question ids per screen, so Back can undo one screen at a time.
  history: string[][]
  // The chosen activities with their labels, so coming back shows them by name.
  activityItems: ActivityItem[]
  lang: Lang
  // The account this draft was saved to or loaded from; null while anonymous.
  ownerId: string | null
  updatedAt: number
}

export function emptyDraft(): Draft {
  return { facts: {}, asked: [], history: [], activityItems: [], lang: 'en', ownerId: null, updatedAt: 0 }
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
      ownerId: typeof value.ownerId === 'string' ? value.ownerId : null,
      updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : 0,
    }
  } catch {
    return null
  }
}

const isFresh = (draft: Draft) => Date.now() - draft.updatedAt <= KEEP_FOR_MS

export function loadDraft(): Draft {
  let found = memory
  try {
    found = parse(localStorage.getItem(KEY)) ?? memory
  } catch {
    // Blocked storage: use the copy in memory.
  }
  if (found && isFresh(found)) return found
  if (found) clearDraft()
  return emptyDraft()
}

export function saveDraft(draft: Draft) {
  memory = { ...draft, updatedAt: Date.now() }
  try {
    localStorage.setItem(KEY, JSON.stringify(memory))
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
