-- Production Linked Incentive Scheme for Specialty Steel.
-- This record covers the scheme and selected-company claim obligations; it
-- must not imply that a new application window is currently open.

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
        "slug":"production-linked-incentive-specialty-steel",
        "name":"Production Linked Incentive Scheme for Specialty Steel",
        "type":"production_linked_incentive",
        "authority":"Ministry of Steel",
        "authority_url":"https://steel.gov.in/",
        "canonical_url":"https://steel.gov.in/pli",
        "source_url":"https://steel.gov.in/pli",
        "source_kind":"ministry",
        "source_title":"Production Linked Incentive (PLI) Scheme for Specialty Steel in India",
        "source_anchor":"Current scheme status, PLI 1.1 rounds, selected companies and current implementation information",
        "summary":"A production-linked incentive framework for eligible Indian steel manufacturers producing specified specialty steel categories, with current material focused on selected companies, committed investment and production milestones rather than a universal new-applicant window.",
        "objective":"Help steel manufacturers identify the applicable specialty-steel product category, distinguish historical and current PLI rounds, prepare milestone and claim evidence, and avoid treating the scheme outlay or committed investment as an applicant entitlement.",
        "legal_basis":"Production Linked Incentive Scheme for Specialty Steel notified under the Ministry of Steel Gazette and governed by the applicable guidelines, amendments, Memorandum of Understanding and current Ministry notices.",
        "eligibility":{"entity_types":["company","private_limited_company","public_limited_company","group_company","joint_venture","steel_manufacturer"],"lifecycle_stages":["operating","growth","scaling","manufacturing_expansion"],"industries":["steel","specialty_steel","alloy_steel","stainless_steel","electrical_steel","automotive_steel","defence_materials","engineering_materials"],"locations":["India"],"conditions":["the applicant is an eligible Indian company or participating group/JV route under the current PLI documents","the proposed product falls within the applicable specialty-steel target segment or PLI 1.2 product sub-category","the company can demonstrate the committed investment, capacity, production, sales, technology and other scheme evidence required by the applicable round","the company has been selected or a current official application invitation is open; the current record does not assume a new window","claims are made only after the applicable investment and production commitments and verification conditions are satisfied"],"thresholds":{"original_scheme_budget_inr":63220000000,"original_guideline_period":"FY 2023-24 to FY 2029-30","annual_report_incentive_release_period":"FY 2024-25 to FY 2030-31","pli_12_incentive_rate_range_percent":"4 to 15","pli_12_incentive_period_years":5,"pli_12_start_fy":"2025-26","pli_12_disbursal_start_fy":"2026-27","pli_12_product_subcategories":22},"exclusions":["the scheme outlay, committed investment, capacity or employment figures are not an applicant benefit ceiling","a company not selected under a concluded round must not be told that it can apply through this record without a current official invitation","incentive is performance-linked and depends on approved product, investment, production, sales, reporting and verification conditions","ordinary steel products outside the applicable target categories are excluded","loan, grant, subsidy, reimbursement and PLI values must not be combined into one eligible-value figure","MoU, claim, audit, quality, environmental, labour, tax and other statutory obligations remain separate"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://steel.gov.in/pli","route":"Review the current Ministry notices and PLI documents, confirm whether a new invitation exists or the company is already selected, map the product and commitments to the applicable round, and use the notified Ministry or implementing-agency route","applicant_note":"UdyamVeda can prepare the product, investment, production, sales, employment, MoU and claim-readiness checklist, but cannot represent a company as selected or submit a Government claim on its behalf","fees":"No applicant fee is inferred from the official sources; confirm any current proposal, testing, certification, professional, banking or documentation costs separately","selection":"Application evaluation, selection, project-wise MoU, milestone monitoring and incentive claim verification under the applicable round"},
        "fine_print":{"current_rounds":{"pli_10_and_11":"The Ministry page and annual report describe concluded first and second rounds with selected companies and signed MoUs","pli_12":"The official annual report and sector overview state that PLI 1.2 launched on 4 November 2025 and describe 22 sub-categories, five years of incentives and current MoU/selection status"},"product_scope":["coated or plated steel products","high-strength or wear-resistant steel","specialty rails","alloy steel products and steel wires","electrical steel","PLI 1.2 categories such as super alloys, CRGO, stainless steel and titanium alloys subject to the current documents"],"performance_link":"Incentives are released against approved investment, production and other commitments and are assessed through claims and verification; no automatic payout is assumed.","date_reconciliation":"The 2021 guideline states FY 2023-24 to FY 2029-30, while later official annual-report material describes incentive release through FY 2030-31. Preserve both source statements and resolve the controlling current term during review.","window_status":"No current new-applicant invitation is evidenced in the current official page checked; the record is closed for new discovery until an official invitation is confirmed, while selected-company claim and reporting obligations may continue.","review_note":"Confirm current PLI 1.2 notice, selected-company status, eligible product sub-category, investment and production thresholds, incentive rate, base year, claim period, MoU, quality controls, audit and clawback conditions before publication."},
        "benefit_summary":{"types":["production_linked_incentive","manufacturing_support"],"summary":"Potential performance-linked incentive support for selected eligible specialty-steel manufacturers; rates, product categories, milestones, claim period and current eligibility depend on the applicable round and MoU.","separate_value_buckets":true},
        "benefit_type":"production_linked_incentive",
        "benefit_label":"Performance-linked support for eligible specialty-steel production",
        "benefit_conditions":{"eligible_product_required":true,"selected_round_or_current_invitation_required":true,"investment_commitment_required":true,"production_commitment_required":true,"claim_verification_required":true,"no_automatic_entitlement":true},
        "requirement":"Eligible specialty-steel product and round-specific commitment evidence",
        "requirement_description":"Prepare company, product, plant, investment, capacity, production, sales, employment, technology, quality, MoU, financial and claim evidence in the format required by the applicable PLI round and current Ministry route.",
        "rules":{"all":[{"field":"eligible_indian_steel_company","operator":"equals","value":true},{"field":"specialty_steel_target_category_identified","operator":"equals","value":true},{"field":"investment_and_production_commitment_ready","operator":"equals","value":true},{"any":[{"field":"selected_under_pli_round","operator":"equals","value":true},{"field":"current_pli_application_window_open","operator":"equals","value":true}]}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current round status","description":"Check the Ministry's current PLI page and notices to determine whether the company is selected under an existing round or whether a new invitation is open.","url":"https://steel.gov.in/pli"},{"title":"Map the specialty-steel product","description":"Map the product to the applicable target segment or PLI 1.2 sub-category and preserve the controlling round document.","url":"https://steel.gov.in/sites/default/files/2025-04/Scheme%20Guidelines_Final_Upload.pdf"},{"title":"Prepare commitment and MoU evidence","description":"Assemble company, investment, capacity, production, sales, employment, plant, technology, quality and MoU evidence required by the selected round.","url":"https://steel.gov.in/sites/default/files/2026-04/Final%20Annual%20Report%202025-26%20%28English%20Version%29.pdf"},{"title":"Confirm claims and verification","description":"Review the current claim format, incentive period, base year, milestone measurement, audit and reporting conditions before making any claim or forecast.","url":"https://steel.gov.in/sites/default/files/2026-05/An%20Overview%20of%20Steel%20Sector%20for%20the%20month%20of%20April%2C%202026.pdf"},{"title":"Use the official Ministry route","description":"Follow the current Ministry or notified implementing route and retain applications, MoU, approvals, claims, disbursements, inspection and correspondence.","url":"https://steel.gov.in/pli?page=1"}],
        "window_type":"closed",
        "window_label":"The current official material describes concluded application rounds and selected-company MoUs; no new-applicant window is asserted until a current Ministry invitation is verified. Selected-company claim and reporting obligations may continue.",
        "window_evidence":{"source_url":"https://steel.gov.in/pli","anchor":"Current status; PLI 1.1 round and selected-company MoU information"},
        "review_note":"Confirm the current PLI 1.2 invitation and selection status, product list, rate, base year, investment/production thresholds, claim period, MoU, verification and continuing obligations before approval. This record must not imply a new application opportunity."}
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Steel', 'Ministry of Steel', item->>'authority_url')
    returning id into authority_id;
    else
      update public.authorities set official_url = item->>'authority_url' where id = authority_id;
    end if;
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.85, 'in_review')
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
      (version_id, 'https://steel.gov.in/sites/default/files/2025-04/Scheme%20Guidelines_Final_Upload.pdf', 'guideline', 'Ministry of Steel PLI Specialty Steel guidelines', 'Product categories, scheme period and qualifying conditions', now(), false),
      (version_id, 'https://steel.gov.in/sites/default/files/2026-04/Final%20Annual%20Report%202025-26%20%28English%20Version%29.pdf', 'annual_report', 'Ministry of Steel 2025-26 annual report', 'PLI 1.2 launch, five-year incentive period and current implementation', now(), false),
      (version_id, 'https://steel.gov.in/sites/default/files/2026-05/An%20Overview%20of%20Steel%20Sector%20for%20the%20month%20of%20April%2C%202026.pdf', 'official_report', 'Ministry of Steel sector overview April 2026', 'PLI 1.2 applications, MoUs and disbursement context', now(), false),
      (version_id, 'https://steel.gov.in/pli?page=1', 'notice_index', 'Ministry of Steel PLI notices', 'Invitation, modification and extension notices', now(), false)
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
