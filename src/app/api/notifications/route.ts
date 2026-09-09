import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { data, error } = await supabase
    .from('notifications')
    .select('id, business_id, type, title, body, href, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json({ error: 'Unable to load notifications.', detail: error.message }, { status: 500 })
  return NextResponse.json({ data: data ?? [], unreadCount: (data ?? []).filter(item => !item.read_at).length })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const body = await request.json().catch(() => ({})) as { notificationId?: unknown; markAllRead?: unknown }
  if (body.markAllRead === true) {
    const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('user_id', user.id).is('read_at', null)
    if (error) return NextResponse.json({ error: 'Unable to mark notifications as read.', detail: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (typeof body.notificationId !== 'string') return NextResponse.json({ error: 'notificationId is required.' }, { status: 400 })
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', body.notificationId).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Unable to mark the notification as read.', detail: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
