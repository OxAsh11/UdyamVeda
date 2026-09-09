-- PM E-DRIVE EV public-charging route. This record is review-gated because
-- the subsidy is routed through appointed institutional nodal agencies.

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
        "slug":"mhi-pm-e-drive-ev-public-charging-stations",
        "name":"PM E-DRIVE: EV Public Charging Station deployment support",
        "type":"subsidy",
        "status":"active",
        "authority":"Ministry of Heavy Industries (MoHI)",
        "authority_url":"https://heavyindustries.gov.in/",
        "canonical_url":"https://pmedrive.heavyindustries.gov.in/",
        "source_url":"https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf",
        "source_kind":"faq",
        "source_title":"PM E-DRIVE EV PCS operational-guidelines FAQ",
        "source_anchor":"Pages 1-4, Questions 1-13: location categories, benchmark charger costs, eligible proposal entities, nodal-agency route, CPO selection, commissioning, uptime, data sharing and recovery conditions",
        "summary":"Institutional subsidy support for eligible Government and public-sector nodal agencies to propose, deploy and commission publicly accessible EV charging stations under PM E-DRIVE.",
        "objective":"Expand publicly accessible EV charging infrastructure through proposals aggregated and submitted by appointed nodal agencies under the Ministry of Heavy Industries route.",
        "legal_basis":"PM E-DRIVE scheme notification and amendments issued by the Ministry of Heavy Industries, including the Gazette extension to 31 March 2028 and the current EV PCS operational guidelines and FAQ.",
        "eligibility":{"entity_types":["central_ministry","central_public_sector_enterprise","state_government","union_territory_administration","state_public_sector_undertaking","appointed_nodal_agency"],"lifecycle_stages":["infrastructure","expansion","operations"],"industries":["electric_mobility","ev_charging_infrastructure","energy","transport_infrastructure"],"locations":["India","publicly_accessible_locations"],"conditions":["proposal must be submitted by an eligible Government or public-sector entity through the appointed nodal agency route","the nodal agency must aggregate demand and submit the EV PCS proposal to the Ministry of Heavy Industries","each proposed location must have a feasibility study covering location selection, configuration and charger rating","locations must provide unrestricted public access","the implementing agency must commission, maintain and monitor the chargers and share required location, availability, pricing and payment data with the designated national hub","a private Charge Point Operator may be appointed only through the nodal agency's fair and transparent selection process"],"thresholds":{"scheme_outlay_inr":109000000000,"scheme_end":"2028-03-31","charger_benchmark_inr":{"12kw":160000,"60kw":340000,"120kw":500000,"240kw":800000,"360kw":1250000},"category_a_subsidy_preference_max_percent":20},"unknown_handling":"needs_information"},
        "exclusions":["ordinary founders, startups, private landowners and private CPOs are not direct subsidy beneficiaries under the EV PCS FAQ","the subsidy is provided only to the appointed nodal agency; a CPO is an implementation/procurement route, not automatically the subsidy recipient","charger benchmark values are not a universal per-applicant grant ceiling and upstream infrastructure depends on DISCOM demand notes and appraisal","refundable deposits and GST are not eligible subsidy costs","a proposal may be accepted or rejected by the Ministry of Heavy Industries and excess subsidy can be recovered with interest if location categorisation is wrong","the total scheme outlay is a programme cap, not an individual entitlement","the scheme and its components are fund-limited and component-specific amendments or exhausted funds can close a route before the terminal date"],
        "application":{"portal":"https://pmedrive.heavyindustries.gov.in/","route":"An eligible Government or public-sector entity appoints or acts through a nodal agency, aggregates demand, completes feasibility and location documentation, submits the EV PCS proposal to the Ministry of Heavy Industries, and then follows the approved deployment, commissioning, data and maintenance route.","selection":"Ministry of Heavy Industries evaluation of the nodal-agency proposal; revised proposals may be evaluated first-come, first-served, while the Ministry retains acceptance/rejection discretion.","fees":"No applicant fee is asserted. Procurement, land, electricity, DISCOM, civil-work, operation and maintenance costs must be handled under the approved proposal and procurement route.","applicant_note":"UdyamVeda can explain eligibility, proposal preparation and CPO procurement boundaries, but must not present this institutional route as a direct founder grant or impersonate a nodal agency."},
        "fine_print":{"location_categories":"The FAQ distinguishes Category A and Category B locations and requires unrestricted public access; the responsible nodal agency decides categorisation under the operational guidelines.","benchmark_costs":"The September 2025 FAQ lists benchmark charger costs including INR 1.60 lakh for 12kW LEVDC/LECCS, INR 3.40 lakh for 60kW CCS-II, INR 5 lakh for 120kW, INR 8 lakh for 240kW and INR 12.50 lakh for 360kW, all including GST as displayed; refundable deposits and GST are not eligible subsidy costs, so the calculation needs reconciliation before publication.","upstream_infrastructure":"Upstream infrastructure subsidy is based on DISCOM demand notes or estimates and abnormally high costs may be excluded.","commissioning":"The final tranche for eligible advance-subsidy cases is tied to energisation, commissioning and onboarding to the proposed Unified Bharat E-Charge hub.","operations":"Implementing agencies must maintain high uptime and share charger location, availability, pricing and digital-payment data.","scheme_period":"The Gazette extension states an overall PM E-DRIVE period through 31 March 2028 and a total outlay of INR 10,900 crore; component-specific terminal dates and amendments must be reconciled from the current notification index.","review_note":"Before publication, reconcile the controlling EV PCS operational guideline, latest MHI amendment, nodal-agency proposal window, benchmark-cost treatment, subsidy percentages/caps, eligible-location categories, DISCOM evidence, CPO procurement route, commissioning milestone, data hub status and any 2026 amendment."},
        "benefit_summary":{"types":["subsidy","market_access"],"summary":"Proposal-based EV charging-infrastructure subsidy routed through appointed Government/public-sector nodal agencies, with separate deployment, commissioning, data and maintenance obligations; no direct founder entitlement is asserted.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"EV public-charging station subsidy through an appointed nodal agency",
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"scheme_outlay_inr":109000000000,"charger_benchmark_inr":{"12kw":160000,"60kw":340000,"120kw":500000,"240kw":800000,"360kw":1250000},"upstream_infrastructure_requires_discom_demand_note":true,"nodal_agency_only":true,"public_access_required":true,"commissioning_and_data_obligations":true},
        "requirement":"Eligible institutional applicant, appointed nodal agency, feasible public locations and approved EV PCS proposal",
        "requirement_description":"Prepare institutional authority, nodal-agency appointment, demand aggregation, location access, feasibility, charger configuration, DISCOM, procurement, commissioning, maintenance and data-sharing evidence under the current EV PCS guideline.",
        "rules":{"all":[{"field":"institutional_eligibility_verified","operator":"equals","value":true},{"field":"appointed_nodal_agency_verified","operator":"equals","value":true},{"field":"ev_pcs_feasibility_study_verified","operator":"equals","value":true},{"field":"public_access_verified","operator":"equals","value":true},{"field":"mhi_proposal_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm institutional and nodal-agency eligibility","description":"Verify that the applicant is an eligible Government/public-sector entity and identify the appointed nodal agency; ordinary private CPOs should not be treated as direct beneficiaries.","url":"https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf"},{"title":"Aggregate demand and complete feasibility","description":"Prepare location, public-access, configuration, charger-rating, demand, DISCOM and implementation evidence for each proposed EV PCS site.","url":"https://pmedrive.heavyindustries.gov.in/docs/policy_document/EV%20PCS%20operational%20guidelines_F.pdf"},{"title":"Submit through the Ministry route","description":"The appointed nodal agency submits the proposal to the Ministry of Heavy Industries and retains the acceptance, rejection or clarification record.","url":"https://pmedrive.heavyindustries.gov.in/"},{"title":"Procure, commission and operate","description":"Follow the approved procurement/CPO route, energise and commission the chargers, maintain uptime and share required data with the designated national hub.","url":"https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf"}],
        "window_type":"call_for_applications",
        "window_label":"Institutional proposal route under current EV PCS guidelines; no universal public founder application window is asserted.",
        "window_evidence":{"source_url":"https://pmedrive.heavyindustries.gov.in/policy_procedure","anchor":"Current guideline index lists EV PCS operational guidelines and a December 2025 EV PCS FAQ; confirm current proposal intake with the appointed nodal agency."},
        "review_note":"Keep review-gated. This is a useful Government opportunity for institutional infrastructure and CPO procurement discovery, but it must never be shown as a direct startup grant or universal charger subsidy."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Heavy Industries', 'Department of Heavy Industry', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://pmedrive.heavyindustries.gov.in/', 'implementing_portal', 'PM E-DRIVE official portal', 'Current scheme portal and operational links', now(), false),
      (version_id, 'https://pmedrive.heavyindustries.gov.in/policy_procedure', 'guideline_index', 'PM E-DRIVE scheme guidelines index', 'EV PCS guideline and FAQ listings', now(), false),
      (version_id, 'https://pmedrive.heavyindustries.gov.in/policy_document', 'gazette_index', 'PM E-DRIVE scheme notifications index', 'Current amendments and extension notifications', now(), false),
      (version_id, 'https://pmedrive.heavyindustries.gov.in/docs/policy_document/EV%20PCS%20operational%20guidelines_F.pdf', 'guideline', 'PM E-DRIVE EV PCS operational guidelines', 'Controlling proposal and implementation guideline', now(), false),
      (version_id, 'https://pmedrive.heavyindustries.gov.in/docs/policy_document/Extension%20of%20Scheme%20till%2031%2003%202028%20dated%2007%2008%202025.pdf', 'gazette', 'PM E-DRIVE extension Gazette notification', 'Scheme period, outlay and fund-limited boundary', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', null, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'institutional', item->>'requirement', item->>'requirement_description', true
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
