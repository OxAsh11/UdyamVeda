import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

const packageJson = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const checks = Object.keys(packageJson.scripts)
  .filter(name => name.startsWith('catalog:') && name !== 'catalog:preflight')
  .filter(name => name !== 'catalog:remote-status')
  // Release-only checks are intentionally allowed to fail until external
  // provisioning and human review are complete; they have their own CI gate.
  .filter(name => !name.endsWith(':required'))
  .sort()

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

for (const check of checks) {
  console.log(`\n==> npm run ${check}`)
  const executable = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : npmCommand
  const args = process.platform === 'win32' ? ['/d', '/s', '/c', `${npmCommand} run ${check}`] : ['run', check]
  const result = spawnSync(executable, args, { stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

console.log(`\ncatalog preflight passed: ${checks.length} catalog checks`)
