import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { aiModelConfig } from '@/lib/ai/config'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  let rawText = ''

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; UdyamVeda/1.0)' },
    })
    clearTimeout(timeout)

    const html = await response.text()

    // Strip HTML tags and collapse whitespace
    rawText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 4000)
  } catch {
    return NextResponse.json({ error: 'Could not fetch URL. Make sure it is publicly accessible.' }, { status: 422 })
  }

  if (!rawText || rawText.length < 50) {
    return NextResponse.json({ error: 'Could not read enough content from this URL.' }, { status: 422 })
  }

  const prompt = `You are analysing a business's website or social media page to extract brand information.

PAGE CONTENT:
${rawText}

Extract the following information from this content. If something is not clearly stated, make a reasonable inference or leave it blank. Return ONLY valid JSON:

{
  "what_you_sell": "Concise description of the product or service, including price range if visible",
  "target_customer": "Description of who they seem to be targeting",
  "differentiator": "What seems to make them different or special",
  "brand_voice": "How the brand communicates — tone and personality",
  "summary": "2–3 sentence brand summary a marketer would write"
}`

  try {
    const completion = await getOpenAI().chat.completions.create({
      ...aiModelConfig(),
      messages: [
        { role: 'system', content: 'You extract brand information from website content. Respond with JSON only.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })

    const extracted = JSON.parse(completion.choices[0].message.content ?? '{}')
    return NextResponse.json({ extracted })
  } catch {
    return NextResponse.json({ error: 'Could not analyse the page content.' }, { status: 500 })
  }
}
