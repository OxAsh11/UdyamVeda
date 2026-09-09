import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id: play_id } = await params
  const { slot_id, ...updates } = await req.json()
  if (!slot_id) return NextResponse.json({ error: 'slot_id required' }, { status: 400 })

  const { data } = await supabase
    .from('play_content_slots')
    .update(updates)
    .eq('id', slot_id)
    .eq('play_id', play_id)
    .eq('user_id', user.id)
    .select()
    .single()

  return NextResponse.json({ slot: data })
}
