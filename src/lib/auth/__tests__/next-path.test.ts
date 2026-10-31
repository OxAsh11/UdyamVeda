import { describe, expect, it } from 'vitest'
import { safeNextPath } from '../next-path'

describe('safeNextPath', () => {
  it('goes straight to the dashboard when nothing else was asked for, so the questions are never forced', () => {
    expect(safeNextPath(null)).toBe('/dashboard')
    expect(safeNextPath('')).toBe('/dashboard')
    expect(safeNextPath('https://evil.example')).toBe('/dashboard')
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
    ['a bare word', 'start'],
  ])('falls back on %s', (_name, value) => {
    expect(safeNextPath(value, '/dashboard')).toBe('/dashboard')
  })
})
