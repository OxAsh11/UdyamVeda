-- Review-only alternate official sources captured when a primary URL was
-- unavailable, stale, blocked, or returned unusable content. These sources
-- are deliberately non-primary and never authorize publication by themselves.

insert into public.source_registry (name, url, source_kind, coverage_level, cadence, active)
values
  ('MSME latest guidelines for Coir Vikas Yojana', 'https://msme.gov.in/sites/default/files/Latest%20guidelines-for-CVY.pdf', 'guideline', 'central', 'weekly', true),
  ('MoPNG Compressed Bio Gas programme context', 'https://mopng.gov.in/en/refining/compressed-bio-gas', 'ministry', 'central', 'weekly', true),
  ('MSDE PMKVY 4.0 Guidelines', 'https://www.msde.gov.in/static/uploads/2024/04/PMKVY-4.0-Guidelines.pdf', 'guideline', 'central', 'weekly', true),
  ('MSE Online Dispute Resolution Scheme guidelines', 'https://ramp.msme.gov.in/ramp/sites/default/files/2026-05/odr-guidelines.pdf', 'guideline', 'central', 'weekly', true),
  ('MSME Technology Centres scheme booklet', 'https://my.msme.gov.in/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf', 'guideline', 'central', 'weekly', true),
  ('MSME Technology Centres current dashboard', 'https://www.dashboard.msme.gov.in/tcsp_details.aspx', 'agency', 'central', 'weekly', true),
  ('MyMSME official scheme index', 'https://my.msme.gov.in/MyMsme/Scheme.aspx', 'agency', 'central', 'weekly', true),
  ('MyMSME scheme-wise proposals route', 'https://my.msme.gov.in/MyMsme/SchemeWiseProposals.aspx', 'agency', 'central', 'weekly', true),
  ('Ministry of Tribal Affairs PMJVM Guidelines', 'https://tribal.gov.in/downloads/Livelihood/Guidelines/PMJVMGuidelines.pdf', 'guideline', 'central', 'weekly', true),
  ('PIB Specialty Steel PLI status release', 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225496&lang=1&reg=3', 'pib', 'central', 'weekly', true),
  ('Startup India official scheme context', 'https://www.startupindia.gov.in/content/sih/en/startup-scheme.html', 'startup_india', 'central', 'weekly', true),
  ('Shipbuilding Development Scheme Brownfield capacity expansion guidelines', 'https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield%20guidelines.pdf', 'guideline', 'central', 'weekly', true),
  ('Shipbuilding Development Scheme credit-risk coverage guidelines', 'https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines.pdf', 'guideline', 'central', 'weekly', true),
  ('Shipbuilding Financial Assistance Scheme modified guidelines', 'https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29.pdf', 'guideline', 'central', 'weekly', true)
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  active = true;

do $$
declare
  item jsonb;
begin
  for item in
    select value from jsonb_array_elements($alternates$[
      {
        "slug":"coir-vikas-yojana",
        "url":"https://msme.gov.in/sites/default/files/Latest%20guidelines-for-CVY.pdf",
        "source_kind":"guideline",
        "source_title":"MSME latest guidelines for Coir Vikas Yojana",
        "source_anchor":"Current Coir Vikas Yojana guideline and component structure",
        "content_hash":"91c1b8f556f675157a9a60339b1276db64b7bef761833927c8a3727dd167f4a0"
      },
      {
        "slug":"mopng-cbg-biomass-aggregation-machinery",
        "url":"https://mopng.gov.in/en/refining/compressed-bio-gas",
        "source_kind":"ministry",
        "source_title":"MoPNG Compressed Bio Gas programme context",
        "source_anchor":"Compressed Bio Gas, SATAT, entrepreneur route, biomass supply chain and current programme context",
        "content_hash":"1d6635f5b1c673482ed3ef23ce22b5fd8c18a7f0069b3df3a14ac57c05a71a76"
      },
      {
        "slug":"msde-pradhan-mantri-kaushal-vikas-yojana-4",
        "url":"https://www.msde.gov.in/static/uploads/2024/04/PMKVY-4.0-Guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"MSDE PMKVY 4.0 Guidelines",
        "source_anchor":"PMKVY 4.0, candidate selection, Skill India Digital, NSDC implementing arm, training lifecycle and Skill Hubs",
        "content_hash":"2a9b3f355167188928236a637eeab23e6f535b5327d8c7e82a6f1e6dc85c432c"
      },
      {
        "slug":"mse-online-dispute-resolution-scheme",
        "url":"https://ramp.msme.gov.in/ramp/sites/default/files/2026-05/odr-guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"MSE Online Dispute Resolution Scheme guidelines",
        "source_anchor":"Financial assistance to MSEs, eligibility criterion, implementation period and online dispute resolution",
        "content_hash":"fe1df4ba940c181f5a475db330f9f2de9955f8abecd0f6c6ee28e8b24d17d0fc"
      },
      {
        "slug":"msme-tool-rooms-and-technology-centres",
        "url":"https://my.msme.gov.in/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf",
        "source_kind":"guideline",
        "source_title":"MSME Technology Centres scheme booklet",
        "source_anchor":"Technology Centres, Tool Rooms, services, training and institutional support boundaries",
        "content_hash":"417c7dee41116b93f442dee7c71fca5d0fe4aa0b4dc5c258575091d205a10329"
      },
      {
        "slug":"msme-tool-rooms-and-technology-centres",
        "url":"https://www.dashboard.msme.gov.in/tcsp_details.aspx",
        "source_kind":"agency",
        "source_title":"MSME Technology Centres current dashboard",
        "source_anchor":"Technology Centre network, current centre details and institutional service context",
        "content_hash":"651fb78d62ced7d4683721ec30c64ebb88c17e68bdf98fa6d3210871d3bd25e3"
      },
      {
        "slug":"performance-and-credit-rating-scheme-for-micro-and-small-enterprises",
        "url":"https://my.msme.gov.in/MyMsme/Scheme.aspx",
        "source_kind":"agency",
        "source_title":"MyMSME official scheme index",
        "source_anchor":"Performance and Credit Rating Scheme official scheme index and current route context",
        "content_hash":"ae05b2e21413e2cfcbdf34977572538d90be3d924be8b1cd774dbab02023c0ef"
      },
      {
        "slug":"performance-and-credit-rating-scheme-for-micro-and-small-enterprises",
        "url":"https://my.msme.gov.in/MyMsme/SchemeWiseProposals.aspx",
        "source_kind":"agency",
        "source_title":"MyMSME scheme-wise proposals route",
        "source_anchor":"Performance and Credit Rating Scheme proposal and application context",
        "content_hash":"083bf289c7216dac9f091866082a96b08f42615cf6ee62b1e5f6b62421826381"
      },
      {
        "slug":"pmjvm-tribal-value-chain",
        "url":"https://tribal.gov.in/downloads/Livelihood/Guidelines/PMJVMGuidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Ministry of Tribal Affairs PMJVM Guidelines",
        "source_anchor":"PMJVM merger, vision, objectives, production, procurement, processing and marketing value chain",
        "content_hash":"767006f184d8e33515444978507b1847fcc00a624c57119db7ff26bca27064e5"
      },
      {
        "slug":"production-linked-incentive-specialty-steel",
        "url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2225496&lang=1&reg=3",
        "source_kind":"pib",
        "source_title":"PIB Specialty Steel PLI status release",
        "source_anchor":"Specialty Steel PLI status, selected companies, product categories and implementation context",
        "content_hash":"1e7f83c64fcb4686bcd7a74d6000aaef112c4ccdccea8d584cfd372587a127ae"
      },
      {
        "slug":"railways-dpiit-startup-procurement-access",
        "url":"https://www.startupindia.gov.in/content/sih/en/startup-scheme.html",
        "source_kind":"startup_india",
        "source_title":"Startup India official scheme context",
        "source_anchor":"Startup India procurement access, startup eligibility and public procurement context",
        "content_hash":"a73b94d4816a8375c658f7a254aa5cbfcb7977c84cf16a9bbe5a2867f10a1146"
      },
      {
        "slug":"shipbuilding-development-scheme-brownfield-capacity-expansion",
        "url":"https://shipmin.gov.in/sites/default/files/Annexure%204%20Brownfield%20guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Shipbuilding Development Scheme Brownfield capacity expansion guidelines",
        "source_anchor":"Brownfield Capacity Expansion, Shipbuilding Development Scheme, shipyard eligibility, Capital Assistance, DPR and National Shipbuilding Mission",
        "content_hash":"6cf23f89e3d8a260c28676049a031bf1c6077adda886194d2a44d57f57221ba3"
      },
      {
        "slug":"shipbuilding-development-scheme-risk-coverage",
        "url":"https://shipmin.gov.in/sites/default/files/Annexure%202%20Credit%20risk%20coverage%20guidelines.pdf",
        "source_kind":"guideline",
        "source_title":"Shipbuilding Development Scheme credit-risk coverage guidelines",
        "source_anchor":"Shipbuilding risk coverage, Credit Risk Cover Agencies, Sagarmala Financial Corporation Limited, pre-shipment, post-shipment and vendor-default insurance",
        "content_hash":"5649dc8ab1a600657f389ab0c370cac5247a38ea7d42622e94692476a207af7f"
      },
      {
        "slug":"shipbuilding-financial-assistance-scheme-sbfas",
        "url":"https://shipmin.gov.in/sites/default/files/Modified%20Guidelines%20for%20implementation%20of%20Shipbuilding%20Financial%20Assistance%20Scheme%20%28SBFAS%29.pdf",
        "source_kind":"guideline",
        "source_title":"Shipbuilding Financial Assistance Scheme modified guidelines",
        "source_anchor":"Shipbuilding Financial Assistance Scheme, Indian shipyards, domestic content, 45-day application and stage payments",
        "content_hash":"28704b52f67b56512ab3d30b12e99bcdab589697daf1bad3fb3a7315a1b26306"
      }
    ]$alternates$::jsonb)
  loop
    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, content_hash, is_primary)
    select opportunity.current_version_id,
      item->>'url', item->>'source_kind', item->>'source_title', item->>'source_anchor', now(), item->>'content_hash', false
    from public.opportunities opportunity
    where opportunity.slug = item->>'slug'
      and opportunity.current_version_id is not null
      and not exists (
        select 1
        from public.opportunity_sources existing
        where existing.opportunity_version_id = opportunity.current_version_id
          and existing.source_url = item->>'url'
      );
  end loop;
end $$;
