-- Current PMS event evidence for IITF 2026.
-- The generic PMS scheme remains component-specific; this event gets its own
-- opportunity seed so the dated window is not confused with rolling support.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PMS IITF 2026 event listing', 'https://pms.dcmsme.gov.in/view-all-event', 'implementing_portal', 'central', 'daily', 1, true, 'Official current event listing and application route for the IITF 2026 PMS opportunity.'),
  ('MyMSME current PMS notice', 'https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry_portal', 'central', 'daily', 1, true, 'Official current notice for the temporary PMS extension, new portal route and IITF 2026 dates.')
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
  pms_version_id uuid;
begin
  select current_version_id into pms_version_id
  from public.opportunities
  where slug = 'procurement-and-marketing-support-pms';

  if pms_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_event_portal', 'https://pms.dcmsme.gov.in/view-all-event',
        'current_extension_note', 'The official MyMSME notice directs organizers to submit proposals from October 2026 through the new PMS portal; event-level MSE applications must be checked separately.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current MyMSME and PMS portals show a temporary extension and a live IITF 2026 event route. Event dates, Udyam cut-off and stall-fee treatment belong to the separate IITF 2026 opportunity record, not to every PMS component.',
        'current_iitf_event', jsonb_build_object(
          'application_open', '2026-09-01',
          'application_deadline', '2026-09-20',
          'udyam_valid_as_of', '2026-08-31',
          'late_applications', 'not_considered'
        ),
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = pms_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select pms_version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry', 'MyMSME current PMS notice', 'Temporary PMS extension and new portal route'),
      ('https://pms.dcmsme.gov.in/view-all-event', 'agency', 'PMS IITF 2026 event listing', 'Current event listing and application route')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = pms_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
