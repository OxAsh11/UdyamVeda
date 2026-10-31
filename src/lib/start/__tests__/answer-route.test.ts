import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/onboarding/answer/route'
import { loadEngineCatalog } from '@/lib/opportunities/engine/load-catalog'
import { snapshotCatalog } from '@/lib/opportunities/engine/__tests__/snapshot'
import { loadStartBundle } from '../load-bundle'
import { seedBundle } from './seed-bundle'

vi.mock('@/lib/opportunities/engine/load-catalog', () => ({ loadEngineCatalog: vi.fn() }))
vi.mock('../load-bundle', () => ({ loadStartBundle: vi.fn() }))
const loadCatalog = vi.mocked(loadEngineCatalog)
const loadBundle = vi.mocked(loadStartBundle)

const post = (body: unknown) => POST(new Request('https://app.udyamveda.in/api/onboarding/answer', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: typeof body === 'string' ? body : JSON.stringify(body),
}))

describe('POST /api/onboarding/answer', () => {
  beforeEach(() => {
    loadCatalog.mockReset()
    loadBundle.mockReset()
    loadCatalog.mockResolvedValue(snapshotCatalog())
    loadBundle.mockResolvedValue(seedBundle())
  })

  it('starts with the activity screen and live counts, with no login', async () => {
    const response = await post({ facts: {}, asked: [] })
    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(payload.step.phase).toBe('first')
    expect(payload.step.questions[0].id).toBe('q_activity')
    expect(payload.preview.A + payload.preview.B + payload.preview.C + payload.preview.D).toBeGreaterThan(0)
  })

  it('moves on as questions are answered', async () => {
    const payload = await (await post({ facts: { activity_codes: ['pond_fish'] }, asked: ['q_activity'] })).json()
    expect(payload.step.stage).toBe(2)
    expect(payload.step.questions.map((question: { id: string }) => question.id)).toEqual(['q_state', 'q_district', 'q_area'])
  })

  it('sends fact labels for the steps on a results card', async () => {
    const payload = await (await post({ facts: {}, asked: [] })).json()
    expect(payload.factLabels.applicant_age_years.hi).toBeTruthy()
  })

  it.each([
    ['the catalog', () => loadCatalog.mockResolvedValue(null)],
    ['the questions', () => loadBundle.mockResolvedValue(null)],
  ])('says "try again" when %s cannot be read', async (_name, breakIt) => {
    breakIt()
    const response = await post({ facts: {}, asked: [] })
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'unavailable' })
  })

  it('rejects bad JSON and oversized bodies', async () => {
    expect((await post('{nope')).status).toBe(400)
    expect((await post({ facts: { district: 'क'.repeat(6000) }, asked: [] })).status).toBe(413)
  })

  it('ignores question ids it does not know, and anything that is not a list', async () => {
    const unknown = await (await post({ facts: {}, asked: ['q_made_up', 7, null] })).json()
    expect(unknown.step.questions[0].id).toBe('q_activity')
    const notList = await post({ facts: {}, asked: 'q_activity' })
    expect(notList.status).toBe(200)
    expect((await notList.json()).step.questions[0].id).toBe('q_activity')
  })

  it('never returns what the caller sent as identity numbers', async () => {
    const text = await (await post({ facts: { pan_number: 'ABCDE1234F' }, asked: [] })).text()
    expect(text).not.toContain('ABCDE1234F')
  })
})
