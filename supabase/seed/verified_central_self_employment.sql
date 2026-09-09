-- PM SVANidhi is seeded as an in_review record. The older MoHUA FAQ and
-- guideline remain useful for the base process, but the 2025 restructuring
-- and later PIB clarification must be reconciled by a reviewer before this
-- record can become an actionable recommendation.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM SVANidhi Cabinet restructuring release', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2161157&lang=1&reg=1', 'pib', 'central', 'weekly', 4, true, 'Official PIB announcement for the 2025 restructuring, extension to 2030, enhanced tranches and digital cashback; use for change detection and amendment review.'),
  ('PM SVANidhi current tranche clarification', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2289997&lang=1&reg=48', 'pib', 'central', 'weekly', 4, true, 'Official PIB reply dated July 2026 for current tranche repayment periods and current implementation context.'),
  ('PM SVANidhi MoHUA scheme guidelines', 'https://mohua.gov.in/pm_svandhi/PMSVANidhi%20Guideline_English.pdf', 'guideline', 'central', 'monthly', 1, true, 'Original official scheme guideline; several financial terms are superseded or supplemented by later restructuring notices and must not be published without reconciliation.'),
  ('PM SVANidhi MoHUA beneficiary FAQ', 'https://mohua.gov.in/upload/uploadfiles/files/FAQ-PM-SAVNidhi-English.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official FAQ for vendor identification, KYC, 7% interest subsidy, collateral, digital incentives, application route and grievance information; older terms require amendment review.'),
  ('PM SVANidhi official portal', 'https://pmsvanidhi.mohua.gov.in/', 'agency', 'central', 'daily', 2, true, 'Official application and status portal operated for MoHUA; verify current eligibility, lender route and personal-data notices before handoff.')
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
        "slug":"pm-street-vendors-atmanirbhar-nidhi-pm-svanidhi",
        "name":"Prime Minister Street Vendors AtmaNirbhar Nidhi (PM SVANidhi)",
        "type":"loan",
        "authority":"Ministry of Housing and Urban Affairs - PM SVANidhi",
        "authority_url":"https://pmsvanidhi.mohua.gov.in/",
        "canonical_url":"https://pmsvanidhi.mohua.gov.in/",
        "source_url":"https://mohua.gov.in/pm_svandhi/PMSVANidhi%20Guideline_English.pdf",
        "source_kind":"guideline",
        "source_title":"PM SVANidhi Scheme Guidelines",
        "source_anchor":"Base guideline reconciled with PIB 27 August 2025 restructuring release and PIB 27 July 2026 current tranche/repayment clarification",
        "summary":"Collateral-free working-capital credit and linked support for eligible street vendors, with progressive loan tranches, digital incentives and welfare linkages.",
        "objective":"Support street vendors with formal working capital, encourage timely repayment and digital adoption, and connect vendor families with wider social-security and capacity-building support.",
        "legal_basis":"PM SVANidhi scheme guidelines, Cabinet restructuring approval dated 27 August 2025 and subsequent official PIB implementation clarification",
        "eligibility":{
          "entity_types":["individual_street_vendor","self_employed_micro_business"],
          "founder_categories":["self_employed","street_vendor"],
          "locations":["statutory_urban_area","census_town","urban_agglomeration","peri_urban_area"],
          "conditions":["applicant is engaged in vending goods, food or services in a public street-vending setting","vendor identification through Certificate of Vending, identity card, survey record, provisional certificate or applicable Letter of Recommendation route","coverage expansion beyond statutory towns is graded and current local implementation must be verified","lender and local-body checks still apply"],
          "exclusions":["a business that cannot establish the applicable street-vending activity or identification route","an application that treats the scheme ceiling as an assured sanction"],
          "unknown_handling":"needs_information"
        },
        "application":{
          "portal":"https://pmsvanidhi.mohua.gov.in/",
          "route":"prepare and hand off to the official PM SVANidhi portal, Urban Local Body route, Banking Correspondent, Micro Finance Institution agent or participating lender as applicable",
          "lender_decision":"loan sanction remains subject to the lender and current scheme operating rules",
          "identity_and_consent":"UdyamVeda may explain and prepare the applicant but must not collect OTPs, perform e-KYC or impersonate the applicant",
          "grievance_route":"use the current official portal and MoHUA/ULB grievance route"
        },
        "fine_print":{
          "current_loan_structure":[{"tranche":1,"amount_max_inr":15000,"repayment_months":12},{"tranche":2,"amount_max_inr":25000,"repayment_months":18},{"tranche":3,"amount_max_inr":50000,"repayment_months":36}],
          "upi_linked_rupay_credit_card_max_inr":30000,
          "digital_cashback_max_inr":1600,
          "interest_subsidy_percent":7,
          "collateral_required":false,
          "scheme_outlay_inr":73320000000,
          "target_beneficiaries":11500000,
          "outlay_is_not_applicant_entitlement":true,
          "implementation_partners":["Ministry of Housing and Urban Affairs","Department of Financial Services","Urban Local Bodies","banks","financial institutions","SIDBI as portal implementing partner"],
          "amendment_reconciliation":["The older MoHUA FAQ and guideline describe the original ₹10,000 one-year first loan; the 2025 restructuring and 2026 PIB clarification describe current progressive tranches and repayment periods.","Confirm whether the current portal applies any additional eligibility, coverage, lender, cashback or interest-subsidy conditions before publication."],
          "current_source_findings":{"loan_tranches":[{"amount_max_inr":15000,"repayment_months":12},{"amount_max_inr":25000,"repayment_months":18},{"amount_max_inr":50000,"repayment_months":36}],"current_until":"2030-03-31","clarification_as_of":"2026-07-12","coverage_expansion":"census towns, urban agglomerations and peri-urban areas in a graded manner","portal_boundary":"Submission is not an assurance of a loan; lenders apply their own credit and risk policies."},
          "review_note":"Do not combine loan ceilings, interest subsidy, digital cashback or the total scheme outlay into one eligible-value number. The current PIB releases confirm the progressive tranches, repayment periods and 31 March 2030 lending window; review local-body identification, lender rules, current subsidy/cashback mechanics, data-consent language and portal availability before publication."
        },
        "benefit_summary":{
          "types":["loan","subsidy","reimbursement","market_access"],
          "summary":"Progressive collateral-free working-capital loans, possible interest subsidy, digital transaction cashback, UPI-linked credit-card access for eligible later-stage borrowers, and linked capacity/social-security support.",
          "separate_value_buckets":true
        },
        "benefit_type":"loan",
        "benefit_label":"Progressive working-capital loan up to ₹50,000",
        "amount_max":50000,
        "benefit_conditions":{"street_vendor_identification_required":true,"progressive_tranches":true,"lender_sanction_required":true,"not_a_grant":true},
        "requirement":"Street-vendor identity or applicable local-body recommendation",
        "requirement_description":"The applicant must establish the applicable street-vending activity and current identification or recommendation route before the lender application can be evaluated.",
        "rules":{"all":[{"field":"street_vendor","operator":"equals","value":true},{"field":"vendor_identification_route","operator":"in","value":["certificate_of_vending","identity_card","survey_record","provisional_certificate","letter_of_recommendation"]},{"field":"current_local_body_or_portal_route_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current vendor identification route","description":"Check the Certificate of Vending, identity card, survey/provisional record or current Letter of Recommendation route with the relevant Urban Local Body or official portal.","url":"https://pmsvanidhi.mohua.gov.in/"},{"title":"Prepare KYC and application information","description":"Prepare the current official KYC, vending activity and lender documents. Do not share OTPs with UdyamVeda.","url":"https://mohua.gov.in/upload/uploadfiles/files/FAQ-PM-SAVNidhi-English.pdf"},{"title":"Submit through the official channel","description":"Use the official PM SVANidhi portal or the authorised ULB, Banking Correspondent, MFI agent or participating lender route and track the lender decision.","url":"https://pmsvanidhi.mohua.gov.in/"}],
        "window_type":"fixed",
        "window_label":"Restructured lending period is stated to continue until 31 March 2030; current local coverage and portal route require verification.",
        "closes_at":"2030-03-31",
        "window_evidence":{"source_url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2161157&lang=1&reg=1","anchor":"Cabinet release, lines 20-29: extension, tranches, card, cashback and coverage"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Housing and Urban Affairs', item->>'authority_url'
    where not exists (select 1 from public.authorities existing_authority where existing_authority.name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities
      (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (
      item->>'slug', item->>'name', item->>'type', 'in_review', authority_id,
      '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url'
    )
    on conflict (slug) do update set
      name = excluded.name,
      authority_id = excluded.authority_id,
      canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis,
       eligibility, application, fine_print, benefit_summary,
       last_verified_at, completeness, confidence, review_status)
    values (
      seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis',
      item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary',
      now(), 0.85, 0.82, 'in_review'
    )
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov
      where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2161157&lang=1&reg=1', 'pib', 'Cabinet restructuring and extension of PM SVANidhi', 'Lines 20-29: current extension, tranches, card, cashback and coverage', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2161157&lang=1&reg=1');
    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2289997&lang=1&reg=48', 'pib', 'Current PM SVANidhi tranche and repayment clarification', 'Lines 20-24: ₹15,000/₹25,000/₹50,000 tranches and 12/18/36-month repayment periods', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2289997&lang=1&reg=48');
    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://pmsvanidhi.mohua.gov.in/', 'agency', 'PM SVANidhi official application portal', 'Official application and status route', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://pmsvanidhi.mohua.gov.in/');

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, conditions)
    select version_id, 'loan', 'Progressive working-capital loan', 50000, '{"tranches":[15000,25000,50000],"repayment_months":[12,18,36],"lender_sanction_required":true}'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = 'Progressive working-capital loan');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, 'subsidy', 'Interest subsidy subject to current rules', null, 7, '{"original_faq_rate":true,"current_amendment_review_required":true}'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = 'Interest subsidy subject to current rules');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, conditions)
    select version_id, 'reimbursement', 'Digital transaction cashback', 1600, '{"retail_and_wholesale":true,"current_eligibility_review_required":true}'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = 'Digital transaction cashback');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, conditions)
    select version_id, 'loan', 'UPI-linked RuPay credit card for eligible vendors', 30000, '{"second_tranche_repayment_required":true,"not_a_grant":true}'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = 'UPI-linked RuPay credit card for eligible vendors');

    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'identity', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');

    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);

    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);

    insert into public.opportunity_windows (opportunity_version_id, window_type, label, closes_at, source_evidence)
    select version_id, item->>'window_type', item->>'window_label', (item->>'closes_at')::date, item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);

    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
