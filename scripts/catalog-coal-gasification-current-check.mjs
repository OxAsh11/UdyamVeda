import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908040000_catalog_coal_gasification_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_coal_gasification_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-coal-gasification-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog coal gasification check failed: ${message}`) }

assert(seed.includes('ministry-of-coal-surface-coal-lignite-gasification'), 'record is missing')
for (const url of [
  'https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf',
  'https://www.coal.gov.in/sites/default/files/2026-09/03-09-2026b-wn.pdf',
  'https://www.coal.gov.in/major-statistics/national-coal-gasification-mission',
  'https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('minimum_clean_syngas_capacity_mtpa":0.5'), 'capacity threshold is missing')
assert(seed.includes('minimum_applicant_net_worth_as_percent_of_project_cost":20'), 'net-worth threshold is missing')
assert(seed.includes('maximum_percent_of_plant_and_machinery":20') && seed.includes('single_project_cap_inr":50000000000'), 'financial incentive cap is missing')
assert(seed.includes('application_security_inr":5000000') && seed.includes('performance_security_percent":3'), 'security conditions are missing')
assert(seed.includes('window_type":"fixed"') && seed.includes('2026-09-07T17:00:00+05:30'), 'current deadline is missing')
assert(seed.includes('not_a_general_msmE_grant') && seed.includes('project_level_only'), 'project-level boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('general MSME grant'), 'audit boundaries are missing')

console.log('catalog Coal Gasification check passed: current RFP, project eligibility, incentive caps, security, deadline and review gate are present')
