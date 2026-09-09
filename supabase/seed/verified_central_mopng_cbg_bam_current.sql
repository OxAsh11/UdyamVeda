-- Review-gated MoPNG CBG Biomass Aggregation Machinery assistance.

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
        "slug":"mopng-cbg-biomass-aggregation-machinery",
        "name":"Financial Assistance to CBG Producers for Biomass Aggregation Machinery (BAM)",
        "type":"grant",
        "authority":"Ministry of Petroleum and Natural Gas - CBG/BAM",
        "authority_url":"https://mopng.gov.in/",
        "canonical_url":"https://mopng.gov.in/files/natural-gas/policies-and-guidelines/Revised-scheme-guideline.pdf",
        "source_url":"https://mopng.gov.in/files/natural-gas/policies-and-guidelines/Revised-scheme-guideline.pdf",
        "source_kind":"guideline",
        "source_title":"Scheme Guidelines for providing financial assistance to Compressed Bio Gas producers for procurement of biomass aggregation machinery",
        "source_anchor":"Revised 2025 guideline; funding pattern, eligibility, procedure, documents and beneficiary responsibilities",
        "summary":"Project-specific grant for eligible CBG producers to procure approved biomass aggregation machinery for collecting agricultural-residue feedstock.",
        "objective":"Support biomass aggregation and marketing, reduce open burning of surplus biomass, create farmer income opportunities and strengthen biomass-based CBG plants.",
        "legal_basis":"Ministry of Petroleum and Natural Gas scheme guidelines for financial assistance to CBG producers for biomass aggregation machinery, including the revised 2025 guideline.",
        "eligibility":{"entity_types":["compressed_bio_gas_producer","company","project_developer","joint_venture","special_purpose_vehicle","partnership","limited_liability_partnership"],"lifecycle_stages":["upcoming_plant","under_construction","commissioned","operating"],"industries":["compressed_bio_gas","bioenergy","biomass_aggregation","circular_economy","waste_to_energy"],"locations":["India"],"conditions":["the CBG project must use at least 50% agricultural-residue biomass as feedstock according to the DPR","installed or proposed CBG capacity must be at least 2 TPD","the CBG project must be registered on the GOBARdhan portal","an under-construction project must have at least 50% physical progress as per the DPR","the applicant must apply before procuring the biomass aggregation machinery","the same machinery must not receive another Central or State subsidy/assistance"],"thresholds":{"minimum_cbg_capacity_tpd":2,"minimum_agri_residue_feedstock_percent":50,"minimum_under_construction_physical_progress_percent":50,"maximum_financial_assistance_percent_of_procurement_cost":50,"maximum_financial_assistance_per_bam_set_inr":9000000,"indicative_4_tpd_assistance_inr":18000000,"maximum_assistance_per_project_inr":90000000,"scheme_outlay_inr":5647500000,"scheme_period_end":"2027-03-31"},"unknown_handling":"needs_information"},
        "exclusions":["CBG projects below 2 TPD","projects using less than 50% agricultural-residue biomass as feedstock under the DPR","projects not registered on GOBARdhan","machinery already purchased before applying or machinery receiving duplicate Government assistance","a generic subsidy for tractors or equipment outside the approved BAM list","treating the ₹9 crore project ceiling or scheme corpus as an automatic entitlement"],
        "application":{"portal":"https://bam.eil.co.in/","route":"Register the CBG plant on GOBARdhan where required, then apply through the designated EIL BAM portal before procuring machinery. Applications are accepted on a quarterly basis between the 1st and 30th day of the quarter; the guideline states 30 September 2026 as the last date unless extended.","selection":"PMA assesses the DPR and BAM requirement, PAC recommends, PAB approves within the available annual budget, and release follows procurement, document upload and physical verification.","fees":"No application fee is inferred from the guideline.","applicant_note":"UdyamVeda can prepare the document and readiness checklist but must not store portal credentials, sign, submit or impersonate the CBG producer."},
        "fine_print":{"assistance":"Maximum assistance is 50% of BAM procurement cost or INR 90 lakh per set, whichever is lower. The guideline describes INR 1.8 crore for a 4 TPD project with a pro-rata cap of INR 9 crore per project.","timing":"Applications are accepted quarterly from the 1st to the 30th day of the quarter; the revised guideline states 30 September 2026 as the last date or an extension date, but the official EIL BAM portal observed on 8 September 2026 displayed a 1 July to 30 July 2026 intake notice. The current window is unresolved and must not be presented as actionable.","window_reconciliation":{"guideline_last_date":"2026-09-30","portal_notice_last_date":"2026-07-30","observed_at":"2026-09-08","status":"unresolved_conflict","action":"do_not_recommend_until_authorized_reviewer_reconciles_the_current_window"},"procurement":"Approval must precede procurement. After approval, the producer purchases from an OEM or authorised dealer, uploads invoices, payment proof, equipment identifiers and photographs, and undergoes physical verification.","documents":"The guideline lists a DPR, financing or self-finance declaration, GOBARdhan certificate, non-duplication undertaking, plant photographs/geocoordinates, relevant CTO/PESO or plan/consent documents, machinery quotation and bank details.","obligations":"The beneficiary signs a five-year bond, primarily uses BAM for CBG biomass collection, maintains and insures eligible equipment above INR 5 lakh, files annual biomass-collection reports and may face recovery, benefit suspension or transfer consequences for misuse or non-compliance.","review_note":"Human review must confirm the currently open quarterly window, revised guideline version, approved machinery list, PMA/CNA route, portal availability, current documents, budget availability and any extension before publication."},
        "benefit_summary":{"types":["grant","reimbursement"],"summary":"Up to 50% of approved biomass aggregation machinery procurement cost or INR 90 lakh per set, whichever is lower, subject to a pro-rata INR 9 crore project cap and verified CBG-project conditions.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Up to 50% of approved BAM procurement cost or INR 90 lakh per set, whichever is lower; pro-rata project cap INR 9 crore",
        "amount_max":90000000,
        "percentage":50,
        "benefit_conditions":{"per_set_cap_inr":9000000,"indicative_4_tpd_assistance_inr":18000000,"project_cap_inr":90000000,"project_level_only":true,"approval_before_procurement":true,"physical_verification_required":true,"five_year_bond_required":true,"no_duplicate_subsidy":true},
        "requirement":"Eligible GOBARdhan-registered CBG project with DPR, biomass, capacity, approvals and pre-purchase readiness",
        "requirement_description":"Prepare the CBG DPR, plant/entity registration, GOBARdhan certificate, financial or lender evidence, machinery quotation from OEM/authorised dealer, non-duplication undertaking, project photographs/geocoordinates, relevant CTO/PESO/CPCB documents, bank details and declarations required for application and release.",
        "rules":{"all":[{"field":"cbg_capacity_tpd","operator":"greater_than_or_equal","value":2},{"field":"agri_residue_feedstock_percent","operator":"greater_than_or_equal","value":50},{"field":"gobardhan_registration_verified","operator":"equals","value":true},{"field":"bam_not_yet_purchased","operator":"equals","value":true},{"field":"duplicate_subsidy_on_same_machinery","operator":"equals","value":false},{"field":"current_bam_application_window_open_or_extension_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the CBG project and GOBARdhan registration","description":"Confirm the project DPR, at least 2 TPD capacity, 50% agricultural-residue feedstock, applicable physical progress and GOBARdhan registration.","url":"https://gobardhan.eil.co.in/petroleum_ministry"},{"title":"Prepare the BAM and financial documents","description":"Prepare the DPR, eligible machinery requirement, quotations, lender/self-finance evidence, non-duplication undertaking, approvals, photographs and bank details.","url":"https://bam.eil.co.in/AboutSchemeNew.pdf"},{"title":"Apply before procurement","description":"Submit through the EIL BAM portal during the current quarterly window and retain the versioned application record. Do not buy the machinery before approval.","url":"https://bam.eil.co.in/"},{"title":"Complete procurement and verification","description":"After approval, procure from an authorised OEM/dealer, upload invoices and equipment identifiers, support physical verification and apply for release of assistance.","url":"https://mopng.gov.in/files/natural-gas/policies-and-guidelines/Revised-scheme-guideline.pdf"}],
        "window_type":"fixed",
        "window_close_at":"2026-09-30T23:59:59+05:30",
        "window_label":"Quarterly intake; the guideline states 30 September 2026 as the last date for applications unless extended. Verify the EIL BAM portal for the currently open window before recommending.",
        "window_evidence":{"source_url":"https://gobardhan.sbm.gov.in/whats-new/1752042813_2a6f019a8e6186349c85.pdf","anchor":"Guideline paragraphs 5.1-5.2, especially quarterly intake and last date"},
        "review_note":"Keep review-gated and deadline-sensitive. Do not show assistance as approved, universal or available for machinery already purchased. Verify the live quarterly window and any extension."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Petroleum and Natural Gas', 'Ministry of Petroleum and Natural Gas', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.9, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://mopng.gov.in/en/natural-gas/policies-guidelines', 'ministry_portal', 'MoPNG natural-gas policies and guidelines index', 'Revised BAM guideline listing', now(), false),
      (version_id, 'https://gobardhan.sbm.gov.in/whats-new/1752042813_2a6f019a8e6186349c85.pdf', 'guideline', 'MoPNG BAM guideline copy hosted by GOBARdhan', 'Eligibility, funding, procedure and obligations', now(), false),
      (version_id, 'https://bam.eil.co.in/', 'application_portal', 'EIL BAM application portal', 'Designated application portal', now(), false),
      (version_id, 'https://gobardhan.eil.co.in/petroleum_ministry', 'application_portal', 'GOBARdhan unified CBG registration portal', 'Plant registration and BAM route', now(), false),
      (version_id, 'https://mopng.gov.in/en/pdc/investible-projects/alternate-fuels/sustainable-alternative-towards-affordable-transportation', 'scheme_page', 'MoPNG SATAT overview', 'CBG producer and entrepreneur context', now(), false)
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
