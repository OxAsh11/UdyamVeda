-- Official current evidence for the review-gated Scheme for Promotion of MSMEs in Defence.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DDP Scheme for Promotion of MSMEs in Defence page', 'https://www.ddpmod.gov.in/en/scheme_for_promotion_of_msmes_in_defence_0', 'ministry', 'central', 'weekly', 1, true, 'Official Department of Defence Production publication page dated 23 February 2026 and last updated 3 September 2026.'),
  ('Scheme for Promotion of MSMEs in Defence - FY 2026-27 proposal form and guidelines', 'https://www.ddpmod.gov.in/sites/default/files/2e7aaf1bd5030bd12ef5e83c096ef5bca4dc3aac2c4b7f55013996b6cbc75239/4ac52b4c9f672575ba175be70bcc2be4f5b96d9614b2e2081ee88cfccb809c87.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official scheme document: objectives, scope, eligible agencies, sanction criteria, sponsorship ceilings and FY 2026-27 event proposal form.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
