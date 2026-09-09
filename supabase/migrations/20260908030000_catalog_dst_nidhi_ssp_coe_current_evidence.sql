-- Official DST/NIDHI evidence for startup seed support and Centres of Excellence.
-- Both routes remain review-gated: the first is intermediary-led seed support and
-- the second combines an institutional CoE route with startup acceleration access.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NIDHI official homepage', 'https://nidhi.dst.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DST NIDHI programme hub and update index.'),
  ('NIDHI schemes and programmes', 'https://nidhi.dst.gov.in/schemes-programmes/', 'ministry_portal', 'central', 'monthly', 1, true, 'Official index listing NIDHI SSP, CoE, TBI, PRAYAS, EIR, i-TBI and accelerator routes.'),
  ('NIDHI Seed Support Program', 'https://nidhi.dst.gov.in/nidhissp/', 'scheme_page', 'central', 'weekly', 1, true, 'Official NIDHI-SSP purpose, support ceilings, application route and beneficiary page.'),
  ('NIDHI-SSP guidelines index', 'https://nidhi.dst.gov.in/document/nidhi-seed-support-program-nidhi-ssp-guidelines/', 'guideline', 'central', 'monthly', 1, true, 'Official link to the current NIDHI-SSP guideline document; instrument terms require document-level review.'),
  ('NIDHI documents index', 'https://nidhi.dst.gov.in/documents/', 'document_index', 'central', 'monthly', 1, true, 'Official lists of NIDHI Seed Supported TBIs, CoEs and programme documents.'),
  ('NIDHI Centres of Excellence', 'https://nidhi.dst.gov.in/nidhicoe/', 'scheme_page', 'central', 'weekly', 1, true, 'Official CoE objectives, five-year institutional-support description, startup route and application guidance.'),
  ('DST e-PMS portal', 'https://onlinedst.gov.in/', 'application_portal', 'central', 'weekly', 1, true, 'Official DST portal referenced for institutional applications; not treated as an open call by itself.'),
  ('Department of Science and Technology official portal', 'https://dst.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DST authority portal for programme notices and policy context.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
