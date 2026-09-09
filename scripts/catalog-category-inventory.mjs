import fs from 'node:fs'
const inventory = Object.fromEntries(['benefit_type', 'source_kind', 'window_type', 'requirement_type'].map(key => [key, new Set()]))
for (const name of fs.readdirSync('supabase/seed').filter(name => name.endsWith('.sql'))) {
  const sql = fs.readFileSync(`supabase/seed/${name}`, 'utf8')
  for (const [table, key] of [['opportunity_benefits', 'benefit_type'], ['opportunity_windows', 'window_type'], ['opportunity_requirements', 'requirement_type']]) {
    for (const statement of sql.matchAll(new RegExp(`insert into public\\.${table}[\\s\\S]*?;\\s*\\n`, 'g'))) {
      for (const match of statement[0].matchAll(/(?:\(\s*|select\s+)version_id,\s*'([a-z_]+)'/g)) inventory[key].add(match[1])
    }
  }
  for (const match of sql.matchAll(/(?:\(\s*(?:version_id,\s*)?|select\s+version_id,\s*)'https:\/\/[^']+',\s*'([a-z_]+)'/g)) inventory.source_kind.add(match[1])
  for (const [key, values] of Object.entries(inventory)) {
    for (const match of sql.matchAll(new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`, 'g'))) values.add(match[1])
  }
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(inventory).map(([key, values]) => [key, [...values].sort()])), null, 2))
