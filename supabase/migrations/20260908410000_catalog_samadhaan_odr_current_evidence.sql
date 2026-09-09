-- Current MSME Samadhaan/ODR reconciliation. Keep legal recovery assistance,
-- ODR process timing and MSEFC procedure separate and review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME ODR delayed-payment guidelines', 'https://odr.msme.gov.in/assets/pdf/MSE_Scheme_on_ODR_for_Delayed_Payment_Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ODR guideline for the pre-MSEFC stage and delayed-payment application process; current portal operation requires review.'),
  ('MSME Samadhaan current Ministry page', 'https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan', 'ministry_portal', 'central', 'weekly', 1, true, 'Current Ministry page for MSMED Act, MSEFC and valid-Udyam applicant context.')
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
        'current_route_checked_at', '2026-09-08',
        'credential_boundary', 'The claimant must use the official account, password, captcha and OTP flow; UdyamVeda must not store or use those credentials.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current Ministry page, ODR portal/seller route, ODR guideline and Annual Report 2025-26 were checked on 8 September 2026. New cases are represented as ODR-first with Samadhaan integration.',
        'odr_pre_msefc_process_days', 15,
        'odr_consent_extension_max_days', 15,
        'odr_buyer_reply_days', 3,
        'msefc_registration_statement_days', 15,
        'separate_process_timing', true,
        'no_grant_or_loan', true,
        'no_guaranteed_recovery', true,
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = samadhaan_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select samadhaan_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://ramp.msme.gov.in/ramp/RAMP-initiative/msme-samadhaan/msme-samadhaan', 'ministry_portal', 'MSME Samadhaan current Ministry page', 'MSMED Act Sections 15-24, MSEFC route and valid-Udyam micro/small applicant'),
      ('https://odr.msme.gov.in/', 'agency', 'MSME ODR official portal', 'Dispute avoidance, containment and resolution; links to MSEFC and Samadhaan'),
      ('https://odr.msme.gov.in/seller/', 'agency', 'MSME ODR claimant/seller route', 'Udyam claimant/seller login and filing entry point'),
      ('https://odr.msme.gov.in/assets/pdf/MSE_Scheme_on_ODR_for_Delayed_Payment_Guidelines.pdf', 'guideline', 'MSE Scheme on ODR for Delayed Payment Guidelines', 'Pre-MSEFC 15-day process, possible consent extension and buyer communication'),
      ('https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'MSME Annual Report 2025-26', 'New delayed-payment cases on ODR from 15 October 2025 and Samadhaan integration')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = samadhaan_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
