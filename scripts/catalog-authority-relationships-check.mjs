import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const migration = fs.readFileSync(path.join(root, 'supabase', 'migrations', '20260908180000_catalog_authority_relationships.sql'), 'utf8')
const seed = fs.readFileSync(path.join(root, 'supabase', 'seed', 'zz_authority_relationship_candidates.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(`catalog authority relationships check failed: ${message}`)
}

assert(migration.includes('create table if not exists public.authority_relationships'), 'relationship table is missing')
assert(migration.includes('parent_coverage_id uuid not null references public.authority_coverage'), 'relationships must point to the IGOD coverage row')
assert(migration.includes("review_status text not null default 'pending'"), 'relationships must be review-pending by default')
assert(migration.includes('reviewers can manage authority relationships'), 'relationship RLS policy is missing')
assert(migration.includes('unique (child_authority_id, parent_coverage_id, relationship_type)'), 'relationship deduplication constraint is missing')
assert(seed.includes('Seed-declared department metadata'), 'department candidates must preserve their evidence boundary')
assert(seed.includes('Seed-declared ministry metadata'), 'ministry candidates must preserve their evidence boundary')
assert(seed.includes("'pending'"), 'relationship seed must not confirm candidates automatically')
assert(seed.includes('authority_coverage'), 'relationship seed must resolve parent coverage rows')

console.log('catalog authority relationships check passed: parent mappings are explicit, deduplicated, RLS-protected, and review-pending')
