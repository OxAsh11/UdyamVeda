-- Current NMDFC Term Loan reconciliation. Preserve viable-venture,
-- project-cost/share, route and ceiling-versus-entitlement boundaries.

do $$
declare
  term_loan_version_id uuid;
begin
  select current_version_id into term_loan_version_id
  from public.opportunities
  where slug = 'nmdfc-term-loan-employment-venture';

  if term_loan_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_scheme_route', 'https://www.nmdfc.org/nmdfcschemes',
        'current_faq_route', 'https://nmdfc.org/faq',
        'current_credit_line_1_route', 'https://nmdfc.org/credit-1',
        'current_credit_line_2_route', 'https://nmdfc.org/credit-2',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Confirm the credit line and apply through the relevant SCA/banking-partner route; UdyamVeda prepares and explains but does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current NMDFC schemes page, FAQ, Credit Line 1 and Credit Line 2 detail pages, lending-policy route and term-loan navigation were checked on 8 September 2026.',
        'credit_line_1_annual_family_income_max_inr', 300000,
        'credit_line_2_annual_family_income_max_inr', 800000,
        'credit_line_1_headline_credit_ceiling_inr', 2000000,
        'credit_line_2_headline_credit_ceiling_inr', 3000000,
        'credit_line_1_project_cost_max_inr', 2000000,
        'credit_line_2_project_cost_max_inr', 3000000,
        'nmdfc_project_cost_share_percent', 90,
        'credit_line_1_nmdfc_share_cap_inr', 1800000,
        'credit_line_2_nmdfc_share_cap_inr', 2700000,
        'beneficiary_min_contribution_percent', 5,
        'sca_financing_pattern', '90:5:5 NMDFC:SCA:beneficiary, subject to current SCA and lending-policy terms',
        'credit_line_1_beneficiary_interest_percent', 6,
        'credit_line_2_beneficiary_interest_percent_male', 8,
        'credit_line_2_beneficiary_interest_percent_women', 6,
        'beneficiary_moratorium_months', 6,
        'beneficiary_repayment_years', 5,
        'sca_repayment_years', 8,
        'utilization_period_months', 3,
        'viable_and_technically_feasible_venture_required', true,
        'headline_ceiling_is_not_guaranteed_sanction', true,
        'project_cost_and_nmdfc_share_must_remain_separate', true,
        'sca_or_banking_partner_route_required', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = term_loan_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select term_loan_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.nmdfc.org/nmdfcschemes', 'agency', 'NMDFC current schemes page', 'Current credit lines, term-loan ceilings, rates and route'),
      ('https://nmdfc.org/faq', 'agency', 'NMDFC current FAQ', 'Project ceilings, rate, moratorium, repayment, utilization and 90:5:5 financing pattern'),
      ('https://nmdfc.org/credit-1', 'agency', 'NMDFC Credit Line 1 detail', 'Project cost, 90% financing, INR 18 lakh NMDFC share cap, contribution and beneficiary terms'),
      ('https://nmdfc.org/credit-2', 'agency', 'NMDFC Credit Line 2 detail', 'Project cost, 90% financing, INR 27 lakh NMDFC share cap, contribution and beneficiary terms'),
      ('https://nmdfc.org/lendingpolicy', 'agency', 'NMDFC lending policy', 'Current policy navigation and amendment boundary'),
      ('https://nmdfc.org/termloan', 'agency', 'NMDFC term-loan route', 'Official term-loan navigation'),
      ('https://www.nmdfc.org/home/nmdfc_schemes', 'agency', 'NMDFC scheme landing page', 'Current scheme navigation and document route')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = term_loan_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
