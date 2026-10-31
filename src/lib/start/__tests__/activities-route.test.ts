import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/activities/route'
import { POST } from '@/app/api/activities/suggest/route'
import { loadStartBundle } from '../load-bundle'
import { resetSuggestLimits } from '../suggest-limit'
import { seedBundle } from './seed-bundle'

const create = vi.hoisted(() => vi.fn())
const clientOptions = vi.hoisted(() => ({ last: null as unknown }))

vi.mock('../load-bundle', () => ({ loadStartBundle: vi.fn() }))
vi.mock('openai', () => ({
  default: class {
    chat = { completions: { create } }
    constructor(options: unknown) {
      clientOptions.last = options
    }
  },
}))
const load = vi.mocked(loadStartBundle)

const suggest = (text: unknown, address = '1.2.3.4') => POST(new Request('https://app.udyamveda.in/api/activities/suggest', {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-forwarded-for': address },
  body: JSON.stringify({ text }),
}))
const aiReplies = (ids: string[]) => create.mockResolvedValue({ choices: [{ message: { content: JSON.stringify({ ids }) } }] })

beforeEach(() => {
  load.mockReset()
  load.mockResolvedValue(seedBundle())
  create.mockReset()
  resetSuggestLimits()
  vi.stubEnv('OPENAI_API_KEY', 'test-key')
  vi.stubEnv('OPENAI_ACTIVITY_MODEL', 'cheap-model')
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('GET /api/activities', () => {
  it('finds activities in any language', async () => {
    const response = await GET(new Request('https://app.udyamveda.in/api/activities?q=%E0%A4%B2%E0%A5%8B%E0%A4%A3%E0%A4%9A%E0%A5%87'))
    expect(response.status).toBe(200)
    const { items } = await response.json()
    expect(items[0].id).toBe('pickles_chutney')
    expect(items[0].label.mr).toContain('लोणचे')
    expect(items[0].synonyms).toBeUndefined()
  })

  it('says "try again" when the data is down', async () => {
    load.mockResolvedValue(null)
    const response = await GET(new Request('https://app.udyamveda.in/api/activities?q=fish'))
    expect(response.status).toBe(503)
  })
})

describe('POST /api/activities/suggest', () => {
  it('returns only real activities, whatever the AI says', async () => {
    aiReplies(['pickles_chutney', 'made_up_activity', 'bakery'])
    const response = await suggest('I make mango preserves at home')
    expect(response.status).toBe(200)
    const { items } = await response.json()
    expect(items.map((item: { id: string }) => item.id)).toEqual(['pickles_chutney', 'bakery'])
  })

  it('returns nothing, without calling the AI, when no key is set', async () => {
    vi.stubEnv('OPENAI_API_KEY', '')
    const response = await suggest('anything')
    expect(response.status).toBe(200)
    expect((await response.json()).items).toEqual([])
    expect(create).not.toHaveBeenCalled()
  })

  it('stays off, costing nothing, until a cheap model is chosen on purpose', async () => {
    vi.stubEnv('OPENAI_ACTIVITY_MODEL', '')
    const response = await suggest('anything')
    expect(response.status).toBe(200)
    expect((await response.json()).items).toEqual([])
    expect(create).not.toHaveBeenCalled()
  })

  it('limits each call: its own model, a short reply, a time limit and no retries', async () => {
    aiReplies(['bakery'])
    await suggest('bread')
    expect(create.mock.calls[0][0]).toMatchObject({ model: 'cheap-model', max_completion_tokens: 200 })
    expect(clientOptions.last).toMatchObject({ timeout: 8000, maxRetries: 0 })
  })

  it('returns nothing when the AI fails, so the founder can still browse', async () => {
    create.mockRejectedValue(new Error('down'))
    const response = await suggest('anything')
    expect(response.status).toBe(200)
    expect((await response.json()).items).toEqual([])
  })

  it('survives a reply that is not JSON', async () => {
    create.mockResolvedValue({ choices: [{ message: { content: 'sorry, no idea' } }] })
    expect((await (await suggest('anything')).json()).items).toEqual([])
  })

  it.each([['too long', 'x'.repeat(121)], ['empty', '   '], ['not text', 42]])('rejects text that is %s', async (_name, text) => {
    expect((await suggest(text)).status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it('stops one address after 10 calls in an hour', async () => {
    aiReplies(['bakery'])
    for (let call = 0; call < 10; call += 1) expect((await suggest('bread')).status).toBe(200)
    expect((await suggest('bread')).status).toBe(429)
    expect(create).toHaveBeenCalledTimes(10)
    expect((await suggest('bread', '5.6.7.8')).status).toBe(200)
  })

  it('stops everyone once the instance reaches its hourly total', async () => {
    aiReplies(['bakery'])
    for (let call = 0; call < 200; call += 1) await suggest('bread', `10.0.0.${call}`)
    expect((await suggest('bread', '9.9.9.9')).status).toBe(429)
    expect(create).toHaveBeenCalledTimes(200)
  })
})
