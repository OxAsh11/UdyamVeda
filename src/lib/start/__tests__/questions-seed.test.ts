import { describe, expect, it } from 'vitest'
import { BAND_RANGES, factKeysForRuleField, type RuleFieldMapping } from '@/lib/opportunities/fact-mapping'
import { factDefinitions, seed } from '@/lib/opportunities/engine/__tests__/seeds'
import { snapshotData } from '@/lib/opportunities/engine/__tests__/snapshot'
import { seedQuestions } from './seed-bundle'

// Facts M3's roadmap and readiness read, and calculator inputs no rule names.
const NEEDED_BEYOND_RULES = new Set([
  'district', 'needs_loan', 'premises_type', 'premises_owner', 'land_or_pond_status',
  'aadhaar_mobile_linked', 'has_pan', 'has_bank_account', 'gst_registered', 'shop_act_registered', 'fssai_status',
  'own_contribution_band', 'project_cost_exact_inr', 'matches_district_odop',
])

function fieldsIn(node: unknown): string[] {
  if (!node || typeof node !== 'object') return []
  const record = node as Record<string, unknown>
  if (Array.isArray(record.all)) return record.all.flatMap(fieldsIn)
  if (Array.isArray(record.any)) return record.any.flatMap(fieldsIn)
  return typeof record.field === 'string' ? [record.field] : []
}

const data = snapshotData()
const factKeys = new Set(factDefinitions.map(fact => fact.key))
const asked = new Set(seedQuestions.flatMap(question => question.facts))

function factsRuleReads(rules: unknown, ruleMappings: RuleFieldMapping[]) {
  const bank = new Set(ruleMappings.filter(mapping => mapping.treatment === 'bank_check').map(mapping => mapping.legacy_field))
  return fieldsIn(rules).filter(field => !bank.has(field)).flatMap(field => {
    const traced = factKeysForRuleField(field, ruleMappings)
    return traced.length ? traced : factKeys.has(field) ? [field] : []
  })
}

describe('the question set', () => {
  it('has unique ids', () => {
    expect(new Set(seedQuestions.map(question => question.id)).size).toBe(seedQuestions.length)
  })

  it('writes only real facts, each from one question', () => {
    const seen = new Set<string>()
    for (const question of seedQuestions) {
      expect(question.facts.length, question.id).toBeGreaterThan(0)
      for (const key of question.facts) {
        expect(factKeys.has(key), `${question.id}: ${key}`).toBe(true)
        expect(seen.has(key), `${key} asked twice`).toBe(false)
        seen.add(key)
      }
    }
  })

  it('is written in all three languages', () => {
    for (const question of seedQuestions) {
      for (const lang of ['en', 'hi', 'mr'] as const) expect(question[lang].trim().length, `${question.id} ${lang}`).toBeGreaterThan(0)
      const helps = [question.help_en, question.help_hi, question.help_mr].filter(Boolean)
      expect([0, 3], question.id).toContain(helps.length)
    }
  })

  it('has a question for every fact a tagged scheme reads, so no scheme asks what the flow cannot', () => {
    const missing = new Set<string>()
    for (const record of data.records.filter(item => item.packIds.length)) {
      for (const key of factsRuleReads(record.rules, data.mappings)) if (!asked.has(key)) missing.add(key)
    }
    // Either of these answers the derivation that reads both.
    missing.delete('incorporation_date')
    expect([...missing]).toEqual([])
  })

  it('asks nothing that no rule, rate or planned feature reads (PRD §7.1)', () => {
    const read = new Set<string>(NEEDED_BEYOND_RULES)
    for (const record of data.records) {
      for (const key of factsRuleReads(record.rules, data.mappings)) read.add(key)
      for (const rate of record.rates) for (const field of fieldsIn(rate.appliesWhen)) read.add(field)
    }
    const unread = [...asked].filter(key => !read.has(key))
    expect(unread).toEqual([])
  })

  it('never asks for an ID number', () => {
    for (const question of seedQuestions) {
      expect(question.en.toLowerCase(), question.id).not.toMatch(/\b(number|no\.)\b.*\b(aadhaar|pan|account)\b|\b(aadhaar|pan|account) (number|no)\b/)
      for (const key of question.facts) expect(key, question.id).not.toMatch(/_number$/)
    }
  })

  it('asks sensitive questions only at the funding stage, with a reason', () => {
    const sensitive = (factDefinitions as unknown as { key: string; sensitive?: boolean }[]).filter(fact => fact.sensitive).map(fact => fact.key)
    expect(sensitive.length).toBeGreaterThan(0)
    for (const question of seedQuestions.filter(item => item.facts.some(key => sensitive.includes(key)))) {
      expect(question.stage, question.id).toBe(8)
      for (const help of [question.help_en, question.help_hi, question.help_mr]) expect(help?.trim().length, question.id).toBeGreaterThan(0)
    }
  })
})

describe('the money bands', () => {
  const bands = factDefinitions.filter(fact => fact.type === 'band')

  it('all have ranges, except "prefer not to say"', () => {
    for (const fact of bands) {
      const codes = (fact.values ?? []).map(value => String(value[0])).filter(code => code !== 'prefer_not')
      expect(Object.keys(BAND_RANGES[fact.key] ?? {}).sort(), fact.key).toEqual([...codes].sort())
    }
  })

  it('cut the income band at Jharkhand\'s ₹5 lakh limit', () => {
    expect(BAND_RANGES.annual_family_income_band['3l_5l']).toEqual({ min: 300000, max: 500000 })
    expect(BAND_RANGES.annual_family_income_band['5l_6l']).toEqual({ min: 500000, max: 600000 })
    expect(BAND_RANGES.annual_family_income_band['3l_6l']).toBeUndefined()
  })

  it('no rate or rule still names the old band', () => {
    const rates = seed<unknown[]>('benefit-rates.json')
    expect(JSON.stringify(rates)).not.toContain('3l_6l')
  })
})

describe('the ODOP fact', () => {
  it('is in the dictionary and cannot be fixed by the founder', () => {
    const fact = factDefinitions.find(item => item.key === 'matches_district_odop')
    expect(fact).toMatchObject({ type: 'boolean', fixable: false, stage: 9 })
  })
})
