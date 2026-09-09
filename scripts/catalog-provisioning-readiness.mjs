import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const writeReport = process.argv.includes('--write')
const requireReady = process.argv.includes('--require-ready')

function readEnv(name) {
  if (process.env[name]) return process.env[name]
  const envPath = path.join(root, '.env.local')
  if (!fs.existsSync(envPath)) return null
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(value => new RegExp(`^\\s*${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\\\$&')}\\s*=`).test(value))
  return line ? line.split('=', 2)[1].trim().replace(/^['"]|['"]$/g, '') : null
}

function commandStatus(command) {
  const lookupCommand = process.platform === 'win32' ? 'where.exe' : 'which'
  const result = spawnSync(lookupCommand, [command], { encoding: 'utf8', timeout: 4000, windowsHide: true })
  if (result.error || result.status !== 0) return { available: false, detail: 'not_found' }
  return { available: true, detail: (result.stdout || '').trim().split(/\r?\n/)[0] || 'found' }
}

function runNpxSupabase(cliArgs, timeout = 20000) {
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  const packageName = 'supabase@2.116.0'
  const executable = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : npxCommand
  const args = process.platform === 'win32'
    ? ['/d', '/s', '/c', `${npxCommand} --yes ${packageName} ${cliArgs.join(' ')}`]
    : ['--yes', packageName, ...cliArgs]
  const result = spawnSync(executable, args, {
    encoding: 'utf8',
    timeout,
    windowsHide: true,
  })
  return result
}

function npxSupabaseStatus() {
  const result = runNpxSupabase(['--version'])
  if (result.error || result.status !== 0) return { available: false, detail: 'npx_not_available' }
  const version = (result.stdout || '').trim().split(/\r?\n/)[0] || 'version reported'
  return { available: true, detail: `npx supabase@2.116.0 (${version})` }
}

function supabaseAuthStatus() {
  const result = runNpxSupabase(['projects', 'list'])
  if (result.error || result.status !== 0) return { authenticated: false, detail: 'not_authenticated' }
  return { authenticated: true, detail: 'projects_list_succeeded' }
}

async function remoteStatus() {
  const rawUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!rawUrl || !anonKey) return { state: 'unconfigured', detail: 'Supabase URL and anonymous key are required' }

  let baseUrl
  try { baseUrl = new URL(rawUrl).origin } catch { return { state: 'unconfigured', detail: 'Supabase URL is invalid' } }

  try {
    const response = await fetch(`${baseUrl}/rest/v1/opportunities?select=id&limit=1`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      signal: AbortSignal.timeout(8000),
    })
    const body = await response.text()
    if (response.status === 404 && body.includes('PGRST205')) return { state: 'schema_not_applied', status: response.status, detail: 'public.opportunities is not available' }
    if (response.ok) return { state: 'schema_available', status: response.status, detail: 'public.opportunities is reachable' }
    return { state: 'query_error', status: response.status, detail: body.replace(/\s+/g, ' ').slice(0, 240) }
  } catch (error) {
    return { state: 'unreachable', detail: error instanceof Error ? error.message : String(error) }
  }
}

const migrationDir = path.join(root, 'supabase', 'migrations')
const seedDir = path.join(root, 'supabase', 'seed')
const migrations = fs.existsSync(migrationDir) ? fs.readdirSync(migrationDir).filter(file => file.endsWith('.sql')).sort() : []
const seeds = fs.existsSync(seedDir) ? fs.readdirSync(seedDir).filter(file => file.endsWith('.sql')).sort() : []
const opportunitySeeds = seeds.filter(file => file.startsWith('verified_central_'))
const remote = await remoteStatus()
const directSupabaseCli = commandStatus(process.platform === 'win32' ? 'supabase.cmd' : 'supabase')
const supabaseCli = directSupabaseCli.available ? directSupabaseCli : npxSupabaseStatus()
const supabaseAuth = supabaseCli.available ? supabaseAuthStatus() : { authenticated: false, detail: 'cli_unavailable' }
const vercelCli = commandStatus(process.platform === 'win32' ? 'vercel.cmd' : 'vercel')

const report = {
  generatedAt: new Date().toISOString(),
  safety: 'read_only_no_authentication_no_remote_writes',
  localInventory: {
    migrationFiles: migrations.length,
    seedFiles: seeds.length,
    opportunitySeedFiles: opportunitySeeds.length,
  },
  environmentPresence: {
    supabaseUrl: Boolean(readEnv('NEXT_PUBLIC_SUPABASE_URL')),
    supabaseAnonKey: Boolean(readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')),
    supabaseServiceRoleKey: Boolean(readEnv('SUPABASE_SERVICE_ROLE_KEY')),
    supabaseAccessToken: Boolean(readEnv('SUPABASE_ACCESS_TOKEN')),
    firecrawlApiKey: Boolean(readEnv('FIRECRAWL_API_KEY')),
    inngestKeys: Boolean(readEnv('INNGEST_EVENT_KEY') && readEnv('INNGEST_SIGNING_KEY')),
    resendApiKey: Boolean(readEnv('RESEND_API_KEY')),
  },
  remote,
  tools: { supabaseCli, supabaseAuth, vercelCli },
  readyForRemoteProvisioning: remote.state === 'schema_not_applied' && supabaseCli.available && supabaseAuth.authenticated,
  nextAction: remote.state === 'unreachable'
    ? 'Restore network access to Supabase, then rerun this report before any remote write.'
    : remote.state === 'schema_not_applied'
      ? 'Authenticate the Supabase CLI, run the guarded provisioning script, and execute remote release checks.'
      : remote.state === 'schema_available'
        ? 'Do not reseed blindly; inspect remote migration state and run release checks.'
        : 'Resolve environment or query errors before provisioning.',
}

const outputPath = path.join(root, 'docs', 'catalog-provisioning-readiness.json')
if (writeReport) fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (writeReport) console.log(`catalog provisioning readiness report written: ${path.relative(root, outputPath)}`)
if (requireReady && !report.readyForRemoteProvisioning) process.exitCode = 1
