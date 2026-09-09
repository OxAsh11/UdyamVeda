-- Khadi Gramodyog Vikas Yojana (KGVY).
-- Review-gated because KGVY is an umbrella programme and support is
-- component-specific, institution-mediated and call/selection dependent.

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
        "slug":"khadi-gramodyog-vikas-yojana",
        "name":"Khadi Gramodyog Vikas Yojana (KGVY)",
        "type":"enterprise_support",
        "status":"active",
        "authority":"Ministry of Micro, Small and Medium Enterprises - Khadi and Village Industries Commission",
        "authority_url":"https://msme.gov.in/",
        "canonical_url":"https://kviconline.gov.in/khadi.jsp",
        "source_url":"https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/43320231218130809.pdf",
        "source_kind":"guideline",
        "source_title":"KVIC KGVY introduction and component structure",
        "source_anchor":"Introduction of KGVY: KVY, GVY and Khadi Grant components",
        "summary":"Umbrella Central Sector programme for development of Khadi and village industries through component-specific assistance, technology, training, common facilities, market support and institution strengthening.",
        "objective":"Promote Khadi and village industries, improve artisan and institution productivity, support technology modernization and skills, strengthen common facilities and expand market and livelihood opportunities.",
        "legal_basis":"Khadi Gramodyog Vikas Yojana umbrella framework and applicable Ministry of MSME/KVIC component guidelines, SOPs, notices and selection conditions.",
        "eligibility":{"entity_types":["khadi_institution","village_industry_unit","artisan","self_employed_artisan","rural_entrepreneur","micro_enterprise","training_provider","common_facility_provider","kvic_kvib_district_industry_centre","ngo","cooperative"],"founder_categories":["artisan","rural_entrepreneur","women_entrepreneur","unemployed_youth"],"lifecycle_stages":["idea","pre_start","operating","micro_business","growth","institution_strengthening"],"industries":["khadi","cotton","wool","silk","village_industry","wellness_cosmetics","handmade_paper","leather","plastic","agro_food_processing","mineral_based","rural_engineering","new_technology","service_industry"],"locations":["India"],"conditions":["the applicant must fit the current KVY or GVY component and its prescribed beneficiary or institution category","institutional components may require KVIC certification, registration, assessment, an approved proposal or a current notice","artisan and unit support depends on the relevant activity, training, toolkit, technology, common-facility or market component","the application or selection route is through the applicable KVIC, KVIB, Khadi Institution, NGO, DIC or notified implementing channel","current component eligibility, documents, beneficiary selection and support terms must be confirmed before recommendation"],"thresholds":{"umbrella_components_count":3,"gvy_verticals_count":6,"component_specific_amounts":"not universal; current component guideline controls"},"unknown_handling":"needs_information"},
        "exclusions":["KGVY membership or discovery does not itself provide a grant, loan, interest subsidy, toolkit, training seat or market order","Khadi Grant is an establishment-expense provision for KVIC officers and staff and is not an applicant-level business benefit","KVY, GVY, MMDA, ISEC, workshed, technology, training, marketing and common-facility support must not inherit one another's eligibility or monetary terms","PMEGP and SFURTI are separate routes and should not be merged into KGVY eligibility or benefits","current component notice, institutional certification, selection and fund-availability conditions control the live route"],
        "application":{"portal":"https://kviconline.gov.in/khadi.jsp","route":"Identify the applicable KVY or GVY component, confirm the current KVIC/KVIB/KI/DIC or notified implementing route, prepare the component-specific documents and apply through the official notice or portal.","selection":"Selection, sanction and beneficiary identification vary by component and may involve KVIC, KVIB, certified Khadi Institutions, NGOs, DICs, training providers or other notified implementing agencies.","fees":"No universal KGVY applicant fee is asserted; confirm any component-specific fee, contribution, institution certification or training condition from the current notice.","applicant_note":"UdyamVeda may identify the relevant component and prepare an evidence checklist, but must not impersonate the applicant, claim a guaranteed sanction or submit OTP-based applications."},
        "fine_print":{"umbrella_components":{"khadi_vikas_yojana":["Modified Market Development Assistance","Interest Subsidy Eligibility Certificate","Khadi Reforms Development Programme","Workshed Scheme for Khadi Artisans","infrastructure strengthening and marketing infrastructure","Centre of Excellence for Khadi","Khadi quality assurance","marketing promotion and exhibitions","Khadi science and technology"],"gramodyog_vikas_yojana":["Wellness and Cosmetics Industry","Handmade Paper, Leather and Plastic Industry","Agro Based and Food Processing Industry","Mineral Based Industry","Rural Engineering and New Technology Industry","Service Industry"],"khadi_grant":["KVIC establishment expenses; not a direct enterprise benefit"]},"benefit_model":"Component-specific training, technology, infrastructure, interest subsidy, institution strengthening, market development or other support; no single KGVY amount applies to every applicant.","route_boundary":"The official sources identify multiple institution and beneficiary routes. A current component notice, selection list, implementation partner and applicable guideline must be attached before an active recommendation is shown.","review_note":"Verify current KVY/GVY component availability, applicant category, Khadi certification or registration, training/selection process, cost heads, contribution, assistance pattern, ISEC terms, workshed or toolkit conditions, reporting, audit, continuation and grievance route before publication."},
        "benefit_summary":{"types":["grant","subsidy","interest_subsidy","training","technology_support","market_access","infrastructure_support"],"summary":"Component-specific support for Khadi institutions, village industries and eligible artisans or entrepreneurs; financial and non-financial benefits must be displayed separately.","separate_value_buckets":true},
        "benefit_type":"enterprise_support",
        "benefit_label":"Component-specific Khadi and village-industry support",
        "amount_max":null,
        "percentage":null,
        "benefit_conditions":{"component_route_required":true,"current_notice_required":true,"beneficiary_or_institution_category_required":true,"support_value_not_universal":true},
        "requirement":"Component-specific beneficiary, institution or enterprise evidence",
        "requirement_description":"Prepare the relevant entity or artisan identity, activity/category, KVIC/KVIB/KI/DIC registration or certification where required, project or training proposal, site, bank and contribution evidence, and current component documents.",
        "rules":{"all":[{"field":"kgvy_component_identified","operator":"equals","value":true},{"field":"applicant_or_institution_type_verified","operator":"equals","value":true},{"field":"activity_category_verified","operator":"equals","value":true},{"field":"current_component_call_verified","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Identify the correct KGVY component","description":"Separate KVY, GVY and Khadi Grant, then map the business or artisan need to the exact component and vertical.","url":"https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/43320231218130809.pdf"},{"title":"Confirm the applicant route","description":"Check whether the route is for a Khadi institution, village-industry unit, artisan, entrepreneur, training provider or implementing agency and identify the current KVIC/KVIB/KI/DIC channel.","url":"https://msme.gov.in/sites/default/files/RevisedOperationalKVYguidelines.pdf"},{"title":"Prepare component evidence","description":"Assemble the current identity, certification, activity, project, training, technology, workshed, marketing or common-facility evidence required by the selected component.","url":"https://kviconline.gov.in/mdaclaims/commPgs/41320221201121713.pdf"},{"title":"Use the official notice or portal","description":"Apply or enrol through the current component route, retain acknowledgements and do not assume that the umbrella KGVY page is an open call.","url":"https://kviconline.gov.in/khadi.jsp"},{"title":"Track support and reporting separately","description":"Record training, asset, subsidy, interest, institution, market and reporting outcomes as separate components with their own conditions.","url":"https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/42620240304174114.pdf"}],
        "window_type":"rolling",
        "window_label":"Umbrella programme with component-specific notices, selection cycles and implementation routes; no universal KGVY closing date is asserted.",
        "window_evidence":{"source_url":"https://kviconline.gov.in/khadi.jsp","anchor":"Official KVIC Khadi applications and institution routes"},
        "review_note":"Keep review-gated. Do not show KGVY as a single grant or combine its component values with PMEGP, SFURTI or other programmes."
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.91, 0.86, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    values
      (version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true),
      (version_id, 'https://msme.gov.in/sites/default/files/RevisedOperationalKVYguidelines.pdf', 'guideline', 'MSME revised Khadi Vikas Yojana guidelines', 'KVY component operations and applicant boundaries', now(), false),
      (version_id, 'https://kviconline.gov.in/mdaclaims/commPgs/41320221201121713.pdf', 'guideline', 'KVIC Khadi Vikas Yojana component note', 'KVY component list and implementation context', now(), false),
      (version_id, 'https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/42620240304174114.pdf', 'guideline', 'KVIC GVY service industry SOP', 'GVY service-industry beneficiary and implementation route', now(), false),
      (version_id, 'https://kviconline.gov.in/khadi.jsp', 'agency_portal', 'KVIC official Khadi applications portal', 'Current Khadi application and institution routes', now(), false)
    on conflict do nothing;
    insert into public.opportunity_benefits (opportunity_version_id, benefit_type, label, amount_max, percentage, conditions)
    values (version_id, item->>'benefit_type', item->>'benefit_label', null, null, item->'benefit_conditions')
    on conflict do nothing;
    insert into public.opportunity_requirements (opportunity_version_id, requirement_type, name, description, required)
    values (version_id, 'other', item->>'requirement', item->>'requirement_description', true)
    on conflict do nothing;
    insert into public.eligibility_rule_sets (opportunity_version_id, rules, source_evidence, reviewed)
    values (version_id, item->'rules', jsonb_build_array(jsonb_build_object('source_url', item->>'source_url', 'anchor', item->>'source_anchor')), false)
    on conflict do nothing;
    insert into public.opportunity_steps (opportunity_version_id, step_number, title, description, official_url)
    select version_id, (row_number() over ())::integer, step->>'title', step->>'description', step->>'url'
    from jsonb_array_elements(item->'steps') as steps(step)
    on conflict do nothing;
    insert into public.opportunity_windows (opportunity_version_id, window_type, label, source_evidence)
    values (version_id, item->>'window_type', item->>'window_label', item->'window_evidence')
    on conflict do nothing;
    insert into public.review_tasks (opportunity_version_id, task_type, status)
    values (version_id, 'publish', 'open')
    on conflict do nothing;
  end loop;
end $$;
