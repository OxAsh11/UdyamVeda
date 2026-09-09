import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const packet = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'catalog-review-evidence', 'central-review-049.json'), 'utf8'))
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_bis_product_compliance_current.sql'), 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(`catalog BIS CRS batch check failed: ${message}`) }

assert(packet.batchId === 'central-review-049', 'packet must target central-review-049')
assert(packet.records.length === 1 && packet.records[0].slug === 'bis-crs-electronics-it-registration', 'packet must cover only the CRS record')
assert(packet.records[0].proposedDecision === 'remain_in_review', 'CRS must remain review-gated')
assert(packet.publicationGuard.publicationReady === false, 'packet cannot authorize publication')
assert(packet.records[0].sourceUrl === 'https://www.crsbis.in/BIS/about-crs.do', 'CRS must use the official portal source')
for (const url of ['https://www.crsbis.in/BIS/registration-page.do', 'https://www.crsbis.in/BIS/bis_lab.do', 'https://www.crsbis.in/BIS/inclusion_renewal.do', 'https://www.crsbis.in/BIS/app_srv/tdc/gl/docs/Revised_Fee_Structure.pdf']) {
  assert(packet.records[0].supportingSources.some(source => source.url === url), `missing supporting source ${url}`)
}
for (const marker of ['manufacturer or factory owner', 'within 90 days', 'within 60 days', 'Indian Standard', '2018', 'FMCS']) {
  assert(packet.records[0].observations.some(value => value.includes(marker)), `packet boundary is missing: ${marker}`)
}
for (const marker of ['bis-crs-electronics-it-registration', 'meity_notification_check_required', 'recognized_lab_evidence_required', 'fmcs_boundary_must_be_checked']) {
  assert(seed.includes(marker), `structured seed boundary is missing: ${marker}`)
}

console.log('catalog BIS CRS batch check passed: notified-product scope, manufacturer route, lab timing, fee caveat and FMCS boundary remain review-gated')
