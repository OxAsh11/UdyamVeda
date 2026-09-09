import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908060000_catalog_dgft_epcg_current_evidence.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_dgft_epcg_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-07-dgft-epcg-source-audit.md'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog DGFT EPCG check failed: ${message}`) }

assert(seed.includes('dgft-export-promotion-capital-goods-epcg'), 'record is missing')
for (const url of [
  'https://content.dgft.gov.in/Website/dgftprod/62a8184d-a7c6-42c5-8711-f7964ab7b2ba/FTP2023_Chapter05.pdf',
  'https://content.dgft.gov.in/Website/dgftprod/d539da8e-57a9-47b1-9d2f-4fd5b3453cd5/HBP%20Chapter%205.pdf',
  'https://content.dgft.gov.in/Website/DGFT_FAQs-Export_Promotion_Capital_Goods%28EPCG%29v1.0.pdf',
  'https://www.dgft.gov.in/CP/',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)
assert(seed.includes('specific_export_obligation_multiple_of_duty_saved":6') && seed.includes('export_obligation_period_years":6'), 'six-times six-year obligation is missing')
assert(seed.includes('authorisation_import_validity_months":24') && seed.includes('first_block_minimum_percent":50'), 'current validity or block boundary is missing')
assert(seed.includes('indigenous_sourcing_specific_eo_reduction_percent":25') && seed.includes('green_technology_specific_eo_percent":75'), 'special EO routes are missing')
assert(seed.includes('Current FTP Chapter 5 states 24 months') && seed.includes('18-month import-validity statement'), 'FTP/FAQ validity conflict is not reconciled')
assert(seed.includes('actual_user_until_eodc') && seed.includes('current_ftp_hbp_and_customs_treatment_verified'), 'actual-user or current-treatment guard is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('not a grant'), 'audit boundaries are missing')

console.log('catalog DGFT EPCG check passed: current FTP/HBP, export-obligation, validity conflict, special routes and non-grant review gate are present')
