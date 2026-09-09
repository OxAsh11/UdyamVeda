-- Official source registry for Startup India Fund of Funds 2.0.
-- These are evidence inputs only; they do not approve the opportunity.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DPIIT Startup India Fund of Funds 2.0 operational guidelines', 'https://www.dpiit.gov.in/static/uploads/2026/04/8949d8e0dabf11cb9291b00ec1d1f727.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DPIIT operational guidelines for corpus, eligible AIFs, startup investment route, selection and monitoring. Verify amendments before publication.'),
  ('DPIIT Startup India Fund of Funds 2.0 notification and VCIC constitution', 'https://www.dpiit.gov.in/static/uploads/2026/04/3382625ffc31ea32ecc33ea68365172d.pdf', 'gazette', 'central', 'monthly', 1, true, 'Official DPIIT communication recording notification of the scheme and implementation/VCIC arrangements.'),
  ('SIDBI Fund of Funds application portal', 'https://vcfapplication.sidbi.in/login', 'agency', 'central', 'weekly', 1, true, 'Official SIDBI route for AIF applications; startup access is indirect through selected AIFs and must not be represented as a direct startup application.'),
  ('Startup India Fund of Funds 2.0 scheme document', 'https://www.startupindia.gov.in/content/dam/startupindia/Startup-India-Fund-of-Funds-2.0-Scheme.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Startup India-hosted scheme notification; retain the DPIIT-hosted guideline as the primary operational source if the Startup India PDF is inaccessible.' )
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
