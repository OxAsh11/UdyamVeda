-- Reconcile NHDP records with the current official DC (Handicrafts) scheme
-- and circular indexes. Notice presence is not automatic eligibility or award.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Development Commissioner Handicrafts current news index', 'https://handicrafts.nic.in/Showall.aspx?link=allnews', 'agency_portal', 'central', 'weekly', 1, true, 'Current official news index used to detect FY 2026-27 NHDP MSS and SDHS notices; attachment-level review is still required.'),
  ('Development Commissioner Handicrafts FY 2026-27 circular index', 'https://handicrafts.nic.in/tenders.aspx?type=27', 'agency_portal', 'central', 'weekly', 1, true, 'Current official circular index lists FY 2026-27 MSS proposal/calendar and SDHS project-proposal notices; the attached PDFs control exact terms and deadlines.')
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
  item record;
begin
  for item in
    select o.id as opportunity_id, o.current_version_id as version_id, o.slug
    from public.opportunities o
    where o.slug in ('nhdp-marketing-support-services-handicrafts', 'nhdp-skill-development-handicraft-sector')
  loop
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_notice_index', 'https://handicrafts.nic.in/tenders.aspx?type=27',
        'current_news_index', 'https://handicrafts.nic.in/Showall.aspx?link=allnews',
        'current_route_checked_at', '2026-09-08',
        'notice_presence_is_not_open_deadline', true,
        'official_handoff_boundary', 'UdyamVeda may prepare and explain the route, but the eligible agency, artisan, participant or implementing institution must use the official DC (Handicrafts) notice or MIS route.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || case
        when item.slug = 'nhdp-marketing-support-services-handicrafts' then jsonb_build_object(
          'current_notice_index_observation', 'The official index lists FY 2026-27 MSS project-proposal, international action-plan, domestic marketing-calendar and Dilli Haat calendar notices.',
          'current_notice_dates', jsonb_build_array('2026-01-02', '2026-01-19', '2026-03-31', '2026-04-06'),
          'deadline_status', 'notice_listed_attachment_review_required',
          'open_window_not_inferred', true,
          'event_selection_not_guaranteed', true,
          'current_terms_require_attachment_capture', true,
          'current_route_checked_at', '2026-09-08'
        )
        else jsonb_build_object(
          'current_notice_index_observation', 'The official index lists an FY 2026-27 SDHS project-proposal invitation dated 2026-01-02.',
          'current_notice_dates', jsonb_build_array('2026-01-02'),
          'deadline_status', 'notice_listed_attachment_review_required',
          'open_window_not_inferred', true,
          'historical_csup_terms_not_current', true,
          'current_terms_require_attachment_capture', true,
          'current_route_checked_at', '2026-09-08'
        )
      end,
      last_verified_at = now(),
      review_status = 'in_review'
    where id = item.version_id;

    update public.opportunity_sources
    set is_primary = false
    where opportunity_version_id = item.version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (item.version_id, 'https://handicrafts.nic.in/cmsUpload/20230425203825NHDP_Guidlines.pdf', 'guideline', 'National Handicrafts Development Programme Guidelines', 'NHDP component structure and MSS/Design and Skill Development descriptions', now(), true),
      (item.version_id, 'https://handicrafts.nic.in/schemes.aspx', 'agency', 'DC (Handicrafts) scheme index', 'NHDP generic scheme index and component navigation', now(), false),
      (item.version_id, 'https://handicrafts.nic.in/tenders.aspx?type=27', 'agency', 'DC (Handicrafts) FY 2026-27 circular index', case when item.slug = 'nhdp-marketing-support-services-handicrafts' then 'FY 2026-27 MSS proposal and marketing-calendar notices' else 'FY 2026-27 SDHS project-proposal invitation' end, now(), false),
      (item.version_id, 'https://handicrafts.nic.in/Showall.aspx?link=allnews', 'agency', 'DC (Handicrafts) current news index', 'Current FY 2026-27 NHDP notice presence cross-check', now(), false)
    on conflict do nothing;

    update public.opportunity_windows
    set
      label = case when item.slug = 'nhdp-marketing-support-services-handicrafts'
        then 'FY 2026-27 MSS proposals and marketing calendars are listed by the official portal; exact event/proposal deadlines and terms require attachment review.'
        else 'An FY 2026-27 SDHS project-proposal invitation is listed by the official portal; exact deadline and participant/agency terms require attachment review.'
      end,
      source_evidence = jsonb_build_object(
        'source_url', 'https://handicrafts.nic.in/tenders.aspx?type=27',
        'supporting_url', 'https://handicrafts.nic.in/Showall.aspx?link=allnews',
        'anchor', case when item.slug = 'nhdp-marketing-support-services-handicrafts' then 'FY 2026-27 MSS proposal and marketing-calendar entries' else 'FY 2026-27 SDHS project-proposal entry' end,
        'observed_at', '2026-09-08',
        'deadline_status', 'notice_listed_attachment_review_required',
        'open_window_not_inferred', true
      )
    where opportunity_version_id = item.version_id;
  end loop;
end $$;
