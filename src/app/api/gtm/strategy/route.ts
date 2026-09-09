import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { aiModelConfig } from '@/lib/ai/config'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const context = await req.json()

    // Fetch brand intelligence for richer context
    const { data: brand } = await supabase
      .from('brand_intelligence')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const brandSection = brand ? `
BRAND INTELLIGENCE (from brand profile — use this to make the strategy highly specific):
- What they sell: ${brand.what_you_sell ?? ''}
- Ideal customer: ${brand.target_customer ?? ''}
- Customer location: ${brand.customer_location ?? ''}
- Differentiator: ${brand.differentiator ?? ''}
- Brand voice / personality: ${Array.isArray(brand.brand_voice) ? brand.brand_voice.join(', ') : ''}
- Active channels: ${Array.isArray(brand.channels) ? brand.channels.join(', ') : ''}
- What has worked: ${brand.what_works ?? ''}
- Additional context: ${brand.additional_context ?? ''}
` : ''

    const prompt = `
You are a senior product marketing strategist with deep expertise in the Indian market.
A founder has shared their business context below. Generate a comprehensive, actionable GTM strategy.
${brandSection}
FORM CONTEXT:
- What they sell (form): ${context.product}
- Target customer (form): ${context.targetCustomer}
- Business sector: ${context.sector}
- Geography: ${context.geography}
- Monthly marketing budget: ${context.budget}
- Business stage: ${context.stage}
- Biggest challenge: ${context.challenge}
- State: ${context.state}

NOTE: Where brand intelligence and form context differ, trust the brand intelligence — it is more specific and detailed.

Return ONLY a valid JSON object (no markdown, no explanation) with this exact structure:
{
  "icp": {
    "profile": "2-3 sentence description of the ideal customer",
    "demographics": "age, location, income, occupation",
    "psychographics": "mindset, values, aspirations",
    "painPoints": ["pain point 1", "pain point 2", "pain point 3"],
    "whereToFindThem": ["platform/place 1", "platform/place 2", "platform/place 3"]
  },
  "positioning": {
    "valueProposition": "One clear sentence: For [ICP], [product] is the [category] that [key benefit] unlike [alternative].",
    "messagingPillars": ["pillar 1", "pillar 2", "pillar 3"],
    "toneOfVoice": "Description of brand voice"
  },
  "channels": [
    {
      "name": "channel name",
      "priority": "primary",
      "reasoning": "why this channel for this business",
      "tactics": ["tactic 1", "tactic 2"],
      "estimatedCAC": "₹X–Y",
      "timeToResults": "X weeks/months",
      "effort": "low|medium|high"
    }
  ],
  "caseStudies": [
    {
      "brand": "real Indian brand name",
      "sector": "their sector",
      "strategy": "what they did specifically",
      "result": "measurable outcome",
      "lessonForYou": "how to apply this to the founder's business"
    }
  ],
  "benchmarks": {
    "avgCAC": "₹X–Y (India median for this category)",
    "conversionRate": "X–Y%",
    "ltv": "₹X–Y estimate",
    "bestChannel": "highest ROI channel for this category",
    "contentFrequency": "how often to post/publish"
  },
  "ninetyDayPlan": {
    "days1to30": "What to focus on in month 1",
    "days31to60": "What to focus on in month 2",
    "days61to90": "What to focus on in month 3"
  },
  "quickWins": ["actionable thing to do this week 1", "actionable thing to do this week 2", "actionable thing to do this week 3"]
}

Be specific to India, practical, and grounded in real data. Use Indian brands as case studies where possible.
Channels should be ranked by priority (primary, secondary, tertiary).
Include exactly 3 channels and 2 case studies.
`

    const completion = await getOpenAI().chat.completions.create({
      ...aiModelConfig(),
      messages: [
        { role: 'system', content: 'You are a senior product marketing strategist. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })
    const strategy = JSON.parse(completion.choices[0].message.content ?? '{}')

    // Save to Supabase
    await supabase.from('gtm_strategies').insert({
      user_id: user.id,
      context,
      strategy,
    })

    return NextResponse.json({ strategy })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Strategy generation error:', message)
    return NextResponse.json({ error: 'Failed to generate strategy', detail: message }, { status: 500 })
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('gtm_strategies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ strategy: data?.strategy ?? null, context: data?.context ?? null })
}
