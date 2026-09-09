-- Current-source reconciliation for FSSAI registration and licensing.
-- The 2026 turnover thresholds materially change the route shown to users;
-- keep them review-gated until the live FoSCoS matrix is checked.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('FSSAI 2026 licensing and registration amendment FAQ', 'https://fssai.gov.in/upload/advisories/2026/03/69c6a23234827order_27032026.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official FSSAI FAQ for revised turnover bands and perpetual validity effective for covered new applications from 1 April 2026.')
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
  where slug = 'fssai-food-business-registration-licensing';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    eligibility = eligibility || jsonb_build_object(
      'thresholds', jsonb_build_object(
        'registration_annual_turnover_up_to_inr', 15000000,
        'state_license_annual_turnover_above_inr', 15000000,
        'state_license_annual_turnover_up_to_inr', 500000000,
        'central_license_annual_turnover_above_inr', 500000000,
        'new_application_threshold_effective_date', '2026-04-01'
      )
    ),
    fine_print = fine_print || jsonb_build_object(
      'current_2026_facts', jsonb_build_object(
        'thresholds_effective_from', '2026-04-01',
        'registration_band', 'Up to INR 1.5 crore for new applications covered by the 2026 amendment FAQ',
        'state_license_band', 'Above INR 1.5 crore and up to INR 50 crore',
        'central_license_band', 'Above INR 50 crore',
        'validity', 'The 2026 amendment FAQ states that FSSAI licences and registrations have perpetual validity unless suspended, cancelled or surrendered; continuing food-safety compliance still applies',
        'migration', 'Existing food businesses may require migration through FoSCoS to align with revised thresholds'
      ),
      'current_source_reconciliation', 'The official FSSAI 2026 amendment FAQ supersedes the older 12-lakh threshold for covered new applications from 1 April 2026 and records the revised registration/state/central bands and perpetual-validity statement.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select
    version_id,
    'https://fssai.gov.in/upload/advisories/2026/03/69c6a23234827order_27032026.pdf',
    'guideline',
    'FAQs on Food Safety and Standards (Licensing and Registration of Food Businesses) Amendment Regulations, 2026',
    'Revised turnover bands effective 1 April 2026; perpetual validity; migration through FoSCoS',
    now(),
    true
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id
      and source_url = 'https://fssai.gov.in/upload/advisories/2026/03/69c6a23234827order_27032026.pdf'
  );
end $$;
