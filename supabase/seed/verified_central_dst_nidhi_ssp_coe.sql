-- Review-gated DST/NIDHI records. These are distinct from NIDHI PRAYAS.

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
        "slug":"dst-nidhi-seed-support-program",
        "name":"NIDHI Seed Support Program (NIDHI-SSP)",
        "type":"grant",
        "authority":"Department of Science and Technology - NIDHI",
        "authority_url":"https://dst.gov.in/",
        "canonical_url":"https://nidhi.dst.gov.in/nidhissp/",
        "source_url":"https://nidhi.dst.gov.in/nidhissp/",
        "source_kind":"scheme_page",
        "source_title":"NIDHI Seed Support Program",
        "source_anchor":"Purpose, support limits, application route and beneficiaries",
        "summary":"Intermediary-led seed support route in which DST supports incubators/TBIs to help promising technology or knowledge-based startups bridge development and commercialization.",
        "objective":"Provide timely seed support through eligible incubators and TBIs for promising ideas, innovations and technologies moving toward market validation and commercialization.",
        "legal_basis":"Department of Science and Technology NIDHI umbrella programme; NIDHI Seed Support Program guidelines and official programme page.",
        "eligibility":{"entity_types":["technology_or_knowledge_based_startup","innovator","entrepreneur","student","researcher","incubator","technology_business_incubator"],"lifecycle_stages":["idea","prototype","validation","early_stage","commercialization"],"industries":["technology_enabled","deep_technology","knowledge_based_innovation","research_commercialization"],"locations":["India"],"conditions":["startup route is through a listed NIDHI Seed Supported TBI or incubator","the relevant TBI must have a current call or verified intake route","support is assessed by the intermediary under its call and process","incubator-level support and startup-level support are separate value buckets"],"thresholds":{"startup_max_support_inr":10000000,"incubator_max_support_inr":100000000,"incubator_application_frequency":"once_per_year"},"unknown_handling":"needs_information"},
        "exclusions":["automatic entitlement to the maximum amount","direct application to DST by every startup without the listed-TBI route","treating the incubator ceiling as a founder benefit","a current open call inferred from the scheme page alone","financial instrument, repayment, equity or milestone terms not verified in the current guideline and TBI call"],
        "application":{"portal":"https://nidhi.dst.gov.in/documents/","route":"Startups and entrepreneurs apply to listed NIDHI Seed Supported TBIs when those TBIs announce calls. Incubator applications are accepted through the official online route once per year when a call is announced.","selection":"TBI or incubator call, technical and commercial assessment, need/capability review, milestones and programme-specific terms; verify the current guideline and call before publication.","fees":"No fee is inferred from the official programme page.","applicant_note":"UdyamVeda should route a founder to a verified listed TBI and current call, not represent itself as the DST application portal."},
        "fine_print":{"route":"The programme page describes two linked levels: DST support to incubators/TBIs and seed support by those intermediaries to deserving startups.","startup_support":"The official page states support up to INR 100 lakh (INR 1 crore) for a deserving startup; this is a maximum, not a guaranteed grant or universal entitlement.","incubator_support":"The official page states maximum support up to INR 1000 lakh (INR 10 crore) for incubators, released in phases according to need, capacity and capability. This is not the startup's benefit ceiling.","calls":"Startup calls are periodic at listed TBIs and the incubator call is announced at an appropriate time. The current NIDHI page does not display a universal open call.","review_note":"Verify the current guideline, listed TBI set, financial instrument, selection, milestones, reporting, disbursement and any repayment, equity, tax or clawback terms before publication."},
        "benefit_summary":{"types":["seed_support","incubation_access"],"summary":"Up to INR 1 crore per deserving startup through listed NIDHI Seed Supported TBIs, subject to a current TBI call and its reviewed terms.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Up to INR 1 crore per deserving startup through a listed NIDHI Seed Supported TBI; maximum only",
        "amount_max":10000000,
        "benefit_conditions":{"intermediary_incubator_route":true,"listed_tbi_required":true,"periodic_call_required":true,"startup_amount_max_inr":10000000,"incubator_amount_max_inr":100000000,"not_universal_entitlement":true,"instrument_terms_require_guideline_review":true},
        "requirement":"Verified technology or knowledge-based startup with a listed-TBI route and current call",
        "requirement_description":"Prepare founder/team profile, technology or innovation description, prototype or validation evidence, business model, market and traction evidence, fund-use plan, IP details, incorporation/status records and declarations requested by the selected TBI call.",
        "rules":{"all":[{"field":"technology_or_knowledge_based_startup_or_innovator","operator":"equals","value":true},{"field":"listed_nidhi_seed_supported_tbi_route_verified","operator":"equals","value":true},{"field":"current_tbi_call_open_or_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Check the current NIDHI Seed Supported TBI list","description":"Use the official NIDHI documents index and verify that the selected incubator is listed and currently accepting the relevant startup route.","url":"https://nidhi.dst.gov.in/documents/"},{"title":"Read the current TBI call and NIDHI-SSP terms","description":"Confirm the call deadline, eligible stage, instrument, milestones, documents, selection and reporting terms before treating the amount as applicable.","url":"https://nidhi.dst.gov.in/document/nidhi-seed-support-program-nidhi-ssp-guidelines/"},{"title":"Apply through the selected TBI","description":"Submit through the TBI's official call route and retain the versioned application and communication record.","url":"https://nidhi.dst.gov.in/nidhissp/"}],
        "window_type":"call_for_applications",
        "window_label":"Startup calls are periodic at listed TBIs; the NIDHI page does not display a universal open call currently. No current deadline is asserted.",
        "window_evidence":{"source_url":"https://nidhi.dst.gov.in/nidhissp/","anchor":"How to Apply and current programme updates"},
        "review_note":"Human review must confirm the current TBI list, open call, financial instrument and all startup-level fine print before publication. Do not present the incubator ceiling as founder funding."
      },
      {
        "slug":"dst-nidhi-centres-of-excellence",
        "name":"NIDHI Centres of Excellence (NIDHI-CoE)",
        "type":"incubation",
        "authority":"Department of Science and Technology - NIDHI",
        "authority_url":"https://dst.gov.in/",
        "canonical_url":"https://nidhi.dst.gov.in/nidhicoe/",
        "source_url":"https://nidhi.dst.gov.in/nidhicoe/",
        "source_kind":"scheme_page",
        "source_title":"NIDHI Centres of Excellence",
        "source_anchor":"Objectives, support description, How to Apply and beneficiaries",
        "summary":"DST-backed Centres of Excellence strengthen selected incubator capacity and provide technology incubation, prototyping, IP, mentoring and acceleration access for high-potential startups.",
        "objective":"Make selected incubators world-class and state-of-the-art while helping technology innovations become marketable products and high-growth ventures.",
        "legal_basis":"Department of Science and Technology NIDHI umbrella programme; NIDHI Centres of Excellence programme page and applicable DST guidance.",
        "eligibility":{"entity_types":["academic_institution","technical_institution","research_and_development_institution","technology_business_incubator","institution","startup","innovator","entrepreneur","student","researcher"],"lifecycle_stages":["prototype","validation","early_stage","commercialization","incubator_capacity_building"],"industries":["technology_enabled","deep_technology","knowledge_based_innovation","research_commercialization"],"locations":["India"],"conditions":["institutional applicants use the DST e-PMS route when a relevant call is open","startups and innovators apply to one of the supported CoEs through periodic calls","CoE support includes incubation, product/prototype, validation, IP, mentoring and acceleration access"],"thresholds":{"institution_support_duration_years":5,"startup_cash_ceiling_inr":null},"unknown_handling":"needs_information"},
        "exclusions":["a guaranteed cash grant to every startup","using the five-year institutional-support statement as a startup cash amount","assuming every institution or startup is eligible without a current CoE call","a current open call inferred from the DST e-PMS portal alone"],
        "application":{"portal":"https://onlinedst.gov.in/","route":"Institutions apply through the DST e-PMS route when an institutional call is open. Startups and innovators apply to one of the supported CoEs through its periodic call.","selection":"Institutional capacity and programme appraisal for CoE establishment; startup selection and support terms are determined by the supported CoE call.","fees":"No fee is inferred from the official CoE page.","applicant_note":"UdyamVeda should distinguish the institutional establishment route from the startup incubation and acceleration route."},
        "fine_print":{"purpose":"The programme strengthens existing TBI incubation capacities to create world-class, state-of-the-art CoEs.","support":"DST describes enhanced financial support over five years for establishing CoEs, including design, product, prototype development and validation centres, patent facilitation centres and state-of-the-art technology incubation facilities.","startup_route":"Startups and innovators can apply to one of the CoEs through periodic calls and may receive incubation, mentoring, technical, legal, financial, IP and acceleration support.","amount_boundary":"The current official page does not state a startup cash ceiling; this record intentionally makes no amount claim and does not call the route a guaranteed cash grant.","current_status":"The page states that DST has supported nine NIDHI-CoEs at premier institutions; current call status must be verified separately.","review_note":"Verify the current CoE list, call status, applicant category, services, documents, selection and any institution-level financial terms before publication. Do not publish a startup cash amount from this page."},
        "benefit_summary":{"types":["incubation_access","mentorship","training","market_access"],"summary":"DST-backed CoE incubation, prototyping, IP and acceleration support; institutional financial-support duration is described, but no startup cash amount is claimed.","separate_value_buckets":true},
        "benefit_type":"mentorship",
        "benefit_label":"DST-backed CoE incubation, prototyping, IP and acceleration support; no startup cash amount claimed",
        "amount_max":null,
        "benefit_conditions":{"institutional_establishment_route":true,"startup_periodic_coe_call":true,"five_year_institution_support_described":true,"no_amount_claimed":true,"not_a_guaranteed_cash_grant":true},
        "requirement":"Technology or knowledge-based startup, innovator or eligible institution with a verified CoE call route",
        "requirement_description":"For institutions, prepare incubation-capacity, facility, technology, governance, staffing and sustainability evidence requested by DST. For startups, prepare the product or technology, team, validation, IP, business and growth evidence requested by the selected CoE.",
        "rules":{"all":[{"field":"technology_or_knowledge_based_startup_or_innovator","operator":"equals","value":true},{"field":"coe_or_supported_incubator_route_verified","operator":"equals","value":true},{"field":"current_coe_call_open_or_route_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the relevant NIDHI-CoE route","description":"Review the official CoE page and documents index to distinguish the institutional establishment route from a startup or innovator call.","url":"https://nidhi.dst.gov.in/nidhicoe/"},{"title":"Verify the current call and terms","description":"Confirm the supported CoE, deadline, applicant category, services, documents, selection and any financial terms from the current call.","url":"https://nidhi.dst.gov.in/documents/"},{"title":"Apply through the official route","description":"Institutions use DST e-PMS when a relevant call is open; startups and innovators use the selected CoE's periodic application route.","url":"https://onlinedst.gov.in/"}],
        "window_type":"call_for_applications",
        "window_label":"Institutional and startup routes are call-based or periodic; no universal open call or startup cash deadline is asserted.",
        "window_evidence":{"source_url":"https://nidhi.dst.gov.in/nidhicoe/","anchor":"How to Apply and Beneficiaries"},
        "review_note":"Human review must verify the current CoE list, call status, applicant category, services, documents, selection and any institution-level financial terms. Do not publish a startup cash amount from this page."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Science and Technology', 'Department of Science and Technology', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then select id into authority_id from public.authorities where name = item->>'authority' limit 1; end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', 'in_review', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1; end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.9, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1; end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://nidhi.dst.gov.in/', 'ministry_portal', 'NIDHI official homepage', 'Programme updates and official documents', now(), false),
      (version_id, 'https://nidhi.dst.gov.in/documents/', 'document_index', 'NIDHI documents index', 'Official lists and programme documents', now(), false),
      (version_id, 'https://dst.gov.in/', 'ministry_portal', 'Department of Science and Technology official portal', 'Authority and programme notices', now(), false)
    on conflict do nothing;
    if item->>'slug' = 'dst-nidhi-seed-support-program' then
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://nidhi.dst.gov.in/document/nidhi-seed-support-program-nidhi-ssp-guidelines/', 'guideline', 'NIDHI-SSP guidelines index', 'Official guideline link', now(), false),
        (version_id, 'https://nidhi.dst.gov.in/schemes-programmes/', 'ministry_portal', 'NIDHI schemes and programmes', 'NIDHI-SSP programme index', now(), false)
      on conflict do nothing;
    else
      insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
      values
        (version_id, 'https://nidhi.dst.gov.in/nidhicoe/', 'scheme_page', 'NIDHI Centres of Excellence', 'Objectives, support, application and beneficiaries', now(), false),
        (version_id, 'https://onlinedst.gov.in/', 'application_portal', 'DST e-PMS portal', 'Institutional application route', now(), false)
      on conflict do nothing;
    end if;

    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, null, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'other', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, closes_at, label, source_evidence)
    select version_id, item->>'window_type', null, item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
