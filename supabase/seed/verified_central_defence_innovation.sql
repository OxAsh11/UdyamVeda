-- Current Central Government defence-innovation opportunity from the official iDEX portal.
-- The challenge remains in_review until the problem statement, deadline,
-- eligibility and grant agreement are manually reconciled by a reviewer.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('iDEX official portal', 'https://idex.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official iDEX account and challenge portal.'),
  ('iDEX registration route', 'https://idex.gov.in/register', 'agency_portal', 'central', 'weekly', 1, true, 'Official applicant registration route; consent and account terms require review.'),
  ('iDEX Open Challenge current page', 'https://idex.gov.in/open-challenge/', 'agency_portal', 'central', 'daily', 1, true, 'Current iDEX Open Challenge page; challenge status and deadline are window-sensitive.'),
  ('iDEX how-to-apply guidance', 'https://idex.gov.in/how_to_apply', 'agency_portal', 'central', 'weekly', 1, true, 'Applicant fields, startup/MSME/innovator categories, evaluation and grant route.'),
  ('iDEX FAQ', 'https://idex.gov.in/faq', 'agency_portal', 'central', 'weekly', 1, true, 'Current applicant eligibility, Indian ownership, milestone grant, equity and ceiling caveats.'),
  ('iDEX challenges directory', 'https://idex.gov.in/challenges', 'agency_portal', 'central', 'daily', 1, true, 'Current challenge cards, deadlines and closed/open status for discovery.'),
  ('iDEX programme guidelines', 'https://idex.gov.in/res', 'guideline_index', 'central', 'monthly', 1, true, 'Official SPARK and PMA guideline index; current PDF revision must be reviewed before publication.')
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
        "slug":"idex-open-challenge-2026",
        "name":"iDEX Open Challenge 2026",
        "type":"grant",
        "authority":"Defence Innovation Organisation - iDEX",
        "authority_url":"https://idex.gov.in/",
        "canonical_url":"https://idex.gov.in/open-challenge/",
        "source_url":"https://idex.gov.in/open-challenge/",
        "source_kind":"agency",
        "source_title":"iDEX Open Challenge current page",
        "source_anchor":"Open Challenge; deadline; grant ceiling; applicant route",
        "summary":"A current iDEX challenge route for innovators, startups and MSMEs proposing technologies relevant to Indian defence and aerospace.",
        "objective":"Enable defence-relevant technology development, prototyping and potential adoption through iDEX challenge and grant mechanisms.",
        "legal_basis":"iDEX framework and SPARK grant-in-aid route operated by the Defence Innovation Organisation under the Department of Defence Production.",
        "eligibility":{"entity_types":["dpiit_recognized_startup","msme","individual_innovator"],"lifecycle_stages":["idea","validation","prototype","growth"],"locations":["India"],"industries":["defence","aerospace","dual_use_technology","deep_technology"],"conditions":["proposal must address the applicable current challenge or open-challenge focus","selected applicant must satisfy the current iDEX challenge and grant-agreement conditions","startup ownership and entity evidence must satisfy current official requirements"],"exclusions":["selection is not guaranteed by registration or proposal submission","a generic product without a relevant challenge or focus-area fit is not automatically eligible","grant approval, milestones, procurement and adoption are separate decisions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://idex.gov.in/","route":"Create or use an iDEX account, select the applicable Open Challenge route, complete the applicant and proposal details, and submit before the published deadline.","selection":"A constituted committee evaluates proposals; selected grant-in-aid is released against approved milestones.","applicant_note":"UdyamVeda can prepare the technical, entity and milestone dossier but cannot represent the applicant or promise selection, grant sanction or defence procurement."},
        "fine_print":{"grant_ceiling_inr":15000000,"grant_type":"grant_in_aid","equity_taken_by_dio":false,"milestone_based":true,"milestone_count":6,"current_idex_facts":{"official_pages_checked":"2026-09-07","open_challenge_deadline":"2026-09-30T23:59:00+05:30","open_challenge_grant_ceiling_inr":15000000,"standard_disc_open_challenge_ceiling_inr":15000000,"aditi_ceiling_inr":250000000,"applicant_categories":["startup","msme","individual_innovator"],"ownership_boundary":"The FAQ states that a startup applying to iDEX must have majority Indian stake; the exact evidence and category-specific conditions require reviewer confirmation.","funding_boundary":"iDEX describes grant-in-aid released in milestones and says DIO does not take equity; selection, Product Development Budget approval and the grant agreement remain conditions."},"support":["prototype_and_research_funding","accelerator_or_mentor_access","defence_testing_facilities_and_experts","potential_adoption_pathway"],"review_note":"Confirm the live Open Challenge deadline, problem statement/focus area, current applicant form, Indian ownership evidence, grant agreement, milestone budget, tax/document requirements and any extension before publication."},
        "benefit_summary":{"types":["grant","mentorship","testing_access","market_access"],"amounts":[{"type":"grant_in_aid","max_inr":15000000}],"summary":"Selected applicants may receive milestone-based grant-in-aid up to the published ceiling plus possible accelerator, testing and expert support; this is not an automatic entitlement.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"iDEX Open Challenge grant-in-aid",
        "benefit_conditions":{"selection_required":true,"challenge_fit_required":true,"milestone_approval_required":true,"maximum_grant_inr":15000000,"equity_taken_by_dio":false},
        "requirement":"Challenge-aligned technical and entity proposal",
        "requirement_description":"Provide entity/innovator information, a technical response to the applicable challenge or focus area, financial and milestone details, and the evidence requested by the current iDEX route.",
        "rules":{"all":[{"field":"applicant_type","operator":"in","value":["dpiit_recognized_startup","msme","individual_innovator"]},{"field":"challenge_fit_confirmed","operator":"equals","value":true},{"field":"proposal_submitted_before_deadline","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the current challenge and deadline","description":"Review the live Open Challenge page, focus area/problem statement and deadline before preparing a proposal.","url":"https://idex.gov.in/open-challenge/"},{"title":"Create or use an iDEX account","description":"Register or log in through the official iDEX portal and complete the required applicant details.","url":"https://idex.gov.in/register"},{"title":"Submit the technical proposal","description":"Select the applicable challenge route, provide technical and financial details, and submit before the current deadline.","url":"https://idex.gov.in/how_to_apply"},{"title":"Track evaluation and milestones","description":"If selected, retain the committee decision, Product Development Budget and milestone/grant-agreement records.","url":"https://idex.gov.in/faq"}],
        "window_type":"fixed",
        "window_label":"Current Open Challenge deadline: 30 September 2026 at 11:59 PM IST; verify extension or closure before displaying as actionable.",
        "window_evidence":{"source_url":"https://idex.gov.in/open-challenge/","anchor":"Open Challenge timeline and last date"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Defence', 'Department of Defence Production / Defence Innovation Organisation', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.90, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select id into version_id from public.opportunity_versions where public.opportunity_versions.opportunity_id = seed_opportunity_id and version_number = 1 limit 1;
    end if;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://idex.gov.in/how_to_apply', 'agency', 'iDEX how-to-apply guidance', 'Applicant details, entity details, proposal details and grant route'),
      ('https://idex.gov.in/faq', 'agency', 'iDEX FAQ', 'Eligibility, majority Indian stake, milestone grant and grant/equity boundary'),
      ('https://idex.gov.in/challenges', 'agency', 'iDEX challenges directory', 'Current challenge cards, deadlines and status'),
      ('https://idex.gov.in/res', 'guideline', 'iDEX programme guidelines', 'SPARK and PMA guideline index')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = evidence.source_url);
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id);
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
