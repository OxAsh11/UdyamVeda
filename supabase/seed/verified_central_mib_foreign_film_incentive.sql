-- Review-gated Ministry of Information and Broadcasting opportunity.
-- The India Cine Hub portal is live and presents the route, but the governing
-- guideline document and current application/incentive handoff must remain
-- human-verified before publication as a guaranteed benefit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('India Cine Hub incentive calculator', 'https://indiacinehub.gov.in/incentive-calcuator-page', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Current official calculator and intake page; presents up to 40% support, applicant exclusions, fee and document prompts.'),
  ('India Cine Hub international projects guide', 'https://indiacinehub.gov.in/permission/step-by-step-guide/international-projects', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Current official permission workflow operated through the India Cine Hub under NFDC and the Ministry of Information and Broadcasting.'),
  ('Ministry of Information and Broadcasting foreign film incentive guidelines', 'https://mib.gov.in/sites/default/files/2024-02/Revised%20incentive%20guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Governing guideline link indexed by the Ministry; PDF availability and latest revision must be checked before publication.'),
  ('India Cine Hub foreign film incentive guideline copy', 'https://indiacinehub.gov.in/sites/default/files/2025-03/india-cine-hub-film-incentive-guidelines-2023-ver-feb-2025_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official implementing-agency guideline URL discovered during current-source research; the indexed route returned a 404 and must not be treated as live evidence without replacement capture.');

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
        "slug":"incentive-scheme-foreign-films-official-coproduction-india",
        "name":"Incentive Scheme for Production of Foreign Films in India and Official Co-productions",
        "type":"reimbursement",
        "status":"active",
        "lifecycle_status":"active",
        "authority":"India Cine Hub - Foreign Film Incentive",
        "authority_url":"https://indiacinehub.gov.in/",
        "canonical_url":"https://indiacinehub.gov.in/incentive-calcuator-page",
        "source_url":"https://indiacinehub.gov.in/incentive-calcuator-page",
        "source_kind":"implementing_agency_portal",
        "source_title":"India Cine Hub Incentive Calculator",
        "source_anchor":"Incentive Calculator: up to 40% support, production categories, fee, documents and application processing notes",
        "summary":"Official India Cine Hub route for international film productions and official audio-visual co-productions that incur qualifying production expenditure in India. The portal presents a base incentive with additional bonuses for qualifying Indian manpower and Significant Indian Content, subject to the governing guideline, cap and approval process.",
        "objective":"Attract international film production and official audio-visual co-production activity to India while supporting qualifying production expenditure and Indian participation.",
        "legal_basis":"Ministry of Information and Broadcasting incentive scheme for production of foreign films in India and official audio-visual co-productions, administered through the India Cine Hub under NFDC.",
        "eligibility":{"entity_types":["international_production_company","foreign_producer","indian_line_producer","indian_production_services_company","official_coproduction_company"],"lifecycle_stages":["pre_production","production","scaling"],"industries":["film_production","television_production","web_series","animation","post_production","visual_effects","audio_visual_coproduction"],"locations":["India"],"conditions":["Project must fit an eligible production or official co-production category under the current guideline","Qualifying production expenditure must be incurred in India","Foreign production applicants use an Indian line producer or production services company where required","The project must pass the portal's script/content and permission review","For the additional manpower bonus, at least 15% Indian cast/crew manpower must be evidenced where the guideline applies","For the Significant Indian Content bonus, the project must satisfy expert script evaluation"],"thresholds":{"base_incentive_percent":30,"indian_manpower_bonus_percent":5,"significant_indian_content_bonus_percent":5,"maximum_incentive_percent":40,"maximum_incentive_inr":300000000,"processing_fee_usd_equivalent":225},"unknown_handling":"needs_information"},
        "exclusions":["The current India Cine Hub calculator says it does not accept documentary films, audio-visual commercials or music videos for this online route","An official co-production must satisfy the applicable bilateral audio-visual co-production agreement","The additional manpower and Significant Indian Content bonuses are conditional and must not be assumed","The portal's incentive estimate is not a sanction or guarantee of reimbursement","Local, monument, forest, railway, animal and other location permissions may still be required separately"],
        "application":{"portal":"https://indiacinehub.gov.in/","route":"Register on India Cine Hub, submit the international production or official co-production application, pay the non-refundable INR equivalent of USD 225 processing fee, provide the script/synopsis and required production documents, complete permission review, and use the verified incentive claim route through the Indian production services company or other eligible applicant.","selection":"Ministry of Information and Broadcasting/India Cine Hub review includes script evaluation and permission checks; incentive eligibility and payout remain subject to the governing guideline and approval.","fees":"Non-refundable processing fee stated by the current calculator: INR equivalent of USD 225. This is an application-processing fee, not the incentive amount.","applicant_note":"UdyamVeda may prepare the eligibility and document dossier, but must not impersonate the producer, line producer, India Cine Hub or Government of India."},
        "fine_print":{"scope":"The scheme supports international film production projects and official audio-visual co-productions with qualifying expenditure in India, including live production and certain animation, post-production and VFX services subject to the current guideline.","benefit":"The current official calculator presents up to 40% of qualifying spend in India. Indexed official guideline material describes a base reimbursement up to 30% of Indian qualifying production expenditure, with an additional 5% for at least 15% Indian manpower in applicable live-shoot projects and an additional 5% for Significant Indian Content.","cap":"Indexed official guideline material states an enhanced incentive payout cap of INR 30 crore. The cap and the claimant/entity treatment must be confirmed against the latest accessible guideline before publication.","processing":"The current international-project guide says permission normally takes no more than three weeks after all requisite documents are submitted, with longer processing where Ministry of Home Affairs or Ministry of External Affairs consultation is required.","documents":"Detailed script and synopsis or reality-show concept, crew passport details, Indian shooting locations and period, temporary-import equipment list, applicable no-objection letter, and official co-production agreement where relevant.","review_note":"Before publication, verify the latest guideline file, cap, eligible project categories, claimant, qualifying-expenditure definition, claim timing, bonus evidence, current portal handoff and whether the route is accepting new applications."},
        "benefit_summary":{"types":["reimbursement"],"amounts":[{"label":"Base reimbursement","percentage":30},{"label":"Indian manpower bonus where applicable","percentage":5},{"label":"Significant Indian Content bonus where applicable","percentage":5}],"maximum_percent":40,"maximum_inr":300000000,"summary":"Up to 40% of qualifying production expenditure incurred in India, combining a base reimbursement and conditional bonuses, subject to the official guideline and an indexed INR 30 crore cap; do not present the percentage as a guaranteed payout.","separate_value_buckets":true},
        "benefit_type":"reimbursement",
        "benefit_label":"Up to 40% reimbursement of qualifying production expenditure in India, subject to guideline conditions and cap",
        "amount_min":null,
        "amount_max":300000000,
        "percentage":40,
        "benefit_conditions":{"base_percent":30,"indian_manpower_bonus_percent":5,"significant_indian_content_bonus_percent":5,"maximum_percent":40,"maximum_inr":300000000,"processing_fee_usd_equivalent":225},
        "requirement":"Eligible international production or official co-production, India-incurred qualifying expenditure, Indian production services/line-producer arrangement where applicable, script and production permissions, and evidence for any claimed manpower or Significant Indian Content bonus",
        "requirement_description":"Prepare the script and synopsis, crew passport table and copies, Indian locations and shoot period, temporary-import equipment list, applicable NOC, official co-production agreement, expenditure evidence, Indian manpower evidence and Significant Indian Content material. Confirm the current claim form and claimant boundary before submission.",
        "rules":{"all":[{"field":"eligible_foreign_or_official_coproduction_verified","operator":"equals","value":true},{"field":"india_qualifying_production_expenditure_verified","operator":"greater_than","value":0},{"field":"current_ich_guideline_verified","operator":"equals","value":true},{"field":"required_permission_documents_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm project category and current guideline","description":"Check that the proposed production is accepted by the current India Cine Hub route and verify the latest incentive guideline, claimant and cap."},{"title":"Register and prepare the permission dossier","description":"Register on India Cine Hub and prepare the script or concept, crew passports, locations, dates, equipment and applicable NOC or co-production agreement.","url":"https://indiacinehub.gov.in/permission/step-by-step-guide/international-projects"},{"title":"Submit the application and processing fee","description":"Submit through the official portal and pay the non-refundable INR equivalent of USD 225 processing fee. Treat the fee separately from any approved reimbursement.","url":"https://indiacinehub.gov.in/incentive-calcuator-page"},{"title":"Track permission and incentive claim readiness","description":"Track script review, permission, local permits, qualifying expenditure, Indian manpower/SIC evidence and the verified post-production claim route; do not treat the calculator estimate as approval."}],
        "window_type":"rolling",
        "window_close_at":null,
        "window_label":"Official India Cine Hub online route is currently presented as available; verify the latest guideline and live incentive-claim intake before handoff.",
        "window_evidence":{"source_url":"https://indiacinehub.gov.in/incentive-calcuator-page","anchor":"Current Incentive Calculator page, last updated 04 September 2026, with online application fee and production-category prompts."},
        "review_note":"Keep review-gated. Confirm the latest accessible guideline, the INR 30 crore cap, eligible project categories, QPE definition, claimant, evidence for bonuses, current application and claim forms, and any superseding Ministry notification before publication."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Information and Broadcasting', 'India Cine Hub / National Film Development Corporation', item->>'authority_url'
    where not exists (select 1 from public.authorities where name = item->>'authority')
    returning id into authority_id;
    if authority_id is null then
      select id into authority_id from public.authorities where name = item->>'authority' limit 1;
    end if;

    seed_opportunity_id := null;
    insert into public.opportunities (slug, name, opportunity_type, status, authority_id, geography, canonical_url)
    values (item->>'slug', item->>'name', item->>'type', item->>'status', authority_id, '{"coverage":"central","locations":["India"]}'::jsonb, item->>'canonical_url')
    on conflict (slug) do update set name = excluded.name, status = excluded.status, authority_id = excluded.authority_id, canonical_url = excluded.canonical_url
    returning id into seed_opportunity_id;
    if seed_opportunity_id is null then
      select id into seed_opportunity_id from public.opportunities where slug = item->>'slug' limit 1;
    end if;

    version_id := null;
    insert into public.opportunity_versions
      (opportunity_id, version_number, title, summary, objective, legal_basis, eligibility, application, fine_print, benefit_summary, last_verified_at, completeness, confidence, review_status)
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.93, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = item->>'status' where id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://indiacinehub.gov.in/permission/step-by-step-guide/international-projects', 'implementing_agency_portal', 'India Cine Hub international projects guide', 'single-window role, steps, permissions and normal processing time', now(), false),
      (version_id, 'https://mib.gov.in/sites/default/files/2024-02/Revised%20incentive%20guidelines.pdf', 'guideline', 'Ministry of Information and Broadcasting foreign film incentive guidelines', 'base reimbursement, Indian manpower bonus, Significant Indian Content bonus and cap', now(), false),
      (version_id, 'https://indiacinehub.gov.in/sites/default/files/2025-03/india-cine-hub-film-incentive-guidelines-2023-ver-feb-2025_0.pdf', 'guideline', 'India Cine Hub foreign film incentive guideline copy', 'indexed official guideline copy; URL availability requires review', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    select version_id, item->>'benefit_type', item->>'benefit_label', (item->>'amount_max')::numeric, (item->>'percentage')::numeric, item->'benefit_conditions'
    where not exists (select 1 from public.opportunity_benefits where opportunity_version_id = version_id and label = item->>'benefit_label');
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    select version_id, 'film_incentive', item->>'requirement', item->>'requirement_description', true
    where not exists (select 1 from public.opportunity_requirements where opportunity_version_id = version_id and name = item->>'requirement');
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    select version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false
    where not exists (select 1 from public.eligibility_rule_sets where opportunity_version_id = version_id);
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, row_number() over ()::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    where not exists (select 1 from public.opportunity_steps where opportunity_version_id = version_id);
    insert into public.opportunity_windows (opportunity_version_id, window_type, closes_at, label, source_evidence)
    select version_id, item->>'window_type', (item->>'window_close_at')::timestamptz, item->>'window_label', item->'window_evidence'
    where not exists (select 1 from public.opportunity_windows where opportunity_version_id = version_id);
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    select version_id, 'publish', 'open'
    where not exists (select 1 from public.review_tasks where opportunity_version_id = version_id and task_type = 'publish' and status in ('open', 'in_review'));
  end loop;
end $$;
