import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const [{ data: play }, { data: slots }] = await Promise.all([
    supabase.from('active_plays').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('play_content_slots').select('*').eq('play_id', id).eq('user_id', user.id).order('week_number').order('channel'),
  ])

  if (!play) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ play, slots: slots ?? [] })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const updates = await req.json()

  const { data } = await supabase
    .from('active_plays')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  return NextResponse.json({ play: data })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  await supabase.from('active_plays').delete().eq('id', id).eq('user_id', user.id)

  return NextResponse.json({ ok: true })
}
