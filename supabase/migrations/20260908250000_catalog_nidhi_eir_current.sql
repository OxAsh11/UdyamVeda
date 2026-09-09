-- Current official DST/NIDHI-EIR source pack.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('NIDHI Entrepreneur-in-Residence official programme page', 'https://nidhi.dst.gov.in/nidhieir/', 'ministry', 'central', 'weekly', 1, true, 'Current DST/NIDHI page for EIR purpose, monthly support, current page duration and TBI application route.'),
  ('NIDHI schemes and programmes index', 'https://nidhi.dst.gov.in/schemes-programmes/', 'ministry_portal', 'central', 'monthly', 1, true, 'Official NIDHI index listing EIR among the programme components.'),
  ('About NIDHI and implementation route', 'https://nidhi.dst.gov.in/about-department/about-nidhi/', 'ministry', 'central', 'monthly', 1, true, 'Official implementation boundary: NIDHI startup offerings are disbursed through eligible associated incubators.'),
  ('NIDHI-EIR guidelines updated April 2022', 'https://cdnbbsr.s3waas.gov.in/s312b1e42dc0746f22cf361267de07073f/uploads/2023/01/2023010680.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DST/NIDHI guideline PDF for education, full-time, TBI, monthly support, 12-to-18-month conditional duration, selection and monitoring.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
