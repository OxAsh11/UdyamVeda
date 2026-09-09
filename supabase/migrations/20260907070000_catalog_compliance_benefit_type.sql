-- Registration and compliance journeys can provide a non-cash compliance
-- outcome. Keep that distinct from a tax benefit or recognition award.

alter table public.opportunity_benefits
  drop constraint if exists opportunity_benefits_benefit_type_check;

alter table public.opportunity_benefits
  add constraint opportunity_benefits_benefit_type_check
  check (benefit_type in ('grant', 'loan', 'subsidy', 'tax', 'guarantee', 'reimbursement', 'recognition', 'training', 'market_access', 'mentorship', 'compliance'));
