-- Reconcile Udyam Registration with current official portal/form evidence and
-- the Ministry of MSME's 2025-26 threshold publication. Keep identity data
-- and OTP handling outside the catalog by default.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Udyam current new-enterprise registration form', 'https://udyamregistration.gov.in/UdyamRegistration.aspx/', 'agency', 'central', 'monthly', 1, true, 'Current official form for Aadhaar role, PAN/GST fields, organisation type and applicant consent.'),
  ('Udyam official application form PDF', 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf', 'agency', 'central', 'monthly', 1, true, 'Official application-form structure and identity/data-consent evidence.'),
  ('MSME Annual Report 2025-26 classification section', 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'central', 'monthly', 1, true, 'Ministry publication recording the revised MSME classification criteria effective 2025-04-01.')
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
  where slug = 'udyam-registration';

  if version_id is null then
    return;
  end if;

  update public.opportunity_versions
  set
    eligibility = coalesce(eligibility, '{}'::jsonb) || jsonb_build_object(
      'classification_thresholds', jsonb_build_object(
        'effective_from', '2025-04-01',
        'source_basis', 'MSME Annual Report 2025-26 Section 1.2.4 plus current Udyam portal',
        'micro', jsonb_build_object('investment_inr_max', 25000000, 'turnover_inr_max', 100000000),
        'small', jsonb_build_object('investment_inr_max', 250000000, 'turnover_inr_max', 1000000000),
        'medium', jsonb_build_object('investment_inr_max', 1250000000, 'turnover_inr_max', 5000000000)
      )
    ),
    application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
      'official_form_url', 'https://udyamregistration.gov.in/UdyamRegistration.aspx/',
      'application_pdf_url', 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf',
      'current_route_checked_at', '2026-09-08',
      'otp_boundary', 'UdyamVeda must not collect, store or use applicant OTPs; the applicant must complete the official verification.'
    ),
    fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
      'current_source_reconciliation', 'Current official Udyam portal, form and application PDF were checked on 2026-09-08; the Ministry Annual Report 2025-26 records the revised 2025-04-01 classification thresholds.',
      'portal_is_free_paperless_self_declared', true,
      'documents_uploaded_for_registration', false,
      'certificate_dynamic_qr', true,
      'renewal_required', false,
      'one_registration_per_enterprise', true,
      'multiple_activities_allowed', true,
      'private_intermediary_fee_warning', true,
      'aadhaar_pan_storage_requires_security_review', true,
      'current_route_checked_at', '2026-09-08'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  values
    (version_id, 'https://udyamregistration.gov.in/Important.aspx', 'agency', 'Udyam official Important Information page', 'Free, paperless, self-declaration, no-upload, no-renewal and one-registration boundaries', now(), false),
    (version_id, 'https://udyamregistration.gov.in/UdyamRegistration.aspx/', 'agency', 'Udyam current new-enterprise registration form', 'Aadhaar role, PAN/GST fields, organisation type and consent', now(), false),
    (version_id, 'https://udyamregistration.gov.in/docs/UdyamApplication.pdf', 'agency', 'Udyam official application form', 'Aadhaar/PAN/GST verification and consent fields', now(), false),
    (version_id, 'https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf', 'ministry', 'MSME Annual Report 2025-26', 'Section 1.2.4: revised classification criteria effective 2025-04-01', now(), false)
  on conflict do nothing;
end $$;
