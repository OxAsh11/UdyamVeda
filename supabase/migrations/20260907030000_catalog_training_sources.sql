-- Official sources for the Central MSME training batch. These rows are crawl
-- and provenance inputs only; they do not approve or publish records.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Assistance to Training Institutions portal root', 'https://ati.msme.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official ATI portal root for current institution and training programme navigation.'),
  ('MSME Assistance to Training Institutions official portal', 'https://ati.msme.gov.in/ATI/home.aspx', 'agency_portal', 'central', 'weekly', 1, true, 'Official ATI portal describing institutional infrastructure and programme support; current guideline terms require review.'),
  ('MSME ESDP approved guidelines', 'https://msme.gov.in/sites/default/files/Approved_ESDP_Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ESDP guideline source for objectives, components and implementing routes.'),
  ('Ministry of MSME official portal for ESDP route', 'https://msme.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry entry point for current ESDP programme calendars and notices.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
