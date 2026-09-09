-- Official sources for export registration and tax-identity readiness.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DGFT official portal', 'https://www.dgft.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official foreign-trade and IEC portal entry point.'),
  ('DGFT IEC services page', 'https://www.dgft.gov.in/CP/', 'ministry_portal', 'central', 'weekly', 2, true, 'Current DGFT service route; exact IEC application path requires review.'),
  ('Income Tax e-Filing official portal', 'https://www.incometax.gov.in/iec/foportal/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official tax identity and e-filing entry point; PAN/TAN application handoffs require review.'),
  ('MCA SPICe+ PAN/TAN guidance', 'https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MCA guidance for PAN/TAN allocation as part of company incorporation.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
