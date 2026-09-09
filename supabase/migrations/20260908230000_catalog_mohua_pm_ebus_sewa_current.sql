-- Current PM-eBus Sewa source pack and review-gated opportunity record.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM-eBus Sewa official portal', 'https://pm-ebus-sewa.mohua.gov.in/', 'implementing_portal', 'central', 'daily', 1, true, 'Official MoHUA portal for scheme overview, notices, city/tender progress and current implementation updates.'),
  ('PM-eBus Sewa Guidelines Part I', 'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/PM-eBus-Sewa-Guidelines-Part-I-1.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official guideline for eligible cities, challenge method, proposals, CESL demand aggregation, GCC wet lease, depot and power infrastructure.'),
  ('PM-eBus Sewa Guidelines Addendum', 'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2025/08/Addendum_PM-eBus-Sewa-Guidelines.pdf', 'addendum', 'central', 'weekly', 1, true, 'Official addendum; current amendments must be reconciled with the controlling guideline before publication.'),
  ('PIB PM-eBus Sewa-PSM implementation update', 'https://pm-ebus-sewa.mohua.gov.in/wp-content/uploads/2026/03/https-www.pib_.gov_.in-PressReleasePage.aspx-PRID2237554reg3lang2-1.pdf', 'pib', 'central', 'weekly', 1, true, 'Official PIB implementation update dated 10 March 2026; progress data is time-bound and must not be treated as a live tender.' )
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

