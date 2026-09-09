-- Current SCLCSS reconciliation. Preserve current portal/checklist evidence
-- while keeping the ended NSSH cycle and absent universal window explicit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('SCLCSS current portal home', 'https://sclcss.msme.gov.in/Common/Home.aspx', 'agency_portal', 'central', 'weekly', 1, true, 'Current official SCLCSS page with component terms and lender-led route; page availability is not proof of an open window.'),
  ('SCLCSS application checklist January 2026', 'https://sclcss.msme.gov.in/Manual/Checklist_SCLCSS_Application_26Jan2026.pdf', 'guideline', 'central', 'monthly', 1, true, 'Current operational checklist evidence; does not itself extend the NSSH financial cycle or establish universal intake.'),
  ('Ministry SCLCSS guideline', 'https://www.msme.gov.in/sites/default/files/guidelines-SCLCSS1.PDF', 'guideline', 'central', 'monthly', 1, true, 'Original Ministry guideline retained for scheme-basis and eligibility cross-check.'),
  ('SCLCSS technical evaluation committee memorandum', 'https://sclcss.msme.gov.in/Manual/Constitution_Technical%20EvaluaionCommittee.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official 30 January 2025 memorandum for activity/product relevance under SCLCSS.')
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
  sclcss_version_id uuid;
begin
  select current_version_id into sclcss_version_id
  from public.opportunities
  where slug = 'special-credit-linked-capital-subsidy-scheme-sclcss';

  if sclcss_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_route', 'https://sclcss.msme.gov.in/Common/Home.aspx',
        'current_checklist_route', 'https://sclcss.msme.gov.in/Manual/Checklist_SCLCSS_Application_26Jan2026.pdf',
        'current_guideline_route', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf',
        'current_route_checked_at', '2026-09-08',
        'official_handoff_boundary', 'Prepare the lender-led checklist only after continuation is verified; the PLI/nodal agency handles the official claim route and UdyamVeda does not submit or guarantee subsidy.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current SCLCSS portal, January 2026 checklist, NSSH/SCLCSS guideline, MSME dashboard, Ministry guideline and technical evaluation memorandum were checked on 8 September 2026.',
        'subsidy_percent', 25,
        'subsidy_ceiling_inr', 2500000,
        'institutional_finance_reference_ceiling_inr', 10000000,
        'benefit_buckets_must_remain_separate', true,
        'eligible_asset_condition', 'New plant, machinery or equipment through eligible term loan',
        'eligible_sector_boundary', 'Manufacturing and service MSEs, subject to current NIC, pollution and activity rules',
        'trading_activity_excluded', true,
        'red_category_excluded', true,
        'pli_route_required', true,
        'current_checklist_documents', 'Application form, undertaking/family undertaking, DIC clearance, PLI due-diligence certificate, GeM undertaking and recent caste certificate, subject to current route confirmation',
        'cited_nssh_cycle_end', '2026-03-31',
        'current_availability', 'Keep closed pending a verified post-31 March 2026 continuation, successor cycle, extension or current operating notice.',
        'dashboard_activity_is_not_continuation', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = sclcss_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-03-31T23:59:59+05:30'::timestamptz,
      label = 'The current portal and January 2026 checklist remain official reference evidence, but the cited NSSH cycle ended on 31 March 2026 and no universal continuation window is verified.',
      source_evidence = jsonb_build_object('source_url', 'https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'anchor', 'NSSH financial-cycle end and current continuation boundary', 'checked_at', '2026-09-08')
    where opportunity_version_id = sclcss_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select sclcss_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://sclcss.msme.gov.in/Common/Home.aspx', 'agency', 'SCLCSS current portal home', '25% subsidy, INR 25 lakh ceiling and lender-led route'),
      ('https://sclcss.msme.gov.in/Manual/Checklist_SCLCSS_Application_26Jan2026.pdf', 'guideline', 'SCLCSS application checklist January 2026', 'Operational document list; not proof of a new window'),
      ('https://sclcss.msme.gov.in/Manual/Guidelines.pdf', 'guideline', 'National SC-ST Hub revised guidelines 2025', '25% subsidy, eligible asset/sector conditions and NSSH cycle boundary'),
      ('https://www.msme.gov.in/sites/default/files/guidelines-SCLCSS1.PDF', 'guideline', 'Ministry SCLCSS guideline', 'Original scheme basis and eligibility cross-check'),
      ('https://sclcss.msme.gov.in/Manual/Constitution_Technical%20EvaluaionCommittee.pdf', 'guideline', 'SCLCSS technical evaluation committee memorandum', 'Activity/product relevance under SCLCSS'),
      ('https://dashboard.msme.gov.in/scsthub.aspx', 'ministry', 'National SC-ST Hub official dashboard', 'Current reporting context; not proof of continuation')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = sclcss_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
