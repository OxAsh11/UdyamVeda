import { describe, expect, it } from 'vitest'
import { factDefinitions, packs, seed } from './seeds'

type RateRow = {
  slug: string
  applies_when: unknown
  area: string
  project_types: string[]
  own_pct?: number
  label_en: string
  subsidy_pct: number
  source_url: string
  quote: string
}

const tags = seed<Record<string, string[]>>('opportunity-packs.json')
const rates = seed<RateRow[]>('benefit-rates.json')
const fact = (key: string) => factDefinitions.find(definition => definition.key === key)!

function fieldsIn(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const record = node as Record<string, unknown>
  if (Array.isArray(record.all)) return record.all.flatMap(fieldsIn)
  if (Array.isArray(record.any)) return record.any.flatMap(fieldsIn)
  return typeof record.field === 'string' ? [record.field] : []
}

describe('pack tags', () => {
  it('name real packs', () => {
    const packIds = packs.map(pack => pack.id)
    for (const [slug, tagged] of Object.entries(tags)) {
      expect(tagged.length, slug).toBeGreaterThan(0)
      for (const pack of tagged) expect(packIds, slug).toContain(pack)
    }
  })
})

describe('benefit rates', () => {
  it('each carry an https source and a quote', () => {
    for (const row of rates) {
      expect(row.source_url, row.slug).toMatch(/^https:\/\//)
      expect(row.quote.trim().length, row.slug).toBeGreaterThan(0)
    }
  })

  it('only use dictionary facts in applies_when', () => {
    for (const row of rates) {
      for (const field of fieldsIn(row.applies_when)) expect(fact(field), `${row.slug}: ${field}`).toBeDefined()
    }
  })

  it('never have own share and subsidy above the whole project', () => {
    for (const row of rates) expect((row.own_pct ?? 0) + row.subsidy_pct, row.slug).toBeLessThanOrEqual(100)
  })

  it('leave own share out, rather than saying nil, unless the source states it', () => {
    const stated = new Set(rates.filter(row => row.own_pct !== undefined).map(row => row.slug))
    expect([...stated].sort()).toEqual(['cm-yuva-uttar-pradesh', 'cmegp-maharashtra', 'mukhyamantri-rojgar-srijan-yojana-jharkhand', 'mukhyamantri-udyami-yojana-bihar'])
  })

  it('test the herd size NLM requires on every row', () => {
    const nlm = rates.filter(row => row.slug === 'national-livestock-mission-entrepreneurship-development')
    expect(nlm.length).toBeGreaterThan(0)
    for (const row of nlm) expect(fieldsIn(row.applies_when).some(field => /count|females|sow/.test(field)), row.label_en).toBe(true)
  })

  it('include the PRD worked example: CMEGP special category in a town', () => {
    const row = rates.find(candidate => candidate.slug === 'cmegp-maharashtra' && candidate.area === 'urban' && candidate.applies_when && candidate.project_types.includes('service'))!
    expect(row).toMatchObject({ own_pct: 5, subsidy_pct: 25 })
  })
})

describe('herd sizes', () => {
  it('are not fixable, so a small keeper is never told they are one step away', () => {
    for (const key of ['small_ruminant_females', 'small_ruminant_males', 'sow_count', 'boar_count', 'poultry_bird_count']) {
      expect(fact(key).fixable, key).toBe(false)
    }
  })
})
