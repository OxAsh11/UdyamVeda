// Writes the SQL that publishes supabase/seed/mvp/m2-rule-corrections.json as new
// approved versions through publish_catalog_correction, in one transaction.
//
//   node scripts/mvp-rule-corrections-sql.mjs <out.sql> [--dry-run]
//
// With --dry-run the transaction rolls back. Run the file with `supabase db query`,
// and only after the owner has approved the corrections.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const corrections = JSON.parse(fs.readFileSync(path.join(root, 'supabase/seed/mvp/m2-rule-corrections.json'), 'utf8'))
const [out, flag] = process.argv.slice(2)
const dryRun = flag === '--dry-run'
const slugs = corrections.map(item => item.slug)

const q = value => `'${(typeof value === 'string' ? value : JSON.stringify(value)).replace(/'/g, "''")}'`
const list = slugs.map(q).join(', ')

const sql = [
  'begin;',
  "select set_config('request.jwt.claims', json_build_object('sub', (select user_id from public.catalog_reviewers where active limit 1), 'role', 'authenticated')::text, true);",
  ...corrections.map(item => `select public.publish_catalog_correction(${q(item.slug)}, ${q({ rules: item.rules })}::jsonb, ${q(item.reason)});`),
  `select o.slug, o.status, v.version_number, (select count(*) from public.benefit_rates r where r.opportunity_version_id = v.id) as rates, (select count(*) from public.eligibility_rule_sets s where s.opportunity_version_id = v.id and s.reviewed) as reviewed_rules, r.rules::text as rules
from public.opportunities o
join public.opportunity_versions v on v.id = o.current_version_id
join public.eligibility_rule_sets r on r.opportunity_version_id = v.id and r.reviewed
where o.slug in (${list}) order by o.slug;`,
  dryRun ? 'rollback;' : 'commit;',
  '',
].join('\n')

fs.writeFileSync(path.resolve(out), sql)
console.log(`Wrote ${out} (${dryRun ? 'dry run' : 'COMMIT'}): ${corrections.length} corrections.`)
