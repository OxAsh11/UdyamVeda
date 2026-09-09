-- Official Ministry of Social Justice and Empowerment / implementing-agency
-- evidence for two economic-empowerment routes. Both remain review-gated.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Social Justice CEGSSC scheme page', 'https://socialjustice.gov.in/schemes/32', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry scheme page for the Credit Enhancement Guarantee Scheme for Scheduled Castes and its implementing portal.'),
  ('IFCI CEGSSC implementing portal', 'https://www.ifcicegssc.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official IFCI portal with current eligibility, guarantee-cover range, tenure and lender-route summary.'),
  ('CEGSSC operational guidelines', 'https://socialjustice.gov.in/writereaddata/UploadFile/creditguide09082019.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official operational guideline for covered credit facilities, lender/MLI route and scheme definitions.'),
  ('CEGSSC eligibility modification letter', 'https://socialjustice.gov.in/writereaddata/UploadFile/CreditEnhancementGuaranteeSchemeSCs.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Ministry modification letter for the eligible entity and SC ownership/control condition.'),
  ('Social Justice NSFDC scheme page', 'https://socialjustice.gov.in/schemes/34', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry overview of NSFDC, income-generating activities, channelizing agencies, training and marketing support.'),
  ('NSFDC official portal', 'https://nsfdc.nic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official NSFDC root portal for current notices, schemes and channel-partner information.'),
  ('NSFDC official FAQ', 'https://nsfdc.nic.in/faqs', 'agency_portal', 'central', 'weekly', 1, true, 'Current official FAQ with the 2026 income ceiling, channel-partner route, product tracks, ceilings, rates and repayment terms.'),
  ('NSFDC official about page', 'https://nsfdc.nic.in/about-us-3', 'agency_portal', 'central', 'weekly', 1, true, 'Current official mandate, income ceiling and channel-finance description.'),
  ('NSFDC scheme compendium', 'https://nsfdc.nic.in/UploadedFiles/other/2024-05-15/1-4-1.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme compendium for historical/product-level credit details; current FAQ controls where terms differ.'),
  ('PM-SURAJ official application portal', 'https://pmsuraj.dosje.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official Department of Social Justice and Empowerment route referenced by the current NSFDC FAQ; live availability must be checked before handoff.')
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
        "slug":"credit-enhancement-guarantee-sc",
        "name":"Credit Enhancement Guarantee Scheme for Scheduled Castes",
        "type":"credit_guarantee",
        "status":"active",
        "authority":"Credit Enhancement Guarantee Scheme for Scheduled Castes (SCs)",
        "authority_url":"https://socialjustice.gov.in/",
        "canonical_url":"https://socialjustice.gov.in/schemes/32",
        "source_url":"https://www.ifcicegssc.in/",
        "source_kind":"agency",
        "source_title":"IFCI CEGSSC implementing portal",
        "source_anchor":"Highlights: objective, eligible entity forms, more than 51% SC ownership/control for the past 6 months, guarantee cover and tenure",
        "summary":"A credit-enhancement guarantee route supporting member lending institutions that finance eligible Scheduled Caste entrepreneurs through working-capital, term-loan or composite-term-loan facilities.",
        "objective":"Promote entrepreneurship and employment among Scheduled Caste entrepreneurs by providing a guarantee to banks and financial institutions, rather than a direct grant or direct loan from the scheme.",
        "legal_basis":"Ministry of Social Justice and Empowerment CEGSSC scheme page, IFCI implementing portal, operational guidelines and official eligibility-modification letter.",
        "eligibility":{"entity_types":["registered_company","registered_society","registered_partnership_firm","sole_proprietorship","individual_sc_entrepreneur"],"lifecycle_stages":["starting","operating","expanding"],"industries":["manufacturing","services","technology","trade","other_viable_business"],"locations":["India"],"conditions":["SC entrepreneurs/promoters/members must have more than 51% shareholding or ownership with management control for the past 6 months as stated by the current implementing portal","credit must be extended by a participating member lending institution","covered facility may be working capital, term loan or composite term loan","the lender and borrower must satisfy the current scheme, restricted-category and documentation conditions","guarantee cover is subject to the scheme and lender approval; it is not an automatic loan sanction"],"thresholds":{"sc_ownership_min_percent":51,"management_control_min_months":6,"guarantee_cover_min_inr":1500000,"guarantee_cover_max_inr":50000000,"guarantee_tenure_max_years":7},"unknown_handling":"needs_information"},
        "exclusions":["the guarantee is not a direct grant, subsidy or loan paid to the applicant","the guarantee cover is not the same as the sanctioned loan amount","the lender retains credit appraisal and sanction authority","current eligibility, participating MLI status, guarantee fee and claim conditions must be confirmed against the controlling documents before publication","ownership/control and lender-route information must not be inferred from caste identity alone"],
        "application":{"portal":"https://www.ifcicegssc.in/","route":"Prepare the business, SC ownership/control, financial and facility information; approach a participating member lending institution for the eligible credit facility; the MLI submits the guarantee request/required information to IFCI under the scheme route.","selection":"The MLI and implementing agency apply their credit, eligibility and guarantee processes; UdyamVeda cannot approve the facility or guarantee.","fees":"No universal applicant fee is established by the reviewed sources. Guarantee fee, lender charges, margin, collateral and other facility terms require current lender and scheme verification.","applicant_note":"UdyamVeda may explain the guarantee route and prepare a lender checklist, but must not represent itself as IFCI, a bank or an authorized filing agent."},
        "fine_print":{"guarantee":"The current IFCI portal describes guarantee cover from INR 0.15 crore to INR 5 crore, with maximum tenure of 7 years or the repayment period, whichever is earlier; the cover is distinct from the underlying loan.","facility":"The operational guideline identifies working-capital, term-loan and composite-term-loan facilities; the MLI's sanction, facility conditions and current scheme documents control the live case.","ownership":"The current implementing portal states more than 51% SC ownership/shareholding with management control for the past 6 months; the 2016 Ministry modification letter and later controlling documents must be reconciled before approval.","risk":"Guarantee cover does not remove lender appraisal, borrower repayment obligations, scheme exclusions or claim conditions.","review_note":"Human review must reconcile the current IFCI portal, Ministry guidelines, eligibility modification, MLI list, guarantee-fee/claim mechanics, lender conditions and any amendments before publication."},
        "benefit_summary":{"types":["guarantee"],"summary":"Credit enhancement guarantee cover for eligible SC entrepreneurs' lender facilities, with a current portal range of INR 15 lakh to INR 5 crore and a maximum 7-year guarantee tenure; not a direct grant or loan entitlement.","separate_value_buckets":true},
        "benefit_type":"guarantee",
        "benefit_label":"Credit enhancement guarantee cover: INR 15 lakh to INR 5 crore, subject to scheme and lender conditions",
        "amount_min":1500000,
        "amount_max":50000000,
        "percentage":null,
        "benefit_conditions":{"guarantee_not_direct_loan":true,"mli_route_required":true,"maximum_tenure_years":7,"cover_subject_to_lender_and_scheme":true},
        "requirement":"SC ownership/control evidence, eligible entity documents, MLI facility appraisal and scheme documents",
        "requirement_description":"Provide entity/incorporation and ownership records, valid SC evidence for relevant promoters/members, management-control evidence, business and financial information, lender facility documents and any current IFCI/MLI forms or declarations.",
        "rules":{"all":[{"field":"entity_form_eligible","operator":"equals","value":true},{"field":"sc_ownership_percent","operator":"greater_than","value":51},{"field":"sc_management_control_months","operator":"greater_than_or_equal","value":6},{"field":"member_lending_institution_route","operator":"equals","value":true},{"field":"facility_type_covered","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current CEGSSC route","description":"Check the current Ministry and IFCI pages, participating MLI route and controlling guideline before making an eligibility decision.","url":"https://www.ifcicegssc.in/"},{"title":"Prepare SC ownership and business evidence","description":"Compile entity, shareholding/ownership, management-control, caste, financial, business-plan and facility information required by the MLI.","url":"https://socialjustice.gov.in/writereaddata/UploadFile/CreditEnhancementGuaranteeSchemeSCs.pdf"},{"title":"Approach a participating lender","description":"Ask an MLI to appraise the working-capital, term-loan or composite facility and confirm that the current guarantee route can be used.","url":"https://socialjustice.gov.in/writereaddata/UploadFile/creditguide09082019.pdf"},{"title":"Complete guarantee processing","description":"The MLI and IFCI complete the current guarantee request, fee, documentation and claim-condition process; the applicant remains responsible for the underlying facility.","url":"https://www.ifcicegssc.in/"}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling lender-led route; the reviewed sources do not state a single nationwide application closing date.",
        "window_evidence":{"source_url":"https://www.ifcicegssc.in/","anchor":"Current portal provides scheme highlights and contact route without a nationwide closing date."},
        "review_note":"Keep review-gated. Do not display the guarantee range as a guaranteed loan, grant or applicant cash benefit." 
      },
      {
        "slug":"nsfdc-income-generating-credit",
        "name":"NSFDC Income-Generating Credit Schemes",
        "type":"concessional_loan",
        "status":"active",
        "authority":"National Scheduled Castes Finance and Development Corporation",
        "authority_url":"https://nsfdc.nic.in/",
        "canonical_url":"https://nsfdc.nic.in/faqs",
        "source_url":"https://nsfdc.nic.in/faqs",
        "source_kind":"agency",
        "source_title":"NSFDC official FAQ",
        "source_anchor":"Eligibility, application route and credit-scheme tracks: MFS, AMY, Term Loan and Udyam Nidhi Yojana",
        "summary":"Concessional finance for viable income-generating activities of eligible Scheduled Caste beneficiaries, routed through State Channelizing Agencies and other authorized channel partners.",
        "objective":"Finance self-employment and income-generating activities for eligible Scheduled Caste beneficiaries while providing channel-partner, skill-development and market-linkage support.",
        "legal_basis":"NSFDC official FAQ/about page and Ministry of Social Justice and Empowerment NSFDC scheme page; current product terms and channel-partner requirements control the live application.",
        "eligibility":{"entity_types":["individual_sc_beneficiary","partnership_firm_all_sc_members","cooperative_society_all_sc_members","micro_business","small_business","self_employment_project"],"lifecycle_stages":["starting","operating","expanding"],"industries":["agriculture_and_allied","small_industry","handicrafts","retail","services","transport","other_viable_income_generating_activity"],"locations":["India","rural_area","urban_area"],"conditions":["applicant must belong to the Scheduled Caste community and hold a valid caste certificate","annual family income from all sources must not exceed INR 5 lakh for loan assistance, stated as applicable from 7 January 2026 and subject to amendment","project or activity must be legal and viable under the selected credit track","application must be routed through an authorized State Channelizing Agency or other channel partner; direct applicant correspondence to NSFDC is not the loan route","product-specific project cost, loan ceiling, interest, margin, moratorium and repayment terms apply"],"thresholds":{"annual_family_income_max_inr":500000,"micro_finance_project_cost_max_inr":140000,"micro_finance_loan_max_inr":125000,"term_loan_project_cost_max_inr":5000000,"term_loan_max_inr":4500000,"term_loan_interest_percent":8,"term_loan_repayment_max_years":7,"udyam_nidhi_project_cost_max_inr":500000,"udyam_nidhi_loan_max_inr":450000},"unknown_handling":"needs_information"},
        "exclusions":["NSFDC does not directly sanction or disburse the beneficiary loan; channel partners process and collect repayment","the income ceiling applies to loan assistance and may be amended","the published credit tracks are not one universal loan product; ceilings, rates, contribution, moratorium and repayment vary by track and channel partner","loan approval is not guaranteed by eligibility alone","education loans and training programmes are separate NSFDC routes and are not included in this business-credit record"],
        "application":{"portal":"https://pmsuraj.dosje.gov.in/","route":"Confirm the appropriate NSFDC credit track, prepare caste/income/KYC/project evidence and apply through the PM-SURAJ route or the relevant authorized State Channelizing Agency/other channel partner.","selection":"The authorized channel partner appraises the project, confirms the product track and makes the lending/disbursement decision within NSFDC terms.","fees":"The reviewed sources do not establish a universal applicant fee. Interest, margin, documentation, insurance, processing and other lender/channel-partner costs must be confirmed for the selected track.","applicant_note":"UdyamVeda may prepare the route and checklist, but must not collect OTPs, impersonate the applicant, promise loan sanction or represent itself as NSFDC or a channel partner."},
        "fine_print":{"income":"The current NSFDC FAQ states an annual family-income ceiling of INR 5 lakh for loan beneficiaries, presently effective from 7 January 2026, subject to amendment.","tracks":"The FAQ describes MFS up to INR 1.25 lakh for projects up to INR 1.40 lakh, AMY up to INR 1.25 lakh with separate terms, Term Loan up to INR 45 lakh for projects above INR 1.40 lakh and up to INR 50 lakh, and Udyam Nidhi up to INR 4.50 lakh for projects up to INR 5 lakh; current channel-partner terms must be checked.","route":"Applications are routed through SCAs/CAs and other authorized channel partners; the PM-SURAJ online route is identified by the current FAQ.","support":"NSFDC also provides skill-development, entrepreneurship-development and market-support activities, but those are not added to the loan amount or treated as a cash entitlement.","review_note":"Human review must verify the current lending policy, product track, channel partner, income rule, interest/margin, collateral/security, documents, PM-SURAJ status, repayment and any current amendments before publication."},
        "benefit_summary":{"types":["loan","training","market_access"],"summary":"Concessional income-generating credit through NSFDC channel partners with track-specific ceilings and terms; current FAQ describes separate micro-finance, AMY, term-loan and Udyam Nidhi routes. No automatic sanction or combined monetary value is implied.","separate_value_buckets":true},
        "benefit_type":"loan",
        "benefit_label":"Track-specific concessional income-generating credit through NSFDC channel partners",
        "amount_min":null,
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"annual_family_income_max_inr":500000,"channel_partner_required":true,"track_specific_limits":true,"loan_not_guaranteed":true},
        "requirement":"SC certificate, family-income proof, KYC and viable project/activity evidence",
        "requirement_description":"Provide valid SC certificate, income proof, identity/address/KYC documents, project or business plan, cost estimates, bank/channel-partner forms and any collateral, margin or repayment documents required for the selected track.",
        "rules":{"all":[{"field":"scheduled_caste_status_verified","operator":"equals","value":true},{"field":"annual_family_income_inr","operator":"less_than_or_equal","value":500000},{"field":"income_generating_activity_viable","operator":"equals","value":true},{"field":"authorized_channel_partner_route","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the appropriate NSFDC credit track","description":"Compare MFS, AMY, Term Loan and Udyam Nidhi project-cost and repayment boundaries without combining their ceilings.","url":"https://nsfdc.nic.in/faqs"},{"title":"Prepare eligibility and project documents","description":"Collect SC certificate, family-income proof, KYC, project/business plan, cost estimates and any channel-partner documents.","url":"https://nsfdc.nic.in/about-us-3"},{"title":"Apply through an authorized route","description":"Use PM-SURAJ where available or approach the relevant SCA/authorized channel partner; do not submit directly to NSFDC as if it were a direct lender branch.","url":"https://pmsuraj.dosje.gov.in/"},{"title":"Complete appraisal and repayment setup","description":"The channel partner evaluates the project, confirms the track, documents interest/margin/security and processes disbursement and repayment.","url":"https://nsfdc.nic.in/faqs"}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling channel-finance route; product and local channel availability must be confirmed before application.",
        "window_evidence":{"source_url":"https://nsfdc.nic.in/faqs","anchor":"Current FAQ describes online/offline channel-partner applications and does not state a single nationwide closing date."},
        "review_note":"Keep review-gated. Display product tracks separately in the user experience and never add their ceilings into one total eligible amount."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Social Justice and Empowerment', 'Department of Social Justice and Empowerment', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://socialjustice.gov.in/schemes/32', 'ministry', 'Social Justice CEGSSC scheme page', 'Official scheme overview and implementing portal', now(), false),
      (version_id, 'https://socialjustice.gov.in/schemes/34', 'ministry', 'Social Justice NSFDC scheme page', 'Official economic-development overview', now(), false),
      (version_id, 'https://www.ifcicegssc.in/', 'agency', 'IFCI CEGSSC implementing portal', 'Current highlights and guarantee boundaries', now(), false),
      (version_id, 'https://nsfdc.nic.in/', 'agency', 'NSFDC official portal', 'Current notices and scheme navigation', now(), false),
      (version_id, 'https://nsfdc.nic.in/faqs', 'agency', 'NSFDC official FAQ', 'Current eligibility, tracks, route and terms', now(), false),
      (version_id, 'https://nsfdc.nic.in/UploadedFiles/other/2024-05-15/1-4-1.pdf', 'guideline', 'NSFDC scheme compendium', 'Product-level credit details; current FAQ controls conflicting terms', now(), false),
      (version_id, 'https://pmsuraj.dosje.gov.in/', 'agency', 'PM-SURAJ official application portal', 'Official route referenced by current NSFDC FAQ', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_min, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_min')::numeric, (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'document', item->>'requirement', item->>'requirement_description', true
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
