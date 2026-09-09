-- Current Technology Development Board evidence.
-- The record remains in_review because the official pages contain both
-- general funding modes and FAQ exceptions that require human reconciliation.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Technology Development Board official portal', 'https://www.tdb.gov.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official TDB portal under the Department of Science and Technology with current funding, calls and proposal routes.'),
  ('TDB Modes of Funding', 'https://www.tdb.gov.in/modes-funding', 'scheme_page', 'central', 'monthly', 1, true, 'Official current funding modes page describing loan, equity and exceptional grant support.'),
  ('TDB Project Funding Guidelines', 'https://tdb.gov.in/sites/default/files/2023-12/funding_guidelines_march_23_revised.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official project funding guidelines covering eligible applicants, technology commercialisation and application conditions.'),
  ('TDB FAQ', 'https://tdb.gov.in/faqs_new', 'faq', 'central', 'monthly', 1, true, 'Official FAQ with legal-form boundaries, application timing, sectors, funding patterns, repayment and security conditions.'),
  ('TDB Approval of Financial Assistance', 'https://www.tdb.gov.in/approval-financial-assistance/', 'procedure', 'central', 'monthly', 1, true, 'Official approval-authority page; approval bands are governance thresholds, not an applicant entitlement.'),
  ('TDB Acts and Rules', 'https://www.tdb.gov.in/acts-and-rules', 'act', 'central', 'monthly', 1, true, 'Official statutory basis for the Technology Development Board under the TDB Act, 1995.'),
  ('TDB Downloads and application forms', 'https://www.tdb.gov.in/index.php/downloads', 'forms', 'central', 'monthly', 1, true, 'Official downloads route for the project funding guidance, Loan Application Form-A and progress-report formats.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
