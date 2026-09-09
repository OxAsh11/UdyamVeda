-- Current-source reconciliation for PMEGP new-unit assistance.
-- Keep subsidy and lender finance as separate value buckets and do not imply
-- that an application guarantees either sanction or margin-money adjustment.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PMEGP current common application portal', 'https://common-pmegp.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Current official PMEGP portal route and operating notices; portal migration and current application availability require review.'),
  ('PMEGP current eligibility and Udyam prerequisite', 'https://common-pmegp.msme.gov.in/Home/MSME_List', 'implementing_portal', 'central', 'weekly', 1, true, 'Official PMEGP portal eligibility list, negative-list and Udyam-before-physical-verification boundary.')
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

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    application = application || jsonb_build_object(
      'portal', 'https://common-pmegp.msme.gov.in/',
      'portal_aliases', jsonb_build_array('https://kviconline.gov.in/pmegpeportal/')
    ),
    fine_print = fine_print || jsonb_build_object(
      'current_source_reconciliation', 'The current PMEGP portal confirms the Udyam-before-physical-verification prerequisite, subsidy non-guarantee, applicant-controlled Aadhaar/identity consent boundary, and separate new-unit versus second-loan routes.',
      'current_source_checked_at', '2026-09-07'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select version_id, source_url, 'agency', source_title, source_anchor, now(), false
  from (values
    ('https://common-pmegp.msme.gov.in/', 'PMEGP current common application portal', 'Online application, new unit and existing-unit second-loan routes; subsidy non-guarantee notice'),
    ('https://common-pmegp.msme.gov.in/Home/MSME_List', 'PMEGP current eligibility and Udyam prerequisite', 'New-unit eligibility, negative list, business/trading conditions and Udyam registration before physical verification')
  ) as evidence(source_url, source_title, source_anchor)
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id and source_url = evidence.source_url
  );
end $$;
