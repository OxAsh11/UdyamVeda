import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const extractionPath = path.join(root, 'docs', 'catalog-live-extraction.json')
const extractionSource = fs.readFileSync(path.join(root, 'scripts', 'catalog-live-extraction.mjs'), 'utf8')

if (!extractionSource.includes("process.argv.includes('--resume')") || !extractionSource.includes("process.argv.includes('--refresh')") || !extractionSource.includes('previous.sourceSnapshotHash !== source.contentHash') || !extractionSource.includes('normalizeEvidenceUrl')) {
  throw new Error('catalog live extraction check failed: extraction must support deterministic resume of missing or changed snapshots')
}

if (!fs.existsSync(extractionPath)) {
  console.log('catalog live extraction check skipped: no extraction manifest exists yet')
  process.exit(0)
}

const extraction = JSON.parse(fs.readFileSync(extractionPath, 'utf8'))
const drafts = extraction.drafts ?? []
const errors = []
const requiredRecordKeys = [
  'name',
  'opportunity_type',
  'objective',
  'legal_basis',
  'authority',
  'eligibility',
  'benefit_summary',
  'benefits',
  'application',
  'fine_print',
  'requirements',
  'steps',
  'sources',
  'effective_dates',
  'geography',
]
for (const draft of drafts) {
  if (draft.status !== 'needs_review') errors.push(`${draft.slug}: status must remain needs_review`)
  if (draft.publicationStatus !== 'blocked') errors.push(`${draft.slug}: publicationStatus must remain blocked`)
  if (!draft.extractionModel || !draft.reasoningEffort) errors.push(`${draft.slug}: model and reasoning metadata are required`)
  if (draft.error) continue
  if (!Array.isArray(draft.records) || draft.records.length === 0) errors.push(`${draft.slug}: successful extraction has no records`)
  for (const [index, record] of (draft.records ?? []).entries()) {
    for (const key of requiredRecordKeys) {
      if (!Object.prototype.hasOwnProperty.call(record, key)) errors.push(`${draft.slug}[${index + 1}]: missing structured field ${key}`)
    }
    if (record.steps !== null && record.steps !== undefined && !Array.isArray(record.steps)) errors.push(`${draft.slug}[${index + 1}]: steps must be an array or null when the source does not state a procedure`)
    if (record.application !== null && record.application !== undefined && (typeof record.application !== 'object' || Array.isArray(record.application))) {
      errors.push(`${draft.slug}[${index + 1}]: application must be an object or null when the source does not state a procedure`)
    }
    const sources = Array.isArray(record.sources) ? record.sources : []
    if (!sources.some(source => source?.url === draft.sourceUrl)) {
      errors.push(`${draft.slug}[${index + 1}]: exact source URL evidence is missing`)
    }
    if (sources.some(source => !source?.url || !source?.anchor)) {
      errors.push(`${draft.slug}[${index + 1}]: every source needs a URL and evidence anchor`)
    }
  }
}

if (extraction.summary?.publicationReady !== 0) errors.push('extraction manifest reports publishable output')
if (!Number.isInteger(extraction.summary?.draftBatches) || extraction.summary.draftBatches !== drafts.length) errors.push('extraction manifest draftBatches does not match the merged draft queue')
const structuredRecordCount = drafts.reduce((total, draft) => total + (Array.isArray(draft.records) ? draft.records.length : 0), 0)
if (!Number.isInteger(extraction.summary?.structuredRecords) || extraction.summary.structuredRecords !== structuredRecordCount) errors.push('extraction manifest structuredRecords does not match the merged draft queue')
if (errors.length) throw new Error(`catalog live extraction check failed: ${errors.join('; ')}`)

console.log(`catalog live extraction check passed: ${drafts.filter(draft => !draft.error).length} blocked draft batches, ${structuredRecordCount} structured records, with exact source evidence`)
