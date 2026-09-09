import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908090001_catalog_railways_startup_procurement_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_railways_startup_procurement_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-railways-startup-procurement-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Railways startup procurement check failed: ${message}`) }

assert(seed.includes('railways-dpiit-startup-procurement-access'), 'record is missing')
for (const url of [
  'https://secr.indianrailways.gov.in/uploads/files/1738300360704-Manual%20for%20procurement%20Goods_2024.pdf',
  'https://www.ireps.gov.in/',
  'https://rwp.indianrailways.gov.in/works/uploads/File/User_Manual_for_Registration_of_New_Vendors_%26_Contractors_Version_1.0.pdf',
  'https://railtech.indianrailways.gov.in/',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('maximum_startup_age_years":10') && seed.includes('maximum_turnover_any_financial_year_inr":1000000000'), 'startup age or turnover boundary is missing')
assert(seed.includes('bid-security') && seed.includes('prior-experience/turnover'), 'procurement relief is missing')
assert(seed.includes('cash_benefit":false') && seed.includes('contract_not_guaranteed":true'), 'non-financial and non-guaranteed contract boundary is missing')
assert(seed.includes('current_tender_route_verified') && seed.includes('unknown_handling":"needs_information'), 'current tender guard or unknown handling is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a grant'), 'audit boundaries are missing')

console.log('catalog Railways startup procurement check passed: official manual, IREPS route, startup boundaries, non-cash benefit and tender review gate are present')
