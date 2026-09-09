-- Official sources for Central technology-support and coir-sector records.
-- These rows are provenance inputs only; they do not approve or publish records.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Tool Rooms dashboard', 'https://dashboard.msme.gov.in/tool_rooms.aspx', 'ministry_portal', 'central', 'weekly', 1, true, 'Official current Tool Rooms and Technology Centres dashboard and service inventory.'),
  ('MSME Tool Rooms and Technical Institutions scheme booklet', 'https://www.msme.gov.in/sites/default/files/MSMESchemebooklet2024.pdf', 'ministry', 'central', 'monthly', 2, true, 'Official scheme booklet describing Tool Room services, training and unit support; current terms require review.'),
  ('Coir Board official portal', 'https://coirboard.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official Coir Board entry point for current CVY components and application routes.'),
  ('Coir Vikas Yojana operational guidelines', 'https://msme.gov.in/sites/default/files/Coir-Vikas-YojanaContents.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Coir Vikas Yojana guidance for sector components, support modes and implementation.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
