import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('drawing_boards')
    .select('nodes, edges')
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ nodes: data?.nodes ?? [], edges: data?.edges ?? [] })
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  // Save existing board state
  if (body.action === 'save') {
    await supabase.from('drawing_boards').upsert({
      user_id: user.id,
      nodes: body.nodes,
      edges: body.edges,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    return NextResponse.json({ ok: true })
  }

  // Generate board from strategy
  if (body.action === 'generate') {
    const { strategy } = body

    const prompt = `
You are a visual GTM strategist. Based on the GTM strategy below, generate a React Flow canvas layout.

STRATEGY SUMMARY:
- ICP: ${strategy.icp?.profile}
- Value Prop: ${strategy.positioning?.valueProposition}
- Top channels: ${strategy.channels?.map((c: { name: string }) => c.name).join(', ')}
- Quick wins: ${strategy.quickWins?.join(', ')}
- 90-day focus month 1: ${strategy.ninetyDayPlan?.days1to30}

Create a clear, well-spaced flow diagram. Return ONLY valid JSON, no markdown.

Node types available: "root" | "icp" | "channel" | "tactic" | "content" | "goal"

Return this exact structure:
{
  "nodes": [
    {
      "id": "string",
      "type": "root|icp|channel|tactic|content|goal",
      "position": { "x": number, "y": number },
      "data": { "label": "short label", "subtitle": "one line description" }
    }
  ],
  "edges": [
    {
      "id": "string",
      "source": "node-id",
      "target": "node-id",
      "label": "optional short label"
    }
  ]
}

Layout rules:
- Root node at x:500, y:40
- ICP node at x:500, y:160
- Channel nodes spread horizontally at y:320 (x: 150, 500, 850 for 3 channels)
- Each channel gets 2 tactic nodes below it at y:460 and y:560
- Add a goal node at the bottom center (x:500, y:680)
- Keep x spacing generous (min 300px between channel siblings)
- Total of ~12-15 nodes maximum
`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a visual GTM strategist. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })
    const board = JSON.parse(completion.choices[0].message.content ?? '{}')

    await supabase.from('drawing_boards').upsert({
      user_id: user.id,
      nodes: board.nodes,
      edges: board.edges,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.json(board)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
