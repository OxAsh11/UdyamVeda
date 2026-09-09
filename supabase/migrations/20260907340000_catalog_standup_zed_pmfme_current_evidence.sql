-- Current-source reconciliation for Stand Up India, ZED and PMFME.
-- Stand Up India is explicitly preserved as a closed historical opportunity;
-- any successor proposal must be separately notified and separately reviewed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Stand Up India current DFS page', 'https://financialservices.gov.in/stand-india-scheme-supi', 'ministry_portal', 'central', 'weekly', 1, true, 'Current DFS page records the historical end date and separately describes a successor proposal that was still under preparation.'),
  ('Stand Up India handholding portal', 'https://www.standupmitra.in/', 'implementing_portal', 'central', 'monthly', 2, true, 'Historical handholding/application discovery route; do not infer that portal availability reopens the scheme.'),
  ('JanSamarth credit-linked scheme portal', 'https://www.jansamarth.in/', 'national_portal', 'central', 'weekly', 1, true, 'Official credit-linked scheme discovery and application route; current scheme listing must be reconciled before handoff.'),
  ('DC MSME ZED current guideline page', 'https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx', 'ministry_portal', 'central', 'monthly', 1, true, 'Current ZED levels, fee examples, subsidy rates, eligibility, QCI implementation and portal route.'),
  ('ZED official application portal', 'https://zed.msme.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official ZED application and certification route; portal operation and current assessment terms require review.'),
  ('ZED official contact route', 'https://zed.msme.gov.in/contact-us', 'implementing_portal', 'central', 'monthly', 2, true, 'Official contact route for resolving current certification and application questions.'),
  ('PMFME current official portal', 'https://pmfme.mofpi.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Current PMFME notices, component descriptions, application statistics and implementation resources.'),
  ('PMFME notices and guidelines index', 'https://pmfme.mofpi.gov.in/pmfme/newsletters/', 'guideline_index', 'central', 'weekly', 1, true, 'Official index for base guidelines, component modifications, ODOP resources and current notices.'),
  ('PMFME individual and group modification guideline', 'https://pmfme.mofpi.gov.in/massets/documents/advertisement-doc/PMFME_Guidelines_Modification.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official modification document for individual and group components; must be reconciled with later portal notices.')
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
  stand_up_version_id uuid;
  zed_version_id uuid;
  pmfme_version_id uuid;
begin
  select current_version_id into stand_up_version_id
  from public.opportunities
  where slug = 'stand-up-india-scheme';

  select current_version_id into zed_version_id
  from public.opportunities
  where slug = 'msme-sustainable-zed-certification';

  select current_version_id into pmfme_version_id
  from public.opportunities
  where slug = 'pm-formalisation-micro-food-processing-enterprises';

  if stand_up_version_id is not null then
    update public.opportunity_versions
    set
      application = application || jsonb_build_object(
        'portal', 'https://financialservices.gov.in/stand-india-scheme-supi',
        'portal_aliases', jsonb_build_array('https://www.standupmitra.in/', 'https://www.jansamarth.in/')
      ),
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'The current DFS page states that Stand Up India was available up to 31 March 2025 and describes a successor proposal as still under preparation. This version is historical and must not be shown as an active application opportunity.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = stand_up_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2025-03-31 23:59:59+05:30'::timestamptz,
      label = 'Historical scheme window ended on 31 March 2025; a successor proposal is not treated as an active entitlement.',
      source_evidence = source_evidence || jsonb_build_object(
        'current_source_url', 'https://financialservices.gov.in/stand-india-scheme-supi',
        'current_source_anchor', 'Last updated 5 February 2026; scheme stated as up to 31 March 2025; successor proposal under preparation'
      )
    where opportunity_version_id = stand_up_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select stand_up_version_id, source_url, 'agency', source_title, source_anchor, now(), false
    from (values
      ('https://financialservices.gov.in/stand-india-scheme-supi', 'Stand Up India current DFS page', 'Last updated 5 February 2026; scheme window up to 31 March 2025 and successor proposal note'),
      ('https://www.standupmitra.in/', 'Stand Up India handholding portal', 'Historical handholding and application guidance route'),
      ('https://www.jansamarth.in/', 'JanSamarth credit-linked scheme portal', 'Official credit-linked discovery/application route requiring current listing reconciliation')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = stand_up_version_id and source_url = evidence.source_url
    );
  end if;

  if zed_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'The current DC MSME ZED page confirms manufacturing Udyam eligibility, QCI implementation, Bronze/Silver/Gold fee examples, joining reward and differentiated subsidy/support categories. These financial supports remain separate from certification and are not one direct grant.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = zed_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select zed_version_id, source_url, 'agency', source_title, source_anchor, now(), false
    from (values
      ('https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx', 'DC MSME ZED current guideline page', 'Key Benefits; Eligibility/Applicability; Implementing Agency; How to apply'),
      ('https://zed.msme.gov.in/', 'ZED official application portal', 'Official portal route and current application operation'),
      ('https://zed.msme.gov.in/contact-us', 'ZED official contact route', 'Official contact and query route')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = zed_version_id and source_url = evidence.source_url
    );
  end if;

  if pmfme_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'The current PMFME portal shows component-specific subsidy/support, current notices including a 30 December 2025 primary-processing clarification, and State/UT and district implementation resources. The individual-unit record remains review-gated until these notices and modifications are reconciled with the base guideline.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = pmfme_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select pmfme_version_id, source_url, 'ministry', source_title, source_anchor, now(), false
    from (values
      ('https://pmfme.mofpi.gov.in/', 'PMFME current official portal', 'Current notices, component descriptions, implementation resources and portal operation'),
      ('https://pmfme.mofpi.gov.in/pmfme/newsletters/', 'PMFME notices and guidelines index', 'Base guidelines, component modifications, ODOP and implementation documents'),
      ('https://pmfme.mofpi.gov.in/massets/documents/advertisement-doc/PMFME_Guidelines_Modification.pdf', 'PMFME individual and group modification guideline', 'Modification of individual and group component conditions')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = pmfme_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
