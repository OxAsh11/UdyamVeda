-- Current official RKVY-RAFTAAR agripreneurship source pack.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('ICAR-IVRI R-ABI programme overview', 'https://www.ivri.nic.in/Rabi/Default2.aspx', 'implementing_agency', 'central', 'weekly', 1, true, 'Official ICAR-IVRI agribusiness incubator overview and route context.'),
  ('ICAR-IVRI R-ABI NAVODAYA programme', 'https://www.ivri.nic.in/Rabi/navodaya.aspx', 'implementing_agency', 'central', 'weekly', 1, true, 'Official NAVODAYA orientation route with current eligibility and funding description; cohort status is time-sensitive.'),
  ('ICAR-IVRI R-ABI SAMRIDDHI programme', 'https://www.ivri.nic.in/Rabi/samridhi.aspx', 'implementing_agency', 'central', 'weekly', 1, true, 'Official SAMRIDDHI incubation route with MVP, legal-entity, start-up and one-time-support conditions; cohort status is time-sensitive.'),
  ('RKVY-RAFTAAR operational guidelines', 'https://nivedi.res.in/NaaViC/wp-content/themes/naavic/pdf/RKVY-RAFTAAR_Ent.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ICAR institute-hosted operational guidelines covering R-ABIs, seed funding, orientation and idea/pre-seed funding; current amendments require reconciliation.'),
  ('MANAGE-CIA PM-RKVY agribusiness incubation page', 'https://www.manage.gov.in/managecia/RKVYProg.aspx', 'implementing_agency', 'central', 'weekly', 1, true, 'Official MANAGE-CIA page describing PM-RKVY R-ABI and agribusiness incubation routes; live cohort terms require review.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
