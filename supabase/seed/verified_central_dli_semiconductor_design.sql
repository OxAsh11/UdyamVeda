-- Design Linked Incentive (DLI) Scheme for domestic semiconductor design.
-- The scheme is structured from the MeitY notification and current DLI portal;
-- it remains in_review until current intake, amendments and applicant evidence
-- are checked by an authorized reviewer.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY Design Linked Incentive Scheme Gazette notification', 'https://www.meity.gov.in/static/uploads/2024/02/Notification-Design-Linked-Incentive-Scheme.pdf', 'gazette', 'central', 'monthly', 1, true, 'Primary notification for DLI objective, eligibility, tenure, incentive components, C-DAC implementation and disbursement boundaries.'),
  ('DLI official FAQ and current portal', 'https://chips-dli.gov.in/DLI/Faq', 'agency_portal', 'central', 'weekly', 1, true, 'Current DLI portal FAQ for applicant categories, support ceilings, application fee and current infrastructure route.'),
  ('DLI official home page', 'https://chips-dli.gov.in/DLI/HomePage', 'agency_portal', 'central', 'weekly', 1, true, 'Official DLI portal landing page and current programme boundary.'),
  ('DLI application route', 'https://chips-dli.gov.in/DLI/applyforDLI', 'agency_portal', 'central', 'weekly', 1, true, 'Official registration, DPR, fee and application handoff for DLI.'),
  ('MeitY Design Linked Incentive guidelines', 'https://www.meity.gov.in/writereaddata/files/Guidelines%20for%20Design%20Linked%20Incentive%20%28DLI%29%20Scheme%20-%2030.12.2022.pdf', 'guideline', 'central', 'monthly', 1, true, 'Operational guideline for eligible expenditure, application, appraisal, approval and disbursement.'),
  ('DLI official downloads and support resources', 'https://chips-dli.gov.in/DLI/DownLoads', 'agency_portal', 'central', 'monthly', 1, true, 'Official DLI list of Gazette notification, guidelines, FAQ, thresholds and proposal templates.')
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
    select value from jsonb_array_elements($records$[
      {
        "slug":"design-linked-incentive-semiconductor-design",
        "name":"Design Linked Incentive (DLI) Scheme",
        "type":"subsidy",
        "status":"in_review",
        "authority":"Ministry of Electronics and Information Technology (MeitY)",
        "authority_url":"https://www.meity.gov.in/",
        "canonical_url":"https://chips-dli.gov.in/DLI/HomePage",
        "source_url":"https://www.meity.gov.in/static/uploads/2024/02/Notification-Design-Linked-Incentive-Scheme.pdf",
        "source_kind":"gazette",
        "source_title":"MeitY Design Linked Incentive Scheme Gazette notification",
        "source_anchor":"Pages 6-8, paragraphs 2-11: objectives, eligibility, tenure, Product Design Linked Incentive, Deployment Linked Incentive, design infrastructure, C-DAC implementation and disbursement",
        "summary":"Financial incentives and design-infrastructure support for eligible domestic companies, startups and MSMEs developing and deploying semiconductor designs in India.",
        "objective":"Strengthen India's semiconductor design ecosystem, support domestic design companies and improve access to design infrastructure for startups and MSMEs.",
        "legal_basis":"Design Linked Incentive Scheme notified by MeitY in the Gazette of India on 21 December 2021, with operational guidelines issued by MeitY and C-DAC as nodal agency.",
        "eligibility":{"entity_types":["domestic_company","startup","msme"],"lifecycle_stages":["prototype","product_development","validation","volume_production","growth"],"industries":["semiconductor_design","integrated_circuits","chipsets","system_on_chip","systems_ip_cores","electronics_design"],"locations":["India"],"conditions":["the applicant must be a domestic company, startup or MSME under the applicable current definition","the applicant must be engaged in eligible semiconductor design for ICs, chipsets, SoCs, systems and IP cores or semiconductor-linked design","a domestic company must satisfy the applicable resident-Indian ownership condition","the proposal must satisfy the relevant product-design or deployment-linked component and milestone conditions","approved applicants must retain the required domestic status after claiming incentives"],"thresholds":{"domestic_ownership_min_percent":50,"product_design_reimbursement_max_percent":50,"product_design_per_application_max_inr":150000000,"deployment_incentive_min_percent":4,"deployment_incentive_max_percent":6,"deployment_per_application_max_inr":300000000,"deployment_period_years":5,"application_fee_inr":10000},"unknown_handling":"needs_information"},
        "exclusions":["the scheme notification or total outlay is not an individual applicant entitlement","EDA access, IP repository, prototyping and post-silicon services must not be represented as a cash grant","the Product Design Linked Incentive and Deployment Linked Incentive are separate components and their ceilings must not be combined","approval, milestone achievement, eligible expenditure, net-sales evidence and C-DAC verification are required before disbursement","the initial application tenure and any current intake, extension or amendment require live verification","an application fee, registration or portal account does not guarantee approval or incentive"],
        "application":{"portal":"https://chips-dli.gov.in/DLI/applyforDLI","route":"Register on the official DLI portal, prepare the detailed project report and submit the applicable component application after confirming the current call, fee and guideline version.","selection":"C-DAC receives and appraises applications, verifies eligibility and milestones, approves selected applicants and verifies claims for disbursement.","fees":"The current DLI FAQ states a registration fee of INR 10,000; confirm the live portal instruction before payment.","applicant_note":"UdyamVeda can prepare the company, ownership, design, DPR, eligible-expenditure and milestone checklist, but cannot create portal credentials, pay the fee, submit confidential design material or promise approval."},
        "fine_print":{"product_design":"The notification provides reimbursement of up to 50% of eligible expenditure subject to a ceiling of INR 15 crore per application for approved semiconductor-design proposals that can be demonstrated in an operational environment and are ready for volume production.","deployment":"The notification provides a 4%-6% incentive on net sales turnover over five years subject to a ceiling of INR 30 crore per application for approved designs deployed in electronic products.","infrastructure":"C-DAC design infrastructure includes the National EDA Tool Grid, IP-core repository, MPW prototyping and post-silicon validation support; these are separate infrastructure-support benefits.","disbursement":"Fiscal support is reimbursement-based and tied to approval-letter milestones; deployment claims may be submitted after the end of each financial year and are verified by C-DAC.","ownership":"Domestic-company ownership, startup/MSME definitions, continued domestic status and eligible semiconductor design scope must be checked against the applicable current norms.","window":"The Gazette initially opened applications for three years from 1 January 2022; the current DLI portal displays infrastructure-support and application routes, but the live component intake, call status and any extension must be verified before publication.","review_note":"Confirm the current PDLI and deployment intake, current guideline version, DLI call, fee, eligible expenditure, net-sales methodology, milestones, claim documents, ownership, amendments, current portal behavior and grievance route before approval."},
        "benefit_summary":{"types":["reimbursement","performance_incentive","design_infrastructure_support"],"summary":"Separate Product Design reimbursement, Deployment Linked Incentive and non-cash design-infrastructure support; component ceilings and values must never be combined into one eligible amount.","separate_value_buckets":true,"components":[{"name":"Product Design Linked Incentive","type":"reimbursement","rate":"up_to_50_percent_of_eligible_expenditure","maximum_inr":150000000},{"name":"Deployment Linked Incentive","type":"performance_incentive","rate":"4_to_6_percent_of_net_sales_turnover_over_5_years","maximum_inr":300000000},{"name":"Design infrastructure","type":"non_financial_support","items":["National EDA Tool Grid","IP Core Repository","MPW Prototyping","Post-Silicon Validation"]}]},
        "benefit_type":"component_specific_semiconductor_design_support",
        "benefit_label":"DLI semiconductor-design support: separate product-design reimbursement, deployment incentive and infrastructure access",
        "benefit_conditions":{"product_design_max_percent":50,"product_design_max_inr":150000000,"deployment_rate_range_percent":"4-6","deployment_max_inr":300000000,"deployment_period_years":5,"reimbursement_basis":true,"milestone_verification_required":true,"c_dac_nodal_agency":true,"separate_value_buckets":true},
        "requirement":"Eligible domestic semiconductor-design company, startup or MSME with a current DLI component-fit proposal",
        "requirement_description":"Prepare incorporation and ownership evidence, DPIIT or MSME status where applicable, semiconductor design description, detailed project report, eligible expenditure or deployment plan, product/deployment evidence, financial records, milestones and current portal forms.",
        "rules":{"all":[{"field":"domestic_semiconductor_design_entity_verified","operator":"equals","value":true},{"field":"eligible_dli_component_verified","operator":"equals","value":true},{"field":"dli_dpr_and_milestone_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the DLI component and current intake","description":"Decide whether the need is Product Design reimbursement, Deployment Linked Incentive or design-infrastructure access, and confirm the current official route and window.","url":"https://chips-dli.gov.in/DLI/Faq"},{"title":"Verify applicant and semiconductor-design scope","description":"Check domestic ownership, startup/MSME status, eligible design category, deployment or volume-production readiness and current definitions.","url":"https://www.meity.gov.in/static/uploads/2024/02/Notification-Design-Linked-Incentive-Scheme.pdf"},{"title":"Prepare the DPR and application evidence","description":"Prepare the detailed project report, applicant details, fee evidence, design plan, eligible expenditure or net-sales plan, milestones and supporting records.","url":"https://chips-dli.gov.in/DLI/applyforDLI"},{"title":"Submit and retain milestone evidence","description":"Submit through the official DLI portal and retain C-DAC approval, milestone, annual claim, statutory and product/deployment evidence.","url":"https://www.meity.gov.in/writereaddata/files/Guidelines%20for%20Design%20Linked%20Incentive%20%28DLI%29%20Scheme%20-%2030.12.2022.pdf"}],
        "window_type":"rolling",
        "window_label":"The official portal displays current DLI registration, application and design-infrastructure routes; the active component, call and extension status require reviewer verification before actionable recommendation.",
        "window_evidence":{"source_url":"https://chips-dli.gov.in/DLI/Faq","anchor":"FAQ items 7-10: reimbursement basis, INR 10,000 registration fee, online application and C-DAC disbursement verification"}
      }
    ]$records$::jsonb)
  loop
    select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
      values (item->>'authority', 'central', 'Ministry of Electronics and Information Technology', null, item->>'authority_url')
      returning id into authority_id;
    end if;

    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = 'in_review'
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.94, 0.90, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://chips-dli.gov.in/DLI/Faq', 'agency_portal', 'DLI official FAQ and current portal', 'Applicant categories, support ceilings, registration fee, application and C-DAC disbursement', now(), false),
      (version_id, 'https://chips-dli.gov.in/DLI/applyforDLI', 'agency_portal', 'DLI application route', 'Registration, DPR, fee and fiscal-support application procedure', now(), false),
      (version_id, 'https://www.meity.gov.in/writereaddata/files/Guidelines%20for%20Design%20Linked%20Incentive%20%28DLI%29%20Scheme%20-%2030.12.2022.pdf', 'guideline', 'MeitY Design Linked Incentive guidelines', 'Eligible expenditure, application, appraisal, approval, milestones and disbursement', now(), false),
      (version_id, 'https://chips-dli.gov.in/DLI/DownLoads', 'agency_portal', 'DLI official downloads and support resources', 'Official notification, guideline, FAQ, threshold and proposal-template index', now(), false)
    on conflict do nothing;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    values
      (version_id, 'reimbursement', 'Product Design Linked Incentive: up to 50% of eligible expenditure', 150000000, 50, jsonb_build_object('component', 'product_design', 'ceiling_per_application_inr', 150000000, 'milestone_verification_required', true)),
      (version_id, 'performance_incentive', 'Deployment Linked Incentive: 4%-6% of net sales turnover over five years', 300000000, null, jsonb_build_object('component', 'deployment', 'rate_range_percent', '4-6', 'ceiling_per_application_inr', 300000000, 'period_years', 5)),
      (version_id, 'non_financial_support', 'Design infrastructure access through C-DAC', null, null, jsonb_build_object('component', 'infrastructure', 'items', jsonb_build_array('National EDA Tool Grid', 'IP Core Repository', 'MPW Prototyping', 'Post-Silicon Validation')))
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'eligibility', item->>'requirement', item->>'requirement_description', true)
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
