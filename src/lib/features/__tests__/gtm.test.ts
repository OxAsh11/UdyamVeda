import { describe, expect, it } from 'vitest'
import { isGtmToolPath } from '../gtm'

describe('isGtmToolPath', () => {
  it.each(['strategy', 'plays', 'calendar', 'track', 'campaigns', 'distribute', 'drawing-board', 'ideate'])('recognises /dashboard/%s and its sub-pages', tool => {
    expect(isGtmToolPath(`/dashboard/${tool}`)).toBe(true)
    expect(isGtmToolPath(`/dashboard/${tool}/anything`)).toBe(true)
  })

  it.each(['/dashboard', '/dashboard/schemes', '/dashboard/strategyx', '/dashboard/registration', '/start', '/strategy'])('leaves %s alone', path => {
    expect(isGtmToolPath(path)).toBe(false)
  })
})
