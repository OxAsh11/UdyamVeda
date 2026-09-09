-- SITARE is a student-facing BIRAC/DBT route, not a general company or MSME
-- grant. Its GYTI, BIIS and Appreciation components have separate applicants
-- and benefits; the current active call must be verified before actionability.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC SITARE current programme page', 'https://www.birac.nic.in/desc_new.php?id=581', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official BIRAC SITARE page describing GYTI, BIIS, Appreciation grants, eligibility, cadence and application route.'),
  ('BIRAC SITARE scheme guidelines', 'https://www.birac.nic.in/webcontent/1568955483_birac_sitare_gyti_biis_guidelines.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official SITARE guideline document covering GYTI, BIIS, Appreciation grants, project duration, milestones and terms.'),
  ('BIRAC SITARE supported projects', 'https://www.birac.nic.in/birac_supported_projects.php', 'implementing_agency_portal', 'central', 'quarterly', 1, true, 'Official BIRAC supported-projects index with SITARE-GYTI results route; historical results are not an open call.'),
  ('BIRAC current calls', 'https://www.birac.nic.in/cfp.php', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official BIRAC current/previous calls index used to verify whether a SITARE call is currently open.'),
  ('BIRAC proposal submission guide', 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official BIRAC registration, proposal and submission guidance; the applicable SITARE call controls the actual route.')
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
        "slug":"birac-sitare-student-innovation",
        "name":"SITARE — Students Innovations for Translation and Advancement of Research Explorations",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in",
        "canonical_url":"https://www.birac.nic.in/desc_new.php?id=581",
        "source_url":"https://www.birac.nic.in/desc_new.php?id=581",
        "source_kind":"official_birac_sitare_programme_page",
        "source_title":"SITARE — Students Innovations for Translation and Advancement of Research Explorations",
        "source_anchor":"Current SITARE page: GYTI, BIIS and Appreciation components, student eligibility, award amounts, annual cadence and active-call application requirement",
        "summary":"A BIRAC student-innovation programme supporting biotechnology projects through SITARE-GYTI award grants, BIIS training and mentoring, and SITARE-Appreciation awards.",
        "objective":"Encourage students to pursue translational biotechnology research, develop innovative products or technologies addressing unmet needs, and create a pathway toward biotech startups.",
        "legal_basis":"BIRAC SITARE Scheme Guidelines and the applicable BIRAC call, partner instructions and agreement terms; the current call controls the live application route and deadline.",
        "eligibility":{"entity_types":["indian_student","student_innovator","institution_affiliated_individual"],"lifecycle_stages":["idea","research","prototype","validation"],"industries":["biotechnology","healthcare","lifesciences","diagnostics","medical_devices","drugs","vaccines","agriculture_biotechnology","industrial_biotechnology","bioinformatics","waste_management","sanitation","clean_energy","ai_or_iot_biotechnology_application"],"locations":["India"],"conditions":["SITARE-GYTI applicant must be an Indian student pursuing PhD or Masters with a valid institution or university ID and prescribed No Objection Certificate, subject to the current call","GYTI proposal must be translational research with potential to develop an innovative product or technology and lead toward a biotech startup","BIIS participant must be an eligible undergraduate student with valid institution or university ID under the applicable workshop route","SITARE-Appreciation support is selected from BIIS work and is not a separate open founder grant","application must be submitted online during an active BIRAC/SITARE call or notified BIIS route"],"exclusions":["SITARE is not a general grant for an incorporated company, ordinary MSME or established startup applying without the student route","GYTI, BIIS training and SITARE-Appreciation grants are separate components and cannot be merged","the INR 15 lakh and INR 1 lakh figures are component maxima, not guaranteed awards or a combined entitlement","historical supported projects do not establish a current open call","a student cannot receive GYTI more than once and BIIS participation has its own one-opportunity rule subject to the stated exception"],"thresholds":{"gyti_max_grant_inr":1500000,"gyti_project_duration_months":24,"biis_appreciation_max_grant_inr":100000,"biis_appreciation_awards_per_workshop_max":10,"gyti_call_frequency":"once_per_year","gyti_typical_call_duration_days_min":45,"gyti_typical_call_duration_days_max":60},"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.birac.nic.in/","route":"Check the current BIRAC calls and SITARE page, register or log in as the applicant, and submit the prescribed GYTI proposal or BIIS application only during the active call or notified workshop route.","selection":"BIRAC and the SITARE Partner evaluate proposals or workshop participants under the applicable component, including translational potential, innovation, feasibility, mentoring and current call criteria.","fees":"No application fee is established by the reviewed SITARE sources; verify the current call.","applicant_note":"UdyamVeda may explain the student route and prepare a checklist, but the student must use their own official BIRAC account, institution documents, declarations and submission."},
        "fine_print":{"benefit_buckets":["gyti_grant","biis_training_and_mentoring","sitare_appreciation_grant"],"gyti_support":"The official material states that up to 15 innovative student projects may receive up to INR 15 lakh each for up to 24 months, subject to selection, milestones and agreement terms.","biis_support":"BIIS provides residential hands-on training and mentoring; the current page describes workshops of up to four weeks and selection of students for further support.","appreciation_support":"The official material describes up to INR 1 lakh Appreciation Awards for selected BIIS work, subject to the component process and available awards.","current_portal_state":"The SITARE page describes an annual August/September cycle and requires proposals during an active call. The BIRAC current-calls index reviewed on 8 September 2026 did not establish a currently open SITARE call.","window_note":"Keep paused until the current SITARE call, opening date, closing date, applicant component and submission route are verified.","review_note":"Reconcile the current call with the 2019 guideline, current BIRAC page, student definition, NoC, proposal scope, selection, milestone disbursement, project duration, IP, mentoring, reporting, termination and partner terms before publication."},
        "benefit_summary":{"types":["grant","training","mentorship"],"summary":"Student-facing biotechnology innovation support through separate GYTI grant, BIIS training/mentoring and Appreciation award components; the current call and student route are required.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"SITARE student innovation support — component-specific grant/training",
        "benefit_conditions":{"current_call_required":true,"student_route_required":true,"gyti_max_grant_inr":1500000,"biis_appreciation_max_grant_inr":100000,"component_selection_required":true},
        "requirement":"Student identity, institution affiliation, prescribed NoC and translational biotechnology proposal or BIIS application under the active SITARE component",
        "requirement_description":"Prepare the student and institution identity evidence, NoC where required, translational research or innovation proposal, unmet-need and commercialization rationale, technical plan, milestones, budget, mentor/incubator details and any current-call documents.",
        "rules":{"all":[{"field":"indian_student_route_verified","operator":"equals","value":true},{"field":"current_sitare_call_or_biis_route_verified","operator":"equals","value":true},{"field":"biotechnology_or_applicable_sitare_scope","operator":"equals","value":true},{"field":"institution_id_and_required_noc_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current SITARE component and call","description":"Check the official BIRAC current-calls index and SITARE page for an active GYTI call, BIIS route or Appreciation process before treating the record as actionable.","url":"https://www.birac.nic.in/cfp.php"},{"title":"Classify the student route","description":"Determine whether the applicant is pursuing GYTI, BIIS or a component-specific Appreciation route, then verify student status, institution ID and NoC requirements.","url":"https://www.birac.nic.in/desc_new.php?id=581"},{"title":"Prepare the proposal or workshop application","description":"Assemble the translational biotechnology proposal, unmet-need and commercialization rationale, technical plan, milestones, budget, institution documents and current-call attachments.","url":"https://www.birac.nic.in/webcontent/1568955483_birac_sitare_gyti_biis_guidelines.pdf"},{"title":"Submit and track the selected project","description":"Use the official BIRAC route, retain the application and agreement, and track milestones, mentoring, utilization, reporting and any incubator transition.","url":"https://www.birac.nic.in/howtoSubmitProposal.php"}],
        "window_type":"call_for_applications",
        "window_label":"Paused: annual SITARE timing is described, but no current open GYTI/BIIS call was verified in the BIRAC current-calls index on 8 September 2026.",
        "window_evidence":{"source_url":"https://www.birac.nic.in/cfp.php","anchor":"Current BIRAC calls index was checked for a live SITARE call; historical calls and the annual timing described in the SITARE page do not establish current intake."}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Department of Biotechnology', 'Biotechnology Industry Research Assistance Council', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', coalesce(item->>'lifecycle_status', 'in_review'), authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url, status = excluded.status
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.86, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.birac.nic.in/webcontent/1568955483_birac_sitare_gyti_biis_guidelines.pdf', 'scheme_guideline', 'BIRAC SITARE scheme guidelines', 'GYTI, BIIS and Appreciation grant eligibility, duration, application, selection and terms', now(), false),
      (version_id, 'https://www.birac.nic.in/birac_supported_projects.php', 'implementing_agency_portal', 'BIRAC supported projects', 'SITARE-GYTI supported-projects route; historical results only', now(), false),
      (version_id, 'https://www.birac.nic.in/cfp.php', 'implementing_agency_portal', 'BIRAC current calls', 'Current call index used to verify SITARE intake', now(), false),
      (version_id, 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'BIRAC proposal submission guide', 'Registration, proposal and final-submit guidance', now(), false)
    on conflict do nothing;
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
