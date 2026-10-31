import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { POST } from '@/app/api/admin/catalog/mark-checked/route'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('@/lib/catalog/reviewer', () => ({ getCatalogReviewer: vi.fn() }))

const rpc = vi.fn()
const reviewer = vi.mocked(getCatalogReviewer)
const post = (body: unknown) => POST(new NextRequest('https://app.udyamveda.in/api/admin/catalog/mark-checked', { method: 'POST', body: JSON.stringify(body) }))

describe('POST /api/admin/catalog/mark-checked', () => {
  beforeEach(() => {
    rpc.mockReset()
    vi.mocked(revalidateTag).mockReset()
    reviewer.mockResolvedValue({ user: { id: 'u' }, reviewer: { user_id: 'u' }, supabase: { rpc } } as never)
  })

  it('refuses someone who is not signed in', async () => {
    reviewer.mockResolvedValue({ user: null, reviewer: null, supabase: { rpc } } as never)
    expect((await post({ slug: 'x' })).status).toBe(401)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('refuses someone who is not a reviewer', async () => {
    reviewer.mockResolvedValue({ user: { id: 'u' }, reviewer: null, supabase: { rpc } } as never)
    expect((await post({ slug: 'x' })).status).toBe(403)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('records the check and refreshes founder results straight away', async () => {
    rpc.mockResolvedValue({ data: '2026-10-31T10:00:00Z', error: null })
    const response = await post({ slug: 'cmegp-maharashtra', note: 'Portal still open' })
    expect(response.status).toBe(200)
    expect(rpc).toHaveBeenCalledWith('mark_opportunity_checked', { p_slug: 'cmegp-maharashtra', p_note: 'Portal still open' })
    expect(revalidateTag).toHaveBeenCalledWith('catalog', { expire: 0 })
    expect(await response.json()).toEqual({ checkedAt: '2026-10-31T10:00:00Z' })
  })

  it('needs a scheme', async () => {
    expect((await post({})).status).toBe(422)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('leaves the results alone when the check fails', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'Opportunity not found.', code: 'P0002' } })
    expect((await post({ slug: 'gone' })).status).toBe(422)
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
