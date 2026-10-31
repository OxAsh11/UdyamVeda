import { describe, expect, it } from 'vitest'
import { authLink, safeNextPath } from '../next-path'

describe('safeNextPath', () => {
  it('goes straight to the dashboard when nothing else was asked for, so the questions are never forced', () => {
    expect(safeNextPath(null)).toBe('/dashboard')
    expect(safeNextPath('')).toBe('/dashboard')
    expect(safeNextPath('https://evil.example')).toBe('/dashboard')
  })

  it('keeps the query and the anchor', () => {
    expect(safeNextPath('/start/results?x=1#top')).toBe('/start/results?x=1#top')
  })

  it('builds sign-in links that carry the page to return to', () => {
    expect(authLink('/login', '/start/results')).toBe('/login?next=%2Fstart%2Fresults')
    expect(authLink('/login', null)).toBe('/login')
    expect(authLink('/login', '//evil.example')).toBe('/login')
  })

  it('keeps a path inside the app', () => {
    expect(safeNextPath('/start/results', '/dashboard')).toBe('/start/results')
  })

  it.each([
    ['nothing', null],
    ['an empty value', ''],
    ['another website', 'https://evil.example'],
    ['a protocol-relative address', '//evil.example'],
    ['a backslash trick', '/\\evil.example'],
    ['a hidden tab', '/\t/evil.example'],
    ['a hidden newline', '/\n/evil.example'],
    ['a hidden tab, in another position', '\t//evil.example'],
    ['a scheme', 'javascript:alert(1)'],
    ['a bare word', 'start'],
  ])('falls back on %s', (_name, value) => {
    expect(safeNextPath(value, '/dashboard')).toBe('/dashboard')
  })
})
