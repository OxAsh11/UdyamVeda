import { NextResponse } from 'next/server'
import { searchActivities } from '@/lib/start/activity-search'
import { loadStartBundle } from '@/lib/start/load-bundle'

const MAX_QUERY_LENGTH = 80

export async function GET(request: Request) {
  const bundle = await loadStartBundle()
  if (!bundle) return NextResponse.json({ error: 'unavailable' }, { status: 503 })

  const query = (new URL(request.url).searchParams.get('q') ?? '').slice(0, MAX_QUERY_LENGTH)
  const items = searchActivities(query, bundle.activities).map(({ id, label, icon, packIds }) => ({ id, label, icon, packIds }))
  return NextResponse.json({ items })
}
