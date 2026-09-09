-- Additional official-source Central records.
-- Every record intentionally remains in_review until a reviewer confirms
-- current operation, source anchors and the remaining fine print.

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
        "slug":"pradhan-mantri-mudra-yojana",
        "name":"Pradhan Mantri MUDRA Yojana",
        "type":"loan",
        "lifecycle_status":"active",
        "authority":"Department of Financial Services",
        "authority_url":"https://financialservices.gov.in/",
        "canonical_url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy",
        "source_url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy",
        "source_kind":"agency",
        "source_title":"Department of Financial Services PMMY page",
        "source_anchor":"Features: purposes, categories, member lending institutions, collateral not required",
        "summary":"Institutional collateral-free credit for micro enterprises through member lending institutions.",
        "objective":"Provide access to institutional credit for income-generating micro enterprise activities.",
        "legal_basis":"Pradhan Mantri MUDRA Yojana information published by the Department of Financial Services.",
        "eligibility":{"entity_types":["individual","proprietorship","partnership"],"lifecycle_stages":["new_business","operating","growth"],"locations":["India"],"citizenship":["Indian citizen"],"activities":["manufacturing","processing","trading","services","activities allied to agriculture"],"conditions":["applicant must have a business plan for a non-farm income-generating activity"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy","route":"Approach an eligible Member Lending Institution.","lenders":["public sector banks","private sector banks","foreign banks","regional rural banks","small finance banks","NBFCs","MFIs"],"applicant_note":"UdyamVeda can prepare a lender dossier but cannot approve credit or guarantee a lender's pricing and sanction."},
        "fine_print":{"categories":{"shishu":{"maximum_inr":50000},"kishor":{"minimum_inr":50001,"maximum_inr":500000},"tarun":{"minimum_inr":500001,"maximum_inr":1000000},"tarun_plus":{"minimum_inr":1000001,"maximum_inr":2000000,"condition":"Previous Tarun loan successfully repaid","effective_from":"2024-10-24"}},"collateral_required":false,"term_loan_and_working_capital":true,"direct_cash_benefit":false,"current_pmmy_facts":{"last_official_page_update":"2026-02-05","purpose":"Institutional collateral-free credit for micro enterprises, including non-agricultural activities allied to agriculture such as poultry, dairy and beekeeping","member_lending_institutions":["public_sector_banks","private_sector_banks","foreign_banks","regional_rural_banks","small_finance_banks","NBFCs","MFIs","NBFC-MFIs"],"sanction_boundary":"The lender decides appraisal, pricing, repayment schedule, documentation and sanction; the Government page does not guarantee a loan amount for an applicant","tarun_plus_boundary":"Tarun Plus is above ₹10 lakh up to ₹20 lakh only for entrepreneurs who have availed and successfully repaid a previous Tarun loan"},"review_note":"Confirm the current Tarun Plus operation, lender eligibility, pricing, repayment terms, documentation, activity exclusions and any amendments before publication."},
        "benefit_summary":{"types":["loan"],"amounts":[{"type":"shishu","max_inr":50000},{"type":"kishor","max_inr":500000},{"type":"tarun","max_inr":1000000},{"type":"tarun_plus","max_inr":2000000}],"summary":"Loan ceiling varies by category; this is credit, not a grant or subsidy.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"MUDRA credit categories",
        "benefit_conditions":{"categories":["shishu","kishor","tarun","tarun_plus"],"collateral_required":false,"lender_sanction_required":true},
        "requirement":"Business plan for an eligible income-generating activity",
        "requirement_description":"The official description requires a business plan for a non-farm income-generating activity and lender-specific credit documents.",
        "rules":{"all":[{"field":"citizenship","operator":"equals","value":"India"},{"field":"business_plan_present","operator":"equals","value":true},{"field":"activity","operator":"in","value":["manufacturing","processing","trading","services","activities allied to agriculture"]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Prepare the business plan","description":"Define the income-generating activity and required term loan or working capital.","url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"},{"title":"Choose the suitable MUDRA category","description":"Separate Shishu, Kishor, Tarun and Tarun Plus conditions; Tarun Plus requires the applicable prior repayment condition.","url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"},{"title":"Approach an eligible lending institution","description":"The loan is processed by a participating bank, NBFC or MFI.","url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"}],
        "window_type":"rolling",
        "window_label":"Loan applications are routed through member lending institutions; current lender operation requires reviewer confirmation.",
        "window_evidence":{"source_url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy","anchor":"Member Lending Institutions"}
      },
      {
        "slug":"stand-up-india-scheme",
        "name":"Stand Up India Scheme",
        "type":"loan",
        "lifecycle_status":"closed",
        "authority":"Department of Financial Services - Stand Up India",
        "authority_url":"https://www.financialservices.gov.in/stand-india-scheme-supi",
        "canonical_url":"https://www.financialservices.gov.in/stand-india-scheme-supi",
        "source_url":"https://www.financialservices.gov.in/stand-india-scheme-supi",
        "source_kind":"agency",
        "source_title":"Department of Financial Services Stand Up India page",
        "source_anchor":"Features: loan range, greenfield project scope, repayment, margin money and own contribution",
        "summary":"Composite bank loans for eligible women and SC/ST entrepreneurs setting up greenfield enterprises.",
        "objective":"Promote entrepreneurship among women and Scheduled Caste/Scheduled Tribe entrepreneurs through bank finance.",
        "legal_basis":"Stand Up India Scheme information published by the Department of Financial Services.",
        "eligibility":{"entity_types":["individual","partnership","company"],"lifecycle_stages":["new_business","greenfield"],"locations":["India"],"founder_categories":["women","scheduled_caste","scheduled_tribe"],"age_minimum_years":18,"activities":["manufacturing","services","trading","activities allied to agriculture"],"conditions":["greenfield enterprise","borrower must not be in default to a bank or financial institution","for non-individuals, at least 51% shareholding and controlling stake must be held by an SC/ST or woman entrepreneur"],"unknown_handling":"needs_information"},
        "application":{"route":"Apply through a Scheduled Commercial Bank and use the official handholding portal.","portal":"https://www.standupmitra.in/","selection":"Bank appraisal and sanction.","applicant_note":"UdyamVeda can prepare the founder-category and greenfield dossier but cannot promise bank sanction, interest or security terms."},
        "fine_print":{"loan_range_inr":{"minimum":1000000,"maximum":10000000},"loan_type":"composite","repayment_years_max":7,"moratorium_months_max":18,"margin_money_percent_max":15,"own_contribution_percent_min":10,"security":"Primary security required; collateral or credit guarantee as decided by the bank.","current_stand_up_india_facts":{"last_official_page_update":"2026-02-05","scheme_window":"The Department of Financial Services page states that the scheme was available up to 2025-03-31 in line with the 15th Finance Commission period.","successor_boundary":"The same page describes a Budget 2025-26 successor proposal for first-time women and SC/ST entrepreneurs with loans up to Rs 2 crore over five years, but says the EFC note was still under preparation; it is not treated as an active Stand Up India entitlement.","historical_route":"The historical route used Scheduled Commercial Banks, StandUpMitra guidance and JanSamarth discovery; bank appraisal, pricing, security and sanction were never guaranteed by the scheme page."},"review_note":"Confirm the historical founder-category, greenfield, bank and contribution rules and separately identify any formally notified successor before publication; do not present the closed scheme as an active application route."},
        "benefit_summary":{"types":["loan"],"amounts":[{"type":"composite_loan","min_inr":1000000,"max_inr":10000000}],"summary":"Bank credit; margin, security, interest and sanction depend on the applicable bank and current scheme terms.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Stand Up India composite loan",
        "benefit_conditions":{"greenfield_required":true,"repayment_years_max":7,"moratorium_months_max":18,"own_contribution_percent_min":10,"bank_sanction_required":true},
        "requirement":"Founder category and greenfield project declaration",
        "requirement_description":"Establish the applicable woman or SC/ST category, age, greenfield status, sector and contribution requirements.",
        "rules":{"all":[{"field":"age_years","operator":"greater_than_or_equal","value":18},{"field":"founder_category","operator":"in","value":["woman","sc","st"]},{"field":"is_greenfield","operator":"equals","value":true},{"field":"bank_default","operator":"equals","value":false}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the founder and project criteria","description":"Verify category, age, greenfield status, sector and contribution requirements before approaching a bank.","url":"https://www.financialservices.gov.in/stand-india-scheme-supi"},{"title":"Use the official handholding portal or bank route","description":"Use the official portal for guidance and submit through a Scheduled Commercial Bank.","url":"https://www.standupmitra.in/"}],
        "window_type":"closed",
        "window_label":"Historical scheme window ended on 31 March 2025; any successor must be recorded as a separate opportunity only after formal notification and review.",
        "window_evidence":{"source_url":"https://www.financialservices.gov.in/stand-india-scheme-supi","anchor":"Stand Up India Scheme"}
      },
      {
        "slug":"msme-sustainable-zed-certification",
        "name":"MSME Sustainable (ZED) Certification",
        "type":"subsidy",
        "authority":"Office of the Development Commissioner (MSME) - ZED",
        "authority_url":"https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx",
        "canonical_url":"https://zed.msme.gov.in/",
        "source_url":"https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx",
        "source_kind":"guideline",
        "source_title":"DC MSME ZED Scheme guidelines page",
        "source_anchor":"Key Benefits and Eligibility/Applicability",
        "summary":"Quality, safety, production, cleanliness, energy and environmental certification support for eligible manufacturing MSMEs.",
        "objective":"Promote Zero Defect Zero Effect practices, competitiveness, quality, productivity and sustainable manufacturing.",
        "legal_basis":"ZED Scheme information published by the Development Commissioner (MSME).",
        "eligibility":{"entity_types":["micro","small","medium"],"lifecycle_stages":["operating","quality_improvement","manufacturing"],"locations":["India"],"activities":["manufacturing"],"conditions":["registered on the Udyam registration portal"],"implementing_agency":"Quality Council of India","unknown_handling":"needs_information"},
        "application":{"portal":"https://zed.msme.gov.in/","route":"Apply through the official ZED portal.","applicant_note":"UdyamVeda can organize the Udyam, pledge and certification checklist but cannot certify the enterprise or promise subsidy."},
        "fine_print":{"certification_levels":{"bronze_inr":10000,"silver_inr":40000,"gold_inr":90000},"joining_reward_inr":10000,"subsidy_percent":{"micro":80,"small":60,"medium":50},"additional_subsidy_percent":{"women_sc_st_owned_or_special_territory":10,"sf_urti_or_mse_cdp_member":5},"support":["testing/quality/product certification","handholding","technology upgradation for zero effect solutions"],"current_zed_facts":{"official_guideline_page_checked":"2026-09-07","eligibility":"All manufacturing MSMEs registered on the Udyam portal are described as eligible to participate; QCI is the implementing agency.","levels_and_cost":"The current DC MSME page lists Bronze Rs 10,000, Silver Rs 40,000 and Gold Rs 90,000 before applicable subsidy/reward treatment.","support_boundary":"The page separately describes certification-cost subsidy, testing/quality/product certification, handholding and technology-upgradation support; these are not a single cash grant and must remain separate in the user result.","application_route":"The official ZED portal is zed.msme.gov.in; the portal workflow, payment, assessment and current notices still require review."},"review_note":"Confirm the current ZED level fees, subsidy rates, joining reward, eligible enterprise categories, pledge, assessment, payment and portal workflow before publication."},
        "benefit_summary":{"types":["subsidy","recognition"],"summary":"Certification cost support and related assistance; exact payable amount depends on level, enterprise category and applicable additional conditions.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"ZED certification support",
        "benefit_conditions":{"certification_levels":["bronze","silver","gold"],"joining_reward_inr":10000,"udyam_registration_required":true},
        "requirement":"Udyam registration and ZED Pledge",
        "requirement_description":"Manufacturing MSMEs must establish active Udyam registration and complete the current ZED Pledge or portal declaration.",
        "rules":{"all":[{"field":"enterprise_activity","operator":"equals","value":"manufacturing"},{"field":"udyam_registered","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm manufacturing and Udyam eligibility","description":"Verify the enterprise activity and active Udyam registration.","url":"https://www.dcmsme.gov.in/CLCS_TUS_Scheme/ZED_Scheme/Scheme_Guidelines.aspx"},{"title":"Complete the ZED Pledge","description":"Complete the current portal declaration and select the certification level after reviewing the applicable fee and support terms.","url":"https://zed.msme.gov.in/"},{"title":"Apply through the official ZED portal","description":"Use the official portal and retain certification, assessment, payment and subsidy evidence.","url":"https://zed.msme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Portal application is available subject to current programme operation; reviewer confirmation is required.",
        "window_evidence":{"source_url":"https://zed.msme.gov.in/","anchor":"Official application portal"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Finance / Ministry of Micro, Small and Medium Enterprises', item->>'authority', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.90, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities
       set current_version_id = version_id,
           status = coalesce(item->>'lifecycle_status', 'in_review')
     where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, case when item->>'slug' = 'pradhan-mantri-mudra-yojana' then 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy' when item->>'slug' = 'stand-up-india-scheme' then 'https://www.financialservices.gov.in/stand-india-scheme-supi' else 'https://zed.msme.gov.in/' end, 'agency', case when item->>'slug' = 'pradhan-mantri-mudra-yojana' then 'Department of Financial Services PMMY page' when item->>'slug' = 'stand-up-india-scheme' then 'Department of Financial Services Stand Up India page' else 'ZED official application portal' end, 'Current official application and scheme route', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = case when item->>'slug' = 'pradhan-mantri-mudra-yojana' then 'https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy' when item->>'slug' = 'stand-up-india-scheme' then 'https://www.financialservices.gov.in/stand-india-scheme-supi' else 'https://zed.msme.gov.in/' end);
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.jansamarth.in/', 'agency', 'JanSamarth national application portal', 'Stand Up India historical application handoff referenced by the current DFS page', now(), false
    where item->>'slug' = 'stand-up-india-scheme'
      and not exists (
        select 1 from public.opportunity_sources
        where opportunity_version_id = version_id and source_url = 'https://www.jansamarth.in/'
      );
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

-- Clean-seed correction: preserve the current ZED reconciliation metadata
-- when migrations run before the opportunity seed rows.
do $$
declare
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'msme-sustainable-zed-certification';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_portal', 'https://zed.msme.gov.in/',
        'current_route_boundary', 'Manufacturing MSMEs with Udyam registration use the official ZED portal; certification and support outcomes remain subject to pledge, assessment and current terms.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_zed_reconciliation', jsonb_build_object(
          'official_sources_checked', '2026-09-08',
          'current_page_levels', jsonb_build_array('bronze', 'silver', 'gold'),
          'displayed_fee_examples_inr', jsonb_build_object('bronze', 10000, 'silver', 40000, 'gold', 90000),
          'joining_reward_inr', 10000,
          'certification_subsidy_percent', jsonb_build_object('micro', 80, 'small', 60, 'medium', 50),
          'implementing_agency', 'Quality Council of India',
          'level_version_conflict', 'An official operational-guideline result lists Diamond and Platinum terminology while the current DC MSME page states three levels; do not publish beyond the current three-level page until the controlling version is reconciled.',
          'review_boundary', 'Confirm pledge, undertaking, assessment, payment, inspection, claim timing and current guideline before publication.'
        ),
        'current_source_reconciliation', 'The current DC MSME ZED page, official portal, contact route and guideline documents were checked on 8 September 2026. Certification, joining reward, subsidy, testing, handholding and technology support remain separate and review-gated.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://dcmsme.gov.in/schemes/clcs-tus/Operational_Guidelines_ZED.pdf', 'guideline', 'ZED operational guideline', 'Certification process and level terminology for version reconciliation'),
      ('https://www.dcmsme.gov.in/Guidelines_MSME%20Sustainable%28ZED%29Certification%20Scheme.pdf', 'guideline', 'ZED certification guideline document', 'Pledge, assessment, certification and inspection boundaries')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
