import { describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from '@/app/auth/callback/route'

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession: async () => ({ error: null }) } }),
}))

const landing = async (next: string) => {
  const response = await GET(new NextRequest(`https://app.udyamveda.in/auth/callback?code=abc&next=${encodeURIComponent(next)}`))
  return response.headers.get('location')
}

describe('the email confirmation link', () => {
  it('continues to a page inside the app', async () => {
    expect(await landing('/start/results')).toBe('https://app.udyamveda.in/start/results')
  })

  it.each([
    ['another website', 'https://evil.example/'],
    ['a protocol-relative address', '//evil.example'],
    ['a backslash trick', '/\\evil.example'],
    ['a hidden tab', '/\t/evil.example'],
    ['a hidden newline', '/\n/evil.example'],
  ])('never leaves the app for %s', async (_name, next) => {
    expect(await landing(next)).toBe('https://app.udyamveda.in/dashboard')
  })
})
