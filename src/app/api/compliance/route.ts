import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('compliance_progress')
    .select('item_id, completed, notes, completed_at')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return as a map for O(1) lookup on the client
  const progress: Record<string, { completed: boolean; notes?: string; completed_at?: string }> = {}
  for (const row of data ?? []) {
    progress[row.item_id] = { completed: row.completed, notes: row.notes, completed_at: row.completed_at }
  }

  return NextResponse.json({ progress })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { item_id, completed, notes } = await req.json()
  if (!item_id) return NextResponse.json({ error: 'item_id required' }, { status: 400 })

  const { data, error } = await supabase
    .from('compliance_progress')
    .upsert({
      user_id: user.id,
      item_id,
      completed: !!completed,
      notes: notes ?? null,
      completed_at: completed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,item_id' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ row: data })
}
