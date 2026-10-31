import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchFounder, saveFounderFacts } from '../api'

function replyWith(status: number, body: string) {
  const response = new Response(body, { status })
  vi.stubGlobal('fetch', vi.fn(async () => response))
  return response
}

afterEach(() => { vi.unstubAllGlobals() })

describe('every founder reply is read to the end, so no connection is left waiting', () => {
  it('reads the reply when nobody is signed in', async () => {
    const response = replyWith(401, '{"error":"not_signed_in"}')
    expect((await fetchFounder()).status).toBe('anonymous')
    expect(response.bodyUsed).toBe(true)
  })

  it('reads the reply when the check fails', async () => {
    const response = replyWith(503, '{"error":"unavailable"}')
    expect((await fetchFounder()).status).toBe('unknown')
    expect(response.bodyUsed).toBe(true)
  })

  it('reads the reply after saving', async () => {
    const response = replyWith(200, '{"saved":1}')
    expect(await saveFounderFacts({ state: 'bihar' })).toBe(true)
    expect(response.bodyUsed).toBe(true)
  })

  it('still reports a failed save', async () => {
    const response = replyWith(400, '{"error":"nothing_to_save"}')
    expect(await saveFounderFacts({})).toBe(false)
    expect(response.bodyUsed).toBe(true)
  })

  it('reports a signed-in founder with the saved answers', async () => {
    replyWith(200, JSON.stringify({ userId: 'user-a', facts: { state: 'bihar' }, asked: [], activityItems: [] }))
    expect(await fetchFounder()).toEqual({ status: 'signed_in', userId: 'user-a', facts: { state: 'bihar' }, asked: [], activityItems: [] })
  })
})
