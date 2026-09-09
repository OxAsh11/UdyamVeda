-- Current MeitY/DoT technology-business records from official pages and
-- documents. These are not publishable until calls, route ownership, fund
-- availability and applicant evidence are checked by a human reviewer.

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
        "slug":"meity-genesis-gen-next-support-for-innovative-startups",
        "name":"GEN-NEXT Support for Innovative Startups (GENESIS)",
        "type":"startup_support",
        "authority":"Ministry of Electronics and Information Technology - GENESIS",
        "authority_url":"https://www.meity.gov.in/",
        "canonical_url":"https://msh.meity.gov.in/schemes/genesis",
        "source_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/gen-next-support-for-innovative-startups-genesis-gN5AjNtQWa",
        "source_kind":"ministry_portal",
        "source_title":"GEN-NEXT Support for Innovative Startups (GENESIS)",
        "source_anchor":"Introduction, eligibility, major components and detailed documents",
        "summary":"MeitY umbrella support for technology startups and ecosystem institutions, with a Tier-II/III focus and component-specific ideation, pilot, investment and deep-tech pathways.",
        "objective":"Nurture, accelerate and scale technology startups outside the largest hubs while strengthening incubators, implementing agencies, communities and pilot or investment pathways.",
        "legal_basis":"GEN-NEXT Support for Innovative Startups (GENESIS) scheme of the Ministry of Electronics and Information Technology.",
        "eligibility":{"entity_types":["startup","section_8_company","incubator","accelerator","educational_institution","startup_ecosystem_entity","implementing_agency"],"lifecycle_stages":["idea","pre_seed","early_stage","pilot","deep_tech","fundraising"],"industries":["electronics","information_technology","ict","artificial_intelligence","india_stack","digital_services","deep_tech"],"locations":["tier_ii_city","tier_iii_city","India"],"conditions":["the startup or ecosystem entity must fit the current component and implementing-agency route","the support route is component-specific and may require an eligible incubator, accelerator or selected implementing agency","startup location, technology, stage, selection, diligence, matching and pilot evidence must be verified for the relevant call","a scheme outlay or aggregate ecosystem target is not an individual applicant entitlement"],"thresholds":{"scheme_outlay_inr":4900000000,"stated_duration_years":5,"brochure_early_stage_support_max_inr":1000000,"brochure_deep_tech_support_max_inr":10000000,"brochure_pilot_support_max_inr":5000000,"brochure_investment_support_max_inr":5000000},"unknown_handling":"needs_information"},
        "exclusions":["a startup treating the GENESIS scheme outlay as a guaranteed grant","an applicant outside the current component, implementing agency, geography or selection process","investment or pilot support presented without component-specific diligence, matching or milestone conditions","a startup using historical brochure ceilings without confirming the current call or agency route"],
        "application":{"portal":"https://msh.meity.gov.in/schemes/genesis","route":"Identify the current GENESIS component and selected implementing agency, then follow the agency's official call, application and diligence route","selection":"Component-specific screening, expert selection, technical/commercial diligence, agency approval, milestones and monitoring","fees":"Confirm current implementing-agency terms; no fee entitlement is inferred from the scheme record","applicant_note":"UdyamVeda can map the startup to a likely component and prepare an evidence checklist, but cannot promise selection, submit confidential investor material or represent an implementing agency."},
        "fine_print":{"scope":"The official pages describe GENESIS as an umbrella scheme with Tier-II/III-focused support and components including Entrepreneur in Residence, pilot funding, investment support and deep-tech funding.","funding":"The official brochure describes historical component boundaries including early-stage support up to Rs. 10 lakh, pilot support up to Rs. 50 lakh, deep-tech support up to Rs. 1 crore and investment support up to Rs. 50 lakh with private-sector matching; these are component-specific references, not a universal grant or loan ceiling.","route":"MeitY Startup Hub implements the ecosystem through selected implementing agencies; the startup-facing route, geography, stage, matching, selection and current availability must be checked for the active call.","review_note":"Confirm the current GENESIS component, selected agency, active call, geographic and stage criteria, support instrument, matching or investment terms, diligence documents, milestones, reporting and whether historical component ceilings remain current."},
        "benefit_summary":{"types":["startup_support","pilot_funding","investment_support","deep_tech_support","incubation"],"summary":"Component-specific startup ecosystem support through selected implementing agencies, including possible pilot, early-stage, investment or deep-tech routes. The scheme budget is not an applicant benefit and values must not be combined across components.","separate_value_buckets":true},
        "benefit_type":"component_specific_startup_support",
        "benefit_label":"GENESIS component-specific pilot, investment and deep-tech support",
        "benefit_conditions":{"selected_implementing_agency_required":true,"component_specific_support":true,"diligence_and_selection_required":true,"historical_ceiling_requires_current_call_confirmation":true},
        "requirement":"Technology startup or eligible ecosystem entity with a component-fit proposal",
        "requirement_description":"Prepare incorporation and startup-recognition evidence, location and technology-stage proof, product or pilot plan, team, traction, budget, IP, diligence and matching/investment evidence required by the selected component and agency.",
        "rules":{"all":[{"field":"technology_startup_or_eligible_ecosystem_entity","operator":"equals","value":true},{"field":"tier_two_or_tier_three_or_component_fit_verified","operator":"equals","value":true},{"field":"genesis_component_and_agency_call_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the current GENESIS component","description":"Determine whether the need is ideation, pilot, early-stage, investment, deep-tech or ecosystem/incubator support and confirm the current official component route.","url":"https://msh.meity.gov.in/schemes/genesis"},{"title":"Identify the selected implementing agency","description":"Verify the current agency, geography, startup stage, application window, diligence list and support instrument before preparing the proposal.","url":"https://www.meity.gov.in/offerings/schemes-and-services/details/gen-next-support-for-innovative-startups-genesis-gN5AjNtQWa"},{"title":"Submit and complete diligence","description":"Use the agency's official call route, submit the component-specific proposal and retain selection, investment, pilot, milestone and reporting evidence.","url":"https://www.meity.gov.in/static/uploads/2024/02/Brochure_GENESIS.pdf"}],
        "window_type":"call_for_applications",
        "window_label":"GENESIS opportunities are component- and implementing-agency-specific; no universal national deadline or direct applicant entitlement is asserted.",
        "window_evidence":{"source_url":"https://msh.meity.gov.in/schemes/genesis","anchor":"Major components and list of selected implementing agencies"},
        "review_note":"Current active calls, agency routes, support instruments and component-specific ceilings require human review."
      },
      {
        "slug":"dot-telecom-testing-certification-reimbursement-startups-mses",
        "name":"Reimbursement of Testing and Certification Charges for Telecom Start-ups and MSEs",
        "type":"certification_reimbursement",
        "authority":"Department of Telecommunications - Telecom Engineering Centre",
        "authority_url":"https://www.dot.gov.in/",
        "canonical_url":"https://tec.gov.in/tcrs",
        "source_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa",
        "source_kind":"scheme_page",
        "source_title":"Guidelines for implementation of Scheme for reimbursement of Testing and Certification Charges",
        "source_anchor":"Overview, reimbursement criteria, scheme duration and application portal",
        "summary":"Telecom-sector reimbursement for eligible start-ups and micro or small enterprises that incur testing and certification charges at recognized laboratories.",
        "objective":"Reduce the cost barrier for telecom start-ups and MSEs to complete mandatory or voluntary testing and certification, improve standards compliance and support market adoption.",
        "legal_basis":"Scheme for reimbursement of Testing and Certification Charges for Start-ups and Telecom MSEs implemented through the Telecom Engineering Centre under the Department of Telecommunications.",
        "eligibility":{"entity_types":["dpiit_startup","micro","small","telecom_startup","telecom_mse"],"lifecycle_stages":["prototype","validation","certification","market_entry","operate"],"industries":["telecommunications","telecom_equipment","networking","digital_communications"],"locations":["India"],"conditions":["the applicant must be a telecom start-up or MSE satisfying the current scheme route","testing or certification must be carried out at a TEC/NCCS-designated or recognized lab or an eligible NABL-accredited lab where applicable","the applicant must provide the required incorporation, financial, registration, lab, report, invoice, payment and bank evidence","the same testing and certification charges must not already have been reimbursed under another Government scheme"],"thresholds":{"startup_reimbursement_percent":75,"micro_enterprise_reimbursement_percent":60,"small_enterprise_reimbursement_percent":50,"maximum_reimbursement_per_entity_inr":5000000,"scheme_fund_boundary_inr":250000000,"revenue_ceiling_inr":50000000,"startup_funding_ceiling_inr":100000000},"unknown_handling":"needs_information"},
        "exclusions":["testing or certification charges outside the eligible telecom product and laboratory route","a business without DPIIT start-up or Udyam evidence where required","expenses already reimbursed under another Government scheme","claims that exceed the entity-level cap, fund availability, eligible percentage or current application period","applications missing invoices, payment receipts, test reports, product certificates, financials or required declarations"],
        "application":{"portal":"https://tec.gov.in/tcrs","route":"Submit the online reimbursement application with the incorporation, DPIIT/Udyam, financial, laboratory, test report, product certificate, invoice, payment, bank and declaration documents","selection":"Document and eligibility review by the implementing route; reimbursement depends on eligible charges, evidence, fund availability and applicable cap","fees":"The record does not infer a portal fee; confirm current TEC instructions","applicant_note":"UdyamVeda can prepare the document checklist and reimbursement-readiness review, but cannot certify the product, submit claims on behalf of the applicant or store portal credentials."},
        "fine_print":{"rates":"The official page states reimbursement of 75% for start-ups, 60% for micro enterprises and 50% for small enterprises, subject to the scheme rules and entity-level cap.","cap":"The official page states a maximum reimbursement of Rs. 50 lakh per entity and a Rs. 25 crore allocation boundary; exhaustion of funds or the scheme duration can end availability earlier.","duration":"The official page states the scheme operates for two years from implementation or until the allocated funds are fully utilized, whichever is earlier. The current implementation date, remaining funds and any extension require verification.","documents":"The official guideline requires incorporation, audited financial statements, DPIIT or Udyam registration, eligible laboratory evidence, test reports/product certificate, invoices, payment receipt, bank details, PAN and declarations including no duplicate reimbursement; it also states revenue and prior-funding conditions that require applicant evidence.","review_note":"Confirm current portal acceptance, implementation date, remaining fund balance, laboratory list, product/certification scope, entity-size test, revenue and funding thresholds, eligible cost period and any amendment before publication."},
        "benefit_summary":{"types":["reimbursement","certification_support","compliance_support"],"summary":"Partial reimbursement of eligible telecom testing and certification charges at entity-category-specific rates, subject to evidence, no-double-benefit, fund and duration limits. This is not an advance grant or universal subsidy.","separate_value_buckets":true},
        "benefit_type":"reimbursement",
        "benefit_label":"Telecom testing and certification charge reimbursement",
        "amount_max":5000000,
        "benefit_conditions":{"startup_percent":75,"micro_percent":60,"small_percent":50,"maximum_per_entity_inr":5000000,"eligible_lab_required":true,"no_duplicate_reimbursement":true,"fund_and_duration_limited":true},
        "requirement":"Eligible telecom start-up or MSE with completed testing/certification evidence",
        "requirement_description":"Prepare incorporation, DPIIT or Udyam, audited financial, eligible-lab, test-report/product-certificate, invoice, payment, bank, PAN and no-duplicate-reimbursement evidence, plus the required revenue and funding declarations.",
        "rules":{"all":[{"field":"eligible_telecom_startup_or_mse","operator":"equals","value":true},{"field":"eligible_lab_and_certification_expense","operator":"equals","value":true},{"field":"testing_reimbursement_documents_ready","operator":"equals","value":true},{"field":"same_expense_not_reimbursed_elsewhere","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm applicant and product eligibility","description":"Verify the telecom-sector route, DPIIT/Udyam status, entity category, revenue/funding declarations and eligible product or certification scope.","url":"https://www.meity.gov.in/static/uploads/2025/06/837f9d009185a3e2061fb12ba8ef4d17.pdf"},{"title":"Use an eligible laboratory and retain evidence","description":"Confirm TEC/NCCS designation or eligible NABL accreditation, complete testing/certification and retain reports, product certificates, invoices and payment receipts.","url":"https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa"},{"title":"Submit the reimbursement claim","description":"Submit online through the TEC portal while the current scheme period and funds remain available; retain the application and acknowledgement.","url":"https://tec.gov.in/tcrs"}],
        "window_type":"rolling",
        "window_label":"The official page states a two-year implementation period or earlier closure when the Rs. 25 crore allocation is exhausted. Confirm the implementation date, remaining funds and any extension before showing an actionable deadline.",
        "window_evidence":{"source_url":"https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa","anchor":"Scheme Duration and application portal"},
        "review_note":"Current fund balance, implementation date, portal acceptance, laboratory list and any amendment require human review."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central',
      case when item->>'slug' like 'dot-%' then 'Ministry of Communications' else 'Ministry of Electronics and Information Technology' end,
      case when item->>'slug' like 'dot-%' then 'Department of Telecommunications' else null end,
      item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.meity.gov.in/', 'ministry_portal', 'MeitY official portal', 'Official schemes and notices portal', now(), false),
      (version_id, 'https://www.dot.gov.in/', 'ministry_portal', 'Department of Telecommunications official portal', 'Official telecom ministry portal', now(), false),
      (version_id, 'https://tec.gov.in/tcrs', 'agency_portal', 'TEC testing and certification reimbursement portal', 'Application handoff', now(), false)
    on conflict do nothing;
    if item->>'slug' = 'meity-genesis-gen-next-support-for-innovative-startups' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://msh.meity.gov.in/schemes/genesis', 'agency_portal', 'MeitY Startup Hub GENESIS page', 'Components and implementing-agency route', now(), false),
        (version_id, 'https://www.meity.gov.in/static/uploads/2024/02/Brochure_GENESIS.pdf', 'brochure', 'GENESIS official brochure', 'Component-specific support boundaries', now(), false)
      on conflict do nothing;
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://www.meity.gov.in/static/uploads/2025/06/837f9d009185a3e2061fb12ba8ef4d17.pdf', 'guideline', 'Telecom testing reimbursement guidelines', 'Application documents and applicant declarations', now(), false),
        (version_id, 'https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa', 'scheme_page', 'MeitY telecom testing reimbursement scheme page', 'Rates, cap, duration and route', now(), false)
      on conflict do nothing;
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'eligibility', item->>'requirement', item->>'requirement_description', true
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
