-- Current official export-access evidence.
-- EPM is a framework with phased sub-scheme routes, MAI remains agency-led,
-- and RoDTEP has an explicit continuation through 30 September 2026.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Export Promotion Mission operational status', 'https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf', 'policy_update', 'central', 'weekly', 1, true, 'Official statement confirming EPM approval, FY 2025-31 outlay and phased operationalisation of MSME exporter interventions.'),
  ('Department of Commerce scheme claims monitor', 'https://apps.commerce.gov.in/schemes/schemereport', 'ministry_portal', 'central', 'weekly', 2, true, 'Official claims monitor with MAI reporting through August 2026; operational context, not a universal direct-applicant window.'),
  ('RoDTEP continuation notification through September 2026', 'https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf', 'gazette', 'central', 'weekly', 1, true, 'Official DGFT Notification 74/2025-26 dated 31 March 2026 continuing RoDTEP through 30 September 2026.')
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
  epm_version_id uuid;
  mai_version_id uuid;
  rodtep_version_id uuid;
begin
  select current_version_id into epm_version_id from public.opportunities where slug = 'export-promotion-mission-niryat-protsahan-niryat-disha';
  if epm_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_route_boundary', 'The Department of Commerce confirms that interest subvention for pre/post-shipment export credit and collateral support for export credit are operationalised for MSME exporters; remaining interventions are being rolled out in phases.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_epm_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'operational_status_source', 'https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf',
          'approved_period', 'FY 2025-26 to FY 2030-31',
          'msme_exporter_interventions_operationalised', jsonb_build_array('interest_subvention_for_pre_and_post_shipment_export_credit', 'collateral_support_for_export_credit'),
          'phased_interventions', jsonb_build_array('export_factoring', 'credit_assistance_for_ecommerce_exporters', 'credit_enhancement_for_export_diversification', 'quality_and_compliance', 'branding_and_packaging', 'market_access', 'logistics_and_warehousing', 'trade_intelligence'),
          'current_availability', 'The mission framework is current, but each intervention requires its own implementing notice, lender or agency route and eligibility review.'
        ),
        'current_source_reconciliation', 'The February 2026 Department of Commerce policy update and operational-status statement were checked on 7 September 2026. The record remains a framework-level opportunity and does not convert the mission outlay into a direct applicant entitlement.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = epm_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select epm_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.commerce.gov.in/wp-content/uploads/2026/02/Starred-Question-87.pdf', 'ministry', 'Export Promotion Mission operational status', 'EPM approval, six-year outlay and operationalised MSME exporter interventions')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = epm_version_id and source_url = evidence.source_url);
  end if;

  select current_version_id into mai_version_id from public.opportunities where slug = 'market-access-initiative-mai';
  if mai_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal_context', 'The official claims monitor reports MAI claims through August 2026; this is operational reporting, not a direct application window for every exporter.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_mai_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'claims_monitor', 'https://apps.commerce.gov.in/schemes/schemereport',
          'reporting_cutoff', 'August 2026',
          'reporting_context', 'The Department of Commerce monitor lists MAI claims and disbursement reporting; the route remains agency-led and project-specific.',
          'current_availability', 'No universal direct exporter application window or applicant ceiling is asserted; verify the eligible agency, project call, cost-sharing and beneficiary pass-through terms.'
        ),
        'current_source_reconciliation', 'The 2021 MAI guideline and current Department of Commerce claims monitor were checked on 7 September 2026. The record remains an agency-led project support route, not a universal direct grant.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = mai_version_id;

    update public.opportunity_windows
    set label = 'Agency proposal windows and current project approval rounds require verification; the official claims monitor is current operational context.',
        source_evidence = jsonb_build_object('source_url', 'https://apps.commerce.gov.in/schemes/schemereport', 'anchor', 'Market Access Initiative claims monitor through August 2026; project proposals and procedure remain agency-led', 'checked_at', '2026-09-07')
    where opportunity_version_id = mai_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select mai_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://apps.commerce.gov.in/schemes/schemereport', 'ministry', 'Department of Commerce scheme claims monitor', 'Market Access Initiative claims through August 2026')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = mai_version_id and source_url = evidence.source_url);
  end if;

  select current_version_id into rodtep_version_id from public.opportunities where slug = 'remission-of-duties-and-taxes-on-exported-products-rodtep';
  if rodtep_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_route_boundary', 'DGFT Notification 74/2025-26 continues RoDTEP for eligible exports from 1 April through 30 September 2026 at rates and value caps in force on 31 March 2026, subject to existing terms.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_rodtep_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'continuation_notification', 'https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf',
          'eligible_export_period', '2026-04-01 to 2026-09-30',
          'rate_boundary', 'Rates and value caps in force on 31 March 2026 continue during the notified six-month period.',
          'current_availability', 'Current for eligible exports through 30 September 2026; product tariff line, cap, exporter category, customs documentation and no-double-benefit conditions still require verification.'
        ),
        'current_source_reconciliation', 'DGFT Notification 74/2025-26 dated 31 March 2026 was checked on 7 September 2026 and establishes the current six-month continuation. The current rate schedule remains tariff-line-specific and is not represented as a universal percentage.'
      ),
      last_verified_at = now(), review_status = 'in_review'
    where id = rodtep_version_id;

    update public.opportunity_windows
    set window_type = 'fixed',
        closes_at = '2026-09-30T23:59:59+05:30'::timestamptz,
        label = 'Eligible exports are covered through 30 September 2026 under DGFT Notification 74/2025-26; tariff-line rates, caps and claim mechanics require verification.',
        source_evidence = jsonb_build_object('source_url', 'https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf', 'anchor', 'Continuation from 1 April to 30 September 2026 and rates/caps in force on 31 March 2026', 'checked_at', '2026-09-07')
    where opportunity_version_id = rodtep_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select rodtep_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://content.dgft.gov.in/Website/dgftprod/1322d65e-dd25-46ec-a7e9-7b0a3f9765f2/RoDTEP%20Notification.pdf', 'gazette', 'RoDTEP continuation notification through September 2026', 'Continuation from 1 April to 30 September 2026; rates and caps in force on 31 March 2026')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = rodtep_version_id and source_url = evidence.source_url);
  end if;
end $$;
