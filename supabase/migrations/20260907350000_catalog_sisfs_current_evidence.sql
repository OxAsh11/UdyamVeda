-- Current-source reconciliation for the Startup India Seed Fund Scheme.
-- Startup applications have a dated closing notice; ongoing disbursals do not
-- reopen the application window or turn the scheme corpus into an entitlement.

alter table public.opportunity_sources
  drop constraint if exists opportunity_sources_source_kind_check;

alter table public.opportunity_sources
  add constraint opportunity_sources_source_kind_check
  check (source_kind in ('gazette', 'guideline', 'ministry', 'agency', 'myscheme', 'startup_india', 'pib', 'reference_playbook', 'other'));

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('SISFS final extended deadline notice', 'https://seedfund.startupindia.gov.in/', 'implementing_portal', 'central', 'daily', 1, true, 'Official SISFS landing page currently displaying the final extended startup-application and incubator-selection deadlines.'),
  ('SISFS official contact and grievance route', 'https://seedfund.startupindia.gov.in/contact', 'implementing_portal', 'central', 'monthly', 2, true, 'Official startup and incubator contact/grievance form; not evidence that the application window is open.'),
  ('Startup India Schemes Playbook June 2026', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'reference_playbook', 'central', 'monthly', 3, true, 'Official discovery reference stating the SISFS deadline and ongoing-disbursal context; not sufficient as sole publishing provenance.')
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
  sisfs_version_id uuid;
begin
  select current_version_id into sisfs_version_id
  from public.opportunities
  where slug = 'startup-india-seed-fund-scheme';

  if sisfs_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'window_status', 'closed_for_new_startup_applications',
        'startup_application_deadline', '2026-05-31',
        'incubator_selection_deadline', '2026-06-30',
        'current_status_note', 'The official portal displays the final extended deadlines. Ongoing disbursals do not reopen the startup application window.',
        'contact_route', 'https://seedfund.startupindia.gov.in/contact'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The official SISFS portal displays a final extended deadline of 31 May 2026 for startup applications and 30 June 2026 for incubators to complete selection. The official Startup India playbook says disbursals are ongoing; this does not reopen the startup application window or create a direct entitlement.',
        'startup_application_deadline', '2026-05-31',
        'incubator_selection_deadline', '2026-06-30',
        'disbursals_ongoing_note', true,
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = sisfs_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-05-31 23:59:59+05:30'::timestamptz,
      label = 'Startup applications closed on 31 May 2026; incubators were to complete selection by 30 June 2026. Ongoing disbursals do not reopen the application window.',
      source_evidence = coalesce(source_evidence, '{}'::jsonb) || jsonb_build_object(
        'current_source_url', 'https://seedfund.startupindia.gov.in/',
        'current_source_anchor', 'Final Notice (Extended): Last date for startups to apply under SISFS – 31 May 2026; incubators to complete 100% startup selection by – 30 June 2026'
      )
    where opportunity_version_id = sisfs_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select sisfs_version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://seedfund.startupindia.gov.in/', 'agency', 'SISFS final extended deadline notice', 'Final startup-application and incubator-selection deadlines; current portal status'),
      ('https://seedfund.startupindia.gov.in/contact', 'agency', 'SISFS official contact and grievance route', 'Startup and incubator contact and grievance form'),
      ('https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'reference_playbook', 'Startup India Schemes Playbook June 2026', 'SISFS deadline and ongoing-disbursal context; discovery reference only')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = sisfs_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
