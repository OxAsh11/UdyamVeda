import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migrationPath = path.join(root, 'supabase', 'migrations', '20260908010000_catalog_mofpi_pmksy_current_evidence.sql')
const seedPath = path.join(root, 'supabase', 'seed', 'verified_central_mofpi_pmksy_current.sql')
const auditPath = path.join(root, 'docs', 'catalog-audits', '2026-09-07-mofpi-pmksy-source-audit.md')
const packetPath = path.join(root, 'docs', 'catalog-review-evidence', 'central-review-033.json')

const migration = fs.readFileSync(migrationPath, 'utf8')
const seed = fs.readFileSync(seedPath, 'utf8')
const audit = fs.readFileSync(auditPath, 'utf8')
const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'))
const assert = (condition, message) => { if (!condition) throw new Error(`catalog MoFPI PMKSY check failed: ${message}`) }

for (const slug of [
  'mofpi-integrated-cold-chain-value-addition-pmksy',
  'mofpi-cefppc-food-processing-preservation-capacities-pmksy',
  'mofpi-agro-processing-cluster-pmksy',
]) assert(seed.includes(slug), `missing ${slug}`)

for (const url of [
  'https://www.mofpi.gov.in/en/announcements/revised-operational-guidelines-dated-22052025-respect-component-scheme-integrated-cold',
  'https://mofpi.gov.in/en/Schemes/cold-chain/download-circulars-0',
  'https://mofpi.gov.in/en/announcements/extension-timeline-1700-hrs-30092026-submission-multiproduct-food-irradiation',
  'https://mofpi.gov.in/en/Schemes/creation-expansion-food-processing-preservation-capacities-unit-scheme/download-circulars-1',
  'https://mofpi.gov.in/Schemes/agro-processing-cluster/download-circulars-2',
]) assert(migration.includes(url) && seed.includes(url), `missing official source evidence ${url}`)

assert(seed.includes('maximum_grant_per_project_inr":100000000'), 'cold-chain/APC project ceiling is missing')
assert(seed.includes('maximum_grant_per_project_inr":50000000'), 'CEFPPC project ceiling is missing')
assert(seed.includes('2026-09-30T17:00:00+05:30'), 'irradiation deadline is missing or not time-specific')
assert(seed.includes('not to every cold-chain project'), 'irradiation deadline scope boundary is missing')
assert(seed.includes('PMFME is a separate record'), 'PMFME duplication boundary is missing')
assert(seed.includes('project_level_support'), 'project-level benefit boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('30 September 2026'), 'audit does not record review gate and current deadline')
assert(packet.batchId === 'central-review-033', 'batch 033 evidence packet is missing')
assert(packet.records.length === 3, 'batch 033 must cover three PMKSY component records')
assert(packet.records.every((record) => record.proposedDecision === 'remain_in_review'), 'all PMKSY records must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'PMKSY records must not be publication-ready')
assert(packet.records.every((record) => record.supportingSources.length >= 4), 'each PMKSY record needs current official supporting sources')
assert(packet.records.every((record) => record.reviewFollowUps.length >= 6), 'each PMKSY record needs explicit window and fine-print follow-ups')
assert(packet.records.some((record) => record.slug === 'mofpi-integrated-cold-chain-value-addition-pmksy' && record.observations.some((item) => item.includes('only to that specified irradiation EOI'))), 'irradiation deadline scope boundary is missing from evidence')
assert(packet.records.some((record) => record.slug === 'mofpi-cefppc-food-processing-preservation-capacities-pmksy' && record.observations.some((item) => item.includes('not a currently open application window'))), 'CEFPPC historical-window boundary is missing from evidence')
assert(packet.records.some((record) => record.slug === 'mofpi-agro-processing-cluster-pmksy' && record.observations.some((item) => item.includes('cluster/common-infrastructure project route'))), 'APC cluster boundary is missing from evidence')
assert(packet.records.some((record) => record.observations.some((item) => item.includes('not a guaranteed payment'))), 'project-level non-entitlement boundary is missing from evidence')

console.log('catalog MoFPI PMKSY current check passed: cold-chain, CEFPPC and APC remain separate project-level routes with current official provenance, scoped irradiation deadline and review gates')
