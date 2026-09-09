-- Mission on Advanced and High-Impact Research (MAHIR).
-- The mission can support outcome-linked power-sector R&D and Indian startup
-- pilots, but the reviewed first call is closed and no current call is implied.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('CPRI MAHIR programme page', 'https://cpri.res.in/en/content/mahir', 'official_cpri_programme_portal', 'central', 'weekly', 1, true, 'Official Central Power Research Institute page describing MAHIR objectives, focus domains, activities and the closed first call.'),
  ('MAHIR first call for research proposals', 'https://cpri.res.in/sites/default/files/MAHIR_Call%20for%20proposals.pdf', 'official_call_document', 'central', 'monthly', 1, true, 'Official CPRI call inviting academia, industry, utilities, startups and R&D institutions; submission deadline was 20 January 2024.'),
  ('MAHIR Office Memorandum', 'https://static.pib.gov.in/WriteReadData/specificdocs/documents/2023/jun/doc202367209801.pdf', 'gazette_or_office_memorandum', 'central', 'monthly', 1, true, 'Ministry of Power Office Memorandum establishing the joint MoP-MNRE mission, governance, funding and IP modalities.'),
  ('Startup India Government Schemes Playbook MAHIR entry', 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'central', 'monthly', 1, true, 'Official Startup India discovery entry; CPRI and Ministry documents control the operational record.')
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
        "slug":"mahir-advanced-high-impact-research-power-startup-support",
        "name":"Mission on Advanced and High-Impact Research (MAHIR)",
        "type":"grant",
        "lifecycle_status":"closed",
        "authority":"Ministry of Power",
        "authority_url":"https://powermin.gov.in/",
        "canonical_url":"https://cpri.res.in/en/content/mahir",
        "source_url":"https://static.pib.gov.in/WriteReadData/specificdocs/documents/2023/jun/doc202367209801.pdf",
        "source_kind":"official_ministry_office_memorandum",
        "source_title":"MAHIR Office Memorandum",
        "source_anchor":"Pages 1-4: mission objectives, five-year period, funding, startup pilots, selection and IP modalities",
        "summary":"A joint Ministry of Power and Ministry of New and Renewable Energy mission for indigenous development and demonstration of advanced energy technologies, including outcome-linked R&D and pilot projects developed by Indian startups.",
        "objective":"Identify, develop, demonstrate and commercialize advanced or disruptive energy-sector technologies through coordinated research, industry participation, startup pilots and technology-transfer pathways.",
        "legal_basis":"Government of India Ministry of Power Office Memorandum dated 7 June 2023 establishing MAHIR jointly with MNRE; CPRI programme page and each approved call or RFP control the applicable route.",
        "eligibility":{"entity_types":["startup","indian_startup","industry","company","research_institution","academic_institution","university","utility","implementing_organization"],"lifecycle_stages":["idea","research","prototype","pilot","demonstration","commercialization"],"industries":["power_technology","energy_technology","clean_energy","carbon_capture","green_hydrogen","fuel_cells","energy_storage","geothermal_energy","artificial_intelligence","automation","cybersecurity","power_systems"],"locations":["India","international_applicant_with_required_partnership_or_call_fit"],"conditions":["the proposal must address an approved MAHIR research area or a disruptive technology relevant to the future power or energy sector","the project must have substantial research and innovation content and a clearly defined implementation plan","the expected outcome should be a demonstrable product, prototype, technology or other call-defined deliverable","the applicant must satisfy the specific current RFP, call or proposal format and pass technical, financial and committee evaluation","Indian startups may be considered for pilot projects and commercialization, subject to the applicable approved project and agreement terms"],"exclusions":["the reviewed first call is closed and its deadline was 20 January 2024; no current application window is asserted","MAHIR is not an automatic grant, subsidy or individual startup entitlement","funding, milestones, tranche schedule, project duration, selection method and eligible costs are call- and agreement-specific","the Office Memorandum states that developed technology IP is shared with the Government of India and research agency, and startup pilots have applicable IP-sharing conditions","proposals must not duplicate already funded work or be partly or fully financed by another Government grant where the call certificate requires that declaration"],"thresholds":{"mission_period_start":"2023-04-01","mission_period_end":"2028-03-31","mission_period_years":5,"first_call_deadline":"2024-01-20","institutional_overhead_reference_percent":10},"unknown_handling":"needs_information"},
        "application":{"portal":"https://cpri.res.in/en/content/mahir","route":"Monitor the official CPRI MAHIR page and any new call or RFP, map the proposal to an approved research area, prepare the prescribed technical and financial proposal, submit through the stated route, and retain committee, agreement, milestone, IP and reporting records.","selection":"The Office Memorandum describes Mission Secretariat scrutiny, Technical Scoping Committee screening and Apex Committee final consideration; later calls may specify QCBS or another method.","fees":"No universal application fee is established in the reviewed documents. Confirm any call-specific cost, consortium, facility and agreement requirements.","documents":["prescribed technical and financial proposal","organization and collaborating-industry details","principal investigator and team profiles","technical programme and quarterly milestone chart","estimated project cost and year-wise expenditure","existing facilities and facilities required","industry contribution if applicable","end-user or implementation partner details","prior research, publications, patents and project outcomes","institutional approval and non-duplication or non-double-financing certificate"],"applicant_note":"UdyamVeda can prepare proposal, eligibility, technical, budget, milestone and document checklists, but cannot submit on behalf of an applicant, guarantee selection or describe mission references as currently open funding."},
        "fine_print":{"support_model":"MAHIR is a mission and call/RFP-led R&D support framework, not one continuously open startup grant.","focus_areas":["carbon capture and utilization","green hydrogen and high-efficiency fuel cells","automation and AI for the power ecosystem","geothermal energy","alternatives to lithium-ion storage batteries","two-shift operation of old coal-based power plants","other approved disruptive power or energy technologies"],"funding_boundary":"The Office Memorandum provides for outcome-linked funding and pilot support, but does not create a universal per-startup ceiling. Current RFP and agreement terms control budget, milestones, eligible costs and release schedule.","selection_boundary":"Technical Scoping Committee recommendations and Apex Committee approval are required under the Office Memorandum; participation or proposal submission does not guarantee funding.","ip_boundary":"Technology developed under the mission has Government of India and research-agency IP sharing; Indian startup pilots also carry applicable IP-sharing terms.","current_window":"CPRI marks the first call closed and records that a second call will be advertised soon; a current second call was not verified in the reviewed official sources.","review_note":"Before publication, verify a new call or RFP, applicant route, approved research area, budget, milestones, QCBS or selection method, IP agreement, double-financing declaration, project duration, eligible costs and grievance/contact route."},
        "benefit_summary":{"types":["grant","research_support","pilot_support","commercialization_support","technology_transfer"],"summary":"Eligible selected projects may receive call-defined outcome-linked R&D support and, for Indian startup technologies, pilot and commercialization support; funding, milestones and IP terms are proposal- and agreement-specific, not guaranteed.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"MAHIR call-defined outcome-linked R&D and startup pilot support",
        "benefit_conditions":{"current_call_required":true,"selection_required":true,"milestone_or_agreement_controlled":true,"not_guaranteed":true,"ip_sharing_may_apply":true},
        "requirement":"Power or energy technology proposal with substantial research and innovation content, implementation plan and demonstrable product, prototype or pilot outcome",
        "requirement_description":"Prepare the prescribed technical and financial proposal, team and institutional approvals, research evidence, facilities, industry or end-user participation, budget, milestones, deliverables, prior work and IP or non-duplication declarations required by the current call.",
        "rules":{"all":[{"field":"mahir_research_or_disruptive_energy_fit_verified","operator":"equals","value":true},{"field":"substantial_research_and_innovation_content_verified","operator":"equals","value":true},{"field":"current_mahir_call_or_rfp_verified","operator":"equals","value":true},{"field":"technical_and_financial_proposal_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Map the technology to a MAHIR domain","description":"Confirm the current call's research area or disruptive-technology route and explain the future power or energy-sector impact.","url":"https://cpri.res.in/en/content/mahir"},{"title":"Verify the current call or RFP","description":"The reviewed first call is closed. Use only a new official CPRI call, RFP or mission notice as the actionable route.","url":"https://cpri.res.in/en/content/mahir"},{"title":"Prepare the technical and financial proposal","description":"Prepare objectives, methodology, facilities, collaborators, quarterly milestones, budget, deliverables, prior work, institutional approvals and IP or non-duplication declarations.","url":"https://cpri.res.in/sites/default/files/MAHIR_Call%20for%20proposals.pdf"},{"title":"Submit and retain approval records","description":"Submit exactly as the current call directs and retain scrutiny, committee, agreement, milestone, fund-release, IP and reporting records.","url":"https://static.pib.gov.in/WriteReadData/specificdocs/documents/2023/jun/doc202367209801.pdf"}],
        "window_type":"closed",
        "window_label":"First MAHIR call closed; CPRI records a future second call as forthcoming, but no current open window was verified.",
        "window_evidence":{"source_url":"https://cpri.res.in/sites/default/files/MAHIR_Call%20for%20proposals.pdf","anchor":"Page 1: last date of submission 20 January 2024; CPRI programme page marks first call closed"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Power and Ministry of New and Renewable Energy', 'Mission on Advanced and High-Impact Research (MAHIR)', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.88, 'in_review')
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
      (version_id, 'https://cpri.res.in/en/content/mahir', 'official_cpri_programme_portal', 'CPRI MAHIR programme page', 'Objectives, research domains, first call activity and closed status', now(), false),
      (version_id, 'https://cpri.res.in/sites/default/files/MAHIR_Call%20for%20proposals.pdf', 'official_call_document', 'MAHIR first call for research proposals', 'Pages 1-5: applicants, research areas, proposal format, deadline and declarations', now(), false),
      (version_id, 'https://www.startupindia.gov.in/content/dam/startupindia/homebanners/Startup-Schemes-Playbook-June-2026.pdf', 'discovery_playbook', 'Startup India Government Schemes Playbook MAHIR entry', 'MAHIR discovery entry for power and clean-energy technology R&D', now(), false)
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
