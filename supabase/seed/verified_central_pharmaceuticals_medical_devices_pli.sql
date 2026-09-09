-- Production Linked Incentive Scheme for Promoting Domestic Manufacturing of
-- Medical Devices. Separate from Pharmaceuticals and Bulk Drugs PLI records.

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
        "slug":"production-linked-incentive-medical-devices",
        "name":"Production Linked Incentive Scheme for Promoting Domestic Manufacturing of Medical Devices",
        "type":"manufacturing_incentive",
        "authority":"Department of Pharmaceuticals",
        "authority_url":"https://pharmaceuticals.gov.in/",
        "canonical_url":"https://pharmaceuticals.gov.in/",
        "source_url":"https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20-%20MD%20dated%2025.02.2023.pdf",
        "source_kind":"guideline",
        "source_title":"Revised Guidelines of PLI Scheme for Medical Devices, 25 February 2023",
        "source_anchor":"Pages 1-10 and target-segment/claim provisions: applicant, greenfield project, four target segments, incentive calculation and disbursement",
        "summary":"A production-linked incentive route for selected Indian companies manufacturing covered medical devices in four target segments through greenfield projects, with incentive based on incremental sales and subject to approval and claim verification.",
        "objective":"Boost domestic manufacturing of selected medical devices, attract investment and offset manufacturing disadvantages through performance-linked support.",
        "legal_basis":"Department of Pharmaceuticals Gazette Notification no. 31026/08/2020-MD dated 21 July 2020 and revised implementation guidelines dated 25 February 2023, read with subsequent official implementation reporting.",
        "eligibility":{"entity_types":["company","private_limited","public_limited","medical_device_manufacturer"],"lifecycle_stages":["new_project","growth","scaling","manufacturing_expansion"],"industries":["medical_devices","healthcare_equipment","diagnostic_devices","radiology","implants","medical_electronics"],"locations":["India"],"conditions":["the applicant is a company registered in India and proposes to manufacture covered goods","the product falls within one of the four target segments: cancer care/radiotherapy, radiology/imaging and nuclear imaging, anaesthetics/cardio-respiratory including renal care, or implants including implantable electronic devices","the project is greenfield and satisfies the applicable investment and sales conditions","the applicant is selected/approved under the scheme and follows the PMA and Department route","medical-device regulatory, quality, manufacturing, audit and claim evidence is available","the current claim or selected-participant status is confirmed before any recommendation is shown as actionable"],"thresholds":{"scheme_period":"FY 2020-21 to FY 2027-28","incentive_period":"FY 2022-23 to FY 2026-27","incentive_rate":"5% of incremental sales of covered medical devices manufactured in India","financial_outlay_inr":34200000000,"minimum_investment_over_three_years_inr":1800000000,"category_a_incentive_cap_inr_per_applicant":12100000000,"category_b_incentive_cap_inr_per_applicant":4000000000,"target_segments":["cancer_care_radiotherapy","radiology_imaging_nuclear_imaging","anaesthetics_cardio_respiratory_renal_care","implants_and_implantable_electronics"]},"unknown_handling":"needs_information"},
        "exclusions":["businesses that do not manufacture products in an identified target segment","brownfield projects where the current guidelines require a greenfield project","ordinary medical-device trading, distribution or import activity without eligible Indian manufacturing","incremental sales that do not satisfy the covered-product, India-manufacturing and verification conditions","the scheme outlay or per-applicant cap is not a guaranteed entitlement without selection and eligible claims","historic application availability must not be represented as a current open application call","claims without the prescribed PMA, financial, production, sales, regulatory and audit evidence"],
        "application":{"portal":"https://pharmaceuticals.gov.in/","route":"Confirm the current Department/PMA status, map the medical device to the target segment, verify project and investment conditions, and use the official application or claim route available to approved participants","applicant_note":"UdyamVeda can explain product segments, prepare readiness checklists and identify missing claim evidence; the applicant must submit through the official route and remain responsible for regulatory and financial representations","fees":"Confirm current application, certification, PMA, professional and regulatory charges from the official route","selection":"Technical and financial appraisal, selection/approval by the competent route, bank-guarantee and project conditions, followed by incremental-sales claim verification"},
        "fine_print":{"target_segments":"Four target segments are separately identified: cancer care/radiotherapy; radiology and imaging including nuclear imaging; anaesthetics and cardio-respiratory devices including catheters and renal care; and implants including implantable electronic devices.","greenfield_only":true,"rate":"The official implementation report describes 5% of incremental sales of eligible medical devices manufactured in India for five years.","caps":"The official implementation report records Category A and Category B caps of INR 121 crore and INR 40 crore per applicant respectively; category assignment and controlling guideline must be verified for the specific applicant.","investment":"The official reporting records a minimum investment threshold of INR 180 crore over three years, subject to the controlling guideline and project category conditions.","claim_process":"Claims may be quarterly or half-yearly subject to the PMA, eligible criteria, verification and prescribed documents; a selected applicant does not receive incentive automatically.","status":"The official 2023-24 report records approved participants and released incentive, indicating an implementation/claim phase rather than a generic open call. Current new-applicant status must be checked.","recovery":"Undertakings, bank guarantees, false/incomplete information, regulatory non-compliance and failure to meet milestones can affect disbursement or recovery.","review_note":"Confirm current selected-participant/claim status, product classification, target segment, greenfield definition, investment threshold, incremental-sales calculation, applicant cap, PMA route, bank guarantee, regulatory approvals, claim timing, audit evidence and recovery terms before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential 5% performance-linked support on eligible incremental sales for selected Indian medical-device manufacturers in the four target segments, subject to applicant caps and claim verification.","separate_value_buckets":true},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"PLI support for selected medical-device manufacturing",
        "benefit_conditions":{"selected_applicant_required":true,"target_segment_required":true,"greenfield_project_required":true,"incremental_sales_required":true,"claim_verification_required":true,"applicant_cap_applies":true,"scheme_outlay_not_individual_entitlement":true},
        "requirement":"Target-segment product, greenfield project and incremental-sales evidence",
        "requirement_description":"Prepare Indian-company and manufacturing evidence, product classification, greenfield project and investment plan, regulatory/quality records, sales and incremental-sales calculations, PMA forms, statutory-auditor evidence, bank guarantee and claim documents.",
        "rules":{"all":[{"field":"is_registered_indian_company","operator":"equals","value":true},{"field":"eligible_medical_device_target_segment_identified","operator":"equals","value":true},{"field":"greenfield_project_confirmed","operator":"equals","value":true},{"field":"current_pma_or_claim_route_confirmed","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the device and target segment","description":"Map the proposed product to the controlling four-segment list and confirm medical-device regulatory classification.","url":"https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20-%20MD%20dated%2025.02.2023.pdf"},{"title":"Confirm current participant and claim route","description":"Check the Department portal and PMA route; do not treat historical application windows or approved-participant reporting as a new open call.","url":"https://pharmaceuticals.gov.in/"},{"title":"Prepare project and investment evidence","description":"Document the greenfield project, minimum investment, manufacturing location, quality/regulatory approvals and implementation milestones.","url":"https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20Medical%20Devices%20dated%2018.08.2022_0_0.pdf"},{"title":"Prepare sales and claim evidence","description":"Build the incremental-sales calculation and gather PMA forms, audited financials, production, domestic-manufacturing and eligible-product evidence before claiming.","url":"https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf"},{"title":"Submit and retain audit records","description":"Use the current official claim route, retain approvals, bank-guarantee and verification evidence, and monitor recovery or clawback conditions.","url":"https://pharmaceuticals.gov.in/"}],
        "window_type":"closed_or_claim_only",
        "window_label":"The scheme framework runs through FY 2027-28 and the reported incentive period through FY 2026-27, but historical applications and selected participants are already recorded in official reporting. Treat new-applicant availability as unconfirmed until the current Department/PMA route is reviewed; continuing claim obligations may remain for approved participants.",
        "window_evidence":{"source_url":"https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf","anchor":"Annual Report 2023-24, section 3.1.2 and Table 3C: scheme period, incentive period, rate, applicant caps and implementation status"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Chemicals and Fertilizers', 'Department of Pharmaceuticals', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true)
    on conflict do nothing;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20Medical%20Devices%20dated%2018.08.2022_0_0.pdf', 'guideline', 'Department of Pharmaceuticals Medical Devices PLI 2022 guidelines', 'Earlier revised implementation guidance and comparison evidence', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf', 'annual_report', 'Department of Pharmaceuticals Annual Report 2023-24', 'Medical Devices PLI implementation, caps, rate and claims', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'Department of Pharmaceuticals official portal', 'Current notices, status and route', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'manufacturing', item->>'requirement', item->>'requirement_description', true)
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
