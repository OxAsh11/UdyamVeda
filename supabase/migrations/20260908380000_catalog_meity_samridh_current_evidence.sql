-- Current SAMRIDH source reconciliation. Keep investment, matching capital and
-- accelerator services separate, and keep the record review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY Startup Hub SAMRIDH current page', 'https://msh.meity.gov.in/schemes/samridh', 'agency_portal', 'central', 'weekly', 1, true, 'Current SAMRIDH programme page, cohort context and accelerator route.'),
  ('SAMRIDH official scheme document', 'https://msh.meity.gov.in/assets/Scheme-Report.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme document for investment model, accelerator selection, cohort services and eligibility.'),
  ('SAMRIDH second-cohort memorandum', 'https://msh.meity.gov.in/assets/samridh2ndcohrot/SAMRIDH%202nd%20Cohort%20OM%20Final.pdf', 'circular', 'central', 'monthly', 1, true, 'Official enabling-partner selection memorandum; not an open startup call.'),
  ('Startup India June 2026 schemes playbook - SAMRIDH', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_catalog', 'central', 'monthly', 2, true, 'Official discovery cross-check; governing eligibility and terms remain with MeitY sources.')
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
  where slug = 'startup-accelerator-meity-samridh';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_route', 'Startup applies through a verified participating SAMRIDH accelerator or current cohort route; the MSH page is not itself proof of an open startup call.',
        'current_programme_page', 'https://msh.meity.gov.in/schemes/samridh',
        'applicant_controlled_investment_documents', true
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_source_reconciliation', 'The current MSH page displays the result of SAMRIDH Cohort 2. The official scheme document describes government and equal private matching investment through accelerator-led equity-linked instruments, while the second-cohort memorandum is partner-selection evidence.',
        'investment_not_grant', true,
        'government_investment_max_inr', 4000000,
        'private_matching_investment_max_inr', 4000000,
        'separate_value_buckets', true,
        'current_cohort_status', 'cohort_2_result_displayed_no_open_startup_window_verified',
        'current_route_checked_at', '2026-09-08'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://msh.meity.gov.in/schemes/samridh', 'agency', 'MeitY Startup Hub SAMRIDH current page', 'Current programme summary and Cohort 2 result surface'),
      ('https://msh.meity.gov.in/assets/Scheme-Report.pdf', 'guideline', 'SAMRIDH official scheme document', 'Investment model, accelerator selection and six-month cohort services'),
      ('https://msh.meity.gov.in/assets/samridh2ndcohrot/SAMRIDH%202nd%20Cohort%20OM%20Final.pdf', 'circular', 'SAMRIDH second-cohort memorandum', 'Selection of enabling partners for Cohort 2'),
      ('https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_catalog', 'Startup India June 2026 schemes playbook', 'SAMRIDH summary on pages 49-50')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = version_id and source_url = evidence.source_url
    );
  end if;
end $$;
