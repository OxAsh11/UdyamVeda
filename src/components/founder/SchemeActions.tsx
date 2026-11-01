'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { StatusChip } from '@/components/ui/founder'
import { ft } from '@/lib/founder/text'
import { cn } from '@/lib/utils'

type Send = (url: string, init?: RequestInit) => Promise<Response>

const JSON_HEADERS = { 'Content-Type': 'application/json' }
const SAVED_ROUTE = '/api/saved-opportunities'

// Both routes take the scheme's slug as well as its id.
const post = (url: string, slug: string): [string, RequestInit] => [url, { method: 'POST', headers: JSON_HEADERS, body: JSON.stringify({ opportunityId: slug }) }]

/** Saves a scheme for later. False when it could not be saved, whatever the reason. */
export async function saveScheme(slug: string, send: Send = fetch): Promise<boolean> {
  try {
    return (await send(...post(SAVED_ROUTE, slug))).ok
  } catch {
    return false
  }
}

/** Takes a scheme off the saved list. False when it could not be taken off. */
export async function removeScheme(slug: string, send: Send = fetch): Promise<boolean> {
  try {
    return (await send(`${SAVED_ROUTE}?opportunityId=${encodeURIComponent(slug)}`, { method: 'DELETE' })).ok
  } catch {
    return false
  }
}

/**
 * Starts the application checklist and gives back the application's id, or null when it could not
 * be started. The route marks the scheme as started itself, so nothing needs saving first, and it
 * hands back the application that is already there rather than making a second.
 */
export async function startApplication(slug: string, send: Send = fetch): Promise<string | null> {
  try {
    const response = await send(...post('/api/applications', slug))
    if (!response.ok) return null
    const payload = await response.json() as { data?: { id?: unknown } }
    return typeof payload.data?.id === 'string' ? payload.data.id : null
  } catch {
    return null
  }
}

const BUTTON = 'inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold disabled:opacity-60'
const FILLED = 'bg-act text-on-act'
const OUTLINED = 'border border-line text-ink'

type Props = {
  slug: string
  // The founder's application for this scheme, if they started one.
  applicationId: string | null
  saved: boolean
  canSave: boolean
  canStart: boolean
}

// Where focus goes after a click swaps the control that had it, so a keyboard user is not dropped.
type Focus = 'open' | 'remove' | 'save' | null

/** Save for later and Start my application checklist. The state changes in place after a click. */
export default function SchemeActions({ slug, applicationId: initialApplication, saved: initialSaved, canSave, canStart }: Props) {
  const [applicationId, setApplicationId] = useState(initialApplication)
  const [saved, setSaved] = useState(initialSaved)
  const [busy, setBusy] = useState(false)
  const [focus, setFocus] = useState<Focus>(null)
  const openLink = useRef<HTMLAnchorElement>(null)

  // React's autoFocus reaches buttons but not links, so the new link is given focus by hand.
  useEffect(() => {
    if (focus === 'open') openLink.current?.focus()
  }, [focus, applicationId])

  async function run<T>(work: Promise<T>, done: (result: NonNullable<T>) => void) {
    if (busy) return
    setBusy(true)
    const result = await work
    setBusy(false)
    if (result) done(result as NonNullable<T>)
    else toast.error(ft('actionFailed'))
  }

  const start = () => run(startApplication(slug), id => { setApplicationId(id); setFocus('open') })
  const save = () => run(saveScheme(slug), () => { setSaved(true); setFocus('remove') })
  const remove = () => run(removeScheme(slug), () => { setSaved(false); setFocus('save') })

  if (applicationId) {
    return (
      <Link ref={openLink} href={`/dashboard/applications/${applicationId}`} className={cn(BUTTON, FILLED)}>
        {ft('openApplication')}
      </Link>
    )
  }

  return (
    <>
      {canStart ? (
        <button type="button" onClick={start} disabled={busy} className={cn(BUTTON, FILLED)}>{ft('startCta')}</button>
      ) : null}
      {canSave && saved ? (
        <span className="inline-flex min-h-11 items-center gap-2">
          <StatusChip tone="wait" text={ft('savedTitle')} />
          <button type="button" onClick={remove} disabled={busy} autoFocus={focus === 'remove'} className={cn(BUTTON, OUTLINED)}>{ft('removeSaved')}</button>
        </span>
      ) : null}
      {canSave && !saved ? (
        <button type="button" onClick={save} disabled={busy} autoFocus={focus === 'save'} className={cn(BUTTON, OUTLINED)}>{ft('saveCta')}</button>
      ) : null}
    </>
  )
}
