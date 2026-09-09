-- Current official MeitY/DoT evidence for GENESIS and telecom testing/certification
-- reimbursement. Both records remain review-gated because component calls,
-- implementing-agency routes, fund availability and live portal conditions
-- require human verification before publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MeitY GENESIS official scheme page', 'https://www.meity.gov.in/offerings/schemes-and-services/details/gen-next-support-for-innovative-startups-genesis-gN5AjNtQWa', 'ministry_portal', 'central', 'weekly', 1, true, 'Official MeitY scheme page describing GENESIS scope, budget, ecosystem-entity eligibility and Tier-II/III startup support.'),
  ('MeitY Startup Hub GENESIS page', 'https://msh.meity.gov.in/schemes/genesis', 'agency_portal', 'central', 'weekly', 1, true, 'Official implementing-ecosystem page describing GENESIS components, implementing agencies and startup-support route.'),
  ('GENESIS official brochure', 'https://www.meity.gov.in/static/uploads/2024/02/Brochure_GENESIS.pdf', 'brochure', 'central', 'monthly', 1, true, 'Official GENESIS brochure with component-specific pilot, early-stage, deep-tech and investment-support boundaries.'),
  ('MeitY official portal', 'https://www.meity.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official MeitY portal for schemes, notifications and current document versions.'),
  ('MeitY telecom testing reimbursement scheme page', 'https://www.meity.gov.in/offerings/schemes-and-services/details/guidelines-for-implementation-of-scheme-for-reimbursement-of-testing-and-certification-charges-for-start-ups-and-telecom-mses-cjNwMjMtQWa', 'scheme_page', 'central', 'weekly', 1, true, 'Official MeitY page describing reimbursement rates, fund/duration boundary, application start and eligible testing laboratories.'),
  ('Telecom testing reimbursement guidelines', 'https://www.meity.gov.in/static/uploads/2025/06/837f9d009185a3e2061fb12ba8ef4d17.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official TEC/DoT guideline with application documents, revenue/funding conditions, no-double-benefit declaration and portal route.'),
  ('TEC testing and certification reimbursement portal', 'https://tec.gov.in/tcrs', 'agency_portal', 'central', 'weekly', 1, true, 'Official Telecom Engineering Centre portal used for the reimbursement application handoff.'),
  ('Department of Telecommunications official portal', 'https://www.dot.gov.in/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official DoT portal for telecom policy, implementing-agency and scheme notices.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
