-- Chips to Startup (C2S) is a MeitY programme with multiple institutional,
-- collaborative and call-specific routes. The current official portal exposes
-- historical/closed calls and a 2026 RSC call whose deadline has passed; keep
-- the umbrella record paused and do not merge component-specific ceilings.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY Chips to Startup C2S official portal', 'https://c2s.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official MeitY C2S portal covering programme, proposal, resources and support routes.'),
  ('MeitY Chips to Startup C2S programme call page', 'https://c2s.gov.in/callforproposals.jsp', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official C2S programme call page describing startup/MSME participation, project categories, proposal route and the historical second-call deadline.'),
  ('MeitY Chips to Startup C2S guidelines', 'https://c2s.gov.in/guidelines.jsp', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official C2S guidelines for proposal requirements, collaboration, EDA/fabrication support, milestones, reporting and IP.'),
  ('MeitY Chips to Startup C2S eligibility', 'https://c2s.gov.in/eligibility.jsp', 'scheme_guideline', 'central', 'monthly', 1, true, 'Official C2S eligibility page for academic/R&D organizations and the startup/MSME definition boundary.'),
  ('MeitY Chips to Startup C2S BLDC call', 'https://c2s.gov.in/call_for_proposal.jsp', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official C2S startup/MSME BLDC Motor Controller ASIC call; the page currently states that proposal submission is closed.'),
  ('MeitY Chips to Startup C2S RSC call', 'https://c2s.gov.in/call_for_proposal_RSCs.jsp', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official C2S Regional Support Centre call; the page records a 22 July 2026 submission deadline.'),
  ('MeitY Chips to Startup ChipIN EDA access', 'https://c2s.gov.in/request_for_EDA_Tool.jsp', 'implementing_agency_portal', 'central', 'monthly', 1, true, 'Official route for institutions and R&D organizations seeking centralized EDA-tool access under C2S.')
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
        "slug":"chips-to-startup-c2s",
        "name":"Chips to Startup (C2S) Programme",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Ministry of Electronics and Information Technology (MeitY)",
        "authority_url":"https://meity.gov.in",
        "canonical_url":"https://c2s.gov.in/",
        "source_url":"https://c2s.gov.in/callforproposals.jsp",
        "source_kind":"official_meity_c2s_portal",
        "source_title":"Chips to Startup (C2S) Programme",
        "source_anchor":"Official C2S programme call page: startup/MSME participation, project categories, proposal route, evaluation and call-window history",
        "summary":"A MeitY semiconductor-design programme that supports eligible academia, R&D organizations, startups and MSMEs through project proposals, industry-academia collaboration, EDA access, fabrication support and call-specific financial assistance.",
        "objective":"Build specialized VLSI and embedded-system capability, strengthen industry-academia R&D, develop reusable IP and ASIC/SoC/system projects, and support commercialization-oriented semiconductor design work.",
        "legal_basis":"MeitY Chips to Startup programme and its applicable project-category guidelines, proposal formats, terms and notified calls; each current call controls its own eligibility, benefit, deadline and agreement terms.",
        "eligibility":{"entity_types":["startup","micro_small_enterprise","academic_institution","research_and_development_organization","industry_academia_consortium"],"lifecycle_stages":["research","prototype","validation","commercialization"],"industries":["semiconductor_design","vlsi","embedded_systems","electronics_system_design_and_manufacturing","asic","soc","ip_core","fabless_chip_design"],"locations":["India"],"conditions":["applicant must fit the current C2S project category and notified call","startup/MSME status is determined under the extant DPIIT or Ministry of MSME norms","project must state technical novelty, deliverables, targeted TRL, fabrication/testing or prototype plan and commercialization or technology-transfer roadmap as applicable","collaborative proposals must define nodal institution, roles, financial requirements, timelines and applicable MoUs","academic institutions must meet the infrastructure, faculty, accreditation and student-project conditions applicable to their category","the applicant must submit through the current official C2S route and proposal format"],"exclusions":["the umbrella programme is not a universal direct grant for every startup or MSME","programme-level manpower or institution counts are not applicant benefits","EDA access, fabrication support, training, grant-in-aid and project funding are separate benefit buckets","the historical second-call deadline and closed BLDC call do not establish a current open general call","the RSC call is institution-led and its 22 July 2026 deadline has passed","no generic C2S grant ceiling may be inferred from the portal without the controlling call and category terms"],"thresholds":{"current_call_required":true,"startup_and_msme_definition":"extant DPIIT or Ministry of MSME norms","academic_preexisting_lab_infrastructure_required":true,"industry_academia_end_user_contribution_preferred_percent":10},"unknown_handling":"needs_information"},
        "application":{"portal":"https://c2s.gov.in/","route":"Verify the current C2S call or support route, select the applicable project category, prepare the prescribed technical and financial proposal with supporting documents, register/login on the official portal and submit through the notified route.","selection":"Proposal scrutiny and evaluation by the applicable Evaluation or Review Committee; approval and support depend on the current call, category, budget, milestones and notified terms.","fees":"No generic application fee is established by the reviewed C2S programme pages; verify the current call and proposal instructions.","applicant_note":"UdyamVeda may explain the applicable route and prepare a checklist, but the applicant or institution must use its own official C2S account, declarations, proposal and submission."},
        "fine_print":{"benefit_is_not_one_cash_entitlement":true,"benefit_buckets":["project_financial_support","industry_academia_collaboration","eda_tool_access","fabrication_or_mpw_support","training_and_design_infrastructure"],"milestone_release":"The guidelines state that milestone-linked fund releases apply to participating institutions under the approved project.","infrastructure":"No separate funds are provided for creation of new facilities under the general guidelines; existing infrastructure and category-specific support conditions apply.","accountability":"Participating institutions must maintain project, PFMS, reporting, inventory, IP and utilization records as applicable to the current category and agreement.","ip":"IP sharing among collaborators follows the mutually agreed terms included in the proposal and applicable programme conditions.","current_portal_state":"The official portal currently shows a historical second C2S call with a 15 September 2023 deadline, a BLDC Motor Controller ASIC call marked closed, and an RSC call with a 22 July 2026 deadline. No currently open general C2S call was verified on 8 September 2026.","window_note":"Keep the umbrella record paused until a current startup/MSME or institution-facing call is verified; create separate component records if a new call has materially different eligibility, benefit, deadline or application terms.","review_note":"Reconcile the active project category, current call, budget or support ceiling, applicant boundary, proposal format, evaluation, milestones, fund release, fabrication, EDA access, PFMS, IP, reporting, audit and grievance terms before publication."},
        "benefit_summary":{"types":["grant","non_financial_support","fabrication_support","training"],"summary":"Call-specific project support plus EDA, fabrication and design-infrastructure access for eligible C2S participants; no generic applicant amount is established by the reviewed umbrella pages.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"C2S call-specific project support with EDA/fabrication access",
        "benefit_conditions":{"current_call_required":true,"category_specific_terms_required":true,"milestone_release_possible":true,"eda_and_fabrication_support_call_dependent":true,"generic_ceiling_not_established":true},
        "requirement":"Current C2S call/category fit with technical proposal, institutional or startup/MSME evidence and applicable collaboration, infrastructure, milestone and reporting documents",
        "requirement_description":"Prepare the current prescribed proposal, applicant-status evidence, technical novelty and deliverables, targeted TRL, EDA/fabrication/testing plan, commercialization or technology-transfer roadmap, team and collaborator details, budget/contribution, MoU or end-user letter where applicable, and supporting certificates as required by the current category.",
        "rules":{"all":[{"field":"current_c2s_call_or_route_verified","operator":"equals","value":true},{"field":"applicant_fits_current_c2s_category","operator":"equals","value":true},{"field":"project_is_relevant_to_semiconductor_design_or_c2s_scope","operator":"equals","value":true},{"field":"required_infrastructure_and_team_evidence_available","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current C2S call or support route","description":"Check the official C2S call pages and resources for an open startup/MSME, academic/R&D, RSC, EDA or other notified route; do not rely on a historical call date.","url":"https://c2s.gov.in/"},{"title":"Classify the applicant and project category","description":"Confirm startup/MSME or academic/R&D eligibility, project category, semiconductor-design scope, existing infrastructure, CI/Co-CI and collaborator requirements.","url":"https://c2s.gov.in/eligibility.jsp"},{"title":"Prepare the technical and financial proposal","description":"Use the current prescribed format and assemble novelty, TRL, deliverables, EDA/fabrication/testing, commercialization, budget, contribution, supporting certificates and collaboration documents.","url":"https://c2s.gov.in/guidelines.jsp"},{"title":"Submit through the official C2S route and track milestones","description":"Register or log in on the official portal, submit the notified proposal and retain evaluation, approval, agreement, milestone, PFMS, utilization, IP and reporting records.","url":"https://c2s.gov.in/callforproposals.jsp"}],
        "window_type":"call_for_applications",
        "window_label":"Paused: historical C2S calls are visible, the BLDC call is marked closed and the RSC call deadline was 22 July 2026; no current general C2S call was verified on 8 September 2026.",
        "window_evidence":{"source_url":"https://c2s.gov.in/call_for_proposal.jsp","anchor":"Official BLDC call page states proposal submission is closed; the official RSC page records a 22 July 2026 deadline, while the programme page records the historical 15 September 2023 second-call deadline."}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'ministry', item->>'authority', 'Chips to Startup (C2S)', item->>'authority_url'
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
      (version_id, 'https://c2s.gov.in/', 'implementing_agency_portal', 'MeitY C2S official portal', 'Official C2S programme, resources and support routes', now(), false),
      (version_id, 'https://c2s.gov.in/guidelines.jsp', 'scheme_guideline', 'MeitY C2S guidelines', 'Proposal requirements, collaboration, EDA/fabrication, milestones, reporting and IP', now(), false),
      (version_id, 'https://c2s.gov.in/eligibility.jsp', 'scheme_guideline', 'MeitY C2S eligibility', 'Academic/R&D eligibility and startup/MSME definition boundary', now(), false),
      (version_id, 'https://c2s.gov.in/call_for_proposal.jsp', 'implementing_agency_portal', 'MeitY C2S BLDC call', 'Official page states proposal submission is closed', now(), false),
      (version_id, 'https://c2s.gov.in/call_for_proposal_RSCs.jsp', 'implementing_agency_portal', 'MeitY C2S RSC call', 'Official page records 22 July 2026 deadline', now(), false),
      (version_id, 'https://c2s.gov.in/request_for_EDA_Tool.jsp', 'implementing_agency_portal', 'MeitY C2S ChipIN EDA access', 'Institutional EDA access route and infrastructure requirements', now(), false)
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
