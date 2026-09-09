import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908110000_catalog_posts_franchise_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_posts_franchise_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-posts-franchise-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog India Post franchise check failed: ${message}`) }

for (const slug of ['india-post-franchise-outlet', 'india-post-postal-agent']) assert(seed.includes(slug), `${slug} is missing`)
for (const url of [
  'https://www.indiapost.gov.in/vacancies/franchise',
  'https://www.indiapost.gov.in/documents/offerings/vacancies/Franchise_2021.pdf',
  'https://www.indiapost.gov.in/business-services/otherservices',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('minimum_security_deposit_inr":5000') && seed.includes('commission_percent":5'), 'security or commission boundary is missing')
assert(seed.includes('serving_postal_employee_family_same_division') && seed.includes('income_not_guaranteed'), 'exclusion or non-guarantee boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not guaranteed'), 'audit boundaries are missing')

console.log('catalog India Post franchise check passed: separate outlet/agent routes, eligibility, security, commission and local review gates are present')
