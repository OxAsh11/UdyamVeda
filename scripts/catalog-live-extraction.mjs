import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import OpenAI from 'openai'

const root = process.cwd()
const capturePath = path.join(root, 'docs', 'catalog-live-source-capture.json')
const outputPath = path.join(root, 'docs', 'catalog-live-extraction.json')

function readEnv(name) {
  if (process.env[name]) return process.env[name]
  const envPath = path.join(root, '.env.local')
  if (!fs.existsSync(envPath)) return null
  const line = fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find(value => new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*=`).test(value))
  return line?.split('=', 2)[1]?.trim().replace(/^['"]|['"]$/g, '') ?? null
}

function argumentValue(name, fallback) {
  const index = process.argv.indexOf(name)
  const value = index >= 0 ? Number(process.argv[index + 1]) : fallback
  return Number.isInteger(value) && value > 0 ? value : fallback
}

function nonNegativeArgumentValue(name, fallback) {
  const index = process.argv.indexOf(name)
  const value = index >= 0 ? Number(process.argv[index + 1]) : fallback
  return Number.isInteger(value) && value >= 0 ? value : fallback
}

function stableHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function normalizeEvidenceUrl(value) {
  if (typeof value !== 'string') return value
  const trimmed = value.trim()
  if (trimmed === 'https://') return trimmed
  return trimmed.replace(/\/+$/, '')
}

const apiKey = readEnv('OPENAI_API_KEY')
if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
const capture = JSON.parse(fs.readFileSync(capturePath, 'utf8'))
const existingOutput = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf8')) : null
const existingDraftsBySlug = new Map((existingOutput?.drafts ?? []).map(draft => [draft.slug, draft]))
const successful = capture.captures.filter(item => item.status === 'captured')
const requestedSlug = process.argv.includes('--slug') ? process.argv[process.argv.indexOf('--slug') + 1] : null
const limit = argumentValue('--limit', 1)
const offset = nonNegativeArgumentValue('--offset', 0)
const resumableSources = process.argv.includes('--refresh')
  ? successful
  : process.argv.includes('--resume')
  ? successful.filter(source => {
    const previous = existingDraftsBySlug.get(source.slug)
    return !previous || previous.sourceSnapshotHash !== source.contentHash
  })
  : successful
const selected = (requestedSlug ? resumableSources.filter(item => item.slug === requestedSlug) : resumableSources).slice(offset, offset + limit)
if (!selected.length) throw new Error('No captured source matches the requested extraction')

const client = new OpenAI({ apiKey })
const model = readEnv('OPENAI_MODEL') ?? 'gpt-5.6-luna'
const reasoningEffort = readEnv('OPENAI_REASONING_EFFORT') ?? 'high'
const drafts = []

function extractionSummary(items, requestedBatches) {
  return {
    requestedBatches,
    draftBatches: items.length,
    structuredRecords: items.reduce((total, draft) => total + (Array.isArray(draft.records) ? draft.records.length : 0), 0),
    failed: items.filter(draft => draft.error).length,
    publicationReady: 0,
  }
}

for (const source of selected) {
  const body = fs.readFileSync(path.join(root, source.snapshotPath), 'utf8')
  const prompt = [
    'Extract business-relevant Indian Government opportunities from the official source below.',
    'Return ONLY valid JSON in this shape: {"records":[{...}]}. If the source does not contain a distinct opportunity, return {"records":[]}.',
    'Never invent facts. Use null or [] when the source does not state something. Preserve exact monetary amounts, thresholds, dates, exclusions, prerequisites, and conditions.',
    'Each record must include: name, opportunity_type, objective, legal_basis, authority, eligibility, benefit_summary, benefits, application, fine_print, requirements, steps, sources, effective_dates, geography. Use null when the official source does not state a field, but preserve the field in the JSON.',
    'Represent effective_dates as an object or array of window records using window_type (rolling, annual, fixed, call_for_applications, or closed), optional opens_at/closes_at, window_label, and window_evidence.',
    `Every source entry must include the exact URL "${source.sourceUrl}" and a precise page, section, paragraph, or heading anchor when available.`,
    '',
    `OFFICIAL SOURCE URL: ${source.sourceUrl}`,
    `SOURCE ANCHOR TO CHECK: ${source.sourceAnchor}`,
    '',
    'SOURCE CONTENT:',
    body.slice(0, 60000),
  ].join('\n')

  try {
    const completion = await client.chat.completions.create({
      model,
      reasoning_effort: reasoningEffort,
      messages: [
        { role: 'system', content: 'You extract structured Government opportunity records. Respond with JSON only and do not infer unstated eligibility or benefits.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    })
    const content = completion.choices[0]?.message.content
    if (!content) throw new Error('OpenAI extraction returned no JSON content')
    const parsed = JSON.parse(content)
    if (!Array.isArray(parsed.records)) throw new Error('OpenAI extraction omitted the records array')
    const normalizedRecords = parsed.records.map(record => ({
      ...record,
      fine_print: record.fine_print ?? null,
      application: typeof record.application === 'string'
        ? { description: record.application }
        : record.application,
      steps: typeof record.steps === 'string'
        ? [{ description: record.steps }]
        : record.steps,
      sources: Array.isArray(record.sources)
        ? record.sources.map(item => {
          const normalizedUrl = normalizeEvidenceUrl(item?.url)
          return {
            ...item,
            url: normalizedUrl === normalizeEvidenceUrl(source.sourceUrl) ? source.sourceUrl : normalizedUrl,
            anchor: item?.anchor ?? item?.locator ?? null,
          }
        })
        : record.sources,
    }))
    for (const [index, record] of normalizedRecords.entries()) {
      const sources = Array.isArray(record.sources) ? record.sources : []
      const exactSource = sources.some(item => item?.url === source.sourceUrl)
      if (!exactSource) throw new Error(`Draft ${index + 1} does not cite the crawled source URL exactly`)
    }
    drafts.push({
      slug: source.slug,
      sourceUrl: source.sourceUrl,
      sourceSnapshotHash: source.contentHash,
      extractionModel: model,
      reasoningEffort,
      extractedAt: new Date().toISOString(),
      payloadHash: stableHash(normalizedRecords),
      status: 'needs_review',
      publicationStatus: 'blocked',
      validation: { exactSourceEvidence: true, humanReviewRequired: true },
      records: normalizedRecords,
    })
  } catch (error) {
    drafts.push({
      slug: source.slug,
      sourceUrl: source.sourceUrl,
      sourceSnapshotHash: source.contentHash,
      extractionModel: model,
      reasoningEffort,
      extractedAt: new Date().toISOString(),
      status: 'needs_review',
      publicationStatus: 'blocked',
      error: error instanceof Error ? error.message : 'Unknown extraction error',
    })
  }
}

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  status: 'local_extraction_queue',
  interpretation: 'AI output is a draft for human editorial review. Exact source evidence is required, and no extracted record is publishable automatically.',
  summary: extractionSummary(drafts, selected.length),
  drafts,
}

if (process.argv.includes('--write')) {
  const bySlug = new Map((process.argv.includes('--append') ? existingOutput?.drafts ?? [] : []).map(draft => [draft.slug, draft]))
  for (const draft of drafts) bySlug.set(draft.slug, draft)
  output.drafts = [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug))
  output.summary = extractionSummary(output.drafts, selected.length)
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
}

console.log(JSON.stringify(output.summary, null, 2))
if (output.summary.failed > 0) process.exitCode = 1
