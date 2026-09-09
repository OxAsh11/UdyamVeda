-- Ministry of Tourism/NIDHI+ hospitality classification route.
-- This is a preparation and official-handoff record, not a subsidy or a
-- substitute for state/UT tourism, municipal, fire, food or other licences.

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
        "slug":"incredible-india-bed-breakfast-homestay-classification",
        "name":"Incredible India Bed & Breakfast / Homestay Classification",
        "type":"registration",
        "authority":"Ministry of Tourism - NIDHI+",
        "authority_url":"https://tourism.gov.in/",
        "canonical_url":"https://nidhi.tourism.gov.in/index.html",
        "source_url":"https://nidhi.tourism.gov.in/uploads/gallery/1659456723.pdf",
        "source_kind":"guideline",
        "source_title":"Common National Standards and Guidelines for Classification of Incredible India Bed & Breakfast and Homestay Establishments",
        "source_anchor":"Pages 3-6: purpose, applicability where the State/UT has no own scheme, one-to-six rooms/12 beds, inspection, two-year validity, classification fees, documents, appeal and official submission route",
        "summary":"A Ministry of Tourism classification and official listing route for eligible bed-and-breakfast and homestay establishments, subject to the applicable State or UT scheme and current NIDHI+ route.",
        "objective":"Help eligible hospitality operators prepare for the Ministry of Tourism classification process, understand the inspection and evidence requirements, and hand off to the official NIDHI+ portal without treating classification as a grant or as a replacement for local licences.",
        "legal_basis":"Ministry of Tourism Common National Standards and Guidelines for Classification of Incredible India Bed & Breakfast and Homestay Establishments, as published through the official NIDHI+ guidelines index; current State/UT rules and later Ministry notices prevail.",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","llp","private_limited_company","individual_owner","family_homestay_operator"],"lifecycle_stages":["idea","operating","growth"],"industries":["hospitality","tourism","homestay","bed_and_breakfast"],"locations":["India"],"conditions":["the establishment is in a State or Union Territory where the Ministry route is applicable and no conflicting State/UT classification scheme controls the route","a homestay owner/promoter and family physically reside in the establishment and let one to six rooms, up to 12 beds","a bed-and-breakfast establishment has an owner-appointed agent or operator residing at the premises and offers one to six lettable rooms, up to 12 beds","the establishment is ready for inspection and can satisfy the applicable facility, safety, hygiene and service checklist"],"thresholds":{"minimum_rooms":1,"maximum_rooms":6,"maximum_beds":12,"classification_validity_years":2,"silver_fee_inr":3000,"gold_fee_inr":5000,"complete_application_target_days":30},"exclusions":["classification does not replace municipal, fire, police, food, building, tax, labour, environmental or State/UT permissions","the Ministry guideline does not create a universal entitlement to approval","the NIDHI+ notice dated 16 March 2026 discontinued fresh voluntary project-approval applications at the construction or pre-construction stage; do not route users to that discontinued service","current State/UT rules may control or vary applicability, fees, documents and approvals"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://nidhi.tourism.gov.in/mynidhi/","route":"Confirm the applicable State/UT route, register or sign in through the current NIDHI+ unit route, prepare the Ministry checklist and declarations, pay the applicable classification fee through the official route, and retain the inspection and classification communication","fees":"The cited guideline lists Rs. 3,000 for Silver and Rs. 5,000 for Gold classification/re-classification; confirm the current fee and payment screen before submission","selection":"Regional Classification Committee inspection and recommendation followed by approval through the Ministry of Tourism regional authority; a complete application is stated to be finalised within 30 days, subject to inspection and no deficiencies"},
        "fine_print":{"benefit_scope":"Recognition/classification and official listing or publicity support; no grant, subsidy, loan or guaranteed occupancy is represented","current_portal_facts":{"portal":"NIDHI+ presents Register your unit and current accommodation/tourism-service-provider guideline routes","discontinued_route":"NIDHI+ states that fresh voluntary project-approval applications for hospitality units at construction/pre-construction stage are not entertained from 16 March 2026 and pending applications were treated as closed"},"inspection":"The establishment must remain ready for inspection; deficiencies must be corrected within the stipulated period, not exceeding three months in the cited guideline, or the application may be rejected","validity":"Classification is stated to be valid for two years, with timely reclassification application required for continuity","change_reporting":"Changes in facilities must be reported to the Regional Director within 30 days under the cited guideline; violation may lead to withdrawal or termination","documents":["application format","facility checklist","signed undertaking","ownership or lease evidence","revenue or co-sharer evidence where applicable","police clearance regarding owner and proposed activity","room and facility details","photographs","fire-fighting details and other current checklist evidence"],"review_note":"Confirm the current NIDHI+ registration flow, applicable State/UT scheme, exact live fee, current document upload requirements, regional authority, local permissions, classification validity and the current status of the legacy hotelclould.nic.in route before approval."},
        "benefit_summary":{"types":["recognition","market_access","non_financial_support"],"summary":"Potential Ministry of Tourism classification and official directory/listing support for an eligible hospitality unit; approval, listing, occupancy and commercial success are not guaranteed.","separate_value_buckets":true},
        "benefit_type":"recognition",
        "benefit_label":"Ministry of Tourism hospitality classification and listing readiness",
        "benefit_conditions":{"current_nidhi_route_required":true,"state_or_ut_applicability_required":true,"inspection_required":true,"classification_fee_applies":true,"local_licences_remain_separate":true,"no_cash_entitlement":true},
        "requirement":"Hospitality unit, checklist evidence and applicable State/UT route",
        "requirement_description":"Prepare the establishment identity, occupancy model, room and bed count, ownership or lease evidence, safety and facility checklist, photographs, undertaking, current State/UT permissions and any documents requested by the live NIDHI+ route.",
        "rules":{"all":[{"field":"hospitality_unit_type","operator":"in","value":["homestay","bed_and_breakfast"]},{"field":"room_count","operator":"greater_than_or_equal","value":1},{"field":"room_count","operator":"less_than_or_equal","value":6},{"field":"bed_count","operator":"less_than_or_equal","value":12},{"field":"applicable_state_or_ut_route_confirmed","operator":"equals","value":true},{"field":"inspection_readiness","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the applicable route","description":"Check NIDHI+, the current Ministry guidelines and the State or UT tourism authority before assuming the Central classification route applies.","url":"https://nidhi.tourism.gov.in/index.html"},{"title":"Classify the unit type and capacity","description":"Determine whether the unit is a homestay or bed-and-breakfast operation, confirm one to six rooms and no more than 12 beds, and record the owner/operator residence condition.","url":"https://nidhi.tourism.gov.in/uploads/gallery/1659456723.pdf"},{"title":"Prepare the checklist and evidence","description":"Assemble the application format, facility checklist, undertaking, ownership/lease, police and safety evidence, photographs, current local permissions and other live portal requirements.","url":"https://nidhi.tourism.gov.in/home/page/guidelines"},{"title":"Submit through the current official NIDHI+ route","description":"Use the live NIDHI+ unit-registration route, pay only the current official fee, remain available for inspection and retain all acknowledgements and communications.","url":"https://nidhi.tourism.gov.in/mynidhi/"},{"title":"Track classification and renewal","description":"Track inspection deficiencies, the classification decision, two-year validity and timely reclassification; separately track every State/UT and local licence.","url":"https://nidhi.tourism.gov.in/home/page/guidelines"}],
        "window_type":"rolling",
        "window_label":"NIDHI+ exposes a current unit-registration route; classification remains subject to current portal availability, State/UT applicability and inspection.",
        "window_evidence":{"source_url":"https://nidhi.tourism.gov.in/index.html","anchor":"Register your unit; current notice discontinuing fresh voluntary construction/pre-construction project approvals from 16 March 2026"},
        "review_note":"Confirm the current NIDHI+ form, State/UT applicability, live fee, regional authority, local licence dependencies and document upload rules before publication. This record is not a grant or a replacement for local permissions."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Tourism', 'Hospitality and Regional Classification', item->>'authority_url')
    returning id into authority_id;
    else
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
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
      select id into version_id from public.opportunity_versions where opportunity_id = seed_opportunity_id and version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://nidhi.tourism.gov.in/index.html', 'implementing_portal', 'NIDHI+ official portal', 'Register your unit; 16 March 2026 discontinuation notice for voluntary project approvals', now(), false)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://nidhi.tourism.gov.in/home/page/guidelines', 'agency_portal', 'NIDHI+ guidelines index', 'Accommodation and tourism service provider guideline index', now(), false)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://nidhi.tourism.gov.in/mynidhi/', 'implementing_portal', 'MyNIDHI official unit route', 'Current unit registration handoff', now(), false)
    on conflict do nothing;
    update public.opportunity_sources
      set page_number = 3, section = 'Purpose and applicability', paragraph = '1', document_anchor = 'Pages 3-6: applicability, one-to-six rooms/12 beds, inspection, validity, fees and documents'
      where opportunity_version_id = version_id and source_url = item->>'source_url';

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'registration', item->>'requirement', item->>'requirement_description', true)
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
