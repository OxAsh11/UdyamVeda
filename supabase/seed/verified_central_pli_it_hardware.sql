-- Production Linked Incentive Scheme 2.0 for IT Hardware.
-- This is a scheme-parameter-based incentive, not a flat guaranteed subsidy.
-- The record stays in_review pending current source and amendment review.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY PLI 2.0 IT Hardware guidelines', 'https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MeitY guidelines for applicant definition, target segments, qualification, application and claims.'),
  ('MeitY PLI 2.0 IT Hardware notification', 'https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf', 'gazette', 'central', 'monthly', 1, true, 'Official notification for objective, target segment, incentive and scheme conditions.'),
  ('PLI Working Group IT Hardware portal', 'https://www.pliwg.dpiit.gov.in/', 'ministry', 'central', 'weekly', 1, true, 'Official PLI Working Group route for current notices and application status.'),
  ('PLI Working Group IT Hardware guidelines copy', 'https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official portal copy of the IT Hardware guidelines and application materials.')
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
        "slug":"production-linked-incentive-2-it-hardware",
        "name":"Production Linked Incentive Scheme 2.0 for IT Hardware",
        "type":"subsidy",
        "authority":"Ministry of Electronics and Information Technology - IPHW Division",
        "authority_url":"https://www.meity.gov.in/",
        "canonical_url":"https://www.pliwg.dpiit.gov.in/",
        "source_url":"https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf",
        "source_kind":"guideline",
        "source_title":"MeitY PLI 2.0 IT Hardware guidelines",
        "source_anchor":"Pages 1 onward: applicant definition, target segment, qualification criteria, application and claim requirements",
        "summary":"Production-linked financial incentive for eligible companies manufacturing laptops, tablets, all-in-one PCs, servers and ultra-small form-factor devices in India.",
        "objective":"Boost domestic IT hardware manufacturing and attract significant investment into the electronics value chain by compensating eligible manufacturing activity against specified disabilities.",
        "legal_basis":"Production Linked Incentive Scheme 2.0 for IT Hardware notified by MeitY on 29 May 2023, with operational guidelines dated 14 July 2023.",
        "eligibility":{"entity_types":["company_registered_in_india"],"lifecycle_stages":["operating","growth","scaling","manufacturing_expansion"],"industries":["it_hardware_manufacturing","electronics_manufacturing"],"target_segments":["laptops","tablets","all_in_one_pcs","servers","ultra_small_form_factor"],"locations":["India"],"conditions":["manufacturing must be carried out at one or more locations in India","the applicant must submit the prescribed application to MeitY or the Project Management Agency","qualification criteria, investment, sales, localization and claim requirements apply"],"exclusions":["the portal's approximate average percentage is not an applicant-specific entitlement","eligible production, net incremental sales, localization, base year, product scope and audit evidence must be established under the current parameters","application-window, migration, contract-manufacturing and subsequent-amendment conditions must be confirmed"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.pliwg.dpiit.gov.in/","route":"Follow the current PLI Working Group/MeitY application notice and submit the prescribed application with supporting documents and application fee to the designated Project Management Agency or MeitY route.","claiming":"Approved applicants claim production-linked incentive against eligible performance under the current scheme and guidelines.","applicant_note":"UdyamVeda can prepare the product, investment, sales, localization and audit checklist, but cannot calculate or promise an approved incentive."},
        "fine_print":{"support_period_years":6,"incentive_basis":"Eligible net incremental sales and localization of target-segment products under applicable scheme parameters","portal_summary_average_incentive_percent":5,"target_segments":["laptops","tablets","all_in_one_pcs","servers","ultra_small_form_factor"],"not_a_flat_subsidy":true,"review_note":"Confirm the current application window, company qualification thresholds, target-product and component definitions, committed investment, net incremental sales, localization, base year, application fee, claim period, annual caps, audit evidence, contract-manufacturing rules, migration options and every subsequent amendment before publication. The portal's approximately 5 percent summary is not an applicant-specific entitlement."},
        "benefit_summary":{"types":["subsidy"],"summary":"Production-linked incentive calculated under the notified scheme parameters; no flat percentage or guaranteed amount should be shown without applicant-specific qualification and current guidelines.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Production-linked incentive for eligible IT hardware manufacturing",
        "benefit_conditions":{"calculation":"scheme-parameter based","eligible_product_and_sales_evidence_required":true,"localization_evidence_required":true,"not_flat_percentage":true},
        "requirement":"Company, qualification and performance evidence",
        "requirement_description":"Provide company registration, manufacturing, product, investment, sales, localization, audit and prescribed application evidence under the current scheme parameters.",
        "rules":{"all":[{"field":"entity_type","operator":"equals","value":"company"},{"field":"country_of_registration","operator":"equals","value":"India"},{"field":"manufactures_in_india","operator":"equals","value":true},{"field":"it_hardware_target_segment","operator":"in","value":["laptops","tablets","all_in_one_pcs","servers","ultra_small_form_factor"]},{"field":"current_qualification_criteria_met","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm product and company scope","description":"Verify that the Indian company, manufacturing location and proposed products fit the current target-segment and qualification criteria.","url":"https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf"},{"title":"Prepare the prescribed application dossier","description":"Prepare company, manufacturing, product, investment, sales, localization, audit and contract-manufacturing evidence required by the latest guidelines.","url":"https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf"},{"title":"Apply through the current MeitY/PMA route","description":"Submit the application and fee through the current official route before relying on any qualification or incentive calculation.","url":"https://www.pliwg.dpiit.gov.in/"},{"title":"Maintain claim and audit evidence","description":"Track eligible production, sales, localization and statutory-auditor evidence for claims under the approved scheme parameters.","url":"https://www.meity.gov.in/static/uploads/2024/03/Guidelines_PLI-Scheme-ITHW-min.pdf"}],
        "window_type":"call_for_applications",
        "window_label":"Current application-window status and any extension or reopening must be verified from the official PLI Working Group/MeitY notice before recommendation.",
        "window_evidence":{"source_url":"https://www.pliwg.dpiit.gov.in/","anchor":"Current PLI IT Hardware 2.0 notices and application route"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Electronics and Information Technology', 'IPHW Division', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
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
    select version_id, 'https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf', 'gazette', 'MeitY PLI 2.0 IT Hardware notification', '29 May 2023 notification: objective, target segment, incentive and scheme conditions', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.meity.gov.in/writereaddata/files/Production%20Linked%20Scheme%202.0%20for%20IT%20Hardware%20notification_0.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.pliwg.dpiit.gov.in/', 'ministry', 'PLI Working Group IT Hardware official portal', 'PLI 2.0 for IT Hardware: target segments, approximate portal incentive summary and six-year support period', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.pliwg.dpiit.gov.in/');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf', 'guideline', 'PLI Working Group IT Hardware guidelines copy', 'Application materials, qualification criteria and contract-manufacturing documentation', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.pliwg.dpiit.gov.in/docs/guidelines/ITHW2.O/Guidelines_PLI-Scheme-IT-Hardware_14.07.2023.pdf');
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
