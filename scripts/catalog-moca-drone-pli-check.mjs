import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908080001_catalog_moca_drone_pli_closed_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_moca_drone_pli_closed.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-moca-drone-pli-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog MoCA drone PLI check failed: ${message}`) }

assert(seed.includes('moca-production-linked-incentive-drones-components-closed'), 'record is missing')
for (const url of [
  'https://www.civilaviation.gov.in/sites/default/files/2024-04/PLI%20Scheme%20Drones%20and%20Drone%20Components.pdf',
  'https://www.civilaviation.gov.in/sites/default/files/migration/Guidelines%20for%20the%20Operation%20of%20Production%20Linked%20Incentive%20Scheme%20%28PLI%29%20fro%20Drones%20and%20Drone%20Components%20%281%29.pdf',
  'https://www.civilaviation.gov.in/index.php/ministry-documents/guidelines/amendment-pli-guidelines',
  'https://plidrone.ifciltd.com/',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('minimum_indian_value_addition_percent":40') && seed.includes('pli_rate_percent":20'), 'value-addition or PLI rate boundary is missing')
assert(seed.includes('maximum_pli_per_manufacturer_inr":300000000') && seed.includes('scheme_outlay_inr":1200000000'), 'scheme/per-manufacturer cap is missing')
assert(seed.includes('scheme_tenure_end_fy":"2023-24') && seed.includes('last_claim_date":"2025-02-15'), 'closed tenure or final claim date is missing')
assert(seed.includes('"status":"closed"') && seed.includes('historical_record_only'), 'closed historical status boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('closed route'), 'audit boundaries are missing')

console.log('catalog MoCA drone PLI check passed: closed status, official IFCI deadline, value-addition rules, caps and historical review gate are present')
