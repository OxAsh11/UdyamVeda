import type { ResultsPayload } from '@/lib/opportunities/engine/results'
import type { NextStep } from './next-screen'
import type { FlowActivity, Text } from './types'

export type StepResponse = {
  step: NextStep
  preview: Record<'A' | 'B' | 'C' | 'D', number>
  factLabels: Record<string, Text>
}

export type ActivityItem = Pick<FlowActivity, 'id' | 'label' | 'icon' | 'packIds'>

// Every reply is read to the end: an unread one can keep its connection waiting.
async function discardReply(response: Response) {
  await response.text()
}

async function postJson<T>(url: string, body: unknown): Promise<T | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (response.ok) return await response.json() as T
    await discardReply(response)
    return null
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

export type FounderState = {
  // unknown: the check itself failed, so nothing is saved or forgotten.
  status: 'signed_in' | 'anonymous' | 'unknown'
  userId: string | null
  facts: Record<string, unknown>
  asked: string[]
  activityItems: ActivityItem[]
}

const founderWithoutAccount = (status: FounderState['status']): FounderState => ({ status, userId: null, facts: {}, asked: [], activityItems: [] })

export async function fetchFounder(): Promise<FounderState> {
  try {
    const response = await fetch('/api/founder/facts')
    if (response.ok) return { status: 'signed_in', ...await response.json() as Omit<FounderState, 'status'> }
    await discardReply(response)
    return founderWithoutAccount(response.status === 401 ? 'anonymous' : 'unknown')
  } catch {
    return founderWithoutAccount('unknown')
  }
}

export async function saveFounderFacts(facts: Record<string, unknown>) {
  try {
    const response = await fetch('/api/founder/facts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facts }),
    })
    await discardReply(response)
    return response.ok
  } catch {
    return false
  }
}

export async function searchActivityItems(query: string): Promise<ActivityItem[] | null> {
  try {
    const response = await fetch(`/api/activities?q=${encodeURIComponent(query)}`)
    if (response.ok) return (await response.json() as { items: ActivityItem[] }).items
    await discardReply(response)
    return null
  } catch {
    return null
  }
}

export async function suggestActivityItems(text: string): Promise<ActivityItem[]> {
  const result = await postJson<{ items: ActivityItem[] }>('/api/activities/suggest', { text })
  return result?.items ?? []
}
