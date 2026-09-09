-- PACE is an academia-led translational research programme with separate AIR
-- and CRS components. Industry participates as collaborator/validator under
-- defined routes; PACE is not a general startup or MSME grant.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC PACE current programme page', 'https://birac.nic.in/desc_new.php?id=286', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official PACE page describing AIR and CRS, eligibility, funding boundaries, online route and recurring call timing.'),
  ('BIRAC revised PACE guidelines', 'https://www.birac.nic.in/webcontent/1729751841_Revised_PACE_guidelines_oct.pdf', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official revised PACE scheme document covering AIR/CRS eligibility, PoC, funding, IP, monitoring, termination and terms.'),
  ('BIRAC PACE and i4 2025 RFP', 'https://birac.nic.in/webcontent/1745322583_i4_rfp_22_04_2025.pdf', 'call_for_proposals', 'central', 'weekly', 1, true, 'Official historical RFP used for PACE component, TRL and call-specific scope evidence; not a current deadline.'),
  ('BIRAC proposal submission guide', 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official institution registration, PACE proforma and online submission guidance.')
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
        "slug":"birac-pace-academic-research-conversion-to-enterprise",
        "name":"PACE - Promoting Academic Research Conversion to Enterprise",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Biotechnology Industry Research Assistance Council (BIRAC)",
        "authority_url":"https://birac.nic.in",
        "canonical_url":"https://birac.nic.in/desc_new.php?id=286",
        "source_url":"https://birac.nic.in/desc_new.php?id=286",
        "source_kind":"official_birac_pace_programme_page",
        "source_title":"Promoting Academic Research Conversion to Enterprise (PACE)",
        "source_anchor":"Current PACE page: AIR and CRS components, eligibility, funding, online submission and two recurring call windows",
        "summary":"An academia-led BIRAC programme supporting proof-of-concept development through AIR and validation of academic technology by an industrial partner through CRS.",
        "objective":"Support academic collaborations, development of products and technologies up to proof of concept, and validation toward commercialization.",
        "legal_basis":"BIRAC revised PACE Scheme Document including Proposal Submission, Evaluation and Review Guidelines and the applicable BIRAC call/RFP, agreements and IP terms.",
        "eligibility":{"entity_types":["public_academic_institute","private_academic_institute","university","ngo_research_foundation","research_laboratory","company_collaborator","llp_collaborator"],"lifecycle_stages":["research","proof_of_concept","prototype","validation","pre_commercialization"],"industries":["biotechnology","healthcare","lifesciences","diagnostics","medical_devices","drugs","vaccines","agriculture_biotechnology","industrial_biotechnology","environmental_biotechnology","veterinary_sciences","aquaculture"],"locations":["India"],"conditions":["An eligible accredited academic institute, university, NGO or research foundation must be the primary applicant","AIR supports academic proof-of-concept/prototype development and industry or LLP involvement is optional","CRS requires an industrial partner or LLP to validate an academic process or prototype","AIR requires established proof-of-principle, preliminary data, technical credentials and an eligible project route; basic/exploratory research is excluded","CRS requires established PoC, validation-ready data and an industrial partner commitment including the first right for commercialization as applicable","proposals must be submitted online through BIRAC Institution User Registration during the applicable call"],"exclusions":["PACE is not a general direct grant for an ordinary startup, MSME or company without the academia-led route","AIR and CRS are separate components and their funding, TRL, partner and IP terms must not be merged","the CRS no-ceiling statement is not a guaranteed applicant entitlement or a single grant amount","historical RFP deadlines do not establish a current open call","industry collaborator ownership, facility, background-IP and first-right terms require component-specific review"],"thresholds":{"air_project_cost_max_inr":5000000,"air_non_recurring_cost_pct_max":10,"air_duration_months_max":24,"crs_funding_ceiling":"none stated in reviewed guideline","crs_minimum_trl":3,"regular_call_windows":"1 April-15 May and 1 September-15 October","current_call_required":true},"unknown_handling":"needs_information"},
        "application":{"portal":"https://birac.nic.in/","route":"Verify the applicable AIR or CRS call, register the institution as a BIRAC Institution User, prepare the academic and collaborator documents, and submit the proposal online through the official PACE route.","selection":"BIRAC evaluates academic eligibility, proof-of-principle/PoC, translational potential, technical plan, partner readiness, IP and milestones under the applicable component and call.","fees":"No application fee is established by the reviewed PACE sources; verify the active call.","applicant_note":"UdyamVeda may explain the academia-led route and prepare a checklist, but the institution and collaborators must use their own BIRAC accounts, declarations, agreements and submission."},
        "fine_print":{"benefit_buckets":["air_academic_grant","crs_academic_validation_grant","crs_industrial_validation_grant","academic_ip_and_commercialization_route"],"air_support":"AIR grant support has a total project-cost ceiling of INR 50 lakh and non-recurring cost must not exceed 10% of total project cost under the reviewed current PACE page/guideline.","crs_support":"CRS provides grant support to academic and industrial partners for validation of an academic PoC; the reviewed source states no funding ceiling, which must be reconciled with the active call, approved budget and agreement.","ip_support":"AIR IP may remain with academia or be jointly shared with industry as agreed; CRS academic IP remains with academia while the industry partner receives a first right of refusal for commercial exploitation of new IP under the stated conditions.","current_portal_state":"The current PACE page describes two regular annual call windows and need-based additional calls, but the reviewed evidence does not establish a currently open PACE RFP or deadline on 8 September 2026.","window_note":"Keep paused until the active AIR/CRS call, RFP, opening date, closing date, scope and current terms are verified.","review_note":"Reconcile revised guideline and current RFP for applicant accreditation, PI qualifications, proof-of-principle/PoC, TRL, collaborator age/ownership/facility, background IP, first right of refusal, budgets, milestones, monitoring, termination and IP documents."},
        "benefit_summary":{"types":["grant","research_support","commercialization_support"],"summary":"Academia-led AIR proof-of-concept and CRS industrial validation support with separate academic and collaborator benefits and IP conditions; active call required.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"BIRAC PACE AIR/CRS academic translational research support - component-specific",
        "benefit_conditions":{"current_call_required":true,"academia_primary_applicant_required":true,"air_and_crs_separate":true,"crs_industrial_partner_required":true},
        "requirement":"Accredited academic primary applicant, proof-of-principle or PoC evidence, component-specific collaborator and IP documents, and active PACE call",
        "requirement_description":"Prepare institute accreditation, PI credentials, prior funded work and publication/patent evidence where required, proof-of-principle or PoC data, technical plan, milestones, budget, collaborator commitment, background-IP statement, authorization and current-call attachments.",
        "rules":{"all":[{"field":"eligible_academic_primary_applicant_verified","operator":"equals","value":true},{"field":"current_pace_call_verified","operator":"equals","value":true},{"field":"air_or_crs_component_verified","operator":"equals","value":true},{"field":"proof_of_principle_or_poc_evidence_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current PACE component and call","description":"Check the official PACE page and current BIRAC RFP for AIR or CRS, dates, scope, applicant route and current terms before treating the record as actionable.","url":"https://birac.nic.in/desc_new.php?id=286"},{"title":"Classify AIR versus CRS","description":"Determine whether the proposal develops PoC through AIR or validates an academic prototype through CRS, then verify the academic primary applicant and industrial-partner conditions.","url":"https://www.birac.nic.in/webcontent/1729751841_Revised_PACE_guidelines_oct.pdf"},{"title":"Prepare evidence and agreements","description":"Assemble accreditation, PI credentials, proof-of-principle/PoC, preliminary data, technical plan, milestones, budget, collaborator commitment and background-IP/first-right documents.","url":"https://birac.nic.in/webcontent/1745322583_i4_rfp_22_04_2025.pdf"},{"title":"Submit and track the project","description":"Register the institution, submit through the official BIRAC PACE proforma, retain the agreement and track milestones, validation, reporting, IP and commercialization conditions.","url":"https://www.birac.nic.in/howtoSubmitProposal.php"}],
        "window_type":"call_for_applications",
        "window_label":"Paused: BIRAC describes two regular PACE call windows, but no current AIR/CRS RFP or deadline was verified on 8 September 2026.",
        "window_evidence":{"source_url":"https://birac.nic.in/desc_new.php?id=286","anchor":"Call for proposals: two recurring windows, 1 April-15 May and 1 September-15 October; active RFP still required"}
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
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;
    version_id := null;
    insert into public.opportunity_versions (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.86, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where public.opportunities.id = seed_opportunity_id;
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.birac.nic.in/webcontent/1729751841_Revised_PACE_guidelines_oct.pdf', 'scheme_guideline', 'BIRAC revised PACE guidelines', 'AIR and CRS eligibility, funding, IP, monitoring and terms', now(), false),
      (version_id, 'https://birac.nic.in/webcontent/1745322583_i4_rfp_22_04_2025.pdf', 'call_for_proposals', 'BIRAC PACE and i4 2025 RFP', 'PACE AIR/CRS scope, TRL and historical deadline', now(), false),
      (version_id, 'https://www.birac.nic.in/howtoSubmitProposal.php', 'implementing_agency_portal', 'BIRAC proposal submission guide', 'Institution registration, PACE proforma and online submission', now(), false)
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
