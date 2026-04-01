import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.id)
    .order('week_number', { ascending: true })

  return NextResponse.json({ campaigns: data ?? [] })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Load strategy
  const { data: stratRow } = await supabase
    .from('gtm_strategies')
    .select('strategy, context')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!stratRow) return NextResponse.json({ error: 'No strategy found. Generate your GTM strategy first.' }, { status: 400 })

  const { strategy, context } = stratRow

  const prompt = `
You are a campaign planning expert. Based on the GTM strategy below, create a 90-day campaign plan.

BUSINESS: ${context?.product}
TARGET: ${context?.targetCustomer}
BUDGET: ${context?.budget}
CHANNELS: ${strategy?.channels?.map((c: {name: string}) => c.name).join(', ')}
90-DAY PLAN:
- Month 1: ${strategy?.ninetyDayPlan?.days1to30}
- Month 2: ${strategy?.ninetyDayPlan?.days31to60}
- Month 3: ${strategy?.ninetyDayPlan?.days61to90}

Create exactly 9 campaigns (3 per month, across different channels). Return ONLY valid JSON, no markdown:

{
  "campaigns": [
    {
      "name": "Campaign name",
      "channel": "Instagram|WhatsApp|Email",
      "goal": "What this campaign achieves",
      "week_number": 1,
      "brief": "2-3 sentence campaign brief with clear objective and approach",
      "content_draft": "Ready-to-use content. For Instagram: caption with hashtags. For WhatsApp: broadcast message. For Email: subject line + body (keep under 100 words)."
    }
  ]
}

Distribute across months: weeks 1-4 (month 1), weeks 5-8 (month 2), weeks 9-12 (month 3).
Make content drafts specific, actionable, and India-market appropriate.
`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned)

  // Delete old campaigns and insert new
  await supabase.from('campaigns').delete().eq('user_id', user.id)

  const toInsert = parsed.campaigns.map((c: Record<string, unknown>) => ({ ...c, user_id: user.id }))
  const { data: inserted } = await supabase.from('campaigns').insert(toInsert).select()

  return NextResponse.json({ campaigns: inserted })
}

export async function PATCH(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...updates } = await req.json()
  const { data } = await supabase.from('campaigns').update(updates).eq('id', id).eq('user_id', user.id).select().single()
  return NextResponse.json({ campaign: data })
}
