import fs from 'node:fs'
import path from 'node:path'

const seedPath = path.join(process.cwd(), 'supabase', 'seed', 'verified_central_batch_5.sql')
const sql = fs.readFileSync(seedPath, 'utf8')
const marker = "select value from jsonb_array_elements('"
const start = sql.indexOf(marker)
const end = sql.indexOf("]'::jsonb)", start)

if (start < 0 || end < 0) {
  throw new Error('batch 5 JSON payload was not found')
}

const payload = sql.slice(start + marker.length, end + 1)
let records
try {
  records = JSON.parse(payload)
} catch (error) {
  const position = Number(String(error.message).match(/position (\d+)/i)?.[1])
  const context = Number.isFinite(position)
    ? payload.slice(Math.max(0, position - 180), position + 180)
    : ''
  throw new Error(`batch 5 JSON is invalid: ${error.message}\n${context}`)
}

if (!Array.isArray(records) || records.length !== 5) {
  throw new Error(`batch 5 must contain exactly five records; found ${records?.length ?? 'non-array'}`)
}

for (const [index, record] of records.entries()) {
  for (const field of ['slug', 'source_url', 'source_anchor', 'rules', 'steps', 'window_evidence']) {
    if (!record[field]) throw new Error(`batch 5 record ${index + 1} is missing ${field}`)
  }
  if (!record.fine_print?.review_note) throw new Error(`batch 5 record ${index + 1} is not explicitly review-gated`)
}

console.log(`catalog seed JSON check passed: ${records.length} review-gated records`)
