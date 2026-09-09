-- Current official NSSH/SCLCSS evidence.
-- The 15 May 2025 memorandum covers the 2021-22 to 2025-26 cycle. The live
-- dashboard and portal are retained as operating context, not as proof of a
-- post-31 March 2026 continuation or universal application window.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('National SC-ST Hub revised guidelines 2025', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official 15 May 2025 NSSH memorandum and revised guideline; cited financial-cycle period ends 31 March 2026.'),
  ('SCLCSS official portal', 'https://sclcss.msme.gov.in/', 'agency_portal', 'central', 'weekly', 2, true, 'Official SCLCSS/NSSH portal with component terms and lender route; portal availability is not proof of continuation.'),
  ('National SC-ST Hub official dashboard', 'https://dashboard.msme.gov.in/scsthub.aspx', 'ministry_portal', 'central', 'weekly', 2, true, 'Official MSME dashboard with current reporting context; dashboard activity is not treated as a legal continuation notice.')
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
  nssh_version_id uuid;
  sclcss_version_id uuid;
begin
  select current_version_id into nssh_version_id
  from public.opportunities
  where slug = 'national-scheduled-caste-scheduled-tribe-hub';

  if nssh_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'portal', 'https://dashboard.msme.gov.in/scsthub.aspx',
        'current_route_boundary', 'The official dashboard is a reporting surface, not proof of a new application window or legal continuation. Verify a current NSSH/NSIC operating notice before handoff.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_nssh_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'revised_guideline_date', '2025-05-15',
          'guideline_source', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf',
          'cited_cycle', '2021-22 to 2025-26',
          'cited_cycle_end', '2026-03-31',
          'implementing_agency', 'National Small Industries Corporation (NSIC)',
          'dashboard_context', 'The official MSME dashboard reports NSSH activity, including 2026-27 reporting context, but it does not establish a successor legal cycle or universal application window.',
          'current_availability', 'No post-31 March 2026 continuation or universal application window was evidenced in the official sources checked; keep the national opportunity closed pending an official continuation or current operating notice.'
        ),
        'current_source_reconciliation', 'The official 15 May 2025 NSSH memorandum/revised guideline, SCLCSS portal and MSME dashboard were reconciled on 7 September 2026. The guideline cycle has ended; dashboard activity is retained as reporting context only.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = nssh_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-03-31T23:59:59+05:30'::timestamptz,
      label = 'The cited NSSH financial-cycle guideline ended on 31 March 2026. Dashboard reporting does not establish a new universal application window.',
      source_evidence = jsonb_build_object('source_url', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'anchor', '15 May 2025 memorandum; scheme applicability and financial cycle 2021-22 to 2025-26', 'checked_at', '2026-09-07')
    where opportunity_version_id = nssh_version_id;

    update public.opportunity_sources
    set is_primary = false
    where opportunity_version_id = nssh_version_id
      and is_primary = true;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select nssh_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), evidence.is_primary
    from (values
      ('https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'guideline', 'National SC-ST Hub revised guidelines 2025', '15 May 2025 memorandum; scheme applicability and financial cycle 2021-22 to 2025-26', true, true),
      ('https://sclcss.msme.gov.in/', 'agency', 'SCLCSS official portal', 'SCLCSS component terms and lender-led route', false, false),
      ('https://dashboard.msme.gov.in/scsthub.aspx', 'ministry', 'National SC-ST Hub official dashboard', 'Current reporting context; not proof of continuation', false, false)
    ) as evidence(source_url, source_kind, source_title, source_anchor, is_primary, unused_marker)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = nssh_version_id and source_url = evidence.source_url
    );
  end if;

  select current_version_id into sclcss_version_id
  from public.opportunities
  where slug = 'special-credit-linked-capital-subsidy-scheme-sclcss';

  if sclcss_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_route_boundary', 'The official portal describes the lender-led route but does not by itself establish post-March-2026 continuation.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_sclcss_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'current_portal', 'https://sclcss.msme.gov.in/',
          'portal_terms', 'The official portal describes a 25% subsidy with an overall subsidy ceiling of Rs. 25 lakh for eligible new plant, machinery or equipment through institutional credit.',
          'co_terminus_boundary', 'SCLCSS is represented as a component under NSSH, whose cited financial cycle ended 31 March 2026.',
          'current_availability', 'No post-31 March 2026 continuation or universal application window was evidenced in the official sources checked; keep closed pending an official continuation notice.'
        ),
        'current_source_reconciliation', 'The official SCLCSS portal and NSSH 2025 guideline were reconciled on 7 September 2026. Portal terms remain component reference evidence; the national opportunity is closed pending continuation evidence.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = sclcss_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-03-31T23:59:59+05:30'::timestamptz,
      label = 'The SCLCSS portal remains an official reference, but the component is treated as closed nationally pending post-31 March 2026 NSSH continuation evidence.',
      source_evidence = jsonb_build_object('source_url', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'anchor', 'NSSH financial-cycle end and component co-terminus boundary', 'checked_at', '2026-09-07')
    where opportunity_version_id = sclcss_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select sclcss_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://sclcss.msme.gov.in/', 'agency', 'SCLCSS official portal', '25% subsidy, Rs. 25 lakh ceiling and lender-led application route'),
      ('https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'guideline', 'National SC-ST Hub revised guidelines 2025', 'NSSH component co-terminus boundary'),
      ('https://dashboard.msme.gov.in/scsthub.aspx', 'ministry', 'National SC-ST Hub official dashboard', 'Current reporting context; not proof of continuation')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = sclcss_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
