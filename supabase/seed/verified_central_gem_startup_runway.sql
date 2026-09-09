-- Government e-Marketplace Startup Runway record. This is a market-access
-- route, not a grant or guaranteed procurement award; it remains in_review
-- until the current GeM seller flow, listing rules and procurement relaxations
-- are manually confirmed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Government e-Marketplace official portal', 'https://gem.gov.in/', 'implementing_agency_portal', 'central', 'weekly', 1, true, 'Official Government e-Marketplace portal; current seller onboarding and listing terms require live review.'),
  ('Startup India public procurement guidance', 'https://www.startupindia.gov.in/content/sih/en/public_procurement.html', 'ministry_portal', 'central', 'weekly', 1, true, 'DPIIT/Startup India public-procurement guidance covering GeM seller access and GeM Startup Runway.'),
  ('GeM Startup Runway overview', 'https://assets-bg.gem.gov.in/resources/upload/shared_doc/gem-overview-ppt-2-september-2024-1_1725964078.pdf', 'official_overview', 'central', 'monthly', 1, true, 'Official GeM overview identifying Startup Runway as a dedicated GeM page; detailed current operating terms require review.'),
  ('GeM seller manual', 'https://assets-bg.gem.gov.in/resources/pdf/seller-user-manual.pdf', 'seller_manual', 'central', 'monthly', 1, true, 'Official GeM seller-registration manual; registration fields and verification steps can change.'),
  ('GeM seller journey training', 'https://elearning.gem.gov.in/course/index.php?categoryid=2', 'training_portal', 'central', 'monthly', 1, true, 'Official GeM seller-journey training entry point for registration, catalogue, bidding and fulfilment.'),
  ('PIB GeM Startup Runway 2.0 update', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2296546&lang=1&reg=48', 'pib_release', 'central', 'weekly', 2, true, 'PIB change-detection source for current GeM Startup Runway 2.0 and seller-support announcements; not the sole legal source.')
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
        "slug":"gem-startup-runway-public-procurement",
        "name":"GeM Startup Runway",
        "type":"procurement_market_access",
        "authority":"Government e-Marketplace (GeM)",
        "authority_url":"https://gem.gov.in/",
        "canonical_url":"https://www.startupindia.gov.in/content/sih/en/public_procurement.html",
        "source_url":"https://www.startupindia.gov.in/content/sih/en/public_procurement.html",
        "source_kind":"ministry_portal",
        "source_title":"Startup India public procurement guidance",
        "source_anchor":"GeM seller registration; GeM Startup Runway; public-procurement relaxations",
        "summary":"A Government e-Marketplace route that helps eligible startups present innovative products and services to government buyers through public procurement.",
        "objective":"Improve startup access to government buyers and make it easier for eligible innovative businesses to participate in public procurement.",
        "legal_basis":"Government e-Marketplace procurement framework and DPIIT/Startup India public-procurement guidance; current GeM terms, category rules and tender conditions apply.",
        "eligibility":{"entity_types":["dpiit_recognised_startup","startup","msme","private_limited","llp","proprietorship","other_private_company"],"lifecycle_stages":["early_stage","growth","operating"],"conditions":["seller registration on GeM is required for the relevant seller route","the Startup Runway route is intended for eligible innovative startup products or services under current GeM rules","DPIIT recognition and a current recognition number are required for the Startup Runway startup route where stated by the current guidance","product, service, quality, catalogue, bid and buyer-specific conditions apply","a listing or seller profile does not guarantee a tender award, order or revenue"],"exclusions":["businesses that cannot satisfy current GeM seller verification or product/service listing requirements","claims of automatic contract, grant, subsidy or procurement value"],"founder_categories":["women","sc_st","transgender","divyang","other_underrepresented_founder"],"unknown_handling":"needs_information"},
        "application":{"portal":"https://gem.gov.in/","route":"create or update the applicable GeM seller profile, complete verification, prepare the catalogue and use the current Startup Runway or seller route for eligible products/services","applicant_note":"UdyamVeda can explain and prepare the route, but the applicant must complete the official GeM registration, verification, listing, bidding and contract process directly."},
        "fine_print":{"benefit_is_market_access":true,"grant_or_subsidy":false,"orders_guaranteed":false,"startup_runway_model":"A dedicated GeM route/page for eligible startups to offer innovative products and services to government buyers.","procurement_relaxations":{"prior_turnover":"DPIIT-recognised startups may receive relaxation subject to current procurement conditions and tender rules","prior_experience":"DPIIT-recognised startups may receive relaxation subject to current procurement conditions and tender rules","earnest_money_deposit":"DPIIT-recognised startups may receive applicable EMD relaxation subject to current procurement conditions and tender rules"},"seller_route_requirements":"Current GeM verification, constitution, tax, bank, product/service, quality and catalogue requirements depend on the seller and listing route; use the live official GeM instructions.","review_note":"Confirm the current Startup Runway entry point, DPIIT-recognition linkage, seller-verification fields, category/listing rules, relaxation wording, tender exceptions, fees, quality documents and any Startup Runway 2.0 amendments before publication."},
        "benefit_summary":{"types":["market_access","procurement_support","public_buyer_discovery"],"summary":"Access to a government procurement marketplace and a startup-focused discovery route; it is not a grant, subsidy, loan or guaranteed contract."},
        "benefit_type":"market_access",
        "benefit_label":"Government buyer access through GeM Startup Runway",
        "benefit_conditions":{"gem_seller_verification_required":true,"eligible_innovative_product_or_service_required":true,"tender_and_buyer_conditions_apply":true,"no_order_guarantee":true},
        "requirement":"DPIIT/startup profile and GeM seller readiness",
        "requirement_description":"The business must establish the applicable startup or entity status, complete GeM seller verification, prepare compliant product or service information and meet the conditions of each listing or tender.",
        "rules":{"all":[{"field":"government_sales_intent","operator":"equals","value":true},{"field":"gem_seller_route_available","operator":"equals","value":true},{"field":"innovative_product_or_service_ready","operator":"equals","value":true}],"unknown_handling":"needs_information"},
        "steps":[{"title":"Confirm the correct eligibility route","description":"Check current GeM and Startup India guidance to determine whether the business should use the general seller route or Startup Runway route and whether DPIIT recognition is required.","url":"https://www.startupindia.gov.in/content/sih/en/public_procurement.html"},{"title":"Complete GeM seller verification","description":"Use the official GeM seller journey and current verification instructions for the business constitution and seller profile.","url":"https://assets-bg.gem.gov.in/resources/pdf/seller-user-manual.pdf"},{"title":"Prepare and publish the catalogue","description":"Prepare product or service descriptions, quality or test evidence and any category-specific information required by GeM before listing.","url":"https://elearning.gem.gov.in/course/index.php?categoryid=2"},{"title":"Participate in procurement opportunities","description":"Review buyer requirements, bid conditions, relaxations and deadlines, then submit through the official GeM process and retain procurement records.","url":"https://gem.gov.in/"}],
        "window_type":"rolling",
        "window_label":"Seller registration and marketplace access are ongoing, while bids, catalogues and buyer opportunities have their own deadlines and conditions.",
        "window_evidence":{"source_url":"https://www.startupindia.gov.in/content/sih/en/public_procurement.html","anchor":"GeM seller registration and GeM Startup Runway"}
      }
    ]$records$::jsonb)
  loop
    authority_id := null;
    insert into public.authorities (name, level, ministry, official_url)
    select item->>'authority', 'central', 'Department of Commerce', item->>'authority_url'
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
    values (seed_opportunity_id, 1, item->>'name', item->>'summary', item->>'objective', item->>'legal_basis', item->'eligibility', item->'application', item->'fine_print', item->'benefit_summary', now(), 0.84, 0.82, 'in_review')
    on conflict (opportunity_id, version_number) do nothing
    returning id into version_id;
    if version_id is null then
      select ov.id into version_id from public.opportunity_versions ov where ov.opportunity_id = seed_opportunity_id and ov.version_number = 1 limit 1;
    end if;
    update public.opportunities set current_version_id = version_id, status = 'in_review' where public.opportunities.id = seed_opportunity_id;

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
