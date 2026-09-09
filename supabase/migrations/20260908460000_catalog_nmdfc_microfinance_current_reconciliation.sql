-- Current NMDFC Micro-Finance reconciliation. Preserve the SHG route,
-- separate member/group values and current-versus-historical source boundary.

do $$
declare
  microfinance_version_id uuid;
begin
  select current_version_id into microfinance_version_id
  from public.opportunities
  where slug = 'nmdfc-micro-finance-shg';

  if microfinance_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_scheme_route', 'https://www.nmdfc.org/nmdfcschemes',
        'current_guideline_route', 'https://www.nmdfc.org/guidelines_for_micro_financing_schemes',
        'current_faq_route', 'https://www.nmdfc.org/faq',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Form or join an eligible SHG and apply through the relevant SCA/partner route; UdyamVeda prepares and explains but does not submit or guarantee approval.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current NMDFC schemes page, micro-finance guideline landing page, FAQ, Credit Line 1 detail and Ministry/NMDFC reference material were checked on 8 September 2026.',
        'shg_max_members', 20,
        'credit_line_1_annual_family_income_max_inr', 300000,
        'credit_line_2_annual_family_income_max_inr', 800000,
        'credit_line_1_member_credit_max_inr', 100000,
        'credit_line_1_group_credit_max_inr', 2000000,
        'credit_line_2_member_credit_max_inr', 150000,
        'credit_line_2_group_credit_max_inr', 3000000,
        'credit_line_1_beneficiary_interest_percent', 7,
        'credit_line_2_beneficiary_interest_percent', 10,
        'credit_line_2_women_concession_percent', 2,
        'micro_credit_moratorium_months', 3,
        'micro_credit_repayment_years', 3,
        'sca_or_partner_route_required', true,
        'member_and_group_values_must_remain_separate', true,
        'historical_older_per_member_value_inr', 25000,
        'historical_value_is_not_current_summary', true,
        'loan_not_guaranteed', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = microfinance_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select microfinance_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.nmdfc.org/nmdfcschemes', 'agency', 'NMDFC current schemes page', 'Current credit lines, SHG micro-finance member/group values, rates, moratorium and repayment'),
      ('https://www.nmdfc.org/guidelines_for_micro_financing_schemes', 'guideline', 'NMDFC micro-finance guidelines', 'Current guideline route for SHG composition, implementation and documentation'),
      ('https://www.nmdfc.org/faq', 'agency', 'NMDFC current FAQ', 'SHG, thrift/credit and SCA/NGO implementation context'),
      ('https://www.nmdfc.org/credit-1', 'agency', 'NMDFC Credit Line 1 detail', 'Credit Line 1 route and income-line cross-check'),
      ('https://www.nmdfc.org/home/nmdfc_schemes', 'agency', 'NMDFC scheme landing page', 'Current scheme navigation and document route'),
      ('https://minorityaffairs.gov.in/WriteReadData/RTF1984/1953017398.pdf', 'guideline', 'Ministry of Minority Affairs NMDFC booklet', 'Historical micro-finance implementation and older value requiring reconciliation')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = microfinance_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
