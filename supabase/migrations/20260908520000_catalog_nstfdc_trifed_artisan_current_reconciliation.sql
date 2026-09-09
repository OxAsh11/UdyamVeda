-- Correct the NSTFDC/TRIFED artisan route to the direct official RTI manual
-- and preserve empanelment, credit and market-access boundaries separately.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NSTFDC RTI Manual No. 4 - TRIFED empanelled artisan assistance', 'https://nstfdc.tribal.gov.in/UploadData/pdf/RTI.pdf', 'guideline', 'central', 'monthly', 1, true, 'Direct official artisan-assistance purpose, individual/group ceilings, finance share and interest table.'),
  ('TRIFED current empanelment process', 'https://trifed.tribal.gov.in/en/node/950', 'agency_portal', 'central', 'monthly', 1, true, 'Current tribal supplier/artisan empanelment categories and group composition boundary.')
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
  artisan_version_id uuid;
begin
  select current_version_id into artisan_version_id
  from public.opportunities
  where slug = 'nstfdc-trifed-empanelled-artisan-credit';

  if artisan_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_nstfdc_artisan_source', 'https://nstfdc.tribal.gov.in/UploadData/pdf/RTI.pdf',
        'current_trifed_empanelment_route', 'https://trifed.tribal.gov.in/en/node/950',
        'current_nstfdc_eligibility_route', 'https://nstfdc.tribal.gov.in/frm_eligibility.aspx',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Prepare separate TRIFED empanelment and NSTFDC/SCA credit checklists; UdyamVeda does not approve, submit or guarantee either route.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The direct NSTFDC RTI Manual No. 4 and current TRIFED empanelment page were checked on 8 September 2026. The prior annual-report artisan citation is not used because the reviewed PDF did not contain the cited artisan-specific row.',
        'individual_assistance_max_inr', 50000,
        'shg_or_cooperative_assistance_max_inr', 500000,
        'nstfdc_finance_share_max_percent', 90,
        'sca_interest_percent_women', 2,
        'sca_interest_percent_men', 3,
        'beneficiary_interest_percent_women', 4,
        'beneficiary_interest_percent_men', 6,
        'finance_purpose', 'Project-related assets and working capital',
        'trifed_group_minimum_tribal_share_percent', 70,
        'trifed_key_positions_st_required', true,
        'group_ceiling_and_unit_cost_base_require_review', true,
        'repayment_terms_published', false,
        'contribution_terms_published', false,
        'security_terms_published', false,
        'nationwide_deadline_published', false,
        'income_condition_for_current_artisan_route_requires_review', true,
        'empanelment_does_not_guarantee_credit', true,
        'market_access_and_credit_must_remain_separate', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = artisan_version_id;

    update public.opportunity_sources
    set is_primary = false
    where opportunity_version_id = artisan_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (artisan_version_id, 'https://nstfdc.tribal.gov.in/UploadData/pdf/RTI.pdf', 'guideline', 'NSTFDC RTI Manual No. 4', 'Manual No. 4: Assistance to TRIFED empanelled Artisans and special-scheme lending norms', now(), true),
      (artisan_version_id, 'https://trifed.tribal.gov.in/en/node/950', 'agency', 'TRIFED current empanelment process', 'Current supplier/artisan categories and 70% tribal group-composition condition', now(), false),
      (artisan_version_id, 'https://nstfdc.tribal.gov.in/frm_eligibility.aspx', 'agency', 'NSTFDC current eligibility page', 'Current ST applicant/member and notified-State residence route', now(), false)
    on conflict do nothing;
  end if;
end $$;
