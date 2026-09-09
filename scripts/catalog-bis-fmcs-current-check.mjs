import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-050.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_bis_product_compliance_current.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog BIS FMCS batch check failed: ${message}`) }

assert(packet.batchId === 'central-review-050', 'packet must target central-review-050')
assert(packet.records.length === 1 && packet.records[0].slug === 'bis-fmcs-foreign-manufacturer-licence', 'packet must cover only the FMCS record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'FMCS must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://www.bis.gov.in/fmcs/fmcs-overview/?lang=en', 'FMCS must use the official BIS overview')
for (const url of ['https://www.bis.gov.in/fmcs/certification-process/how-to-apply/?lang=en', 'https://www.bis.gov.in/fmcs/certification-process/nomination-of-air/?lang=en', 'https://www.bis.gov.in/fmcs/certification-process/grant-of-licence/?lang=en', 'https://www.bis.gov.in/fmcs/forms-and-formats/?lang=en', 'https://www.bis.gov.in/fmcs/fmcs-fee/?lang=en']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['online submission is required from 1 June 2026', 'Indian resident', 'USD 10,000', 'six months', 'CRS']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['bis-fmcs-foreign-manufacturer-licence', 'authorized_indian_representative_required', 'online_application_only_from', 'crs_boundary_for_meity_electronics_it']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog BIS FMCS batch check passed: foreign-manufacturer, AIR, online-submission, testing, guarantee, validity and CRS boundaries remain review-gated')
