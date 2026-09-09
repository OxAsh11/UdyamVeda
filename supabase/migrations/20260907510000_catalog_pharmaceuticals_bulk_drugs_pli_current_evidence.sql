-- Current evidence registry for the distinct PLI Scheme for Bulk Drugs.
-- This is separate from the PLI Scheme for Pharmaceuticals because the
-- eligible products, greenfield condition, thresholds and rate schedule differ.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals Bulk Drugs PLI Gazette notification', 'https://pharmaceuticals.gov.in/sites/default/files/Gazettee%20notification%20of%20bulk%20drug%20schemes_0.pdf', 'gazette_notification', 'central', 'monthly', 1, true, 'Primary Gazette notification for the Bulk Drugs PLI scheme: 41 identified products, greenfield condition, investment thresholds, incentive rates, tenure and application boundary.'),
  ('Department of Pharmaceuticals Bulk Drugs PLI guidelines', 'https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20for%20the%20Production%20Linked%20Incentive%20%28PLI%29%20Scheme%20for%20promotion%20of_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Department guidelines and operating detail for the PLI route; current selected-applicant and claim status require verification.'),
  ('Department of Pharmaceuticals Bulk Drugs PLI 2024 SCOD amendment', 'https://pharmaceuticals.gov.in/sites/default/files/Corrigendum%20dated%2012.03.2024.pdf', 'corrigendum', 'central', 'monthly', 1, true, 'Official amendment covering SCOD revision, bank-guarantee consequences, multiple-product approvals and non-guarantee of incentive disbursement.'),
  ('Department of Pharmaceuticals Bulk Drugs PLI 2024 successor amendment', 'https://pharmaceuticals.gov.in/sites/default/files/Corrigendum%20Under%20PLI%20scheme%20for%20Bulk%20Drugs%2025.09.2024_0.pdf', 'corrigendum', 'central', 'monthly', 1, true, 'Official 25 September 2024 amendment to the successor-in-interest definition.'),
  ('Department of Pharmaceuticals Bulk Drugs PLI application notice', 'https://pharmaceuticals.gov.in/sites/default/files/Notice%20PLI%20Scheme%20for%20Bulk%20Drug.pdf', 'notice', 'central', 'monthly', 1, true, 'Official application notice for the later Vitamin B1 route; historic notice used for route and window evidence, not as proof of a current open call.'),
  ('Department of Pharmaceuticals official portal', 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department portal for current scheme notices, amendments, selected-applicant and claim-status changes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
