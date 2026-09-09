-- Current-source reconciliation for Udyam Registration.
-- The record remains review-gated because the portal workflow and identity
-- handling must be reviewed before UdyamVeda presents a preparation journey.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Udyam Registration official important-information page', 'https://udyamregistration.gov.in/Important.aspx', 'agency', 'central', 'monthly', 1, true, 'Current official thresholds, free/paperless/self-declaration, identity fields, no-upload and no-renewal guidance.')
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

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select version_id, 'https://udyamregistration.gov.in/Important.aspx', 'agency', 'Udyam Registration official important-information page', 'Current thresholds, free/paperless/self-declaration, no upload, no renewal and official fee warning', now(), false
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id and source_url = 'https://udyamregistration.gov.in/Important.aspx'
  );

  update public.opportunity_versions
  set
    eligibility = eligibility || jsonb_build_object(
      'classification_thresholds', jsonb_build_object(
        'effective_from', '2025-04-01',
        'micro', jsonb_build_object('investment_inr_max', 25000000, 'turnover_inr_max', 100000000),
        'small', jsonb_build_object('investment_inr_max', 250000000, 'turnover_inr_max', 1000000000),
        'medium', jsonb_build_object('investment_inr_max', 1250000000, 'turnover_inr_max', 5000000000)
      )
    ),
    application = application || jsonb_build_object(
      'identity_requirements', jsonb_build_object(
        'sole_proprietorship', 'proprietor Aadhaar',
        'partnership', 'managing partner Aadhaar',
        'huf', 'karta Aadhaar',
        'company_llp_cooperative_society_trust', 'organisation or authorised signatory Aadhaar plus PAN and GSTIN where applicable'
      )
    ),
    fine_print = fine_print || jsonb_build_object(
      'classification_basis', 'investment in plant and machinery or equipment and turnover, using the current portal linked-government data where applicable',
      'current_source_reconciliation', 'Official Udyam portal checked for current thresholds, Aadhaar/PAN/GST identity fields, free paperless self-declaration, no-upload and no-renewal terms.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
