-- Review-gated Ministry of Culture audio-visual cultural-infrastructure route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Culture Allied Cultural Activities page', 'https://culture.gov.in/financial-assistance-allied-cultural-activities', 'ministry_portal', 'central', 'monthly', 1, true, 'Official Ministry of Culture page linking the current scheme guidelines and application proforma.'),
  ('Ministry of Culture Allied Cultural Activities guidelines', 'https://culture.gov.in/files/inline-documents/Sub_component_1B_SCHEME_31_01_2019.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official sub-component guideline with equipment scope, eligible applicants, ceilings, matching share, application, instalments and completion obligations.'),
  ('Ministry of Culture Allied Cultural Activities application proforma', 'https://culture.gov.in/files/inline-documents/Sub_component_1B_APPLICATION_31_01_2019.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official application and checklist with NGO Darpan, project, finance, recommendation and declaration fields.');

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
        "slug":"financial-assistance-allied-cultural-activities",
        "name":"Financial Assistance for Allied Cultural Activities",
        "type":"grant",
        "status":"active",
        "lifecycle_status":"active",
        "authority":"Ministry of Culture - Allied Cultural Activities",
        "authority_url":"https://culture.gov.in/",
        "canonical_url":"https://culture.gov.in/financial-assistance-allied-cultural-activities",
        "source_url":"https://culture.gov.in/files/inline-documents/Sub_component_1B_SCHEME_31_01_2019.pdf",
        "source_kind":"guideline",
        "source_title":"Ministry of Culture Allied Cultural Activities guidelines",
        "source_anchor":"Sections 1-9: audio-visual equipment, applicants, assistance ceilings, matching share, application, evaluation, instalments and conditions",
        "summary":"Project-level Central assistance for eligible not-for-profit organizations, State/UT Governments and District Authorities to create audio-visual equipment infrastructure for cultural spectacles in visitor-heavy spaces and festivals; not a general commercial-business grant.",
        "objective":"Create audio-visual assets that improve live cultural spectacles and visitor experience in open or closed spaces where large numbers of visitors attend regularly or during major events and festivals.",
        "legal_basis":"Ministry of Culture Scheme of Financial Assistance for Creation of Cultural Infrastructure, Component 1, Sub-component 1B: Financial Assistance for Allied Cultural Activities.",
        "eligibility":{"entity_types":["not_for_profit_organization","society","trust","not_for_profit_company","state_government","union_territory","district_authority"],"lifecycle_stages":["operating","scaling"],"industries":["arts_and_culture","performing_arts","cultural_events","visitor_experience_infrastructure"],"locations":["India"],"conditions":["not-for-profit organization must have been engaged for at least three years in the specified allied cultural activities","not-for-profit organization must be registered as a society, trust or not-for-profit company for at least three years","applicant organization must submit the prescribed recommendation from the District Authority","State Governments, Union Territories and District Authorities may apply where the project and executing agency satisfy the scheme boundary","project must concern eligible audio or audio-video equipment for cultural spectacles and include a plan for operation and maintenance","organization must provide the required matching share and comply with the prescribed noise, inspection, reporting and asset conditions"],"thresholds":{"minimum_registration_age_years":3,"audio_maximum_assistance_inr":10000000,"audio_video_maximum_assistance_inr":15000000,"maximum_assistance_percent_of_approved_cost":90,"project_completion_period_years":1,"first_installment_percent":60,"second_installment_percent":40},"unknown_handling":"needs_information"},
        "exclusions":["ordinary for-profit startups, MSMEs and individual businesses are not direct applicants under this not-for-profit/institutional route","the benefit is limited to the eligible equipment and approved project; it is not unrestricted working capital or a general event subsidy","recurring operation and maintenance responsibility remains with the grantee beyond the assistance structure","incomplete applications, missing prescribed documents, missing recommendation or unavailable matching share can prevent consideration","assistance is discretionary, subject to Expert Committee evaluation, physical inspection, funds and current notification"],
        "application":{"portal":"https://culture.gov.in/financial-assistance-allied-cultural-activities","route":"Check the current Ministry or National Science Centre notification, complete the prescribed application and checklist, obtain the required District Authority recommendation, and submit to the Director, National Science Centre, New Delhi through the notified channel.","selection":"Applications are screened for completeness, technically appraised, and evaluated by an Expert Committee; recommendations require competent approval and physical inspection conditions apply before later release.","fees":"No universal application fee is stated; quotations, project preparation, matching share, taxes, operation and maintenance remain the applicant's responsibility unless approved within the scheme ceiling.","applicant_note":"UdyamVeda may explain the institutional route and prepare a checklist, but must not present it as a commercial startup benefit or submit on behalf of the applicant."},
        "fine_print":{"scope":"Eligible projects cover procurement of specified audio or audio-video equipment for allied cultural spectacles; the guideline includes duties, taxes and five-year operation and maintenance costing in the ceiling calculation.","quantum":"Maximum assistance is INR 1 crore for audio and INR 1.5 crore for audio plus video, restricted to 90 percent of approved estimated project cost including the specified cost components; the balance is matching share.","release":"The first instalment is 60 percent of sanctioned assistance. The second 40 percent requires invoices, physical and financial progress, audited accounts, utilization evidence, matching-share certification and satisfactory physical inspection.","completion":"The equipment project must be completed within one year from release of the first instalment or further grant may not be released and the claim may become time-barred.","reporting":"Separate grant accounts, audit access, asset restrictions, noise-pollution compliance, project completion records and utilization certificates apply; non-compliance may trigger refund, interest or future-support consequences.","current_window":"The Ministry page is current and the guideline describes notification through Ministry/NSC channels; verify the current operational notification and cut-off before actioning.","review_note":"Confirm the current notification, applicant category, District Authority recommendation, equipment scope, quotations, matching share, O&M plan, one-year completion boundary and inspection route before publication."},
        "benefit_summary":{"types":["project_grant","cultural_infrastructure_support"],"amounts":[{"type":"audio_equipment_grant","maximum_inr":10000000,"maximum_percent_of_project_cost":90},{"type":"audio_video_equipment_grant","maximum_inr":15000000,"maximum_percent_of_project_cost":90}],"summary":"Potential project grant for eligible institutional applicants: up to INR 1 crore for audio or INR 1.5 crore for audio plus video, subject to 90 percent of approved cost, matching share, selection and current notification.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Up to 90% of approved cost; ceiling INR 1 crore for audio or INR 1.5 crore for audio plus video",
        "amount_min":null,
        "amount_max":15000000,
        "percentage":90,
        "benefit_conditions":{"selection_required":true,"maximum_assistance_percent":90,"audio_maximum_assistance_inr":10000000,"audio_video_maximum_assistance_inr":15000000,"matching_share_required":true,"first_installment_percent":60,"second_installment_percent":40},
        "requirement":"Eligible institutional applicant with three-year cultural activity and registration, District Authority recommendation, NGO Darpan where applicable, equipment project, quotations, matching-share evidence and operation plan",
        "requirement_description":"Prepare organization profile and three-year activity evidence, registration, governing-body records, audited accounts, project report, equipment specifications and quotations, matching-share evidence, NGO Darpan ID, PAN, recommendation, board resolution, bond and bank authorization.",
        "rules":{"all":[{"field":"institutional_applicant_eligible","operator":"equals","value":true},{"field":"registration_age_years","operator":"greater_than_or_equal","value":3},{"field":"allied_cultural_activity_history_verified","operator":"equals","value":true},{"field":"district_authority_recommendation_obtained","operator":"equals","value":true},{"field":"matching_share_plan_verified","operator":"equals","value":true},{"field":"current_notification_and_cutoff_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the institutional scope","description":"Verify that the applicant and cultural spectacle fit the not-for-profit, State/UT or District Authority boundary and that the proposal is for eligible audio or audio-video equipment."},{"title":"Prepare equipment and matching-share plan","description":"Prepare branded-equipment specifications, sufficient quotations, itemized cost, five-year operation and maintenance plan, completion schedule and matching-share evidence.","url":"https://culture.gov.in/files/inline-documents/Sub_component_1B_SCHEME_31_01_2019.pdf"},{"title":"Obtain recommendation and complete dossier","description":"Secure the prescribed District Authority recommendation where required and assemble registration, NGO Darpan, PAN, accounts, board resolution, bond and bank authorization records.","url":"https://culture.gov.in/files/inline-documents/Sub_component_1B_APPLICATION_31_01_2019.pdf"},{"title":"Submit through the current notification","description":"Verify the live notification and cut-off, then submit the prescribed form and enclosures to the National Science Centre through the notified route."}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Rolling subject to current Ministry/National Science Centre notification, cut-off dates, funds and Expert Committee meetings; verify the live call before applying.",
        "window_evidence":{"source_url":"https://culture.gov.in/files/inline-documents/Sub_component_1B_SCHEME_31_01_2019.pdf","anchor":"Sections 5 and 7: notification through NSC/Ministry websites and Expert Committee meetings from time to time during the year."},
        "review_note":"Keep review-gated. This is a not-for-profit/institutional audio-visual cultural-infrastructure route, not a general startup or MSME subsidy; current notification and applicant route require human confirmation."
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
      (version_id, 'https://culture.gov.in/financial-assistance-allied-cultural-activities', 'ministry_portal', 'Ministry of Culture Allied Cultural Activities page', 'Official scheme page and current linked guideline/application documents', now(), false),
      (version_id, 'https://culture.gov.in/files/inline-documents/Sub_component_1B_APPLICATION_31_01_2019.pdf', 'application_form', 'Ministry of Culture Allied Cultural Activities application proforma', 'Application fields, checklist, NGO Darpan, recommendation and declaration', now(), false)
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
