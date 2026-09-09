-- Review-gated Ministry of Culture large cultural-infrastructure route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Culture Tagore Cultural Complexes page', 'https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc', 'ministry_portal', 'central', 'monthly', 1, true, 'Official current scheme page with applicant boundary, project scope, assistance ceilings, DPR route, release conditions and institutional obligations.'),
  ('Ministry of Culture Tagore Cultural Complexes application form', 'https://culture.gov.in/files/inline-documents/Updated_Application_Form_of_TCC_07092022.pdf', 'application_form', 'central', 'monthly', 1, true, 'Official application form and supporting instructions for State/UT bodies, agencies, universities, municipalities and reputed cultural nonprofits.'),
  ('Ministry of Culture Tagore Cultural Complexes DPR guidelines', 'https://culture.gov.in/files/inline-documents/dpr.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DPR guidance for cultural-complex planning, facilities, management, technical and sustainability considerations.');

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
        "slug":"financial-assistance-tagore-cultural-complexes",
        "name":"Financial Assistance for Tagore Cultural Complexes (TCC)",
        "type":"grant",
        "status":"active",
        "lifecycle_status":"active",
        "authority":"Ministry of Culture - Tagore Cultural Complexes",
        "authority_url":"https://culture.gov.in/",
        "canonical_url":"https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc",
        "source_url":"https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc",
        "source_kind":"ministry_portal",
        "source_title":"Ministry of Culture Tagore Cultural Complexes page",
        "source_anchor":"Objective, eligible organizations, projects, assistance, matching share, application, DPR, release and grant conditions",
        "summary":"Large project-level Central assistance for new Tagore Cultural Complexes, upgradation of cultural complexes and completion of eligible legacy MPCC projects; primarily an institutional State/UT and cultural-infrastructure route, not a general startup subsidy.",
        "objective":"Create or upgrade multi-purpose cultural complexes that support music, drama, dance, literature, fine arts, exhibitions, seminars, film shows, training, rehearsal and live performance, while providing cultural infrastructure and learning opportunities.",
        "legal_basis":"Ministry of Culture Financial Assistance for Tagore Cultural Complexes under the Scheme of Financial Assistance for Creation of Cultural Infrastructure.",
        "eligibility":{"entity_types":["state_government","union_territory","state_sponsored_body","central_government_body","university","municipal_corporation","government_approved_agency","reputed_not_for_profit_organization"],"lifecycle_stages":["operating","scaling","institutional_project"],"industries":["performing_arts","music","dance","drama","literature","fine_arts","cultural_infrastructure"],"locations":["India","north_eastern_region"],"conditions":["State Governments and UT Administrations, eligible government-sponsored bodies, universities, municipal corporations and approved agencies may apply","reputed not-for-profit organization must be capable of setting up and operating the project and meeting recurring costs","not-for-profit organization must be registered as a society, trust or not-for-profit company for at least three years","not-for-profit charter must be primarily devoted to Indian arts and culture and the organization must have a predominantly cultural profile and at least three years of meaningful activity","not-for-profit applicant must be inspected and recommended by an appropriate Central or State/UT agency","applicant must arrange 40 percent matching share outside NER or 10 percent in NER and operate/maintain the completed complex","new TCC projects must recognize the name Rabindranath Tagore and include an auditorium, subject to district/municipal alternatives"],"thresholds":{"minimum_registration_age_years_for_nonprofit":3,"normal_maximum_assistance_inr":150000000,"exceptional_maximum_assistance_inr":500000000,"standard_maximum_assistance_percent":60,"north_eastern_region_maximum_assistance_percent":90,"non_ner_matching_share_percent":40,"north_eastern_region_matching_share_percent":10,"dpr_preparation_percent_of_project_cost":0.5,"first_installment_percent":50,"second_installment_percent":50,"completion_period_years":3},"unknown_handling":"needs_information"},
        "exclusions":["ordinary for-profit startups, MSMEs and individual businesses are not direct applicants under this institutional infrastructure scheme","a project under another name is not eligible for the TCC component; new projects must be recognized as Tagore Cultural Complexes","Central assistance does not fund recurring operation, administration buildings, residential quarters, director bungalows, approach roads or later cost escalation beyond the approved share","incomplete proposals are rejected/returned and approval requires DPR, appraisal, matching share, civic approvals, inspection and competent sanction","legacy MPCC projects are not reopened or enhanced; only eligible pending installments continue under the stated legacy boundary"],
        "application":{"portal":"https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc","route":"Prepare the prescribed proposal and feasibility/DPR materials, identify the executing agency, provide land/building, matching-share and operation-maintenance evidence, and submit the complete application to the Under Secretary, Performing Arts-II Section, Ministry of Culture, New Delhi through the current notified route.","selection":"The Ministry scrutinizes completeness; a Sub-Committee evaluates DPRs, the National Appraisal Committee recommends eligibility and assistance, and projects above INR 15 crore follow the additional appraisal/approval path.","fees":"No universal application fee is stated; DPR, technical, civic, land, project, matching-share, audit and recurring operation costs remain with the applicant unless approved within the scheme.","applicant_note":"UdyamVeda may explain the institutional route and help organize a readiness dossier, but must not present it as a founder grant, promise sanction or submit on behalf of the applicant."},
        "fine_print":{"scope":"Eligible projects include new Tagore Cultural Complexes, upgradation of auditoria/cultural complexes and specified completion of approved legacy MPCC projects; facilities may include auditoria, seminar rooms, rehearsal halls, training centres, dormitories, exhibitions, libraries and common facilities.","quantum":"Central assistance normally goes up to INR 15 crore and in extremely rare cases of outstanding merit and relevance may go up to INR 50 crore subject to the additional appraisal/approval mechanism. Standard assistance is up to 60 percent of approved project cost; NER assistance may reach 90 percent within the ceiling.","matching_share":"The recipient State/UT/NGO or organization bears the balance: 40 percent outside NER and 10 percent in NER. Land is not included in matching share, and developed land with approach road is expected from the State unless the organization owns land.","release":"Assistance is released in two equal 50 percent instalments. The first follows DPR approval and civic plan approval; the second requires progress, utilization, audited accounts, matching-share evidence, professional certification and physical inspection.","reporting":"Progress reporting is required within six months of sanction and quarterly thereafter until completion. Separate accounts, audit access, asset lien, fire safety, cleanliness, renewable-energy, operating-plan and completion obligations apply.","current_window":"The current scheme page provides the application route and current links but does not state a fixed public deadline; verify the live Ministry notification, cut-off and intake status before actioning.","review_note":"Confirm applicant category, Tagore naming boundary, land/title and civic approvals, DPR, matching share, operation and maintenance plan, current submission route, appraisal threshold and completion/reporting conditions before publication."},
        "benefit_summary":{"types":["capital_grant","cultural_infrastructure_support"],"amounts":[{"type":"normal_central_assistance","maximum_inr":150000000,"maximum_percent_of_project_cost":60},{"type":"exceptional_central_assistance","maximum_inr":500000000,"maximum_percent_of_project_cost":60},{"type":"north_eastern_region_assistance","maximum_inr":500000000,"maximum_percent_of_project_cost":90}],"summary":"Potential institutional capital grant: normally up to ₹15 crore and exceptionally up to ₹50 crore for outstanding projects, subject to appraisal; normally up to 60% of approved cost or up to 90% in NER, with matching share and recurring-cost responsibility.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Institutional cultural-infrastructure grant normally up to INR 15 crore, exceptionally up to INR 50 crore",
        "amount_min":null,
        "amount_max":500000000,
        "percentage":60,
        "benefit_conditions":{"selection_required":true,"normal_maximum_assistance_inr":150000000,"exceptional_maximum_assistance_inr":500000000,"standard_maximum_assistance_percent":60,"north_eastern_region_maximum_assistance_percent":90,"non_ner_matching_share_percent":40,"north_eastern_region_matching_share_percent":10,"first_installment_percent":50,"second_installment_percent":50},
        "requirement":"Eligible State/UT, government-approved institutional body or reputed three-year cultural nonprofit with Tagore project concept, land/building evidence, DPR, matching share, executing and operation plan, recommendation and complete appraisal dossier",
        "requirement_description":"Prepare feasibility report and DPR, facility and building plans, land/title or allocation evidence, cost estimates, matching-share commitment, executing agency, organization registration and governance, three years of accounts/activity, recommendation, NGO Darpan where applicable, board resolution, bond, bank authorization and operation-maintenance plan.",
        "rules":{"all":[{"field":"eligible_tcc_institutional_applicant","operator":"equals","value":true},{"field":"tagore_cultural_complex_project_verified","operator":"equals","value":true},{"field":"land_and_civic_plan_readiness_verified","operator":"equals","value":true},{"field":"dpr_and_feasibility_ready","operator":"equals","value":true},{"field":"matching_share_plan_verified","operator":"equals","value":true},{"field":"operation_maintenance_plan_verified","operator":"equals","value":true},{"field":"current_submission_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm institutional and Tagore scope","description":"Verify the applicant category, cultural purpose, required Tagore naming, project type and NER treatment."},{"title":"Prepare land, facility and feasibility evidence","description":"Document land/title or allocation, civic approvals, facilities, building plans, cost estimates, execution agency, matching share and recurring operation plan.","url":"https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc"},{"title":"Prepare DPR and prescribed application","description":"Complete the current application form and DPR/feasibility dossier with governance, accounts, activity history, recommendation, bond and bank authorization.","url":"https://culture.gov.in/files/inline-documents/Updated_Application_Form_of_TCC_07092022.pdf"},{"title":"Submit for appraisal and track instalments","description":"Submit through the current Ministry route, respond to Sub-Committee/NAC appraisal, and track sanction, inspection, 50/50 instalments, quarterly reporting and completion obligations."}],
        "window_type":"recurring",
        "window_close_at":null,
        "window_label":"Recurring institutional route: no fixed public deadline is stated on the current scheme page; verify the current Ministry intake, cut-off and appraisal schedule before applying.",
        "window_evidence":{"source_url":"https://culture.gov.in/offering/schemes-services/financial-assistance-tagore-cultural-complexes-tcc","anchor":"Current scheme page, application procedure and National Appraisal Committee process; live notification and intake status require review."},
        "review_note":"Keep review-gated. This is a large institutional cultural-infrastructure route, not a general startup or MSME benefit; human review must confirm current intake, DPR requirements, applicant authority and appraisal path."
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
      (version_id, 'https://culture.gov.in/files/inline-documents/Updated_Application_Form_of_TCC_07092022.pdf', 'application_form', 'Ministry of Culture Tagore Cultural Complexes application form', 'Applicant categories, project, finance, declaration and supporting documents', now(), false),
      (version_id, 'https://culture.gov.in/files/inline-documents/dpr.pdf', 'guideline', 'Ministry of Culture Tagore Cultural Complexes DPR guidelines', 'DPR planning, facilities, management, technical and sustainability guidance', now(), false)
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
