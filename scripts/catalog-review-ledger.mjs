import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedDir = path.join(root, 'supabase', 'seed')
const migrationDir = path.join(root, 'supabase', 'migrations')
const outputPath = path.join(root, 'docs', 'catalog-review-ledger.json')

const normalizeUrl = value => String(value ?? '').replace(/[.;]+$/, '').replace(/\/$/, '')

function parseRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  if (!payloadMatch) return []
  try {
    return JSON.parse(payloadMatch[1])
  } catch (error) {
    throw new Error(`catalog review ledger failed: ${file} contains invalid structured JSON: ${error.message}`)
  }
}

function hasItems(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value && typeof value === 'object' && Object.keys(value).length > 0)
}

function editorialFieldsComplete(record) {
  return Boolean(
    record.slug &&
    record.name &&
    record.authority &&
    record.type &&
    record.source_url &&
    record.source_anchor &&
    record.eligibility &&
    record.eligibility.entity_types &&
    hasItems(record.eligibility.entity_types) &&
    (hasItems(record.eligibility.conditions) || hasItems(record.eligibility.thresholds)) &&
    record.rules?.unknown_handling &&
    record.benefit_summary &&
    record.benefit_type &&
    record.benefit_label &&
    (record.benefit_summary.separate_value_buckets === true || hasItems(record.benefit_summary.types)) &&
    record.application?.portal &&
    record.application?.route &&
    record.requirement &&
    record.requirement_description &&
    Array.isArray(record.steps) &&
    record.steps.length > 0 &&
    record.window_type &&
    record.window_label &&
    record.window_evidence?.source_url &&
    record.window_evidence?.anchor &&
    record.fine_print?.review_note
  )
}

function urlsIn(text) {
  return [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g),
  ].map(match => normalizeUrl(match.groups.url)).filter(Boolean)
}

const seedFiles = fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort()
const registryFiles = [
  ...fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort().map(file => path.join(migrationDir, file)),
  ...seedFiles.map(file => path.join(seedDir, file)),
]
const registeredSourceUrls = new Set()
for (const file of registryFiles) {
  const text = fs.readFileSync(file, 'utf8')
  for (const block of text.matchAll(/insert\s+into\s+public\.source_registry[\s\S]*?on\s+conflict/gi)) {
    for (const url of urlsIn(block[0])) registeredSourceUrls.add(url)
  }
}

const records = []
for (const file of seedFiles) {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  if (!sql.toLowerCase().includes('insert into public.opportunities')) continue
  for (const record of parseRecords(sql, file)) {
    const sourceRegistered = registeredSourceUrls.has(normalizeUrl(record.source_url))
    const complete = editorialFieldsComplete(record)
    if (!sourceRegistered) throw new Error(`catalog review ledger failed: primary source is not registered for ${record.slug}`)
    records.push({
      slug: record.slug,
      name: record.name,
      seedFile: file,
      localStatus: 'in_review',
      publicationStatus: 'blocked',
      source: {
        url: record.source_url,
        anchor: record.source_anchor,
        registered: sourceRegistered,
      },
      editorial: {
        structured: true,
        requiredFieldsComplete: complete,
      },
      blockers: [
        'live_official_source_snapshot_required',
        'human_source_and_factual_review_required',
        'reviewer_approval_required_before_publication',
      ],
      nextAction: 'capture_current_official_snapshot_then_complete_reviewer_dossier',
    })
  }
}

const incomplete = records.filter(record => !record.editorial.requiredFieldsComplete)
if (incomplete.length) throw new Error(`catalog review ledger failed: ${incomplete.length} records have incomplete editorial fields`)

const ledger = {
  generatedAt: new Date().toISOString(),
  status: 'local_review_queue',
  interpretation: 'This ledger records work required before publication. It is not evidence that a Government opportunity is approved, active, or eligible for a specific business.',
  summary: {
    totalRecords: records.length,
    structuredRecords: records.filter(record => record.editorial.structured).length,
    editorialFieldsComplete: records.filter(record => record.editorial.requiredFieldsComplete).length,
    sourceRegistered: records.filter(record => record.source.registered).length,
    humanReviewPending: records.filter(record => record.blockers.includes('human_source_and_factual_review_required')).length,
    publicationReady: 0,
  },
  records,
}

if (process.argv.includes('--write')) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, `${JSON.stringify(ledger, null, 2)}\n`)
  console.log(`catalog review ledger written: ${path.relative(root, outputPath)}`)
}

console.log(JSON.stringify(ledger.summary, null, 2))
console.log(`catalog review ledger passed: ${records.length} records remain explicitly blocked pending live evidence and human approval`)
