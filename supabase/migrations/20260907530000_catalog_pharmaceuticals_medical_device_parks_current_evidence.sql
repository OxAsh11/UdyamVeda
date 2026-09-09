-- Current evidence registry for the separate Promotion of Medical Device Parks scheme.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals Medical Device Parks guidelines', 'https://pharmaceuticals.gov.in/sites/default/files/Guidelines%20of%20the%20Scheme%20Promotion%20of%20Medical%20Devices%20Parks_1.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme guidelines: State proposer, common infrastructure, four parks, grant limits, duration and implementation agency.'),
  ('Department of Pharmaceuticals Annual Report 2023-24 Medical Device Parks', 'https://pharmaceuticals.gov.in/sites/default/files/English%20version%20of%20Annual%20Report%202023-24.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official current implementation status, selected States, project details and scheme period.'),
  ('Department of Pharmaceuticals Annual Report 2020-21 Medical Device Parks', 'https://pharmaceuticals.gov.in/sites/default/files/english%20Annual%20Report%202020-21.pdf', 'annual_report', 'central', 'monthly', 1, true, 'Official application-window and initial scheme-status evidence.'),
  ('Department of Pharmaceuticals official portal', 'https://pharmaceuticals.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Department portal for current scheme status and amendments.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
