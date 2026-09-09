import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

function readEnv(name) {
  if (process.env[name]) return process.env[name]
  const envPath = path.join(root, '.env.local')
  if (!fs.existsSync(envPath)) return null
  const line = fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find(value => new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=`).test(value))
  if (!line) return null
  return line.split('=', 2)[1].trim().replace(/^['"]|['"]$/g, '')
}

function compactBody(body) {
  return body.replace(/\s+/g, ' ').trim().slice(0, 260)
}

async function probeTable(baseUrl, anonKey, table) {
  const url = `${baseUrl}/rest/v1/${table}?select=id&limit=1`
  try {
    const response = await fetch(url, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      signal: AbortSignal.timeout(15000),
    })
    const body = await response.text()
    const schemaMissing = response.status === 404 && body.includes('PGRST205')
    return {
      table,
      status: response.status,
      state: schemaMissing ? 'missing' : response.ok ? 'available' : 'error',
      visibleRows: response.ok ? (() => {
        try { return Array.isArray(JSON.parse(body)) ? JSON.parse(body).length : null } catch { return null }
      })() : null,
      detail: response.ok ? null : compactBody(body),
    }
  } catch (error) {
    return { table, status: null, state: 'unreachable', visibleRows: null, detail: error.message }
  }
}

const rawUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL')
const anonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
if (!rawUrl || !anonKey) {
  console.error(JSON.stringify({ state: 'unconfigured', reason: 'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required' }, null, 2))
  process.exit(1)
}

let baseUrl
try {
  baseUrl = new URL(rawUrl).origin
} catch {
  console.error(JSON.stringify({ state: 'unconfigured', reason: 'NEXT_PUBLIC_SUPABASE_URL is not a valid URL' }, null, 2))
  process.exit(1)
}

const tables = await Promise.all([
  probeTable(baseUrl, anonKey, 'opportunities'),
  probeTable(baseUrl, anonKey, 'source_registry'),
])
const states = new Set(tables.map(table => table.state))
const state = states.has('unreachable')
  ? 'unreachable'
  : states.has('missing')
    ? 'schema_not_applied'
    : states.has('error')
      ? 'query_error'
      : 'schema_available'

const output = {
  checkedAt: new Date().toISOString(),
  state,
  interpretation: state === 'schema_available'
    ? 'The catalog tables are present. This check does not approve records or prove the Central beta gate.'
    : state === 'schema_not_applied'
      ? 'The configured project is reachable, but one or more catalog tables are absent. Apply migrations before seeds.'
      : state === 'unreachable'
        ? 'The configured project could not be reached from this environment.'
        : 'The project responded, but the read-only catalog probe returned an error.',
  tables,
}
console.log(JSON.stringify(output, null, 2))

if (process.argv.includes('--require-schema') && state !== 'schema_available') process.exitCode = 1
