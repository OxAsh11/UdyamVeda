-- BIRAC biotech industry-support records from current official pages and
-- guidelines. SBIRI and BIPP stay separate because their stage, funding,
-- applicant and royalty rules are materially different.

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
        "slug":"birac-sbiri-small-business-innovation-research-initiative",
        "name":"BIRAC Small Business Innovation Research Initiative (SBIRI)",
        "type":"research_grant",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://birac.nic.in/sbiri.php",
        "source_url":"https://birac.nic.in/webcontent/1745298212_SBIRI_scheme_guidelines_16_04_2025.pdf",
        "source_kind":"guideline",
        "source_title":"SBIRI Complete Scheme Document including Proposal Submission, Evaluation and Review Guidelines",
        "source_anchor":"Eligibility and Funding Guidelines: startup age, prior BIRAC grant, grant structure, milestones and royalty",
        "summary":"Early-stage BIRAC support for Indian biotech companies and LLPs developing high-risk products or processes from pre-proof-of-concept toward validation and commercialisation.",
        "objective":"Strengthen private biotech R&D, support indigenous technologies with societal relevance and help science-led businesses build products and processes with academic or public-research linkages.",
        "legal_basis":"BIRAC Small Business Innovation Research Initiative under the Department of Biotechnology, Ministry of Science and Technology.",
        "eligibility":{"entity_types":["company","llp","section_8_company","startup","industry_academic_consortium"],"lifecycle_stages":["research","proof_of_concept","prototype","validation"],"industries":["biotechnology","biomedical","life_sciences","healthcare","food_nutrition","agriculture_biotechnology","industrial_biotechnology"],"locations":["India"],"conditions":["a Company or LLP incorporated in India is the applicant or collaborator","the startup is less than 10 years old at call closure for the startup-specific first-time-BIRAC route","the applicant satisfies the Indian ownership and partner conditions","the applicant has adequate in-house project capability or is incubated at a recognised facility","the project is eligible biotechnology R&D and the required proposal and regulatory evidence is prepared"],"thresholds":{"startup_age_at_call_closure_years":10,"first_time_startup_grant_cap_inr":5000000,"first_time_startup_below_cap_assistance_percent":100,"first_time_startup_above_cap_assistance_percent":70,"other_company_max_assistance_percent":70,"other_company_min_contribution_percent":30,"minimum_indian_company_shareholding_percent":51},"unknown_handling":"needs_information"},
        "exclusions":["a sole individual application outside an eligible company, LLP or approved collaborator route","projects outside biotechnology or the current BIRAC scope","duplicate funding for the same or substantially similar proposal","companies or collaborators with unresolved prior BIRAC defaults, unspent balances or royalty obligations","startup-age or prior-BIRAC-support status treated as known without documentary evidence"],
        "application":{"portal":"https://birac.nic.in/sbiri.php","route":"Register the company or LLP on the BIRAC portal, check the active SBIRI call, prepare the online proposal and supporting company/institution documents, and submit before the call closes","selection":"Eligibility screening, technical and commercial evaluation, expert review, due diligence, approval and milestone-linked grant disbursement","fees":"Confirm the current BIRAC call and portal instructions; no fee entitlement is inferred from the scheme record","current_portal_context":{"scheme_directory":"https://birac.nic.in/desc_new.php?id=591","current_calls_page":"https://www.birac.nic.in/cfp.php","submission_guide":"https://www.birac.nic.in/howtoSubmitProposal.php","current_call_status":"Current BIRAC calls page checked 2026-09-08; no active SBIRI item was visible in the current-call list. The recurring route remains documented, but no current deadline should be shown without a call notice."},"applicant_note":"UdyamVeda can prepare the proposal checklist and evidence map but cannot register the applicant, store credentials, submit confidential R&D material or represent BIRAC."},
        "fine_print":{"funding":"The 2025 guideline gives a first-time BIRAC-grant startup below Rs. 50 lakh proposed budget up to 100% grant-in-aid, and for a proposed budget of Rs. 50 lakh or more, Rs. 50 lakh plus up to 70% of the excess. Other companies and previously funded startups are subject to a maximum 70% BIRAC contribution and at least 30% entity contribution.","project_cost":"The guideline states there is no ceiling on total project cost; the first-time-startup Rs. 50 lakh figure is a contribution cap for that track, not a total project cap.","disbursement":"Release is milestone based; the company must put in its contribution before each BIRAC instalment and the final instalment is reimbursement after project completion.","royalty":"The 2025 guideline states 5% royalty on annual net sales until the prescribed recovery condition, with a higher rate for distinct products in the specified circumstances; transfer or sale requires the stated BIRAC permission route.","legacy_conflict":"The older public SBIRI page also describes Phase I/II soft-loan language. Reconcile that legacy page against the 2025 complete scheme document and any current call before publishing a loan benefit or displaying old Phase II ceilings.","current_birac_facts":{"official_sources_checked":"2026-09-08","current_scheme_directory":"https://birac.nic.in/desc_new.php?id=591","current_calls_page":"https://www.birac.nic.in/cfp.php","current_call_status":"No active SBIRI call was visible in the current-call list at audit; previous SBIRI call evidence is historical and the next recurring period requires a new call notice.","next_published_recurring_period":"15 October-30 November is the next recurring period after the 8 September 2026 audit, but it is not a confirmed deadline until BIRAC publishes the call notice.","submission_guide_last_updated":"2026-09-07"},"review_note":"Confirm the active call, exact applicant form, ownership evidence, startup-age calculation, prior BIRAC support, eligible cost heads, regulatory approvals, IP, milestone, recovery, royalty and any amendment before approval."},
        "benefit_summary":{"types":["grant_in_aid","prototype_support","industry_academia_collaboration"],"summary":"Potential milestone-linked SBIRI grant-in-aid for eligible biotech companies and LLPs; assistance depends on applicant track, prior BIRAC support and proposed entity budget. Do not combine grant, contribution or legacy loan language into one value.","separate_value_buckets":true},
        "benefit_type":"grant_in_aid",
        "benefit_label":"BIRAC SBIRI biotech R&D grant-in-aid",
        "amount_max":5000000,
        "benefit_conditions":{"first_time_startup_track_cap_inr":5000000,"track_specific_assistance":true,"milestone_disbursement":true,"applicant_contribution_required_for_relevant_tracks":true,"royalty_or_recovery_conditions_apply":true},
        "requirement":"Biotechnology R&D proposal with applicant and funding-track evidence",
        "requirement_description":"Prepare incorporation/LLP documents, Indian ownership evidence, prior BIRAC-support declaration, project plan, preliminary data or PoC evidence, team and facility details, budget, milestones, regulatory/IP plan and required company or institution documents.",
        "rules":{"all":[{"field":"eligible_birac_company_or_llp","operator":"equals","value":true},{"field":"biotechnology_rd_project","operator":"equals","value":true},{"field":"sbiri_applicant_track_verified","operator":"equals","value":true},{"field":"milestone_and_contribution_plan_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the current SBIRI call","description":"Review the BIRAC SBIRI page for the active call, current dates, scheme documents and proposal route.","url":"https://birac.nic.in/sbiri.php"},{"title":"Prepare company and project evidence","description":"Assemble the required company, ownership, team, facility, technical, budget, milestone, IP and regulatory evidence.","url":"https://www.birac.nic.in/docRequired.php?type=c"},{"title":"Submit the online proposal","description":"Register or log in through BIRAC and submit the proposal during the active call; UdyamVeda must not handle BIRAC credentials or confidential submissions.","url":"https://www.birac.nic.in/howtoSubmitProposal.php"}],
        "window_type":"recurring",
        "window_label":"The official SBIRI page lists three recurring call windows each year: 15 February-31 March, 15 June-31 July and 15 October-30 November. Confirm the current call notice and any changed dates before presenting a deadline.",
        "window_evidence":{"source_url":"https://birac.nic.in/sbiri.php","anchor":"Call for proposals: three call windows in a year"},
        "review_note":"Current call status, date changes, applicant-form version and the apparent legacy-page funding conflict require human review."
      },
      {
        "slug":"birac-bipp-biotechnology-industry-partnership-programme",
        "name":"BIRAC Biotechnology Industry Partnership Programme (BIPP)",
        "type":"advanced_research_grant",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in/",
        "canonical_url":"https://www.birac.nic.in/bipp.php?scheme=1",
        "source_url":"https://www.birac.nic.in/webcontent/1729751884_BIPP_scheme_guidelines_revised.pdf",
        "source_kind":"guideline",
        "source_title":"BIPP Complete Scheme Document including Proposal Submission, Evaluation and Review Guidelines",
        "source_anchor":"Scope, TRL, eligibility, funding/cost sharing, milestone disbursement, royalty and Category IV facility rules",
        "summary":"Advanced BIRAC cost-sharing support for high-risk, transformational biotechnology research, validation, clinical or field trials and enabling facilities led by Indian companies or LLPs.",
        "objective":"Support high-risk, novel and commercially or nationally relevant biotechnology development that moves toward validation and commercialisation, with IP ownership retained by Indian industry where applicable.",
        "legal_basis":"BIRAC Biotechnology Industry Partnership Programme under the Department of Biotechnology, Ministry of Science and Technology.",
        "eligibility":{"entity_types":["company","llp","industry_academic_consortium","research_institution_collaborator"],"lifecycle_stages":["advanced_research","validation","clinical_trial","field_trial","commercialisation"],"industries":["biotechnology","pharmaceuticals","vaccines","biosimilars","stem_cells","medical_devices","diagnostics","agriculture_biotechnology","bioenergy","industrial_biotechnology","bioinformatics"],"locations":["India"],"conditions":["the applicant is an Indian company or LLP or an eligible consortium with an academic/research collaborator","at least 51% of company shares are held by Indian citizens, or the applicable LLP partner condition is met","the applicant has adequate in-house capability or is incubated at a recognised facility","the proposal is high-risk and transformational rather than incremental development","the project ends at TRL 7 or above for the advanced technology route and fits a BIPP category","the applicant is not in a disqualifying default, duplicate-funding or prior-project irregularity state"],"thresholds":{"minimum_indian_company_shareholding_percent":51,"target_end_trl":7,"standard_birac_contribution_percent":50,"phase_three_clinical_or_ag_field_trial_max_assistance_percent":75,"category_iv_max_support_inr":250000000,"royalty_percent_on_net_sales":7,"royalty_recovery_multiple":1.2},"unknown_handling":"needs_information"},
        "exclusions":["incremental or routine product development without transformational technology or novel IP","applicants outside eligible Indian company/LLP or collaborator routes","projects with unresolved BIRAC defaults, unspent balances or royalty obligations","duplicate funding for the same or substantially similar proposal","clinical, agriculture or facility claims presented without the required regulatory, site, collaborator and category evidence","the Category IV facility ceiling treated as a general project entitlement"],
        "application":{"portal":"https://www.birac.nic.in/bipp.php?scheme=1","route":"Register the company or LLP, identify the current BIPP call/category, prepare the technical, IP, regulatory, financial and collaborator dossier, and submit online during the active call","selection":"Eligibility screening, area review panel, technical/IP/regulatory and financial due diligence, expert committee review, Apex Committee decision and milestone monitoring","fees":"Confirm current BIRAC portal instructions and any project-specific regulatory, testing or professional costs","current_portal_context":{"scheme_directory":"https://birac.nic.in/desc_new.php?id=591","current_scheme_directory_legacy_page":"https://www.birac.nic.in/desc_new.php?id=65","current_calls_page":"https://www.birac.nic.in/cfp.php","submission_guide":"https://www.birac.nic.in/howtoSubmitProposal.php","current_call_status":"Current BIRAC calls page checked 2026-09-08; no active BIPP item was visible in the current-call list. The recurring route remains documented, but no current deadline should be shown without a call notice."},"applicant_note":"UdyamVeda can help map TRL, milestones, regulatory evidence and cost sharing but cannot submit confidential BIRAC material or promise approval."},
        "fine_print":{"scope":"BIPP covers high-risk, transformational work across categories including socially relevant or uncertain-market research, globally competitive discovery, clinical trials, agriculture field trials and shared major facilities.","funding":"The revised guideline provides up to 50% of company/LLP project cost as grant-in-aid with the remaining cost met by the company/LLP; Phase III clinical trials or agriculture field trials with high innovation and national relevance may receive up to 75% for eligible in-India trial cost. Categories I-III have no stated general funding cap, but costs must be commensurate with supported activity.","royalty":"The 2024 revised guideline states a 7% annual net-sales royalty until 1.2 times the grant amount is reached, with distinct-product and transfer conditions; Category IV has separate facility and royalty rules.","disbursement":"Funds are milestone based and released in 3-4 instalments after agreement, technical milestones and completion reporting; site visits, project reports, due diligence and regulatory evidence can control release.","category_iv":"Category IV shared facilities have a maximum support reference of Rs. 25 crore and separate cost-sharing, access, governance and facility conditions; it is not a general applicant grant ceiling.","legacy_portal_conflict":"The current BIPP directory page at desc_new.php?id=65 describes both soft loan and grant, while the revised BIPP guideline is the controlling funding source for this dossier. Do not publish soft-loan language until the conflict is reconciled by a reviewer.","current_birac_facts":{"official_sources_checked":"2026-09-08","current_scheme_directory":"https://birac.nic.in/desc_new.php?id=591","current_scheme_directory_legacy_page":"https://www.birac.nic.in/desc_new.php?id=65","current_calls_page":"https://www.birac.nic.in/cfp.php","current_call_status":"No active BIPP call was visible in the current-call list at audit; previous BIPP call evidence is historical and the next recurring period requires a new call notice.","next_published_recurring_period":"15 October-30 November is the next recurring period after the 8 September 2026 audit, but it is not a confirmed deadline until BIRAC publishes the call notice.","submission_guide_last_updated":"2026-09-07"},"review_note":"Confirm current call/category, priority themes, end-TRL, company/LLP ownership, collaborator accreditation, project cost, in-India trial scope, regulatory approvals, IP, royalty, recovery, facility and milestone conditions before approval."},
        "benefit_summary":{"types":["advanced_research_grant","cost_sharing","clinical_trial_support","facility_support"],"summary":"Potential BIPP grant-in-aid and cost-sharing support for eligible high-risk biotech projects, with category-specific clinical/field-trial and facility rules. The applicant contribution, royalty and milestone obligations must be shown separately.","separate_value_buckets":true},
        "benefit_type":"advanced_research_grant",
        "benefit_label":"BIRAC BIPP advanced biotechnology cost-sharing support",
        "benefit_conditions":{"standard_assistance_percent_cap":50,"category_specific_trial_assistance_may_reach_percent":75,"novel_ip_required":true,"milestone_disbursement":true,"royalty_conditions_apply":true,"category_iv_separate_rules":true},
        "requirement":"Transformational biotech project with TRL, cost-sharing, IP and regulatory evidence",
        "requirement_description":"Prepare company/LLP and Indian ownership documents, technical and preliminary data, end-TRL plan, novel-IP and commercialization evidence, collaborator accreditation, regulatory path, detailed budget, applicant contribution, milestones and required declarations.",
        "rules":{"all":[{"field":"eligible_birac_company_or_llp","operator":"equals","value":true},{"field":"transformational_biotech_project","operator":"equals","value":true},{"field":"target_end_trl_at_least_7","operator":"equals","value":true},{"field":"bipp_cost_sharing_and_regulatory_plan_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the BIPP category and call","description":"Review the current BIPP page, call notice and seven broad themes; identify whether the proposal is Category I/II, III-A, III-B or IV.","url":"https://www.birac.nic.in/bipp.php?scheme=1"},{"title":"Prepare technical and compliance dossier","description":"Document novelty, TRL, preliminary data, collaborator, IP, regulatory, budget, milestones, cost sharing and site/facility evidence.","url":"https://www.birac.nic.in/webcontent/1729751884_BIPP_scheme_guidelines_revised.pdf"},{"title":"Submit during the active call","description":"Use the BIRAC proposal route and submit the category-specific proforma and supporting documents before the call closes.","url":"https://www.birac.nic.in/howtoSubmitProposal.php"}],
        "window_type":"recurring",
        "window_label":"The official BIPP page lists three recurring call windows each year: 15 February-31 March, 15 June-31 July and 15 October-30 November. Confirm the active call, category and current dates before presenting a deadline.",
        "window_evidence":{"source_url":"https://www.birac.nic.in/bipp.php?scheme=1","anchor":"Call for proposals: three call windows launched in a year"},
        "review_note":"Current call, category-specific proforma, updated funding/royalty terms and any amendment require human review."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Biotechnology', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://birac.nic.in/', 'agency_portal', 'BIRAC official portal', 'Implementing-agency portal and registration route', now(), false),
      (version_id, 'https://www.birac.nic.in/howtoSubmitProposal.php', 'application_guide', 'BIRAC proposal submission guide', 'Submission process and required documents', now(), false),
      (version_id, 'https://www.birac.nic.in/docRequired.php?type=c', 'document_checklist', 'BIRAC company proposal document checklist', 'Company and institution documents', now(), false)
    on conflict do nothing;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'research', item->>'requirement', item->>'requirement_description', true
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
