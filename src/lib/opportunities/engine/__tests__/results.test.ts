import { describe, expect, it } from 'vitest'
import { factKeysForRuleField } from '../../fact-mapping'
import { catalogVersion, hydrateCatalog } from '../catalog'
import { classifyRecord } from '../classify'
import { cleanFacts } from '../facts'
import { buildResults, type ResultsPayload } from '../results'
import type { Bucket, EngineRecord } from '../types'
import { seed } from './seeds'
import { snapshotCatalog, snapshotData } from './snapshot'

const now = new Date('2026-10-31T00:00:00Z')
const catalog = snapshotCatalog()

function resultsFor(raw: Record<string, unknown>, from = catalog): ResultsPayload {
  const { facts, nonAnswers } = cleanFacts(raw, from.definitions, from.activityIds)
  return buildResults(facts, nonAnswers, from, now)
}

function bucketOf(payload: ResultsPayload, slug: string): Bucket | null {
  for (const bucket of ['A', 'B', 'C', 'D'] as const) {
    if (payload.buckets[bucket].some(item => item.slug === slug)) return bucket
  }
  return null
}

const all = (payload: ResultsPayload) => (['A', 'B', 'C', 'D'] as const).flatMap(bucket => payload.buckets[bucket])
const find = (payload: ResultsPayload, slug: string) => all(payload).find(item => item.slug === slug)!

const NLM = 'national-livestock-mission-entrepreneurship-development'
const PMMSY = 'pmmsy-beneficiary-oriented-subsidy'
const KCC = 'kisan-credit-card-animal-husbandry-fisheries'
const MMUY = 'mukhyamantri-udyami-yojana-bihar'
const CMEGP = 'cmegp-maharashtra'
const CM_YUVA = 'cm-yuva-uttar-pradesh'
const PMEGP = 'prime-ministers-employment-generation-programme'
const SISFS = 'startup-india-seed-fund-scheme'

const rakesh = {
  activity_codes: ['poultry_broiler', 'pond_fish'],
  state: 'bihar',
  applicant_age_years: 34,
  education_level: 'class_12',
  social_category: 'sc',
  poultry_unit_type: 'broiler',
  poultry_bird_count: 500,
}
const pooja = {
  activity_codes: ['beauty_parlour_salon'],
  state: 'maharashtra',
  area_type: 'urban',
  gender: 'woman',
  applicant_age_years: 32,
  education_level: 'class_12',
  entity_type: 'not_registered',
  stage: 'setting_up',
  received_govt_subsidy_before: false,
  project_cost_exact_inr: 800000,
}
const imran = {
  activity_codes: ['carpentry_furniture'],
  state: 'uttar_pradesh',
  applicant_age_years: 31,
  education_level: 'class_10',
  received_govt_subsidy_before: false,
}

describe('PRD personas on the real catalog', () => {
  it('Rakesh: told plainly NLM is not for a 500-bird shed', () => {
    expect(bucketOf(resultsFor(rakesh), NLM)).toBe('D')
  })

  it('Rakesh: PMMSY waits on renewal', () => {
    expect(bucketOf(resultsFor(rakesh), PMMSY)).toBe('C')
  })

  it('Rakesh: Bihar MMUY window is closed', () => {
    expect(bucketOf(resultsFor(rakesh), MMUY)).toBe('C')
  })

  it('Rakesh: KCC is open now', () => {
    expect(bucketOf(resultsFor(rakesh), KCC)).toBe('A')
  })

  it('Rakesh: never sees a Maharashtra scheme', () => {
    expect(bucketOf(resultsFor(rakesh), CMEGP)).toBeNull()
  })

  it('Pooja: CMEGP is open, with ₹2 lakh subsidy on ₹8 lakh', () => {
    const payload = resultsFor(pooja)
    expect(bucketOf(payload, CMEGP)).toBe('A')
    expect(find(payload, CMEGP).lines?.subsidy).toEqual({ min: 200000, max: 200000 })
    expect(find(payload, CMEGP).lines?.own).toEqual({ min: 40000, max: 40000 })
    expect(find(payload, CMEGP).lines?.loan).toEqual({ min: 560000, max: 560000 })
  })

  it('Pooja: no other state schemes', () => {
    const slugs = all(resultsFor(pooja)).map(item => item.slug)
    for (const slug of [MMUY, CM_YUVA, 'bihar-laghu-udyami-yojana', 'shop-establishment-bihar']) expect(slugs).not.toContain(slug)
  })

  it('Imran: CM-YUVA is open and PMEGP is not offered as open', () => {
    const payload = resultsFor(imran)
    expect(bucketOf(payload, CM_YUVA)).toBe('A')
    expect(bucketOf(payload, PMEGP)).not.toBe('A')
  })
})

describe('owner test personas on the real catalog', () => {
  it('fisheries founder: PMMSY shows 60% marked "if renewed"', () => {
    const payload = resultsFor({ activity_codes: ['pond_fish'], state: 'bihar', social_category: 'sc', project_cost_exact_inr: 1000000 })
    expect(bucketOf(payload, PMMSY)).toBe('C')
    expect(find(payload, PMMSY).lines).toMatchObject({ ifRenewed: true, subsidy: { min: 600000, max: 600000 } })
  })

  it('poultry founder: a 1,200 parent-layer hatchery qualifies for NLM', () => {
    const payload = resultsFor({ activity_codes: ['poultry_breeding_hatchery'], state: 'jharkhand', poultry_unit_type: 'hatchery', poultry_bird_count: 1200 })
    expect(bucketOf(payload, NLM)).toBe('A')
  })

  it('tech founder: sees the closed seed fund, and nothing about fisheries', () => {
    const payload = resultsFor({ activity_codes: ['software_it_services'], state: 'delhi', dpiit_recognized: false })
    expect(bucketOf(payload, SISFS)).toBe('C')
    expect(bucketOf(payload, PMMSY)).toBeNull()
    expect(bucketOf(payload, NLM)).toBeNull()
  })
})

describe('registrations and schemes (PRD §1)', () => {
  it('keeps registrations out of the scheme buckets', () => {
    const payload = resultsFor(pooja)
    for (const slug of ['udyam-registration', 'gst-registration', 'epfo-establishment-registration', 'shop-establishment-maharashtra']) {
      expect(bucketOf(payload, slug), slug).toBeNull()
    }
  })

  it('returns them separately for the roadmap, with their own verdict', () => {
    const payload = resultsFor(pooja)
    const slugs = payload.registrations.map(item => item.slug)
    expect(slugs).toContain('udyam-registration')
    expect(slugs).toContain('shop-establishment-maharashtra')
    expect(slugs).not.toContain('shop-establishment-bihar')
  })

  it('does not count registrations in the bucket totals', () => {
    const payload = resultsFor(pooja)
    expect(payload.counts.A).toBe(payload.buckets.A.length)
    expect(payload.buckets.A.every(item => !['registration', 'licence'].includes(item.type))).toBe(true)
  })

  it('asks Rakesh about family income for the Bihar Laghu scheme', () => {
    const steps = find(resultsFor(rakesh), 'bihar-laghu-udyami-yojana').steps
    expect(steps).toContainEqual({ kind: 'answer', factKey: 'annual_family_income_band' })
  })
})

describe('what is in the list', () => {
  it('drops other states once the state is known', () => {
    expect(bucketOf(resultsFor({ state: 'bihar' }), CMEGP)).toBeNull()
  })

  it('keeps state schemes while the state is unknown', () => {
    expect(bucketOf(resultsFor({ activity_codes: ['beauty_parlour_salon'] }), CMEGP)).not.toBeNull()
  })

  it('drops other packs once the activity is known', () => {
    expect(bucketOf(resultsFor({ activity_codes: ['beauty_parlour_salon'] }), PMMSY)).toBeNull()
  })

  it('merges two packs: poultry + pickles sees both', () => {
    const payload = resultsFor({ activity_codes: ['poultry_broiler', 'pickles_chutney'] })
    expect(bucketOf(payload, NLM)).not.toBeNull()
    expect(bucketOf(payload, 'pm-formalisation-micro-food-processing-enterprises')).not.toBeNull()
  })

  it('every tagged record exists in the catalog', () => {
    const slugs = new Set(catalog.records.map(record => record.slug))
    for (const slug of Object.keys(seed<Record<string, string[]>>('opportunity-packs.json'))) expect(slugs.has(slug), slug).toBe(true)
  })
})

describe('untagged records such as PLI and shipbuilding (PRD §4)', () => {
  const data = snapshotData()
  const untagged = (rules: unknown): EngineRecord => ({
    ...data.records[0],
    id: 'untagged',
    slug: 'untagged-scheme',
    status: 'active',
    packIds: [],
    coverage: 'central',
    locations: ['India'],
    windows: [{ windowType: 'rolling', opensAt: null, closesAt: null }],
    lastCheckedAt: '2026-10-30T00:00:00Z',
    rates: [],
    rules,
  })
  const withRecord = (record: EngineRecord) => {
    const next = { ...data, records: [record] }
    return hydrateCatalog({ ...next, version: catalogVersion(next) })
  }

  it('stay hidden when only bank checks passed', () => {
    const bankField = data.mappings.find(mapping => mapping.treatment === 'bank_check')!.legacy_field
    const payload = resultsFor({ state: 'bihar' }, withRecord(untagged({ all: [{ field: bankField, operator: 'equals', value: true }] })))
    expect(all(payload)).toHaveLength(0)
  })

  it('stay hidden when the founder only partly qualifies', () => {
    const payload = resultsFor({ state: 'bihar' }, withRecord(untagged({ all: [{ field: 'state', operator: 'equals', value: 'bihar' }] })))
    expect(all(payload)).toHaveLength(0)
  })

  it('appear in A once entity type and project size both qualify', () => {
    const rules = { all: [
      { field: 'entity_type', operator: 'equals', value: 'llp' },
      { field: 'project_cost_band', operator: 'equals', value: 'above_2cr' },
    ] }
    const record = withRecord(untagged(rules))
    expect(all(resultsFor({ entity_type: 'llp', project_cost_exact_inr: 500000 }, record))).toHaveLength(0)
    expect(bucketOf(resultsFor({ entity_type: 'llp', project_cost_exact_inr: 200000000 }, record), 'untagged-scheme')).toBe('A')
  })
})

describe('combination', () => {
  it('comes only from bucket A, so PMEGP in C is not a candidate', () => {
    const payload = resultsFor(pooja)
    expect(payload.combination.recommended).toContain(find(payload, CMEGP).id)
    expect(payload.combination.recommended).not.toContain(find(payload, PMEGP).id)
    expect(payload.combination.alternatives.map(item => item.id)).not.toContain(find(payload, PMEGP).id)
  })

  it('shows Mudra beside CMEGP as not confirmed, though Mudra has no rates yet', () => {
    const payload = resultsFor(pooja)
    const mudra = payload.combination.alternatives.find(item => item.id === find(payload, 'pradhan-mantri-mudra-yojana').id)
    expect(mudra?.notConfirmedWith).toEqual([find(payload, CMEGP).id])
  })
})

describe('project cost against a scheme limit', () => {
  it('moves a project above the limit to D and says why', () => {
    const payload = resultsFor({ ...pooja, project_cost_exact_inr: 6000000 })
    const cmegp = find(payload, CMEGP)
    expect(cmegp.bucket).toBe('D')
    expect(cmegp.lines).toBeNull()
    expect(cmegp.blockers.join(' ')).toMatch(/above this scheme's limit/)
    expect(payload.combination.recommended).not.toContain(cmegp.id)
  })

  it('gives the limit as a number, so the page can say it in the founder\'s language', () => {
    const cmegp = find(resultsFor({ ...pooja, project_cost_exact_inr: 6000000 }), CMEGP)
    expect(cmegp.aboveLimitInr).toBe(5000000)
    expect(find(resultsFor(pooja), CMEGP).aboveLimitInr).toBeNull()
  })

  it('does the same for Jharkhand MRSY at ₹5 crore', () => {
    const payload = resultsFor({ activity_codes: ['pond_fish'], state: 'jharkhand', applicant_age_years: 25, social_category: 'st', annual_family_income_band: '2l_3l', received_govt_subsidy_before: false, project_cost_exact_inr: 50000000 })
    expect(bucketOf(payload, 'mukhyamantri-rojgar-srijan-yojana-jharkhand')).toBe('D')
  })

  it('asks the exact cost when the band crosses the limit, rather than saying eligible', () => {
    const payload = resultsFor({ ...pooja, project_cost_exact_inr: undefined, project_cost_band: '50l_1cr' })
    const cmegp = find(payload, CMEGP)
    expect(cmegp.bucket).toBe('B')
    expect(cmegp.steps).toContainEqual({ kind: 'answer', factKey: 'project_cost_exact_inr' })
    expect(payload.combination.recommended).not.toContain(cmegp.id)
  })
})

describe('honest buckets', () => {
  it('a home pickle maker is not told an agro-cluster grant is open to them because nothing was tested', () => {
    const payload = resultsFor({ activity_codes: ['pickles_chutney'], state: 'maharashtra', project_cost_band: '2l_5l' })
    expect(bucketOf(payload, 'mofpi-agro-processing-cluster-pmksy')).not.toBe('A')
  })

  it('nothing reaches A without a founder fact behind it', () => {
    for (const person of [rakesh, pooja, imran, {}]) {
      for (const item of resultsFor(person).buckets.A) expect(item.decidedBy.length, item.slug).toBeGreaterThan(0)
    }
  })

  it('marks figures as "if renewed" on an active record that is in C because its date passed', () => {
    const data = snapshotData()
    const record = data.records.find(item => item.slug === CMEGP)!
    const stale = { ...data, records: [{ ...record, lastCheckedAt: '2026-01-01T00:00:00Z' }] }
    const payload = resultsFor(pooja, hydrateCatalog({ ...stale, version: catalogVersion(stale) }))
    expect(find(payload, CMEGP).bucket).toBe('C')
    expect(find(payload, CMEGP).lines?.ifRenewed).toBe(true)
  })
})

describe('what a results card needs', () => {
  it('never suggests answering something the founder declined', () => {
    const payload = resultsFor({ ...pooja, gender: 'prefer_not' })
    const lines = find(payload, CMEGP).lines
    expect(lines).not.toBeNull()
    expect(lines?.betterIfAnswered).not.toContain('gender')
  })

  it('still suggests something the founder simply has not answered', () => {
    expect(find(resultsFor({ ...pooja, gender: undefined }), CMEGP).lines?.betterIfAnswered).toContain('gender')
  })

  it('carries the window dates', () => {
    const record = catalog.records.find(item => item.slug === MMUY)!
    expect(find(resultsFor(rakesh), MMUY).windows).toEqual(record.windows)
    expect(record.windows[0].closesAt).toBeTruthy()
  })
})

describe('Stand-Up India and declined answers', () => {
  const STAND_UP = 'stand-up-india-scheme'

  it.each([
    ['a man who declined his category', { gender: 'man', social_category: 'prefer_not' }],
    ['someone who declined gender and said general', { gender: 'prefer_not', social_category: 'general' }],
    ['a man who does not know his category', { gender: 'man', social_category: 'dont_know' }],
    ['a man who has not been asked yet', { gender: 'man' }],
  ])('%s is not told "not for you"', (_who, facts) => {
    expect(bucketOf(resultsFor(facts), STAND_UP)).not.toBe('D')
  })

  it('a general-category man is', () => {
    expect(bucketOf(resultsFor({ gender: 'man', social_category: 'general', applicant_age_years: 30 }), STAND_UP)).toBe('D')
  })
})

describe('an unanswered question never rules a founder out (whole catalog)', () => {
  function fields(node: unknown): string[] {
    if (!node || typeof node !== 'object') return []
    const record = node as Record<string, unknown>
    if (Array.isArray(record.all)) return record.all.flatMap(fields)
    if (Array.isArray(record.any)) return record.any.flatMap(fields)
    return typeof record.field === 'string' ? [record.field] : []
  }
  const profiles: Record<string, unknown>[] = [
    {},
    { gender: 'man' },
    { gender: 'woman' },
    { social_category: 'general' },
    { social_category: 'sc' },
    { gender: 'man', social_category: 'general' },
    { entity_type: 'proprietorship' },
    { udyam_registered: false },
  ]

  it('if a record is D without an answer, no real answer can rescue it', () => {
    const { mappings, reviewerChecks } = catalog.context
    const context = { ...catalog.context, derivation: { ...catalog.context.derivation, now } }
    const bad: string[] = []
    for (const record of catalog.records) {
      const keys = new Set(fields(record.rules).flatMap(field => {
        const traced = factKeysForRuleField(field, mappings)
        return traced.length ? traced : reviewerChecks.has(field) ? [] : [field]
      }))
      for (const profile of profiles) {
        for (const key of keys) {
          const definition = catalog.definitions.find(item => item.key === key)
          const answers: unknown[] = definition?.type === 'boolean' ? [true, false] : (definition?.values ?? []).filter(value => value !== 'prefer_not')
          if (!answers.length) continue
          const unanswered = { ...profile }
          delete unanswered[key]
          if (classifyRecord(record, unanswered, context, now).bucket !== 'D') continue
          for (const answer of answers) {
            if (classifyRecord(record, { ...unanswered, [key]: answer }, context, now).bucket !== 'D') bad.push(`${record.slug}: ${key}=${String(answer)} with ${JSON.stringify(profile)}`)
          }
        }
      }
    }
    expect(bad).toEqual([])
  })
})

describe('ranking inside a bucket', () => {
  it('puts the larger subsidy first in A', () => {
    const amounts = resultsFor(pooja).buckets.A.map(item => item.lines?.subsidy.max ?? -1)
    const rated = amounts.filter(amount => amount >= 0)
    expect(rated).toEqual([...rated].sort((left, right) => right - left))
    expect(amounts.indexOf(-1) === -1 || amounts.slice(amounts.indexOf(-1)).every(amount => amount === -1)).toBe(true)
  })

  it('puts the fewest steps first in B', () => {
    const steps = resultsFor(imran).buckets.B.map(item => item.steps.length)
    expect(steps).toEqual([...steps].sort((left, right) => left - right))
  })

  it('lists D by name', () => {
    const slugs = resultsFor(rakesh).buckets.D.map(item => item.slug)
    expect(slugs).toEqual([...slugs].sort((left, right) => left.localeCompare(right)))
  })
})

describe('non-answers', () => {
  it('never nags about an answer the founder declined', () => {
    const payload = resultsFor({ activity_codes: ['pond_fish'], state: 'jharkhand', social_category: 'prefer_not' })
    expect(payload.nonAnswers).toEqual({ social_category: 'declined' })
    const asked = all(payload).flatMap(item => item.steps).filter(step => step.factKey === 'social_category')
    expect(asked).toEqual([])
  })

  it('does not rule a founder out for declining', () => {
    const declined = resultsFor({ activity_codes: ['pond_fish'], state: 'jharkhand', social_category: 'prefer_not' })
    expect(bucketOf(declined, 'mukhyamantri-rojgar-srijan-yojana-jharkhand')).not.toBe('D')
  })
})

describe('reliability', () => {
  it('gives the same result for the same facts and catalog', () => {
    expect(resultsFor(rakesh)).toEqual(resultsFor(rakesh))
  })

  it('survives a JSON round trip', () => {
    const payload = resultsFor({ ...pooja, project_cost_exact_inr: undefined, project_cost_band: 'above_2cr' })
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload)
  })

  it('works with no answers at all', () => {
    const payload = resultsFor({})
    expect(payload.counts.D).toBe(0)
    expect(payload.counts.A + payload.counts.B + payload.counts.C).toBeGreaterThan(0)
  })

  it('counts match the lists', () => {
    const payload = resultsFor(rakesh)
    for (const bucket of ['A', 'B', 'C', 'D'] as const) expect(payload.counts[bucket]).toBe(payload.buckets[bucket].length)
  })

  it('uses the request date, not the date the catalog was cached', () => {
    const { facts } = cleanFacts({ operating_since: '2024-10-31' }, catalog.definitions, catalog.activityIds)
    const later = buildResults(facts, {}, catalog, new Date('2030-01-01T00:00:00Z'))
    expect(later.counts.A).toBe(0)
  })

  it('carries how to apply and the one-line benefit onto each result', () => {
    const payload = resultsFor(rakesh)
    const byId = new Map(catalog.records.map(record => [record.id, record]))
    const listed = [...all(payload), ...payload.registrations]
    expect(listed.length).toBeGreaterThan(0)
    for (const item of listed) {
      expect(item.applyRoute).toBe(byId.get(item.id)!.applyRoute)
      expect(item.benefitHeadline).toBe(byId.get(item.id)!.benefitHeadline)
    }
    expect(find(payload, KCC).applyRoute).toMatch(/bank branch/)
    expect(find(payload, KCC).benefitHeadline).toBe('Working capital at an effective 4% interest')
  })

  it('reports a new catalog version when the headline changes', () => {
    const data = snapshotData()
    const changed = { ...data, records: data.records.map(record => (record.slug === KCC ? { ...record, benefitHeadline: 'A different headline' } : record)) }
    expect(catalogVersion(changed)).not.toBe(catalogVersion(data))
  })

  it('reports a new catalog version when a rate changes', () => {
    const data = snapshotData()
    const changed = {
      ...data,
      records: data.records.map(record => (record.slug === CMEGP ? { ...record, rates: [] } : record)),
    }
    expect(catalogVersion(changed)).not.toBe(catalogVersion(data))
  })
})
