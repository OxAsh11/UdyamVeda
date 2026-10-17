export const CATEGORY_LABELS: Record<string, string> = {
  startup: 'Startup',
  msme: 'MSME',
  credit: 'Credit & Loans',
  women: 'Women',
  'sc-st': 'SC/ST',
  sector: 'Sector-specific',
  state: 'State scheme',
  skill: 'Skill & Trade',
}

// The live catalog stores ~70 specific `opportunity_type` values. Every
// filter, badge and grouping uses these ten groups instead; this map is the
// single place to place a new type.
export const OPPORTUNITY_GROUPS = {
  grant: 'Grants & awards',
  loan_credit: 'Loans & credit',
  subsidy_incentive: 'Subsidies & incentives',
  equity: 'Equity & venture funding',
  tax: 'Tax benefits',
  incubation: 'Incubation & mentoring',
  market_access: 'Market access & procurement',
  registration_compliance: 'Registration & compliance',
  skills: 'Skills & training',
  enterprise_support: 'Technology & enterprise support',
} as const

export type OpportunityGroup = keyof typeof OPPORTUNITY_GROUPS

const GROUP_BY_TYPE: Record<string, OpportunityGroup> = {
  grant: 'grant', innovation_grant: 'grant', research_grant: 'grant', advanced_research_grant: 'grant',
  clinical_studies_grant: 'grant', cluster_infrastructure_grant: 'grant', shipyard_capacity_grant: 'grant',
  shipbuilding_cluster_grant: 'grant', award: 'grant', challenge: 'grant',
  loan: 'loan_credit', concessional_loan: 'loan_credit', guarantee: 'loan_credit', credit_guarantee: 'loan_credit',
  credit_risk_coverage: 'loan_credit', microfinance: 'loan_credit', artisan_credit: 'loan_credit',
  credit_readiness: 'loan_credit', technology_finance: 'loan_credit', green_finance: 'loan_credit',
  subsidy: 'subsidy_incentive', capital_subsidy: 'subsidy_incentive', credit_subsidy: 'subsidy_incentive',
  manufacturing_incentive: 'subsidy_incentive', production_linked_incentive: 'subsidy_incentive',
  employment_incentive: 'subsidy_incentive', reimbursement: 'subsidy_incentive',
  certification_reimbursement: 'subsidy_incentive', shipbuilding_financial_assistance: 'subsidy_incentive',
  equity_investment: 'equity', venture_capital: 'equity',
  tax_benefit: 'tax',
  incubator: 'incubation', incubation: 'incubation', accelerator: 'incubation', startup_support: 'incubation', mentorship: 'incubation',
  market_access: 'market_access', procurement: 'market_access', procurement_policy: 'market_access',
  procurement_market_access: 'market_access', event: 'market_access',
  registration: 'registration_compliance', licence: 'registration_compliance', compliance: 'registration_compliance',
  compliance_registration: 'registration_compliance', compliance_support: 'registration_compliance',
  certification: 'registration_compliance', product_certification: 'registration_compliance',
  environmental_compliance: 'registration_compliance', environmental_approval: 'registration_compliance',
  training: 'skills', training_support: 'skills', skill_development: 'skills', skill_development_support: 'skills',
  apprenticeship_support: 'skills',
}

/** Group for any catalog type, falling back to keywords for unmapped values. */
export function opportunityGroup(type: string): OpportunityGroup {
  const known = GROUP_BY_TYPE[type]
  if (known) return known
  if (/grant|award|challenge/.test(type)) return 'grant'
  if (/loan|credit|guarantee|financ/.test(type)) return 'loan_credit'
  if (/subsid|incentive|reimburse/.test(type)) return 'subsidy_incentive'
  if (/equity|venture/.test(type)) return 'equity'
  if (/tax/.test(type)) return 'tax'
  if (/incubat|accelerat|mentor|startup/.test(type)) return 'incubation'
  if (/market|procure|export|event/.test(type)) return 'market_access'
  if (/regist|licen|complian|certif|approval/.test(type)) return 'registration_compliance'
  if (/train|skill|apprentic/.test(type)) return 'skills'
  return 'enterprise_support'
}

export const BENEFIT_TYPE_LABELS: Record<string, string> = {
  financial: 'Grant / Fund',
  equity: 'Equity investment',
  tax: 'Tax benefit',
  recognition: 'Recognition',
  credit: 'Loan / Credit',
  training: 'Training',
  subsidy: 'Subsidy',
}
