import OpenAI from 'openai'
import { aiModelConfig, OPENAI_MODEL } from '@/lib/ai/config'
import type { ExtractedOpportunityDraft } from '@/lib/opportunities/validation'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function extractOpportunityDrafts(markdown: string, sourceUrl: string): Promise<ExtractedOpportunityDraft[]> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not configured')

  const prompt = [
    'Extract business-relevant Indian Government opportunities from the official source below.',
    'Return ONLY valid JSON in this shape: {"records":[{...}]}. If the source does not contain a distinct opportunity, return {"records":[]}.',
    'Never invent facts. Use null or [] when the source does not state something. Preserve exact monetary amounts, thresholds, dates, exclusions, prerequisites, and conditions.',
    'Each record must include: name, opportunity_type, objective, legal_basis, authority, eligibility, benefit_summary, benefits, application, requirements, steps, sources, effective_dates, geography.',
    'Represent effective_dates as an object or array of window records using window_type (rolling, annual, fixed, call_for_applications, or closed), optional opens_at/closes_at, window_label, and window_evidence.',
    'Every source entry must include the exact URL "' + sourceUrl + '" and a precise page, section, paragraph, or heading anchor when available.',
    '',
    'OFFICIAL SOURCE URL: ' + sourceUrl,
    '',
    'SOURCE CONTENT:',
    markdown.slice(0, 60000),
  ].join('\\n')

  const completion = await getOpenAI().chat.completions.create({
    ...aiModelConfig(),
    messages: [
      { role: 'system', content: 'You extract structured Government opportunity records. Respond with JSON only and do not infer unstated eligibility or benefits.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })
  const content = completion.choices[0]?.message.content
  if (!content) throw new Error('OpenAI extraction returned no JSON content')

  let parsed: { records?: ExtractedOpportunityDraft[] }
  try {
    parsed = JSON.parse(content) as { records?: ExtractedOpportunityDraft[] }
  } catch {
    throw new Error('OpenAI extraction returned invalid JSON')
  }
  if (!Array.isArray(parsed.records)) throw new Error('OpenAI extraction omitted the records array')

  for (const [index, record] of parsed.records.entries()) {
    const sources = Array.isArray(record.sources) ? record.sources as Array<Record<string, unknown>> : []
    if (!sources.length) throw new Error(`Extracted record ${index + 1} has no source evidence`)
    if (!sources.some(source => source.url === sourceUrl)) {
      throw new Error(`Extracted record ${index + 1} does not cite the crawled source URL exactly`)
    }
    if (sources.some(source => typeof source.url !== 'string' || !/^https:\/\//i.test(source.url))) {
      throw new Error(`Extracted record ${index + 1} contains a non-HTTPS source URL`)
    }
  }

  return parsed.records
}

export function extractionModel() {
  return OPENAI_MODEL
}
