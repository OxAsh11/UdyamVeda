-- Central MSME Technology Centre service-access record from official
-- Development Commissioner (MSME) sources. This remains in_review because
-- centre-specific services, pricing, concessions and capacity vary by route.

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
        "slug":"msme-technology-centres-tool-rooms-extension-centres",
        "name":"MSME Technology Centres, Tool Rooms and Extension Centres",
        "type":"technology_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Development Commissioner",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx",
        "source_url":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx",
        "source_kind":"agency_portal",
        "source_title":"Technology Centres (Earlier Known as Tool Rooms & Technology Development Centres)",
        "source_anchor":"Technology Centres; technological and skilled manpower support; technical services, training and business advisory support",
        "summary":"A nationwide MSME Technology Centre network providing technical services, tool and product development, testing or process support, incubation, skilling and business advisory access through Technology Centres and Extension Centres.",
        "objective":"Improve MSME competitiveness and local capability by connecting businesses and skill seekers to Technology Centre expertise, equipment, training, incubation and advisory services.",
        "legal_basis":"Technology Centres and related Extension Centre programmes administered by the Office of the Development Commissioner (MSME), Ministry of MSME.",
        "eligibility":{"entity_types":["micro","small","medium","startup","skill_seeker","entrepreneur"],"lifecycle_stages":["pre_start","start","operate","growth","expansion"],"industries":["manufacturing","engineering","electronics","automotive","foundry_forging","fragrance_flavour","glass","sports_goods","footwear","electrical_instruments","general_engineering"],"locations":["India"],"conditions":["the requested service must be offered by a relevant Technology Centre or Extension Centre","the business or participant must satisfy the selected centre's service, training, sector, location and documentation requirements","centre capacity, fees, concessions and local programme schedule must be confirmed directly","institutional establishment and expansion targets do not create an automatic business grant or service entitlement"],"unknown_handling":"needs_information"},
        "exclusions":["the TCSP or new-TC institutional establishment outlay treated as a direct enterprise grant","dashboard trainee or unit-assisted counts treated as a guarantee of access or outcome","one centre's services, prices or concessions copied to another centre without verification","training, testing, incubation or advisory support represented as free unless the selected centre confirms it","a business advised to apply through UdyamVeda instead of the official Technology Centre route"],
        "application":{"portal":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx","route":"Identify the relevant Technology Centre or Extension Centre, review its current service/training route, contact or register through that centre, and submit the requested business or participant documents","selection":"Centre-specific service acceptance, capacity, technical fit, course or incubation criteria and applicable fee/concession terms control access","fees":"Most Technology Centre services are chargeable; any concession or subsidised route must be confirmed from the selected centre or applicable scheme","current_operational_sources":{"technology_centres_directory":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx","tcsp_programme":"https://dcmsme.gov.in/CLCS_TUS_Scheme/TCSP/Scheme_Guidelines.aspx","new_tc_ec_programme":"https://dcmsme.gov.in/CLCS_TUS_Scheme/new-Technology-Centers/Scheme_Guidelines.aspx","current_status_dashboard":"https://dashboard.msme.gov.in/100_TC_EC.aspx"},"applicant_note":"UdyamVeda can help identify a relevant official centre and prepare a service-readiness checklist but cannot promise capacity, waive fees, submit credentials or represent a Technology Centre."},
        "fine_print":{"service_modes":["tool and die design/manufacturing","technical and product/process development","testing, calibration or sector-specific technical support","incubation and business advisory","skilling and training"],"network_context":{"existing_technology_centres":18,"new_technology_centres_target":20,"new_extension_centres_target":100,"additional_skilling_capacity_target":400000,"additional_msmse_assistance_target":100000},"institutional_boundary":"The official TCSP and new-TC/EC pages describe government establishment and expansion programmes. Their budgets, locations and targets are institutional programme facts, not a direct cash ceiling for a business.","current_dashboard_boundary":"The official status dashboard updated 31 July 2026 reports approved and operational Extension Centre activity. Its trainee and unit-assisted counts are monitoring context, not proof of eligibility, free service or business outcome.","access_boundary":"Service availability, chargeability, concessions, equipment, course calendar, incubation intake and local documents vary by centre and must be checked at the official centre route.","review_note":"Confirm the selected centre, service category, current capacity, fee/concession, participant criteria, data/document requirements, turnaround, deliverables, grievance route and any current programme notice before publication."},
        "benefit_summary":{"types":["technology_support","training","incubation","business_advisory"],"summary":"Access to official MSME Technology Centre expertise, equipment, technical services, incubation, training and advisory support; this is not a universal grant or free-service entitlement.","separate_value_buckets":true},
        "benefit_type":"technology_support",
        "benefit_label":"Technology Centre technical, training and incubation access",
        "benefit_conditions":{"centre_specific_route_required":true,"capacity_and_fee_confirmation_required":true,"service_or_training_criteria_apply":true,"direct_cash_grant_not_assumed":true},
        "requirement":"Business or participant fit for a selected Technology Centre service",
        "requirement_description":"Select a relevant official Technology Centre or Extension Centre and provide the service-specific business, technical, identity, training or project information requested by that centre.",
        "rules":{"all":[{"field":"selected_official_technology_centre","operator":"equals","value":true},{"field":"requested_centre_service_available","operator":"equals","value":true},{"field":"centre_specific_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the relevant centre and service","description":"Use the official Technology Centre directory and sector information to shortlist a centre that can provide the required technical, training, incubation or advisory support.","url":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx"},{"title":"Check current capacity and terms","description":"Confirm the selected centre's service availability, fee, concession, eligibility, documents, schedule and expected deliverables directly from the official centre route.","url":"https://dashboard.msme.gov.in/100_TC_EC.aspx"},{"title":"Apply or register through the centre","description":"Use the centre's official service, training or incubation route and retain acknowledgement, payment/concession, project and completion records.","url":"https://dcmsme.gov.in/CLCS_TUS_Scheme/TCSP/Scheme_Guidelines.aspx"}],
        "window_type":"rolling",
        "window_label":"Technology and advisory services are accessed according to centre capacity and centre-specific schedules; training and incubation may have separate published intakes. No universal business deadline is asserted.",
        "window_evidence":{"source_url":"https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx","anchor":"Technology Centres; technical services, training and business advisory support"},
        "review_note":"Current centre directory, service availability, fee/concession terms, intake windows and centre-level application evidence require human review. Do not publish institutional expansion targets as applicant benefits."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
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
