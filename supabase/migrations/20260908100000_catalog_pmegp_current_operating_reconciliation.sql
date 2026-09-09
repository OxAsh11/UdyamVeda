-- Current PMEGP operating reconciliation. Keep the record review-gated.
-- Margin-money subsidy, beneficiary contribution and bank finance remain separate.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PMEGP current official portal', 'https://common-pmegp.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current PMEGP portal and scheme eligibility surface.'),
  ('PMEGP current eligibility page', 'https://common-pmegp.msme.gov.in/Home/MSME_List', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current PMEGP eligibility, Udyam and activity-boundary surface.')
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
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'prime-ministers-employment-generation-programme';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_url', 'https://common-pmegp.msme.gov.in/',
        'current_terms_url', 'https://pmegp.msme.gov.in/Home/TermsAndConditions',
        'current_submission_boundary', 'Applicant-controlled official submission; UdyamVeda prepares and guides but does not impersonate the applicant or handle OTPs.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_operating_boundary', 'Current official PMEGP guidance confirms the Udyam prerequisite before physical verification and margin-money adjustment, one applicant per family for new-enterprise assistance, capital expenditure requirement, EDP/verification obligations, three-year lock-in and a separate upgradation route. Bank appraisal and subsidy remain separate.',
        'separate_value_buckets', true,
        'fund_availability_and_bank_appraisal', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://common-pmegp.msme.gov.in/', 'agency', 'PMEGP current official portal', 'Current PMEGP route and scheme surface'),
      ('https://common-pmegp.msme.gov.in/Home/MSME_List', 'agency', 'PMEGP current eligibility page', 'Current eligibility, Udyam prerequisite and activity boundaries'),
      ('https://www.msme.gov.in/sites/default/files/Revisedguidelines07.12.2023.pdf', 'guideline', 'Revised PMEGP guideline / Udyam memorandum', 'Mandatory Udyam registration before physical verification and margin-money adjustment')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
