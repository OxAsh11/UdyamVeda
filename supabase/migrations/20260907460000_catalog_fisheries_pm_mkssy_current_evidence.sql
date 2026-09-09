-- Current PM-MKSSY fisheries enterprise evidence.
-- This migration registers official sources; the structured opportunity remains
-- in_review until its component-level terms and live route are reviewed.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Fisheries PMMSY/PM-MKSSY portal', 'https://pmmsy.dof.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Current Department of Fisheries portal showing PM-MKSSY and fisheries enterprise context.'),
  ('PM-MKSSY Environmental and Social Management Framework', 'https://www.dof.gov.in/static/uploads/2025/09/db9e0987df6461b69304fe4115aceec9.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PM-MKSSY framework with micro/small-enterprise scope, NFDP, insurance, performance-grant, post-verification and exclusion conditions.'),
  ('PM-MKSSY revised operational framework', 'https://dof.gov.in/sites/default/files/2025-11/Revised_RFP_InternalAudit.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official Department of Fisheries revised framework referencing the PM-MKSSY operational guidelines and component structure.'),
  ('PM-MKSSY official brochure', 'https://dof.gov.in/sites/default/files/2024-12/PMMKSSY_compressed.pdf', 'scheme_document', 'central', 'monthly', 1, true, 'Official scheme brochure with FY 2023-24 to FY 2026-27 period, target beneficiaries and component overview.'),
  ('National Fisheries Digital Platform', 'https://nfdp.dof.gov.in/nfdp/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official NFDP registration and fisheries stakeholder formalisation route; live form and authentication requirements require reviewer confirmation.'),
  ('PM-MKSSY operational-guideline route', 'https://pmmkssy.dof.gov.in/pmmkssy/', 'implementing_portal', 'central', 'weekly', 1, true, 'Official operational-guideline and application route referenced by the Department of Fisheries framework.'),
  ('Department of Fisheries contact route', 'https://pmmsy.dof.gov.in/contact-us', 'contact', 'central', 'monthly', 1, true, 'Official contact route for confirming the current State/UT and District Fisheries Officer handoff.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
