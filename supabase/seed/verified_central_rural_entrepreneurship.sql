-- Current Central Government rural-entrepreneurship opportunity from the
-- official SVEP/National Rural Livelihoods Mission portal.
-- Local State/block coverage and the applicable finance route remain review gates.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('SVEP official root portal', 'https://svep.nrlm.gov.in', 'implementing_portal', 'central', 'weekly', 1, true, 'Official SVEP portal root used as the authority URL for the programme record.'),
  ('SVEP official portal', 'https://www.svep.nrlm.gov.in/landing', 'implementing_portal', 'central', 'weekly', 1, true, 'Official SVEP portal describing programme purpose, support model, implementation and current update date.'),
  ('SVEP FAQ and operating detail', 'https://svep.nrlm.gov.in/svepdemo/pdf/FAQ_SVEP.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official FAQ for entrepreneur registration, business-plan support and CRP-EP workflow; not a universal national entitlement.'),
  ('SVEP official contact route', 'https://svep.nrlm.gov.in/contactUs', 'implementing_portal', 'central', 'monthly', 2, true, 'Official technical/contact route for the SVEP portal and implementation questions.'),
  ('DAY-NRLM rural entrepreneurship context', 'https://rural.gov.in/', 'ministry_portal', 'central', 'monthly', 1, true, 'Ministry of Rural Development authority context for DAY-NRLM-linked implementation.')
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
        "slug":"startup-village-entrepreneurship-programme",
        "name":"Start-up Village Entrepreneurship Programme (SVEP)",
        "type":"business_support",
        "authority":"DAY-NRLM - Start-up Village Entrepreneurship Programme",
        "authority_url":"https://svep.nrlm.gov.in/",
        "canonical_url":"https://www.svep.nrlm.gov.in/landing",
        "source_url":"https://www.svep.nrlm.gov.in/landing",
        "source_kind":"agency",
        "source_title":"SVEP official portal",
        "source_anchor":"Objective, focus areas, support model, DAY-NRLM relationship and last-updated date",
        "summary":"Rural entrepreneurship support under DAY-NRLM for setting up and stabilising early-stage non-farm enterprises.",
        "objective":"Help rural poor establish enterprises and access business development support, training, mentoring, finance and convergence assistance until the enterprise stabilises.",
        "legal_basis":"SVEP is described by the official portal as a budget-announced sub-scheme under the Deendayal Antyodaya Yojana-National Rural Livelihoods Mission (DAY-NRLM).",
        "eligibility":{"entity_types":["individual","rural_household","micro_enterprise","self_employed_person"],"lifecycle_stages":["idea","new_business","early_operation"],"locations":["rural_area_in_covered_block"],"founder_categories":["rural_poor","women","youth","self_employed"],"activities":["non_farm_enterprise","trading","manufacturing","services","skill_based_work"],"conditions":["the proposed or existing enterprise must fall within an active SVEP implementation area","the applicant must satisfy the applicable State/block and community-implementation process","business profile and plan information must be available for the local support workflow"],"exclusions":["SVEP is not represented as a universal direct national cash or loan entitlement","the official portal route does not itself prove that a particular block is currently covered","finance, training, mentoring and convergence support may have separate local conditions"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://www.svep.nrlm.gov.in/landing","route":"Confirm coverage with the relevant State Rural Livelihoods Mission, Block Resource Centre or local SVEP implementation channel; use the official portal for programme context and authorised workflow support.","direct_online_application":false,"applicant_note":"UdyamVeda can prepare a rural-business profile, plan and document checklist but cannot create a local SVEP entitlement or submit through a community implementation user account."},
        "fine_print":{"support_model":["financial_assistance","business_management_training","soft_skills_training","business_development_support","mentoring","banking_linkage","scheme_convergence"],"direct_cash_benefit":false,"current_svep_facts":{"official_portal_last_updated":"2026-01-19","programme_relationship":"The official portal describes SVEP as part of DAY-NRLM, a centrally sponsored programme implemented since June 2011; it says SVEP was approved as an NRLM sub-scheme in May 2015 and guidelines were issued on 15 June 2015.","delivery_model":"Support is delivered through State/block implementation structures and community cadres such as CRP-EPs and local enterprise-support institutions; the FAQ describes profile, business-plan and repayment-data workflows.","target_enterprises":"The portal describes support for new and early-stage enterprises that may otherwise struggle to start, with a focus on rural non-farm livelihoods, youth and women.","amount_boundary":"The current portal does not establish one universal applicant-level grant or loan ceiling; the applicable finance and support terms must be confirmed in the covered State/block route."},"review_note":"Confirm the applicant route, covered blocks, local State Rural Livelihoods Mission, business-support centre, finance mechanism, contribution/repayment terms, eligible activity, documents, fees, service timeline and current intake before publication."},
        "benefit_summary":{"types":["business_support","training","mentorship","finance_linkage","convergence"],"summary":"Local implementation support for rural enterprise creation and stabilisation; exact finance and service terms vary by the covered State/block route and are not a universal direct entitlement.","separate_value_buckets":true},
        "benefit_type":"business_support",
        "benefit_label":"SVEP rural enterprise support",
        "benefit_conditions":{"covered_block_required":true,"local_implementation_route_required":true,"business_profile_required":true,"finance_terms_local_and_conditional":true},
        "requirement":"Covered rural area and enterprise profile",
        "requirement_description":"Establish that the applicant and proposed or existing non-farm enterprise fall within an active SVEP implementation area and provide the profile, business-plan and support information required by the local workflow.",
        "rules":{"all":[{"field":"location_type","operator":"equals","value":"rural"},{"field":"svep_block_covered","operator":"equals","value":true},{"field":"enterprise_profile_present","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check State and block coverage","description":"Confirm that the applicant's block is covered by the current SVEP/DAY-NRLM implementation route.","url":"https://www.svep.nrlm.gov.in/landing"},{"title":"Contact the local enterprise-support route","description":"Ask the State Rural Livelihoods Mission, Block Resource Centre or authorised local cadre about current intake and the applicable support process.","url":"https://svep.nrlm.gov.in/contactUs"},{"title":"Prepare the entrepreneur profile and business plan","description":"Collect the profile, education/work, income, credit, expenditure and enterprise information needed for the authorised workflow and business-plan preparation.","url":"https://svep.nrlm.gov.in/svepdemo/pdf/FAQ_SVEP.pdf"},{"title":"Track local finance and support conditions","description":"Record the local finance, training, mentoring, banking-linkage and convergence terms separately; do not combine them into a single guaranteed benefit.","url":"https://www.svep.nrlm.gov.in/landing"}],
        "window_type":"rolling",
        "window_label":"Programme support is subject to current State/block coverage and local implementation intake; no universal national deadline is inferred.",
        "window_evidence":{"source_url":"https://www.svep.nrlm.gov.in/landing","anchor":"Focus areas, implementation model and current portal update"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Rural Development', 'DAY-NRLM / Start-up Village Entrepreneurship Programme', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.89, 'in_review')
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
      ('https://svep.nrlm.gov.in/svepdemo/pdf/FAQ_SVEP.pdf', 'guideline', 'SVEP FAQ and operating detail', 'Entrepreneur profile, business-plan and CRP-EP workflow'),
      ('https://svep.nrlm.gov.in/contactUs', 'agency', 'SVEP official contact route', 'Official technical and implementation contact'),
      ('https://rural.gov.in/', 'ministry', 'DAY-NRLM rural entrepreneurship context', 'Ministry of Rural Development authority context')
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
