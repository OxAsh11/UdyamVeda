import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import SchemeActions, { removeScheme, saveScheme, startApplication } from '../SchemeActions'

const props = { slug: 'a-scheme', applicationId: null, saved: false, canSave: true, canStart: true }
const render = (overrides: Partial<Parameters<typeof SchemeActions>[0]> = {}) =>
  renderToStaticMarkup(createElement(SchemeActions, { ...props, ...overrides }))

describe('SchemeActions, as it first shows', () => {
  it('offers to start the checklist and to save, for a scheme the founder has not touched', () => {
    const html = render()
    expect(html).toContain('Start my application checklist')
    expect(html).toContain('Save for later')
    expect(html).not.toContain('Open my application')
    expect(html).not.toContain('Remove')
  })

  it('offers the existing application instead of starting a second, and no longer asks to save', () => {
    const html = render({ applicationId: 'app-1', saved: true })
    expect(html).toContain('href="/dashboard/applications/app-1"')
    expect(html).toContain('Open my application')
    expect(html).not.toContain('Start my application checklist')
    expect(html).not.toContain('Save for later')
    expect(html).not.toContain('Remove')
  })

  it('shows a saved scheme as saved, with a way to take it back, and still offers the checklist', () => {
    const html = render({ saved: true })
    expect(html).toContain('Saved for later')
    expect(html).toContain('Remove')
    expect(html).toContain('Start my application checklist')
    expect(html).not.toContain('>Save for later<')
  })

  it('leaves out what the scheme cannot do, and draws nothing when it can do neither', () => {
    expect(render({ canStart: false })).not.toContain('Start my application checklist')
    expect(render({ canStart: false })).toContain('Save for later')
    expect(render({ canSave: false })).not.toContain('Save for later')
    expect(render({ canSave: false })).toContain('Start my application checklist')
    expect(render({ canSave: false, canStart: false })).toBe('')
    // An application already started stays reachable, even for a scheme that can no longer be started.
    expect(render({ canSave: false, canStart: false, applicationId: 'app-1' })).toContain('Open my application')
  })

  it('makes every control at least 44px tall', () => {
    const html = render({ saved: true })
    const controls = html.match(/<(button|a)\b[^>]*>/g) ?? []
    expect(controls.length).toBeGreaterThanOrEqual(2)
    for (const control of controls) expect(control).toContain('min-h-11')
  })
})

type Call = { url: string; init?: RequestInit }
function fakeFetch(respond: () => Response | Promise<Response>) {
  const calls: Call[] = []
  const send = async (url: string, init?: RequestInit) => {
    calls.push({ url, init })
    return respond()
  }
  return { send, calls }
}
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('SchemeActions, the calls it makes', () => {
  it('saves a scheme by its slug', async () => {
    const { send, calls } = fakeFetch(() => json({ data: {} }, 201))
    expect(await saveScheme('a scheme/1', send)).toBe(true)
    expect(calls[0].url).toBe('/api/saved-opportunities')
    expect(calls[0].init).toMatchObject({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({ opportunityId: 'a scheme/1' })
  })

  it('takes a saved scheme back, with the slug made safe for an address', async () => {
    const { send, calls } = fakeFetch(() => json({ ok: true }))
    expect(await removeScheme('a scheme/1', send)).toBe(true)
    expect(calls[0].url).toBe('/api/saved-opportunities?opportunityId=a%20scheme%2F1')
    expect(calls[0].init).toMatchObject({ method: 'DELETE' })
  })

  it('starts an application in one step, without saving first, and gives back its id', async () => {
    const { send, calls } = fakeFetch(() => json({ data: { id: 'app-9' } }, 201))
    expect(await startApplication('a-scheme', send)).toBe('app-9')
    // Starting records the scheme as started by itself, so it is the only call made.
    expect(calls).toHaveLength(1)
    expect(calls[0].url).toBe('/api/applications')
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({ opportunityId: 'a-scheme' })
  })

  it('treats an application that already exists as started, and opens it', async () => {
    const { send } = fakeFetch(() => json({ data: { id: 'app-1' }, existing: true }))
    expect(await startApplication('a-scheme', send)).toBe('app-1')
  })

  it('reports a failure as a failure: a refusal, a reply with no application, or no connection', async () => {
    const refused = fakeFetch(() => json({ error: 'Authentication required' }, 401))
    expect(await saveScheme('a-scheme', refused.send)).toBe(false)
    expect(await removeScheme('a-scheme', refused.send)).toBe(false)
    expect(await startApplication('a-scheme', refused.send)).toBeNull()

    const empty = fakeFetch(() => json({ data: {} }, 201))
    expect(await startApplication('a-scheme', empty.send)).toBeNull()
    const notJson = fakeFetch(() => new Response('<html>', { status: 200 }))
    expect(await startApplication('a-scheme', notJson.send)).toBeNull()

    const down = fakeFetch(() => { throw new Error('offline') })
    expect(await saveScheme('a-scheme', down.send)).toBe(false)
    expect(await removeScheme('a-scheme', down.send)).toBe(false)
    expect(await startApplication('a-scheme', down.send)).toBeNull()
  })
})

describe('SchemeActions, the saved chip', () => {
  it('is neutral: green means go, and a saved scheme may be one that is not for the founder', () => {
    const html = render({ saved: true })
    expect(html).toContain('Saved for later')
    expect(html).not.toContain('go-soft')
    expect(html).not.toContain('go-ink')
    expect(html).toContain('bg-wait-soft')
  })
})
