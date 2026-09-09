// Mechanical repair of seed-block variables that collide with SQL column names.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

for (const directory of ['supabase/seed', 'supabase/migrations']) {
  for (const file of readdirSync(directory).filter(name => name.endsWith('.sql'))) {
    if (directory.endsWith('migrations') && (file < '20260908060000' || file > '20260908149999')) continue
    const path = join(directory, file)
    const original = readFileSync(path, 'utf8')
    if (!/\bopportunity_id uuid;/.test(original)) continue
    const repaired = original
      .replace(/\bopportunity_id uuid;/g, 'seed_opportunity_id uuid;')
      .replace(/\binto opportunity_id\b/g, 'into seed_opportunity_id')
      .replace(/\bopportunity_id :=/g, 'seed_opportunity_id :=')
      .replace(/\bif opportunity_id is null/g, 'if seed_opportunity_id is null')
      .replace(/= opportunity_id\b/g, '= seed_opportunity_id')
      .replace(/\bvalues \(opportunity_id,/g, 'values (seed_opportunity_id,')
      .replace(/(values\s*\(\s*)opportunity_id\b/g, '$1seed_opportunity_id')
    writeFileSync(path, repaired)
    console.log(path)
  }
}
