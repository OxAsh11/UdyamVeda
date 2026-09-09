-- Central MSME training and entrepreneurship-support records from official
-- Ministry/implementing-agency sources. These remain in_review until current
-- programme calendars, beneficiary routes and assistance terms are confirmed.

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
        "slug":"assistance-to-training-institutions-ati",
        "name":"Assistance to Training Institutions (ATI)",
        "type":"training_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - ATI",
        "authority_url":"https://ati.msme.gov.in/",
        "canonical_url":"https://ati.msme.gov.in/ATI/home.aspx",
        "source_url":"https://ati.msme.gov.in/ATI/home.aspx",
        "source_kind":"agency",
        "source_title":"ATI official portal",
        "source_anchor":"Scheme overview and assistance to training institutions",
        "summary":"Institutional support for establishing or strengthening entrepreneurship and skill-development training infrastructure and programmes.",
        "objective":"Expand entrepreneurship and skill-development capacity, support first-generation entrepreneurs and encourage self-employment through eligible training institutions.",
        "legal_basis":"Assistance to Training Institutions scheme of the Ministry of MSME",
        "eligibility":{"entity_types":["state_government_training_institution","union_territory_training_institution","government_agency","eligible_ngo","development_agency","training_institution"],"conditions":["institution must satisfy the current ATI guidelines","infrastructure and programme-support routes have different conditions","training providers may need enrolment with an eligible national-level EDI"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://ati.msme.gov.in/ATI/home.aspx","route":"use the current ATI institutional application route or contact the Ministry/eligible EDI shown by the official portal","applicant_note":"This is primarily an institutional opportunity; it is not a direct grant for an individual business."},
        "fine_print":{"support_modes":["capital grant for new or strengthened infrastructure","programme support for entrepreneurship and skill-development training"],"historical_terms":{"infrastructure_assistance_max_inr":15000000,"infrastructure_matching_basis":true,"infrastructure_assistance_share_max_percent":50,"special_region_assistance_max_inr":27000000,"special_region_assistance_share_max_percent":90,"training_support_max_inr_per_trainee_per_hour":50,"special_region_training_support_max_inr_per_trainee_per_hour":60},"review_note":"The portal describes the scheme but current grant ceilings, eligible institutions, matching requirements and application route must be checked against the latest ATI guidelines before publication."},
        "benefit_summary":{"types":["grant","training_support"],"summary":"Institutional infrastructure and programme-support assistance for eligible entrepreneurship and skill-development providers, subject to current guidelines and approvals."},
        "benefit_type":"grant",
        "benefit_label":"Training-institution infrastructure and programme support",
        "amount_max":15000000,
        "benefit_conditions":{"institutional_route_required":true,"current_ati_guidelines_required":true},
        "requirement":"Eligible training institution and institutional proposal",
        "requirement_description":"The applicant must be an eligible institution or agency with a qualifying infrastructure or training-programme proposal and supporting documents.",
        "rules":{"all":[{"field":"eligible_training_institution","operator":"equals","value":true},{"field":"ati_proposal_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm institutional eligibility","description":"Check the current ATI guidelines, institution category and whether the proposal is for infrastructure or programme support.","url":"https://ati.msme.gov.in/ATI/home.aspx"},{"title":"Prepare the institutional proposal","description":"Compile infrastructure, programme, budget, matching contribution and implementation evidence required by the current route.","url":"https://ati.msme.gov.in/ATI/home.aspx"},{"title":"Submit through the official route","description":"Use the current Ministry or EDI route and retain sanction, utilisation and programme records.","url":"https://ati.msme.gov.in/ATI/home.aspx"}],
        "window_type":"rolling",
        "window_label":"Institutional proposals depend on current Ministry calls, approvals and available programme support; no universal applicant deadline is asserted.",
        "window_evidence":{"source_url":"https://ati.msme.gov.in/ATI/home.aspx","anchor":"Scheme overview and current portal route"}
      },
      {
        "slug":"entrepreneurship-and-skill-development-programme-esdp",
        "name":"Entrepreneurship and Skill Development Programme (ESDP)",
        "type":"training_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Development Commissioner",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf",
        "source_url":"https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Approved ESDP Guidelines",
        "source_anchor":"Background; Aims and objectives; Enterprise Development Centres",
        "summary":"Entrepreneurship awareness, skill development and advanced management training intended for aspiring entrepreneurs and existing MSMEs.",
        "objective":"Promote new enterprises, build the capacity of existing MSMEs and develop entrepreneurial, technical and vocational skills across different sections of society.",
        "legal_basis":"Entrepreneurship and Skill Development Programme under the Development of MSMEs vertical of the Office of DC(MSME)",
        "eligibility":{"entity_types":["aspiring_entrepreneur","micro","small","medium","training_participant","training_institution"],"founder_categories":["women","sc_st","differently_abled","ex_servicemen","bpl"],"conditions":["specific programme component and implementing agency determine eligibility","course, participant and institution requirements apply","local programme schedule must be checked"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://msme.gov.in/","route":"find the current ESDP/EAP/MDP programme through the Ministry, MSME-DI, Technology Centre or listed implementing institution","applicant_note":"This is training and capacity support; it is not a guaranteed grant or business loan."},
        "fine_print":{"components":["Entrepreneurship Awareness Programme","Entrepreneurship-cum-Skill Development Programme","Advanced ESDP","Management Development Programme","Advanced MDP"],"target_groups":["young persons","aspiring entrepreneurs","existing MSMEs","SC/ST","women","differently abled persons","ex-servicemen","BPL persons"],"delivery_note":"Programme duration, participant limits, course subject and local schedule vary by component and implementing institution.","review_note":"Confirm current course calendar, registration route, fees, participant eligibility, implementing institution and any revised 15th Finance Commission terms before publication."},
        "benefit_summary":{"types":["training","mentorship","skill_development"],"summary":"Entrepreneurship, technical, vocational and management training through current Ministry and implementing-institution programmes."},
        "benefit_type":"training",
        "benefit_label":"Entrepreneurship and skill-development training",
        "benefit_conditions":{"component_and_schedule_required":true,"implementing_institution_route_required":true},
        "requirement":"Eligible participant or implementing institution",
        "requirement_description":"The applicant must fit the selected ESDP component and follow the current programme or institutional registration route.",
        "rules":{"all":[{"field":"esdp_component_available","operator":"equals","value":true},{"field":"participant_or_institution_eligible","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Choose the appropriate component","description":"Identify the current awareness, skill, advanced ESDP, management or advanced MDP programme matching the need.","url":"https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf"},{"title":"Verify participant and course conditions","description":"Check the current implementing institution, participant category, course duration, location and enrolment requirements.","url":"https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf"},{"title":"Register with the official programme provider","description":"Complete the provider’s current registration and retain attendance, completion and certificate evidence.","url":"https://msme.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Training opportunities open according to local programme calendars and implementing-institution schedules; no universal deadline is asserted.",
        "window_evidence":{"source_url":"https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf","anchor":"Programme components and implementing agencies"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', case when item ? 'amount_max' then (item->>'amount_max')::numeric else null end, case when item ? 'percentage' then (item->>'percentage')::numeric else null end, item->'benefit_conditions'
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
