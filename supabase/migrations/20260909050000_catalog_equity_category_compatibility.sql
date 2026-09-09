-- Retain the existing equity_investment category alongside venture capital.
alter table public.opportunity_benefits
  drop constraint opportunity_benefits_benefit_type_check;
alter table public.opportunity_benefits
  add constraint opportunity_benefits_benefit_type_check
  check (benefit_type in (
    'grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement',
    'recognition', 'training', 'market_access', 'mentorship',
    'compliance', 'equity', 'equity_investment', 'venture_capital'
  ));
