-- Pradhan Mantri Matsya Kisan Samridhi Sah-Yojana (PM-MKSSY), a Central
-- Sector sub-scheme under PMMSY. This record separates formalisation, credit
-- access, insurance incentives and performance grants; it is not a guaranteed
-- cash entitlement and remains review-gated.

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
        "slug":"pradhan-mantri-matsya-kisan-samridhi-sah-yojana",
        "name":"Pradhan Mantri Matsya Kisan Samridhi Sah-Yojana (PM-MKSSY)",
        "type":"grant",
        "lifecycle_status":"active",
        "authority":"Department of Fisheries - PM-MKSSY",
        "authority_url":"https://dof.gov.in/",
        "canonical_url":"https://pmmsy.dof.gov.in/",
        "source_url":"https://www.dof.gov.in/static/uploads/2025/09/db9e0987df6461b69304fe4115aceec9.pdf",
        "source_kind":"guideline",
        "source_title":"PM-MKSSY Environmental and Social Management Framework",
        "source_anchor":"Pages 3-13: objectives, targeted beneficiaries, NFDP formalisation, working-capital access, aquaculture insurance, performance grants, post-verification and exclusions",
        "summary":"A Central Sector sub-scheme under PMMSY for formalising fisheries stakeholders and supporting fisheries micro and small enterprises through finance access, aquaculture-insurance incentives, performance grants, value-chain improvement and fish-product safety and quality systems.",
        "objective":"Help fisheries and aquaculture businesses understand the current PM-MKSSY formalisation and support routes, prepare NFDP registration and component evidence, and submit through the official Department of Fisheries or State/UT route.",
        "legal_basis":"Pradhan Mantri Matsya Kisan Samridhi Sah-Yojana approved as a Central Sector sub-scheme under PMMSY for FY 2023-24 to FY 2026-27; current operational guidelines, administrative approvals and Department of Fisheries notices prevail.",
        "eligibility":{"entity_types":["proprietorship","partnership_firm","private_limited_company","public_limited_company","llp","society","cooperative_society","federation","self_help_group","fish_farmers_producer_organisation","startup","individual_fisher","fish_farmer","fish_vendor","fish_worker"],"lifecycle_stages":["idea","operating","growth","market_expansion"],"industries":["fisheries","aquaculture","fish_processing","fish_retail","fish_vending","cold_chain","fish_feed","fish_seed","fish_value_chain"],"founder_categories":["fisher","fish_farmer","fish_worker","fish_vendor","women_entrepreneur","sc_st_entrepreneur"],"locations":["India"],"conditions":["the applicant is directly engaged in the fisheries or aquaculture value chain or is an eligible fisheries micro or small enterprise","the applicant registers as an individual or organisation on the National Fisheries Digital Platform through self-registration or assisted CSC registration","the requested component is available under current PM-MKSSY operational guidance and the applicant meets its component-specific verification and performance conditions","performance-grant applicants make the qualifying investment first and claim after the required post-verification and monitoring"],"thresholds":{"scheme_period_end_fy":"2026-27","working_capital_proposal_support_max_inr":5000,"aquaculture_insurance_general_incentive_percent":40,"aquaculture_insurance_general_max_per_hectare_inr":25000,"aquaculture_insurance_general_max_hectares":4,"aquaculture_insurance_intensive_incentive_percent":40,"aquaculture_insurance_intensive_max_inr":100000,"aquaculture_insurance_intensive_max_unit_cubic_metre":1800,"sc_st_women_additional_incentive_percent_of_payable_incentive":10},"exclusions":["the scheme outlay is not an applicant entitlement and performance-grant amounts are not inferred without the component guideline","no upfront subsidy is assumed for projects supported after post-verification","prior infrastructure may be excluded from project requirements","projects in or around conservation areas, wetlands or other negative-list locations may be excluded","working-capital access, insurance purchase and performance grants are separate benefit buckets and must not be added together","State/UT fisheries, environmental, labour, food-safety, coastal, aquaculture and local permissions may remain necessary"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://nfdp.dof.gov.in/nfdp/","route":"Register on NFDP as an individual or organisation through self-registration or assisted registration through a CSC, obtain the provisional certificate where applicable, then submit the component application through the official PM-MKSSY route and coordinate with the State/UT or District Fisheries Officer","fees":"No UdyamVeda fee or Government fee is assumed; confirm any current portal, CSC, insurance, certification or professional charges separately","selection":"Component-specific registration, verification, appraisal, monitoring and post-verification; State/UT fisheries authorities and Department of Fisheries routes may apply"},
        "fine_print":{"scheme_period":"FY 2023-24 to FY 2026-27; the period and any later continuation must be re-verified before recommendation","benefit_buckets":["NFDP formalisation and work-based identity","access to institutional finance and working-capital proposal preparation","one-time aquaculture insurance incentive after policy purchase","performance grants for value-chain efficiency and job creation","performance grants for fish-product safety and quality assurance"],"post_verification":"The official framework states that projects/proposals are supported after post-verification and that no upfront subsidies are given; applicants may need to invest first and claim after verification and monitoring","nfdp":"NFDP supports self-registration or assisted registration through CSC and can provide a provisional certificate for subsequent application steps","working_capital_support":"The framework describes financial support up to Rs. 5,000 for successful approval of a bankable loan proposal under the formalisation/credit-access component; this must not be represented as a loan or grant ceiling for the enterprise","insurance":"The framework describes a one-time incentive for aquaculture insurance: 40% of premium subject to component-specific caps, including a general farm cap of Rs. 25,000 per hectare up to 4 hectares, and intensive-system cap of Rs. 1 lakh for a unit up to 1,800 cubic metres; SC, ST and women beneficiaries may receive an additional 10% of the payable incentive","performance_grants":"Performance grants depend on transparent, measurable outcomes such as value-chain expansion, jobs with priority for women, reduced fish loss, energy efficiency, renewables, hygiene, waste management, safety and traceability; no universal percentage or ceiling is assumed","current_source_reconciliation":"Department of Fisheries materials checked on 7 September 2026 include the PM-MKSSY framework, official brochure, NFDP route and the revised 2025 operational framework. The scheme remains active through FY 2026-27 at the framework level, while component windows, verification and State/UT routes remain review-gated.","review_note":"Confirm the current PM-MKSSY operational guideline, NFDP registration and provisional-certificate flow, component availability, State/UT route, performance metrics, post-verification, insurance product, caps, negative list, grievance route and FY 2026-27 continuation before approval."},
        "benefit_summary":{"types":["grant","compliance","loan","non_financial_support"],"summary":"Separate formalisation, finance-access, aquaculture-insurance and post-verification performance-grant routes for eligible fisheries stakeholders and micro/small enterprises; amounts, selection and component availability are not universal.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"PM-MKSSY fisheries formalisation and performance-support route",
        "benefit_conditions":{"nfdp_registration_required":true,"fisheries_value_chain_required":true,"component_specific_rules_apply":true,"post_verification_required":true,"prior_investment_may_be_required":true,"no_upfront_subsidy_assumed":true,"no_guaranteed_amount":true},
        "requirement":"Fisheries value-chain identity, NFDP registration and component evidence",
        "requirement_description":"Prepare fisheries or aquaculture activity proof, entity and beneficiary identity, NFDP registration/provisional certificate, business and bankable-project evidence, insurance or investment records where applicable, jobs/value-chain/safety outcomes and current State/UT permissions.",
        "rules":{"all":[{"field":"fisheries_value_chain_activity","operator":"equals","value":true},{"field":"nfdp_registration_completed","operator":"equals","value":true},{"field":"pm_mkssy_component_identified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the PM-MKSSY component","description":"Separate formalisation and credit access, aquaculture insurance, value-chain performance grant and fish-product safety/quality routes before estimating any benefit.","url":"https://www.dof.gov.in/static/uploads/2025/09/db9e0987df6461b69304fe4115aceec9.pdf"},{"title":"Register on NFDP","description":"Register as an individual or organisation on the official National Fisheries Digital Platform through self-registration or the assisted CSC route and retain the provisional certificate or acknowledgement.","url":"https://nfdp.dof.gov.in/nfdp/"},{"title":"Prepare the component evidence","description":"Prepare business, fisheries activity, entity, investment, insurance, bankable proposal, safety/quality, jobs and verification evidence required by the current operational route.","url":"https://pmmkssy.dof.gov.in/pmmkssy/"},{"title":"Coordinate with the fisheries authority","description":"Confirm the State/UT or District Fisheries Officer, current component window, technical appraisal, monitoring and any local permissions before submission.","url":"https://pmmsy.dof.gov.in/contact-us"},{"title":"Submit and complete verification","description":"Use the official PM-MKSSY route, complete post-verification and reporting, and retain the approval, claim, insurance and performance records separately.","url":"https://nfdp.dof.gov.in/nfdp/"}],
        "window_type":"fixed",
        "window_label":"The cited PM-MKSSY scheme period runs through FY 2026-27; component availability, application deadlines and any continuation require current official confirmation.",
        "window_evidence":{"source_url":"https://dof.gov.in/sites/default/files/2024-12/PMMKSSY_compressed.pdf","anchor":"Official brochure: Central Sector sub-scheme period FY 2023-24 to FY 2026-27 in all States/Union Territories"},
        "review_note":"Confirm the current FY 2026-27 operational route and component-level terms before publication. Do not present PM-MKSSY outlay, performance grants, insurance incentives or working-capital support as a guaranteed combined value."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Fisheries, Animal Husbandry and Dairying', 'Department of Fisheries', item->>'authority_url')
    returning id into authority_id;
    else
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.86, 0.84, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select id into version_id from public.opportunity_versions where opportunity_id = seed_opportunity_id and version_number = 1 limit 1;
    end if;
    update public.opportunities
       set current_version_id = version_id,
           status = coalesce(item->>'lifecycle_status', 'in_review')
     where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://pmmsy.dof.gov.in/', 'implementing_portal', 'Department of Fisheries PMMSY portal', 'PM-MKSSY portal and current fisheries enterprise context', now(), false)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://nfdp.dof.gov.in/nfdp/', 'implementing_portal', 'National Fisheries Digital Platform', 'Self-registration and assisted CSC registration route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://pmmkssy.dof.gov.in/pmmkssy/', 'implementing_portal', 'PM-MKSSY operational-guideline route', 'Operational guideline and component route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://dof.gov.in/sites/default/files/2025-11/Revised_RFP_InternalAudit.pdf', 'guideline', 'PM-MKSSY revised operational framework', 'Operational guidelines and component structure, pages 70 onward', now(), false)
    on conflict do nothing;
    update public.opportunity_sources
      set page_number = 9, section = 'Objectives and targeted beneficiaries', paragraph = '1.2', document_anchor = 'Pages 9-13: NFDP, credit access, insurance, performance grants and exclusions'
      where opportunity_version_id = version_id and source_url = item->>'source_url';

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'other', item->>'requirement', item->>'requirement_description', true)
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
