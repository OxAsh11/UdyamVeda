-- Additional evidence-backed central finance records. These remain in_review
-- until the current guideline version and application-window status are approved.

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
        "slug":"prime-ministers-employment-generation-programme",
        "name":"Prime Minister's Employment Generation Programme",
        "type":"subsidy",
        "authority":"Khadi and Village Industries Commission (KVIC)",
        "authority_url":"https://kviconline.gov.in/",
        "canonical_url":"https://common-pmegp.msme.gov.in/",
        "source_url":"https://kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf",
        "source_kind":"guideline",
        "source_title":"Revised PMEGP Scheme Guidelines",
        "source_anchor":"Maximum project cost and eligibility conditions",
        "summary":"Credit-linked margin-money subsidy programme for setting up eligible new micro enterprises.",
        "objective":"Generate sustainable employment through new self-employment ventures and micro enterprises.",
        "legal_basis":"PMEGP scheme guidelines issued through KVIC and the Ministry of MSME.",
        "eligibility":{"entity_types":["individual","self_help_group","society","production_cooperative_society","charitable_trust"],"lifecycle_stages":["new_business","self_employed","micro_business"],"locations":["India"],"conditions":["individual beneficiary must be above 18 years","only new projects sanctioned specifically under PMEGP","no income ceiling is stated for new projects","education threshold of at least VIII standard applies where manufacturing project cost exceeds INR 10 lakh or business/service project cost exceeds INR 5 lakh"],"exclusions":["existing units under PMRY, REGP or other government schemes","units that already availed government subsidy under another government scheme"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://common-pmegp.msme.gov.in/","portal_aliases":["https://kviconline.gov.in/pmegpeportal/"],"route":"Apply through the current official PMEGP portal and lending process.","submission_mode":"online_only_for_current_portal_route","finance":"The bank provides the balance amount excluding beneficiary contribution.","applicant_note":"UdyamVeda can prepare the project and finance pack but cannot promise sanction, loan approval or subsidy adjustment."},
        "fine_print":{"project_cost_ceiling":{"manufacturing_inr":5000000,"business_service_inr":2000000},"contribution_percent":{"general":10,"special":5},"margin_money_subsidy_percent":{"general":{"urban":15,"rural":25},"special":{"urban":25,"rural":35}},"working_capital_limit_percent":{"manufacturing":40,"service_trading":60},"current_pmegp_facts":{"udyam_registration":"All new units set up under PMEGP must be registered on the Udyam Portal before physical verification and adjustment of margin money in the beneficiary loan account","subsidy_boundary":"Margin Money is sanctioned subject to eligibility, admissibility and availability of funds; it is not guaranteed or legally binding merely because an application is submitted","identity_boundary":"Aadhaar authentication is used for individual applicants where applicable; the official material provides alternative identification routes for specified cases and the applicant must provide consent through the official portal","application_review":"The guidelines state that the implementing agency should interact with the applicant within five working days of receipt for preliminary scrutiny; this is not a guaranteed sanction timeline","submission_mode":"The current portal terms state that applications must be submitted online; offline regional-language forms are routed to the nearest implementing agency office","family_rule":"Only one person from one family is eligible for new-enterprise assistance; family includes self, spouse and unmarried children","capital_expenditure":"Projects without capital expenditure are not eligible for financing; land is excluded from project cost, while qualifying ready-built or leased/rented work-shed cost is limited to the stated period","transport_activity_cap":"A 10 percent ceiling applies to projects financed under transport activities except for the listed exempt regions and categories","training_and_verification":"EDP training is required before loan release unless an applicable exemption applies; physical verification with geo-tagging and OTP validation may be conducted","subsidy_lock_in":"The official portal terms state that the Margin Money subsidy remains locked for three years and may be refunded under specified conditions","post_setup_obligation":"A bilingual signboard must be displayed at the project site as required by the PMEGP guidelines","anti_middleman_warning":"The official portal cautions that KVIC, KVIB, DIC, Coir Board and implementing agencies have not authorized consultants or middlemen to guarantee approval; UdyamVeda must not imply guaranteed approval","scope_boundary":"This record covers new PMEGP units; the separate second-loan/upgradation route for existing PMEGP/REGP/MUDRA units must not be conflated with new-unit eligibility","upgradation_route":"Existing PMEGP/MUDRA units require the first loan and margin-money claim conditions, repayment in the stipulated time, profitability for the last three years, and mandatory Udyam registration; the lending bank route remains separate"},"clawback":"Excess margin money may be refunded if incurred expenditure is below the sanctioned amount.","current_source_checked_at":"2026-09-07","review_note":"Confirm current beneficiary categories, project-cost ceilings, education threshold, contribution, subsidy rates, Udyam prerequisite, bank process, working-capital treatment, repayment, portal route, negative list, transport exceptions, EDP/training exemptions, physical verification, lock-in and clawback conditions before publication."},
        "benefit_summary":{"types":["subsidy","loan"],"summary":"Margin-money subsidy linked to bank finance; amounts depend on project cost, category, location and current guidelines.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Margin-money subsidy for eligible new micro enterprise",
        "benefit_conditions":{"maximum_project_cost_manufacturing_inr":5000000,"maximum_project_cost_business_service_inr":2000000,"subsidy_rate_depends_on_category_and_location":true,"bank_finance_required":true},
        "requirement":"New-project report, beneficiary contribution and lending documents",
        "requirement_description":"Submit a project report, cost estimates, beneficiary and project declarations, contribution evidence and the supporting documents required for bank appraisal.",
        "rules":{"all":[{"field":"age_years","operator":"greater_than_or_equal","value":18},{"field":"is_new_project","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm beneficiary and project eligibility","description":"Check age, new-project status, project-cost ceiling, category, location, family rule and any education threshold that applies to the project type.","url":"https://pmegp.msme.gov.in/Home/TermsAndConditions"},{"title":"Prepare the project and finance pack","description":"Prepare the project report, beneficiary contribution evidence, capital-expenditure details, declarations and supporting documents needed for bank appraisal.","url":"https://pmegp.msme.gov.in/Documents/UserManual/UserManual_NewApplicant.pdf"},{"title":"Apply through PMEGP and complete lender processing","description":"Submit through the current official PMEGP portal and follow the implementing-agency and bank process through sanction, disbursement and margin-money adjustment.","url":"https://common-pmegp.msme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Applications are accepted through the PMEGP portal subject to scheme and implementing-agency processing.",
        "window_evidence":{"source_url":"https://common-pmegp.msme.gov.in/","anchor":"Current PMEGP portal with 2026-27 operational statistics, scheme guidance and application route"}
      },
      {
        "slug":"credit-guarantee-scheme-cgtmse",
        "name":"Credit Guarantee Scheme for Micro and Small Enterprises",
        "type":"guarantee",
        "authority":"Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
        "authority_url":"https://www.cgtmse.in/",
        "canonical_url":"https://www.cgtmse.in/",
        "source_url":"https://www.cgtmse.in/Home/VS/3",
        "source_kind":"agency",
        "source_title":"CGTMSE official overview",
        "source_anchor":"Guarantee coverage and scheme purpose",
        "summary":"Credit guarantee cover supporting collateral-free and third-party-guarantee-free credit facilities extended by eligible lending institutions to eligible MSEs.",
        "objective":"Strengthen credit delivery and facilitate institutional credit to micro and small enterprises.",
        "legal_basis":"Credit Guarantee Scheme operated by CGTMSE.",
        "eligibility":{"entity_types":["individual","proprietorship","llp","partnership","private_limited_company","registered_company"],"lifecycle_stages":["new_business","operating","growth"],"locations":["India"],"activities":["manufacturing","service"],"conditions":["credit must be extended by an eligible Member Lending Institution","IT PAN is required before availing the credit facility"],"exclusions":["agriculture","self_help_group","joint_liability_group"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.cgtmse.in/","route":"The borrower approaches an eligible lending institution; the lender lodges the guarantee application after sanction or disbursement.","direct_loan":false,"applicant_note":"CGTMSE is not a direct borrower loan portal; UdyamVeda can prepare the lender checklist but cannot promise sanction or guarantee cover."},
        "fine_print":{"not_a_direct_loan":true,"not_a_subsidy":true,"maximum_credit_facility_covered_inr":100000000,"coverage_examples":{"micro_up_to_500000":85,"above_500000_to_5000000":75,"above_5000000_to_100000000":75,"women_or_agniveer_promoted_mse":90,"sc_st_pwd_aspirational_district_or_zed":85},"hybrid_security":"Eligible remaining unsecured portion may be covered up to the scheme limit.","current_cgtmse_facts":{"coverage_ceiling":"Current CGTMSE guidance covers eligible credit facilities up to ₹10 crore per borrower; credit above that may exist but guarantee cover remains restricted to the ₹10 crore limit","cover_basis":"Guarantee coverage is calculated as a percentage of the amount in default, not as a cash grant or a promise to pay the borrower","coverage_categories":"Current overview states 85% for micro credit up to ₹5 lakh, 75% above ₹5 lakh up to ₹10 crore for the ordinary categories, 90% for women entrepreneurs or MSEs promoted by Agniveers, 85% for SC/ST/PwD/Aspirational District/ZED categories, and an additional 5% for identified credit-deficient districts subject to the applicable rules","hybrid_security":"A lender may take collateral for part of the facility while the remaining unsecured portion up to ₹10 crore may be covered under the Hybrid Security product","lender_fee":"Annual Guarantee Fee and other guarantee charges are payable through the member lending institution under the current CGTMSE fee schedule"},"review_note":"Confirm current CGTMSE coverage percentages, eligible borrower constitution and activity, lender eligibility, PAN requirement, facility ceiling, annual guarantee fee, security treatment, lock-in and guarantee-filing timing before publication."},
        "benefit_summary":{"types":["guarantee"],"summary":"Guarantee cover to eligible lenders; CGTMSE does not itself provide loans or subsidies.","separate_value_buckets":true},
        "benefit_type":"guarantee",
        "benefit_label":"Credit guarantee cover for eligible lender facilities",
        "benefit_conditions":{"maximum_credit_facility_covered_inr":100000000,"direct_cash_benefit":false,"eligible_lender_required":true,"not_a_subsidy":true},
        "requirement":"Eligible MSE, activity and participating lender",
        "requirement_description":"Provide evidence that the enterprise is an eligible micro or small enterprise carrying on an eligible activity, plus PAN and the financial, KYC, project and facility documents required by the Member Lending Institution.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"activity","operator":"in","value":["manufacturing","service"]},{"field":"eligible_lending_institution","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm borrower and facility eligibility","description":"Check enterprise size, eligible activity, PAN requirement, borrower exclusions and the proposed facility against current CGTMSE guidance.","url":"https://www.cgtmse.in/Home/VS/95"},{"title":"Approach a participating lender","description":"Submit the credit proposal and supporting documents to an eligible Member Lending Institution. The lender, not CGTMSE, evaluates and sanctions the credit facility.","url":"https://www.cgtmse.in/Home/VS/3"},{"title":"Track guarantee filing with the lender","description":"After sanction or disbursement, confirm that the eligible lender lodges the guarantee application and retain sanction, facility and guarantee evidence.","url":"https://www.cgtmse.in/Home/VS/3"}],
        "window_type":"rolling",
        "window_label":"Guarantee support is accessed through eligible lenders as facilities are sanctioned.",
        "window_evidence":{"source_url":"https://www.cgtmse.in/Home/VS/3","anchor":"CGTMSE official overview; current lender and coverage conditions must be verified before recommendation"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', case when item->>'slug' like 'prime-%' then 'Ministry of Micro, Small and Medium Enterprises' else 'Ministry of Micro, Small and Medium Enterprises / SIDBI' end, item->>'authority', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.89, 0.90, 'in_review')
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
    select version_id, case when item->>'slug' = 'prime-ministers-employment-generation-programme' then 'https://kviconline.gov.in/pmegpeportal/' else 'https://www.cgtmse.in/Home/VS/95' end, 'agency', case when item->>'slug' = 'prime-ministers-employment-generation-programme' then 'Official PMEGP application portal' else 'CGTMSE eligible borrowers' end, case when item->>'slug' = 'prime-ministers-employment-generation-programme' then 'Official PMEGP application portal and current processing route' else 'Eligible borrower types and activity exclusions' end, now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = case when item->>'slug' = 'prime-ministers-employment-generation-programme' then 'https://kviconline.gov.in/pmegpeportal/' else 'https://www.cgtmse.in/Home/VS/95' end);
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, source_url, 'agency', source_title, source_anchor, now(), false
    from (values
      ('https://pmegp.msme.gov.in/Home/TermsAndConditions', 'PMEGP current terms and conditions', 'Online submission, one-family-member rule, capital-expenditure requirement and upgradation route'),
      ('https://pmegp.msme.gov.in/Documents/UserManual/UserManual_NewApplicant.pdf', 'PMEGP new-applicant user manual', 'New-applicant documents, negative-list/trading boundaries and project-cost conditions'),
      ('https://my.msme.gov.in/mymsme/reg/com_pmegpform.aspx', 'MyMSME PMEGP current statistics and route', '2026-27 operational statistics and PMEGP application entry point')
    ) as evidence(source_url, source_title, source_anchor)
    where item->>'slug' = 'prime-ministers-employment-generation-programme'
      and not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = evidence.source_url);
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
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
