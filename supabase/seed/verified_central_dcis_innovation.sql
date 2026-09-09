-- Digital Communication Innovation Square (DCIS) record. The official
-- material says the sub-scheme was extended through March 2026. The current
-- portal describes application rounds only for 2021, 2022 and 2023, so this
-- is a closed, review-gated historical record until a later extension or
-- fresh call is verified.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DoT DCIS official portal', 'https://dcis.dot.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official DCIS portal implemented by TCOE India under the Department of Telecommunications; the current page describes application rounds in 2021, 2022 and 2023 and requires review for any later call.'),
  ('DoT DCIS FAQ', 'https://dcis.dot.gov.in/page/faq', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official FAQ describing startup/MSME eligibility, online application, review process and grant ceilings.'),
  ('DoT DCIS revised guidelines', 'https://www.dot.gov.in/static/uploads/2025/07/2f60438eb0a477fabf48adb932863d0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guidelines extending the DCIS sub-scheme up to March 2026 and describing its implementation framework.'),
  ('DoT DCIS official eligibility flyer', 'https://www.dot.gov.in/static/uploads/2025/07/86ad6f0555dd4aa05a455d61b2294a3a.pdf', 'official_scheme_flyer', 'central', 'monthly', 1, true, 'Official DoT DCIS flyer with applicant categories, eligibility, milestone-based support and historical 2022 call details.'),
  ('DoT DCIS official scheme flyer', 'https://www.dot.gov.in/static/uploads/2025/07/2bec512b7608564c0515afc86ba83da0.pdf', 'official_scheme_flyer', 'central', 'monthly', 1, true, 'Official DoT DCIS flyer with objectives, applicant categories and funding bands.'),
  ('DoT DCIS grant SOP and terms', 'https://www.dot.gov.in/static/uploads/2025/07/ab1626d64d8125b7ef400cf641abfc65.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DoT DCIS funding guidelines and grant SOP covering duration, eligible expenditure, due diligence, milestones, disbursement and reporting.'),
  ('DoT eServices DCIS listing', 'https://www.eservices.dot.gov.in/service-list', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department of Telecommunications eServices listing for DCIS and related telecom innovation services.')
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
        "slug":"digital-communication-innovation-square-dcis",
        "name":"Digital Communication Innovation Square (DCIS)",
        "type":"innovation_grant",
        "lifecycle_status":"closed",
        "authority":"Department of Telecommunications",
        "authority_url":"https://www.dot.gov.in/",
        "canonical_url":"https://dcis.dot.gov.in/",
        "source_url":"https://dcis.dot.gov.in/page/faq",
        "source_kind":"agency",
        "source_title":"DCIS Scheme FAQ",
        "source_anchor":"What is the DCIS Scheme?; Who can apply?; How much DCIS funding can an applicant receive?; online application and Technical Expert Committee review",
        "summary":"A Department of Telecommunications innovation-support route for startups and MSMEs working on digital communication technologies, covering proof of concept, prototype development, trials, market entry and commercialization.",
        "objective":"Build the research-to-commercialization ecosystem for digital communication, telecom equipment and related applications by supporting proof of concept, prototypes, pilots, IPR and market entry.",
        "legal_basis":"Digital Communication Innovation Square under the Champion Services Sector Scheme, implemented by TCOE India under the supervision of the Department of Telecommunications and governed by the current official guidelines.",
        "eligibility":{"entity_types":["startup","msme","company","academic_or_research_entity"],"lifecycle_stages":["idea","early_stage","growth"],"industries":["telecom","digital_communications","communication_software","telecom_equipment","deep_technology"],"locations":["India"],"conditions":["startup or MSME must satisfy the criteria in the current DCIS guidelines","project must fall within the DCIS digital-communication focus areas","applicant must be able to explain the technology, development stage, milestones, budget and commercialization path","application is online and subject to Technical Expert Committee evaluation","future tranches depend on performance assessment and official recommendations"],"exclusions":["projects outside the current DCIS focus areas","claims of automatic grant approval or automatic release of every tranche","applications relying on an expired call without a new official extension or notice","businesses unable to provide the technical, financial, milestone and ownership evidence required by the current call"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://dcis.dot.gov.in/","route":"monitor the official DCIS portal and current call, complete the online application with the required project and entity evidence, and use the applicant dashboard for official status tracking","applicant_note":"UdyamVeda can help structure the project brief and checklist, but the applicant must use its own official account and remain responsible for submissions, declarations and grant compliance."},
        "fine_print":{"benefit_is_grant_support":true,"application_fee":0,"grant_ceiling_as_stated_by_faq":{"startup":"up to INR 50 lakh","msme":"up to INR 2 crore","higher_funding_technology":"up to INR 10 crore","academic_entities":"not included in the stated ceiling"},"selection":"Applications are reviewed by a Technical Expert Committee through an open, transparent and fair process.","tranche_note":"The committee is responsible for future performance assessment and recommendations for disbursement of further tranches.","current_portal_state":"The official DCIS portal states that TCOE India invited applications under the scheme in 2021, 2022 and 2023, and shows beneficiary and tranche information for those rounds; it does not establish a current 2026 application window.","window_note":"The official revised guidelines state that the sub-scheme was extended up to March 2026; no later extension or new call has been verified.","review_note":"Confirm any future extension, fresh call, exact eligible applicant definitions, sector and project scope, milestone schedule, grant agreement, tranche conditions, eligible costs, reporting, IP ownership, audit and recovery terms before publication."},
        "benefit_summary":{"types":["grant","prototype_support","market_entry_support"],"summary":"Historically, official DCIS FAQ material describes non-fee online applications and grant ceilings up to INR 50 lakh for startups, INR 2 crore for MSMEs and up to INR 10 crore for higher-funding technology; amount, approval and tranche release depend on the current call and evaluation."},
        "benefit_type":"grant",
        "benefit_label":"DCIS innovation grant for digital communication projects",
        "benefit_conditions":{"startup_or_msme_criteria_required":true,"technical_evaluation_required":true,"milestone_and_tranche_conditions_apply":true,"current_call_or_extension_required":true,"no_automatic_approval":true},
        "requirement":"Eligible digital-communication project and online technical/financial application",
        "requirement_description":"The applicant must provide the entity profile, technology and project description, development stage, milestones, budget, team, commercialization plan and other evidence required by the current DCIS call and guidelines.",
        "rules":{"all":[{"field":"is_startup_or_msme","operator":"equals","value":true},{"field":"digital_communication_project_identified","operator":"equals","value":true},{"field":"technical_application_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm current DCIS call status","description":"Check the official DCIS portal and DoT notices for a current extension or application call before treating this record as actionable.","url":"https://dcis.dot.gov.in/"},{"title":"Map the project to DCIS focus areas","description":"Describe the technology, proof-of-concept or prototype stage, telecom/digital-communication relevance and commercialization objective against the current guidelines.","url":"https://www.dot.gov.in/static/uploads/2025/07/2f60438eb0a477fabf48adb932863d0.pdf"},{"title":"Prepare the online application","description":"Assemble entity, technical, milestone, budget, team, IP and commercialization evidence and submit through the official portal when a call is open.","url":"https://dcis.dot.gov.in/page/faq"},{"title":"Track evaluation and milestones","description":"Use the official dashboard for status and comply with Technical Expert Committee evaluation, performance assessment, tranche, reporting and grievance requirements.","url":"https://dcis.dot.gov.in/"}],
        "window_type":"closed",
        "window_label":"The official revised guidelines extended the sub-scheme up to March 2026; no current application window is assumed until a later official extension or call is verified.",
        "window_evidence":{"source_url":"https://dcis.dot.gov.in/","anchor":"About Us states applications were invited in 2021, 2022 and 2023; current page shows historical beneficiaries and pending tranches cleared"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Communications', 'Department of Telecommunications', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = coalesce(item->>'lifecycle_status', 'in_review') where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values (version_id, 'https://dcis.dot.gov.in/', 'implementing_agency_portal', 'DoT DCIS official portal', 'About Us: applications invited in 2021, 2022 and 2023; beneficiary and tranche status', now(), false)
    on conflict do nothing;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.dot.gov.in/static/uploads/2025/07/86ad6f0555dd4aa05a455d61b2294a3a.pdf', 'official_scheme_flyer', 'DoT DCIS official eligibility flyer', 'Pages 1-3: applicant categories, DPIIT/MSME/individual eligibility, milestone-based support and historical 2022 call', now(), false),
      (version_id, 'https://www.dot.gov.in/static/uploads/2025/07/2bec512b7608564c0515afc86ba83da0.pdf', 'official_scheme_flyer', 'DoT DCIS official scheme flyer', 'Pages 1-3: objectives, applicant categories, funding bands and PoC-stage acceptance criteria', now(), false),
      (version_id, 'https://www.dot.gov.in/static/uploads/2025/07/ab1626d64d8125b7ef400cf641abfc65.pdf', 'guideline', 'DoT DCIS grant SOP and terms', 'Pages 1-7 and 13-14: scheme duration, eligible expenditure, due diligence, milestones, disbursement, monitoring and grant conditions', now(), false)
    on conflict do nothing;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
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
