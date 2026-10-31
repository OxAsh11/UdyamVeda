import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/results/route'
import { loadEngineCatalog } from '../load-catalog'
import { snapshotCatalog } from './snapshot'

vi.mock('../load-catalog', () => ({ loadEngineCatalog: vi.fn() }))
const load = vi.mocked(loadEngineCatalog)

const request = (body: string) => new Request('https://app.udyamveda.in/api/results', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body,
})

describe('POST /api/results', () => {
  beforeEach(() => {
    load.mockReset()
    load.mockResolvedValue(snapshotCatalog())
  })

  it('returns the four buckets without a login', async () => {
    const response = await POST(request(JSON.stringify({ facts: { activity_codes: ['pond_fish'], state: 'bihar' } })))
    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(Object.keys(payload.buckets).sort()).toEqual(['A', 'B', 'C', 'D'])
    expect(payload.catalogVersion).toBeTruthy()
  })

  it('says "try again" rather than showing no schemes when the catalog is down', async () => {
    load.mockResolvedValue(null)
    const response = await POST(request(JSON.stringify({ facts: { state: 'bihar' } })))
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'catalog_unavailable' })
  })

  it('rejects bad JSON', async () => {
    const response = await POST(request('{not json'))
    expect(response.status).toBe(400)
  })

  it('rejects a body over 16 KB, measured in bytes', async () => {
    const tooLong = JSON.stringify({ facts: { district: 'क'.repeat(6000) } })
    expect(tooLong.length).toBeLessThan(16 * 1024)
    const response = await POST(request(tooLong))
    expect(response.status).toBe(413)
    expect(load).not.toHaveBeenCalled()
  })

  it('refuses by the declared size before reading the body', async () => {
    const declared = new Request('https://app.udyamveda.in/api/results', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': '20000' },
      body: '{}',
    })
    const response = await POST(declared)
    expect(response.status).toBe(413)
    expect(load).not.toHaveBeenCalled()
  })

  it('ignores identity numbers and never echoes them back', async () => {
    const response = await POST(request(JSON.stringify({ facts: { state: 'bihar', pan_number: 'ABCDE1234F', aadhaar: '123412341234' } })))
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).not.toContain('ABCDE1234F')
    expect(text).not.toContain('123412341234')
  })

  it('treats a body with no facts as no answers', async () => {
    const response = await POST(request('{}'))
    expect(response.status).toBe(200)
    expect((await response.json()).counts.D).toBe(0)
  })

  it('treats a JSON value that is not an object as no answers', async () => {
    const response = await POST(request('null'))
    expect(response.status).toBe(200)
  })
})
