-- Closed historical MoCA drone PLI record. Preserve for research and prior
-- claim history; do not recommend as a current application.

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
        "slug":"moca-production-linked-incentive-drones-components-closed",
        "name":"Production Linked Incentive Scheme for Drones and Drone Components (Closed)",
        "type":"subsidy",
        "status":"closed",
        "authority":"Ministry of Civil Aviation - Drone PLI",
        "authority_url":"https://www.civilaviation.gov.in/",
        "canonical_url":"https://www.civilaviation.gov.in/ministry-documents/notifications/pli-scheme-drones-and-drone-components-0",
        "source_url":"https://www.civilaviation.gov.in/sites/default/files/2024-04/PLI%20Scheme%20Drones%20and%20Drone%20Components.pdf",
        "source_kind":"gazette",
        "source_title":"PLI Scheme Drones and Drone Components",
        "source_anchor":"Eligibility, turnover thresholds, FY 2021-22 to FY 2023-24 tenure, 20% rate, 40% value addition, outlay and per-manufacturer cap",
        "summary":"Closed production-linked incentive route for qualifying Indian manufacturers of drones and drone components, retained for historical research, prior-claim context and future successor-scheme comparison.",
        "objective":"Incentivise domestic manufacturing of drones and drone components and build a globally competitive Indian drone ecosystem.",
        "legal_basis":"Ministry of Civil Aviation PLI scheme notification and operational guidelines for drones and drone components, with later guideline/amendment pages requiring reconciliation.",
        "eligibility":{"entity_types":["company_registered_in_india","manufacturer","msme","startup","software_developer_for_drone_components"],"lifecycle_stages":["manufacturing","scaling","operating"],"industries":["drones","drone_components","aerospace","robotics","electronics","software"],"locations":["India"],"conditions":["applicant must be a company registered in India and manufacture qualifying drones or drone components","eligible products include drones, airframes, propulsion, power systems, batteries, navigation, control, communication, cameras, sensors, spraying/payload and safety components; the list may change","Indian MSME/startup annual sales turnover threshold was INR 2 crore for drones and INR 0.5 crore for components","Indian non-MSME annual sales turnover threshold was INR 4 crore for drones and INR 1 crore for components","component manufacturer must establish that the component is used solely in drone manufacturing","eligible value addition in India must reach at least 40% of eligible sales turnover for the relevant financial year"],"thresholds":{"msme_startup_drone_turnover_inr":20000000,"msme_startup_component_turnover_inr":5000000,"non_msme_drone_turnover_inr":40000000,"non_msme_component_turnover_inr":10000000,"minimum_indian_value_addition_percent":40,"pli_rate_percent":20,"scheme_outlay_inr":1200000000,"maximum_pli_per_manufacturer_inr":300000000,"scheme_tenure_end_fy":"2023-24","last_claim_date":"2025-02-15"},"unknown_handling":"needs_information"},
        "exclusions":["new applications or claims after the official scheme tenure/claim deadline unless a current successor or extension is separately notified","treating the INR 120 crore total outlay as an applicant entitlement","calculating incentive on gross sales rather than eligible value addition in India","treating the 20% rate as unconditional where the 40% value-addition threshold or other conditions fail","components not established as used solely in drone manufacturing","duplicate benefits or submissions contrary to the scheme and PMA review"],
        "application":{"portal":"https://plidrone.ifciltd.com/","route":"Historical route: company application through the IFCI Project Management Agency portal, followed by annual incentive claims and supporting evidence; the portal currently states that FY 2023-24 claim submissions closed on 15 February 2025.","selection":"IFCI PMA/MoCA eligibility appraisal and claim verification under the scheme guidelines.","fees":"The guidelines refer to an application fee; the exact historical amount and any current successor route require review.","applicant_note":"UdyamVeda may explain the closed route and prepare historical claim evidence, but must not imply current eligibility, store credentials or submit on behalf of an applicant."},
        "fine_print":{"closed_status":"The official IFCI portal states the scheme tenure was FY 2021-22 to FY 2023-24 and the last date for FY 2023-24 incentive claim applications was 15 February 2025; this record is closed as of the current audit.","calculation":"Eligible PLI was 20% of eligible value addition in India, subject to at least 40% value addition of eligible sales turnover and annual claim/disbursement rules.","caps":"The scheme notification states total financial outlay of INR 120 crore and a total PLI cap of INR 30 crore per manufacturer; payout could be reduced pro rata if the budget was exceeded.","amendment_boundary":"MoCA published a guideline-amendment page in July 2025 and a guideline page in March 2025. Their details must be extracted and reconciled before treating any amendment as an extension or successor route.","outcome_boundary":"MoCA's 2025-26 annual report reports aggregate utilization/outcomes; aggregate utilization is not a new applicant window or individual entitlement.","documents":"Historical application/claim evidence includes company registration, product and manufacturing evidence, GST returns, eligible sales and purchase records, value-addition calculations, auditor/CA or other certificates and PMA-requested supporting documents; the exact historical checklist requires review.","review_note":"Human review must confirm the amendment text, closure date, final claim status, eligible-product list, turnover category, value-addition calculation, duplicate-benefit rule, PMA records and whether a current successor programme exists before showing this record to a user."},
        "benefit_summary":{"types":["subsidy","reimbursement"],"summary":"Historical incentive of 20% of eligible value addition in India for qualifying drone/drone-component manufacturers, subject to a 40% value-addition threshold and a INR 30 crore per-manufacturer cap; closed.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Historical 20% PLI on eligible Indian value addition (closed)",
        "amount_max":300000000,
        "percentage":20,
        "benefit_conditions":{"minimum_value_addition_percent":40,"maximum_pli_per_manufacturer_inr":300000000,"scheme_outlay_inr":1200000000,"closed_for_new_claims":true,"historical_record_only":true},
        "requirement":"Historical qualifying manufacturer and closed-period claim evidence",
        "requirement_description":"For research or prior-claim support, retain company registration, qualifying product/manufacturing records, GST sales and purchase returns, eligible value-addition calculation, threshold evidence, auditor/CA/PMA documents and the claim acknowledgement or disbursement record.",
        "rules":{"all":[{"field":"indian_company_manufacturing_qualifying_drone_or_component","operator":"equals","value":true},{"field":"turnover_threshold_met_for_applicant_category","operator":"equals","value":true},{"field":"eligible_value_addition_percent","operator":"greater_than_or_equal","value":40},{"field":"claim_period_and_scheme_status_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check whether the record is historical or a successor route","description":"Confirm that the user is asking about a prior claim, audit or successor programme; do not recommend this closed route as a current application.","url":"https://plidrone.ifciltd.com/"},{"title":"Reconcile the final official scheme terms","description":"Review the Gazette, guidelines and 2025 amendment page for the applicable product, category, value-addition, cap and claim period.","url":"https://www.civilaviation.gov.in/index.php/ministry-documents/guidelines/amendment-pli-guidelines"},{"title":"Assemble historical claim evidence","description":"Collect the company, product, GST, sales, purchase, value-addition and PMA records needed for a historical claim or audit response.","url":"https://www.civilaviation.gov.in/sites/default/files/migration/Guidelines%20for%20the%20Operation%20of%20Production%20Linked%20Incentive%20Scheme%20%28PLI%29%20fro%20Drones%20and%20Drone%20Components%20%281%29.pdf"},{"title":"Use official support for a historical query","description":"Contact the implementing agency or Ministry only for a prior-claim/status question, and separately search for any current replacement scheme.","url":"https://plidrone.ifciltd.com/"}],
        "window_type":"fixed",
        "window_close_at":"2025-02-15T23:59:59+05:30",
        "window_label":"Closed: the IFCI implementing portal states 15 February 2025 as the final date for FY 2023-24 incentive claim applications; scheme tenure was FY 2021-22 to FY 2023-24.",
        "window_evidence":{"source_url":"https://plidrone.ifciltd.com/","anchor":"What's New: last date for FY 2023-24 incentive claim applications 15 February 2025; scheme tenure FY 2021-22 to FY 2023-24"},
        "review_note":"Keep status closed and historical. Do not recommend it for a new applicant unless an official current successor or extension is separately identified and reviewed."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Civil Aviation', 'Ministry of Civil Aviation', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;

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
      (version_id, 'https://plidrone.ifciltd.com/', 'agency', 'IFCI drone PLI implementing portal', 'Closure date, tenure and historical route', now(), false),
      (version_id, 'https://www.civilaviation.gov.in/ministry-documents/guidelines/guidelines-pli-drones-and-drone-components', 'ministry', 'MoCA drone PLI 2025 guideline page', 'Current guideline page and document date', now(), false),
      (version_id, 'https://www.civilaviation.gov.in/index.php/ministry-documents/guidelines/amendment-pli-guidelines', 'ministry', 'MoCA drone PLI guideline amendment page', 'July 2025 amendment requires reconciliation', now(), false),
      (version_id, 'https://www.civilaviation.gov.in/sites/default/files/migration/Guidelines%20for%20the%20Operation%20of%20Production%20Linked%20Incentive%20Scheme%20%28PLI%29%20fro%20Drones%20and%20Drone%20Components%20%281%29.pdf', 'guideline', 'MoCA drone PLI operational guidelines', 'Application, claim and disbursement requirements', now(), false),
      (version_id, 'https://www.civilaviation.gov.in/sites/default/files/2026-04/annual-report-english-2025-moca.pdf', 'ministry', 'MoCA Annual Report 2025-26 drone PLI outcome', 'Aggregate utilization and drone-sector context; not a new window', now(), false)
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
