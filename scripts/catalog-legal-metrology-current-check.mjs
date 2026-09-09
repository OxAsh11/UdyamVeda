import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260907590000_catalog_consumer_affairs_legal_metrology_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_legal_metrology.sql'), 'utf8')

for (const token of [
  'legal-metrology-packaged-commodities-registration-rule-27',
  'legal-metrology-importer-registration-weights-measures-section-19',
  'legal-metrology-model-approval-weights-measures-section-22',
  'lm.doca.gov.in/pcr/',
  'lm.doca.gov.in/oregis/',
  'lm.doca.gov.in/model/',
  'legal-metrology-act',
  'legal_basis_rule":"27',
  'legal_basis_section":"19',
  'legal_basis_section":"22',
  'state_or_ut_conditions_may_apply',
  'in_review',
]) {
  if (!seed.includes(token) && !migration.includes(token)) throw new Error(`Legal Metrology evidence missing: ${token}`)
}

if (!seed.includes('distinct from model approval') || !seed.includes('distinct from importer registration')) throw new Error('Legal Metrology route separation is missing')
if (!seed.includes('State/UT') || !seed.includes('State Government enforcement rules')) throw new Error('State/UT enforcement boundary is missing')
if (!seed.includes('eligibility_rule_sets') || !seed.includes('reviewed)')) throw new Error('Legal Metrology rules must remain unreviewed')
if (!migration.includes('on conflict (url) do update')) throw new Error('Legal Metrology source registry must be idempotent')

console.log('catalog Legal Metrology current check passed: Rule 27 registration, Section 19 importer registration and Section 22 model approval remain separate, state-aware and review-gated')
