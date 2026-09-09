import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_pharma_rptuas_current.sql'), 'utf8')
const audit = fs.readFileSync(path.join(root, 'docs', 'catalog-audits', '2026-09-08-pharmaceuticals-rptuas-source-audit.md'), 'utf8')
const assert = (condition, message) => {
  if (!condition) throw new Error('catalog RPTUAS check failed: ' + message)
}

assert(seed.includes('revamped-pharmaceutical-technology-upgradation-assistance-scheme'), 'RPTUAS record is missing')
for (const url of [
  'https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi',
  'https://pharma-dept.gov.in/sites/default/files/Revised%20guidelines%20SPI%20dated%2014.03.2024_0.pdf',
  'https://pharma-dept.gov.in/sites/default/files/Corrigendum%20RPTUAS%2021st%20March%2C%202026_0.pdf',
  'https://pharmaceuticals.gov.in/sites/default/files/FAQs%20in%20respect%20of%20RPTUAS%20-%20Copy.pdf',
  'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224373&lang=2&reg=48',
]) {
  assert(seed.includes(url), 'missing official source evidence ' + url)
}

assert(seed.includes('"status":"paused"'), 'current-intake uncertainty must remain paused')
assert(seed.includes('"maximum_incentive_inr":20000000'), 'current INR 2 crore ceiling is missing')
assert(seed.includes('"turnover_slab_1_percent":20') && seed.includes('"turnover_slab_2_percent":15') && seed.includes('"turnover_slab_3_percent":10'), 'turnover incentive slabs are missing')
assert(seed.includes('either Revised Schedule M or WHO-GMP first'), '2026 staged certificate modification is missing')
assert(seed.includes('current_rptuas_intake_verified'), 'recommendation rule must require current intake verification')
assert(seed.includes('Pre-01 January 2024 expenditure'), 'eligible investment date boundary is missing')
assert(seed.includes('review_status)') && seed.includes("'in_review'"), 'review gate is missing')
assert(audit.includes('Human review gate') && audit.includes('paused'), 'audit must preserve the paused human-review boundary')

console.log('catalog RPTUAS check passed: current ceiling, turnover slabs, 2026 certification change and paused-intake boundary remain review-gated')
