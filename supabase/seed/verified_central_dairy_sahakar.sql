-- Dairy Sahakar: NCDC cooperative dairy-business finance framework.
-- This is credit linkage and project assistance subject to assessment, not a
-- guaranteed dairy grant or direct entitlement.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NCDC Dairy Sahakar brochure', 'https://www.ncdc.in/documents/downloads/5615200923Dairy-Sahakar-English.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC Dairy Sahakar brochure covering dairy value-chain activities, supporting services, cooperative eligibility and credit-linkage structure.'),
  ('NCDC Dairy Sahakar pattern of assistance', 'https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC assistance document with Dairy Sahakar loan period, funding, margin-money and working-capital terms.'),
  ('NCDC Dairy Sahakar compendium', 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NCDC compendium recording Dairy Sahakar objectives, activity scope and financing patterns.'),
  ('NCDC dairy and livestock portal', 'https://www.ncdc.in/index.jsp?page=dairy', 'agency_portal', 'central', 'weekly', 1, true, 'Official NCDC dairy and livestock route with current application and financing navigation.')
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
        "slug":"dairy-sahakar-cooperative-dairy-business-support",
        "name":"Dairy Sahakar - Cooperative Dairy Business and Infrastructure Support",
        "type":"credit_subsidy",
        "authority":"National Cooperative Development Corporation - Dairy Sahakar",
        "authority_url":"https://www.ncdc.in/",
        "canonical_url":"https://www.ncdc.in/documents/downloads/5615200923Dairy-Sahakar-English.pdf",
        "source_url":"https://www.ncdc.in/documents/downloads/5615200923Dairy-Sahakar-English.pdf",
        "source_kind":"guideline",
        "source_title":"Dairy Sahakar - NCDC",
        "source_anchor":"Objectives, activities covered, eligibility, loan period and credit-linkage assistance",
        "summary":"An NCDC financial-assistance framework for eligible cooperatives creating, modernizing or expanding dairy value-chain infrastructure and supporting services.",
        "objective":"Strengthen cooperative dairy businesses, improve procurement, processing, quality, value addition, branding, market access, exports and farmer income while supporting ESG-linked development.",
        "legal_basis":"Dairy Sahakar framework of the National Cooperative Development Corporation.",
        "eligibility":{"entity_types":["cooperative_society","dairy_cooperative","state_cooperative_society","multi_state_cooperative_society"],"lifecycle_stages":["operating","growth","scaling","infrastructure_expansion"],"industries":["dairy","milk_procurement","milk_processing","cold_chain","food_processing","animal_feed","veterinary_services","dairy_equipment","packaging","agri_logistics","renewable_energy","research_and_development"],"locations":["India"],"conditions":["the applicant is registered under a State or Multi-State Cooperative Societies Act with suitable bye-law provisions","the project fits dairy production, procurement, processing, quality, value addition, branding, packaging, marketing, transport, storage, export or an eligible supporting activity","the project satisfies current NCDC project assessment, contribution, statutory, security and financing-route requirements"],"exclusions":["a private dairy company, LLP or individual cannot use this cooperative-only record without an eligible cooperative applicant","credit linkage does not guarantee sanction, grant, subsidy, sales or export approval","food safety, animal husbandry, veterinary, environmental, factory, building, labour and local permissions remain separate requirements","subsidy or interest subvention from another scheme retains its own eligibility and approval conditions","project cost, loan rates, funding pattern, security and current NCDC terms may change"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.ncdc.in/index.jsp?page=dairy","route":"Prepare a viable dairy or supporting-service project and apply through the current NCDC direct-funding or State Government/UT route with the required cooperative, technical and financial documents.","applicant_note":"UdyamVeda can prepare the cooperative, project, permits, cold-chain, processing, contribution, security and convergence checklist, but cannot obtain NCDC sanction or act as a regulator or certifier.","fees":"Confirm current NCDC processing, appraisal, documentation, interest-rate and security terms before proceeding."},
        "fine_print":{"activity_groups":["bovine_development","milk_procurement","milk_processing","quality_assurance","value_addition","branding_and_packaging","marketing_transport_and_storage","dairy_exports","renewable_energy_and_ict","cattle_feed_and_feed_supplements","dairy_research_and_development","dairy_equipment_and_machinery","veterinary_drugs_and_healthcare","veterinary_and_dairy_education","capacity_building"],"loan_period_years":{"minimum":5,"maximum":8},"principal_moratorium_years":{"minimum":1,"maximum":3},"funding_pattern":{"direct_infrastructure_loan_max_percent":70,"direct_society_share_min_percent":30,"state_route_financial_assistance_max_percent":90,"state_route_society_share_min_percent":10,"margin_money":"loan up to 100% for availing bank credit subject to NCDC assessment","working_capital":"as per requirement subject to NCDC assessment"},"project_cost":"The official compendium states no minimum or maximum limit on financial assistance to eligible cooperative projects; sanction remains subject to viability, assessment and current NCDC terms.","subsidy_convergence":"Dairy Sahakar credit may be dovetailed with Government, State or other funding-agency subsidy or interest subvention; the separate programme's rules and sanction continue to apply.","no_fixed_project_entitlement":true,"no_guaranteed_sanction":true,"review_note":"Confirm the latest NCDC circular and application form, cooperative bye-laws, eligible activity, dairy/food-safety and other permissions, project cost, direct versus State route, contribution, security, loan/moratorium, margin money, working capital, convergence, repayment, monitoring and grievance terms before publication."},
        "benefit_summary":{"types":["loan","business_support","market_access"],"summary":"Potential NCDC credit linkage for dairy infrastructure, margin money and working capital, plus business-support and capacity-building pathways; project viability, assessment and sanction are required and no grant entitlement is implied.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Dairy Sahakar cooperative dairy project finance",
        "benefit_conditions":{"dairy_cooperative_required":true,"suitable_bye_laws_required":true,"eligible_dairy_or_supporting_project_required":true,"ncdc_assessment_required":true,"statutory_permissions_required":true,"no_guaranteed_sanction":true},
        "requirement":"Dairy cooperative and viable value-chain project",
        "requirement_description":"Provide cooperative registration and bye-laws, dairy value-chain or supporting-service project report, technical and statutory evidence, financials, contribution, security, operating model and any separate subsidy or convergence approvals.",
        "rules":{"all":[{"field":"eligible_dairy_cooperative","operator":"equals","value":true},{"field":"dairy_or_supporting_activity","operator":"equals","value":true},{"field":"suitable_cooperative_bye_laws","operator":"equals","value":true},{"field":"required_dairy_statutory_permissions_ready","operator":"equals","value":true},{"field":"viable_business_plan","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm cooperative eligibility","description":"Verify registration under the applicable State or Multi-State Act and suitable bye-law provisions for dairy or supporting activities.","url":"https://www.ncdc.in/documents/downloads/5615200923Dairy-Sahakar-English.pdf"},{"title":"Map the dairy value-chain activity","description":"Classify procurement, processing, quality, value addition, packaging, cold-chain, transport, exports, feed, veterinary, equipment, ICT or another supported activity.","url":"https://www.ncdc.in/index.jsp?page=dairy"},{"title":"Secure technical and statutory evidence","description":"Identify food-safety, animal-husbandry, veterinary, environmental, factory, building, labour and local permissions applicable to the project.","url":"https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf"},{"title":"Calculate funding and assessment inputs","description":"Separate project cost, direct or State route, society contribution, security, loan period, moratorium, margin money, working capital and any separate convergence benefit.","url":"https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf"},{"title":"Use the official NCDC route","description":"Apply through the current NCDC or State Government/UT channel and retain sanction, disbursement, permit, repayment, monitoring and grievance records.","url":"https://www.ncdc.in/index.jsp?page=dairy"}],
        "window_type":"rolling",
        "window_label":"Dairy Sahakar is a framework-based NCDC financing route; current application forms, rates, assessment and channel availability must be confirmed before action.",
        "window_evidence":{"source_url":"https://www.ncdc.in/index.jsp?page=dairy","anchor":"Current NCDC dairy and livestock financing/application navigation; framework availability does not itself establish sanction or an open call"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Cooperation', 'National Cooperative Development Corporation', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.84, 'in_review')
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
    select version_id, 'https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf', 'guideline', 'NCDC pattern of assistance', 'Dairy Sahakar loan period, interest, funding, margin-money and working-capital terms', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncdc.in/documents/faq/2010210223Pattern-of-Assistance-2021-22.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf', 'guideline', 'NCDC scheme compendium', 'Dairy Sahakar objective, activity scope and funding pattern', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncdc.in/documents/booklet/2609240524English-Compendium-as-on-22.05.2024.pdf');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.ncdc.in/index.jsp?page=dairy', 'agency', 'NCDC dairy and livestock portal', 'Current dairy financing and common loan application navigation', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.ncdc.in/index.jsp?page=dairy');
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
