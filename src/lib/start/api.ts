import type { ResultsPayload } from '@/lib/opportunities/engine/results'
import type { NextStep } from './next-screen'
import type { FlowActivity, Text } from './types'

export type StepResponse = {
  step: NextStep
  preview: Record<'A' | 'B' | 'C' | 'D', number>
  factLabels: Record<string, Text>
}

export type ActivityItem = Pick<FlowActivity, 'id' | 'label' | 'icon' | 'packIds'>

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return response.ok ? await response.json() as T : null
  } catch {
    return null
  }
}

/** Null means "could not load": the screens show "try again" and keep the answers. */
export function fetchStep(facts: Record<string, unknown>, asked: string[]) {
  return postJson<StepResponse>('/api/onboarding/answer', { facts, asked })
}

export function fetchResults(facts: Record<string, unknown>) {
  return postJson<ResultsPayload>('/api/results', { facts })
}

export type FounderState = { signedIn: boolean; facts: Record<string, unknown>; asked: string[] }

/** What the account holds. Anything but a clear answer counts as not signed in. */
export async function fetchFounder(): Promise<FounderState> {
  try {
    const response = await fetch('/api/founder/facts')
    if (!response.ok) return { signedIn: false, facts: {}, asked: [] }
    const { facts, asked } = await response.json() as { facts: Record<string, unknown>; asked: string[] }
    return { signedIn: true, facts, asked }
  } catch {
    return { signedIn: false, facts: {}, asked: [] }
  }
}

export async function saveFounderFacts(facts: Record<string, unknown>) {
  try {
    const response = await fetch('/api/founder/facts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facts }),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function searchActivityItems(query: string): Promise<ActivityItem[] | null> {
  try {
    const response = await fetch(`/api/activities?q=${encodeURIComponent(query)}`)
    if (!response.ok) return null
    return (await response.json() as { items: ActivityItem[] }).items
  } catch {
    return null
  }
}

export async function suggestActivityItems(text: string): Promise<ActivityItem[]> {
  const result = await postJson<{ items: ActivityItem[] }>('/api/activities/suggest', { text })
  return result?.items ?? []
}
