-- Current-source reconciliation for the CGSS dossier.
-- The source URLs and fine print are kept in a forward migration so an already
-- provisioned database receives the same evidence update as a fresh seed run.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NCGTC Credit Guarantee Scheme for Startups current product page', 'https://www.ncgtc.in/cgss/', 'agency', 'central', 'weekly', 1, true, 'Current NCGTC page links the operational guidelines, FAQs, notifications and registered Member Institutions.'),
  ('Jan Samarth Startup business-loan route', 'https://www.jansamarth.in/business-loan-startup-scheme', 'agency', 'central', 'weekly', 1, true, 'Startup-specific application route linked by the current Startup India CGSS page.')
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
  where slug = 'credit-guarantee-scheme-for-startups';

  if version_id is null then
    return;
  end if;

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select version_id, 'https://www.ncgtc.in/cgss/', 'agency', 'NCGTC Credit Guarantee Scheme for Startups current product page', 'Operational guidelines, FAQs, DPIIT notifications and registered Member Institution links', now(), false
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id and source_url = 'https://www.ncgtc.in/cgss/'
  );

  insert into public.opportunity_sources
    (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
  select version_id, 'https://www.jansamarth.in/business-loan-startup-scheme', 'agency', 'Jan Samarth Startup business-loan route', 'Startup-specific online application handoff', now(), false
  where not exists (
    select 1 from public.opportunity_sources
    where opportunity_version_id = version_id and source_url = 'https://www.jansamarth.in/business-loan-startup-scheme'
  );

  update public.opportunity_versions
  set
    eligibility = jsonb_set(
      eligibility,
      '{member_institution_conditions}',
      '["an RBI-registered NBFC must have a rating of BBB or above from an RBI-accredited external credit rating agency", "an eligible NBFC must have minimum net worth of Rs. 100 crore", "a SEBI-registered AIF must be an eligible Member Institution under the current framework"]'::jsonb,
      true
    ),
    application = jsonb_set(
      application,
      '{portal}',
      '"https://www.jansamarth.in/business-loan-startup-scheme"'::jsonb,
      true
    ),
    fine_print = fine_print || jsonb_build_object(
      'current_page_last_updated', '20 August 2026',
      'member_institution_conditions', jsonb_build_object(
        'rbi_registered_nbfc', jsonb_build_object(
          'minimum_rating', 'BBB',
          'minimum_networth_inr', 1000000000,
          'rating_source', 'External credit rating agency accredited by RBI'
        )
      ),
      'current_source_reconciliation', 'Startup India current CGSS page reviewed against the 8 May 2025 Gazette and current NCGTC product page; retain in review until fees, lock-in, claim conditions and current MI list are reconciled.'
    ),
    last_verified_at = now(),
    review_status = 'in_review'
  where id = version_id;
end $$;
