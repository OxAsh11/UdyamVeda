-- Women Entrepreneurship Platform (WEP). This is an ecosystem and access
-- platform, not a direct grant or subsidy. It must not be presented as a
-- guaranteed financing entitlement.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Women Entrepreneurship Platform official portal', 'https://wep.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official WEP portal with scheme discovery, access-to-finance, mentorship, incubator/accelerator, business-development and smart-match entry points. Current routes and partner terms require review.'),
  ('WEP official knowledge portal', 'https://wep.gov.in/knowledge-portal', 'agency_portal', 'central', 'monthly', 1, true, 'Official WEP knowledge portal describing central/state schemes, finance, incubators, accelerators, mentorship and business-development resources.'),
  ('NITI Aayog Women Entrepreneurship Platform description', 'https://niti.gov.in/sites/default/files/2025-06/Annual-Report2020-2021-%28English%29.pdf', 'ministry_portal', 'central', 'annual', 1, true, 'Official NITI Aayog annual report describing WEP as a unified-access aggregator of information resources and services for aspiring and established women entrepreneurs.')
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
  item jsonb;
  authority_id uuid;
  seed_opportunity_id uuid;
  version_id uuid;
begin
  for item in
    select value from jsonb_array_elements($records$[
      {
        "slug":"women-entrepreneurship-platform-wep",
        "name":"Women Entrepreneurship Platform (WEP)",
        "type":"mentorship",
        "authority":"Women Entrepreneurship Platform (WEP)",
        "authority_url":"https://wep.gov.in/",
        "canonical_url":"https://wep.gov.in/",
        "source_url":"https://wep.gov.in/knowledge-portal",
        "source_kind":"agency",
        "source_title":"Women Entrepreneurship Platform Knowledge Portal",
        "source_anchor":"Knowledge Portal categories: schemes, access to finance, incubators and accelerators, business development support, mentorship and services",
        "summary":"A government-supported unified-access platform helping aspiring and established women entrepreneurs discover schemes, finance resources, mentors, incubators, accelerators and business-development support.",
        "objective":"Improve access to information, mentorship, finance pathways, markets and ecosystem support for women-led entrepreneurship across India.",
        "legal_basis":"WEP is an official NITI Aayog-originated entrepreneurship ecosystem platform. Specific schemes, services, competitions and partner offerings discovered through WEP retain their own legal basis and eligibility conditions.",
        "eligibility":{"entity_types":["aspiring_entrepreneur","woman_entrepreneur","women_led_business","women_led_collective"],"founder_categories":["women_founder","women_led_collective"],"lifecycle_stages":["idea","pre_startup","early_stage","growth","scaling"],"industries":["all_sectors"],"locations":["India"],"conditions":["user is an aspiring or existing entrepreneur seeking women-focused ecosystem support","specific mentor, programme, scheme or partner resource eligibility is checked separately on the linked official route","smart matching may use industry, stage, location, language, ecosystem need, engagement mode and mentor preference"],"exclusions":["WEP membership or registration is not a promise of grant, loan sanction, investment, mentorship acceptance or business-service delivery","a WEP-listed scheme must not inherit WEP eligibility; the underlying scheme's official record controls","partner services, competitions and third-party offerings require their own terms and due diligence","the platform should not be represented as a government filing or disbursement portal"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://wep.gov.in/","route":"Register or use the relevant WEP discovery, smart-match, mentorship, access-to-finance or partner route, then follow the underlying official or partner programme instructions.","applicant_note":"UdyamVeda can help identify the relevant WEP category and prepare questions or documents, but cannot guarantee a match, endorsement, funding outcome or partner service.","fees":"Confirm any current partner-specific terms and fees on the linked official route before proceeding."},
        "fine_print":{"support_categories":["government_scheme_discovery","access_to_finance","mentorship","incubation","acceleration","market_linkages","business_development_services","events_and_workshops"],"non_financial_support":true,"no_direct_entitlement":true,"smart_match":"The portal describes personalized matching using business stage, industry, location and ecosystem needs; a match is a discovery result, not an eligibility decision or acceptance.","partner_disclaimer":"WEP pages identify partner and service-provider offerings; users must inspect the applicable terms and perform due diligence. UdyamVeda should preserve the distinction between official government support and partner content.","review_note":"Confirm current registration flow, access permissions, mentor/programme availability, partner disclosures, data-consent language, event status and whether each listed resource is government-operated, government-supported or third-party before publication."},
        "benefit_summary":{"types":["mentorship","training","market_access"],"summary":"Discovery and matching access to women-focused schemes, finance pathways, mentors, incubators, accelerators, market linkages and business-development resources; no guaranteed cash benefit is attached to the platform record.","separate_value_buckets":true},
        "benefit_type":"mentorship",
        "benefit_label":"Women-focused entrepreneurship ecosystem and mentorship access",
        "benefit_conditions":{"non_financial_support":true,"specific_resource_terms_apply":true,"no_grant_entitlement":true,"no_loan_sanction_guarantee":true,"partner_due_diligence_required":true},
        "requirement":"Women-founder profile and ecosystem need",
        "requirement_description":"Provide enough founder, business-stage, industry, location and ecosystem-need information to discover relevant WEP resources; each matched scheme or partner then requires its own eligibility and application evidence.",
        "rules":{"all":[{"field":"is_woman_entrepreneur_or_women_led_collective","operator":"equals","value":true},{"field":"ecosystem_support_need_identified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the ecosystem need","description":"Choose whether the immediate need is finance discovery, mentorship, incubation, acceleration, market access, business development or a workshop/resource.","url":"https://wep.gov.in/knowledge-portal"},{"title":"Complete the minimum profile","description":"Provide the stage, industry, location, language and other smart-match inputs that affect the relevant mentor or resource suggestions.","url":"https://wep.gov.in/"},{"title":"Inspect the matched resource","description":"Open the underlying scheme, mentor, incubator, accelerator or partner record and separate its own eligibility, fees, terms and authority from WEP's discovery role.","url":"https://wep.gov.in/"},{"title":"Use the official or disclosed partner route","description":"Continue through the official scheme portal or the disclosed partner route, retaining consent, terms and application records.","url":"https://wep.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Platform discovery and matching are presented as rolling services; verify current programme, mentor, event and partner availability before publication.",
        "window_evidence":{"source_url":"https://wep.gov.in/knowledge-portal","anchor":"Current knowledge portal categories and smart-match fields; portal availability and individual resource windows require separate verification"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'NITI Aayog', 'Women Entrepreneurship Platform', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.83, 0.80, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://niti.gov.in/sites/default/files/2025-06/Annual-Report2020-2021-%28English%29.pdf', 'ministry', 'NITI Aayog Annual Report - Women Entrepreneurship Platform', 'WEP description as a unified-access aggregator for women entrepreneurs', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://niti.gov.in/sites/default/files/2025-06/Annual-Report2020-2021-%28English%29.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://wep.gov.in/', 'agency', 'WEP official portal', 'Scheme, finance, mentorship, incubator, accelerator and smart-match entry points', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://wep.gov.in/');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    select version_id, item->>'window_type', item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;

-- Current WEP reconciliation for controlled Batch 089 review.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('WEP access-to-finance current page', 'https://wep.gov.in/access-finance/about-us', 'agency_portal', 'central', 'monthly', 1, true, 'Current WEP access-to-finance categories and partner/resource content; underlying scheme authorities remain controlling.'),
  ('WEP individual mentorship current page', 'https://wep.gov.in/mentor-individual-landing', 'agency_portal', 'central', 'monthly', 1, true, 'Current WEP mentee/mentor route, Smart Match fields, consent and no-sensitive-information boundary.'),
  ('WEP individual mentorship guidelines', 'https://wep.gov.in/individual-mentorship-guidelines-and-code-of-conduct', 'guideline', 'central', 'monthly', 1, true, 'Current WEP pro-bono mentor, conduct and service-boundary guidance.'),
  ('WEP/CII-Yi current disclaimer', 'https://wep.gov.in/ciiyi-disclaimer', 'disclaimer', 'central', 'monthly', 1, true, 'Current WEP/CII-Yi disclaimer requiring verification with the respective authorities and distinguishing external content.'),
  ('NITI Aayog Annual Report 2022-23 WEP description', 'https://niti.gov.in/sites/default/files/2023-02/Annual-Report-2022-2023-English_06022023_compressed.pdf?trk=public_post_comment-text', 'ministry_portal', 'central', 'annual', 1, true, 'Official NITI Aayog description of WEP as a unified-access aggregator and knowledge hub.')
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
  where slug = 'women-entrepreneurship-platform-wep';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_wep_route', 'https://wep.gov.in/knowledge-portal',
        'current_mentorship_route', 'https://wep.gov.in/mentor-individual-landing',
        'current_route_boundary', 'WEP provides discovery, matching and ecosystem services. The underlying Government scheme or partner route controls its own application, eligibility, fees and outcome.',
        'current_submission_boundary', 'UdyamVeda may explain WEP categories and prepare questions, but cannot guarantee matching, mentor acceptance, funding, partner service or Government approval.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_wep_reconciliation', jsonb_build_object(
          'observed_at', '2026-09-08',
          'platform_role', 'discovery_matching_and_ecosystem_support',
          'underlying_authority_controls', true,
          'current_categories', jsonb_build_array('funding', 'incubation_and_acceleration', 'mentoring_and_networking', 'market_linkages', 'business_development_services', 'schemes', 'publications', 'videos'),
          'mentorship_boundary', 'Current WEP mentorship welcomes women entrepreneurs and women-led collective enterprises; Smart Match uses stage, industry, location, language, ecosystem need and engagement mode. A match is not acceptance.',
          'service_boundary', 'Individual mentorship is described as free/pro-bono, mentees contact mentors first, and sensitive personal information should not be shared with mentors.',
          'content_boundary', 'WEP/CII-Yi disclaimer states that external content may not be complete or accurate and users should verify details with the respective authorities.',
          'partner_boundary', 'Partner and financial-institution listings require separate terms, authority classification, fees and due diligence.',
          'review_boundary', 'Confirm WEP/NITI Aayog authority mapping, registration and consent behavior, privacy/data controls, current availability and underlying-source verification before publication.'
        ),
        'current_source_reconciliation', 'Current WEP discovery, finance, mentorship, guidelines and disclaimer pages plus NITI Aayog context were checked on 8 September 2026. The record remains in_review and non_financial.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://wep.gov.in/access-finance/about-us', 'agency_portal', 'WEP access-to-finance current page', 'Current Government-scheme, financial-institution, State-scheme and knowledge-bank categories'),
      ('https://wep.gov.in/mentor-individual-landing', 'agency_portal', 'WEP individual mentorship current page', 'Mentee/mentor route, Smart Match fields, consent and no-sensitive-information boundary'),
      ('https://wep.gov.in/individual-mentorship-guidelines-and-code-of-conduct', 'guideline', 'WEP individual mentorship guidelines', 'Pro-bono mentor and conduct conditions'),
      ('https://wep.gov.in/ciiyi-disclaimer', 'disclaimer', 'WEP/CII-Yi current disclaimer', 'External-content and authority-verification disclaimer'),
      ('https://niti.gov.in/sites/default/files/2023-02/Annual-Report-2022-2023-English_06022023_compressed.pdf?trk=public_post_comment-text', 'ministry_portal', 'NITI Aayog Annual Report 2022-23 WEP description', 'WEP unified-access aggregator and knowledge hub')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
