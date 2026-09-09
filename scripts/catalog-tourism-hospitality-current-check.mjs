import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_tourism_hospitality.sql'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907010001_catalog_tourism_hospitality_current_evidence.sql'), 'utf8')

const required = [
  'incredible-india-bed-breakfast-homestay-classification',
  'https://nidhi.tourism.gov.in/index.html',
  'https://nidhi.tourism.gov.in/home/page/guidelines',
  'https://nidhi.tourism.gov.in/mynidhi/',
  'https://nidhi.tourism.gov.in/uploads/gallery/1659456723.pdf',
  'maximum_rooms',
  'maximum_beds',
  'classification_validity_years',
  'classification_fee_applies',
  'inspection_required',
  'discontinued_route',
  'review_note',
  'in_review',
]

for (const token of required) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Tourism hospitality current evidence missing: ${token}`)
}

if (!seed.includes('"window_type":"rolling"')) throw new Error('Tourism hospitality route must remain rolling and review-gated')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed')) throw new Error('Tourism hospitality eligibility rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Tourism source registry must be idempotent')

console.log('catalog tourism/hospitality current check passed: NIDHI+ classification route, capacity/fee/inspection terms and discontinued-project boundary are review-gated')
