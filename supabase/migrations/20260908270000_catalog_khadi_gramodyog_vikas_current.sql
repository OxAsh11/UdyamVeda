-- Current official KVIC/MSME source pack for Khadi Gramodyog Vikas Yojana.
-- This is an umbrella record: each KVY/GVY component has its own applicant,
-- support, selection and documentation rules.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('KVIC KGVY introduction and component structure', 'https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/43320231218130809.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official KVIC/MSME source defining the KGVY umbrella, KVY, GVY verticals and Khadi Grant boundary.'),
  ('MSME revised Khadi Vikas Yojana guidelines', 'https://msme.gov.in/sites/default/files/RevisedOperationalKVYguidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Ministry of MSME operational guideline for KVY components and institution/artisan support.'),
  ('KVIC Khadi Vikas Yojana component note', 'https://kviconline.gov.in/mdaclaims/commPgs/41320221201121713.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official KVIC component note for MMDA, ISEC, workshed, infrastructure, marketing, quality and S&T components.'),
  ('KVIC GVY service industry SOP', 'https://kviconline.gov.in/pmegpeportalappdoc/DigitalKVICupload/42620240304174114.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official KVIC SOP describing current GVY service-industry implementation and beneficiary-selection boundary.'),
  ('KVIC official Khadi applications portal', 'https://kviconline.gov.in/khadi.jsp', 'agency_portal', 'central', 'weekly', 1, true, 'Official KVIC portal for Khadi applications, institutions and operational routes; component availability requires review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
