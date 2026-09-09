-- Review-gated Ministry of Culture project-grant route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Culture Cultural Function and Production Grant page', 'https://culture.gov.in/cultural-function-and-production-grant-cfpg', 'ministry_portal', 'central', 'monthly', 1, true, 'Official scheme page with scope, eligibility, quantum, rolling submission route, documents, selection and reporting.'),
  ('Ministry of Culture CFPG guidelines', 'https://culture.gov.in/files/inline-documents/CFPG_Latest_Guidelines_03_05_2019.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official CFPGS guideline PDF with three-year registration, matching resources, quantum, accounting, submission and instalment rules.'),
  ('Ministry of Culture CFPG application form', 'https://culture.gov.in/files/inline-documents/Application_Form_CFPGS_03_05_2019.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official prescribed form and checklist with project, finance, audit, recommendation, bank and declaration fields.');

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
        "slug":"cultural-function-and-production-grant-cfpg",
        "name":"Cultural Function and Production Grant (CFPG)",
        "type":"grant",
        "status":"active",
        "lifecycle_status":"active",
        "authority":"Ministry of Culture - Cultural Function and Production Grant",
        "authority_url":"https://culture.gov.in/",
        "canonical_url":"https://culture.gov.in/cultural-function-and-production-grant-cfpg",
        "source_url":"https://culture.gov.in/cultural-function-and-production-grant-cfpg",
        "source_kind":"ministry_portal",
        "source_title":"Ministry of Culture Cultural Function and Production Grant page",
        "source_anchor":"Scope, eligibility, quantum, rolling submission, documents, selection, instalments and output requirements",
        "summary":"Rolling project-grant route for eligible not-for-profit organizations, NGOs, societies, trusts and universities conducting cultural events, productions, exhibitions, workshops, research or related activities; not a general commercial-business subsidy.",
        "objective":"Support approved cultural functions, productions, exhibitions, workshops, seminars, festivals and small research or development projects related to Indian culture.",
        "legal_basis":"Ministry of Culture Scheme of Financial Assistance for Promotion of Art and Culture, Cultural Function and Production Grant Scheme guidelines and prescribed application form.",
        "eligibility":{"entity_types":["not_for_profit_organization","ngo","society","trust","not_for_profit_company","university"],"lifecycle_stages":["operating","scaling"],"industries":["arts_and_culture","performing_arts","cultural_heritage","research_and_cultural_programmes"],"locations":["India"],"conditions":["organization must be not-for-profit and registered under the applicable Societies, Trusts, Companies or Central/State Act route","organization should have been functioning and registered for at least three years","organization must have a properly constituted managing body with written powers and responsibilities","NGO/voluntary organization must have an NGO Darpan Unique ID and provide PAN where applicable","organization must have facilities, resources, personnel and experience for the proposed project","organization must have tied up or planned matching resources of at least 25 percent of project cost","application should be recommended by a National Akademy, Government culture-related organization or State/UT authority or academy"],"thresholds":{"minimum_registration_age_years":3,"minimum_matching_resources_percent":25,"maximum_assistance_percent_of_project_cost":75,"maximum_assistance_inr_per_project":500000,"exceptional_maximum_assistance_inr":2000000},"unknown_handling":"needs_information"},
        "exclusions":["ordinary for-profit startups, MSMEs and individual businesses are not direct applicants under this institutional cultural-grant route","religious institutions, schools and colleges are excluded; the scheme is not for college or university festivals","the grant is project-specific and discretionary, subject to Expert Committee recommendation and availability of funds","matching resources, recommendation, prior experience and full documentation are required; an application is not an entitlement","missing utilization certificates or audited statements can require refund with interest"],
        "application":{"portal":"https://culture.gov.in/cultural-function-and-production-grant-cfpg","route":"Complete the prescribed CFPG form and supporting dossier, obtain the required recommendation, and send the application to the Director, North Central Zone Cultural Centre, or the current route stated by the Ministry.","selection":"Applications are scrutinized and recommended by the Expert Committee in meetings held through the year, subject to applications and fund availability.","fees":"No universal application fee is stated; project preparation, audit, matching resources, stamp paper, bank and operating costs remain with the applicant unless sanctioned.","applicant_note":"UdyamVeda may explain the route and prepare a checklist, but must not present CFPG as a startup subsidy, promise sanction or submit as the applicant."},
        "fine_print":{"quantum":"Assistance is restricted to 75 percent of expenditure and normally up to INR 5 lakh per project; in exceptional cases a project of outstanding merit and relevance may receive up to INR 20 lakh with approval of the Minister of Culture.","release":"Grant is released in two instalments of 75 percent and 25 percent through electronic transfer.","reporting":"Separate grant accounts, audited statements, utilization evidence, project reporting and government audit or review access are required; grantee organizations must provide links to project videos or Ministry social pages as specified.","recovery":"If the utilization certificate is not submitted within the prescribed period, the whole grant may be refundable with interest unless specially exempted.","current_window":"The scheme page states that applications are open throughout the year, subject to current forms, routing, funds and review; verify current operational instructions before actioning.","review_note":"Confirm not-for-profit legal form, three-year registration, NGO Darpan where applicable, recommendation, 25 percent matching resources, project cost, applicable cap, current submission address and reporting requirements before publication."},
        "benefit_summary":{"types":["project_grant","cultural_programme_support"],"amounts":[{"type":"grant_in_aid","maximum_inr":500000,"exceptional_maximum_inr":2000000,"maximum_percent_of_project_cost":75}],"summary":"Potential project grant for qualifying not-for-profit cultural organizations: normally up to 75 percent of project expenditure subject to ₹5 lakh per project, exceptionally up to ₹20 lakh with approval; selection and matching resources apply.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Up to 75% of project expenditure, normally capped at INR 5 lakh per project",
        "amount_min":null,
        "amount_max":500000,
        "percentage":75,
        "benefit_conditions":{"selection_required":true,"maximum_assistance_percent":75,"normal_maximum_inr":500000,"exceptional_maximum_inr":2000000,"minimum_matching_resources_percent":25,"rolling_submission":true},
        "requirement":"Eligible not-for-profit cultural organization with three-year registration, NGO Darpan where applicable, recommendation, project dossier, matching resources and audited records",
        "requirement_description":"Prepare registration and governing-body evidence, annual report, detailed project report, itemized recurring/non-recurring budget, matching-resource sources, three years of accounts, latest balance sheet, recommendation, indemnity bond, bank authorization and prior utilization records.",
        "rules":{"all":[{"field":"registered_not_for_profit_cultural_organization","operator":"equals","value":true},{"field":"registration_age_years","operator":"greater_than_or_equal","value":3},{"field":"matching_resources_percent","operator":"greater_than_or_equal","value":25},{"field":"recommendation_obtained","operator":"equals","value":true},{"field":"complete_project_dossier","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the institutional route","description":"Verify that the applicant is a qualifying not-for-profit cultural organization and not an ordinary commercial startup or MSME."},{"title":"Prepare the project and matching-resource plan","description":"Document the cultural project, duration, personnel, itemized expenditure and sources of at least 25 percent matching resources."},{"title":"Assemble the prescribed dossier","description":"Complete the official form and checklist with registration, governing body, annual report, three years of accounts, balance sheet, recommendation, indemnity bond and bank authorization.","url":"https://culture.gov.in/files/inline-documents/Application_Form_CFPGS_03_05_2019.pdf"},{"title":"Submit and track review","description":"Submit through the current official route; the Expert Committee considers applications through the year subject to funds and meetings.","url":"https://culture.gov.in/cultural-function-and-production-grant-cfpg"}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling: the Ministry page states that applications are open throughout the year, subject to current routing, funds and Expert Committee review.",
        "window_evidence":{"source_url":"https://culture.gov.in/cultural-function-and-production-grant-cfpg","anchor":"Procedure for Submission of Application: scheme open throughout the year; pages 3-4 of the guideline PDF repeat the rolling route."},
        "review_note":"Keep review-gated. This is a not-for-profit institutional cultural project grant, not a general startup or MSME benefit; do not recommend ordinary commercial businesses unless the official eligibility boundary changes."
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
      (version_id, 'https://culture.gov.in/files/inline-documents/CFPG_Latest_Guidelines_03_05_2019.pdf', 'guideline', 'Ministry of Culture CFPG guidelines', 'Sections 2-12: eligibility, quantum, accounting, submission, selection and instalments', now(), false),
      (version_id, 'https://culture.gov.in/files/inline-documents/Application_Form_CFPGS_03_05_2019.pdf', 'application_form', 'Ministry of Culture CFPG application form', 'Pages 1-6: prescribed form, recommendation, declarations and checklist', now(), false)
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
