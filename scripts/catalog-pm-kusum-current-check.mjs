import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_agri_enterprise.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-pm-kusum-source-audit.md'), 'utf8')
const assert = (condition, message) => {
  if (!condition) throw new Error('catalog PM-KUSUM check failed: ' + message)
}

assert(seed.includes('"slug":"pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum"'), 'PM-KUSUM record is missing')
assert(seed.includes('mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum'), 'official MNRE source is missing')
assert(seed.includes('"page_stated_period_end":"2026-03-31"'), 'national period boundary is missing')
assert(seed.includes('"component_a_capacity_kw":{"minimum":500,"maximum":2000}'), 'Component A capacity boundary is missing')
assert(seed.includes('"component_b_pump_capacity_hp_max":7.5'), 'Component B pump boundary is missing')
assert(seed.includes('"general_central_financial_assistance_percent":30') && seed.includes('"specified_special_regions_central_financial_assistance_percent":50'), 'central assistance rates are missing')
assert(seed.includes('"separate_value_buckets":true'), 'benefit buckets are not separated')
assert(seed.includes('"exclusions"') && seed.includes('post-period continuation'), 'closed-window exclusions are missing')
assert(seed.includes('"unknown_handling":"needs_information"'), 'unknown handling is missing')
assert(audit.includes('Human review gate') && audit.includes('review-gated'), 'human review gate is missing')

console.log('catalog PM-KUSUM check passed: component boundaries, closed national period, assistance rates and review gate remain encoded')
