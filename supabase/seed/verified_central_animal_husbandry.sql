-- Central animal-husbandry opportunities from current DAHD pages and
-- guidelines. These remain in_review because component terms, amendments,
-- state routes and current application windows require human confirmation.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DAHD National Livestock Mission official page', 'https://dahd.gov.in/schemes/programmes/national_livestock_mission', 'ministry_portal', 'central', 'weekly', 1, true, 'Current DAHD NLM page; entrepreneurship components, amendment status and dashboard route require review.'),
  ('National Livestock Mission guidelines', 'https://monitor.dahd.gov.in/files/home_doc/NLM_Book.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official NLM guideline source for assistance pattern, eligible entities, instalments and exclusions.'),
  ('National Livestock Mission current comprehensive guidelines', 'https://www.dahd.gov.in/sites/default/files/2026-04/NLMGuidelinesJan2025.pdf', 'guideline', 'central', 'weekly', 1, true, 'Current DAHD-hosted NLM guideline; reconcile component terms and amendments before publication.'),
  ('National Livestock Mission 2026 amended implementation guidance', 'https://dahd.gov.in/en/node/3986', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DAHD amendment notice; reviewer must reconcile it with the guideline before publication.'),
  ('National Livestock Mission 2026 amended guidelines PDF', 'https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official February 2026 amended NLM guideline; current component and species terms require reviewer confirmation.'),
  ('National Livestock Mission EDP dashboard', 'https://nlm.udyamimitra.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official application/dashboard handoff; current availability and state route require review.'),
  ('DAHD Animal Husbandry Infrastructure Development Fund official page', 'https://dahd.gov.in/schemes/programmes/ahidf', 'ministry_portal', 'central', 'weekly', 1, true, 'Current DAHD AHIDF page; continuation, eligible activities and portal route require review.'),
  ('AHIDF operational guidelines', 'https://www.dahd.gov.in/sites/default/files/2023-11/ImplementationGuidelinesAHIDF.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official AHIDF operational guideline source for loan share, contribution and eligible infrastructure.'),
  ('AHIDF lender SOP', 'https://dahd.gov.in/sites/default/files/2023-07/RevisedSOPforAHIDF2ndNov2022.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official lender SOP for interest subvention, repayment, exclusions and credit guarantee.'),
  ('AHIDF FAQ', 'https://www.dahd.gov.in/sites/default/files/2023-11/FAQ.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official FAQ for interest-subvention ceiling, repayment and ineligible beneficiaries.'),
  ('AHIDF application portal', 'https://ahidf.udyamimitra.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official loan application handoff; current window and portal operation require review.'),
  ('AHIDF current DAHD page', 'https://www.dahd.gov.in/schemes/programmes/ahidf', 'ministry_portal', 'central', 'weekly', 1, true, 'Current official AHIDF page; cited outlay period ended 31 March 2026 and continuation requires evidence.'),
  ('DAHD Annual Report 2025-26 AHIDF section', 'https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official annual report for current AHIDF beneficiary categories, loan share, interest subvention and credit-guarantee boundaries.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  item jsonb;
  authority_id uuid;
  seed_opportunity_id uuid;
  version_id uuid;
begin
  for item in
    select value from jsonb_array_elements('[
      {
        "slug":"national-livestock-mission-entrepreneurship-development",
        "name":"National Livestock Mission (NLM) - Entrepreneurship Development",
        "type":"subsidy",
        "authority":"Department of Animal Husbandry and Dairying - National Livestock Mission",
        "authority_url":"https://dahd.gov.in/",
        "canonical_url":"https://dahd.gov.in/schemes/programmes/national_livestock_mission",
        "source_url":"https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf",
        "source_kind":"guideline",
        "source_title":"National Livestock Mission 2026 amended implementation guidelines",
        "source_anchor":"Current component guidelines; entrepreneurship assistance; eligible entities; follow-up and exclusions",
        "summary":"Capital-subsidy and entrepreneurship support for eligible poultry, sheep, goat, piggery, and feed-and-fodder projects under the National Livestock Mission.",
        "objective":"Promote livestock and poultry entrepreneurship, breed improvement, feed and fodder infrastructure, employment and sector productivity through the NLM sub-missions.",
        "legal_basis":"National Livestock Mission guidelines issued by the Department of Animal Husbandry and Dairying",
        "eligibility":{"entity_types":["individual_entrepreneur","private_entrepreneur","fpo","shg","jlg","dairy_cooperative","section_8_company"],"sectors":["rural_poultry","sheep_goat","piggery","camel","donkey","horse","mule","feed_fodder"],"conditions":["selected activity must fit an eligible NLM entrepreneurship component","state implementing agency and current component guidelines apply","bank or self-financing appraisal route applies","component-specific project and infrastructure conditions apply","the amended 2026 guideline includes camel, donkey, horse and mule activities in the breed-development focus"],"exclusions":["working capital","land purchase or lease","personal vehicle","office accommodation where excluded by the component"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://nlm.udyamimitra.in/","route":"The State Implementing Agency invites eligible entities through the applicable expression-of-interest route; after state appraisal and approval, the project is uploaded through the NLM portal.","support":"capital subsidy in two instalments, subject to the component-specific guideline and verification","current_guideline":"https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf","handoff_note":"UdyamVeda explains and prepares the application but does not impersonate the applicant or handle OTPs"},
        "fine_print":{"subsidy_percent":50,"subsidy_max_inr":5000000,"instalments":2,"first_instalment_condition":"Bank or financial-institution loan release and State Implementing Agency confirmation; the guideline also describes expenditure verification for the first instalment.","second_instalment_condition":"Project completion and certification by the State Implementing Agency.","self_financing_condition":"Self-financing applicants may require bank appraisal and a scheduled-bank guarantee for the remaining project cost beyond the subsidy sought.","scheme_outlay_inr":23000000000,"outlay_is_not_applicant_entitlement":true,"component_scope_note":"The 50% and up-to-50-lakh pattern is a component-level entrepreneurship reference from the guideline; activities and caps can differ across NLM components and amendments.","amendment_note":"DAHD published amended implementation guidance in February 2026; the amended PDF must be treated as the current primary guideline pending reviewer confirmation.","current_nlm_facts":{"official_guideline_checked":"2026-09-07","amended_guideline":"https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf","state_route":"State Implementing Agencies invite proposals through the applicable EOI route and forward approved projects through the online NLM process.","additional_species_focus":["camel","donkey","horse","mule"],"availability_boundary":"No universal deadline is asserted; component and State EOI availability must be checked before recommendation."},"review_note":"Confirm the applicable NLM component, current amended assistance ceiling, beneficiary category, State Implementing Agency, project cost basis, bank/SIDBI route, guarantee format, expenditure milestones, exclusions and live application window before publication."},
        "benefit_summary":{"types":["subsidy","entrepreneurship_support"],"summary":"Component-specific capital subsidy support for eligible livestock, poultry and feed/fodder entrepreneurship projects; this is not a universal grant or guaranteed loan."},
        "benefit_type":"subsidy",
        "benefit_label":"NLM capital subsidy for eligible entrepreneurship projects",
        "amount_max":5000000,
        "percentage":50,
        "benefit_conditions":{"component_specific":true,"two_instalments":true,"state_verification_required":true,"outlay_not_applicant_entitlement":true},
        "requirement":"Component-eligible livestock or feed-and-fodder project",
        "requirement_description":"The applicant must select an eligible NLM entrepreneurship component and provide the project, entity, financing and State Implementing Agency evidence required by the current route.",
        "rules":{"all":[{"field":"nlm_component_eligible","operator":"equals","value":true},{"field":"project_sector","operator":"in","value":["rural_poultry","sheep_goat","piggery","feed_fodder"]},{"field":"project_appraisal_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Select the NLM component","description":"Confirm whether the project is rural poultry, small ruminants, piggery, camel, donkey, horse, mule or feed-and-fodder and check the amended component-specific terms.","url":"https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf"},{"title":"Prepare the project and financing evidence","description":"Compile the project report, entity documents, contribution or financing evidence, bank or self-financing route and required guarantees.","url":"https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf"},{"title":"Confirm the State Implementing Agency and EOI","description":"Verify the current State Implementing Agency, expression-of-interest route, screening process and expenditure or completion certification requirements.","url":"https://dahd.gov.in/en/node/3986"},{"title":"Use the official NLM dashboard","description":"Submit through the current official dashboard after confirming the live window and component route.","url":"https://nlm.udyamimitra.in/"}],
        "window_type":"call_for_applications",
        "window_label":"Current NLM dashboard availability and component/state application window require reviewer confirmation; no universal deadline is asserted.",
        "window_evidence":{"source_url":"https://dahd.gov.in/schemes/programmes/national_livestock_mission","anchor":"Apply subsidy under NLM; current page last updated September 6, 2026"}
      },
      {
        "slug":"animal-husbandry-infrastructure-development-fund-ahidf",
        "name":"Animal Husbandry Infrastructure Development Fund (AHIDF)",
        "type":"loan",
        "authority":"Department of Animal Husbandry and Dairying - AHIDF",
        "authority_url":"https://dahd.gov.in/",
        "canonical_url":"https://dahd.gov.in/schemes/programmes/ahidf",
        "source_url":"https://www.dahd.gov.in/sites/default/files/2023-11/ImplementationGuidelinesAHIDF.pdf",
        "source_kind":"guideline",
        "source_title":"Implementation Guidelines for AHIDF",
        "source_anchor":"Eligible entities and activities; section 7.1 Quantum of loan and margin money / beneficiary contribution",
        "summary":"Term-loan and interest-subvention support for eligible animal-husbandry, dairy, meat, feed, vaccine, waste-to-wealth and wool-processing infrastructure projects.",
        "objective":"Incentivize investment, entrepreneurship, employment, value addition and infrastructure development across eligible animal-husbandry and dairy activities.",
        "legal_basis":"Animal Husbandry Infrastructure Development Fund operational guidelines issued by the Department of Animal Husbandry and Dairying",
        "eligibility":{"entity_types":["individual_entrepreneur","private_company","msme","fpo","section_8_company","dairy_cooperative"],"sectors":["dairy_processing","meat_processing","animal_feed","breed_improvement","veterinary_vaccine_drugs","animal_waste_to_wealth","primary_wool_processing"],"conditions":["viable eligible project","scheduled-bank or eligible lender appraisal","beneficiary contribution varies by entity category","current AHIDF continuation and portal operation must be confirmed"],"exclusions":["working capital loan","recurring expenditure","land purchase, lease or hiring","old machinery where excluded","personal-use vehicle"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ahidf.udyamimitra.in/","route":"submit the eligible project through the official AHIDF portal and lender route after confirming current continuation and eligible activity","support":"term loan up to 90% of project cost with 3% interest subvention under the cited operational rules","handoff_note":"UdyamVeda explains and prepares the application but does not impersonate the applicant or handle OTPs"},
        "fine_print":{"loan_share_max_percent":90,"interest_subvention_percent":3,"credit_guarantee_msmE_percent":25,"credit_guarantee_corpus_inr":7500000000,"repayment_max_years":8,"principal_moratorium_years":2,"beneficiary_contribution":{"micro_small_percent":10,"medium_max_percent":15,"other_categories_max_percent":25},"scheme_outlay_inr":291102500000,"outlay_validity_note":"The current DAHD page states the revised outlay through FY 2025-26 to March 31, 2026; continuation and any post-March-2026 terms must be verified before publication.","outlay_is_not_applicant_entitlement":true,"entity_caveat":"The current DAHD page states that dairy cooperatives are eligible after DIDF was subsumed into AHIDF; older FAQ/guideline wording must still be reconciled before publication.","current_ahidf_facts":{"official_page_checked":"2026-09-07","cited_outlay_period_end":"2026-03-31","current_availability":"Do not present AHIDF as an active actionable window until official post-March-2026 continuation evidence is confirmed.","eligible_entities_current_page":["individual_entrepreneurs","private_companies","MSME","FPOs","Section 8 companies","dairy cooperatives"],"loan_share_max_percent":90,"interest_subvention_percent":3,"no_universal_term_loan_ceiling_in_annual_report":true,"credit_guarantee_msmE_percent":25},"review_note":"Confirm post-March-2026 continuation, eligible cooperative treatment, lender list, interest-subvention calculation, credit-guarantee route, contribution, repayment, eligible project cost and current AHIDF portal window before publication."},
        "benefit_summary":{"types":["loan","interest_subvention","credit_guarantee"],"summary":"Eligible projects may access term-loan financing up to the cited project-cost share and interest subvention, with separate MSME credit-guarantee conditions; loan amount, subsidy and guarantee must not be added into one value."},
        "benefit_type":"loan",
        "benefit_label":"AHIDF term loan and interest-subvention support",
        "amount_max":null,
        "benefit_conditions":{"loan_share_max_percent":90,"interest_subvention_percent":3,"repayment_max_years":8,"principal_moratorium_years":2,"no_universal_loan_ceiling_asserted":true,"current_continuation_requires_review":true},
        "requirement":"Eligible animal-husbandry infrastructure project and lender appraisal",
        "requirement_description":"The applicant must provide a viable eligible project, entity evidence, contribution, lender appraisal and the documents required by the current portal and operational guidelines.",
        "rules":{"all":[{"field":"ahidf_activity_eligible","operator":"equals","value":true},{"field":"viable_project_ready","operator":"equals","value":true},{"field":"lender_appraisal_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the eligible infrastructure activity","description":"Check dairy, meat, feed, breed, vaccine/drug, waste-to-wealth or wool-processing eligibility against the current DAHD page and operational guidelines.","url":"https://www.dahd.gov.in/schemes/programmes/ahidf"},{"title":"Check continuation and financial terms","description":"Verify whether post-March-2026 continuation exists, then confirm loan share, interest subvention, contribution, guarantee and repayment terms before preparing the application.","url":"https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf"},{"title":"Prepare the viable project and lender evidence","description":"Compile the project report, entity documents, contribution, lender appraisal and eligible-cost evidence; exclude working capital and other non-eligible items.","url":"https://www.dahd.gov.in/sites/default/files/2023-11/ImplementationGuidelinesAHIDF.pdf"},{"title":"Use the official AHIDF portal only after continuation is verified","description":"The portal is an official handoff, but UdyamVeda must not present an actionable application route until the current window is confirmed.","url":"https://ahidf.udyamimitra.in/"}],
        "window_type":"closed",
        "window_label":"The cited AHIDF outlay period ended on 31 March 2026. No post-March-2026 continuation is asserted until official evidence is reviewed; do not show an actionable application window.",
        "window_evidence":{"source_url":"https://dahd.gov.in/schemes/programmes/ahidf","anchor":"Current AHIDF page; revised outlay stated through FY 2025-26 to March 31, 2026"}
      }
    ]'::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Fisheries, Animal Husbandry and Dairying', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.82, 0.80, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf', 'guideline', 'National Livestock Mission 2026 amended guidelines', 'February 2026 amended guideline; additional species, State EOI and current component rules'),
      ('https://dahd.gov.in/en/node/3986', 'ministry', 'NLM 2026 amendment notice', 'Circulation of Amended Implementation Guidelines for National Livestock Mission'),
      ('https://dahd.gov.in/schemes/programmes/national_livestock_mission', 'ministry', 'DAHD National Livestock Mission page', 'Current NLM components and official application links'),
      ('https://nlm.udyamimitra.in/', 'agency', 'NLM EDP dashboard', 'Official application/dashboard handoff'),
      ('https://www.dahd.gov.in/schemes/programmes/ahidf', 'ministry', 'AHIDF current DAHD page', 'Cited outlay period through 31 March 2026 and dairy cooperative eligibility'),
      ('https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'ministry', 'DAHD Annual Report 2025-26 AHIDF section', 'AHIDF current entity, loan-share and guarantee boundaries'),
      ('https://ahidf.udyamimitra.in/', 'agency', 'AHIDF application portal', 'Official loan application handoff; live continuation requires review')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where (item->>'slug' = 'national-livestock-mission-entrepreneurship-development' and evidence.source_url in ('https://dahd.gov.in/sites/default/files/2026-02/RevisedNLMGuidelines.pdf', 'https://dahd.gov.in/en/node/3986', 'https://dahd.gov.in/schemes/programmes/national_livestock_mission', 'https://nlm.udyamimitra.in/'))
       or (item->>'slug' = 'animal-husbandry-infrastructure-development-fund-ahidf' and evidence.source_url in ('https://www.dahd.gov.in/schemes/programmes/ahidf', 'https://dahd.gov.in/sites/default/files/2026-04/AnnualReport2025-26.pdf', 'https://ahidf.udyamimitra.in/'));
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item->>'amount_max' is not null then (item->>'amount_max')::numeric else null end, case when item->>'percentage' is not null then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
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
