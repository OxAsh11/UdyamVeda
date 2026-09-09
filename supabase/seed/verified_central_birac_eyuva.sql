-- E-YUVA is a student and researcher innovation route administered through
-- BIRAC E-YUVA Centres, not a general incorporated-company/MSME grant. Its
-- fellowship, research-grant, incubation and mentoring benefits stay separate.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC E-YUVA current programme page', 'https://birac.nic.in/e_yuva.php', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official E-YUVA page describing the two fellow categories, E-YUVA Centres, covered areas and current call state.'),
  ('BIRAC E-YUVA scheme guidelines', 'https://birac.nic.in/webcontent/1643177664_EYUVA_Guidelines.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official E-YUVA guideline document covering EYC eligibility, fellow eligibility, benefits, duration, selection, IP and reporting.'),
  ('BIRAC E-YUVA undergraduate call', 'https://www.birac.nic.in/cfp_view.php?id=112&scheme_type=41', 'call_for_proposals', 'central', 'weekly', 1, true, 'Official historical 3rd E-YUVA Fellow call used for applicant, centre and deadline evidence; not a current open window.'),
  ('BIRAC proposal submission guide', 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official BIRAC account and proposal-submission guidance; the applicable E-YUVA call controls the live route.')
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
        "slug":"birac-eyuva-student-research-innovation",
        "name":"E-YUVA - Empowering Youth for Undertaking Value Added Innovative Translational Research",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in",
        "canonical_url":"https://birac.nic.in/e_yuva.php",
        "source_url":"https://birac.nic.in/e_yuva.php",
        "source_kind":"official_birac_eyuva_programme_page",
        "source_title":"BIRAC E-YUVA",
        "source_anchor":"Current E-YUVA page: Innovation Fellows, E-YUVA Fellows, E-YUVA Centres, covered areas and NO ACTIVE CALLS",
        "summary":"A BIRAC student and researcher innovation programme providing category-specific fellowships, research grants, E-YUVA Centre incubation access and mentoring for translational biotechnology innovation.",
        "objective":"Promote applied, need-oriented and entrepreneurial translational research among undergraduate students, post-graduates, post-doctoral researchers and young innovators, with a pathway toward biotech products and startups.",
        "legal_basis":"BIRAC E-YUVA Scheme Document and the applicable BIRAC call, E-YUVA Centre instructions and fellowship agreement terms; current call status controls live intake.",
        "eligibility":{"entity_types":["indian_student","student_team","postgraduate_researcher","postdoctoral_researcher","institution_affiliated_individual"],"lifecycle_stages":["idea","research","prototype","validation"],"industries":["biotechnology","healthcare","lifesciences","diagnostics","medical_devices","drugs","vaccines","agriculture_biotechnology","industrial_biotechnology","bioinformatics","waste_management","sanitation","clean_energy","ai_or_iot_biotechnology_application"],"locations":["India"],"conditions":["Innovation Fellow route is for an Indian student who has completed a Masters or PhD, subject to the applicable degree-age and full-time E-YUVA Centre requirements","PhD candidates cannot receive the Innovation Fellowship grant and selected fellows cannot pursue a PhD during fellowship tenure under the guideline","E-YUVA Fellow route is for a team of up to five Indian undergraduate students from Indian institutes or colleges, supported by a mentor or guide","The undergraduate team must apply through an E-Cell, Institutional Innovation Council or incubation-centre route as specified by the call","the proposal must be original, interdisciplinary where appropriate, and have societal or commercial potential for an innovative biotech product or technology","application must be submitted online during an active BIRAC E-YUVA call"],"exclusions":["E-YUVA is not a general grant for an incorporated company, ordinary MSME or established startup applying without the student or researcher route","fellowship, research grant, incubation access and mentoring are separate benefits and must not be combined into one cash entitlement","historical E-YUVA calls, selected-fellow lists and existing centre lists do not establish a current open call","E-YUVA Centre institutional support is distinct from fellow-facing support","OCI/PIO and foreign-citizen routes are subject to the guideline's Indian-citizenship boundary and must not be assumed eligible"],"thresholds":{"innovation_fellow_pg_monthly_inr":30000,"innovation_fellow_postdoctoral_monthly_inr":50000,"innovation_fellow_pg_annual_research_grant_inr":200000,"innovation_fellow_postdoctoral_annual_research_grant_inr":500000,"innovation_fellow_duration_months":18,"innovation_fellow_extension_months_max":6,"eyuva_fellow_quarterly_stipend_inr":7500,"eyuva_fellow_annual_team_research_grant_inr":250000,"eyuva_fellow_duration_months":12,"eyuva_team_size_max":5,"eyuva_teams_per_eyc_per_year_max":5},"unknown_handling":"needs_information"},
        "application":{"portal":"https://birac.nic.in/","route":"Check the official E-YUVA page for an active call, create the applicant account on BIRAC, select the applicable Innovation Fellow or E-YUVA Fellow route, and submit through the official online process with the required mentor, institution and proposal details.","selection":"National-level application and shortlisting is conducted with E-YUVA Centres and Knowledge Partners; the applicable call and EYC review process control technical review, interviews, selection and agreement.","fees":"No application fee is established by the reviewed E-YUVA sources; verify the active call.","applicant_note":"UdyamVeda may explain the student route and prepare a checklist, but applicants must use their own BIRAC account, institution records, mentor authorization, declarations and submission."},
        "fine_print":{"benefit_buckets":["innovation_fellow_fellowship","innovation_fellow_research_grant","eyuva_fellow_stipend","eyuva_fellow_research_grant","eyuva_centre_incubation","technical_and_business_mentoring"],"innovation_fellow_support":"The guideline describes INR 30,000 per month plus INR 2 lakh annual research grant for a post-graduate fellow, and INR 50,000 per month plus INR 5 lakh annual research grant for a post-doctoral fellow; these are category-specific and subject to selection and terms.","eyuva_fellow_support":"The guideline describes INR 7,500 quarterly stipend per student and INR 2.5 lakh annual research grant per team, with stipend paid to student accounts and the research grant released to the institute in two instalments subject to mentor and scheme conditions.","incubation_support":"E-YUVA Centres provide pre-incubation space, equipment, mentoring, workshops and access to BioNEST Knowledge Partners; this is non-cash/institution-mediated support and is not a founder grant.","current_portal_state":"The current BIRAC E-YUVA page displayed NO ACTIVE CALLS on 8 September 2026. The reviewed third undergraduate call closed on 15 December 2025 at 05:30 PM and is historical evidence only.","window_note":"Keep paused until a current E-YUVA call is posted with component, centres, opening date, deadline and route.","review_note":"Reconcile the current call with the 2020 guideline, exact fellow category, student citizenship, degree-age conditions, team and mentor requirements, EYC choices, milestone/reporting, IP, agreement and centre-specific instructions before publication."},
        "benefit_summary":{"types":["grant","fellowship","training","mentorship","incubation"],"summary":"Category-specific student and researcher fellowship, research-grant, incubation and mentoring support under BIRAC E-YUVA; active call and applicant route are required.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"BIRAC E-YUVA student/researcher fellowship and research support - component-specific",
        "benefit_conditions":{"current_call_required":true,"student_or_researcher_route_required":true,"component_selection_required":true,"separate_value_buckets":true},
        "requirement":"Student or researcher identity, institution and mentor or E-Cell support, eligible translational biotechnology proposal, and active E-YUVA call",
        "requirement_description":"Prepare the applicant or team identity, Indian citizenship and institution evidence, mentor or E-Cell authorization, selected E-YUVA Centre choices, original translational proposal, unmet-need and commercialization rationale, technical plan, milestones, budget and current-call attachments.",
        "rules":{"all":[{"field":"indian_student_or_researcher_route_verified","operator":"equals","value":true},{"field":"current_eyuva_call_verified","operator":"equals","value":true},{"field":"eligible_eyuva_component_verified","operator":"equals","value":true},{"field":"institution_mentor_or_ecell_support_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current E-YUVA call","description":"Check the official E-YUVA page for an active call, the selected component, participating centres, dates and current instructions before treating the record as actionable.","url":"https://birac.nic.in/e_yuva.php"},{"title":"Classify the applicant route","description":"Determine whether the applicant is an Innovation Fellow or an E-YUVA Fellow team, then verify degree, student, citizenship, mentor and institution/E-Cell conditions.","url":"https://birac.nic.in/webcontent/1643177664_EYUVA_Guidelines.pdf"},{"title":"Choose the centre and prepare the proposal","description":"Prepare the original translational biotechnology proposal, unmet-need and commercialization rationale, technical plan, milestones, budget, mentor authorization and preferred E-YUVA Centre choices.","url":"https://www.birac.nic.in/cfp_view.php?id=112&scheme_type=41"},{"title":"Submit and track the fellowship","description":"Use the official BIRAC account and online route, retain the application and agreement, and track mentoring, research-grant instalments, fellowship or stipend, milestones and reporting through the E-YUVA Centre.","url":"https://www.birac.nic.in/howtoSubmitProposal.php"}],
        "window_type":"call_for_applications",
        "window_label":"Paused: the current E-YUVA page states NO ACTIVE CALLS; the reviewed undergraduate call closed on 15 December 2025 at 05:30 PM.",
        "window_evidence":{"source_url":"https://birac.nic.in/e_yuva.php","anchor":"Call for Proposals: NO ACTIVE CALLS; page last updated 07 September 2026"}
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.87, 0.83, 'in_review')
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
      (version_id, 'https://birac.nic.in/webcontent/1643177664_EYUVA_Guidelines.pdf', 'scheme_guideline', 'BIRAC E-YUVA scheme guidelines', 'EYC eligibility, fellow categories, benefits, duration, selection, IP and terms', now(), false),
      (version_id, 'https://www.birac.nic.in/cfp_view.php?id=112&scheme_type=41', 'call_for_proposals', 'BIRAC 3rd E-YUVA undergraduate call', 'Undergraduate team eligibility, centre list and 15 October 2025 to 15 December 2025 window', now(), false),
      (version_id, 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'BIRAC proposal submission guide', 'Official account and online proposal submission route', now(), false)
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
