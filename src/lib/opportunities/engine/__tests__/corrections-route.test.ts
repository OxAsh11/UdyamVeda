import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { POST } from '@/app/api/admin/catalog/corrections/route'
import { getCatalogReviewer } from '@/lib/catalog/reviewer'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn(), revalidateTag: vi.fn() }))
vi.mock('@/lib/catalog/reviewer', () => ({ getCatalogReviewer: vi.fn() }))

const rpc = vi.fn()
const request = () => new NextRequest('https://app.udyamveda.in/api/admin/catalog/corrections', {
  method: 'POST',
  body: JSON.stringify({ slug: 'cmegp-maharashtra', changes: { status: 'closed' }, reason: 'Window closed' }),
})

describe('publishing a correction', () => {
  beforeEach(() => {
    vi.mocked(revalidateTag).mockReset()
    rpc.mockReset()
    vi.mocked(getCatalogReviewer).mockResolvedValue({ user: { id: 'u' }, reviewer: { user_id: 'u' }, supabase: { rpc } } as never)
  })

  it('refreshes the founder results straight away, so a closed scheme stops showing as open', async () => {
    rpc.mockResolvedValue({ data: { version_id: 'v' }, error: null })
    const response = await POST(request())
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledWith('catalog', { expire: 0 })
  })

  it('leaves the results alone when the correction fails', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'Nope', code: '22023' } })
    await POST(request())
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
