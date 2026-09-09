-- Central MSME cluster, productivity and market-access records from official
-- Ministry/implementing-agency sources. These remain in_review until editorial
-- confirmation of current windows, routes and applicant-level terms.

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
        "slug":"micro-and-small-enterprises-cluster-development-programme",
        "name":"Micro and Small Enterprises Cluster Development Programme (MSE-CDP)",
        "type":"cluster_development",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Development Commissioner",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://www.my.msme.gov.in/MyMsme/Reg/COM_ClusterForm.aspx",
        "source_url":"https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf",
        "source_kind":"guideline",
        "source_title":"Modified Guidelines of MSE-CDP",
        "source_anchor":"Background; Objectives of the Scheme; Diagnostic Study; Soft Interventions; Common Facility Centres",
        "summary":"Cluster-based support for micro and small enterprises through diagnostic studies, soft interventions, common facility centres and industrial infrastructure projects.",
        "objective":"Improve the productivity, competitiveness, common infrastructure and capacity of MSE clusters through collective action and government grant support.",
        "legal_basis":"Micro and Small Enterprises Cluster Development Programme administered by the Office of the Development Commissioner (MSME)",
        "eligibility":{"entity_types":["micro","small","cluster_spv","state_government","msme_association"],"conditions":["proposal must concern an identifiable MSE cluster or eligible industrial area","cluster beneficiaries and implementing SPV or public proposal route must satisfy the current guidelines","state government, autonomous body or MSME field institute route may be required"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.my.msme.gov.in/MyMsme/Reg/COM_ClusterForm.aspx","route":"prepare a cluster proposal and use the current State Government, autonomous body or MSME-DFO route","applicant_note":"This is generally a collective or public-institution opportunity, not a direct individual-enterprise grant."},
        "fine_print":{"components":["diagnostic study reports","soft interventions","detailed project report","common facility centres","infrastructure development"],"diagnostic_study_grant_max_inr":250000,"soft_intervention_project_cost_max_inr":2500000,"soft_intervention_goi_grant_percent":75,"soft_intervention_ne_hill_or_special_cluster_grant_percent":90,"minimum_soft_intervention_units":25,"minimum_special_cluster_units":20,"cfc_minimum_mse_units":20,"cfc_special_case_minimum_units":10,"beneficiary_share_minimum_percent":10,"review_note":"Confirm the current funding pattern, CFC ceilings, State share, admissible project categories, SPV form and live proposal window against the latest official circulars before publication."},
        "benefit_summary":{"types":["grant","infrastructure_support","market_access"],"summary":"Government grant support for eligible cluster studies, collective interventions, common facilities and infrastructure; the benefit is normally project-level rather than a direct payment to one enterprise."},
        "benefit_type":"grant",
        "benefit_label":"Cluster diagnostic, common-facility and infrastructure grant support",
        "benefit_conditions":{"cluster_proposal_required":true,"collective_or_public_route_required":true,"current_guidelines_required":true},
        "requirement":"Eligible MSE cluster proposal and implementing body",
        "requirement_description":"The applicant must participate through an eligible cluster, SPV, State Government, autonomous body or MSME field-institute route with the required diagnostic/project documents.",
        "rules":{"all":[{"field":"cluster_or_collective_proposal","operator":"equals","value":true},{"field":"eligible_implementing_body","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Define the cluster and common problem","description":"Document the participating MSEs, products, geography or value chain, common gaps and intended collective outcome.","url":"https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf"},{"title":"Prepare the diagnostic study or project report","description":"Build the required DSR/DPR, action plan, milestones, beneficiary contribution and implementation structure.","url":"https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf"},{"title":"Use the current proposal route","description":"Submit through the current State Government, autonomous-body or MSME-DFO route and retain approvals and contribution evidence.","url":"https://www.my.msme.gov.in/MyMsme/Reg/COM_ClusterForm.aspx"}],
        "window_type":"rolling",
        "window_label":"Demand-driven proposals are subject to the current Ministry, State and project approval cycle; no universal applicant deadline is asserted.",
        "window_evidence":{"source_url":"https://msme.gov.in/sites/default/files/ModifiedGuidelinesofMSE.pdf","anchor":"Strategy and Approach; Application route"}
      },
      {
        "slug":"msme-competitive-lean-scheme",
        "name":"MSME Competitive (LEAN) Scheme",
        "type":"productivity_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - MSME Competitive LEAN",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://lean.msme.gov.in/Home/index",
        "source_url":"https://lean.msme.gov.in/Home/Eligibility",
        "source_kind":"agency",
        "source_title":"MSME Competitive LEAN Scheme - Coverage and Eligibility",
        "source_anchor":"Coverage & Eligibility",
        "summary":"A digital productivity and competitiveness pathway for Udyam-registered MSMEs using Lean pledge, handholding and Basic, Intermediate and Advanced levels.",
        "objective":"Improve productivity, efficiency and competitiveness by reducing waste and strengthening processes, quality and resource management.",
        "legal_basis":"MSME Competitive (LEAN) Scheme of the Ministry of Micro, Small and Medium Enterprises",
        "eligibility":{"entity_types":["micro","small","medium"],"conditions":["registered on the Udyam portal","Common Facility Centres under SFURTI and MSE-CDP may also be eligible","Lean pledge and level-specific implementation route apply"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://lean.msme.gov.in/Home/index","route":"register through the official LEAN platform, take the Lean Pledge and apply for the level of handholding required","implementing_agencies":["Quality Council of India","National Productivity Council"]},
        "fine_print":{"levels":["basic","intermediate","advanced"],"financial_assistance":{"implementation_cost_subsidy_percent":90,"additional_goi_contribution_percent_after_all_levels_for_industry_association_or_oem_route":5,"oem_or_association_completion_support_inr_per_msme":5000},"required_sequence":["LEAN registration","Lean Pledge","level implementation","assessment or completion evidence"],"review_note":"Confirm current consultant fees, level-specific evidence, registration workflow, incentive wording and whether all displayed assistance remains available before publication."},
        "benefit_summary":{"types":["subsidy","training","mentorship"],"summary":"Official LEAN participation, handholding and a stated subsidy on consultant implementation cost, subject to the current route, level and completion conditions."},
        "benefit_type":"subsidy",
        "benefit_label":"LEAN implementation-cost subsidy and handholding",
        "percentage":90,
        "benefit_conditions":{"udyam_required":true,"lean_pledge_required":true,"level_assessment_required":true},
        "requirement":"Udyam registration and Lean Pledge",
        "requirement_description":"An eligible MSME must register through the official LEAN platform and complete the pledge and level-specific implementation or assessment route.",
        "rules":{"all":[{"field":"udyam_registered","operator":"equals","value":true},{"field":"lean_pledge_completed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm Udyam eligibility","description":"Verify that the business has a current Udyam registration or that its eligible CFC route is applicable.","url":"https://lean.msme.gov.in/Home/Eligibility"},{"title":"Register and take the Lean Pledge","description":"Use the official platform and complete the required pre-commitment before selecting a level.","url":"https://lean.msme.gov.in/Home/SchemeLevels"},{"title":"Select the implementation level","description":"Choose Basic, Intermediate or Advanced handholding based on readiness and complete the required assessment evidence.","url":"https://lean.msme.gov.in/Home/SchemeComponents"}],
        "window_type":"rolling",
        "window_label":"The official platform provides an ongoing registration route; current consultant availability and incentives require verification.",
        "window_evidence":{"source_url":"https://lean.msme.gov.in/Home/Eligibility","anchor":"Coverage & Eligibility"}
      },
      {
        "slug":"nsic-consortia-and-tender-marketing-scheme",
        "name":"NSIC Consortia & Tender Marketing Scheme",
        "type":"market_access",
        "authority":"National Small Industries Corporation - Ministry of Micro, Small and Medium Enterprises",
        "authority_url":"https://www.nsic.co.in/",
        "canonical_url":"https://www.msme.gov.in/offerings",
        "source_url":"https://www.msme.gov.in/offerings",
        "source_kind":"ministry",
        "source_title":"Ministry of MSME Schemes and Services - Consortia & Tender Marketing Scheme",
        "source_anchor":"Consortia & Tender Marketing Scheme",
        "summary":"NSIC-supported collective participation for MSEs in bulk orders, government tenders and procurement opportunities with technical and market-access support.",
        "objective":"Improve the competitiveness and visibility of micro and small enterprises by aggregating supply and enabling participation in procurement opportunities.",
        "legal_basis":"Consortia & Tender Marketing Scheme implemented by NSIC under the Ministry of MSME",
        "eligibility":{"entity_types":["micro","small"],"conditions":["enterprise must meet the current NSIC scheme and tender requirements","consortia participation, product capability and tender-specific documents apply","procurement opportunity and bid terms control final eligibility"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.nsic.co.in/","route":"review the current NSIC tender/consortia route and the specific procurement notice before applying","applicant_note":"This is opportunity- and tender-specific support; it is not a guaranteed order or grant."},
        "fine_print":{"support_modes":["joint participation in bulk orders","government tender participation","technical support","financial assistance subject to current terms","aggregated supply capabilities"],"commercial_caution":"No order value, subsidy ceiling or award probability is inferred from the scheme title or the Ministry summary.","review_note":"Confirm current NSIC registration, fee, EMD/tender support, consortium formation, procurement eligibility, documentation and live notices against the relevant NSIC page or tender document before publication."},
        "benefit_summary":{"types":["market_access","procurement_support"],"summary":"Collective procurement and tender participation support through NSIC, with terms determined by the current NSIC route and individual procurement opportunity."},
        "benefit_type":"market_access",
        "benefit_label":"NSIC consortium and government-tender market access",
        "benefit_conditions":{"mse_route_required":true,"specific_tender_requirements_apply":true},
        "requirement":"Eligible MSE capability and tender documents",
        "requirement_description":"The business must satisfy the relevant NSIC and procurement notice requirements, including capability, registrations, declarations and any consortium conditions.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"tender_or_bulk_order_available","operator":"equals","value":true},{"field":"tender_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify a relevant procurement opportunity","description":"Find an active NSIC consortia, bulk-order or government-tender opportunity matching the business capability.","url":"https://www.nsic.co.in/"},{"title":"Check tender-specific eligibility","description":"Review the current notice, product specifications, registrations, bid security and consortium conditions.","url":"https://www.msme.gov.in/offerings"},{"title":"Submit through the official route","description":"Use the current NSIC or tender route and keep submission, clarification and award records.","url":"https://www.nsic.co.in/"}],
        "window_type":"event",
        "window_label":"Applications and deadlines are tied to individual NSIC or procurement notices; no universal deadline is asserted.",
        "window_evidence":{"source_url":"https://www.msme.gov.in/offerings","anchor":"Consortia & Tender Marketing Scheme"}
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
