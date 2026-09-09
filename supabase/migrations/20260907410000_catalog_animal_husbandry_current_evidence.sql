-- Current DAHD evidence for National Livestock Mission and AHIDF.
-- AHIDF's cited period has elapsed; do not expose an actionable window without
-- official continuation evidence.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('National Livestock Mission 2026 amended guidelines PDF', 'https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official February 2026 amended NLM guideline; current component and species terms require reviewer confirmation.'),
  ('DAHD National Livestock Mission page', 'https://dahd.gov.in/schemes/programmes/national_livestock_mission', 'ministry_portal', 'central', 'weekly', 1, true, 'Current NLM components and official application links.'),
  ('NLM 2026 amendment notice', 'https://dahd.gov.in/en/node/3986', 'ministry_portal', 'central', 'weekly', 1, true, 'Official notice circulating the February 2026 amended NLM guidelines.'),
  ('NLM EDP dashboard', 'https://nlm.udyamimitra.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official application/dashboard handoff; current State EOI availability requires review.'),
  ('AHIDF current DAHD page', 'https://www.dahd.gov.in/schemes/programmes/ahidf', 'ministry_portal', 'central', 'weekly', 1, true, 'Current official AHIDF page; cited outlay period ended 31 March 2026 and continuation requires evidence.'),
  ('DAHD Annual Report 2025-26 AHIDF section', 'https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official annual report for current AHIDF beneficiary categories, loan share, interest subvention and credit-guarantee boundaries.'),
  ('AHIDF application portal', 'https://ahidf.udyamimitra.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official loan application handoff; live continuation requires review.')
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
  nlm_version_id uuid;
  ahidf_version_id uuid;
begin
  select current_version_id into nlm_version_id
  from public.opportunities
  where slug = 'national-livestock-mission-entrepreneurship-development';

  if nlm_version_id is not null then
    update public.opportunity_versions
    set
      eligibility = coalesce(eligibility, '{}'::jsonb) || jsonb_build_object(
        'sectors', jsonb_build_array('rural_poultry', 'sheep_goat', 'piggery', 'camel', 'donkey', 'horse', 'mule', 'feed_fodder'),
        'current_amended_guideline', 'The February 2026 amended NLM guideline expands the breed-development focus to camel, donkey, horse and mule activities in addition to poultry, sheep, goat and piggery.'
      ),
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_guideline', 'https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf',
        'route', 'The State Implementing Agency invites eligible entities through the applicable expression-of-interest route; after state appraisal and approval, the project is uploaded through the NLM portal.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'amendment_note', 'DAHD published amended implementation guidance in February 2026; the amended PDF must be treated as the current primary guideline pending reviewer confirmation.',
        'current_nlm_facts', jsonb_build_object(
          'official_guideline_checked', '2026-09-07',
          'amended_guideline', 'https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf',
          'state_route', 'State Implementing Agencies invite proposals through the applicable EOI route and forward approved projects through the online NLM process.',
          'additional_species_focus', jsonb_build_array('camel', 'donkey', 'horse', 'mule'),
          'availability_boundary', 'No universal deadline is asserted; component and State EOI availability must be checked before recommendation.'
        ),
        'current_source_reconciliation', 'The February 2026 amended guideline supersedes the older NLM handbook for current component and species review; the State EOI and dashboard route remain operationally variable.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = nlm_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select nlm_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf', 'guideline', 'National Livestock Mission 2026 amended guidelines', 'February 2026 amended guideline; additional species, State EOI and current component rules'),
      ('https://dahd.gov.in/en/node/3986', 'ministry', 'NLM 2026 amendment notice', 'Circulation of Amended Implementation Guidelines for National Livestock Mission'),
      ('https://dahd.gov.in/schemes/programmes/national_livestock_mission', 'ministry', 'DAHD National Livestock Mission page', 'Current NLM components and official application links'),
      ('https://nlm.udyamimitra.in/', 'agency', 'NLM EDP dashboard', 'Official application/dashboard handoff')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = nlm_version_id and source_url = evidence.source_url
    );
  end if;

  select current_version_id into ahidf_version_id
  from public.opportunities
  where slug = 'animal-husbandry-infrastructure-development-fund-ahidf';

  if ahidf_version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_portal', 'https://ahidf.udyamimitra.in/',
        'current_route_boundary', 'Do not present an actionable application route until official post-March-2026 continuation evidence is confirmed.',
        'current_source_checked_at', '2026-09-07'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'entity_caveat', 'The current DAHD page states that dairy cooperatives are eligible after DIDF was subsumed into AHIDF; older FAQ/guideline wording must still be reconciled before publication.',
        'current_ahidf_facts', jsonb_build_object(
          'official_page_checked', '2026-09-07',
          'cited_outlay_period_end', '2026-03-31',
          'current_availability', 'Do not present AHIDF as an active actionable window until official post-March-2026 continuation evidence is confirmed.',
          'eligible_entities_current_page', jsonb_build_array('individual entrepreneurs', 'private companies', 'MSME', 'FPOs', 'Section 8 companies', 'dairy cooperatives'),
          'loan_share_max_percent', 90,
          'interest_subvention_percent', 3,
          'no_universal_term_loan_ceiling_in_annual_report', true,
          'credit_guarantee_msmE_percent', 25
        ),
        'current_source_reconciliation', 'The official AHIDF page and 2025-26 Annual Report retain the scheme and financing mechanics but cite an outlay period ending 31 March 2026. A current continuation decision is required before publication.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = ahidf_version_id;

    update public.opportunity_windows
    set
      window_type = 'closed',
      closes_at = '2026-03-31T23:59:59+05:30'::timestamptz,
      label = 'The cited AHIDF outlay period ended on 31 March 2026. No post-March-2026 continuation is asserted until official evidence is reviewed; do not show an actionable application window.',
      source_evidence = jsonb_build_object('source_url', 'https://www.dahd.gov.in/schemes/programmes/ahidf', 'anchor', 'Revised outlay through FY 2025-26 till 31.03.2026', 'checked_at', '2026-09-07')
    where opportunity_version_id = ahidf_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select ahidf_version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://www.dahd.gov.in/schemes/programmes/ahidf', 'ministry', 'AHIDF current DAHD page', 'Cited outlay period through 31 March 2026 and dairy cooperative eligibility'),
      ('https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'ministry', 'DAHD Annual Report 2025-26 AHIDF section', 'AHIDF current entity, loan-share and guarantee boundaries'),
      ('https://ahidf.udyamimitra.in/', 'agency', 'AHIDF application portal', 'Official loan application handoff; live continuation requires review')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = ahidf_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
