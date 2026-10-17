import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Called daily by the Vercel cron in vercel.json. The single-row catalog
// read counts as database activity, which keeps a free-tier Supabase
// project from auto-pausing after a week without traffic.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('opportunities').select('id').limit(1)

  return NextResponse.json(
    { ok: !error, database: error ? 'unreachable' : 'ok', checkedAt: new Date().toISOString() },
    { status: error ? 503 : 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
