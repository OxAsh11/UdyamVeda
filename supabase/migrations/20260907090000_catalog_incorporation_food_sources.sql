-- Official national incorporation and food-safety registration sources.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MCA SPICe+ and linked filings FAQ', 'https://www.mca.gov.in/content/dam/mca/pdf/SPICEplus-and-linked-filings-FAQs-V3-20230122.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official MCA FAQ for SPICe+ incorporation, name reservation and linked services; amendments require review.'),
  ('MCA official portal', 'https://www.mca.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official company incorporation and corporate filing portal.'),
  ('FSSAI official portal', 'https://fssai.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official FSSAI authority portal.'),
  ('FSSAI business services hub', 'https://fssai.gov.in/business', 'ministry_portal', 'central', 'weekly', 2, true, 'Official food-business licensing, registration and compliance services hub.'),
  ('FSSAI food-business registration page', 'https://fssai.gov.in/business/registration', 'ministry_portal', 'central', 'weekly', 2, true, 'Official food-business registration/licensing applicability and route.'),
  ('FoSCoS official portal', 'https://foscos.fssai.gov.in/', 'ministry_portal', 'central', 'weekly', 2, true, 'Official Food Safety Compliance System application handoff.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
