import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908020000_catalog_commerce_ties_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_commerce_ties.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-commerce-ties-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog Commerce TIES check failed: ${message}`) }

assert(seed.includes('trade-infrastructure-for-export-scheme-ties'), 'TIES record is missing')
for (const url of [
  'https://www.commerce.gov.in/wp-content/uploads/2021/07/TIES-revised-guidelines-FY22-to-FY26.pdf',
  'https://www.commerce.gov.in/wp-content/uploads/2025/08/MoM_20th-EC_23.07.2025.pdf',
  'https://apps.commerce.gov.in/schemes/schemereport',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('entity_types') && seed.includes('central_government_agency'), 'institutional eligibility boundary is missing')
assert(seed.includes('normal_grant_ceiling_per_project_inr":200000000'), 'project ceiling is missing')
assert(seed.includes('ordinary startups, exporters or individuals'), 'direct-founder exclusion is missing')
assert(seed.includes('new_window_not_asserted') && seed.includes('"window_type":"closed"'), 'closed/current-window boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a direct founder'), 'audit boundary is missing')

console.log('catalog Commerce TIES check passed: institutional export-infrastructure grant, project ceiling, closed-window boundary and non-direct-founder route remain review-gated')
