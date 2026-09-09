-- Current IITF 2026 event reconciliation for controlled Batch 086 review.
-- Keep this event window separate from the generic PMS record.

do $$
declare
  event_version_id uuid;
begin
  select current_version_id into event_version_id
  from public.opportunities
  where slug = 'iitf-2026-pms-domestic-trade-fair';

  if event_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_event_portal', 'https://pms.dcmsme.gov.in/view-all-event',
        'current_notice', 'Official MyMSME and PMS notices state that IITF 2026 applications are open from 2026-09-01 through 2026-09-20; only MSEs with valid Udyam Registration as of 2026-08-31 are eligible and late applications are not considered.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_pms_iitf_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'application_open', '2026-09-01',
          'application_deadline', '2026-09-20',
          'udyam_valid_as_of', '2026-08-31',
          'late_applications', 'not_considered',
          'stall_fee_at_application', 'not_required; collected only from MSEs allotted stalls according to PMS guidelines',
          'organiser_route_separate', true,
          'review_boundary', 'Confirm the current event form, documents, selection/allotment terms and post-event claim evidence before publication.'
        ),
        'current_source_reconciliation', 'The official PMS portal and MyMSME notice were checked on 8 September 2026. IITF 2026 remains a separate fixed-window event opportunity and must not be merged with generic PMS or the organiser proposal route.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = event_version_id;

    update public.opportunity_windows
    set
      window_type = 'fixed',
      opens_at = '2026-09-01',
      closes_at = '2026-09-20',
      label = 'IITF 2026 MSE applications: 1 September 2026 to 20 September 2026; late applications are not considered.',
      source_evidence = jsonb_build_object('source_url', 'https://my.msme.gov.in/mymsme/Reg/home.aspx', 'anchor', 'Official IITF 2026 application dates and late-application rule; checked 8 September 2026')
    where opportunity_version_id = event_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select event_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://pms.dcmsme.gov.in/', 'agency', 'PMS portal', 'IITF 2026 announcement and separate organiser route'),
      ('https://my.msme.gov.in/mymsme/Reg/home.aspx', 'ministry', 'MyMSME current PMS notice', 'IITF 2026 dates, Udyam validity and stall-fee treatment'),
      ('https://msme.gov.in/sites/default/files/PMSSchemeGuidelines.pdf', 'guideline', 'PMS Scheme Guidelines', 'Underlying PMS terms and claim boundaries')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = event_version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
