import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908260000_catalog_msme_ner_sikkim_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_msme_ner_sikkim_current.sql'), 'utf8')

const assert = (condition, message) => {
  if (!condition) throw new Error(`catalog NER/Sikkim check failed: ${message}`)
}

for (const url of [
  'https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx',
  'https://ner-promotion.msme.gov.in/NERegion/Reports/FAQs.aspx',
  'https://msme.gov.in/sites/default/files/RevisedGuidelines_NER_Sikkim.pdf',
  'https://msme.gov.in/sites/default/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf',
]) assert(migration.includes(url), `source registry is missing ${url}`)

for (const marker of [
  'msme-promotion-north-eastern-region-sikkim-infrastructure',
  'state_or_state_agency_applicant_verified',
  'government_assistance_percent_max":90',
  'new_mini_technology_centre_current_booklet_project_cost_ceiling_inr":150000000',
  'guideline_mini_technology_centre_assistance_cap_inr":135000000',
  'individual MSMEs, NGOs and private founders do not receive the Central grant directly',
  'component-specific project-cost and assistance limits',
  'review_tasks',
  "'in_review'",
]) assert(seed.includes(marker), `seed is missing ${marker}`)

assert(seed.includes('on conflict do nothing'), 'seed must remain idempotent')
assert(seed.includes('State Government or eligible State organization'), 'institutional application route must remain explicit')
assert(seed.includes('current official scheme booklet') && seed.includes('2022 revised guideline'), 'ceiling reconciliation must remain explicit')

console.log('catalog NER/Sikkim check passed: institutional route, regional scope, component ceilings, reconciliation caveat and review gate are present')
