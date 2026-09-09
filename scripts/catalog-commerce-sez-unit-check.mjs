import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908070000_catalog_commerce_sez_unit_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_commerce_sez_unit_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-commerce-sez-unit-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog SEZ unit check failed: ${message}`) }

assert(seed.includes('commerce-special-economic-zone-unit-approval-and-authorized-operations'), 'record is missing')
for (const url of [
  'https://sezindia.gov.in/facilities-and-incentives',
  'https://sezindia.gov.in/index.php/FAQ',
  'https://www.commerce.gov.in/wp-content/uploads/2021/06/SEZAct2005.pdf',
  'https://www.sezindia.gov.in/sez-rules-and-amendments',
  'https://sezonline-ndml.co.in/',
  'https://sezonline-ndml.co.in/Help/NUA/NUAMain.html',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('positive_nfe_calculation_period_years":5'), 'positive NFE boundary is missing')
assert(seed.includes('authorized_operations_only') && seed.includes('current_customs_and_igst_route_required'), 'authorized-operation or tax-route guard is missing')
assert(seed.includes('Section 10AA') && seed.includes('sunset'), 'historical Section 10AA boundary is missing')
assert(seed.includes('Development Commissioner') && seed.includes('Letter of Approval'), 'SEZ approval route is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('historical income-tax'), 'audit boundaries are missing')

console.log('catalog SEZ unit check passed: official Act/Rules, positive-NFE, LOA route, current-tax boundaries and review gate are present')
