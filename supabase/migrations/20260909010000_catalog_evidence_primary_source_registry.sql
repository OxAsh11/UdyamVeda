-- Register canonical primary sources cited by existing review evidence packets.
-- These rows do not approve the records; they only make provenance explicit.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DST Technology Business Incubator official route', 'https://nidhi.dst.gov.in/nidhitbi', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the DST Technology Business Incubator review packet.'),
  ('Atal Innovation Mission Atal Incubation Centres official page', 'https://aim.gov.in/atal-incubation-centres.php', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the Atal Incubation Centres review packet.'),
  ('BIRAC BioNEST official page', 'https://birac.nic.in/bionest.php', 'agency_portal', 'central', 'monthly', 1, true, 'Canonical primary source cited by the BioNEST review packet.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
