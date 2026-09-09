-- Current BIRAC portal and call-directory evidence for SBIRI and BIPP.
-- These sources establish the current review boundary; they do not publish a
-- call deadline or resolve legacy funding language automatically.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('BIRAC current scheme document directory', 'https://birac.nic.in/desc_new.php?id=591', 'agency_portal', 'central', 'monthly', 1, true, 'Current BIRAC scheme directory for SBIRI/BIPP scheme documents, RFPs, registration and proposal links; checked 08 September 2026.'),
  ('BIRAC current calls for proposals', 'https://www.birac.nic.in/cfp.php', 'agency_portal', 'central', 'weekly', 1, true, 'Current BIRAC calls page used to check whether an active SBIRI or BIPP call is published; absence from the current list is not proof that recurring routes are abolished.'),
  ('BIRAC BIPP scheme directory and legacy funding note', 'https://www.birac.nic.in/desc_new.php?id=65', 'agency_portal', 'central', 'monthly', 1, true, 'Official BIPP directory page retained as a review source because its legacy description mentions both soft loan and grant, which must be reconciled with the revised BIPP guideline before publication.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
