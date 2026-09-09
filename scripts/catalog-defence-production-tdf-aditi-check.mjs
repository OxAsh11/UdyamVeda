import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908170000_catalog_defence_production_tdf_aditi_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_defence_production_tdf_aditi_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-defence-production-tdf-aditi-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog defence production TDF/ADITI check failed: ${message}`) }

for (const slug of ['idex-aditi-critical-technologies', 'drdo-technology-development-fund-startup-msme']) {
  assert(seed.includes(slug), `${slug} is missing`)
}
for (const url of ['https://idex.gov.in/disc-category/26', 'https://idex.gov.in/faq', 'https://www.idex.gov.in/uploads/page/aditi_scheeme.pdf', 'https://drdo.gov.in/drdo/en/offerings/industry-support', 'https://drdo.gov.in/drdo/en/offerings/schemes-and-services/startups-support', 'https://tdf.drdo.gov.in/', 'https://tdf.drdo.gov.in/faq', 'https://tdf.drdo.gov.in/public/innovator/register', 'https://www.drdo.gov.in/drdo/sites/default/files/inline-files/SOP_TDF24102024.pdf']) {
  assert(migration.includes(url) && seed.includes(url), `missing source evidence ${url}`)
}
for (const marker of ['current_call_status', 'current_project_must_be_verified', 'maximum_grant_inr":250000000', 'general_grant_share_percent":90', 'matching_contribution_required', 'selection_and_procurement']) {
  assert(seed.includes(marker), `boundary is missing: ${marker}`)
}
assert(seed.includes('"status":"paused"') && seed.includes("'in_review'"), 'paused status and review gate are missing')
assert(audit.includes('Human review gate') && audit.includes('distinct routes'), 'audit boundaries are missing')
console.log('catalog Defence Production check passed: ADITI and DRDO TDF remain separate, paused, source-anchored and review-gated')
