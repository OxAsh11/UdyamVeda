-- RKVY-RAFTAAR agripreneurship routes. These records are review-gated because
-- access is through participating R-ABIs and cohort windows, not one universal
-- national founder application.

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
        "slug":"pm-rkvy-raftaar-navodaya-agripreneurship-orientation",
        "name":"RKVY-RAFTAAR NAVODAYA Agripreneurship Orientation",
        "type":"grant",
        "status":"active",
        "authority":"Department of Agricultural Research and Education (DARE)",
        "authority_url":"https://dare.gov.in/",
        "canonical_url":"https://www.ivri.nic.in/Rabi/navodaya.aspx",
        "source_url":"https://www.ivri.nic.in/Rabi/navodaya.aspx",
        "source_kind":"agency",
        "source_title":"ICAR-IVRI R-ABI NAVODAYA programme",
        "source_anchor":"Programme description and eligibility: Indian citizen, innovative agriculture/allied idea, pre-seed market-fit/PoC/prototype condition, two-month training, stipend and grant-in-aid",
        "summary":"Cohort-based RKVY-RAFTAAR orientation and incubation-entry route for Indian citizens developing innovative agriculture or allied-sector ideas through a participating R-ABI.",
        "objective":"Help prospective agripreneurs refine an agriculture or allied-sector idea through training and hands-on incubation, with a possible stipend and idea-stage grant after selection.",
        "legal_basis":"RKVY-RAFTAAR Innovation and Agri-Entrepreneurship Cell operational guidelines and the current ICAR-IVRI R-ABI NAVODAYA programme page; the participating R-ABI notice and current cohort terms control the live application.",
        "eligibility":{"entity_types":["indian_citizen","aspiring_agripreneur","student","youth","smart_farmer","pre_seed_entrepreneur"],"lifecycle_stages":["idea","pre_seed","prototype"],"industries":["agriculture","animal_science","animal_husbandry","dairy","fisheries","food_and_agri_value_chain","agri_services","rural_technology"],"locations":["India","participating_r_abi_location"],"conditions":["applicant must propose one innovative technology, service, business-platform or business-model idea that improves agriculture or an allied sector","applicant must intend to pursue the entrepreneurial activity and follow the participating R-ABI programme","pre-seed incubatees must have market fit, proof of concept or prototype evidence before funds are recommended and the MoU is signed","before release of funds, the incubatee must satisfy the applicable current startup-definition and R-ABI conditions","selection is made by the R-ABI incubation or selection committee and is not automatic from submission"],"thresholds":{"training_period_months":2,"stipend_per_month_inr":10000,"idea_grant_max_inr":500000,"idea_grant_share_max_percent":90},"unknown_handling":"needs_information"},
        "exclusions":["not a guaranteed grant for every idea or applicant","the stipend and grant are separate, selection-dependent benefits and must not be added into one guaranteed value","the official IVRI page currently shows its named cohort applications closed; a different R-ABI may have a separate notice and deadline","the ₹5 lakh figure is an upper limit/reference for the idea-stage route, not an automatic sanction","registration, incorporation, milestone, contribution, MoU, reporting and non-duplication conditions must be confirmed for the current cohort"],
        "application":{"portal":"https://www.ivri.nic.in/Rabi/navodaya.aspx","route":"Find a participating R-ABI or Knowledge Partner with a live NAVODAYA or equivalent RKVY-RAFTAAR orientation notice, submit the prescribed idea/application, complete the training and incubation selection process, and retain the committee, MoU and milestone records.","selection":"The participating R-ABI evaluates the idea and applicant; grant recommendations require the applicable committee and nodal-division process.","fees":"No applicant fee is stated on the reviewed official programme page; any cohort-specific fee, contribution or incubation terms must be verified from the live notice.","applicant_note":"UdyamVeda may explain the route and prepare an idea/document checklist, but must not claim to be an R-ABI or submit an applicant’s proposal without authorization."},
        "fine_print":{"benefit_separation":"The current IVRI description states a stipend of INR 10,000 per month during training and grant-in-aid up to INR 5 lakh upon selection; these are different stages and not a single guaranteed payout.","training":"The legacy operational guideline describes a two-month training-cum-internship and selection of agripreneurs with workable innovative ideas; the current participating R-ABI notice controls the cohort format.","route":"RKVY-RAFTAAR access is mediated by participating R-ABIs/Knowledge Partners. There is no evidence here of a universal direct-to-Ministry founder portal.","current_window":"IVRI’s current page labels the named NAVODAYA cohort applications closed; other R-ABIs and future cohorts require separate official notice verification.","review_note":"Before publication, verify the current PM-RKVY/RKVY-RAFTAAR continuation, R-ABI list, cohort opening, applicant form, training duration, stipend, contribution, grant ceiling, committee route, startup-recognition timing and non-duplication conditions."},
        "benefit_summary":{"types":["grant","training"],"summary":"Selected agripreneurs may receive a cohort-specific training stipend and later idea-stage grant-in-aid through a participating R-ABI; amounts and availability are separate and selection-dependent.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Idea-stage RKVY-RAFTAAR grant up to INR 5 lakh after the orientation route",
        "amount_max":500000,
        "percentage":90,
        "benefit_conditions":{"idea_grant_max_inr":500000,"idea_grant_share_max_percent":90,"stipend_per_month_inr":10000,"training_period_months":2,"selection_required":true,"cohort_window_required":true},
        "requirement":"Innovative agriculture/allied-sector idea and participating R-ABI selection",
        "requirement_description":"Provide an idea proposal, citizenship and applicant records, market-fit/PoC/prototype evidence where required, full-time entrepreneurship intent, training participation, startup or entity evidence before fund release, and current R-ABI forms and declarations.",
        "rules":{"all":[{"field":"innovative_agriculture_or_allied_idea_verified","operator":"equals","value":true},{"field":"participating_r_abi_current_route_verified","operator":"equals","value":true},{"field":"applicant_and_startup_conditions_verified","operator":"equals","value":true},{"field":"current_cohort_window_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Find a current R-ABI cohort","description":"Check the official ICAR/DARE implementing-agency pages and participating R-ABI notices; do not infer that one incubator’s closed cohort is open nationally.","url":"https://www.ivri.nic.in/Rabi/Default2.aspx"},{"title":"Prepare the agripreneurship idea","description":"Describe the agriculture/allied problem, solution, business model, beneficiaries, market evidence, prototype or PoC and intended milestones.","url":"https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf"},{"title":"Complete orientation and selection","description":"Follow the current R-ABI training, incubation, committee presentation and recommendation route; preserve any MoU and selection decision.","url":"https://www.ivri.nic.in/Rabi/navodaya.aspx"},{"title":"Track milestone-linked support","description":"If selected, track the stipend, grant agreement, contribution, milestones, utilisation evidence and final reporting separately.","url":"https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf"}],
        "window_type":"rolling",
        "window_label":"R-ABI cohort-dependent; current IVRI NAVODAYA cohort is shown as closed and no universal national deadline is asserted.",
        "window_evidence":{"source_url":"https://www.ivri.nic.in/Rabi/navodaya.aspx","anchor":"Current programme page shows NAVODAYA eligibility and funding description; named cohort availability must be checked from the live page or another participating R-ABI notice."},
        "review_note":"Keep review-gated. This record is a route-discovery and readiness record until a current R-ABI cohort, form and deadline are verified."
      },
      {
        "slug":"pm-rkvy-raftaar-samriddhi-startup-incubation",
        "name":"RKVY-RAFTAAR SAMRIDDHI Startup Agribusiness Incubation",
        "type":"grant",
        "status":"active",
        "authority":"Department of Agricultural Research and Education (DARE)",
        "authority_url":"https://dare.gov.in/",
        "canonical_url":"https://www.ivri.nic.in/Rabi/samridhi.aspx",
        "source_url":"https://www.ivri.nic.in/Rabi/samridhi.aspx",
        "source_kind":"agency",
        "source_title":"ICAR-IVRI R-ABI SAMRIDDHI programme",
        "source_anchor":"Programme description and eligibility: MVP-ready animal-science/allied start-ups, registered Indian legal entity, DPIIT start-up definition, one-time subsequent-round restriction and grant-in-aid up to INR 25 lakh",
        "summary":"Cohort-based RKVY-RAFTAAR agribusiness incubation route for Indian DPIIT-recognized start-ups with an MVP ready for commercialisation in animal science and allied sectors.",
        "objective":"Provide selected agribusiness start-ups with incubation, technical and business support, networking and possible grant-in-aid to scale an MVP toward commercialisation.",
        "legal_basis":"RKVY-RAFTAAR Innovation and Agri-Entrepreneurship Cell operational guidelines and the current ICAR-IVRI R-ABI SAMRIDDHI programme page; the current R-ABI notice and committee decision control the live case.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","company","limited_liability_partnership","registered_legal_entity"],"lifecycle_stages":["mvp","validation","commercialisation","scaling"],"industries":["animal_science","animal_husbandry","veterinary","dairy","livestock","fisheries","agri_biotechnology","agri_services","food_and_agri_value_chain"],"locations":["India","participating_r_abi_location"],"conditions":["the applicant must be a registered legal entity in India","the applicant must meet the current Indian start-up definition referenced by the programme","the product, service, business process or model must be an innovative agriculture/allied solution with an MVP ready for commercialisation","the start-up must be admitted to or supported by the relevant R-ABI and satisfy the incubation committee’s performance evaluation","a start-up supported once is not eligible for a subsequent round of seed support through any R-ABI under the stated programme condition"],"thresholds":{"grant_in_aid_max_inr":2500000,"mvp_required":true,"registered_indian_legal_entity_required":true},"unknown_handling":"needs_information"},
        "exclusions":["not a guaranteed INR 25 lakh grant or investment","the upper amount is subject to committee selection, genuine requirement, milestones and current programme terms","the IVRI page currently shows the named SAMRIDDHI cohort applications closed; other R-ABIs may have different notices","Indian subsidiaries of MNCs/foreign companies are excluded by the official programme page","prior RKVY-RAFTAAR support may prevent a subsequent round; current duplicate-support and grant-disclosure rules must be reconciled"],
        "application":{"portal":"https://www.ivri.nic.in/Rabi/samridhi.aspx","route":"Find a participating R-ABI with a current SAMRIDDHI or equivalent RKVY-RAFTAAR incubation notice, submit the start-up and MVP evidence, complete incubation and committee evaluation, and execute the current grant/MoU route if selected.","selection":"The R-ABI incubation committee evaluates incubatee performance and recommends selected start-ups; the applicable nodal and committee process controls sanction and release.","fees":"No applicant fee is stated on the reviewed official programme page; any current cohort fee, contribution or incubation charge must be verified.","applicant_note":"UdyamVeda may prepare the start-up, MVP, DPIIT-recognition and milestone checklist, but must not impersonate the applicant or promise grant approval."},
        "fine_print":{"support":"The official IVRI page describes incubation, expert, academic, networking and technical support plus grant-in-aid up to INR 25 lakh for selected start-ups.","selection":"The programme page states that all R-ABI incubatees are eligible for consideration based on consistent performance evaluated by the R-ABI Incubation Committee; selection is not automatic.","one_time_boundary":"A start-up supported once is not eligible to apply for the subsequent round of seed support to any R-ABI under the stated programme condition.","current_window":"IVRI’s current page labels the named SAMRIDDHI cohort applications closed; another R-ABI or a later cohort requires separate current-source verification.","review_note":"Before publication, verify the current PM-RKVY/RKVY-RAFTAAR continuation, participating R-ABI list, cohort notice, MVP definition, DPIIT-recognition timing, grant percentage/ceiling, contribution, milestone release, duplicate-support rule, reporting and current application form."},
        "benefit_summary":{"types":["grant","incubation","mentorship"],"summary":"Selected MVP-ready Indian agribusiness start-ups may receive R-ABI incubation and grant-in-aid up to the programme reference ceiling, subject to cohort availability, committee selection and milestone conditions.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"RKVY-RAFTAAR startup incubation grant-in-aid up to INR 25 lakh",
        "amount_max":2500000,
        "percentage":null,
        "benefit_conditions":{"grant_in_aid_max_inr":2500000,"mvp_required":true,"committee_selection_required":true,"participating_r_abi_required":true,"grant_not_guaranteed":true},
        "requirement":"Indian legal entity, DPIIT start-up status and commercialisation-ready MVP",
        "requirement_description":"Provide incorporation/legal-entity evidence, DPIIT start-up recognition or current recognition evidence, MVP/product and market materials, founder and ownership records, R-ABI admission, business plan, milestones, budget, prior-support declaration and current cohort documents.",
        "rules":{"all":[{"field":"registered_indian_legal_entity_verified","operator":"equals","value":true},{"field":"dpiit_startup_definition_verified","operator":"equals","value":true},{"field":"mvp_ready_for_commercialisation_verified","operator":"equals","value":true},{"field":"participating_r_abi_current_route_verified","operator":"equals","value":true},{"field":"current_cohort_window_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Find a current R-ABI incubation cohort","description":"Check the official ICAR/DARE implementing-agency pages and current R-ABI notices; the IVRI cohort page is evidence of the route, not proof that all cohorts are open.","url":"https://www.ivri.nic.in/Rabi/Default2.aspx"},{"title":"Verify legal entity and start-up status","description":"Prepare Indian incorporation/legal-entity records and current DPIIT recognition evidence or the exact current requirement before fund release.","url":"https://www.ivri.nic.in/Rabi/samridhi.aspx"},{"title":"Prepare MVP and commercialisation dossier","description":"Document the product/service, animal-science or allied-sector problem, MVP evidence, market, business model, milestones, budget and technical support needs.","url":"https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf"},{"title":"Complete R-ABI evaluation and agreement","description":"Follow incubation, committee evaluation, recommendation, grant agreement, milestone, utilisation and reporting requirements; retain the decision and all amendments.","url":"https://www.ivri.nic.in/Rabi/samridhi.aspx"}],
        "window_type":"rolling",
        "window_label":"R-ABI cohort-dependent; current IVRI SAMRIDDHI cohort is shown as closed and no universal national deadline is asserted.",
        "window_evidence":{"source_url":"https://www.ivri.nic.in/Rabi/samridhi.aspx","anchor":"Current programme page shows eligibility and grant description; named cohort availability must be checked from the live page or another participating R-ABI notice."},
        "review_note":"Keep review-gated. Do not show the INR 25 lakh reference as a guaranteed grant or treat a closed IVRI cohort as an open national application."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Agriculture and Farmers Welfare', 'Department of Agricultural Research and Education', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://www.ivri.nic.in/Rabi/Default2.aspx', 'implementing_agency', 'ICAR-IVRI R-ABI programme overview', 'R-ABI and programme context', now(), false),
      (version_id, 'https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf', 'guideline', 'RKVY-RAFTAAR operational guidelines', 'Innovation, incubation, seed-stage, orientation and idea/pre-seed components', now(), false),
      (version_id, 'https://www.manage.gov.in/managecia/RKVYProg.aspx', 'implementing_agency', 'MANAGE-CIA PM-RKVY agribusiness incubation page', 'Current PM-RKVY/R-ABI programme context; live route requires review', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'incubation', item->>'requirement', item->>'requirement_description', true
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
