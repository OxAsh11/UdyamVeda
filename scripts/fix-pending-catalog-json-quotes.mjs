// Dollar-quote pending JSON payloads so document apostrophes remain valid SQL.
import fs from 'node:fs'
const receipts = JSON.parse(fs.readFileSync('supabase/.temp/catalog-seeds-xvbirrthvzhhpkdciywd.json', 'utf8'))
for (const file of fs.readdirSync('supabase/seed').filter(name => name.endsWith('.sql') && !receipts[name])) {
  const path = `supabase/seed/${file}`
  const sql = fs.readFileSync(path, 'utf8')
  const repaired = sql.replace(/jsonb_array_elements\('(\[[\s\S]*?\])'::jsonb\)/g, (_, raw) => {
    const json = raw.replaceAll("''", "'")
    JSON.parse(json)
    if (json.includes('$records$')) throw new Error('Payload contains delimiter')
    return `jsonb_array_elements($records$${json}$records$::jsonb)`
  })
  if (sql !== repaired) { fs.writeFileSync(path, repaired); console.log(path) }
}
