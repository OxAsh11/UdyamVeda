-- Current ZED reconciliation for controlled Batch 087 review.
-- Keep certification, subsidy/reward and other support categories separate.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('ZED operational guideline', 'https://dcmsme.gov.in/schemes/clcs-tus/Operational_Guidelines_ZED.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official operational guideline retained for process and version reconciliation; apparent level terminology conflict requires review.'),
  ('ZED certification guideline document', 'https://www.dcmsme.gov.in/Guidelines_MSME%20Sustainable%28ZED%29Certification%20Scheme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ZED guideline document for pledge, assessment, certification and inspection boundaries.')
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
  where slug = 'msme-sustainable-zed-certification';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_portal', 'https://zed.msme.gov.in/',
        'current_route_boundary', 'Manufacturing MSMEs with Udyam registration use the official ZED portal; certification and support outcomes remain subject to pledge, assessment and current terms.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_zed_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'current_page_levels', jsonb_build_array('bronze', 'silver', 'gold'),
          'displayed_fee_examples_inr', jsonb_build_object('bronze', 10000, 'silver', 40000, 'gold', 90000),
          'joining_reward_inr', 10000,
          'certification_subsidy_percent', jsonb_build_object('micro', 80, 'small', 60, 'medium', 50),
          'implementing_agency', 'Quality Council of India',
          'level_version_conflict', 'An official operational-guideline result lists Diamond and Platinum terminology while the current DC MSME page states three levels; do not publish beyond the current three-level page until the controlling version is reconciled.',
          'review_boundary', 'Confirm pledge, undertaking, assessment, payment, inspection, claim timing and current guideline before publication.'
        ),
        'current_source_reconciliation', 'The current DC MSME ZED page, official portal, contact route and guideline documents were checked on 8 September 2026. Certification, joining reward, subsidy, testing, handholding and technology support remain separate and review-gated.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://dcmsme.gov.in/schemes/clcs-tus/Operational_Guidelines_ZED.pdf', 'guideline', 'ZED operational guideline', 'Certification process and level terminology for version reconciliation'),
      ('https://www.dcmsme.gov.in/Guidelines_MSME%20Sustainable%28ZED%29Certification%20Scheme.pdf', 'guideline', 'ZED certification guideline document', 'Pledge, assessment, certification and inspection boundaries')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
