import { describe, expect, it } from 'vitest'
import { factDefinitions, packs, seed } from './seeds'

type RateRow = {
  slug: string
  applies_when: unknown
  area: string
  project_types: string[]
  own_pct: number
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

  it('give every scheme a fallback row for everyone', () => {
    for (const slug of new Set(rates.map(row => row.slug))) {
      const fallback = rates.filter(row => row.slug === slug && !row.applies_when && row.area === 'any' && row.project_types.includes('any'))
      expect(fallback.length, slug).toBeGreaterThan(0)
    }
  })

  it('never have own share and subsidy above the whole project', () => {
    for (const row of rates) expect(row.own_pct + row.subsidy_pct, row.slug).toBeLessThanOrEqual(100)
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
