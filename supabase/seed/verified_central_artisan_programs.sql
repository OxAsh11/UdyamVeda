-- PM Vishwakarma record from the official portal and scheme guidelines.
-- It remains in_review until the current portal, verification route and
-- beneficiary-level terms are confirmed by a catalog reviewer.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM Vishwakarma official FAQ', 'https://pmvishwakarma.gov.in/Home/FAQ', 'implementing_portal', 'central', 'weekly', 1, true, 'Official current FAQ for eligibility, documents, component conditions and support routes.'),
  ('PM Vishwakarma official registration guide', 'https://pmvishwakarma.gov.in/Home/HowToRegister', 'implementing_portal', 'central', 'weekly', 1, true, 'Official registration and verification route.'),
  ('PM Vishwakarma official terms and conditions', 'https://pmvishwakarma.gov.in/Home/TermsandConditions', 'implementing_portal', 'central', 'monthly', 1, true, 'Official portal terms and current operating boundary.')
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
        "slug":"pm-vishwakarma",
        "name":"PM Vishwakarma",
        "type":"artisan_support",
        "authority":"Ministry of Micro, Small and Medium Enterprises - PM Vishwakarma",
        "authority_url":"https://pmvishwakarma.gov.in/Home/",
        "canonical_url":"https://pmvishwakarma.gov.in/Home/",
        "source_url":"https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf",
        "source_kind":"guideline",
        "source_title":"PM Vishwakarma official scheme guidelines",
        "source_anchor":"Eligibility, 18 trades, benefits, verification and implementation period",
        "summary":"End-to-end support for eligible traditional artisans and craftspeople working with their hands and tools.",
        "objective":"Recognise artisans, improve skills and tools, provide concessional credit, encourage digital transactions and create market linkages for traditional trades.",
        "legal_basis":"PM Vishwakarma Scheme guidelines issued by the Ministry of MSME and implementing partners.",
        "eligibility":{"entity_types":["individual_artisan","self_employed_craftsperson"],"lifecycle_stages":["self_employed","micro_business"],"industries":["traditional_trades"],"trades_count":18,"minimum_age_years":18,"locations":["India"],"conditions":["the applicant works with hands and tools in an identified traditional trade","the applicant is self-employed in the unorganised sector","the applicant is engaged in the concerned trade on the registration date","the applicant must not have availed a similar Central or State self-employment/business loan in the past five years","only one member of the family may register"],"exclusions":["government employees and their family members","benefits are not released until the prescribed multi-stage verification is completed"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://pmvishwakarma.gov.in/Home/","route":"Register through the official PM Vishwakarma portal, normally with CSC assistance, and complete the prescribed Gram Panchayat/ULB, district and committee verification process.","verification":"Multi-stage verification is required before benefits are released.","documents":["Aadhaar","mobile number","bank details","ration card; if unavailable, Aadhaar details for all family members"],"support_routes":["Common Service Centre","MSME Development and Facilitation Office","District Industries Centre"],"applicant_note":"UdyamVeda can explain and validate the checklist but must not collect or submit OTPs on the applicant's behalf."},
        "fine_print":{"implementation_period":"The current official portal shows a registration target through 2028; the governing guideline version and any extension basis require reviewer confirmation.","initial_outlay_inr":130000000000,"trades_count":18,"recognition":["certificate","identity_card"],"training":{"basic_days":"5-7","advanced_days":"15 or more","stipend_inr_per_day":500,"transport_allowance_inr":1000},"toolkit_incentive_max_inr":15000,"toolkit_condition":"Toolkit incentive is provided after skill verification at the start of Basic Training.","credit":{"total_max_inr":300000,"tranches":[{"amount_inr":100000,"tenure_months":18},{"amount_inr":200000,"tenure_months":30,"second_tranche_condition":"Skilled beneficiary with a standard loan account and digital transactions or Advanced Skill Training"}],"interest_percent":5,"government_subvention_percent":8,"collateral_free":true,"guarantee_fee":"Government of India bears the guarantee fee","prepayment_penalty":"No prepayment penalty after six months of loan disbursement"},"digital_transaction_incentive":{"amount_inr_per_transaction":1,"eligible_transaction_cap_per_month":100},"other_support":["quality certification","branding","advertising","e-commerce linkage","trade fairs","market linkage"],"current_portal_facts":{"portal_checked":"2026-09-07","registration_target":"through 2028","benefit_release_boundary":"Registration alone does not release benefits; prescribed verification and component conditions apply."},"review_note":"Confirm the current portal workflow, trade mapping, family and prior-loan rules, verification stages, training availability, lender terms, document checklist and any current amendments before publication."},
        "benefit_summary":{"types":["recognition","training","grant","loan","market_access"],"summary":"Recognition, training, toolkit, concessional collateral-free credit and market-support components subject to the official guidelines and verification process.","separate_value_buckets":true},
        "benefit_type":"grant",
        "benefit_label":"Toolkit incentive and artisan support components",
        "benefit_conditions":{"toolkit_incentive_max_inr":15000,"training_route_required":true,"credit_and_market_support_have_separate_conditions":true,"verification_required":true},
        "requirement":"Identified traditional trade and verified artisan status",
        "requirement_description":"The applicant must work in one of the 18 identified trades, establish self-employment in the unorganised sector and satisfy the current local and committee verification process.",
        "rules":{"all":[{"field":"age_years","operator":"greater_than_or_equal","value":18},{"field":"traditional_trade","operator":"exists"},{"field":"self_employed_artisan","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm trade and beneficiary eligibility","description":"Verify age, trade, self-employment, family and prior-loan conditions against the current guidelines and official FAQ.","url":"https://pmvishwakarma.gov.in/Home/FAQ"},{"title":"Prepare the registration documents","description":"Prepare Aadhaar, mobile, bank and ration-card/family information, and arrange a bank account if required.","url":"https://pmvishwakarma.gov.in/Home/FAQ"},{"title":"Register through the official portal","description":"Use the official portal, normally with CSC support, and complete the prescribed local and committee verification steps; UdyamVeda must not collect or submit OTPs on the applicant's behalf.","url":"https://pmvishwakarma.gov.in/Home/HowToRegister"},{"title":"Complete training and toolkit process","description":"Follow the current skill-verification, Basic/Advanced Training and toolkit-incentive route after the required verification.","url":"https://pmvishwakarma.gov.in/Home/FAQ"},{"title":"Evaluate credit and market-support components separately","description":"Assess credit, digital transaction, quality, branding and market-linkage components independently; do not combine them into one guaranteed value.","url":"https://pmvishwakarma.gov.in/Home/"}],
        "window_type":"rolling",
        "window_label":"The current official portal shows a registration target through 2028; component availability and live intake require current reviewer confirmation.",
        "window_evidence":{"source_url":"https://pmvishwakarma.gov.in/cdn/MiscFiles/eng_v30.0_PM_Vishwakarma_Guidelines_final.pdf","anchor":"Implementation period and current portal"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, department, official_url)
    select item->>'authority', 'central', 'Ministry of Micro, Small and Medium Enterprises', 'PM Vishwakarma', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.90, 0.88, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, item->>'source_url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), true
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = item->>'source_url');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, 'https://pmvishwakarma.gov.in/Home/', 'agency', 'PM Vishwakarma official portal', 'Registration and beneficiary application route', now(), false
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = 'https://pmvishwakarma.gov.in/Home/');
    insert into public.opportunity_sources (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select version_id, evidence.source_url, evidence.source_kind, evidence.source_title, evidence.source_anchor, now(), false
    from (values
      ('https://pmvishwakarma.gov.in/Home/FAQ', 'agency', 'PM Vishwakarma official FAQ', 'Eligibility, documents, training, toolkit, credit, digital incentive and support route'),
      ('https://pmvishwakarma.gov.in/Home/HowToRegister', 'agency', 'PM Vishwakarma official registration guide', 'Registration and verification route'),
      ('https://pmvishwakarma.gov.in/Home/TermsandConditions', 'agency', 'PM Vishwakarma official terms and conditions', 'Portal terms and current operating boundary')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (select 1 from public.opportunity_sources where opportunity_version_id = version_id and source_url = evidence.source_url);
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
