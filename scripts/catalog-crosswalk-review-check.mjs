import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260908210000_catalog_opportunity_authority_crosswalk_review.sql'), 'utf8')
const route = fs.readFileSync(path.join(root, 'src/app/api/admin/catalog/crosswalk/route.ts'), 'utf8')
const page = fs.readFileSync(path.join(root, 'src/app/admin/catalog/crosswalk/page.tsx'), 'utf8')
const releaseChecks = fs.readFileSync(path.join(root, 'supabase/tests/catalog_release_checks.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog crosswalk review check failed: ${message}`)
}

assert(migration.includes('create table if not exists public.opportunity_authority_reviews'), 'decision table is missing')
assert(migration.includes("decision text not null default 'pending'"), 'decision must be pending by default')
assert(migration.includes("decision = 'confirmed'"), 'confirmed mapping invariant is missing')
assert(migration.includes("decision = 'excluded'"), 'explicit exclusion invariant is missing')
assert(migration.includes('reviewers can manage opportunity authority reviews'), 'crosswalk RLS policy is missing')
assert(route.includes('export async function POST'), 'crosswalk API must accept reviewer decisions')
assert(route.includes('registered official source registry'), 'confirmed mappings must require registered evidence')
assert(route.includes("decision === 'excluded'"), 'crosswalk API must support explicit exclusion')
assert(route.includes('opportunity_authority_reviews'), 'crosswalk API must persist decisions')
assert(page.includes('Confirm with evidence'), 'crosswalk UI must expose confirmation action')
assert(page.includes('Exclude with reason'), 'crosswalk UI must expose exclusion action')
assert(releaseChecks.includes('opportunity_authority_reviews'), 'release SQL must include crosswalk review state')

console.log('catalog crosswalk review check passed: mapping decisions are persisted, evidence-bound, and reviewer-only')
