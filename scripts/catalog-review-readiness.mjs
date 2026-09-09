import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seedsDir = path.join(root, 'supabase', 'seed')
const seedFiles = fs.readdirSync(seedsDir).filter(file => file.endsWith('.sql')).sort()

function structuredRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  if (!payloadMatch) return null
  try {
    return JSON.parse(payloadMatch[1])
  } catch (error) {
    throw new Error(`catalog review readiness failed: ${file} contains invalid structured JSON: ${error.message}`)
  }
}

function recordReadiness(record, file) {
  const hasItems = value => Array.isArray(value) ? value.length > 0 : Boolean(value && typeof value === 'object' && Object.keys(value).length > 0)
  const hasText = value => typeof value === 'string' && value.trim().length > 0
  const checks = {
    identity: Boolean(record.slug && record.name && record.authority && record.type),
    officialSource: Boolean(hasText(record.source_url) && hasText(record.source_anchor)),
    eligibility: Boolean(record.eligibility && record.rules?.unknown_handling),
    eligibilityDetail: Boolean(hasItems(record.eligibility?.entity_types) && (hasItems(record.eligibility?.conditions) || hasItems(record.eligibility?.thresholds))),
    benefit: Boolean(record.benefit_summary && record.benefit_type && record.benefit_label),
    benefitSeparation: Boolean(record.benefit_summary?.separate_value_buckets === true || hasItems(record.benefit_summary?.types)),
    application: Boolean(record.application && record.requirement && record.requirement_description),
    applicationRoute: Boolean(hasText(record.application?.portal) && hasText(record.application?.route)),
    steps: Array.isArray(record.steps) && record.steps.length > 0,
    window: Boolean(record.window_type && record.window_label && record.window_evidence),
    windowEvidenceAnchor: Boolean(hasText(record.window_evidence?.source_url) && hasText(record.window_evidence?.anchor)),
    finePrint: Boolean(record.fine_print?.review_note),
    finePrintBoundary: Boolean(record.fine_print && Object.keys(record.fine_print).length >= 2),
    humanApproval: true,
  }
  return {
    slug: record.slug,
    name: record.name,
    file,
    reviewStatus: 'in_review',
    publicationAllowed: false,
    checks,
    outstanding: Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name),
    source: {
      url: record.source_url ?? null,
      anchor: record.source_anchor ?? null,
    },
    reviewTasks: [
      'verify_source_anchor_against_current_official_content',
      'review_eligibility_and_unknown_handling',
      'reconcile_benefit_amounts_and_conditions',
      'verify_application_steps_and_required_documents',
      'verify_window_and_current_status',
      'record_reviewer_decision_before_publication',
    ],
  }
}

const files = []
const records = []
let rawSqlDossiers = 0

for (const file of seedFiles) {
  const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8')
  if (!sql.toLowerCase().includes('insert into public.opportunities')) continue
  const structured = structuredRecords(sql, file)
  const slugs = [...new Set([
    ...[...sql.matchAll(/where\s+slug\s*=\s*'([^']+)'/gi)].map(match => match[1]),
    ...[...sql.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(match => match[1]),
  ])]
  const versionCount = (sql.match(/insert\s+into\s+public\.opportunity_versions/gi) ?? []).length
  if (!structured) rawSqlDossiers += versionCount
  files.push({
    file,
    recordCount: structured?.length ?? slugs.length,
    representation: structured ? 'structured_json' : 'raw_sql_dossier',
    reviewStatus: 'in_review',
    publicationAllowed: false,
  })
  if (structured) {
    for (const record of structured) records.push(recordReadiness(record, file))
  }
}

const failures = records.filter(record => record.outstanding.length > 0)
const output = {
  generatedAt: new Date().toISOString(),
  totalReviewGatedRecords: files.reduce((count, file) => count + file.recordCount, 0),
  structuredRecords: records.length,
  rawSqlDossiers,
  publicationAllowedRecords: 0,
  files,
  structuredRecordsWithMissingEditorialFields: failures.length,
  interpretation: 'This is a local editorial queue, not a publication decision. Every record still requires human source verification and an authorized review decision.',
}

if (process.argv.includes('--details')) output.records = records
console.log(JSON.stringify(output, null, 2))
