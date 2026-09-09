-- Current evidence registry for the distinct PLI Scheme for Medical Devices.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals revised Medical Devices PLI guidelines', 'https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20-%20MD%20dated%2025.02.2023.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official revised guidelines dated 25 February 2023 covering eligibility, target segments, PMA, approval, claims and disbursement.'),
  ('Department of Pharmaceuticals Medical Devices PLI 2022 guidelines', 'https://pharmaceuticals.gov.in/sites/default/files/Revised%20Guidelines%20of%20PLI%20Medical%20Devices%20dated%2018.08.2022_0_0.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official earlier revised guideline retained for amendment and implementation-history comparison.'),
  ('Department of Pharmaceuticals Annual Report 2023-24 Medical Devices PLI', 'https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official implementation-status evidence for approved applicants, incentive period, caps, investment and released claims.'),
  ('Department of Pharmaceuticals official portal', 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department portal for current notices, scheme status and claim-route changes.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
