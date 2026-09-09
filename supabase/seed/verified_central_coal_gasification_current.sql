-- Review-gated current Ministry of Coal project-finance opportunity.

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
        "slug":"ministry-of-coal-surface-coal-lignite-gasification",
        "name":"Scheme for Promotion of Surface Coal/Lignite Gasification Projects (2026 RFP)",
        "type":"subsidy",
        "authority":"Ministry of Coal - Surface Coal/Lignite Gasification",
        "authority_url":"https://coal.gov.in/",
        "canonical_url":"https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf",
        "source_url":"https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf",
        "source_kind":"guideline",
        "source_title":"Request for Proposal for Selection of Applicants under the Scheme for Promotion of Surface Coal/Lignite Gasification Projects",
        "source_anchor":"Request for Proposal (RFP); Scheme for Promotion of Surface Coal/Lignite Gasification Projects; 1.1 Background of the Scheme; 1.2 Key Features of the Scheme",
        "summary":"Competitive Ministry of Coal financial-incentive route for eligible PSUs, private companies, JVs and consortia setting up new surface coal/lignite gasification projects in India.",
        "objective":"Accelerate surface coal/lignite gasification, promote value-added syngas and downstream products, reduce import dependence and support the national coal-gasification target.",
        "legal_basis":"Scheme for Promotion of Surface Coal/Lignite Gasification Projects approved by the Government of India; Ministry of Coal 2026 RFP and application notices.",
        "eligibility":{"entity_types":["public_sector_undertaking","private_company","joint_venture","consortium_up_to_three_companies"],"lifecycle_stages":["new_project","project_development","large_scale_manufacturing"],"industries":["coal_gasification","lignite_gasification","synthetic_natural_gas","methanol","ammonia","urea","dimethyl_ether","industrial_chemicals"],"locations":["India"],"conditions":["the applicant must set up a new surface coal/lignite gasification project in India","the project must produce an eligible Product under the RFP","the applicant must arrange coal/lignite, other raw materials and product offtake","the application must pass the RFP's technical, financial, responsiveness and selection process"],"thresholds":{"minimum_clean_syngas_capacity_mtpa":0.5,"minimum_applicant_net_worth_as_percent_of_project_cost":20,"maximum_consortium_members":3,"maximum_financial_incentive_percent_of_plant_and_machinery":20,"single_project_financial_incentive_cap_inr":50000000000,"applicant_group_financial_incentive_cap_inr":120000000000,"application_security_inr":5000000,"performance_security_percent_of_plant_and_machinery":3},"unknown_handling":"needs_information"},
        "exclusions":["ordinary startups, self-employed professionals or MSMEs without the qualifying project, entity, capacity, net-worth and RFP conditions","used, refurbished or transferred plant and machinery","land, site development, excluded soft costs and expenditure outside the eligible plant-and-machinery definition","producer gas intended for direct combustion where it does not qualify as Syngas under the RFP","products or further-processed end goods excluded by the RFP's Product definition","treating the total scheme outlay as an individual applicant entitlement"],
        "application":{"portal":"https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp","route":"Submit the online application through the MSTC Coal Gasification Portal and submit physical originals wherever the RFP requires them. UdyamVeda may prepare a checklist and hand off to the official portal, but must not create credentials, sign, submit or impersonate the applicant.","selection":"Round-based evaluation under the RFP, including responsiveness, technical and financial evaluation, ranking, available outlay and product/project caps. Dates are subject to official changes.","fees":"No application fee is asserted. A bank-guarantee application security of INR 50 lakh is required under the RFP.","applicant_note":"This is a complex project-finance and industrial-infrastructure route. Recommend only after project, capacity, net-worth, product, security, clearance and timeline facts are verified."},
        "fine_print":{"scope":"The 2026 RFP covers new surface coal/lignite gasification projects and eligible downstream products such as SNG, urea, ammonium nitrate, methanol, DME and other chemicals, subject to the RFP definition.","benefit":"Financial incentive is a maximum 20% of eligible Cost of Plant and Machinery, capped at INR 500 crore per project, INR 900 crore per product across approved projects except urea and SNG, and INR 1200 crore per applicant including group companies across projects. These are caps, not guaranteed awards.","milestones":"The incentive is disbursed in four equal instalments after verified milestones: pre-implementation readiness, financing/equity and eligible expenditure, commissioning, and sustained production at the stated threshold.","security":"The RFP requires INR 50 lakh application security and a 3% performance security of the stated Plant and Machinery cost after selection, with further insurance surety/bank-guarantee obligations around disbursement.","deadline":"The current Round-1 timeline states an application due date of 07 September 2026; the Ministry's 01 September notice specifies online submission plus physical documents, where applicable, by 5:00 PM on that date. The RFP says timelines are tentative and changes are communicated through the Ministry website.","review_note":"Human review must reconcile the current RFP, opening notice, corrigenda, product list, portal instructions, applicant security, eligible cost, milestones, performance/security consequences, environmental and other statutory clearances before publication."},
        "benefit_summary":{"types":["reimbursement","subsidy"],"summary":"Competitive project-level financial incentive of up to 20% of eligible Plant and Machinery cost, subject to a INR 500 crore single-project cap and all RFP conditions.","separate_value_buckets":true},
        "benefit_type":"reimbursement",
        "benefit_label":"Up to 20% reimbursement of eligible Plant and Machinery cost; capped at INR 500 crore per project and subject to competitive selection",
        "amount_max":50000000000,
        "percentage":20,
        "benefit_conditions":{"project_level_only":true,"maximum_percent_of_plant_and_machinery":20,"single_project_cap_inr":50000000000,"product_cap_inr":9000000000,"applicant_group_cap_inr":120000000000,"four_equal_milestone_instalments":true,"application_security_inr":5000000,"performance_security_percent":3,"not_a_general_msmE_grant":true},
        "requirement":"Qualifying new gasification project with RFP-ready entity, capacity, net worth, product, financing, approvals and security",
        "requirement_description":"Prepare the signed application and annexures, entity and board-authority documents, consortium or JV documents where applicable, audited financial statements, net-worth evidence, project report or DPR/PFR, product and capacity details, technology and EPC information, financing and offtake evidence, statutory approvals/clearances, declarations, affidavits, application security and physical originals required by the RFP.",
        "rules":{"all":[{"field":"entity_type","operator":"in","value":["public_sector_undertaking","private_company","joint_venture","consortium_up_to_three_companies"]},{"field":"is_new_surface_coal_lignite_gasification_project","operator":"equals","value":true},{"field":"clean_syngas_capacity_mtpa","operator":"greater_than_or_equal","value":0.5},{"field":"applicant_net_worth_percent_of_project_cost","operator":"greater_than","value":20},{"field":"eligible_product_and_rfp_route_verified","operator":"equals","value":true},{"field":"current_application_window_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify that the project fits the current RFP","description":"Confirm entity class, new-project status, clean-syngas capacity, net worth, eligible product, project cost, offtake and statutory-readiness conditions.","url":"https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf"},{"title":"Prepare the RFP application and securities","description":"Prepare the annexures, DPR/PFR, audited financials, board and consortium documents, declarations, affidavits and INR 50 lakh application security. Identify all originals required for physical submission.","url":"https://coal.gov.in/sites/default/files/2026-07/07-07-2026-rpf.pdf"},{"title":"Submit through the MSTC Coal Gasification Portal","description":"Use the official MSTC portal and complete its signing and submission requirements. UdyamVeda should hand off without storing credentials or OTPs.","url":"https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp"},{"title":"Track the Round-1 deadline and official changes","description":"The current notice sets the deadline at 5:00 PM IST on 07 September 2026, but the RFP says timelines are tentative. Monitor Ministry notices and corrigenda before submission.","url":"https://www.coal.gov.in/sites/default/files/2026-09/03-09-2026b-wn.pdf"}],
        "window_type":"fixed",
        "window_close_at":"2026-09-07T17:00:00+05:30",
        "window_label":"Round-1 application due date: 07 September 2026; the Ministry notice specifies online and applicable physical submission by 5:00 PM IST. Timeline is tentative and subject to official change.",
        "window_evidence":{"source_url":"https://www.coal.gov.in/sites/default/files/2026-09/03-09-2026b-wn.pdf","anchor":"Notice dated 01 September 2026, paragraphs 1-2"},
        "review_note":"Keep review-gated and deadline-sensitive. Verify whether the deadline has been extended, whether the MSTC portal accepts submissions, and whether corrigenda or subsequent rounds change eligibility or terms before showing an active recommendation."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Coal', 'Ministry of Coal', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.9, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://www.coal.gov.in/sites/default/files/2026-09/03-09-2026b-wn.pdf', 'notice', 'Ministry of Coal opening applications notice', 'Deadline and physical-submission cutoff', now(), false),
      (version_id, 'https://www.coal.gov.in/major-statistics/national-coal-gasification-mission', 'ministry_portal', 'Ministry of Coal Coal Gasification mission page', 'Current RFP and clarification index', now(), false),
      (version_id, 'https://mstcecommerce.com/auctionhome/coalgasnew/index.jsp', 'application_portal', 'MSTC Coal Gasification Portal', 'Online application and applicant guidance', now(), false),
      (version_id, 'https://coal.gov.in/', 'ministry_portal', 'Ministry of Coal official portal', 'Official change-detection surface', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'financial', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, closes_at, label, source_evidence)
    select version_id, item->>'window_type', (item->>'window_close_at')::timestamptz, item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
