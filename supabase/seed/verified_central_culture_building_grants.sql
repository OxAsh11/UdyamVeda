-- Review-gated Ministry of Culture performing-arts infrastructure route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Culture Building Grants including Studio Theatres page', 'https://culture.gov.in/offering/schemes-services/financial-assistance-building-grants-including-studio-theatres', 'ministry_portal', 'central', 'monthly', 1, true, 'Official current scheme page with project scope, applicant boundary, assistance ceilings, rolling route and compliance conditions.'),
  ('Ministry of Culture revised Building Grants guidelines', 'https://culture.gov.in/files/inline-documents/Approved_Revised_Scheme_Guidelnes_of_Building_Grants270623.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guideline PDF with performing-arts spaces, three-year eligibility, ceilings, matching share, WZCC route and release conditions.'),
  ('Ministry of Culture Building Grants application form', 'https://culture.gov.in/files/inline-documents/Modified_Application_Form_Building_Grant270623.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official instructions and prescribed form with rolling window, postal submission and document requirements.');

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
        "slug":"financial-assistance-building-grants-studio-theatres",
        "name":"Financial Assistance for Building Grants including Studio Theatres",
        "type":"grant",
        "status":"active",
        "lifecycle_status":"active",
        "authority":"Ministry of Culture - Building Grants including Studio Theatres",
        "authority_url":"https://culture.gov.in/",
        "canonical_url":"https://culture.gov.in/offering/schemes-services/financial-assistance-building-grants-including-studio-theatres",
        "source_url":"https://culture.gov.in/files/inline-documents/Approved_Revised_Scheme_Guidelnes_of_Building_Grants270623.pdf",
        "source_kind":"guideline",
        "source_title":"Ministry of Culture revised Building Grants guidelines",
        "source_anchor":"Sections 1-8: project scope, applicant eligibility, assistance ceilings, matching share, rolling application, evaluation, instalments and grant conditions",
        "summary":"Project grant for eligible not-for-profit and government-aided cultural organizations and dedicated performing-arts institutions to build, purchase, renovate or equip auditoria, rehearsal halls, training centres and studio theatres; not a general commercial-business subsidy.",
        "objective":"Create appropriately equipped training, rehearsal and performance spaces for artistes and performing-arts organizations, including conventional cultural spaces and flexible studio or experimental theatres.",
        "legal_basis":"Ministry of Culture Financial Assistance for Cultural Activities in Performing Arts for Building Grants including Studio Theatres, under the Scheme of Financial Assistance for Creation of Cultural Infrastructure.",
        "eligibility":{"entity_types":["not_for_profit_organization","society","trust","not_for_profit_company","government_sponsored_performing_arts_body","performing_arts_university_department","performing_arts_college"],"lifecycle_stages":["operating","scaling"],"industries":["performing_arts","theatre","music","dance","fine_arts","literature","cultural_infrastructure"],"locations":["India","north_eastern_region"],"conditions":["not-for-profit organization must have a predominantly cultural profile and work primarily for arts and culture for at least three years","society, trust or not-for-profit company must be registered for at least three years","organization must be well established and have a local, regional or national identity with a charter devoted to Indian arts and culture","government-sponsored performing-arts bodies and dedicated performing-arts university departments or colleges may qualify subject to the stated record conditions","project must create or improve an eligible cultural space or associated equipment","applicant must provide the required matching share, ownership/title and approved local building evidence where applicable","application must use the prescribed form and recommendation route"],"thresholds":{"minimum_registration_age_years":3,"metro_new_construction_or_purchase_maximum_assistance_inr":5000000,"metro_other_project_maximum_assistance_inr":2500000,"non_metro_project_maximum_assistance_inr":2500000,"standard_maximum_assistance_percent":60,"north_eastern_region_maximum_assistance_percent":90,"project_completion_period_years":3,"first_installment_percent":50,"second_installment_percent":50},"unknown_handling":"needs_information"},
        "exclusions":["ordinary for-profit startups, MSMEs and individual businesses are not direct applicants under this cultural-infrastructure route","religious institutions, public libraries, museums, schools, non-performing-arts colleges and non-dedicated university departments are excluded","a previous building grant project generally blocks a second grant before completion, except as provided for studio or experimental theatre cases without default","recurring expenditure remains the grantee's responsibility and project-cost overruns are not automatically borne by the Government","assistance is discretionary and subject to completeness, Expert Committee recommendation, approval, inspection and current cut-off"],
        "application":{"portal":"https://culture.gov.in/offering/schemes-services/financial-assistance-building-grants-including-studio-theatres","route":"Verify the current cut-off, complete the prescribed form and enclosures, obtain the required recommendation, and send the application by the prescribed postal route to the Director, West Zone Cultural Centre, Udaipur.","selection":"WZCC scrutinizes completeness; the Ministry-appointed Expert Committee evaluates merit, cost, identity and matching share, and recommendations are placed for Culture Minister consideration and approval.","fees":"No universal application fee is stated; architect, local approval, title, project, matching-share, audit and recurring operation costs remain the applicant's responsibility unless sanctioned.","applicant_note":"UdyamVeda may explain the route and prepare a readiness checklist, but must not present it as a commercial startup subsidy or submit as the applicant."},
        "fine_print":{"scope":"Eligible spaces include auditoria, open-air theatres, concert halls, rehearsal halls, performing-arts training centres, studio theatres and approved related facilities such as acoustics, lighting, sound, equipment, furniture and stage material.","quantum":"For metro cities, new construction or purchase of built-up space is capped at INR 50 lakh and other projects at INR 25 lakh. For non-metro cities, all projects are capped at INR 25 lakh. Assistance is normally limited to 60 percent of approved cost; NER projects may receive up to 90 percent within the same ceilings.","matching_share":"The balance is the organization's matching share. Land and development charges and qualifying expenditure incurred within one year may count toward matching share subject to the guideline and certification.","release":"Grant is released in two equal 50 percent instalments. The second instalment requires progress reports, architect/CA certifications, audited accounts, utilization certificate, matching-share evidence and physical inspection.","completion":"The project must be completed within three years from release of the first instalment; completion certificates, asset records, audit and closure documents are required.","current_window":"The application form states that the scheme remains open throughout the year, with a cut-off date notified before Expert Committee meetings through WZCC/Ministry websites; verify the current cut-off before actioning.","review_note":"Confirm legal form, three-year cultural activity, project category, city/NER ceiling, title and building approvals, matching share, recommendation, WZCC route, current cut-off and completion obligations before publication."},
        "benefit_summary":{"types":["capital_grant","cultural_infrastructure_support"],"amounts":[{"type":"metro_new_construction_or_purchase","maximum_inr":5000000,"maximum_percent_of_project_cost":60},{"type":"metro_other_or_non_metro_project","maximum_inr":2500000,"maximum_percent_of_project_cost":60},{"type":"north_eastern_region_project","maximum_inr":2500000,"maximum_percent_of_project_cost":90}],"summary":"Potential capital grant for eligible performing-arts cultural organizations: metro new construction or purchase up to ₹50 lakh, other metro and non-metro projects up to ₹25 lakh, normally within 60% of approved cost; NER projects may reach 90% within the cap.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Capital grant up to INR 50 lakh for qualifying metro new construction/purchase projects, otherwise up to INR 25 lakh",
        "amount_min":null,
        "amount_max":5000000,
        "percentage":60,
        "benefit_conditions":{"selection_required":true,"standard_maximum_assistance_percent":60,"north_eastern_region_maximum_assistance_percent":90,"metro_new_construction_or_purchase_maximum_inr":5000000,"metro_other_project_maximum_inr":2500000,"non_metro_project_maximum_inr":2500000,"matching_share_required":true,"first_installment_percent":50,"second_installment_percent":50},
        "requirement":"Eligible three-year cultural organization or dedicated performing-arts institution with project title/building evidence, approved plans, architect cost estimates, matching share, recommendation and complete prescribed dossier",
        "requirement_description":"Prepare organization profile and three-year activity evidence, registration, governing body, annual accounts, title deed or purchase evidence, approved local building/development plans, architect-certified estimates, matching-share proof, board resolution, bond and bank authorization.",
        "rules":{"all":[{"field":"eligible_cultural_organization_or_performing_arts_institution","operator":"equals","value":true},{"field":"registration_age_years","operator":"greater_than_or_equal","value":3},{"field":"performing_arts_cultural_profile_verified","operator":"equals","value":true},{"field":"project_and_title_documents_verified","operator":"equals","value":true},{"field":"matching_share_plan_verified","operator":"equals","value":true},{"field":"current_cutoff_and_wzcc_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Classify the project and applicant","description":"Confirm the performing-arts cultural profile, applicant legal form, city/NER treatment and eligible space or equipment scope."},{"title":"Verify site and cost evidence","description":"Prepare title or purchase evidence, local building/development approvals, architect-certified estimates, matching-share proof and three-year accounts.","url":"https://culture.gov.in/files/inline-documents/Approved_Revised_Scheme_Guidelnes_of_Building_Grants270623.pdf"},{"title":"Complete the prescribed application","description":"Fill the current form, obtain the required recommendation and attach the board resolution, bond, bank authorization and complete project dossier.","url":"https://culture.gov.in/files/inline-documents/Modified_Application_Form_Building_Grant270623.pdf"},{"title":"Submit through WZCC and track review","description":"Verify the current cut-off and send the complete application by the prescribed route to WZCC; track Expert Committee, approval, inspection and instalment conditions."}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling: the scheme remains open throughout the year, but WZCC/Ministry publishes a cut-off before Expert Committee meetings; verify the current cut-off.",
        "window_evidence":{"source_url":"https://culture.gov.in/files/inline-documents/Modified_Application_Form_Building_Grant270623.pdf","anchor":"Instructions for applicants, pages 1-2: scheme open throughout the year and cut-off notified before Expert Committee meetings."},
        "review_note":"Keep review-gated. This is a capital cultural-infrastructure route for eligible institutions, not a general startup or MSME benefit; human review must confirm current cut-off, WZCC processing and project documents."
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
      (version_id, 'https://culture.gov.in/offering/schemes-services/financial-assistance-building-grants-including-studio-theatres', 'ministry_portal', 'Ministry of Culture Building Grants including Studio Theatres page', 'Current scheme page, linked documents and application route', now(), false),
      (version_id, 'https://culture.gov.in/files/inline-documents/Modified_Application_Form_Building_Grant270623.pdf', 'application_form', 'Ministry of Culture Building Grants application form', 'Instructions, rolling window, postal route and prescribed fields', now(), false)
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
