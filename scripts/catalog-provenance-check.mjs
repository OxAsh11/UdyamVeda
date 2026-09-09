import fs from 'node:fs'
import path from 'node:path'

const seedDir = path.join(process.cwd(), 'supabase', 'seed')
const implementingAgencyHosts = new Set(['cgtmse.in', 'standupmitra.in', 'nsic.co.in', 'nvcfl.co.in', 'ncgtc.in', 'jansamarth.in', 'sidbi.in', 'sidbiventure.co.in', 'nabventures.in', 'nabard.org', 'udyamitra.in', 'udyamimitra.in', 'pliauto.in', 'ncdc.in', 'mstcecommerce.com', 'eil.co.in', 'sezonline-ndml.co.in', 'plidrone.ifciltd.com', 'ifcicegssc.in', 'nmdfc.org', 'cpcbeprplastic.in', 'crsbis.in', 'manakonline.in', 'nivedi.res.in', 'mudra.org.in', 'nidhi-eir.in', 'ifciventure.com', 'eprewastecpcb.in', 'qcinnovation.co.in', 'samgnya.in', 'qmettech.com', 'qmdhub.co.in', 'cpri.res.in', 'sansad.in'])
const failures = []
let urlCount = 0

function urlsIn(text) {
  return [
    ...text.matchAll(/'(?<url>https:\/\/[^']+)'/g),
    ...text.matchAll(/"(?<url>https:\/\/[^\"]+)"/g),
  ].map(match => match.groups.url.replace(/[),.;]+$/g, ''))
}

function isOfficialHost(host) {
  const normalized = host.toLowerCase()
  return normalized === 'gov.in'
    || normalized.endsWith('.gov.in')
    || normalized === 'nic.in'
    || normalized.endsWith('.nic.in')
    || [...implementingAgencyHosts].some(allowed => normalized === allowed || normalized.endsWith(`.${allowed}`))
}

for (const file of fs.readdirSync(seedDir).filter(name => name.endsWith('.sql')).sort()) {
  const sql = fs.readFileSync(path.join(seedDir, file), 'utf8')
  for (const value of urlsIn(sql)) {
    try {
      const url = new URL(value)
      urlCount += 1
      if (url.protocol !== 'https:' || !isOfficialHost(url.hostname)) failures.push(`${file}: ${value}`)
    } catch {
      failures.push(`${file}: invalid URL ${value}`)
    }
  }
}

if (failures.length) {
  console.error('catalog provenance check failed:\n' + failures.join('\n'))
  process.exit(1)
}

console.log(`catalog provenance check passed: ${urlCount} seed URLs use official Government or allowlisted implementing-agency hosts`)
