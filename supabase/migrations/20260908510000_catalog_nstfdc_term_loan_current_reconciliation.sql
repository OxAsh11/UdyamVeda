-- Current NSTFDC Term Loan reconciliation. Preserve current page terms and
-- keep project cost, finance share, contribution and sanction separate.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NSTFDC current Term Loan page', 'https://nstfdc.tribal.gov.in/frm_term_loan.aspx', 'agency_portal', 'central', 'monthly', 1, true, 'Current unit cost, finance share, promoter contribution, interest and repayment terms.'),
  ('NSTFDC current eligibility page', 'https://nstfdc.tribal.gov.in/frm_eligibility.aspx', 'agency_portal', 'central', 'monthly', 1, true, 'Current ST, income, cooperative-membership and notified-State residence boundaries.'),
  ('NSTFDC current How to Apply page', 'https://nstfdc.tribal.gov.in/frm_how_to_apply.aspx', 'agency_portal', 'central', 'monthly', 1, true, 'Current district-SCA application route.'),
  ('NSTFDC State Channelising Agency list', 'https://nstfdc.tribal.gov.in/UploadData/pdf/List_of_Addresses_of_SCAs.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official SCA address list; current availability requires verification.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  nstfdc_version_id uuid;
begin
  select current_version_id into nstfdc_version_id
  from public.opportunities
  where slug = 'nstfdc-term-loan-st-entrepreneurs';

  if nstfdc_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_term_loan_route', 'https://nstfdc.tribal.gov.in/frm_term_loan.aspx',
        'current_eligibility_route', 'https://nstfdc.tribal.gov.in/frm_eligibility.aspx',
        'current_how_to_apply_route', 'https://nstfdc.tribal.gov.in/frm_how_to_apply.aspx',
        'current_sca_list_route', 'https://nstfdc.tribal.gov.in/UploadData/pdf/List_of_Addresses_of_SCAs.pdf',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Prepare the viable-project checklist and direct the applicant to the relevant State Channelizing Agency; UdyamVeda does not submit or guarantee sanction.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current NSTFDC Term Loan, eligibility, How to Apply and SCA-list pages were checked on 8 September 2026; the annual report remains supporting reference evidence.',
        'unit_cost_max_inr', 5000000,
        'nstfdc_finance_share_max_percent', 90,
        'promoter_contribution_by_unit_cost', jsonb_build_object(
          'up_to_100000_percent', 0,
          'above_100000_up_to_250000_percent', 2,
          'above_250000_up_to_500000_percent', 3,
          'above_500000_percent', 5
        ),
        'beneficiary_interest_by_loan_amount', jsonb_build_object(
          'up_to_500000_percent', 6,
          'up_to_1000000_percent', 8,
          'above_1000000_percent', 10
        ),
        'sca_interest_by_loan_amount', jsonb_build_object(
          'up_to_500000_percent', 3,
          'up_to_1000000_percent', 5,
          'above_1000000_percent', 7
        ),
        'repayment_installment_frequency', 'quarterly',
        'repayment_max_years', 5,
        'moratorium_duration_published', false,
        'current_eligibility_income_reference_inr', 300000,
        'cooperative_min_st_membership_percent', 80,
        'notified_state_or_ut_residence_required', true,
        'project_cost_finance_share_and_sanction_must_remain_separate', true,
        'loan_not_guaranteed', true,
        'current_income_reference_conflict_requires_review', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = nstfdc_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select nstfdc_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://nstfdc.tribal.gov.in/frm_term_loan.aspx', 'agency', 'NSTFDC current Term Loan page', 'Unit cost, 90% finance share, promoter contribution, rates and repayment'),
      ('https://nstfdc.tribal.gov.in/frm_eligibility.aspx', 'agency', 'NSTFDC current eligibility page', 'ST status, income, cooperative membership and notified-State residence'),
      ('https://nstfdc.tribal.gov.in/frm_how_to_apply.aspx', 'agency', 'NSTFDC current How to Apply page', 'District State Channelizing Agency route'),
      ('https://nstfdc.tribal.gov.in/UploadData/pdf/List_of_Addresses_of_SCAs.pdf', 'guideline', 'NSTFDC State Channelising Agency list', 'Official SCA addresses and route'),
      ('https://nstfdc.tribal.gov.in/CuteSoft_Client/writereaddata/upload/NSTFDC_AR%20-%202024-25_Final_03-12-25_English.pdf', 'guideline', 'NSTFDC 2024-25 annual report', 'Supporting project-cost and historical income/rate context')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = nstfdc_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
