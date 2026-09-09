-- Current PM E-DRIVE source pack.
-- The EV public-charging route is institutional: ordinary founders and private
-- CPOs must not be represented as direct subsidy beneficiaries.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('PM E-DRIVE official portal', 'https://pmedrive.heavyindustries.gov.in/', 'implementing_portal', 'central', 'weekly', 1, true, 'Current Ministry of Heavy Industries portal for PM E-DRIVE policy, notifications, guidelines and operational routes.'),
  ('PM E-DRIVE scheme guidelines index', 'https://pmedrive.heavyindustries.gov.in/policy_procedure', 'guideline_index', 'central', 'weekly', 1, true, 'Current operational-guideline index; dates and amendments must be reconciled before publication.'),
  ('PM E-DRIVE scheme notifications index', 'https://pmedrive.heavyindustries.gov.in/policy_document', 'gazette_index', 'central', 'weekly', 1, true, 'Current notification index, including the 2025 extension and 2026 component amendments.'),
  ('PM E-DRIVE EV PCS operational guidelines', 'https://pmedrive.heavyindustries.gov.in/docs/policy_document/EV%20PCS%20operational%20guidelines_F.pdf', 'guideline', 'central', 'weekly', 1, true, 'Operational guidelines for EV public charging station proposals, eligible entities, subsidy components and commissioning.'),
  ('PM E-DRIVE EV PCS FAQ', 'https://pmedrive.heavyindustries.gov.in/docs/policy_document/FAQs-Operational%20Guidelines%20for%20EV%20PCS%20under%20PM%20E-DRIVE.pdf', 'faq', 'central', 'weekly', 1, true, 'Current FAQ for location categories, benchmark costs, nodal-agency routing, CPO selection and data/uptime obligations.'),
  ('PM E-DRIVE extension Gazette notification', 'https://pmedrive.heavyindustries.gov.in/docs/policy_document/Extension%20of%20Scheme%20till%2031%2003%202028%20dated%2007%2008%202025.pdf', 'gazette', 'central', 'monthly', 1, true, 'Gazette extension to 31 March 2028 and fund-limited boundary; component-specific terminal dates require amendment reconciliation.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
