-- Equity-capital access is materially different from grants, loans and
-- subsidies. Keep it explicit so recommendation copy cannot mislabel it.

alter table public.opportunity_benefits
  drop constraint if exists opportunity_benefits_benefit_type_check;

alter table public.opportunity_benefits
  add constraint opportunity_benefits_benefit_type_check
  check (benefit_type in ('grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement', 'recognition', 'training', 'market_access', 'mentorship', 'compliance', 'equity_investment'));
