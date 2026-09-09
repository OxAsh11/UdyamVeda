-- Current official source pack for Promotion of MSMEs in NER and Sikkim.
-- The opportunity is institutional: State Governments or eligible State
-- agencies apply for Central assistance; individual MSMEs benefit through
-- the resulting common infrastructure and facilities.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Promotion of MSMEs in NER and Sikkim official portal', 'https://ner-promotion.msme.gov.in/NERegion/NERLoginNew.aspx', 'ministry_portal', 'central', 'weekly', 1, true, 'Official Ministry of MSME portal for the North Eastern Region and Sikkim scheme, proposal route and current implementation notices.'),
  ('Promotion of MSMEs in NER and Sikkim official FAQ', 'https://ner-promotion.msme.gov.in/NERegion/Reports/FAQs.aspx', 'faq', 'central', 'monthly', 1, true, 'Official FAQ for components, assistance ceilings, beneficiaries, DPR, geo-tagging, approval route and project completion periods.'),
  ('Promotion of MSMEs in NER and Sikkim revised guidelines', 'https://msme.gov.in/sites/default/files/RevisedGuidelines_NER_Sikkim.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Ministry of MSME revised guideline for components, State proposal route, funding, installments, utilization and time limits.'),
  ('MSME scheme booklet NER and Sikkim entry', 'https://msme.gov.in/sites/default/files/assets/pdf/v2.0%20-2025-%20Scheme%20booklet%20Eng-14.02.2025.pdf', 'ministry', 'central', 'monthly', 1, true, 'Official MSME scheme booklet with the later component-level project-cost figures; figures must be reconciled against the controlling guideline and current notice.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
