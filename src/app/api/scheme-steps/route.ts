import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const schemeId = req.nextUrl.searchParams.get('scheme_id')

  const query = supabase
    .from('scheme_progress')
    .select('scheme_id, step_index, completed')
    .eq('user_id', user.id)

  if (schemeId) query.eq('scheme_id', schemeId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Map: { scheme_id: { step_index: completed } }
  const progress: Record<string, Record<number, boolean>> = {}
  for (const row of data ?? []) {
    if (!progress[row.scheme_id]) progress[row.scheme_id] = {}
    progress[row.scheme_id][row.step_index] = row.completed
  }

  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { scheme_id, step_index, completed } = await req.json()
  if (!scheme_id || step_index === undefined) {
    return NextResponse.json({ error: 'scheme_id and step_index required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('scheme_progress')
    .upsert({
      user_id: user.id,
      scheme_id,
      step_index,
      completed: !!completed,
      completed_at: completed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,scheme_id,step_index' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ row: data })
}
