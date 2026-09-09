-- Current operating and applicant-boundary reconciliation for PMEGP.
-- Subsidy and lender finance remain separate; this adds portal and route facts
-- without turning the scheme into a guaranteed benefit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PMEGP current terms and conditions', 'https://pmegp.msme.gov.in/Home/TermsAndConditions', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current terms for online submission, family limit, capital expenditure, negative-list and upgradation boundaries.'),
  ('PMEGP new-applicant user manual', 'https://pmegp.msme.gov.in/Documents/UserManual/UserManual_NewApplicant.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official new-applicant manual for documents, project conditions and activity boundaries.'),
  ('MyMSME PMEGP current statistics and route', 'https://my.msme.gov.in/mymsme/reg/com_pmegpform.aspx', 'implementing_portal', 'central', 'weekly', 2, true, 'Official MyMSME PMEGP route with current financial-year operational statistics and application handoff.')
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
        'submission_mode', 'online_only_for_current_portal_route',
        'current_operating_note', 'The current official portal is operating and exposes 2026-27 statistics; application availability remains subject to the implementing-agency and bank process.',
        'terms_url', 'https://pmegp.msme.gov.in/Home/TermsAndConditions'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'Current PMEGP terms and the new-applicant manual confirm online submission, one applicant per family for new-enterprise assistance, a capital-expenditure requirement, the transport-activity ceiling and a separate upgradation route for qualifying existing PMEGP/MUDRA units.',
        'submission_mode', 'online_only_for_current_portal_route',
        'one_applicant_per_family', true,
        'capital_expenditure_required', true,
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    update public.opportunity_windows
    set
      window_type = 'rolling',
      label = 'Current PMEGP portal is operating; applications remain subject to implementing-agency processing, fund availability and bank appraisal.',
      source_evidence = coalesce(source_evidence, '{}'::jsonb) || jsonb_build_object(
        'current_source_url', 'https://common-pmegp.msme.gov.in/',
        'current_source_anchor', 'Current PMEGP portal, scheme guidance and 2026-27 operational statistics'
      )
    where opportunity_version_id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://pmegp.msme.gov.in/Home/TermsAndConditions', 'agency', 'PMEGP current terms and conditions', 'Online submission, family limit, capital-expenditure requirement and upgradation route'),
      ('https://pmegp.msme.gov.in/Documents/UserManual/UserManual_NewApplicant.pdf', 'guideline', 'PMEGP new-applicant user manual', 'New-applicant documents and project/activity conditions'),
      ('https://my.msme.gov.in/mymsme/reg/com_pmegpform.aspx', 'agency', 'MyMSME PMEGP current statistics and route', '2026-27 operational statistics and application entry point')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
