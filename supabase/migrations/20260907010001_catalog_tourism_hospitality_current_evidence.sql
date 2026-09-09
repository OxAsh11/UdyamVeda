-- Current Ministry of Tourism/NIDHI+ evidence for hospitality-unit classification.
-- Unique version identifier; runs immediately after the Startup India source registration.
-- The opportunity remains review-gated; this migration only registers official
-- discovery and handoff sources used by the accompanying structured seed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Tourism NIDHI+ portal', 'https://nidhi.tourism.gov.in/index.html', 'implementing_portal', 'central', 'weekly', 1, true, 'Current NIDHI+ hospitality database and unit-registration portal; current notices control route availability.'),
  ('MyNIDHI official unit-registration route', 'https://nidhi.tourism.gov.in/mynidhi/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official NIDHI+ unit handoff; current State/UT applicability and live form terms require reviewer confirmation.'),
  ('Ministry of Tourism NIDHI+ guidelines index', 'https://nidhi.tourism.gov.in/home/page/guidelines', 'agency_portal', 'central', 'monthly', 1, true, 'Official current index listing accommodation, homestay, OTA, restaurant and tourism-service-provider guidelines.'),
  ('Incredible India Bed and Breakfast/Homestay classification guidelines', 'https://nidhi.tourism.gov.in/uploads/gallery/1659456723.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Ministry of Tourism classification guideline with occupancy, room, inspection, fee, validity, document and appeal conditions.'),
  ('Ministry of Tourism official portal', 'https://tourism.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of Tourism policy and programme source; state or UT schemes may apply separately.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
