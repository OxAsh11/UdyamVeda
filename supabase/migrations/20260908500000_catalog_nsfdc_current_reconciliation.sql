-- Current NSFDC reconciliation. Preserve separate product tracks and current
-- FAQ terms while keeping channel-partner and approval boundaries explicit.

do $$
declare
  nsfdc_version_id uuid;
begin
  select current_version_id into nsfdc_version_id
  from public.opportunities
  where slug = 'nsfdc-income-generating-credit';

  if nsfdc_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_faq_route', 'https://nsfdc.nic.in/faqs',
        'current_mandate_route', 'https://nsfdc.nic.in/about-us-3',
        'current_ministry_route', 'https://socialjustice.gov.in/schemes/34',
        'current_pm_suraj_route', 'https://pmsuraj.dosje.gov.in/',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Apply through PM-SURAJ where available or an authorized SCA/CA; UdyamVeda prepares and explains but does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current NSFDC FAQ, mandate/about page, Ministry scheme page, PM-SURAJ route and scheme compendium were checked on 8 September 2026; the current FAQ controls where older compendium terms differ.',
        'annual_family_income_max_inr', 500000,
        'income_rule_effective_date', '2026-01-07',
        'sc_status_required', true,
        'authorized_channel_partner_required', true,
        'direct_nsfdc_application_not_available', true,
        'maximum_project_cost_finance_percent', 90,
        'product_tracks_must_remain_separate', true,
        'micro_finance_scheme', jsonb_build_object(
          'project_cost_max_inr', 140000,
          'loan_max_inr', 125000,
          'beneficiary_interest_percent', 6.5,
          'repayment_years', 3,
          'moratorium_months', 3
        ),
        'aajeevika_micro_finance_yojana', jsonb_build_object(
          'project_cost_max_inr', 140000,
          'loan_max_inr', 125000,
          'beneficiary_interest_percent', 15,
          'repayment_years', 3,
          'moratorium_months', 3
        ),
        'term_loan', jsonb_build_object(
          'project_cost_min_exclusive_inr', 140000,
          'project_cost_max_inr', 5000000,
          'loan_max_inr', 4500000,
          'beneficiary_interest_percent', 8,
          'repayment_years', 7,
          'moratorium_months', 6,
          'extended_moratorium_months_for_plantation_or_construction', 12
        ),
        'udyam_nidhi', jsonb_build_object(
          'project_cost_max_inr', 500000,
          'loan_max_inr', 450000,
          'beneficiary_interest_percent_cooperative', 13,
          'beneficiary_interest_percent_small_finance_bank', 15,
          'repayment_years', 5,
          'moratorium_months', 3
        ),
        'partnership_or_cooperative_condition', 'All members must belong to the Scheduled Caste community and each member must satisfy the applicable family-income ceiling.',
        'skill_development_has_no_loan_income_rule', true,
        'training_and_market_support_are_separate', true,
        'loan_not_guaranteed', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = nsfdc_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select nsfdc_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://nsfdc.nic.in/faqs', 'agency', 'NSFDC current FAQ', 'Current income rule, channel route, 90% project-cost boundary and product-specific terms'),
      ('https://nsfdc.nic.in/about-us-3', 'agency', 'NSFDC current mandate/about page', 'Current target group, income ceiling, channel finance and support activities'),
      ('https://socialjustice.gov.in/schemes/34', 'ministry', 'Ministry NSFDC scheme page', 'Ministry overview and implementing-agency boundary'),
      ('https://pmsuraj.dosje.gov.in/', 'agency', 'PM-SURAJ official application portal', 'Online application handoff referenced by the current FAQ'),
      ('https://nsfdc.nic.in/UploadedFiles/other/2024-05-15/1-4-1.pdf', 'guideline', 'NSFDC scheme compendium', 'Historical/product cross-check; current FAQ controls conflicts')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = nsfdc_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
