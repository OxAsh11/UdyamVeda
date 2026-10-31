import type { OpportunityGroup } from './taxonomy'

// Group sets behind the dashboard's `?type=` shortcuts.
export const TYPE_FILTERS: Record<string, { label: string; groups: OpportunityGroup[] }> = {
  grant: { label: 'Grants & awards', groups: ['grant'] },
  loan: { label: 'Loans & subsidies', groups: ['loan_credit', 'subsidy_incentive'] },
  accelerator: { label: 'Incubation & mentoring', groups: ['incubation'] },
}
