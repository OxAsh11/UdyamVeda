import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908240000_catalog_rkvy_raftaar_agripreneurship_current.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'verified_central_rkvy_raftaar_agripreneurship_current.sql'), 'utf8')

const assert = (condition, message) => {
  if (!condition) throw new Error(`catalog RKVY-RAFTAAR check failed: ${message}`)
}

for (const url of [
  'https://www.ivri.nic.in/Rabi/Default2.aspx',
  'https://www.ivri.nic.in/Rabi/navodaya.aspx',
  'https://www.ivri.nic.in/Rabi/samridhi.aspx',
  'https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf',
  'https://www.manage.gov.in/managecia/RKVYProg.aspx',
]) assert(migration.includes(url), `source registry is missing ${url}`)

for (const marker of [
  'pm-rkvy-raftaar-navodaya-agripreneurship-orientation',
  'pm-rkvy-raftaar-samriddhi-startup-incubation',
  'stipend_per_month_inr":10000',
  'idea_grant_max_inr":500000',
  'grant_in_aid_max_inr":2500000',
  'named cohort applications closed',
  'participating_r_abi_current_route_verified',
  'current_cohort_window_verified',
  'review_tasks',
  "'publish', 'open'",
]) assert(seed.includes(marker), `seed is missing ${marker}`)

assert(seed.includes('separate, selection-dependent benefits') && seed.includes('not a guaranteed INR 25 lakh grant'), 'benefit boundaries must remain explicit')
assert(seed.includes('on conflict do nothing') && seed.includes("'in_review'"), 'seed must remain idempotent and review-gated')

console.log('catalog RKVY-RAFTAAR check passed: separate orientation/incubation routes, cohort boundaries and review gate are present')
