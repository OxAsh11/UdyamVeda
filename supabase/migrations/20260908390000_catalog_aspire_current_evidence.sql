-- Current ASPIRE operating reconciliation. Keep the institution-led LBI route
-- separate from founder-level benefits and keep the record review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('ASPIRE registration user manual', 'https://aspire.msme.gov.in/WriteReadData/Circular/RegistrationUserManualAspire.pdf', 'portal_manual', 'central', 'monthly', 2, true, 'Official LBI/TBI category and registration instructions.'),
  ('ASPIRE LBI guideline and application document', 'https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_New_21112023.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official current indexed LBI guideline/application document; terms and amendments require review.'),
  ('ASPIRE current applicant login route', 'https://aspire.msme.gov.in/ASPIRE/AFLogin.aspx', 'agency_portal', 'central', 'weekly', 2, true, 'Official portal navigation for Apply for New LBI and applicant account access.')
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
  where slug = 'aspire-innovation-rural-industry-entrepreneurship';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_registration_route', 'https://aspire.msme.gov.in/ASPIRE/Registration.aspx',
        'current_login_route', 'https://aspire.msme.gov.in/ASPIRE/AFLogin.aspx',
        'applicant_boundary', 'Institution-led LBI route; an individual founder should be matched to an approved or currently accepting LBI, not shown a direct personal ASPIRE grant application.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current ASPIRE dashboard and registration route were checked on 8 September 2026. The registration form exposes the LBI category, while the official guideline/application document describes institutional proposal categories and agro-rural incubation functions.',
        'institution_led', true,
        'direct_individual_grant', false,
        'current_dashboard_metrics_are_not_entitlement', true,
        'guideline_cycle_end', '2025-26',
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://aspire.msme.gov.in/ASPIRE/Registration.aspx', 'agency', 'ASPIRE current registration portal', 'LBI category and current registration form'),
      ('https://aspire.msme.gov.in/ASPIRE/AFLogin.aspx', 'agency', 'ASPIRE current applicant login route', 'Apply for New LBI and applicant login navigation'),
      ('https://aspire.msme.gov.in/WriteReadData/Circular/RegistrationUserManualAspire.pdf', 'portal_manual', 'ASPIRE registration user manual', 'LBI/TBI category selection and registration process'),
      ('https://aspire.msme.gov.in/WriteReadData/DocumentFile/ASPIRE_New_21112023.pdf', 'guideline', 'ASPIRE LBI guideline and application document', 'Eligible proposal institutions and LBI functions')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
