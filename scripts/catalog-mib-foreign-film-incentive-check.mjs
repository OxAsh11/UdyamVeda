import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mib_foreign_film_incentive.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-mib-foreign-film-incentive-source-audit.md'), 'utf8')
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908090000_catalog_mib_foreign_film_current_evidence.sql'), 'utf8')
const packet = fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-066.json'), 'utf8')
const assert = (condition, message) => {
  if (!condition) throw new Error('catalog MIB foreign-film check failed: ' + message)
}

assert(seed.includes('incentive-scheme-foreign-films-official-coproduction-india'), 'foreign-film incentive record is missing')
for (const url of [
  'https://indiacinehub.gov.in/incentive-calcuator-page',
  'https://indiacinehub.gov.in/permission/step-by-step-guide/international-projects',
  'https://mib.gov.in/sites/default/files/2024-02/Revised%20incentive%20guidelines.pdf',
]) {
  assert(seed.includes(url), 'missing official source evidence ' + url)
}

assert(seed.includes('"status":"active"'), 'live portal route must remain active pending review')
assert(seed.includes('"base_percent":30') && seed.includes('"indian_manpower_bonus_percent":5') && seed.includes('"significant_indian_content_bonus_percent":5'), 'benefit components are missing')
assert(seed.includes('"maximum_percent":40') && seed.includes('"maximum_incentive_inr":300000000'), 'maximum percentage or indexed cap is missing')
assert(seed.includes('processing_fee_usd_equivalent') && seed.includes('USD 225'), 'processing fee boundary is missing')
assert(seed.includes('current_ich_guideline_verified'), 'recommendation rule must require current guideline verification')
assert(seed.includes('Detailed script and synopsis') && seed.includes('crew passport'), 'document requirements are missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('review-gated'), 'audit must preserve the human-review boundary')
assert(migration.includes('current_guideline_resolution') && migration.includes("where slug = 'incentive-scheme-foreign-films-official-coproduction-india'"), 'current guideline-resolution migration is missing')
assert(packet.includes('source-resolution') && packet.includes('publicationReady') && packet.includes('remain_in_review'), 'evidence packet must preserve source-resolution and publication gates')

console.log('catalog MIB foreign-film check passed: portal route, benefit components, cap, fee, documents and review gate remain encoded')
