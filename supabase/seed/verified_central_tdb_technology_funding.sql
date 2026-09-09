-- Technology Development Board technology-commercialisation finance.
-- This is a preparation and official-handoff record, not a guaranteed loan,
-- equity investment or grant entitlement.

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
        "slug":"technology-development-board-technology-commercialisation-finance",
        "name":"Technology Development Board Technology Commercialisation Finance",
        "type":"technology_finance",
        "authority":"Technology Development Board",
        "authority_url":"https://www.tdb.gov.in/",
        "canonical_url":"https://www.tdb.gov.in/",
        "source_url":"https://tdb.gov.in/sites/default/files/2023-12/funding_guidelines_march_23_revised.pdf",
        "source_kind":"guideline",
        "source_title":"Technology Development Board Project Funding Guidelines",
        "source_anchor":"Pages 2-6: what the Board does, who can be funded, eligible technology-commercialisation routes and application conditions",
        "summary":"A Technology Development Board route for Indian companies, eligible cooperatives and other eligible agencies seeking finance to develop and commercialise indigenous technology or adapt imported technology for wider domestic application.",
        "objective":"Help technology-driven businesses identify the correct TDB finance route, understand the company and project boundaries, prepare the technical and financial proposal, and hand off to the official Board without presenting funding modes as guaranteed benefits.",
        "legal_basis":"Technology Development Board Act, 1995 and the applicable TDB project funding guidelines, Board decisions, forms and current calls.",
        "eligibility":{"entity_types":["company","private_limited_company","public_limited_company","cooperative_society","eligible_rd_institution","startup","technology_enterprise"],"lifecycle_stages":["prototype","operating","growth","scaling","commercialisation"],"industries":["engineering","technology","electronics","information_technology","telecom","health_and_medical","pharmaceuticals","chemical","agriculture","energy","waste_utilization","textiles","defence","transport","space"],"locations":["India"],"conditions":["the applicant is an Indian industrial concern or other eligible agency with a technology-based product or service proposal","the project develops or commercialises indigenous technology or adapts imported technology for wider domestic application","where technology comes from a domestic R&D institution, the required technology-transfer or collaboration agreement is available","the applicant can demonstrate the remaining project funding and provide the technical, financial, IP, milestone and commercialisation evidence required by the current route","the proposal is submitted in the prescribed format through the current official TDB route"],"thresholds":{"general_loan_share_up_to_percent":50,"general_loan_interest_simple_percent":5,"equity_share_up_to_percent":25,"grant":"exceptional_cases_and_national_interest","approval_authority_upto_inr":25000000,"approval_authority_25000000_to_100000000":"TDB sub-committee","approval_authority_above_inr":100000000},"exclusions":["the cited funding guidelines exclude sole entrepreneurs, sole proprietorship concerns and partnership concerns from the commercial-enterprise route","a project or technology idea does not guarantee sanction, equity, grant or loan disbursement","the published loan/equity percentages are funding-mode guidance and not a combined applicant entitlement","the FAQ describes a possible committee exception up to 70% and up to INR 5 crore; this conflicts with the general 50% mode and must be reconciled against the current approved terms before publication","loan applicants may need collateral, guarantees, security, insurance and royalty obligations under the current sanction","the remaining project cost, milestones, appraisal, Board decision and current forms remain applicant-specific"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.tdb.gov.in/","route":"Review the current TDB funding mode, download the prescribed proposal or Loan Application Form-A, prepare the technology, IP, project-cost, remaining-funding, milestone and commercialisation evidence, and submit through the live official proposal route","applicant_note":"UdyamVeda can prepare the evidence checklist and explain the finance modes, but the applicant must submit through TDB and remains responsible for representations, security, repayment, royalty and reporting terms","fees":"The current Modes of Funding page states that TDB does not levy processing, administrative or commitment charges; confirm any third-party professional, testing, legal, banking or documentation costs separately","selection":"Technical, financial and Board appraisal followed by sanction, agreement, milestone-based disbursement and reporting under the current TDB terms"},
        "fine_print":{"funding_modes":{"loan":"The current Modes of Funding page describes a soft loan at 5% simple interest and up to 50% of incurred project cost; the FAQ contains a possible committee exception that must not be normalised without review","equity":"The current Modes of Funding page describes equity up to 25% of approved project cost, subject to the Board's conditions and promoter-paid-up-capital boundary","grant":"Grant support is described as exceptional and for projects of national importance; it is not a standard startup grant"},"loan_terms":{"moratorium":"The official FAQ describes a one-year moratorium after successful project completion","repayment":"The official FAQ describes nine half-yearly instalments after the moratorium; current sanction terms govern","security":"The official FAQ describes primary security plus possible collateral, guarantees, charges and insurance; exact security is project-specific","royalty":"The FAQ states that royalty payments may apply on product sales during the loan period; confirm the sanctioned agreement"},"governance_thresholds":"The approval-authority page lists up to INR 2.5 crore, INR 2.5 crore to 10 crore and above INR 10 crore approval bands. These determine sanctioning authority, not the applicant's eligible benefit ceiling.","application_window":"The official FAQ says applications are received throughout the year, but current online availability, proposal format, active calls and any sector route must be confirmed on the live portal.","review_note":"Reconcile the general funding-mode page, FAQ exception, current funding guidelines, proposal form, legal form, technology-transfer, remaining-finance, security, royalty, milestone, reporting and current call terms before publication. Do not add loan, equity and grant values together."},
        "benefit_summary":{"types":["soft_loan","equity","exceptional_grant","technology_commercialisation"],"summary":"Potential TDB loan, equity or exceptional grant support for eligible technology development and commercialisation projects; exact instrument, amount, security, milestones and sanction depend on Board appraisal and current terms.","separate_value_buckets":true},
        "benefit_type":"technology_finance",
        "benefit_label":"TDB technology development and commercialisation finance",
        "benefit_conditions":{"technology_commercialisation_required":true,"eligible_legal_form_required":true,"technical_financial_appraisal_required":true,"remaining_funding_required":true,"board_sanction_required":true,"loan_equity_grant_must_remain_separate":true,"no_guaranteed_entitlement":true},
        "requirement":"Technology-commercialisation proposal and funding evidence",
        "requirement_description":"Prepare the entity and legal-form evidence, technology description, domestic-development or adaptation basis, IP and transfer documents, project report, cost and milestone plan, remaining-funding commitment, financials, security and commercialisation evidence required by the current TDB route.",
        "rules":{"all":[{"field":"eligible_tdb_legal_form","operator":"equals","value":true},{"field":"technology_development_or_commercialisation_project","operator":"equals","value":true},{"field":"tdb_proposal_evidence_ready","operator":"equals","value":true},{"field":"remaining_project_funding_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the technology and applicant","description":"Confirm that the entity and proposal fit TDB's eligible industrial, R&D, cooperative or other agency route and do not rely on the excluded sole-proprietor or partnership route.","url":"https://tdb.gov.in/faqs_new"},{"title":"Choose the funding mode","description":"Separate loan, equity and exceptional grant routes; record the general funding mode, any FAQ exception and the current Board terms without combining their values.","url":"https://www.tdb.gov.in/modes-funding"},{"title":"Prepare the technical and financial proposal","description":"Use the current guidelines and prescribed form to document technology, IP, project cost, remaining funds, milestones, security, commercialisation, reporting and any technology-transfer agreement.","url":"https://www.tdb.gov.in/index.php/downloads"},{"title":"Confirm the live proposal route","description":"Check the TDB portal for the current online proposal submission route, active calls, formats and any sector-specific instructions before submitting.","url":"https://www.tdb.gov.in/"},{"title":"Submit and track sanction obligations","description":"Submit through TDB, respond to technical and financial appraisal, retain the sanction/agreement, and track milestone disbursement, security, repayment, royalty and progress-report obligations.","url":"https://www.tdb.gov.in/approval-financial-assistance/"}],
        "window_type":"rolling",
        "window_label":"The official FAQ states that TDB receives applications throughout the year; current portal availability, forms, calls and sector instructions require live reviewer confirmation.",
        "window_evidence":{"source_url":"https://tdb.gov.in/faqs_new","anchor":"When and How can one submit the application?; applications received throughout the year"},
        "review_note":"Confirm current portal availability, prescribed form, legal-form eligibility, funding-mode percentages, FAQ exception, Board approval band, remaining-funding evidence, collateral, royalty, repayment, milestones and reporting before approval. This record must not represent TDB as a guaranteed loan or grant."}
    ]$records$::jsonb)
  loop
    authority_id := null;
    select id into authority_id from public.authorities where name = item->>'authority' and level = 'central' order by created_at, id limit 1;
    if authority_id is null then
      insert into public.authorities (name, level, ministry, department, official_url)
    values (item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Science and Technology', item->>'authority_url')
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.88, 0.84, 'in_review')
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
      (version_id, 'https://www.tdb.gov.in/modes-funding', 'scheme_page', 'TDB Modes of Funding', 'Loan, equity and exceptional grant modes', now(), false),
      (version_id, 'https://tdb.gov.in/faqs_new', 'faq', 'TDB FAQ', 'Legal forms, application timing, funding, repayment and security', now(), false),
      (version_id, 'https://www.tdb.gov.in/acts-and-rules', 'act', 'TDB Acts and Rules', 'Technology Development Board Act, 1995; statutory basis', now(), false),
      (version_id, 'https://www.tdb.gov.in/approval-financial-assistance/', 'procedure', 'TDB Approval of Financial Assistance', 'Approval and sanctioning authority bands', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'finance', item->>'requirement', item->>'requirement_description', true)
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

-- Current TDB reconciliation for controlled Batch 088 review.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('TDB current FAQ PDF', 'https://tdb.gov.in/sites/default/files/2024-12/f_q.pdf', 'faq', 'central', 'monthly', 1, true, 'Current official FAQ PDF covering Core Funding application timing, eligibility, repayment, security, startup wording and earnest-fee conditions.'),
  ('TDB current Downloads page', 'https://www.tdb.gov.in/node/1946', 'forms', 'central', 'monthly', 1, true, 'Current official Downloads page exposing revised guidelines/FAQs, Loan Application Form-A/Checklist and Return Submission Form.'),
  ('TDB RDIF/SLFM related route', 'https://tdb.gov.in/rdi_slfm', 'scheme_page', 'central', 'monthly', 1, true, 'Related current RDIF/SLFM route with materially different terms; retained to prevent merging it into TDB Core Funding.')
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
  version_id uuid;
begin
  select current_version_id into version_id
  from public.opportunities
  where slug = 'technology-development-board-technology-commercialisation-finance';

  if version_id is not null then
    update public.opportunity_versions
    set
      application = coalesce(application, '{}'::jsonb) || jsonb_build_object(
        'current_source_checked_at', '2026-09-08',
        'current_core_funding_route', 'https://www.tdb.gov.in/',
        'current_forms_route', 'https://www.tdb.gov.in/node/1946',
        'current_route_boundary', 'This record covers TDB Core Funding. The current portal also exposes RDIF/SLFM and active calls; those routes require separate records and review.',
        'current_submission_boundary', 'Use the current official TDB route and prescribed form. UdyamVeda may prepare evidence and explain terms but cannot submit or handle credentials and OTPs.'
      ),
      fine_print = coalesce(fine_print, '{}'::jsonb) || jsonb_build_object(
        'current_tdb_reconciliation', jsonb_build_object(
          'observed_at', '2026-09-08',
          'scope', 'tdb_core_funding_only',
          'general_loan_share_up_to_percent', 50,
          'general_loan_interest_simple_percent', 5,
          'equity_share_up_to_percent', 25,
          'exception_wording', 'The current FAQ contains committee wording for up to 70% with a project ceiling of INR 5 crore and a separate DPIIT-registered startup exception for qualifying Companies Act entities. Human review must reconcile these provisions against the controlling guideline and form.',
          'application_window', 'The current FAQ states that applications can be submitted throughout the year.',
          'evaluation_duration', 'The current FAQ says evaluation typically takes 3-4 months from a complete application, subject to complexity and applicant responsiveness.',
          'repayment_boundary', 'The FAQ describes a one-year post-completion moratorium and nine half-yearly instalments over 4.5 years; the Modes of Funding page uses different instalment wording and the controlling current agreement must govern.',
          'fee_boundary', 'No processing, administrative or commitment charges are stated on the Modes of Funding page, while the FAQ separately describes a 1% earnest fee that may be forfeited after a letter of intent. Keep these conditions separate.',
          'rdif_boundary', 'The related TDB RDIF/SLFM route has different TRL, interest, tenure and grant terms. Do not merge it into Core Funding.',
          'review_boundary', 'Confirm current legal forms, startup exception, project-cost definition, security, royalty, milestones, reporting, forms and live submission route before publication.'
        ),
        'current_source_reconciliation', 'The current TDB portal, Core Funding page, FAQ PDF, Downloads page, statutory page and related RDIF page were checked on 8 September 2026. The record remains in_review.'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://tdb.gov.in/sites/default/files/2024-12/f_q.pdf', 'faq', 'TDB current FAQ PDF', 'Current FAQ pages 2-9: application timing, eligibility, financing, repayment, security, fees and startup wording'),
      ('https://www.tdb.gov.in/node/1946', 'forms', 'TDB current Downloads page', 'Revised guidelines/FAQs, Loan Application Form-A/Checklist and Return Submission Form'),
      ('https://tdb.gov.in/rdi_slfm', 'scheme_page', 'TDB RDIF/SLFM related route', 'Separate current RDI route; do not merge its terms into Core Funding')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources os
      where os.opportunity_version_id = version_id
        and os.source_url = evidence.source_url
    );
  end if;
end $$;
