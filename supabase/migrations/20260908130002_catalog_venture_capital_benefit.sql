-- Preserve venture-capital support as distinct from grants and loans.
alter table public.opportunity_benefits
  drop constraint opportunity_benefits_benefit_type_check;
alter table public.opportunity_benefits
  add constraint opportunity_benefits_benefit_type_check
  check (benefit_type in (
    'grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement',
    'recognition', 'training', 'market_access', 'mentorship',
    'compliance', 'equity', 'venture_capital'
  ));
