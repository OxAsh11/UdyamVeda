-- Review-gated Ministry of Culture institutional grant route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Culture cultural organizations national presence scheme page', 'https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence', 'ministry_portal', 'central', 'monthly', 1, true, 'Official Ministry of Culture scheme page with eligibility, assistance limits, documents, routing and current notices.'),
  ('Ministry of Culture national presence 2026-27 call', 'https://culture.gov.in/files/inline-documents/2026-27-grant-in-aid.pdf', 'call_notice', 'central', 'monthly', 1, true, 'Official 27 May 2026 call for FY 2026-27; applications closed 15 July 2026 at 5 PM and the call states a 67 percent assistance limit.'),
  ('Ministry of Culture national presence application form', 'https://culture.gov.in/files/inline-documents/formnationalpresence.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official application form and checklist covering registration, NGO Partnership ID, audited accounts, recommendation and supporting documents.');

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
        "slug":"financial-assistance-cultural-organizations-national-presence",
        "name":"Financial Assistance to Cultural Organizations with National Presence",
        "type":"grant",
        "status":"closed",
        "lifecycle_status":"closed",
        "authority":"Ministry of Culture - Cultural Organizations with National Presence",
        "authority_url":"https://culture.gov.in/",
        "canonical_url":"https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence",
        "source_url":"https://culture.gov.in/files/inline-documents/2026-27-grant-in-aid.pdf",
        "source_kind":"call_notice",
        "source_title":"Ministry of Culture national presence 2026-27 call",
        "source_anchor":"FY 2026-27 call, 67 percent assistance limit, prescribed application and 15 July 2026 5 PM deadline",
        "summary":"Institutional grant-in-aid route for eligible cultural organizations with national presence to conduct cultural programmes and festivals; the FY 2026-27 call is closed and must not be presented as an open commercial-business subsidy.",
        "objective":"Support qualifying cultural organizations with national presence for approved cultural programmes, festivals, research and related cultural activities during the notified financial year.",
        "legal_basis":"Ministry of Culture Scheme of Financial Assistance for Promotion of Art and Culture, component for Financial Assistance to Cultural Organizations with National Presence, and the FY 2026-27 call notice.",
        "eligibility":{"entity_types":["not_for_profit_organization","society","trust","not_for_profit_company","cultural_organization"],"lifecycle_stages":["operating","scaling"],"industries":["arts_and_culture","performing_arts","cultural_heritage","research_and_cultural_programmes"],"locations":["India","national_presence"],"conditions":["applicant must be registered in India and have an all-India character with national or international operational presence","activities must be primarily or significantly cultural","organization must have a properly constituted governing body and facilities, resources, personnel and experience for the project","organization should have capacity to conduct at least 20 events or programmes in a year and adequate artistes, staff or volunteers","organization should have spent at least INR 1 crore on cultural activities in 3 of the preceding 5 years","application must use the prescribed format and required recommendation or routing channel","organization must provide the required matching share and maintain separate audited grant accounts","previous grant utilization certificates and required reporting must not be pending"],"thresholds":{"minimum_cultural_spend_inr":10000000,"minimum_cultural_spend_years_in_last_five":3,"minimum_programmes_per_year":20,"maximum_assistance_percent_of_approved_cost":67,"normal_assistance_inr":10000000,"normal_maximum_assistance_inr":20000000,"exceptional_maximum_assistance_inr":50000000,"matching_share_percent":33},"unknown_handling":"needs_information"},
        "exclusions":["ordinary for-profit startups, MSMEs or individual businesses are not direct applicants under this institutional cultural-organization route","a cultural event or creative business does not by itself satisfy national-presence, not-for-profit, governance, spending or recommendation requirements","the 2026-27 call deadline has passed and does not establish an open current application window","grant approval, amount, selection and future calls are discretionary and subject to the current notice","grant-funded assets and expenditure cannot be diverted, and pending utilization certificates can block consideration"],
        "application":{"portal":"https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence","route":"Confirm the current call, complete the prescribed application and checklist, obtain the required recommendation or route through the notified Zonal Cultural Centre, National Academy, State/UT cultural department or equivalent body, and submit the signed proposal and two copies by the notified route and deadline.","selection":"Applications are appraised by the Expert Advisory Committee and considered by the Ministry's competent authority; future calls and routing instructions control the process.","fees":"No universal application fee is stated; preparation, audit, matching share, submission and project costs remain with the organization unless sanctioned.","applicant_note":"UdyamVeda may explain the institutional route and prepare a document checklist, but must not present it as a direct startup subsidy or submit on behalf of the organization."},
        "fine_print":{"assistance":"The scheme page states normal assistance of INR 1 crore, a normal Ministry limit of INR 2 crore and exceptional enhancement up to INR 5 crore with approval; assistance is restricted to a maximum of 67 percent of approved cost and the organization bears the balance matching share.","release":"Grant is normally released in 75 percent and 25 percent instalments; the balance depends on utilization certificates, audited accounts, actual expenditure and required documents.","reporting":"Separate accounts, audited statements, quarterly physical and financial progress reports, asset records and inspection/audit access are required.","recovery":"Unspent or misused grant may be recovered with interest, and assets created from grant cannot be disposed of or used for other purposes without approval.","current_window":"The official 2026-27 call required complete applications by 15 July 2026 at 5 PM; this record is closed for that call. Verify any future notice before actioning.","review_note":"Confirm future-call status, applicant legal form, national presence, cultural-spend threshold, recommendation route, matching share, approved cost, grant ceiling, instalments, utilization, audit, asset restrictions and recovery terms before publication."},
        "benefit_summary":{"types":["institutional_grant","cultural_programme_support"],"amounts":[{"type":"grant_in_aid","normal_inr":10000000,"normal_max_inr":20000000,"exceptional_max_inr":50000000}],"summary":"Potential institutional grant-in-aid for qualifying national cultural organizations, normally up to INR 1 crore and capped at 67 percent of approved cost under the cited route, subject to selection and matching share; not a direct commercial-business entitlement.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Institutional cultural-programme grant, subject to selection and 33 percent matching share",
        "amount_min":null,
        "amount_max":50000000,
        "percentage":67,
        "benefit_conditions":{"selection_required":true,"maximum_assistance_percent":67,"matching_share_percent":33,"normal_assistance_inr":10000000,"normal_maximum_assistance_inr":20000000,"exceptional_maximum_assistance_inr":50000000,"current_call_closed":true},
        "requirement":"Eligible registered cultural organization with national presence, cultural-spend evidence, recommendation, project proposal, matching-share plan and audited compliance documents",
        "requirement_description":"Prepare registration and governing-body evidence, NGO Partnership ID, national-presence and programme records, three-of-five-year audited cultural expenditure, annual report, DPR, budget, matching-share sources, recommendation, utilization certificates, indemnity bond and bank authorization documents.",
        "rules":{"all":[{"field":"registered_not_for_profit_cultural_organization","operator":"equals","value":true},{"field":"national_presence_verified","operator":"equals","value":true},{"field":"cultural_spend_inr_last_three_of_five_years","operator":"greater_than_or_equal","value":10000000},{"field":"cultural_programme_capacity_per_year","operator":"greater_than_or_equal","value":20},{"field":"matching_share_plan_verified","operator":"equals","value":true},{"field":"current_cultural_call_open","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check a current Ministry call","description":"Verify that a current National Presence call is open; the FY 2026-27 call closed on 15 July 2026 at 5 PM.","url":"https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence"},{"title":"Confirm institutional eligibility","description":"Verify registration, governing body, national presence, cultural activity, programme capacity, cultural expenditure and matching share.","url":"https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence"},{"title":"Prepare the prescribed dossier","description":"Complete the official application and checklist with registration, NGO Partnership ID, annual report, DPR, audited accounts, utilization certificates, recommendation, indemnity bond and bank authorization.","url":"https://culture.gov.in/files/inline-documents/formnationalpresence.pdf"},{"title":"Submit through the notified route","description":"Submit the signed prescribed application and copies through the notified Zonal Cultural Centre, cultural department, academy or other authorized route by the current deadline.","url":"https://culture.gov.in/files/inline-documents/2026-27-grant-in-aid.pdf"}],
        "window_type":"closed",
        "window_close_at":"2026-07-15T11:30:00Z",
        "window_label":"Closed: the FY 2026-27 call required complete applications by 15 July 2026 at 5 PM; future calls must be verified separately.",
        "window_evidence":{"source_url":"https://culture.gov.in/files/inline-documents/2026-27-grant-in-aid.pdf","anchor":"Paragraphs 1-9: FY 2026-27 call, 67 percent limit and 15 July 2026 5 PM deadline"},
        "review_note":"Keep closed and review-gated. This is an institutional cultural grant route, not a general startup or MSME subsidy; do not recommend unless a future call and all organization-level conditions are verified."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Culture', 'Ministry of Culture', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.94, 0.90, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://culture.gov.in/offering/schemes-services/financial-assistance-cultural-organizations-national-presence', 'ministry_portal', 'Ministry of Culture cultural organizations national presence scheme page', 'Eligibility, assistance, release, documents and application routing', now(), false),
      (version_id, 'https://culture.gov.in/files/inline-documents/formnationalpresence.pdf', 'application_form', 'Ministry of Culture national presence application form', 'Application fields, checklist, recommendation, audited accounts and supporting documents', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'institutional_grant', item->>'requirement', item->>'requirement_description', true
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
