-- Official source registry for the Startup India Credit Guarantee Scheme.
-- The opportunity remains review-gated until the current Gazette terms,
-- lender route and operational availability are manually confirmed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Startup India Credit Guarantee Scheme for Startups 2025 Gazette guideline', 'https://www.startupindia.gov.in/content/dam/invest-india/PGF/credit-guarantee-scheme-for-startup.pdf', 'gazette', 'central', 'monthly', 1, true, 'Official 2025 Gazette guideline; capture eligibility, guarantee structure, fees, lender obligations and amendments from the current document.'),
  ('NCGTC Credit Guarantee Scheme for Startups product page', 'https://www.ncgtc.in/en/product-details/CGSS/Credit-Guarantee-Scheme-for-Start-ups-(CGSS)', 'agency_portal', 'central', 'weekly', 1, true, 'Official trustee/implementing-agency product page; verify current lender and guarantee-operation details.'),
  ('Jan Samarth national application portal', 'https://www.jansamarth.in/', 'implementing_portal', 'central', 'weekly', 2, true, 'Official application handoff referenced by Startup India; availability and current fields require review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
