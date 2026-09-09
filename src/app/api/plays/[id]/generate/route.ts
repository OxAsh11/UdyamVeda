import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getPlayById } from '@/lib/data/plays'
import { aiModelConfig } from '@/lib/ai/config'
import { getBusinessFacts, getBusinessForUser } from '@/lib/businesses/dal'
import { profileFromBusinessFacts } from '@/lib/businesses/profile'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const CHANNEL_INSTRUCTIONS: Record<string, string> = {
  'Instagram Post': `Write an Instagram caption. Include:
- A strong opening hook (first line must stop the scroll)
- 2-3 short paragraphs, conversational tone
- A clear CTA (comment, DM, link in bio)
- 5-8 relevant hashtags at the end
Length: 100-200 words total.`,

  'Instagram Story': `Write Instagram Story slide text. Format as 3 slides:
SLIDE 1: Hook / question (max 8 words)
SLIDE 2: Key message or value (max 15 words)
SLIDE 3: CTA (max 8 words — e.g. "Swipe up", "DM us", "Tap link")
Keep it punchy. Stories are read in 2 seconds.`,

  'Instagram Reel': `Write a Reel script. Format:
HOOK (0-3 sec): [Opening line that makes people stop scrolling]
BODY (3-30 sec): [3-4 bullet points or talking points]
CTA (last 5 sec): [What to do next — follow, comment, DM]
Keep it punchy and energetic. Reels should feel native, not scripted.`,

  'WhatsApp Broadcast': `Write a WhatsApp broadcast message. Rules:
- Conversational, like a friend texting
- No hashtags (this is WhatsApp)
- Start with the person's name placeholder or a warm opener
- Include a single clear CTA with a link placeholder
- 50-80 words max
- Use line breaks for readability`,

  'Email': `Write a marketing email. Format exactly as:
SUBJECT: [Subject line, max 50 characters, curiosity-driven]

[Body — 2-3 short paragraphs, 100-150 words total]

[CTA button text]

Keep it scannable. Use short paragraphs. One focus, one CTA.`,
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: play_id } = await params
    const { slot_id } = await req.json()
    if (!slot_id) return NextResponse.json({ error: 'slot_id required' }, { status: 400 })

    // Fetch all context in parallel
    const [
      { data: play },
      { data: slot },
      { data: stratRow },
      { data: brand },
    ] = await Promise.all([
      supabase.from('active_plays').select('*').eq('id', play_id).eq('user_id', user.id).single(),
      supabase.from('play_content_slots').select('*').eq('id', slot_id).eq('play_id', play_id).single(),
      supabase.from('gtm_strategies').select('strategy, context').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single(),
      supabase.from('brand_intelligence').select('*').eq('user_id', user.id).single(),
    ])

    const { business } = await getBusinessForUser(supabase, user.id)
    const { data: businessFacts } = business ? await getBusinessFacts(supabase, business.id) : { data: [] }
    const businessProfile = business ? profileFromBusinessFacts(business, businessFacts ?? []) : {}

    if (!play || !slot) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const template = getPlayById(play.template_id)
    const templateSlot = template?.content_slots.find(
      s => s.week === slot.week_number && s.channel === slot.channel && s.title === slot.title
    )

    const strategy = stratRow?.strategy
    const context = stratRow?.context

    const slotKey = `${slot.channel} ${slot.slot_type}`
    const channelInstruction = CHANNEL_INSTRUCTIONS[slotKey] ?? CHANNEL_INSTRUCTIONS[`${slot.channel} Post`] ?? `Write ${slot.channel} content for this slot.`

    const prompt = `You are a content marketing expert for Indian small businesses. Generate ready-to-publish content for the following.

BUSINESS:
- Product/service: ${brand?.what_you_sell ?? context?.product ?? businessProfile.business_name ?? 'their business'}
- Ideal customer: ${brand?.target_customer ?? context?.targetCustomer ?? 'their customer'}
- Differentiator: ${brand?.differentiator ?? ''}
- Brand voice / personality: ${Array.isArray(brand?.brand_voice) ? brand.brand_voice.join(', ') : (strategy?.positioning?.toneOfVoice ?? '')}
- Sector: ${businessProfile.sector ?? ''}
- Location: ${brand?.customer_location ?? businessProfile.state ?? 'India'}
${strategy?.positioning ? `- Value proposition: ${strategy.positioning.valueProposition}` : ''}
${brand?.what_works ? `- What has worked before: ${brand.what_works}` : ''}
${brand?.additional_context ? `- Additional brand context: ${brand.additional_context}` : ''}

PLAY: "${play.name}"
- Play objective: ${template?.objective ?? ''}
- Context: ${Object.entries(play.context ?? {}).map(([k, v]) => `${k}: ${v}`).join(', ')}

THIS CONTENT SLOT:
- Week ${slot.week_number} of ${template?.duration_weeks ?? '?'} week play
- Channel: ${slot.channel}
- Type: ${slot.slot_type}
- Title: ${slot.title}
- Purpose: ${templateSlot?.description ?? slot.title}

${channelInstruction}

Return ONLY the content text. No preamble, no explanation. Write it as if it's ready to be copied and posted.`

    const completion = await getOpenAI().chat.completions.create({
      ...aiModelConfig(),
      messages: [
        { role: 'system', content: 'You are a content marketing expert for Indian small businesses. Write ready-to-publish content only — no preamble, no explanation.' },
        { role: 'user', content: prompt },
      ],
    })
    const content = completion.choices[0].message.content?.trim() ?? ''

    // Save the generated content
    const { data: updated } = await supabase
      .from('play_content_slots')
      .update({ content, status: 'ready' })
      .eq('id', slot_id)
      .eq('user_id', user.id)
      .select()
      .single()

    return NextResponse.json({ slot: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Content generation error:', message)
    return NextResponse.json({ error: 'Failed to generate content', detail: message }, { status: 500 })
  }
}
