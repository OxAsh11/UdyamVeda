-- Production Linked Incentive Scheme for promotion of domestic manufacturing
-- of critical KSMs, Drug Intermediates and APIs (PLI Bulk Drugs).
-- Separate from the finished/high-value pharmaceuticals PLI record.

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
        "slug":"production-linked-incentive-bulk-drugs-ksm-di-api",
        "name":"Production Linked Incentive Scheme for Bulk Drugs (KSMs, DIs and APIs)",
        "type":"manufacturing_incentive",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharmaceuticals.gov.in/",
        "canonical_url":"https://pharmaceuticals.gov.in/",
        "source_url":"https://pharmaceuticals.gov.in/sites/default/files/Gazettee%20notification%20of%20bulk%20drug%20schemes_0.pdf",
        "source_kind":"gazette_notification",
        "source_title":"Gazette notification of PLI Scheme for Bulk Drugs",
        "source_anchor":"Sections 2-13 and Annexures B-C: objective, 41 products, incentive rates, greenfield condition, thresholds, tenure and application route",
        "summary":"A production-linked incentive scheme for selected Indian manufacturers of 41 critical key starting materials, drug intermediates and active pharmaceutical ingredients, with support tied to eligible domestic sales and greenfield investment thresholds.",
        "objective":"Reduce import dependence in critical pharmaceutical inputs by attracting investment and production for identified KSM, DI and API products in India.",
        "legal_basis":"Department of Pharmaceuticals Gazette notification dated 21 July 2020 and the applicable revised guidelines and corrigenda, including the 12 March 2024 SCOD/bank-guarantee amendment and 25 September 2024 successor-in-interest amendment.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","msme","pharmaceutical_manufacturer"],"lifecycle_stages":["new_project","growth","scaling","manufacturing_expansion"],"industries":["pharmaceuticals","bulk_drugs","active_pharmaceutical_ingredients","drug_intermediates","chemical_manufacturing","biopharmaceuticals"],"locations":["India"],"conditions":["the applicant is a manufacturer registered in India","the proposed product is one of the 41 eligible KSM, DI or API products in the controlling Gazette/guidelines and amendments","the project is a greenfield project and satisfies the applicable target-segment investment threshold","the applicant meets the applicable production, domestic-sales, commercial-operation and reporting conditions before claiming incentive","the applicant follows the official application, selection, bank-guarantee, claim and verification route","the current selected-applicant and claim status is confirmed from the Department or designated implementing route"],"thresholds":{"base_year":"FY 2019-20","scheme_tenure":"FY 2020-21 to FY 2029-30","financial_outlay_inr":69400000000,"eligible_product_count":41,"application_window_days":120,"target_segments":{"fermentation_based_kSM_di":[{"product_count":4,"minimum_investment_inr":4000000000},{"product_count":10,"minimum_investment_inr":500000000}],"chemical_synthesis_based_kSM_di_api":[{"product_count":4,"minimum_investment_inr":500000000},{"product_count":23,"minimum_investment_inr":200000000}]},"incentive_schedule":{"fermentation_based":{"FY 2023-24":"20%","FY 2024-25":"20%","FY 2025-26":"20%","FY 2026-27":"20%","FY 2027-28":"15%","FY 2028-29":"5%"},"chemical_synthesis_based":{"FY 2022-23":"10%","FY 2023-24":"10%","FY 2024-25":"10%","FY 2025-26":"10%","FY 2026-27":"10%","FY 2027-28":"10%"}}},"unknown_handling":"needs_information"},
        "exclusions":["finished-dose pharmaceutical products outside the 41 identified KSM/DI/API products","brownfield projects where the controlling guidelines require a greenfield project","products, capacities or investment that do not satisfy the applicable target-segment schedule","an approval letter is not a guarantee that incentive will be disbursed; claims remain subject to eligibility verification","the scheme outlay is not an individual applicant ceiling","historic application notices must not be represented as a currently open application window","failure to meet commercial-operation, production, sales, reporting or amendment conditions can affect claims and bank-guarantee release"],
        "application":{"portal":"https://pharmaceuticals.gov.in/","route":"Confirm the current selected-applicant, claim and implementing-agency route with the Department of Pharmaceuticals, map the product to the controlling 41-product list, prepare greenfield investment and production evidence, and use the official route if a permitted application or claim action remains available","applicant_note":"UdyamVeda can explain the route, compare the product and threshold conditions, prepare evidence checklists and flag amendment dependencies; the applicant must submit representations, bank guarantees and claims through the official process","fees":"Confirm current application, portal, professional, certification and implementing-agency charges from the official route","selection":"Technical and financial appraisal, selection for eligible product(s), bank-guarantee and commercial-operation conditions, then claim verification and disbursement subject to the guidelines"},
        "fine_print":{"product_boundary":"The Gazette covers 41 identified products across four target segments; the current product list, approved product and amendment history control over a generic API or bulk-drug description.","greenfield_only":true,"incentive_basis":"Financial incentive is linked to sales of selected products and the applicable segment/year rate; it is not a general capital grant and not payable merely on incorporation or investment.","thresholds":"The Gazette schedule records minimum investment thresholds by target segment: INR 400 crore for four key fermentation products, INR 50 crore for ten fermentation-based niche products, INR 50 crore for four key chemical-synthesis products and INR 20 crore for 23 other chemical-synthesis products.","amendment_controls":"The 12 March 2024 corrigendum addresses revised SCOD and bank-guarantee consequences; the 25 September 2024 corrigendum expands successor-in-interest treatment. Separate product approvals and bank guarantees may apply.","claim_and_recovery":"The 2024 amendment states approval is not a guarantee of disbursement; eligibility is verified after the disbursal claim, and ineligibility or non-compliance can lead to forfeiture or bank-guarantee invocation.","window":"The Gazette provides a 120-day application window, while later notices were product-specific and time-bound. Current new-applicant availability must be checked rather than inferred from the framework.","review_note":"Confirm the current application/claim status, selected-applicant list, eligible-product list, target-segment mapping, greenfield definition, threshold investment, rate/year, SCOD, bank-guarantee, successor-in-interest, production/sales evidence, PMA route, audit documents and recovery conditions before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential production-linked incentive on eligible domestic sales for selected Indian manufacturers of specified KSMs, DIs and APIs; rates vary by target segment and financial year and require approval and claim verification.","separate_value_buckets":true},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"PLI support for identified bulk-drug KSM, DI and API manufacturing",
        "benefit_conditions":{"selected_applicant_required":true,"eligible_product_required":true,"greenfield_project_required":true,"threshold_investment_required":true,"domestic_sales_and_production_required":true,"claim_verification_required":true,"scheme_outlay_not_individual_entitlement":true},
        "requirement":"Identified product, greenfield project and threshold investment evidence",
        "requirement_description":"Prepare entity and Indian-manufacturing evidence, product and target-segment mapping, greenfield project documents, investment schedule, production capacity, domestic-sales plan, statutory approvals, bank guarantee and the financial/audit evidence required for selection and claims.",
        "rules":{"all":[{"field":"is_registered_indian_manufacturer","operator":"equals","value":true},{"field":"eligible_bulk_drug_product_identified","operator":"equals","value":true},{"field":"greenfield_project_confirmed","operator":"equals","value":true},{"field":"target_segment_investment_threshold_met","operator":"equals","value":true},{"field":"current_application_or_claim_route_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the product to the controlling list","description":"Verify the KSM, DI or API against the 41-product list and identify the target segment, production route and applicable amendments.","url":"https://pharmaceuticals.gov.in/sites/default/files/Gazettee%20notification%20of%20bulk%20drug%20schemes_0.pdf"},{"title":"Confirm current route and status","description":"Check the Department portal, current notices, selected-applicant records and implementing-agency route; do not treat the historic 120-day window as open today.","url":"https://pharmaceuticals.gov.in/"},{"title":"Prepare greenfield and threshold evidence","description":"Document the greenfield project, investment threshold, capacity, commercial-operation plan, statutory approvals and bank-guarantee requirements.","url":"https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20for%20the%20Production%20Linked%20Incentive%20%28PLI%29%20Scheme%20for%20promotion%20of_0.pdf"},{"title":"Track amendments and claim conditions","description":"Reconcile SCOD, successor-in-interest, product-specific approval, production, domestic-sales, audit, claim and bank-guarantee conditions before making any benefit estimate.","url":"https://pharmaceuticals.gov.in/sites/default/files/Corrigendum%20dated%2012.03.2024.pdf"},{"title":"Submit through the official route","description":"If a permitted application or claim action is available, submit through the current official route and retain approval, bank-guarantee, production, sales and audit evidence.","url":"https://pharmaceuticals.gov.in/sites/default/files/Notice%20PLI%20Scheme%20for%20Bulk%20Drug.pdf"}],
        "window_type":"closed_or_claim_only",
        "window_label":"The framework states a 120-day application window and a scheme tenure through FY 2029-30, but the historic product-specific application notices are time-bound. Treat new-applicant availability as unconfirmed until the current Department route is reviewed; selected applicants may have continuing claim/commercial-operation obligations.",
        "window_evidence":{"source_url":"https://pharmaceuticals.gov.in/sites/default/files/Gazettee%20notification%20of%20bulk%20drug%20schemes_0.pdf","anchor":"Sections 8-10 and 13: tenure FY 2020-21 to FY 2029-30, 120-day application window and selection/disbursement process"}
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.87, 'in_review')
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
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20for%20the%20Production%20Linked%20Incentive%20%28PLI%29%20Scheme%20for%20promotion%20of_0.pdf', 'guideline', 'Department of Pharmaceuticals Bulk Drugs PLI guidelines', 'Operating guidance, product/segment conditions and claim evidence', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/Corrigendum%20dated%2012.03.2024.pdf', 'corrigendum', 'Department of Pharmaceuticals Bulk Drugs PLI 2024 SCOD amendment', 'SCOD, bank-guarantee, multiple-product and disbursement caveats', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/Corrigendum%20Under%20PLI%20scheme%20for%20Bulk%20Drugs%2025.09.2024_0.pdf', 'corrigendum', 'Department of Pharmaceuticals Bulk Drugs PLI 2024 successor amendment', 'Successor-in-interest definition', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'Department of Pharmaceuticals official portal', 'Current notices, status and official route', now(), false)
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
