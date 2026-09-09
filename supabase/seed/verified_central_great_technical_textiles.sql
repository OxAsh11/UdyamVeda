-- GREAT startup grant under the National Technical Textiles Mission.
-- The scheme is evidenced as an active programme with approved projects, but
-- no current open application call was verified; keep the record paused and
-- review-gated until the Ministry publishes the applicable intake route.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Textiles official portal', 'https://texmin.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of Textiles portal and authority home for NTTM notices and current GREAT route.'),
  ('National Technical Textiles Mission page', 'https://texmin.gov.in/technical-textiles-mission', 'ministry_programme_portal', 'central', 'weekly', 1, true, 'Official Ministry of Textiles NTTM programme route referenced in Ministry material; current GREAT call and incubator route must be checked.'),
  ('PIB GREAT startup guidelines announcement', 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1953180&lang=2&reg=48', 'pib_announcement', 'central', 'monthly', 1, true, 'Official Ministry of Textiles announcement describing GREAT scope, grant ceiling, duration, incubator allocation and applicant contribution.'),
  ('Rajya Sabha GREAT scheme answer', 'https://sansad.in/getFile/annex/270/AU1753_PDeXTJ.pdf?source=pqars', 'parliamentary_answer', 'central', 'monthly', 1, true, 'Official 13 February 2026 Ministry of Textiles answer with current approved-startup count and extracts of individual and startup eligibility criteria.'),
  ('Startup India Government Schemes Playbook GREAT entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; Ministry of Textiles and parliamentary sources control the operational record.')
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
        "slug":"great-technical-textiles-startup-grant",
        "name":"GREAT - Grant for Research and Entrepreneurship across Aspiring Innovators in Technical Textiles",
        "type":"grant",
        "lifecycle_status":"paused",
        "authority":"Ministry of Textiles (MoT)",
        "authority_url":"https://texmin.gov.in/",
        "canonical_url":"https://texmin.gov.in/technical-textiles-mission",
        "source_url":"https://sansad.in/getFile/annex/270/AU1753_PDeXTJ.pdf?source=pqars",
        "source_kind":"official_ministry_parliamentary_answer",
        "source_title":"Rajya Sabha GREAT scheme answer",
        "source_anchor":"Pages 1-3: current approved-startup count, maximum support, monitoring, individual eligibility and startup-company eligibility",
        "summary":"A National Technical Textiles Mission grant route supporting young innovators, scientists/technologists and startup ventures in translating technical-textiles prototypes and ideas into commercial technologies or products.",
        "objective":"Build the Indian technical-textiles startup ecosystem by supporting prototype development, technology translation and commercialization across technical-textile application areas.",
        "legal_basis":"GREAT guidelines launched under the National Technical Textiles Mission by the Ministry of Textiles, as described in the official PIB announcement and the Ministry's 13 February 2026 Rajya Sabha answer; the controlling GREAT guideline and current call govern the live route.",
        "eligibility":{"entity_types":["individual_innovator","individual_scientist","individual_technologist","startup","private_limited_company","registered_partnership","limited_liability_partnership"],"lifecycle_stages":["prototype","technology_development","validation","commercialization"],"industries":["technical_textiles","agrotextiles","building_textiles","geotextiles","home_textiles","medical_textiles","mobile_textiles","packaging_textiles","protective_textiles","sports_textiles","smart_textiles","sustainable_textiles","specialty_fibres","composites","textile_machinery","textile_equipment"],"locations":["India"],"conditions":["the proposal must translate an idea or prototype into a technical-textiles technology or product with commercialization potential","an individual applicant must be an Indian citizen aged at least 21 on the application date and must be incubated or have identified an associated incubator","an individual applicant who is a promoter or shareholder of a technical-textiles startup cannot apply as an individual and must use the startup route if eligible","an individual must have a registered company or startup before release of the grant","a startup must be incorporated as a private limited company, registered partnership or LLP, be registered under Indian company law, have turnover below INR 100 crore in any previous financial year, and be no more than 5 years old at application","at least 51% of startup capital must be owned by resident Indian citizens or ultimately Indian-owned and controlled Indian companies","the startup must have an adequate functional R&D facility or be associated/incubated at an incubator","the project leader and any current employment, NOC, full-time commitment and incubator agreement requirements must be satisfied under the controlling guideline","the application must pass the applicable call, incubator and Empowered Programme Committee review"],"exclusions":["no current open application call or deadline was verified in the reviewed official sources; do not present the static scheme as immediately open","the maximum support is a ceiling for an approved startup and not a guaranteed entitlement","the 10% amount described for incubators is an incubator incentive, not additional startup cash","the incubatee must contribute a minimum 10% of funding in two equal installments under the announced guidelines","an individual promoter/shareholder route is excluded even if the shareholding percentage is small","a promoter holding at least 20% in the applicant startup who is also a co-promoter or partner of another ineligible startup is excluded under the extracted criteria","selection, grant release, milestones, monitoring, eligible costs and commercialization outcomes remain committee- and guideline-controlled"],"thresholds":{"maximum_grant_inr":5000000,"grant_period_months":18,"incubatee_minimum_contribution_percent":10,"incubator_additional_grant_percent":10,"startup_turnover_max_inr_exclusive":1000000000,"startup_age_years_max":5,"indian_resident_ownership_min_percent":51,"individual_minimum_age_years":21,"approved_startup_count_reported_feb_2026":24},"unknown_handling":"needs_information"},
        "application":{"portal":"https://texmin.gov.in/technical-textiles-mission","route":"Monitor the official Ministry of Textiles/NTTM route for the current GREAT call, identify an eligible associated incubator, prepare the technical-textiles innovation and commercialization dossier, complete the individual or startup eligibility declarations, submit through the current official route and retain EPC, grant-agreement, milestone and monitoring records.","selection":"The extracted criteria refer to an Empowered Programme Committee for final approval, with a Review and Monitoring Committee overseeing approved startup progress; the current call may specify the incubator, appraisal and submission route.","fees":"No universal application fee was identified in the reviewed official sources. Confirm any call-specific incubator, testing, documentation or participation cost.","documents":["identity and Indian citizenship/age evidence for an individual applicant","incorporation certificate, constitutional documents and Indian company-law registration","turnover and financial records","shareholding and resident-Indian ownership/control evidence","project leader profile and technical-textiles innovation dossier","prototype, R&D facility or incubator evidence","incubator association/agreement","NOC or full-time undertaking where applicable","commercialization plan, milestones, budget and use-of-funds plan","startup/company and promoter declarations required by the current guideline"],"applicant_note":"UdyamVeda can prepare the GREAT eligibility, incubator, prototype, technical, budget and document checklist, but cannot submit on behalf of the applicant, guarantee EPC approval or represent the maximum grant as assured funding."},
        "fine_print":{"support_model":"GREAT is a technical-textiles prototype-to-commercialization grant under NTTM, administered through the Ministry's guideline and call process with incubator participation where applicable.","benefit_boundary":"The official announcement states grant-in-aid up to INR 50 lakh for up to 18 months. The incubator's additional 10% of total grant-in-aid and the incubatee's minimum 10% contribution must remain separate value buckets.","applicant_boundary":"Individual and startup routes have materially different rules. An individual promoter/shareholder of a technical-textiles startup cannot use the individual route; a qualifying startup route may be used instead.","selection_boundary":"Approval, grant release, project milestones, monitoring, eligible expenditure and commercialization are controlled by the current GREAT guidelines, incubator route and Empowered Programme Committee; application does not guarantee support.","current_state":"The Ministry's February 2026 parliamentary answer reports 24 approved startup projects and a Review and Monitoring Committee, confirming ongoing programme activity. The reviewed sources do not establish a current open call, deadline or universal application portal.","review_note":"Before publication, obtain the controlling GREAT guideline, current Ministry/NTTM call, approved incubator list, application form, budget/milestone rules, grant-release conditions, NOC/full-time rules, monitoring, IP/publication obligations, grievance route and any 2024 revision."},
        "benefit_summary":{"types":["grant","incubation","research_support","commercialization_support"],"summary":"Selected GREAT applicants may receive up to INR 50 lakh grant-in-aid for up to 18 months to develop and commercialize technical-textiles technologies, subject to a minimum 10% incubatee contribution, incubator and committee conditions; no current open call is asserted.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"GREAT technical-textiles grant-in-aid up to INR 50 lakh for up to 18 months",
        "benefit_conditions":{"selection_required":true,"current_call_required":true,"incubator_route_may_apply":true,"minimum_incubatee_contribution_percent":10,"not_guaranteed":true},
        "requirement":"Technical-textiles innovation with prototype or technology-development potential, eligible individual/startup applicant, incubator or R&D capability and commercialization plan",
        "requirement_description":"Prepare technical-textiles problem, innovation, prototype, R&D/incubator, team, ownership, incorporation, turnover, age, contribution, budget, milestones, commercialization and current-call evidence.",
        "rules":{"all":[{"field":"technical_textiles_fit_verified","operator":"equals","value":true},{"field":"current_great_call_verified","operator":"equals","value":true},{"field":"applicant_route_verified","operator":"equals","value":true},{"field":"incubator_or_functional_rd_capability_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the innovation to a technical-textiles area","description":"Confirm the application segment, prototype or idea, technical novelty and commercialization pathway under the current GREAT guideline.","url":"https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1953180&lang=2&reg=48"},{"title":"Verify the current Ministry call and route","description":"The reviewed sources confirm programme activity but not a current open window. Use only a current Ministry/NTTM notice and its associated-incubator route for action.","url":"https://texmin.gov.in/technical-textiles-mission"},{"title":"Choose the individual or startup route","description":"Check age, citizenship, company status, turnover, incorporation age, ownership, promoter conflicts, R&D/incubator capacity, NOC and full-time conditions.","url":"https://sansad.in/getFile/annex/270/AU1753_PDeXTJ.pdf?source=pqars"},{"title":"Prepare and submit the controlled dossier","description":"Prepare the proposal, budget, milestones, contribution, incubator agreement and commercialization evidence, then submit only through the current official route and retain EPC and monitoring records.","url":"https://texmin.gov.in/technical-textiles-mission"}],
        "window_type":"call_for_applications",
        "window_label":"Programme activity is evidenced, but no current GREAT application window or deadline was verified; keep paused until a current Ministry/NTTM call is confirmed.",
        "window_evidence":{"source_url":"https://sansad.in/getFile/annex/270/AU1753_PDeXTJ.pdf?source=pqars","anchor":"Pages 1-3: February 2026 approved-startup and eligibility answer; no current call or deadline is stated"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Textiles', 'National Technical Textiles Mission', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.92, 0.89, 'in_review')
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
      (version_id, 'https://texmin.gov.in/technical-textiles-mission', 'ministry_programme_portal', 'National Technical Textiles Mission page', 'GREAT route and current NTTM notice context', now(), false),
      (version_id, 'https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=1953180&lang=2&reg=48', 'pib_announcement', 'PIB GREAT startup guidelines announcement', 'Grant ceiling, 18-month period, technical-textiles scope, incubator allocation and 10% contribution', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook GREAT entry', 'GREAT technical-textiles startup grant discovery entry', now(), false)
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
