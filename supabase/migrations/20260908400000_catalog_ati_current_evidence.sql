-- Current ATI operating reconciliation. Keep institution grants, programme support
-- and trainee discovery separate, and keep all terms review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME ATI revised guideline circular 2025', 'https://msme.gov.in/sites/default/files/ATIguidelinesEnglish.pdf', 'guideline_circular', 'central', 'monthly', 1, true, 'Official 25 April 2025 circular revising the ATI institutional boundary; current financial terms require review.'),
  ('MSME ATI information surface', 'https://ati.msme.gov.in/Index2.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official ATI navigation for apex organisations, partner institutions, approved programmes, trainee registration and revised guidelines.'),
  ('MSME ATI trainee registration route', 'https://ati.msme.gov.in/potentialtrainees/TraineesRegistration.aspx', 'application_portal', 'central', 'weekly', 2, true, 'Official trainee registration and expression-of-interest route; programme availability and participant conditions require review.'),
  ('MSME ATI approved programme search', 'https://ati.msme.gov.in/PotentialTrainees/ViewApprovedProgramme.aspx', 'application_portal', 'central', 'weekly', 2, true, 'Official State/District/module search for approved training programmes.'),
  ('MSME ATI course module catalogue', 'https://ati.msme.gov.in/ModuleHome.aspx', 'programme_catalogue', 'central', 'monthly', 2, true, 'Official course/module and duration catalogue for training discovery.')
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
  where slug = 'assistance-to-training-institutions-ati';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'institutional_route', 'https://ati.msme.gov.in/ATI/home.aspx',
        'trainee_discovery_route', 'https://ati.msme.gov.in/potentialtrainees/TraineesRegistration.aspx',
        'approved_programme_route', 'https://ati.msme.gov.in/PotentialTrainees/ViewApprovedProgramme.aspx',
        'applicant_boundary', 'Institution-led infrastructure/programme support; an individual founder should be matched to a current training programme, not shown the institution capital-grant route.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'ATI portal and 25 April 2025 Ministry circular checked on 8 September 2026; the revised institutional boundary is current evidence, while financial terms and live institutional windows remain review-gated.',
        'institution_led', true,
        'direct_individual_grant', false,
        'programme_metrics_are_not_entitlement', true,
        'historical_terms_not_current_entitlement', true,
        'current_guideline_circular_date', '2025-04-25',
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://ati.msme.gov.in/ATI/home.aspx', 'agency', 'ATI official portal', 'Institutional infrastructure and entrepreneurship/skill-development support'),
      ('https://ati.msme.gov.in/Index2.aspx', 'agency', 'ATI information surface', 'Apex organisations, partner institutions, approved programmes and revised-guideline navigation'),
      ('https://msme.gov.in/sites/default/files/ATIguidelinesEnglish.pdf', 'guideline_circular', 'Revised ATI guideline circular 25 April 2025', 'State-level EDI and State Government training-institution/DIC infrastructure boundary'),
      ('https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/0_3_1.html', 'ministry_portal', 'MyMSME ATI description', 'Historical assistance terms, institution eligibility and EDI enrolment route'),
      ('https://ati.msme.gov.in/potentialtrainees/TraineesRegistration.aspx', 'application_portal', 'ATI trainee registration', 'Expression of interest for forthcoming training programmes'),
      ('https://ati.msme.gov.in/PotentialTrainees/ViewApprovedProgramme.aspx', 'application_portal', 'ATI approved programmes', 'Approved programme search by State, District and module'),
      ('https://ati.msme.gov.in/ModuleHome.aspx', 'programme_catalogue', 'ATI course modules', 'Course/module names and durations')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
