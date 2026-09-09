import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908050000_catalog_mopng_cbg_bam_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_mopng_cbg_bam_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-mopng-cbg-bam-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog MoPNG BAM check failed: ${message}`) }

assert(seed.includes('mopng-cbg-biomass-aggregation-machinery'), 'record is missing')
for (const url of [
  'https://mopng.gov.in/files/natural-gas/policies-and-guidelines/Revised-scheme-guideline.pdf',
  'https://gobardhan.sbm.gov.in/whats-new/1752042813_2a6f019a8e6186349c85.pdf',
  'https://bam.eil.co.in/',
  'https://gobardhan.eil.co.in/petroleum_ministry',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('minimum_cbg_capacity_tpd":2') && seed.includes('minimum_agri_residue_feedstock_percent":50'), 'BAM eligibility thresholds are missing')
assert(seed.includes('maximum_financial_assistance_per_bam_set_inr":9000000') && seed.includes('maximum_assistance_per_project_inr":90000000'), 'BAM assistance caps are missing')
assert(seed.includes('scheme_period_end":"2027-03-31') && seed.includes('window_close_at":"2026-09-30'), 'scheme period or deadline boundary is missing')
assert(seed.includes('bam_not_yet_purchased') && seed.includes('five_year_bond_required') && seed.includes('physical_verification_required'), 'pre-purchase and post-award obligations are missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('automatic entitlement'), 'audit boundaries are missing')

console.log('catalog MoPNG BAM check passed: current guideline, eligibility, caps, quarterly deadline, portal and fine-print obligations are review-gated')
