-- Review-gated ADEETIE record. See the matching migration for the source registry.

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
        "slug":"mop-adeetie-energy-efficiency-msme",
        "name":"ADEETIE - Assistance for Deployment of Energy Efficient Technologies in MSMEs",
        "type":"subsidy",
        "status":"active",
        "authority":"Ministry of Power - Bureau of Energy Efficiency (ADEETIE)",
        "authority_url":"https://powermin.gov.in/",
        "canonical_url":"https://adeetie.beeindia.gov.in/adeetie-scheme",
        "source_url":"https://www.beeindia.gov.in/show_content.php?lang=1&level=1&lid=384&ls_id=234",
        "source_kind":"ministry",
        "source_title":"BEE ADEETIE current eligibility page",
        "source_anchor":"Current scheme overview: interest subvention, eligible MSMEs, 14 sectors, 60 clusters, ₹10 lakh-₹15 crore loan range, up to 75% debt funding, 10% energy-savings test and FY 2025-26 to FY 2027-28 duration",
        "summary":"Energy-efficiency support for Udyam-registered MSMEs in identified clusters and sectors, combining interest subvention on eligible bank/FI loans with investment-grade energy audits, DPR preparation, technical handholding and monitoring/verification.",
        "objective":"Help eligible MSMEs adopt energy-efficient technologies, reduce energy consumption and improve industrial competitiveness through technical support and conditional financial assistance.",
        "legal_basis":"Ministry of Power ADEETIE scheme implemented by the Bureau of Energy Efficiency; the current BEE scheme page, operation guideline and live facilitation route control the detailed implementation.",
        "eligibility":{"entity_types":["micro_enterprise","small_enterprise","medium_enterprise","udyam_registered_msme"],"lifecycle_stages":["operating","scaling","modernization"],"industries":["brass","bricks","ceramics","chemicals","fisheries","food_processing","forging","foundry","glass","refractory","leather","paper","pharmaceuticals","steel_re_rolling","textiles","energy_efficiency"],"locations":["India","identified_adeetie_clusters"],"conditions":["enterprise must be registered on the Udyam portal","enterprise must operate in an identified ADEETIE energy-intensive cluster","project must fall within a covered sector and adopt eligible energy-efficient technology or measure","interest-subvention applicant must avail an eligible loan from a bank or financial institution","eligible loan amount must be between INR 10 lakh and INR 15 crore","up to 75% of project cost may qualify as debt funding for interest subvention","project must achieve and sustain at least 10% energy savings during the scheme period","the current cluster list, technology list, financial-institution route and implementation guideline must be verified"],"thresholds":{"minimum_eligible_loan_inr":1000000,"maximum_eligible_loan_inr":150000000,"maximum_debt_funding_percent":75,"minimum_energy_savings_percent":10,"micro_small_interest_subvention_percent":5,"medium_interest_subvention_percent":3,"scheme_outlay_inr":10000000000,"scheme_start_fy":"2025-26","scheme_end_fy":"2027-28","initial_cluster_count":60,"sector_count":14},"unknown_handling":"needs_information"},
        "exclusions":["the ₹1,000 crore scheme outlay is not an applicant entitlement or individual loan ceiling","the loan amount is not a grant and loan approval remains with the bank or financial institution","interest subvention is conditional on the scheme, lender, project, energy-savings and claim rules","enterprises outside an identified cluster or covered sector cannot be treated as eligible without an official expansion or amendment","the 5%/3% rates must not be applied without confirming enterprise category and the current minimum-net-interest and claim conditions","energy-audit/DPR reimbursement caps are separate from interest subvention and must not be added to it as a single benefit","Udyam registration, loan sanction, technology selection, commissioning and monitoring/verification are separate readiness steps"],
        "application":{"portal":"https://adeetie.beeindia.gov.in/","route":"Confirm Udyam registration, cluster and sector eligibility, submit the official MSME willingness/EOI route, complete the investment-grade energy audit and DPR process, approach a registered financial institution for the eligible project loan, implement the approved technology and complete monitoring/verification and claim steps.","selection":"BEE facilitation and technical review, eligible financial-institution appraisal and scheme-specific project/claim verification; approval is not automatic from submitting an EOI.","fees":"The official pages describe scheme support and an EOI route; any lender charges, audit-provider terms, project costs and other fees must be verified from the current guideline and provider/lender terms.","applicant_note":"UdyamVeda may prepare the facts, document checklist and readiness explanation, but must not impersonate the MSME, store credentials/OTPs or promise loan sanction or subsidy payment."},
        "fine_print":{"rate":"BEE states 5% interest subvention for Micro and Small Enterprises and 3% for Medium Enterprises; the current page also states a minimum net borrowing interest rate of 2%, which must be reconciled with the controlling guideline and lender calculation.","audit_support":"Investment Grade Energy Audit and DPR costs are reimbursable on an actual basis up to ₹75,000 for Micro/Small and ₹1,00,000 for Medium enterprises per project/loan according to the current BEE page; this is separate from interest subvention.","project_boundary":"Eligible loan amounts are ₹10 lakh to ₹15 crore, with up to 75% debt funding of project cost qualifying for interest subvention; loan approval and disbursement remain lender decisions.","performance":"Projects must achieve and sustain at least 10% energy savings during the scheme period to receive annual interest subvention, subject to measurement and verification.","window":"The scheme implementation period is FY 2025-26 through FY 2027-28. EOI and cluster availability may be phased; the live BEE route and current guideline must be checked before calling a project immediately actionable.","corpus":"The PIB release records a ₹1,000 crore total outlay, including ₹875 crore interest subvention, ₹50 crore audit support and ₹75 crore handholding support. These are programme-level allocations, not applicant entitlements.","review_note":"Human review must reconcile the downloadable operation guideline, current cluster list, technology eligibility, registered FI list, minimum-net-interest wording, claim timing, savings/M&V evidence, audit/DPR reimbursement and any phased expansion before publication."},
        "benefit_summary":{"types":["subsidy","reimbursement","training"],"summary":"Conditional 5% interest subvention for Micro/Small enterprises or 3% for Medium enterprises on eligible energy-efficiency loans, plus separate audit/DPR reimbursement and technical handholding; do not combine these values or treat the scheme corpus as an applicant benefit.","separate_value_buckets":true},
        "benefit_type":"subsidy",
        "benefit_label":"Interest subvention: 5% Micro/Small or 3% Medium, subject to project and claim conditions",
        "amount_max":null,
        "percentage":5,
        "benefit_conditions":{"micro_small_interest_subvention_percent":5,"medium_interest_subvention_percent":3,"audit_dpr_reimbursement_micro_small_inr":75000,"audit_dpr_reimbursement_medium_inr":100000,"scheme_outlay_inr":10000000000,"benefit_is_not_loan_or_grant":true,"separate_value_buckets":true},
        "requirement":"Udyam MSME, identified cluster, covered sector, eligible loan and verified energy savings",
        "requirement_description":"Provide Udyam registration, enterprise category, cluster and sector evidence, project technology and cost details, energy audit/DPR, bank/FI loan details, debt-funding calculation, commissioning records and monitoring/verification evidence required by the current guideline.",
        "rules":{"all":[{"field":"udyam_id_operational","operator":"equals","value":true},{"field":"adeetie_cluster_verified","operator":"equals","value":true},{"field":"adeetie_sector_verified","operator":"equals","value":true},{"field":"eligible_project_loan_inr","operator":"greater_than_or_equal","value":1000000},{"field":"eligible_project_loan_inr","operator":"less_than_or_equal","value":150000000},{"field":"debt_funding_percent","operator":"less_than_or_equal","value":75},{"field":"project_energy_savings_percent","operator":"greater_than_or_equal","value":10},{"field":"bank_or_financial_institution_loan_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the MSME and cluster facts","description":"Verify the active Udyam ID, enterprise category, covered sector and identified ADEETIE cluster before estimating any support.","url":"https://www.beeindia.gov.in/show_content.php?lang=1&level=1&lid=384&ls_id=234"},{"title":"Submit the official EOI or willingness route","description":"Use the BEE ADEETIE portal's current MSME EOI/willingness route and retain the acknowledgement; this does not itself approve a loan or subvention.","url":"https://adeetie.beeindia.gov.in/expression-of-interest-for-msmes-under-adeetie-scheme"},{"title":"Prepare the audit and DPR","description":"Complete the investment-grade energy audit, select eligible technology and prepare a bankable DPR using the current BEE process and approved support route.","url":"https://adeetie.beeindia.gov.in/operation-guideline-of-scheme"},{"title":"Obtain eligible project finance","description":"Approach a registered bank or financial institution for a project loan between ₹10 lakh and ₹15 crore and preserve the lender and debt-funding evidence.","url":"https://adeetie.beeindia.gov.in/"},{"title":"Implement and prove savings","description":"Commission the technology, achieve and sustain at least 10% energy savings, and complete the scheme's monitoring, verification and annual claim requirements.","url":"https://www.beeindia.gov.in/show_content.php?lang=1&level=1&lid=384&ls_id=234"}],
        "window_type":"fixed",
        "window_close_at":"2028-03-31T23:59:59+05:30",
        "window_label":"Implementation period: FY 2025-26 through FY 2027-28; EOI, cluster and claim timing may be phased and must be confirmed on the live BEE route.",
        "window_evidence":{"source_url":"https://www.beeindia.gov.in/show_content.php?lang=1&level=1&lid=384&ls_id=234","anchor":"Duration of the Scheme: three years, FY 2025-26 to FY 2027-28; the live portal controls phased EOI and claim availability."},
        "review_note":"Keep the record review-gated. Verify the operation guideline, cluster list, technology list, registered FIs, current EOI route, loan/subvention calculation, M&V evidence and any amendments before publication or a deadline-sensitive recommendation."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Power', 'Bureau of Energy Efficiency', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.90, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://adeetie.beeindia.gov.in/adeetie-scheme', 'agency', 'BEE ADEETIE scheme page', 'Scheme components, sectors, clusters, rates and duration', now(), false),
      (version_id, 'https://adeetie.beeindia.gov.in/operation-guideline-of-scheme', 'guideline', 'BEE ADEETIE operation guideline page', 'Current guideline download route', now(), false),
      (version_id, 'https://adeetie.beeindia.gov.in/expression-of-interest-for-msmes-under-adeetie-scheme', 'agency', 'BEE ADEETIE MSME expression-of-interest route', 'EOI and willingness route', now(), false),
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2144822&lang=2&reg=3', 'pib', 'PIB ADEETIE scheme launch release', 'Outlay, component split, sectors and implementation period', now(), false)
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
