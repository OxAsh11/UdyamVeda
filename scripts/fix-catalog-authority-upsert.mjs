// Repair seed upserts: authority names are not globally unique across jurisdictions.
import fs from 'node:fs'
for (const file of fs.readdirSync('supabase/seed').filter(name => name.endsWith('.sql'))) {
  const path = `supabase/seed/${file}`
  const sql = fs.readFileSync(path, 'utf8')
  const repaired = sql.replace(/insert into public\.authorities ([\s\S]*?)on conflict \(name\) do (nothing|update set official_url = excluded\.official_url)\s+returning id into authority_id;/g,
    (_, insert, conflict) => `select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities ${insert}returning id into authority_id;
    ${conflict === 'nothing' ? '' : "else\n      update public.authorities set official_url = item->>'authority_url' where id = authority_id;\n    "}end if;`)
  if (sql !== repaired) { fs.writeFileSync(path, repaired); console.log(path) }
}
