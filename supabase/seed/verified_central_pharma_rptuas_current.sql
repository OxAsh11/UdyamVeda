-- Review-gated Department of Pharmaceuticals RPTUAS route.
-- The documented application/sanction cycle and current intake must be confirmed
-- before this record is shown as actionable.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals SPI scheme page', 'https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi', 'ministry_portal', 'central', 'monthly', 1, true, 'Current official scheme page listing SPI, RPTUAS guidance, FAQ and the 2026 modification.'),
  ('Department of Pharmaceuticals RPTUAS revised guidelines', 'https://pharma-dept.gov.in/sites/default/files/Revised%20guidelines%20SPI%20dated%2014.03.2024_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guidelines covering RPTUAS objectives, beneficiaries, turnover slabs and eligible activities.'),
  ('Department of Pharmaceuticals RPTUAS 2026 modification', 'https://pharma-dept.gov.in/sites/default/files/Corrigendum%20RPTUAS%2021st%20March%2C%202026_0.pdf', 'corrigendum', 'central', 'monthly', 1, true, 'Official 21 March 2026 modification to staged certification claims.'),
  ('Department of Pharmaceuticals RPTUAS FAQ', 'https://pharmaceuticals.gov.in/sites/default/files/FAQs%20in%20respect%20of%20RPTUAS%20-%20Copy.pdf', 'faq', 'central', 'monthly', 1, true, 'Official FAQ covering application route, bank boundary, eligible investment date and technical review.'),
  ('PIB RPTUAS implementation update', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224373&lang=2&reg=48', 'pib_release', 'central', 'monthly', 1, true, 'Official February 2026 implementation update with current slabs, ceiling and sanctioned-project status.');

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
        "slug":"revamped-pharmaceutical-technology-upgradation-assistance-scheme",
        "name":"Revamped Pharmaceutical Technology Upgradation Assistance Scheme (RPTUAS)",
        "type":"subsidy",
        "status":"paused",
        "lifecycle_status":"paused",
        "authority":"Department of Pharmaceuticals - RPTUAS",
        "authority_url":"https://www.pharma-dept.gov.in/",
        "canonical_url":"https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi",
        "source_url":"https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi",
        "source_kind":"ministry_portal",
        "source_title":"Department of Pharmaceuticals SPI scheme page",
        "source_anchor":"SPI page, RPTUAS guidance, 2026 modification and official FAQ links",
        "summary":"Capital subsidy route for existing Indian pharmaceutical manufacturing units to upgrade facilities toward Revised Schedule M and WHO-GMP standards. Official 2026 material continues to modify and report the scheme, but the current intake must be confirmed before showing an actionable route.",
        "objective":"Facilitate existing pharmaceutical units in upgrading manufacturing technology and facilities to meet Revised Schedule M and WHO-GMP standards.",
        "legal_basis":"Central Sector Scheme for Strengthening of Pharmaceuticals Industry (SPI), Department of Pharmaceuticals, Ministry of Chemicals and Fertilizers, with RPTUAS guidelines and subsequent official modifications.",
        "eligibility":{"entity_types":["pharmaceutical_manufacturing_unit","pharma_msme","pharma_sme"],"lifecycle_stages":["operating","scaling","exporting"],"industries":["pharmaceuticals","bulk_drugs","pharmaceutical_formulations","manufacturing"],"locations":["India"],"conditions":["Existing pharmaceutical manufacturing unit with a proven operating track record","Average turnover for the preceding three years must be below INR 500 crore","Unit must be upgrading toward Revised Schedule M and/or WHO-GMP standards","Eligible expenditure must be incurred after 01 January 2024","Current scheme intake and shortlisted-applicant status must be confirmed from the Department/SIDBI route","CA-certified expenditure and the applicable regulatory certificate are required for staged claims"],"thresholds":{"average_turnover_max_inr_exclusive":5000000000,"turnover_slab_1_min_inr":10000000,"turnover_slab_1_max_inr_exclusive":500000000,"turnover_slab_2_max_inr_exclusive":2500000000,"investment_eligibility_start":"2024-01-01","maximum_incentive_inr":20000000,"first_installment_max_inr":10000000},"unknown_handling":"needs_information"},
        "exclusions":["Units with average turnover of INR 500 crore or more are outside the stated beneficiary boundary","Upgradation solely from an existing WHO-GMP plant to higher EU-GMP or USFDA standards is outside the cited FAQ boundary","Pre-01 January 2024 expenditure is not eligible under the revised scheme evidence","RPTUAS is not a general working-capital loan or automatic reimbursement","A current application window must not be inferred from the existence of the scheme page"],
        "application":{"portal":"https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi","route":"Confirm the current Department/SIDBI intake and prepare the RPTUAS application, eligible-investment evidence, CA-certified expenditure statement, turnover evidence, facility details and applicable Revised Schedule M or WHO-GMP certification route. The official FAQ states that a unit can approach a scheduled commercial bank for a loan and that subsidy processing uses the scheme portal; verify the live portal before handoff.","selection":"The Department/Scheme Steering Committee and Project Management Consultant control shortlisting, technical review, certification and subsidy release; UdyamVeda cannot promise selection or sanction.","fees":"No universal application fee is stated in the reviewed official material; bank, certification, consultant, testing and compliance costs must be confirmed from the live route.","applicant_note":"UdyamVeda may prepare a readiness dossier and explain the route, but must not impersonate the Department, SIDBI, a bank or the applicant."},
        "fine_print":{"scope":"RPTUAS supports existing pharmaceutical units upgrading toward Revised Schedule M and WHO-GMP standards. The revised guidelines list utilities, clean rooms, testing laboratories/stability chambers, effluent treatment/waste management, consultation/certification and other Technical Committee-approved items; later official material includes production equipment within eligible activities.","benefit":"The current official 2026 implementation update reports 10% to 20% incentive slabs subject to a maximum of INR 2 crore: 20% for average turnover from INR 1 crore to below INR 50 crore, 15% from INR 50 crore to below INR 250 crore, and 10% from INR 250 crore to below INR 500 crore.","claims":"The 21 March 2026 modification allows either Revised Schedule M or WHO-GMP certification for the first staged claim, with the remaining certificate required for the second claim; CA-certified eligible expenditure remains required.","release":"The 17 September 2024 modification raised the total upper limit to INR 2 crore and the first-installment ceiling to INR 1 crore; verify the current release schedule and documents from the live Department/SIDBI workflow.","window":"The 2025-26 annual report records the application window as opened from 11 April 2024 and expected sanctioning of the remaining outlay by March 2026. Because no current public intake deadline was verified for September 2026, this record is paused and must not be presented as an open application opportunity.","review_note":"Before publication, verify current intake, portal URL, available budget, new-application status, latest modification, turnover treatment, eligible activity list, certification sequence, release documents, implementation period and any superseding notification."},
        "benefit_summary":{"types":["capital_subsidy"],"amounts":[{"turnover_band":"INR 1 crore to below INR 50 crore","percentage":20},{"turnover_band":"INR 50 crore to below INR 250 crore","percentage":15},{"turnover_band":"INR 250 crore to below INR 500 crore","percentage":10}],"maximum_inr":20000000,"summary":"Capital subsidy of 10% to 20% of eligible investment based on preceding-three-year average turnover, subject to a current official maximum of INR 2 crore; do not combine this value with loans, tax benefits or other support.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Capital subsidy of 10% to 20% of eligible pharmaceutical-upgradation investment, subject to INR 2 crore maximum",
        "amount_min":null,
        "amount_max":20000000,
        "percentage":null,
        "benefit_conditions":{"turnover_slab_1_percent":20,"turnover_slab_2_percent":15,"turnover_slab_3_percent":10,"maximum_incentive_inr":20000000,"eligible_investment_start":"2024-01-01","first_installment_max_inr":10000000,"certificate_sequence":"either Revised Schedule M or WHO-GMP first, remaining certificate for second claim"},
        "requirement":"Existing pharmaceutical manufacturing unit, preceding-three-year average turnover evidence, post-01 January 2024 eligible-investment records, CA-certified expenditure, facility-upgradation plan and applicable regulatory certification",
        "requirement_description":"Prepare entity and plant records, turnover statements for the preceding three years, eligible equipment/utilities/clean-room/testing/ETP/consultancy invoices, CA certification, project or gap-analysis material, Revised Schedule M or WHO-GMP certificate, remaining certificate for the second claim, bank/loan details where relevant and current portal declarations.",
        "rules":{"all":[{"field":"pharmaceutical_manufacturing_unit_verified","operator":"equals","value":true},{"field":"preceding_three_year_average_turnover_inr","operator":"less_than","value":5000000000},{"field":"eligible_investment_after_2024_01_01_verified","operator":"equals","value":true},{"field":"schedule_m_or_who_gmp_upgrade_scope_verified","operator":"equals","value":true},{"field":"current_rptuas_intake_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current intake and applicant boundary","description":"Verify that the Department/SIDBI route is accepting or processing the unit's application category; do not rely on the scheme page alone.","url":"https://www.pharma-dept.gov.in/schemes/scheme-strengthening-pharmaceuticals-industry-spi"},{"title":"Classify turnover and eligible investment","description":"Calculate the preceding-three-year average turnover and isolate post-01 January 2024 expenditure in eligible activities and production equipment."},{"title":"Prepare certification and technical dossier","description":"Prepare the CA-certified expenditure statement, project or gap-analysis material and the Revised Schedule M/WHO-GMP certification sequence required by the current modification.","url":"https://pharma-dept.gov.in/sites/default/files/Corrigendum%20RPTUAS%2021st%20March%2C%202026_0.pdf"},{"title":"Submit through the verified official route","description":"Use the current Department/SIDBI scheme portal only after the reviewer verifies its URL, submit the dossier and track technical review, Scheme Steering Committee decision and staged release.","url":"https://pharmaceuticals.gov.in/sites/default/files/FAQs%20in%20respect%20of%20RPTUAS%20-%20Copy.pdf"}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Paused pending confirmation of the current 2026 intake; official annual-report evidence describes an application window opened 11 April 2024 and an outlay expected to be fully sanctioned by March 2026.",
        "window_evidence":{"source_url":"https://pharma-dept.gov.in/sites/default/files/Annual%20Report%202025-26_0.pdf","anchor":"RPTUAS section: application window opened 11.04.2024; balance outlay expected to be fully sanctioned by March 2026."},
        "review_note":"Keep paused and review-gated. This record is useful for historical eligibility and pending-project support, but no user should be told that a new application is open until the live Department/SIDBI intake is independently verified."
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
    values (item->>'slug', item->>'name', item->>'type', item->>'status', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, status = excluded.status, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.94, 0.91, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://pharma-dept.gov.in/sites/default/files/Revised%20guidelines%20SPI%20dated%2014.03.2024_0.pdf', 'guideline', 'Department of Pharmaceuticals RPTUAS revised guidelines', 'RPTUAS objective, beneficiaries, turnover slabs and eligible activities', now(), false),
      (version_id, 'https://pharma-dept.gov.in/sites/default/files/Corrigendum%20RPTUAS%2021st%20March%2C%202026_0.pdf', 'corrigendum', 'Department of Pharmaceuticals RPTUAS 2026 modification', 'Clause 8.2.5 certification sequence for first and second instalments', now(), false),
      (version_id, 'https://pharmaceuticals.gov.in/sites/default/files/FAQs%20in%20respect%20of%20RPTUAS%20-%20Copy.pdf', 'faq', 'Department of Pharmaceuticals RPTUAS FAQ', 'Application route, bank boundary, eligible investment date and technical review', now(), false),
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224373&lang=2&reg=48', 'pib_release', 'PIB RPTUAS implementation update', 'Current slab percentages, INR 2 crore ceiling and implementation status', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'pharma_subsidy', item->>'requirement', item->>'requirement_description', true
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
