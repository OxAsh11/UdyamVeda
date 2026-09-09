import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260908370000_catalog_public_visibility_hardening.sql'), 'utf8')
const releaseChecks = fs.readFileSync(path.join(root, 'supabase/tests/catalog_release_checks.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error('catalog public visibility check failed: ' + message)
}

assert(migration.includes('drop policy if exists "published opportunities are public"'), 'opportunity public policy must be replaced by a forward migration')
assert(migration.includes('where v.id = current_version_id') && migration.includes('v.review_status = \'approved\''), 'public opportunities must require an approved current version')
assert(migration.includes('drop policy if exists "published authorities are public"'), 'authority public policy must be replaced by a forward migration')
assert(migration.includes('where o.authority_id = authorities.id') && migration.includes('join public.opportunity_versions v'), 'public authorities must be tied to the outer authority and a published opportunity version')
assert(releaseChecks.includes('Public opportunity policy must require an approved current version'), 'release checks must validate the opportunity visibility predicate')
assert(releaseChecks.includes('Authority public policy must require an approved current version'), 'release checks must validate the authority visibility predicate')

console.log('catalog public visibility check passed: direct public reads require approved current opportunity versions')
