import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const file = fs.readFileSync(path.join(root, 'supabase', 'seed', 'zz_catalog_source_resolution_alternates.sql'), 'utf8')

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

assert(file.startsWith('-- Review-only alternate official sources'), 'alternate-source seed must declare its review-only boundary')
assert(file.includes("on conflict (url) do update"), 'alternate source registry rows must be idempotent')
assert(file.includes('jsonb_array_elements'), 'alternate opportunity-source bindings must be data-driven')
assert(file.includes('is_primary)'), 'alternate opportunity-source bindings must set primary status explicitly')
assert(file.includes("item->>'content_hash', false"), 'alternate opportunity-source bindings must remain non-primary')
assert(file.includes('not exists'), 'alternate opportunity-source bindings must be rerunnable without duplicates')
assert(!/is_primary\s*\)\s*select[\s\S]*true/i.test(file), 'alternate source seed must not insert primary evidence')

const registryBlock = file.split('do $$', 1)[0]
const registryUrls = [...registryBlock.matchAll(/'((?:https?:\/\/)[^']+)'/g)].map(match => match[1])
const alternateUrls = [...file.matchAll(/"url":"((?:https?:\/\/)[^"]+)"/g)].map(match => match[1])

assert(registryUrls.length === 14, `expected 14 explicit alternate registry URLs, found ${registryUrls.length}`)
assert(alternateUrls.length === 14, `expected 14 alternate opportunity bindings, found ${alternateUrls.length}`)
assert(new Set(registryUrls).size === registryUrls.length, 'alternate registry URLs must be unique')
assert(new Set(alternateUrls).size === alternateUrls.length, 'alternate opportunity URLs must be unique')
assert(alternateUrls.every(url => registryUrls.includes(url)), 'every opportunity alternate must be registered explicitly')

const hashes = [...file.matchAll(/"content_hash":"([a-f0-9]{64})"/g)].map(match => match[1])
assert(hashes.length === alternateUrls.length, 'every alternate evidence binding must carry a SHA-256 content hash')

console.log(`catalog source-resolution alternates check passed: ${alternateUrls.length} explicit official alternates remain non-primary and review-gated`)
