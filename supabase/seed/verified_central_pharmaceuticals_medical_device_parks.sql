-- Promotion of Medical Device Parks: State-led common infrastructure support,
-- not a manufacturer PLI or a direct individual-business grant.

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
        "slug":"promotion-of-medical-device-parks",
        "name":"Promotion of Medical Device Parks",
        "type":"cluster_infrastructure_grant",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharmaceuticals.gov.in/",
        "canonical_url":"https://pharmaceuticals.gov.in/",
        "source_url":"https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks_1.pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines of the Scheme Promotion of Medical Devices Parks",
        "source_anchor":"Pages 1-8, Sections 3-8: park definition, State proposer, scope, grant limits, selection and implementation",
        "summary":"A Central Sector scheme that provides one-time grant-in-aid for common testing, laboratory and enabling infrastructure in selected medical device parks proposed by State Governments.",
        "objective":"Create shared medical-device testing, laboratory, technology, logistics and training infrastructure so units in selected parks can reduce production cost and improve competitiveness.",
        "legal_basis":"Department of Pharmaceuticals guidelines for Promotion of Medical Devices Parks dated 27 July 2020, under the Department of Pharmaceuticals medical-device development framework.",
        "eligibility":{"entity_types":["state_government","state_government_corporation","state_implementing_agency","union_territory_administration","medical_device_park_spv"],"lifecycle_stages":["new_project","infrastructure_expansion","scaling"],"industries":["medical_devices","healthcare_equipment","diagnostic_devices","medical_device_testing","medtech_manufacturing"],"locations":["India"],"conditions":["the proposer is a State Government and establishes or designates the eligible State Implementing Agency","the park is a contiguous designated area intended exclusively for medical-device manufacturing","the proposal provides common infrastructure facilities and a project plan, cost and implementation route","the proposal is selected and approved through the Department and Scheme Steering Committee route","the project can satisfy utilization, monitoring, procurement, completion and reporting requirements"],"thresholds":{"scheme_period":"FY 2020-21 to FY 2024-25","financial_outlay_inr":40000000000,"parks_supported":4,"maximum_grant_inr_per_park":10000000000,"standard_assistance_percent_project_cost":70,"north_east_and_hilly_states_assistance_percent_project_cost":90,"application_window_closed":"2020-10-15"},"unknown_handling":"needs_information"},
        "exclusions":["ordinary private company applications without a State proposer/SIA or selected park route","direct manufacturer PLI or unrestricted cash support for individual units","facilities outside eligible common infrastructure for the selected park","projects or calls outside the FY 2020-21 to FY 2024-25 scheme duration unless an official extension is confirmed","the maximum grant is not an entitlement and cannot be added to an individual unit's eligible benefit value","historic application closure must not be represented as a current open application"],
        "application":{"portal":"https://pharmaceuticals.gov.in/","route":"State Government or eligible State Implementing Agency prepares the park proposal, common-infrastructure plan, project cost and implementation documents and follows the Department/Scheme Steering Committee route","applicant_note":"UdyamVeda can help a medical-device unit identify selected parks and prepare a park-access/readiness checklist, but cannot apply for a State grant or represent a private unit as the scheme proposer","selection":"Technical appraisal and Scheme Steering Committee selection of State proposals, followed by grant release, monitoring and utilization verification","fees":"Confirm current State, project, regulatory, certification and park-access charges from the selected park route"},
        "fine_print":{"benefit_model":"One-time grant-in-aid supports common infrastructure in a selected park; individual units benefit indirectly through access to shared facilities and do not receive the park grant as a personal subsidy.","grant_limit":"The official guidelines and reports state assistance of 70% of common-infrastructure project cost, or 90% for North Eastern and specified hilly States, subject to a maximum of INR 100 crore per park.","scope":"Indicative facilities include component and biocompatibility testing, moulding/tooling, 3D design/printing, sterilization, radiation testing, waste management, common warehouse/logistics, emergency response and technology/training centres.","implementation":"A State Implementing Agency implements the selected project; the Scheme Steering Committee approves proposals and a Project Management Agency supports implementation.","status":"Official reporting records four selected States and a scheme period ending FY 2024-25; current completion, extension, park-operation and unit-access status must be checked before an actionable recommendation.","review_note":"Confirm current completion and operation status of each selected park, any extension or successor scheme, live park-access route, common-facility availability, State/SIA contact, unit eligibility, user charges, utilization and official grievance route before publication."},
        "benefit_summary":{"types":["grant_in_aid","common_infrastructure","cluster_support"],"summary":"Indirect access to shared medical-device park infrastructure; the Central grant is State/SIA-facing and is capped separately from any benefit available to a unit using the park.","separate_value_buckets":true},
        "benefit_type":"cluster_infrastructure_grant",
        "benefit_label":"Common infrastructure support for selected medical device parks",
        "benefit_conditions":{"state_proposer_required":true,"selected_park_required":true,"common_infrastructure_only":true,"one_time_grant":true,"individual_unit_not_direct_recipient":true,"park_cap_applies":true},
        "requirement":"Selected medical-device park and State/SIA access route",
        "requirement_description":"A business seeking practical benefit must identify a selected park, confirm its unit/tenant eligibility, understand common-facility availability and charges, and prepare regulatory, manufacturing, testing and access documents required by the State/SIA or park operator.",
        "rules":{"all":[{"field":"medical_device_business_or_project_identified","operator":"equals","value":true},{"field":"selected_medical_device_park_identified","operator":"equals","value":true},{"field":"current_park_access_route_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the selected park and State route","description":"Confirm whether the business is seeking State/SIA scheme participation or access to a selected park's common facilities; the historic Central application window is closed.","url":"https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf"},{"title":"Review common facilities","description":"Map required testing, laboratory, tooling, sterilization, prototyping, waste, logistics or training facilities to what the selected park actually operates.","url":"https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks_1.pdf"},{"title":"Confirm unit eligibility and charges","description":"Obtain the current State/SIA or park-operator route, tenancy/access criteria, user charges, regulatory requirements and availability evidence.","url":"https://pharmaceuticals.gov.in/"},{"title":"Prepare park-access documents","description":"Assemble company, product, regulatory, manufacturing, testing and project documents required by the live park route.","url":"https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks_1.pdf"}],
        "window_type":"closed",
        "window_label":"The official framework ran from FY 2020-21 to FY 2024-25 and the initial application window closed on 15 October 2020. Selected-park operation and any successor or extension route require current official confirmation.",
        "window_evidence":{"source_url":"https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf","anchor":"Annual Report 2023-24: total outlay INR 400 crore, duration FY 2020-21 to FY 2024-25, four selected States and grant limits"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Chemicals and Fertilizers', 'Department of Pharmaceuticals', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.89, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf', 'annual_report', 'Department of Pharmaceuticals Annual Report 2023-24', 'Medical Device Parks scheme period, selected States and grant limits', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/english%20Annual%20Report%202020-21.pdf', 'annual_report', 'Department of Pharmaceuticals Annual Report 2020-21', 'Application-window closure and initial scheme status', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'Department of Pharmaceuticals official portal', 'Current scheme status and successor route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'cluster_infrastructure', item->>'requirement', item->>'requirement_description', true)
    on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false)
    on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    on conflict do nothing;
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    values (version_id, item->>'window_type', item->>'window_label', item->'window_evidence')
    on conflict do nothing;
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    values (version_id, 'publish', 'open')
    on conflict do nothing;
  end loop;
end $$;
