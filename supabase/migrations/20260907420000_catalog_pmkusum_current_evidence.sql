-- Current official PM-KUSUM evidence.
-- The cited national scheme period ended on 31 March 2026. Keep this record
-- review-gated and closed until an official continuation or current state
-- implementation window is verified.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('National PM-KUSUM publicity and implementation page', 'https://pmkusum.mnre.gov.in/Publicity.html', 'implementing_portal', 'central', 'weekly', 2, true, 'Official national portal page with component assistance, implementation boundary and achievement context.'),
  ('PM-KUSUM revised FAQ PDF', 'https://pmkusum.mnre.gov.in/assets/pdf/PM%20KUSUM%20FAQs%20-%20Revised_%20April%20%28Brand%29.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official FAQ for component, stakeholder and assistance fine print.'),
  ('PM-KUSUM 2025 sunset memorandum', 'https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41', 'guideline', 'central', 'weekly', 1, true, 'Official memorandum stating the 31 March 2026 sunset boundary and state allocation context.')
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
  where slug = 'pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_route_boundary', 'The national record is not an actionable application route. Verify a designated State Government department, DISCOM or other official implementing agency and a current state-specific window before handoff.',
        'current_portal', 'https://pmkusum.mnre.gov.in/Publicity.html',
        'fraud_warning', 'Use only official MNRE or designated state implementing agency routes; the national portal warns about fraudulent PM-KUSUM websites.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_pmkusum_facts', jsonb_build_object(
          'official_sources_checked', '2026-09-07',
          'scheme_period_end', '2026-03-31',
          'sunset_boundary_source', 'https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41',
          'national_portal_context', 'The national portal reports implementation and achievements after the cited period, but this does not by itself establish a new application window.',
          'state_allocation_boundary', 'The 2025 official memorandum states that target capacities were allocated to states and that state implementing agencies control the operational route.',
          'current_availability', 'No post-31 March 2026 central continuation or universal application window was evidenced in the official sources checked; keep closed pending an official extension or state-specific current window.'
        ),
        'current_source_reconciliation', 'The MNRE scheme page, national portal, revised FAQ and 2025 sunset memorandum were reconciled on 7 September 2026. Component assistance remains represented as historical/current-guideline context, while the opportunity is not actionable until continuation and a designated state route are verified.',
        'review_note', 'Do not recommend an active application from the national record. A reviewer must verify any state-specific live window, designated implementing agency, allocation, vendor and beneficiary terms before surfacing an actionable route.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-03-31T23:59:59+05:30'::timestamptz,
      label = 'The cited PM-KUSUM scheme period ended on 31 March 2026. No post-period central continuation is asserted; state-specific routes require separate official verification.',
      source_evidence = jsonb_build_object('source_url', 'https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41', 'anchor', 'Sunset date 31 March 2026 and state allocation context', 'checked_at', '2026-09-07')
    where opportunity_version_id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://mnre.gov.in/en/pradhan-mantri-kisan-urja-suraksha-evam-utthaan-mahabhiyaan-pm-kusum/', 'ministry', 'MNRE PM-KUSUM scheme page', 'Objectives, components, beneficiaries and period'),
      ('https://pmkusum.mnre.gov.in/Publicity.html', 'agency', 'National PM-KUSUM publicity and implementation page', 'Component assistance, implementation boundary and achievement context'),
      ('https://pmkusum.mnre.gov.in/assets/pdf/PM%20KUSUM%20FAQs%20-%20Revised_%20April%20%28Brand%29.pdf', 'guideline', 'PM-KUSUM revised FAQ', 'Component, stakeholder and assistance fine print'),
      ('https://apipmk.mnre.gov.in/api/Master_Document_Landing/SliderImage?docid=190&docspid=41', 'guideline', 'PM-KUSUM 2025 sunset memorandum', 'Sunset date 31 March 2026 and state allocation context')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
