import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('metrics')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ metrics: data ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data } = await supabase
    .from('metrics')
    .insert({ ...body, user_id: user.id })
    .select()
    .single()

  return NextResponse.json({ metric: data })
}
