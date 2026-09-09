-- Shipbuilding Financial Assistance Scheme (SBFAS).
-- Preparation and official handoff for eligible Indian shipyards and vessel
-- contracts; not a general business or logistics subsidy.

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
        "slug":"shipbuilding-financial-assistance-scheme-sbfas",
        "name":"Shipbuilding Financial Assistance Scheme (SBFAS)",
        "type":"shipbuilding_financial_assistance",
        "authority":"Ministry of Ports, Shipping and Waterways",
        "authority_url":"https://shipmin.gov.in/",
        "canonical_url":"https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas",
        "source_url":"https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29_0.pdf",
        "source_kind":"guideline",
        "source_title":"Guidelines for Implementation of Shipbuilding Financial Assistance Scheme (SBFAS), modified 7 January 2026",
        "source_anchor":"Pages 1-9 and Schedules IV-V: eligible contracts, vessel categories, assistance rates, domestic content and application procedure",
        "summary":"A Ministry of Ports, Shipping and Waterways financial-assistance route for eligible Indian shipyards constructing qualifying vessels under contracts and domestic-content conditions prescribed by the current SBFAS guidelines.",
        "objective":"Help eligible shipyards determine whether a vessel contract fits SBFAS, calculate the separate assistance basis, prepare domestic-content and contract evidence, and submit through the official route within the prescribed timeline.",
        "legal_basis":"Shipbuilding Financial Assistance Scheme under the applicable Ministry of Ports, Shipping and Waterways guidelines and related shipbuilding policy framework; the modified guidelines dated 7 January 2026 control the current route.",
        "eligibility":{"entity_types":["shipyard","company","private_limited_company","public_limited_company","joint_venture","indian_shipbuilding_enterprise"],"lifecycle_stages":["operating","growth","scaling","manufacturing_expansion"],"industries":["shipbuilding","marine_engineering","defence_shipbuilding","commercial_vessels","inland_vessels","maritime_manufacturing"],"locations":["India"],"conditions":["the applicant is an eligible shipyard constructing a vessel under a qualifying shipbuilding contract","the contract date and approval route fall within the current SBFAS eligibility boundary","the major portion of the vessel hull is constructed and assembled in India and major machinery, equipment installation, commissioning and tests/trials meet the guideline conditions","the vessel satisfies the applicable domestic-content requirement and the domestic-content value can be certified by the prescribed Chartered Accountant route","the shipyard applies on the SBFAS web portal within 45 days of signing the contract and submits the prescribed contract, project and financial evidence","the vessel is not excluded by Schedule I and the project is not improperly claiming duplicate support for the same vessel"],"thresholds":{"eligible_contracts_from":"2025-09-24","approval_deadline":"2036-03-31","application_deadline_days_after_contract":45,"domestic_content_below_30_percent_support":"nil","domestic_content_30_to_below_40_percent_support":"pro_rata_to_40_percent","domestic_content_at_least_40_percent_support":"full","small_normal_vessel_up_to_inr":10000000000,"small_normal_assistance_percent":15,"large_normal_assistance_first_100_crore_percent":15,"large_normal_assistance_above_100_crore_percent":20,"specialized_vessel_assistance_first_100_crore_percent":15,"specialized_vessel_assistance_above_100_crore_percent":25},"exclusions":["ordinary logistics, shipping-company operations or vessel ownership without an eligible shipyard construction contract","vessels excluded under Schedule I or contracts outside the current date and approval boundaries","domestic content below 30 percent, which receives nil SBFAS support","construction, assembly, machinery installation, commissioning or testing that does not satisfy the India-location conditions","applications submitted outside the 45-day route without an applicable official exception","the contract price, fair price and calculated assistance must follow the lowest-price and re-evaluation rules; no scheme outlay is an applicant entitlement","the same vessel must not be represented as receiving duplicate central or State support where the current guidelines prohibit it"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas","route":"Within 45 days of signing the qualifying vessel contract, apply on the SBFAS web portal, obtain the unique application number, submit the prescribed approval documents and complete Ministry/DGS verification and tranche conditions","applicant_note":"UdyamVeda can prepare the shipyard, contract, vessel, domestic-content, CA certificate, project-cost and claim checklist, but cannot certify domestic content, represent a shipyard or submit the Government application on its behalf","fees":"No Government application fee is inferred from the cited guidelines; confirm any portal, certification, valuation, survey, professional or documentation costs separately","selection":"Eligibility review, unique application number, approval, domestic-content and contract verification, tranche release and final-payment re-evaluation under the current guidelines"},
        "fine_print":{"assistance_rates":{"small_normal_vessel":"15% of the value for contract/fair price up to INR 100 crore","large_normal_vessel":"15% on the first INR 100 crore and 20% on the remainder above INR 100 crore","specialized_vessel":"15% on the first INR 100 crore and 25% on the remainder above INR 100 crore"},"domestic_content":"Less than 30% receives nil support; 30% to below 40% receives pro-rata support toward the 40% threshold; 40% or greater receives full support subject to all other conditions.","price_basis":"The quantum is calculated using the lowest of the Contract Price or Fair Price in Indian Rupees, with re-evaluation against Actual Payment at final tranche where applicable.","contract_boundary":"The current guideline states that agreements signed from 24 September 2025 and approvals received by 31 March 2036 may be eligible, subject to vessel and scheme conditions; agreements in the transition period may have an SBFAP/SBFAS choice or deemed treatment described in the guideline.","documents":["signed shipbuilding contract","vessel and shipyard details","application and approval forms","project and cost evidence","domestic-content calculation and Chartered Accountant certificate","fair-price or valuation evidence","payment, milestone, delivery and trial evidence","security, inspection, audit and claim records as required"],"clawback":"Final assistance can be recalculated where Actual Payment is below the Contract/Fair Price or where contract, domestic-content, delivery, verification or other conditions are not met; recovery and adjustment terms follow the current guideline and sanction.","review_note":"Confirm Schedule I exclusions, vessel category, current portal route, competent authority, date transition, domestic-content calculation, fair-price basis, rates, 45-day deadline, tranche release, delivery, audit, recovery and any concurrent SBFAP/SbDS/MDF interaction before publication. Do not represent SBFAS as a generic transport subsidy."},
        "benefit_summary":{"types":["financial_assistance","shipbuilding_support","manufacturing_subsidy"],"summary":"Potential vessel-contract financial assistance for eligible Indian shipyards, calculated under vessel-category rates and domestic-content conditions; actual support depends on approval, price basis, milestones and final verification.","separate_value_buckets":true},
        "benefit_type":"financial_assistance",
        "benefit_label":"Shipbuilding Financial Assistance for qualifying Indian-built vessels",
        "benefit_conditions":{"eligible_shipyard_required":true,"qualifying_contract_required":true,"india_construction_required":true,"domestic_content_required":true,"45_day_application_deadline":true,"final_verification_required":true,"no_generic_logistics_entitlement":true},
        "requirement":"Eligible shipyard, signed vessel contract and domestic-content evidence",
        "requirement_description":"Prepare shipyard and vessel identity, signed contract, contract/fair-price basis, vessel category, India-construction evidence, project cost, domestic-content calculation, CA certificate, machinery and trial evidence, payment/milestone records and all current portal documents.",
        "rules":{"all":[{"field":"eligible_indian_shipyard","operator":"equals","value":true},{"field":"qualifying_vessel_contract_signed","operator":"equals","value":true},{"field":"major_hull_construction_in_india","operator":"equals","value":true},{"field":"domestic_content_percent","operator":"greater_than_or_equal","value":30},{"field":"sbfas_application_within_deadline","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm shipyard and vessel eligibility","description":"Check the current SBFAS guideline, Schedule I exclusions, vessel category and contract-date boundary before treating the route as available.","url":"https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29_0.pdf"},{"title":"Sign and document the qualifying contract","description":"Record the first or initial vessel contract, date, owner/buyer, contract price, vessel category and any SBFAP/SBFAS transition condition applicable to the contract.","url":"https://shipmin.gov.in/en/orders/guideline"},{"title":"Calculate domestic content and price basis","description":"Prepare the Indian-origin goods, components, services, labour, machinery and overhead calculation, obtain the required CA certification and establish the Contract/Fair Price basis.","url":"https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29_0.pdf"},{"title":"Apply within 45 days","description":"Use the current SBFAS portal within 45 days of signing the contract, obtain the unique application number and submit the prescribed approval documents.","url":"https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas"},{"title":"Track construction, tranches and final verification","description":"Retain construction, machinery, commissioning, trials, payment, delivery, inspection, milestone, claim and audit evidence through final tranche and any re-evaluation.","url":"https://shipmin.gov.in/guideline/guidelines-shipping"}],
        "window_type":"fixed",
        "window_label":"The current guideline covers qualifying agreements from 24 September 2025 with approval available through 31 March 2036; the application must be made within 45 days of the vessel contract and current portal availability must be confirmed.",
        "window_evidence":{"source_url":"https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29_0.pdf","anchor":"Pages 1-3: contract and approval boundary; Annexure-I: application within 45 days; Schedule IV-V: rates and domestic content"},
        "review_note":"Confirm the live SBFAS portal, Schedule I, vessel category, price basis, domestic-content formula, CA certificate, transition from SBFAP, 45-day deadline, tranche and final-payment conditions before approval. This is not a general logistics or merchant-shipping subsidy."}
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Ports, Shipping and Waterways', 'Shipping', item->>'authority_url')
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
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
      (version_id, 'https://shipmin.gov.in/en/orders/guideline', 'notice_index', 'Ministry of Ports shipping guidelines index', 'Current SBFAS and related shipbuilding guidelines', now(), false),
      (version_id, 'https://shipmin.gov.in/en/content/modified-guidelines-implementation-shipbuilding-financial-assistance-scheme-sbfas', 'scheme_page', 'Ministry of Ports SBFAS notice', 'Modified SBFAS guideline metadata and current route', now(), false),
      (version_id, 'https://shipmin.gov.in/guideline/guidelines-shipping', 'scheme_page', 'Ministry of Ports shipping guidelines overview', 'SBFAS shipping-guidelines overview', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'manufacturing', item->>'requirement', item->>'requirement_description', true)
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
