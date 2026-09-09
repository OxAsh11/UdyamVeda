import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPlayById } from '@/lib/data/plays'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: plays } = await supabase
    .from('active_plays')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ plays: plays ?? [] })
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { template_id, name, context, start_date } = await req.json()
  if (!template_id || !name) return NextResponse.json({ error: 'template_id and name required' }, { status: 400 })

  const template = getPlayById(template_id)
  if (!template) return NextResponse.json({ error: 'Invalid template' }, { status: 400 })

  // Create the active play
  const { data: play, error } = await supabase
    .from('active_plays')
    .insert({
      user_id: user.id,
      template_id,
      name,
      context: context ?? {},
      start_date: start_date ?? new Date().toISOString().split('T')[0],
      status: 'active',
      target_metric: template.target_metric,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create content slots from template
  const slots = template.content_slots.map(slot => ({
    user_id: user.id,
    play_id: play.id,
    week_number: slot.week,
    channel: slot.channel,
    slot_type: slot.type,
    title: slot.title,
    content: '',
    status: 'draft',
  }))

  await supabase.from('play_content_slots').insert(slots)

  return NextResponse.json({ play })
}
