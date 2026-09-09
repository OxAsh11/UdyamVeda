-- Pradhan Mantri Viksit Bharat Rozgar Yojana (formerly the Employment Linked
-- Incentive scheme). The employee and employer tracks are deliberately stored
-- as separate opportunity records: their beneficiaries, conditions and benefit
-- calculations must not be combined into one eligibility value.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM Viksit Bharat Rozgar Yojana official guidelines', 'https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official Ministry of Labour and Employment / EPFO guideline PDF. Contains definitions, eligibility, baseline, benefit slabs, payment, cessation, fraud and grievance provisions.'),
  ('Ministry of Labour ELI Cabinet approval release', 'https://labour.gov.in/sites/default/files/pib2141129.pdf', 'ministry_release', 'central', 'weekly', 1, true, 'Official Ministry of Labour and Employment release announcing the ELI scheme and its 01 August 2025 to 31 July 2027 employment window.'),
  ('PMVBRY official portal', 'https://pmvbry.epfindia.gov.in/', 'agency_portal', 'central', 'daily', 1, true, 'Official EPFO portal for PM Viksit Bharat Rozgar Yojana. Portal availability, registration route and operational notices must be rechecked before publication.')
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
        "slug":"pm-viksit-bharat-rozgar-yojana-part-a-first-timers",
        "name":"Pradhan Mantri Viksit Bharat Rozgar Yojana - Part A First-Time Employees",
        "type":"employment_incentive",
        "authority":"Ministry of Labour and Employment",
        "authority_url":"https://labour.gov.in/",
        "canonical_url":"https://pmvbry.epfindia.gov.in/",
        "source_url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf",
        "source_kind":"guideline",
        "source_title":"Pradhan Mantri Viksit Bharat Rozgar Yojana Guidelines",
        "source_anchor":"Sections 1.1-1.2; sections 3.1.5, 3.1.12-3.1.13; sections 6.1.1-6.1.2; pages 3, 6-11",
        "summary":"A first-time employee incentive under PM Viksit Bharat Rozgar Yojana for qualifying employees joining EPFO-covered establishments during the scheme registration period.",
        "objective":"Support first-time employees during their learning curve, encourage formal employment and improve employability through an EPF-wage-linked incentive and a financial-literacy condition for the second instalment.",
        "legal_basis":"PM Viksit Bharat Rozgar Yojana guidelines issued under the Ministry of Labour and Employment and implemented through EPFO under the EPF and MP Act, 1952 framework.",
        "eligibility":{"entity_types":["employee","first_time_employee"],"lifecycle_stages":["newly_employed"],"industries":["all_epfo_covered_sectors"],"locations":["India"],"conditions":["employee joins an EPFO-covered or eligible exempted establishment during 01 August 2025 to 31 July 2027","employee was not a contributing EPFO or exempted-trust member before commencement of the scheme","gross wages at joining are up to INR 100000","establishment files ECRs with contributions for six continuous completed months, subject to the seasonal-industry rule","UAN is authenticated through Face Authentication Technology on the UMANG App","for the second instalment, twelve completed months' ECRs are filed within eighteen months of joining and the employee completes the financial-literacy programme"],"exclusions":["re-joiners or employees with prior contributory EPFO or exempted-trust membership are not first timers for Part A","employees above the INR 100000 gross-wage threshold at joining","claims without the required ECR filings or contribution receipt","records that treat this employee incentive as an employer subsidy or add it to Part B"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pmvbry.epfindia.gov.in/","route":"Use the official PMVBRY/EPFO route for establishment and employee records; UdyamVeda only prepares the eligibility and evidence checklist.","applicant_note":"UdyamVeda must not create or authenticate a UAN, handle OTPs, submit an employee claim, or represent itself as EPFO. The employee and establishment remain responsible for official records and declarations."},
        "fine_print":{"beneficiary":"first-time employee, not the employer","benefit_structure":"One completed month of EPF wage, capped at INR 15000, paid in two instalments; the first is up to INR 7500 after six completed months' ECRs, and the second is the remaining amount up to the total cap after twelve completed months' ECRs and financial-literacy completion.","registration_window":"01 August 2025 to 31 July 2027; the record is still review-gated and the operational portal status must be checked before publication.","ecr_rule":"Only employees for whom contributions are received with the ECR count for benefit calculation; members without received contributions do not count for the benefit.","payment":"Employee incentive is paid by Aadhaar Bridge Payment System DBT to an Aadhaar-seeded bank account. Payment can remain suspended while bank seeding is pending, although accrual may continue under the guideline.","cessation":"Benefits cease if the first timer leaves employment, dies, the establishment closes or there is misrepresentation or fraud.","review_note":"Confirm current portal route, operational forms, payment/deposit instructions for the second instalment, current grievance route, any amendments and the treatment of seasonal establishments before approval."},
        "benefit_summary":{"types":["reimbursement"],"summary":"One completed month of EPF wage up to INR 15000 for an eligible first-time employee, paid in two instalments after the prescribed ECR, UAN, employment-continuity and financial-literacy conditions."},
        "benefit_type":"reimbursement",
        "benefit_label":"Part A first-time employee incentive - up to INR 15000",
        "benefit_conditions":{"maximum_amount_inr":15000,"first_instalment_maximum_inr":7500,"employee_beneficiary":true,"six_month_ecr_required":true,"twelve_month_ecr_and_financial_literacy_required_for_second_instalment":true,"not_employer_benefit":true},
        "requirement":"First-time employee and EPFO evidence",
        "requirement_description":"Evidence must establish first-time EPFO status, date of joining, gross wage at joining, establishment coverage, ECR filings and contributions, UAN face authentication and the applicable six/twelve-month conditions.",
        "rules":{"all":[{"field":"is_first_time_epfo_employee","operator":"equals","value":true},{"field":"gross_wage_at_joining_inr","operator":"less_than_or_equal","value":100000},{"field":"joining_date_in_scheme_period","operator":"equals","value":true},{"field":"establishment_epfo_covered","operator":"equals","value":true},{"field":"uan_face_authenticated_on_umang","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm first-time employee status","description":"Verify that the employee had no prior contributing EPFO or eligible exempted-trust membership and that the joining date falls within the scheme registration period.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"Confirm establishment and wage evidence","description":"Check EPFO coverage, gross wage at joining, PAN-linked establishment details and the applicable ECR route.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"Complete UAN and ECR conditions","description":"Ensure UAN face authentication through UMANG and filing of the required ECRs with contributions for the relevant completed months.","url":"https://pmvbry.epfindia.gov.in/"},{"title":"Complete the financial-literacy condition","description":"For the second instalment, complete the prescribed financial-literacy programme and confirm the twelve-month ECR condition within the applicable period.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"Use the official EPFO route","description":"Submit or track the benefit only through the official PMVBRY/EPFO system and retain the official acknowledgement and payment records.","url":"https://pmvbry.epfindia.gov.in/"}],
        "window_type":"fixed",
        "window_label":"Scheme registration period: 01 August 2025 to 31 July 2027; verify live portal operations and any amendments before publication.",
        "window_evidence":{"source_url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf","anchor":"Sections 3.1.12 and 4.2, pages 8-9"}
      },
      {
        "slug":"pm-viksit-bharat-rozgar-yojana-part-b-employer-incentive",
        "name":"Pradhan Mantri Viksit Bharat Rozgar Yojana - Part B Employer Incentive",
        "type":"employment_incentive",
        "authority":"Ministry of Labour and Employment",
        "authority_url":"https://labour.gov.in/",
        "canonical_url":"https://pmvbry.epfindia.gov.in/",
        "source_url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf",
        "source_kind":"guideline",
        "source_title":"Pradhan Mantri Viksit Bharat Rozgar Yojana Guidelines",
        "source_anchor":"Sections 4.1-5.2; sections 6.2.1-6.4; pages 9-14",
        "summary":"An employer incentive under PM Viksit Bharat Rozgar Yojana for eligible establishments that create sustained net additional employment above the prescribed baseline and threshold.",
        "objective":"Incentivize employers to create sustained additional formal employment, with a two-year benefit period and an extended third and fourth year for manufacturing establishments.",
        "legal_basis":"PM Viksit Bharat Rozgar Yojana guidelines issued under the Ministry of Labour and Employment and implemented through EPFO under the EPF and MP Act, 1952 framework.",
        "eligibility":{"entity_types":["employer","establishment","msme","startup","manufacturing_establishment"],"lifecycle_stages":["operating","growth","hiring"],"industries":["all_epfo_covered_sectors","manufacturing"],"locations":["India"],"conditions":["establishment is covered under the EPF and MP Act, 1952, including eligible exempted establishments","establishment files ECRs with contributions regularly and meets the applicable threshold","new employment is created during 01 August 2025 to 31 July 2027 and concerns first timers or re-joiners","net employment is at least two additional employees where baseline is below 50, or at least five where baseline is 50 or above","new employee gross wage at joining is up to INR 100000","employer satisfies the applicable baseline and rolling-average tests and employees complete six months with the same employer"],"exclusions":["no incentive for old employees who joined before 01 August 2025","no benefit for months in which the threshold is not met, with no extension of the incentive period","establishments with the specified pending or non-complied EPFO inquiries, fraud FIRs or unresolved irregularity findings","claims that ignore the distinction between employer Part B reimbursement and employee Part A incentive","benefits for employment created after 31 July 2027, except that such employment may count toward threshold determination as specified in the guideline"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pmvbry.epfindia.gov.in/","route":"Confirm the establishment's EPFO code, PAN/GSTN and PAN-linked bank details, baseline and threshold records, then use the official PMVBRY/EPFO route.","applicant_note":"UdyamVeda can prepare an ECR, workforce-baseline and evidence checklist. It must not file ECRs, access EPFO credentials, handle OTPs or claim to be an EPFO filing agent."},
        "fine_print":{"beneficiary":"employer/establishment; employee Part A benefits are not included in this amount","baseline":"Existing establishments use the applicable average employee count from the prescribed ECR period; a new establishment registered with EPFO during the scheme period uses a baseline of 20, with only employment above the baseline and threshold considered.","threshold":"At least two additional employments where baseline is below 50, or at least five where baseline is 50 or above.","benefit_structure":"Per additional employment per month: up to INR 1000 for EPF wage up to INR 10000, INR 2000 for EPF wage above INR 10000 and up to INR 20000, and INR 3000 for EPF wage above INR 20000 and up to INR 100000, subject to the prescribed criteria.","duration":"Two years for eligible establishments; manufacturing establishments may continue for the third and fourth years.","payment":"Benefits are provided on a six-monthly lump-sum basis after six completed months' ECRs; establishment payment goes by DBT to the PAN-linked bank account.","eligibility_review":"The guideline applies rolling average tests for the first six months, months 7-12 and month 13 onward. Detailed calculation rules may be issued separately, so automated ranking must not treat the headline monthly slab as guaranteed value.","fund_limit":"The scheme outlay is limited to INR 99446 crore including administrative charges and is fund-limited.","review_note":"Confirm current portal operation, detailed calculation/SOP amendments, establishment onboarding fields, live grievance route, baseline treatment for the particular establishment and current status of the pre-January-2026 ECR filing condition before approval."},
        "benefit_summary":{"types":["reimbursement"],"summary":"Employer incentive of up to INR 3000 per additional employment per month under the prescribed EPF-wage slab, normally for two years and potentially four years for manufacturing, subject to baseline, threshold, ECR and fraud/inquiry conditions."},
        "benefit_type":"reimbursement",
        "benefit_label":"Part B employer incentive - up to INR 3000 per additional employee per month",
        "benefit_conditions":{"maximum_per_additional_employee_per_month_inr":3000,"wage_slab_below_10000_max_inr":1000,"wage_slab_10000_to_20000_inr":2000,"wage_slab_above_20000_to_100000_inr":3000,"standard_duration_years":2,"manufacturing_duration_years":4,"threshold_baseline_below_50":2,"threshold_baseline_50_or_above":5,"six_month_ecr_and_rolling_average_required":true,"not_employee_benefit":true},
        "requirement":"Employer baseline, threshold and ECR evidence",
        "requirement_description":"Evidence must establish EPFO coverage, PAN/GSTN and PAN-linked bank details, the prescribed baseline, net additional employment, employee wage slabs, six-month ECR continuity, manufacturing status where relevant and absence of disqualifying inquiry or fraud conditions.",
        "rules":{"all":[{"field":"establishment_epfo_covered","operator":"equals","value":true},{"field":"new_employment_created_during_scheme_period","operator":"equals","value":true},{"field":"new_employee_gross_wage_at_joining_inr","operator":"less_than_or_equal","value":100000},{"field":"ecr_filed_with_contributions","operator":"equals","value":true},{"field":"additional_employment_threshold_met","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm EPFO establishment status","description":"Verify the establishment's EPF code, PAN, GSTN and PAN-linked bank account details through the official route.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"Establish the correct baseline","description":"Calculate the prescribed baseline from ECR history; use the special baseline of 20 only where the guideline treats the establishment as new.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"Test additional employment and wage slabs","description":"Check the baseline-plus-threshold rolling averages and classify qualifying first timers or re-joiners by EPF wage slab.","url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf"},{"title":"File the required ECRs and retain evidence","description":"Maintain paid ECRs, contribution records, employee continuity evidence and the manufacturing classification where the extended period is claimed.","url":"https://pmvbry.epfindia.gov.in/"},{"title":"Use the official EPFO route","description":"Submit or track the employer incentive only through the official PMVBRY/EPFO system and retain acknowledgements, payment records and grievance references.","url":"https://pmvbry.epfindia.gov.in/"}],
        "window_type":"fixed",
        "window_label":"Scheme registration period: 01 August 2025 to 31 July 2027; verify current portal operation, amendments and detailed calculation instructions before publication.",
        "window_evidence":{"source_url":"https://pmvbry.epfindia.gov.in/wp-content/themes/epfo-child/assets/images/PMVBRY-Final.pdf","anchor":"Sections 4.1-4.2 and 6.2.1-6.2.2, pages 9-13"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Labour and Employment', 'Employees'' Provident Fund Organisation', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
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
