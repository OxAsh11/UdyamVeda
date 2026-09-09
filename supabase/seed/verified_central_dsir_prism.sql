-- DSIR PRISM record. The programme family has current 2026 Creative India
-- evidence, but the legacy 30 March 2026 window and new call terms remain
-- separate review questions.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DSIR PRISM official programme page', 'https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DSIR programme page for Promoting Innovations in Individuals, Start-ups and MSMEs; current successor/call status requires review.'),
  ('DSIR PRISM R&D proposals for MSME clusters guidelines', 'https://www.dsir.gov.in/sites/default/files/2019-08/guide_msme_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PRISM guidelines for technology-solution proposals developed with MSME clusters, including support and matching conditions.'),
  ('DSIR PRISM Phase II guidelines', 'https://www.dsir.gov.in/sites/default/files/2019-09/guide_ph2.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PRISM Phase-II guidelines for innovators taking a demonstrated proof of concept toward market and enterprise creation.'),
  ('DSIR Annual Report 2023-24 PRISM status', 'https://www.dsir.gov.in/sites/default/files/2024-09/AR2324E.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official DSIR annual report recording PRISM scope, supported projects and the reported extension through 30 March 2026.'),
  ('DSIR publications index - Creative India PRISM 2025', 'https://www.dsir.gov.in/documents/publications', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DSIR publications index listing Creative-India-PRISM scheme_2025, published 15 May 2026; the linked document and current call terms require review.'),
  ('DSIR Creative India PRISM 2025 compendium', 'https://www.dsir.gov.in/static/uploads/2026/06/471beeb220be61b7c01b478e427b35ae.pdf', 'programme_compendium', 'central', 'monthly', 1, true, 'Official DSIR Creative India PRISM 2025 compendium describing the current programme narrative, TOCIC network, support journey and supported innovations; it does not by itself establish an open application window.'),
  ('PIB DSIR Foundation Day - Creative India PRISM 2025', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2211282&lang=1&reg=3', 'press_release', 'central', 'weekly', 1, true, 'Official PIB release dated 4 January 2026 recording the launch of Creative India 2025 under the PRISM scheme and the PRISM Network Platform.')
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
        "slug":"dsir-prism-innovation-support",
        "name":"DSIR PRISM Innovation Support for Individuals, Start-ups and MSMEs",
        "type":"innovation_grant",
        "lifecycle_status":"active",
        "authority":"Department of Scientific and Industrial Research",
        "authority_url":"https://www.dsir.gov.in/",
        "canonical_url":"https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
        "source_url":"https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism",
        "source_kind":"ministry",
        "source_title":"Promoting Innovations in Individuals, Start-ups and MSMEs (PRISM)",
        "source_anchor":"PRISM programme scope; individual innovators, start-ups, MSMEs and technology solutions for MSME clusters",
        "summary":"A DSIR innovation-support programme for individual innovators, start-ups and MSMEs developing original technology ideas, prototypes, marketable products or technology solutions for MSME clusters.",
        "objective":"Help innovators convert original ideas into working models and prototypes, take demonstrated innovations toward market and support technology solutions addressing common MSME-cluster problems.",
        "legal_basis":"PRISM as a component of the DSIR Industrial Research and Development framework, governed by the applicable DSIR guidelines, calls and successor programme notices.",
        "eligibility":{"entity_types":["individual_innovator","startup","msme","autonomous_institution","public_funded_rd_laboratory","academic_institute","registered_society"],"lifecycle_stages":["idea","prototype","early_stage","growth"],"industries":["deep_technology","green_technology","clean_energy","smart_materials","waste_to_wealth","affordable_healthcare","water_and_sewage","technology_for_msme_clusters"],"locations":["India"],"conditions":["individual/start-up applicants must satisfy the applicable PRISM innovation and technology criteria","Phase-II applicants must have completed PRISM Phase-I or demonstrated proof of concept with another Government institution/agency where required","MSME-cluster technology proposals must be initiated by an eligible institution or laboratory in consultation/collaboration with an MSME cluster","proposal must fit the applicable focus areas, stage, cost and evaluation route","technical, financial, IP, milestone and commercialization evidence must be provided"],"exclusions":["ordinary business expansion without a qualifying innovation or technology-development proposal","claims that a guideline or proposal submission guarantees a grant","MSME-cluster proposals without the required institutional or cluster collaboration","applications relying on the earlier scheme after its reported end date without a current call or successor confirmation"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism","route":"check the current DSIR PRISM or successor call, select the correct individual/start-up/MSME or cluster-support track, and submit through the notified TOCIC/DSIR route","applicant_note":"UdyamVeda can help prepare the technical and evidence checklist, but the applicant must use the official DSIR/TOCIC route and remain responsible for the proposal and grant conditions."},
        "fine_print":{"alternate_current_name":"Creative India 2025 under the PRISM scheme; the official PIB release also describes the PRISM Network Platform - TOCIC Innovator Pulse.","benefit_is_grant_support":true,"track_separation":{"individual_startup":"Prototype, proof-of-concept, scaling or enterprise-creation support depends on the applicable PRISM phase and call.","msme_cluster_rd":"Official cluster guidelines describe project cost up to INR 100 lakh and maximum support up to INR 50 lakh subject to a maximum 50% of approved project cost, with matching contribution; current terms must be verified."},"evaluation":"Proposals are screened and evaluated through the applicable TOCIC/DSIR and expert/advisory route; approval is not automatic.","ip_note":"The applicable track and agreement govern IP ownership and technology-transfer conditions.","window_note":"The earlier PRISM window was reported as extended through 30 March 2026. Current DSIR/PIB evidence shows a Creative India 2025 initiative under PRISM, but it does not by itself establish a universal open application deadline or replace the controlling guidelines.","current_source_reconciliation":"The DSIR publications index lists Creative-India-PRISM scheme_2025 published 15 May 2026, and PIB records its launch on 4 January 2026. Human review must reconcile the new document with the legacy PRISM guidelines before exposing an application action.","review_note":"Confirm current PRISM/Creative India programme identity, applicant definitions, call status, phase thresholds, eligible costs, matching contribution, maximum support, TOCIC route, IP terms, milestones, reporting, audit and recovery conditions before publication."},
        "benefit_summary":{"types":["grant","prototype_support","technology_development"],"summary":"Potential grant-in-aid support for qualifying innovation and technology-development proposals; the cluster guideline describes up to INR 50 lakh support subject to a 50% project-cost cap and matching contribution, while individual/start-up support depends on the applicable phase and call."},
        "benefit_type":"grant",
        "benefit_label":"DSIR PRISM innovation and prototype support",
        "benefit_conditions":{"qualifying_innovation_required":true,"track_specific_eligibility_applies":true,"technical_and_financial_evaluation_required":true,"current_call_or_successor_required":true,"no_automatic_approval":true},
        "requirement":"Qualifying technology proposal and track-specific evidence",
        "requirement_description":"The applicant must provide the innovation or technology proposal, development stage, technical feasibility, team, milestones, budget, IP position, commercialization or MSME-cluster collaboration evidence and any matching contribution required by the current track.",
        "rules":{"all":[{"field":"is_individual_startup_msme_or_eligible_rd_institution","operator":"equals","value":true},{"field":"qualifying_technology_innovation_identified","operator":"equals","value":true},{"field":"prism_track_evidence_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Verify the current PRISM or successor call","description":"Check DSIR’s current programme page and notices to confirm whether the earlier PRISM route is open, replaced or extended.","url":"https://www.dsir.gov.in/promoting-innovations-individuals-start-ups-and-msmes-prism"},{"title":"Select the correct support track","description":"Determine whether the proposal is an individual/start-up innovation, a Phase-II market/enterprise proposal or an institutional technology solution for an MSME cluster.","url":"https://www.dsir.gov.in/sites/default/files/2019-08/guide_msme_0.pdf"},{"title":"Prepare the technical and financial proposal","description":"Assemble the innovation description, proof of concept, milestones, budget, team, IP, commercialization or cluster-collaboration and matching-contribution evidence required by the current call.","url":"https://www.dsir.gov.in/sites/default/files/2019-09/guide_ph2.pdf"},{"title":"Submit through the notified DSIR/TOCIC route","description":"Use the official submission route and respond to technical, financial and advisory screening; retain all proposal, sanction, milestone and reporting records.","url":"https://www.dsir.gov.in/"}],
        "window_type":"closed",
        "window_label":"The earlier PRISM scheme was reported as extended through 30 March 2026; this record remains closed until a current DSIR call, successor route or extension is verified.",
        "window_evidence":{"source_url":"https://www.dsir.gov.in/sites/default/files/2024-09/AR2324E.pdf","anchor":"PRISM Scheme extension through 30.03.2026 in the DSIR Annual Report 2023-24"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Scientific and Industrial Research', item->>'authority_url'
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
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, 'https://www.dsir.gov.in/documents/publications', 'ministry_portal', 'DSIR publications index - Creative India PRISM 2025', 'Creative-India-PRISM scheme_2025 published 15 May 2026', now(), false),
      (version_id, 'https://www.dsir.gov.in/static/uploads/2026/06/471beeb220be61b7c01b478e427b35ae.pdf', 'programme_compendium', 'DSIR Creative India PRISM 2025 compendium', 'Current PRISM programme narrative, TOCIC centres, support journey and supported innovation examples; no universal open-call deadline', now(), false),
      (version_id, 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2211282&lang=1&reg=3', 'press_release', 'PIB DSIR Foundation Day - Creative India PRISM 2025', 'Creative India 2025 launched under the PRISM scheme on 4 January 2026', now(), false)
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
