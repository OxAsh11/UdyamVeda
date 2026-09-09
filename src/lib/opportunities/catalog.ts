import { SCHEMES, type Scheme } from '@/lib/data/schemes'
import type { OpportunitySummary, OpportunityType } from './types'

const schemeTypeMap: Record<Scheme['benefitType'], OpportunityType> = {
  financial: 'grant',
  equity: 'equity_investment',
  tax: 'tax_benefit',
  recognition: 'policy',
  credit: 'loan',
  training: 'training',
  subsidy: 'subsidy',
}

function coverageFor(scheme: Scheme): 'central' | 'state' | 'local' {
  return scheme.category === 'state' ? 'state' : 'central'
}

export function schemeToOpportunity(scheme: Scheme): OpportunitySummary {
  return {
    id: scheme.id,
    name: scheme.name,
    shortName: scheme.shortName,
    type: schemeTypeMap[scheme.benefitType] ?? 'scheme',
    category: scheme.category,
    authority: scheme.ministry,
    benefitLabel: scheme.benefitHeadline,
    benefitType: scheme.benefitType,
    description: scheme.description,
    officialUrl: scheme.officialUrl,
    deadline: scheme.deadline,
    processingTime: scheme.processingTime,
    tags: scheme.tags,
    status: 'active',
    coverage: coverageFor(scheme),
    sourceLabel: 'Legacy draft · official-source verification required',
    verificationStatus: 'legacy_draft',
    completeness: 0,
  }
}

export const OPPORTUNITY_CATALOG = SCHEMES.map(schemeToOpportunity)

export function searchOpportunities(query?: string, type?: string, coverage?: string) {
  const normalized = query?.trim().toLowerCase()
  return OPPORTUNITY_CATALOG.filter(item => {
    if (type && type !== 'all' && item.type !== type && item.category !== type) return false
    if (coverage && coverage !== 'all' && item.coverage !== coverage) return false
    if (!normalized) return true
    return [item.name, item.authority, item.description, ...item.tags].join(' ').toLowerCase().includes(normalized)
  })
}
