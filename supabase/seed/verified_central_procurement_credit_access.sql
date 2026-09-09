-- Central procurement-policy and credit-readiness records from official
-- Ministry/NSIC sources. These remain in_review until current amendments,
-- tender routes and reimbursement terms are confirmed.

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
        "slug":"public-procurement-policy-for-micro-and-small-enterprises",
        "name":"Public Procurement Policy for Micro and Small Enterprises (MSEs)",
        "type":"procurement_policy",
        "authority":"Ministry of Micro, Small and Medium Enterprises",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx",
        "source_url":"https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf",
        "source_kind":"ministry",
        "source_title":"MSME Annual Report 2025-26 - Public Procurement Policy",
        "source_anchor":"1.8 Procurement; 1.8.1 Public Procurement Policy; 1.8.2 MSME Sambandh; 1.8.3 GeM",
        "summary":"A Central procurement policy framework intended to improve market access for MSEs through public purchasing targets, procurement reporting and tender participation measures.",
        "objective":"Promote and develop MSEs by improving access to Central Ministry, Department and CPSE procurement while preserving fair, transparent and competitive procurement.",
        "legal_basis":"Public Procurement Policy for MSEs Order, 2012 under section 11 of the MSMED Act, 2006, including later amendments",
        "eligibility":{"entity_types":["micro","small"],"conditions":["enterprise must satisfy the relevant procurement notice and buyer requirements","Udyam or other current registration evidence may be required by the tender route","benefits are procurement-policy measures, not an automatic award or cash entitlement"],"founder_categories":["women","sc_st"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx","route":"register and participate through the applicable GeM, Central buyer, tender, vendor-development or buyer-seller route","applicant_note":"The policy creates access and participation measures; each tender controls final eligibility, price, documents and award."},
        "fine_print":{"annual_procurement_target_percent":25,"sc_st_sub_target_percent":4,"women_mse_sub_target_percent":3,"policy_scope":"Central Ministries, Departments and Central Public Sector Enterprises, subject to the applicable order and exemptions","support_measures":["tender sets free of cost","earnest-money exemption for eligible registered MSEs where applicable","vendor development programmes and buyer-seller meets","reserved items and annual procurement plans under the policy framework"],"review_note":"Confirm the latest policy order, reserved-item list, exemptions, Udyam/GeM conditions, tender thresholds and current buyer implementation before publishing a user-specific recommendation."},
        "benefit_summary":{"types":["market_access","procurement_support","policy"],"summary":"Procurement participation measures and market-access support for eligible MSEs; the policy does not guarantee a contract or combine procurement value with grants or loans."},
        "benefit_type":"policy",
        "benefit_label":"MSE public-procurement participation and tender access",
        "benefit_conditions":{"mse_route_required":true,"specific_buyer_or_tender_requirements_apply":true},
        "requirement":"Eligible MSE and procurement-ready documentation",
        "requirement_description":"The enterprise must meet the applicable buyer, GeM, tender, registration, product and documentation requirements for the selected procurement opportunity.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"procurement_opportunity_available","operator":"equals","value":true},{"field":"procurement_documents_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm MSE and registration status","description":"Verify the current enterprise classification, Udyam details and any GeM or buyer registration needed for the opportunity.","url":"https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"},{"title":"Find a matching procurement notice","description":"Review buyer requirements, reserved items, tender conditions, EMD rules, specifications and deadlines.","url":"https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"},{"title":"Submit through the official procurement route","description":"File the bid or vendor-development application through the stated buyer or GeM route and retain all records.","url":"https://my.msme.gov.in/MyMsme/Reg/PPP_Home.aspx"}],
        "window_type":"event",
        "window_label":"Deadlines are controlled by individual procurement notices and buyer calendars; the policy itself has no universal applicant deadline.",
        "window_evidence":{"source_url":"https://msme.gov.in/sites/default/files/MSMEANNUALREPORT2025-26ENGLISH_0.pdf","anchor":"1.8.1 Public Procurement Policy"}
      },
      {
        "slug":"performance-and-credit-rating-scheme-for-micro-and-small-enterprises",
        "name":"Performance and Credit Rating Scheme for Micro and Small Enterprises",
        "type":"credit_readiness",
        "authority":"National Small Industries Corporation - Ministry of Micro, Small and Medium Enterprises",
        "authority_url":"https://www.nsic.co.in/",
        "canonical_url":"https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html",
        "source_url":"https://msme.gov.in/sites/default/files/PCRSchemeGuidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Performance and Credit Rating Scheme Guidelines",
        "source_anchor":"Approach for rating of SSI units; Selection of rating agency; rating process",
        "summary":"Independent performance and credit assessment for eligible MSEs through NSIC-empanelled rating agencies, with a stated partial fee reimbursement structure subject to current terms.",
        "objective":"Help MSEs understand operational and credit strengths, improve lender and buyer confidence, and support access to finance and markets.",
        "legal_basis":"Performance and Credit Rating Scheme implemented through NSIC",
        "eligibility":{"entity_types":["micro","small"],"conditions":["enterprise must be registered in India as an MSE","rating agency must be selected from the applicable NSIC-empanelled route","reimbursement is subject to scheme conditions and current fund availability"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html","route":"select an applicable empanelled rating agency and submit through the NSIC or rating-agency route","implementing_agency":"National Small Industries Corporation"},
        "fine_print":{"rating_method":"combined performance and creditworthiness assessment covering operational, financial, business and management risks","historical_reimbursement_bands":[{"turnover_up_to_inr":5000000,"percent":75,"ceiling_inr":25000},{"turnover_up_to_inr":20000000,"percent":75,"ceiling_inr":30000},{"turnover_above_inr":20000000,"percent":75,"ceiling_inr":40000}],"processing_expectation":"The official scheme material states the rating process is to be completed within one month after all required information is received; confirm current service-level terms.","review_note":"Confirm the current empanelled-agency list, turnover definition, reimbursement ceilings, application forms, payment sequence and whether the historical bands remain live before publication."},
        "benefit_summary":{"types":["reimbursement","credit_readiness","market_access"],"summary":"A performance and credit rating plus possible partial rating-fee reimbursement; it is not a loan, guarantee or approval of credit."},
        "benefit_type":"reimbursement",
        "benefit_label":"Performance-rating fee reimbursement and credit-readiness support",
        "amount_max":40000,
        "percentage":75,
        "benefit_conditions":{"mse_required":true,"empanelled_rating_agency_required":true,"current_reimbursement_terms_required":true},
        "requirement":"MSE registration and rating application evidence",
        "requirement_description":"The enterprise must provide the information required by the selected empanelled agency and follow the current NSIC reimbursement route.",
        "rules":{"all":[{"field":"enterprise_size","operator":"in","value":["micro","small"]},{"field":"rating_agency_route_available","operator":"equals","value":true},{"field":"rating_information_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current scheme terms","description":"Check the current NSIC portal, empanelled agency list and reimbursement terms before incurring rating fees.","url":"https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html"},{"title":"Select an empanelled rating agency","description":"Choose an applicable agency and prepare the operational, financial, business and management information requested.","url":"https://msme.gov.in/sites/default/files/PCRSchemeGuidelines.pdf"},{"title":"Complete rating and reimbursement steps","description":"Submit through the official route, retain the report and file any eligible reimbursement claim under the current process.","url":"https://my.msme.gov.in/MyMsmeMob/MsmeScheme/Pages/1_2_0.html"}],
        "window_type":"rolling",
        "window_label":"The rating route is described as ongoing, but agency availability and reimbursement terms require current confirmation.",
        "window_evidence":{"source_url":"https://msme.gov.in/sites/default/files/PCRSchemeGuidelines.pdf","anchor":"Approach for rating of SSI units; Selection of the rating agency"}
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
