-- PM-eBus Sewa. Review-gated because business participation is tender/concession
-- dependent and the central assistance is routed through institutional city/state
-- and procurement arrangements.

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
        "slug":"mohua-pm-ebus-sewa-ppp-urban-transport-access",
        "name":"PM-eBus Sewa: PPP Urban Electric Bus and Mobility Procurement Access",
        "type":"market_access",
        "status":"active",
        "authority":"Ministry of Housing and Urban Affairs (MoHUA)",
        "authority_url":"https://mohua.gov.in/",
        "canonical_url":"https://pm-ebus-sewa.mohua.gov.in/",
        "source_url":"https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/PM-eBus-Sewa-Guidelines-Part-I-1.pdf",
        "source_kind":"guideline",
        "source_title":"PM-eBus Sewa Guidelines Part I",
        "source_anchor":"Pages 1-10 and Annexures 2-4: 10,000-bus PPP support, eligible-city challenge method, proposal route, CESL tendering, 12-year GCC wet lease, depot and power infrastructure",
        "summary":"Institutional electric-bus and green-urban-mobility route that can create tender and concession opportunities for eligible city authorities, bus OEMs, operators, ticketing providers and related technology suppliers.",
        "objective":"Augment organised city bus operations through electric buses on a PPP model, associated depot and behind-the-meter power infrastructure, and complementary green urban mobility initiatives.",
        "legal_basis":"Union Cabinet-approved PM-eBus Sewa scheme and MoHUA PM-eBus Sewa Guidelines Part I, including the challenge-method, proposal, tendering and implementation provisions; the live portal, addenda and tender documents control current terms.",
        "eligibility":{"entity_types":["eligible_city","urban_local_body","state_transport_undertaking","public_transport_authority","bus_oem","bus_operator","oem_operator_consortium","ticketing_service_provider","urban_mobility_technology_provider"],"lifecycle_stages":["new_business","scaling","operating","procurement_ready"],"industries":["electric_mobility","public_transport","bus_manufacturing","fleet_operations","charging_infrastructure","ticketing","itms","urban_mobility"],"locations":["India","listed_eligible_city","selected_city"],"conditions":["the city must be in the official eligible-city list and be selected through the challenge method","eligible city proposals are submitted to the State Level Steering Committee for approval and onward submission to the Centre","approved demand is aggregated and tendered through CESL; business participation depends on a live lot, concession, tender or subcontract route","the selected bidder or service provider must meet the live technical, financial, safety, statutory, localisation and contract conditions","the city/state must provide the institutional, depot, land, power, payment-security and data arrangements required by the guidelines","bus operations use a gross-cost-contract wet-lease model and the service provider is paid through the competitively discovered per-kilometre contract route"],"thresholds":{"target_ebuses":10000,"central_support_total_inr":200000000000,"estimated_scheme_cost_inr":576130000000,"contract_duration_years":12,"eligible_city_count_in_guideline":169,"behind_the_meter_central_assistance_percent":100,"depot_central_assistance_percent_by_city_category":{"cities_3_to_40_lakh":60,"hilly_ner_state_capitals_and_ut_capitals_with_legislature":90,"other_ut_capitals_without_legislature":100}},"unknown_handling":"needs_information"},
        "exclusions":["not a direct universal grant, loan or subsidy application for ordinary founders","central assistance is not an automatic payment to every OEM, operator or technology company; the live tender and concession structure control payment","the scheme does not guarantee selection, route allocation, purchase orders, minimum kilometres, revenue or profitability","land, taxes, resettlement and rehabilitation, and bus chargers are excluded from the stated behind-the-meter central-assistance scope under the guidelines","selected-city, depot, power, payment-security, data, uptime, reporting, local-manufacturing and public-transport conditions remain material","a business must not treat portal progress figures or a past tender/LoA as a current open application without current tender evidence"],
        "application":{"portal":"https://pm-ebus-sewa.mohua.gov.in/","route":"Identify a live CESL, PTA, city, State Transport Undertaking or related procurement/concession route; verify the bidder role; prepare technical, financial, fleet, operations, depot, charging, safety, localisation and data evidence; submit through the official tender or contract route.","selection":"Eligible cities are selected through a challenge method; approved demand is aggregated for CESL tendering, after which the procuring authority evaluates bids and issues the applicable Letter of Authorization or contract.","fees":"No generic applicant fee is asserted. Tender fees, bid security, performance security, digital-signature, vehicle, depot, charger, financing and contract-specific costs must be verified from the live tender.","applicant_note":"UdyamVeda can explain the institutional route, readiness checklist and tender evidence, but must not represent a private business as the city applicant or submit a bid without explicit authorization."},
        "fine_print":{"support":"The scheme supports 10,000 electric buses on PPP, city bus operations, depot infrastructure and behind-the-meter power infrastructure; the business-facing value is access to live procurement, concession, OEM, operator, ticketing and related technology routes.","contract_model":"The guidelines define gross-cost-contract wet lease: the service provider owns, operates and maintains the bus for a specific per-kilometre rate and contract period, while the authority pays the competitively discovered rate.","route_dependencies":"State/ULB proposal, challenge selection, demand aggregation, CESL lot, concession agreement, city land/depot, DISCOM power, payment-security and city/state approvals are dependencies rather than founder-profile facts.","data_and_reporting":"Bus-operation data is jointly owned by Centre and State agencies, operator use requires written consent, and periodic third-party audits and utilisation reporting apply.","current_progress_boundary":"A PIB update dated 10 March 2026 reported 6,228 buses tendered and Letters of Award for 4,720 buses as of 28 February 2026; these are historical progress indicators, not proof of a currently open tender.","review_note":"Before publication, verify the current portal status, addenda, city list, CESL/PTA tender documents, bidder eligibility, lot deadlines, contract economics, payment-security mechanism, depot/power scope, charger responsibility, data terms, localisation requirements and superseding amendments."},
        "benefit_summary":{"types":["market_access","subsidy"],"summary":"Institutional PPP and procurement access for electric-bus, operations, depot/power, ticketing and urban-mobility suppliers; central assistance supports the approved city/state implementation structure, not a universal founder entitlement.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"PPP, concession and tender access for electric urban mobility",
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"target_ebuses":10000,"central_support_total_inr":200000000000,"contract_duration_years":12,"wet_lease_gcc_model":true,"depot_assistance_is_city_category_dependent":true,"behind_the_meter_assistance_percent":100,"business_payment_is_tender_and_contract_dependent":true,"contract_not_guaranteed":true},
        "requirement":"Eligible city/tender route and bidder readiness",
        "requirement_description":"Verify the listed and selected city route, live tender or concession, bidder role, technical and financial capacity, fleet/OEM or service capability, safety and statutory approvals, localisation, depot/charging and data obligations, bid securities and contract evidence.",
        "rules":{"all":[{"field":"current_eligible_city_or_tender_route_verified","operator":"equals","value":true},{"field":"business_role_matches_live_tender","operator":"equals","value":true},{"field":"technical_and_financial_qualification_verified","operator":"equals","value":true},{"field":"depot_power_and_operations_evidence_verified","operator":"equals","value":true},{"field":"current_submission_deadline_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the city and institutional route","description":"Check the official eligible-city list, selected-city status, State/ULB/PTA route and whether the business is a bidder, OEM, operator, consortium member, ticketing provider or subcontractor.","url":"https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/PM-eBus-Sewa-Guidelines-Part-I-1.pdf"},{"title":"Find the live tender or concession","description":"Use the official PM-eBus Sewa, CESL, PTA, city or State procurement route and retain the current tender, addendum, deadline and lot evidence.","url":"https://pm-ebus-sewa.mohua.gov.in/"},{"title":"Prepare bidder and implementation evidence","description":"Collect entity, technical, financial, fleet, operations, depot, power, safety, localisation, data, payment-security and contract-readiness documents required by the live bid.","url":"https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/Addendum_PM-eBus-Sewa-Guidelines.pdf"},{"title":"Submit and track the official route","description":"Submit only through the designated tender or contract portal, preserve acknowledgement and clarifications, and track evaluation, LoA, concession, mobilisation and reporting milestones.","url":"https://pm-ebus-sewa.mohua.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Institutional challenge and tender route; each city, CESL lot, PTA procurement or concession has its own deadline and conditions.",
        "window_evidence":{"source_url":"https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/PM-eBus-Sewa-Guidelines-Part-I-1.pdf","anchor":"Pages 6-10: eligible-city challenge method, State Level Steering Committee proposal route, CESL demand aggregation/tendering and contract implementation."},
        "review_note":"Keep review-gated. This record is a discovery and readiness route for institutional urban-mobility procurement, not a generic cash-benefit recommendation or a claim that any current tender is open."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Housing and Urban Affairs', 'Urban Transport Division', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', item->>'status', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, status = excluded.status, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;
    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.89, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://pm-ebus-sewa.mohua.gov.in/', 'implementing_portal', 'PM-eBus Sewa official portal', 'Current scheme overview, notices and procurement updates', now(), false),
      (version_id, 'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/Addendum_PM-eBus-Sewa-Guidelines.pdf', 'addendum', 'PM-eBus Sewa Guidelines Addendum', 'Current amendments require reconciliation before publication', now(), false),
      (version_id, 'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2026/03/https-www.pib_.gov_.in-PressReleasePage.aspx-PRID2237554reg3lang2-1.pdf', 'pib', 'PIB PM-eBus Sewa-PSM implementation update', '10 March 2026 update reporting progress as of 28 February 2026', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', null, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'procurement', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
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
