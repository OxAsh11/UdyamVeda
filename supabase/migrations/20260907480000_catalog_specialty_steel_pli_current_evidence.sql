-- Current Ministry of Steel PLI Specialty Steel evidence.
-- New-application availability is kept closed/review-gated because the
-- current official material describes concluded rounds and selected MoUs.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Ministry of Steel PLI Specialty Steel official page', 'https://steel.gov.in/pli', 'ministry_portal', 'central', 'weekly', 1, true, 'Current official PLI Specialty Steel page with scheme status, rounds and selected-company information.'),
  ('Ministry of Steel PLI Specialty Steel guidelines', 'https://steel.gov.in/sites/default/files/2025-04/Scheme%20Guidelines_Final_Upload.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PLI Specialty Steel guidelines with product categories, scheme period and qualifying conditions.'),
  ('Ministry of Steel PLI page and notices', 'https://steel.gov.in/pli?page=1', 'notice_index', 'central', 'weekly', 1, true, 'Official notice index for invitation, modification and extension documents.'),
  ('Ministry of Steel PLI 1.1 page', 'https://steel.gov.in/node/3177', 'scheme_page', 'central', 'monthly', 1, true, 'Official Ministry page for PLI 1.1 status and round-specific information.'),
  ('Ministry of Steel 2025-26 annual report', 'https://steel.gov.in/sites/default/files/2026-04/Final%20Annual%20Report%202025-26%20%28English%20Version%29.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official annual report with PLI 1.2 launch, five-year incentive period and current implementation status.'),
  ('Ministry of Steel sector overview April 2026', 'https://steel.gov.in/sites/default/files/2026-05/An%20Overview%20of%20Steel%20Sector%20for%20the%20month%20of%20April%2C%202026.pdf', 'official_report', 'central', 'monthly', 1, true, 'Official sector overview with PLI 1.2 applications, MoUs, committed investment and current disbursement context.'),
  ('Ministry of Steel PLI booklet', 'https://steel.gov.in/sites/default/files/PLI%20Scheme%20booklet_.pdf', 'scheme_document', 'central', 'monthly', 1, true, 'Official PLI Specialty Steel booklet and application evidence.'),
  ('Ministry of Steel PLI 1.2 parliamentary answer', 'https://steel.gov.in/sites/default/files/2025-12/lu%20323.pdf', 'parliamentary_answer', 'central', 'monthly', 1, true, 'Official parliamentary answer summarising PLI 1.2 product categories, tenure and selected-company terms.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
