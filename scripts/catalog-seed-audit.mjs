import fs from 'node:fs'
import path from 'node:path'

const seedsDir = path.join(process.cwd(), 'supabase', 'seed')
const seedFiles = fs.readdirSync(seedsDir).filter(file => file.endsWith('.sql')).sort()
const opportunityFiles = []
const slugs = []
let rawSqlDossierCount = 0

function fail(message) {
  throw new Error(`catalog seed audit failed: ${message}`)
}

function structuredRecords(sql, file) {
  const payloadMatch = sql.match(/jsonb_array_elements\(\$records\$(\[[\s\S]*?\])\$records\$::jsonb\)/)
    ?? sql.match(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/)
  if (!payloadMatch) return null
  let records
  try {
    records = JSON.parse(payloadMatch[1])
  } catch (error) {
    const position = Number(String(error.message).match(/position (\d+)/i)?.[1])
    const context = Number.isFinite(position) ? payloadMatch[1].slice(Math.max(0, position - 180), position + 180) : ''
    throw new Error(`catalog seed audit failed: ${file} contains invalid structured JSON: ${error.message}\n${context}`)
  }
  if (!Array.isArray(records) || records.length === 0) fail(`${file} structured JSON payload is not a non-empty record array`)
  return records
}

const ruleOperators = new Set(['equals', 'not_equals', 'greater_than', 'greater_than_or_equal', 'less_than', 'less_than_or_equal', 'in', 'not_in', 'contains', 'starts_with', 'exists', 'not_exists'])
const unknownHandlingValues = new Set(['needs_information', 'fail_closed', 'pass_through'])

function ruleErrors(input, path = 'rules') {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return [`${path} must be an object`]
  const errors = []
  if (input.unknown_handling !== undefined && !unknownHandlingValues.has(input.unknown_handling)) errors.push(`${path}.unknown_handling is unsupported`)
  const hasAll = Object.prototype.hasOwnProperty.call(input, 'all')
  const hasAny = Object.prototype.hasOwnProperty.call(input, 'any')
  if (hasAll && hasAny) errors.push(`${path} cannot contain both all and any`)
  if (hasAll || hasAny) {
    const key = hasAll ? 'all' : 'any'
    if (!Array.isArray(input[key]) || input[key].length === 0) return [...errors, `${path}.${key} must be non-empty`]
    input[key].forEach((child, index) => errors.push(...ruleErrors(child, `${path}.${key}[${index}]`)))
    return errors
  }
  if (typeof input.field !== 'string' || !input.field.trim()) errors.push(`${path}.field is required`)
  if (typeof input.operator !== 'string' || !ruleOperators.has(input.operator)) return [...errors, `${path}.operator is unsupported`]
  if (!['exists', 'not_exists'].includes(input.operator) && !Object.prototype.hasOwnProperty.call(input, 'value')) errors.push(`${path}.value is required`)
  if (['in', 'not_in'].includes(input.operator) && !Array.isArray(input.value)) errors.push(`${path}.value must be an array`)
  return errors
}

function auditStructuredRecord(record, file, index) {
  const label = `${file} record ${index + 1} (${record.slug ?? 'unknown-slug'})`
  for (const field of ['slug', 'name', 'authority', 'type', 'source_url', 'source_anchor', 'eligibility', 'application', 'fine_print', 'benefit_summary', 'benefit_type', 'requirement', 'requirement_description', 'rules', 'steps', 'window_type', 'window_label', 'window_evidence']) {
    if (record[field] === undefined || record[field] === null || record[field] === '') fail(`${label} is missing ${field}`)
  }
  if (!record.fine_print?.review_note) fail(`${label} is missing fine_print.review_note`)
  if (!Array.isArray(record.steps) || record.steps.length === 0) fail(`${label} has no structured application steps`)
  if (!record.rules?.unknown_handling) fail(`${label} does not declare unknown handling in its eligibility rules`)
  const eligibilityRuleErrors = ruleErrors(record.rules)
  if (eligibilityRuleErrors.length) fail(`${label} has invalid eligibility rules: ${eligibilityRuleErrors.join('; ')}`)
}

for (const file of seedFiles) {
  const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8')
  const lower = sql.toLowerCase()
  if (!lower.includes('insert into public.opportunities')) continue

  opportunityFiles.push(file)
  if (!lower.includes('review_status') || !lower.includes("'in_review'")) fail(`${file} does not keep opportunity versions review-gated`)
  if (lower.includes(", 'active',") || lower.includes(", 'upcoming',")) fail(`${file} seeds an active/upcoming opportunity before review`)
  if (!lower.includes('insert into public.opportunity_sources')) fail(`${file} has no opportunity provenance insert`)
  if (!lower.includes('source_anchor')) fail(`${file} has no source anchors`)
  if (!lower.includes('fine_print')) fail(`${file} has no fine-print payload`)
  const declaredOperators = [...sql.matchAll(/["']operator["']\s*:\s*["']([^"']+)["']/gi)].map(match => match[1])
  const invalidOperators = [...new Set(declaredOperators.filter(operator => !ruleOperators.has(operator)))]
  if (invalidOperators.length) fail(`${file} contains unsupported eligibility operators: ${invalidOperators.join(', ')}`)

  const sqlSlugs = [...sql.matchAll(/where\s+slug\s*=\s*'([^']+)'/gi)].map(match => match[1])
  const jsonSlugs = [...sql.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map(match => match[1])
  const fileSlugs = [...new Set([...sqlSlugs, ...jsonSlugs])]
  if (!fileSlugs.length) fail(`${file} has opportunity inserts but no auditable slug markers`)
  slugs.push(...fileSlugs.map(slug => ({ slug, file })))

  const records = structuredRecords(sql, file)
  if (records) {
    records.forEach((record, index) => auditStructuredRecord(record, file, index))
  } else {
    const versionCount = (sql.match(/insert\s+into\s+public\.opportunity_versions/gi) ?? []).length
    const reviewNoteCount = (sql.match(/review_note/gi) ?? []).length
    const requirementsCount = (sql.match(/insert\s+into\s+public\.opportunity_requirements/gi) ?? []).length
    const stepsCount = (sql.match(/insert\s+into\s+public\.opportunity_steps/gi) ?? []).length
    const windowsCount = (sql.match(/insert\s+into\s+public\.opportunity_windows/gi) ?? []).length
    const sourcesCount = (sql.match(/insert\s+into\s+public\.opportunity_sources/gi) ?? []).length
    if (reviewNoteCount < versionCount) fail(`${file} has ${versionCount} raw-SQL versions but only ${reviewNoteCount} fine-print review notes`)
    if (requirementsCount < versionCount || stepsCount < versionCount || windowsCount < versionCount) {
      fail(`${file} does not provide at least one structured requirement, step, and window for every raw-SQL version`)
    }
    if (sourcesCount < versionCount || !lower.includes('source_anchor')) fail(`${file} does not provide auditable source coverage for every raw-SQL version`)
    rawSqlDossierCount += versionCount
  }
}

const duplicateSlugs = [...new Set(slugs.map(item => item.slug))].filter(slug => slugs.filter(item => item.slug === slug).length > 1)
if (duplicateSlugs.length) fail(`duplicate opportunity slugs: ${duplicateSlugs.join(', ')}`)
if (slugs.length < 48) fail(`expected at least 48 review-gated Central records; found ${slugs.length}`)

const structuredRecordCount = seedFiles.reduce((count, file) => {
  const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8')
  return count + (structuredRecords(sql, file)?.length ?? 0)
}, 0)
console.log(`catalog seed audit passed: ${slugs.length} unique review-gated opportunities across ${opportunityFiles.length} seed files; ${structuredRecordCount} structured records and ${rawSqlDossierCount} raw-SQL dossiers passed editorial presence checks`)
