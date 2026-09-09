-- Review-gated Indian Railways procurement-access record.

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
        "slug":"railways-dpiit-startup-procurement-access",
        "name":"Indian Railways Procurement Access for DPIIT-Recognized Startups",
        "type":"market_access",
        "status":"active",
        "authority":"Ministry of Railways - Railway Board Procurement",
        "authority_url":"https://indianrailways.gov.in/",
        "canonical_url":"https://www.ireps.gov.in/",
        "source_url":"https://secr.indianrailways.gov.in/uploads/files/1738300360704-Manual%20for%20procurement%20Goods_2024.pdf",
        "source_kind":"guideline",
        "source_title":"Indian Railways Manual for Procurement of Goods 2024",
        "source_anchor":"Section 1.11.5 Support to Start-up Enterprises; DPIIT startup definition, bid-security exemption and prior turnover/experience relaxation",
        "summary":"Non-financial procurement access for DPIIT-recognized Indian startups: exemption from bid security or earnest money and normally-ensured relaxation of prior turnover and prior experience requirements, subject to quality, technical, safety, health and critical-security exceptions in the applicable tender.",
        "objective":"Help eligible startups participate in Indian Railways procurement and innovation routes without treating procurement access as a guaranteed contract or cash benefit.",
        "legal_basis":"Indian Railways Manual for Procurement of Goods 2024, section 1.11.5, citing Rule 173(i) of the General Financial Rules 2017; the applicable tender and current IREPS instructions remain controlling.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","private_limited_company","registered_partnership","limited_liability_partnership"],"lifecycle_stages":["starting","validating","scaling","operating"],"industries":["railway_technology","engineering","manufacturing","software","services","innovation"],"locations":["India"],"conditions":["startup must be recognized by DPIIT","entity must be a private limited company, registered partnership or LLP in India","incorporation or registration must be within 10 years under the manual definition","turnover must not have exceeded INR 100 crore in any financial year since incorporation or registration","business must work toward innovation, development or improvement of products, processes or services, or have a scalable business model with high employment or wealth-creation potential","entity must not have been formed by splitting up or reconstructing an existing business","bid must satisfy the applicable quality and technical specifications and tender conditions"],"thresholds":{"maximum_startup_age_years":10,"maximum_turnover_any_financial_year_inr":1000000000},"unknown_handling":"needs_information"},
        "exclusions":["not a grant, subsidy, loan, tax benefit or guaranteed purchase order","no blanket relaxation where the procuring entity documents public-safety, health, critical-security-operation or critical-security-equipment reasons","quality, technical, statutory, safety, security, tender-fee, performance-security and other tender conditions still apply unless the tender expressly states otherwise","the procuring entity retains the final decision under the manual","startup recognition is not the same as MSME registration or vendor approval"],
        "application":{"portal":"https://www.ireps.gov.in/","route":"Verify DPIIT recognition, monitor current Railway tenders or RailTech challenges, register as a vendor/contractor through the official IREPS route where required, and submit a tender or challenge response. Claim the applicable bid-security and prior-experience/turnover relief only in the manner permitted by the live tender.","selection":"Tender-specific technical and commercial evaluation by the procuring Railway entity; innovation challenges may have separate prototype, pilot and procurement terms.","fees":"IREPS registration guidance says new vendors/contractors can submit registration free of charge, but tender fees, digital-signature costs, performance security and other tender-specific costs must be checked for each opportunity.","applicant_note":"UdyamVeda may explain the route, validate readiness and prepare a checklist, but must not impersonate the bidder, store credentials/OTPs or submit a bid without explicit authorized workflow controls."},
        "fine_print":{"support":"The manual provides procurement facilitation: bid-security or earnest-money exemption and relaxation of prior turnover/prior experience for DPIIT-recognized startups, subject to the manual and tender conditions.","relaxation":"The manual says the procuring entity may relax prior turnover and experience and that this relaxation normally has to be ensured, except for specified public-safety, health and critical-security cases with adequate justification; the live tender controls the implementation.","contract_boundary":"No benefit amount, grant corpus, contract value or purchase order is created by this record. Winning remains dependent on tender eligibility, technical compliance, evaluation, budget and the procuring entity's decision.","portal_boundary":"IREPS registration and tender participation are separate from DPIIT recognition. Current vendor registration, DSC, tender fees, bid-security wording, performance security and submission dates must be verified from the live tender.","review_note":"Human review must reconcile the current manual edition, tender-specific exceptions, RailTech challenge terms and IREPS registration instructions before publication. Do not present generic startup support as a current open tender."},
        "benefit_summary":{"types":["market_access"],"summary":"Procurement access support: bid-security/earnest-money exemption and eligible relaxation of prior turnover and prior experience requirements in applicable Indian Railways procurements; no cash value is implied.","separate_value_buckets":true},
        "benefit_type":"market_access",
        "benefit_label":"Bid-security relief and eligible prior-experience/turnover relaxation",
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"dpiit_recognition_required":true,"tender_specific":true,"cash_benefit":false,"contract_not_guaranteed":true},
        "requirement":"DPIIT recognition, startup definition and tender readiness",
        "requirement_description":"Provide proof of DPIIT recognition, incorporation/registration date, turnover history, entity form, innovation/scalability facts, technical capability and all tender-specific documents; obtain any required DSC and IREPS registration.",
        "rules":{"all":[{"field":"dpiit_startup_recognition_verified","operator":"equals","value":true},{"field":"entity_form_eligible","operator":"equals","value":true},{"field":"startup_age_years","operator":"less_than_or_equal","value":10},{"field":"turnover_since_incorporation_inr","operator":"less_than_or_equal","value":1000000000},{"field":"quality_and_technical_requirements_met_or_reviewed","operator":"equals","value":true},{"field":"current_tender_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify DPIIT startup recognition","description":"Confirm the startup recognition certificate, incorporation/registration date, entity form and turnover boundary before relying on the procurement relief.","url":"https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html"},{"title":"Find a current Railway route","description":"Search the official RailTech portal and IREPS for a live innovation challenge, goods tender, works tender or services procurement relevant to the business.","url":"https://www.ireps.gov.in/"},{"title":"Complete official bidder readiness","description":"Use the official IREPS new-vendor route, obtain the required digital signing certificate, and prepare the tender-specific technical, commercial and statutory documents.","url":"https://rwp.indianrailways.gov.in/works/uploads/File/User_Manual_for_Registration_of_New_Vendors_%26_Contractors_Version_1.0.pdf"},{"title":"Claim only the relief stated by the tender","description":"In the live tender response, request applicable bid-security and prior-experience/turnover relaxation while meeting all quality, technical, safety, security and other tender requirements.","url":"https://secr.indianrailways.gov.in/uploads/files/1738300360704-Manual%20for%20procurement%20Goods_2024.pdf"}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling policy support; each live Railway tender or innovation challenge has its own publication date, deadline and conditions.",
        "window_evidence":{"source_url":"https://secr.indianrailways.gov.in/uploads/files/1738300360704-Manual%20for%20procurement%20Goods_2024.pdf","anchor":"Section 1.11.5 is a standing procurement provision; no generic application deadline is stated. Current tenders remain deadline-sensitive."},
        "review_note":"Keep the opportunity review-gated. It is a standing procurement-access policy, not a grant or open application call; current tender evidence is required before ranking it as immediately actionable."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Railways', 'Railway Board Procurement', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.89, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://indianrailways.gov.in/railwayboard/uploads/directorate/secretary_branches/IR_Reforms/Innovation%20in%20Indian%20Railways%20.pdf', 'ministry', 'Indian Railways innovation ecosystem overview', 'Innovation opportunity areas across Railway functions', now(), false),
      (version_id, 'https://railtech.indianrailways.gov.in/', 'ministry', 'RailTech Indian Railways innovation and startup collaboration portal', 'Current challenge and collaboration route requires live verification', now(), false),
      (version_id, 'https://www.ireps.gov.in/', 'agency', 'Indian Railways e-Procurement System', 'Official procurement portal', now(), false),
      (version_id, 'https://rwp.indianrailways.gov.in/works/uploads/File/User_Manual_for_Registration_of_New_Vendors_%26_Contractors_Version_1.0.pdf', 'guideline', 'IREPS new vendor and contractor registration guide', 'Registration, DSC and application-status workflow', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup_recognition_page.html', 'startup_india', 'DPIIT Startup recognition guidance', 'Recognition prerequisite', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'registration', item->>'requirement', item->>'requirement_description', true
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
