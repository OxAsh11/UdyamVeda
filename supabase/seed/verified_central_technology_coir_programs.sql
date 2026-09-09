-- Central technology-support and coir-sector records from official Ministry,
-- dashboard and Coir Board sources. These remain in_review until current
-- service catalogues, schedules and applicant terms are confirmed.

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
        "slug":"msme-tool-rooms-and-technology-centres",
        "name":"MSME Tool Rooms and Technology Centres",
        "type":"technology_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Tool Rooms and Technology Centres",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://dashboard.msme.gov.in/tool_rooms.aspx",
        "source_url":"https://www.msme.gov.in/sites/default/files/MSMESchemebooklet2024.pdf",
        "source_kind":"ministry",
        "source_title":"MSME Scheme Booklet - Tool Rooms and Technical Institutions",
        "source_anchor":"Tool Rooms and Technical Institutions - A Component of Infrastructure Development & Capacity Building",
        "summary":"Technology, tooling, product-development, consultancy and training support delivered through the Ministry of MSME Tool Rooms and Technology Centres.",
        "objective":"Improve MSME access to tooling facilities, industry-ready skills, product and process development, consultancy and job work.",
        "legal_basis":"Tool Rooms and Technical Institutions component under MSME infrastructure development and capacity building",
        "eligibility":{"entity_types":["micro","small","medium","industrial_unit","training_participant"],"conditions":["service, course and centre-specific eligibility applies","industrial units and training applicants use different routes","current centre catalogue, fees, schedule and capacity must be checked"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dashboard.msme.gov.in/tool_rooms.aspx","route":"select the relevant Tool Room or Technology Centre and use its current training, consultancy, job-work or unit-assistance route"},
        "fine_print":{"current_centre_count":18,"support_modes":["tooling facilities","training programmes","product and process development","consultancy","job work","unit assistance"],"sector_examples":["general engineering","foundry and forging","electronics","fragrance and flavour","glass","sporting goods","footwear"],"review_note":"Confirm the current centre list, course eligibility, service fees, application forms, capacity and any revised TCSP scheme terms before publication."},
        "benefit_summary":{"types":["technology_support","training","consultancy"],"summary":"Access to official Tool Room and Technology Centre services, training and technical assistance; this is not a universal grant or subsidy."},
        "benefit_type":"technology_support",
        "benefit_label":"Tooling, technology, consultancy and technical training support",
        "benefit_conditions":{"centre_and_service_route_required":true,"current_catalogue_required":true},
        "requirement":"Relevant technical need and centre-specific eligibility",
        "requirement_description":"The enterprise or participant must match the selected centre service or training route and provide the technical, identity and payment documents requested by that centre.",
        "rules":{"all":[{"field":"technology_or_training_need","operator":"equals","value":true},{"field":"eligible_centre_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the appropriate centre","description":"Match the product, tooling, skill or consultancy need to a current MSME Tool Room or Technology Centre.","url":"https://dashboard.msme.gov.in/tool_rooms.aspx"},{"title":"Check the current service or course terms","description":"Confirm eligibility, schedule, fees, capacity, documents and delivery mode with the selected centre.","url":"https://www.msme.gov.in/sites/default/files/MSMESchemebooklet2024.pdf"},{"title":"Apply or request technical support","description":"Use the centre’s official route and retain quotation, enrolment, work-order and completion records.","url":"https://dashboard.msme.gov.in/tool_rooms.aspx"}],
        "window_type":"rolling",
        "window_label":"Centre services and training open according to centre calendars and capacity; no universal applicant deadline is asserted.",
        "window_evidence":{"source_url":"https://dashboard.msme.gov.in/tool_rooms.aspx","anchor":"MSME Tool Rooms / Technology Centres"}
      },
      {
        "slug":"coir-vikas-yojana",
        "name":"Coir Vikas Yojana (CVY)",
        "type":"sector_support",
        "authority":"Coir Board - Ministry of Micro, Small and Medium Enterprises",
        "authority_url":"https://coirboard.gov.in/",
        "canonical_url":"https://coirboard.gov.in/",
        "source_url":"https://msme.gov.in/sites/default/files/Coir-Vikas-YojanaContents.pdf",
        "source_kind":"guideline",
        "source_title":"Operational Guidelines of Coir Vikas Yojana",
        "source_anchor":"Introduction; objectives; scheme components and eligible coir-sector support",
        "summary":"Coir-sector development support covering skill development, entrepreneurship, production infrastructure, domestic and export market promotion, and trade-related services.",
        "objective":"Develop the coir industry through skill and entrepreneurship support, better raw-material use, production infrastructure, market access and welfare-oriented interventions.",
        "legal_basis":"Coir Vikas Yojana implemented by the Coir Board under the Ministry of MSME",
        "eligibility":{"entity_types":["coir_manufacturer","coir_entrepreneur","coir_exporter","coir_worker","coir_society","coir_institution"],"industries":["coir"],"conditions":["component-specific eligibility and Coir Board route apply","enterprise, worker and institution categories may have different documentation","current calls and state/centre implementation must be checked"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://coirboard.gov.in/","route":"select the applicable Coir Board component and follow the current application or implementing-office route"},
        "fine_print":{"support_components":["development of production infrastructure","skill upgradation and training","women-focused coir skill support","domestic market promotion","export market promotion","trade and industry related functional support services","raw-material utilisation and entrepreneurship support"],"sector_scope":"Benefits are component-specific and limited to eligible coir-sector activities; no generic MSME grant is inferred.","review_note":"Confirm current component guidelines, assistance ceilings, beneficiary definitions, application forms, implementing offices and live windows before publication."},
        "benefit_summary":{"types":["sector_support","training","market_access","infrastructure_support"],"summary":"Component-specific Coir Board support for coir entrepreneurs, manufacturers, exporters, workers and institutions."},
        "benefit_type":"sector_support",
        "benefit_label":"Coir-sector training, infrastructure and market-development support",
        "benefit_conditions":{"coir_sector_required":true,"component_specific_route_required":true},
        "requirement":"Eligible coir activity and component-specific documents",
        "requirement_description":"The applicant must operate in an eligible coir activity or represent an eligible coir institution and meet the selected component’s current conditions.",
        "rules":{"all":[{"field":"industry","operator":"equals","value":"coir"},{"field":"coir_component_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the coir activity","description":"Identify whether the need concerns training, production infrastructure, domestic market, export or another current CVY component.","url":"https://msme.gov.in/sites/default/files/Coir-Vikas-YojanaContents.pdf"},{"title":"Confirm current Coir Board eligibility","description":"Check the active component guideline, beneficiary definition, documents, implementing office and application window.","url":"https://coirboard.gov.in/"},{"title":"Apply through the official route","description":"Submit through the Coir Board or designated implementing-office route and retain sanction, utilisation and completion evidence.","url":"https://coirboard.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Component availability and application windows are controlled by current Coir Board programmes and calls; no universal deadline is asserted.",
        "window_evidence":{"source_url":"https://msme.gov.in/sites/default/files/Coir-Vikas-YojanaContents.pdf","anchor":"Scheme components and implementation"}
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
