-- Current MSME Samadhaan / ODR route evidence.
-- New delayed-payment cases must not be represented as a simple legacy
-- Samadhaan handoff without the current ODR integration boundary.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Online Dispute Resolution portal', 'https://odr.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official MSME ODR portal for digital dispute avoidance, containment and resolution; current delayed-payment route must be verified at handoff.'),
  ('MSME ODR claimant seller route', 'https://odr.msme.gov.in/seller/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official claimant/seller entry point for the current MSME ODR route.'),
  ('MSME Annual Report 2025-26 delayed-payment update', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official Ministry annual report recording the post-15 October 2025 ODR route and its integration with Samadhaan.')
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
  samadhaan_version_id uuid;
begin
  select current_version_id into samadhaan_version_id
  from public.opportunities
  where slug = 'msme-samadhaan-delayed-payment-assistance';

  if samadhaan_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'portal', 'https://odr.msme.gov.in/seller/',
        'integrated_samadhaan_portal', 'https://samadhaan.msme.gov.in/',
        'route', 'For new delayed-payment cases, use the current MSME ODR claimant/seller route and verify the live Samadhaan handoff; the relevant State MSEFC examines the statutory reference.',
        'current_route_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'payment_delay_trigger_days', 45,
        'complaint_registration_target_days', 15,
        'current_route', jsonb_build_object(
          'effective_from', '2025-10-15',
          'new_cases', 'The Ministry''s 2025-26 Annual Report states that new delayed-payment cases are being filed on the MSME ODR Portal, which is being integrated with Samadhaan.',
          'odr_scope', 'The official ODR portal describes dispute avoidance, containment and resolution through digital access; this does not guarantee recovery or a decision timeline.'
        ),
        'current_source_reconciliation', 'The legacy Samadhaan portal remains an official reference and integration point, but the current Ministry route for new cases must be checked through MSME ODR before an applicant is handed off.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = samadhaan_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select samadhaan_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://odr.msme.gov.in/', 'agency', 'MSME ODR official portal', 'Dispute avoidance, containment and resolution; official service scope'),
      ('https://odr.msme.gov.in/seller/', 'agency', 'MSME ODR claimant/seller route', 'Udyam claimant/seller login and filing entry point'),
      ('https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'MSME Annual Report 2025-26', 'Section 1.7.1: 45-day trigger, 15-day registration statement and new ODR route from 15 October 2025')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = samadhaan_version_id and source_url = evidence.source_url
    );

    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select samadhaan_version_id, 3, 'Use the current ODR/Samadhaan route', 'For a new case, follow the official ODR claimant/seller route and its Samadhaan integration for examination by the relevant State MSE Facilitation Council.', 'https://odr.msme.gov.in/seller/'
    where not exists (
      select 1 from public.opportunity_steps
      where opportunity_version_id = samadhaan_version_id and title = 'Use the current ODR/Samadhaan route'
    );
  end if;
end $$;
