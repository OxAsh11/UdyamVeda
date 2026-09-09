// Explicitly invoked, resumable import. Never approves or publishes records.
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const projectRef = process.argv[2]
if (!/^[a-z0-9]{20}$/.test(projectRef ?? '')) throw new Error('Pass the expected Supabase project ref')
if (fs.readFileSync('supabase/.temp/project-ref', 'utf8').trim() !== projectRef) throw new Error('Linked project mismatch')
const receiptPath = `supabase/.temp/catalog-seeds-${projectRef}.json`
const receipts = fs.existsSync(receiptPath) ? JSON.parse(fs.readFileSync(receiptPath, 'utf8')) : {}
const files = fs.readdirSync('supabase/seed').filter(name => name.endsWith('.sql')).sort()

for (const [index, name] of files.entries()) {
  if (!/^[a-z0-9_]+\.sql$/.test(name)) throw new Error(`Unexpected seed filename: ${name}`)
  const path = `supabase/seed/${name}`
  const hash = createHash('sha256').update(fs.readFileSync(path)).digest('hex')
  if (receipts[name]?.hash === hash) {
    console.log(`[${index + 1}/${files.length}] already applied: ${name}`)
    continue
  }
  if (receipts[name]) throw new Error(`Applied seed changed; review a correction instead of replaying: ${name}`)
  console.log(`[${index + 1}/${files.length}] applying: ${name}`)
  const args = ['--yes', 'supabase@2.116.0', 'db', 'query', '--linked', '--project-ref', projectRef, '--file', path]
  const result = spawnSync(process.platform === 'win32' ? 'cmd.exe' : 'npx',
    process.platform === 'win32' ? ['/d', '/s', '/c', `npx.cmd ${args.join(' ')}`] : args,
    { encoding: 'utf8', timeout: 120000, windowsHide: true, maxBuffer: 4 * 1024 * 1024 })
  if (result.status !== 0 || result.error) {
    console.error([result.stderr, result.stdout, result.error?.message].filter(Boolean).join('\n').slice(0, 2400))
    throw new Error(`Import stopped at ${name}; inspect before resuming`)
  }
  receipts[name] = { hash, appliedAt: new Date().toISOString() }
  fs.writeFileSync(receiptPath, JSON.stringify(receipts, null, 2))
}
console.log(`Completed ${files.length} seed files for ${projectRef}; publication remains a separate reviewed operation.`)
