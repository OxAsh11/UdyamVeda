-- Official sources for the review-gated MoEFCC/CPCB compliance seed.
insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('CPCB official portal', 'https://cpcb.nic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official Central Pollution Control Board portal.'),
  ('MoEFCC Environmental Impact Assessment', 'https://moef.gov.in/index.php/environmental-impact-assessment-eia', 'ministry_portal', 'central', 'monthly', 1, true, 'Official EIA and environmental-clearance workflow.'),
  ('MoEFCC Citizen Charter', 'https://moef.gov.in/uploads/2024/05/iv-Citizen-Charter-MoEFCC.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official PARIVESH service boundary.'),
  ('PARIVESH environmental clearance portal', 'https://parivesh.nic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Official environmental-clearance application portal.'),
  ('CPCB rules and EPR resources', 'https://cpcb.nic.in/rules-7/', 'agency_portal', 'central', 'weekly', 1, true, 'Official CPCB rules and EPR resource index.'),
  ('CPCB plastic EPR SOP', 'https://cpcb.nic.in/uploads/plasticwaste/SOP_PWM_24062024.pdf', 'guideline', 'central', 'weekly', 1, true, 'Official plastic-packaging EPR registration SOP.'),
  ('CPCB plastic EPR portal', 'https://cpcbeprplastic.in/', 'agency_portal', 'central', 'weekly', 1, true, 'Centralized CPCB plastic EPR portal.'),
  ('CPCB e-waste EPR FAQ', 'https://cpcb.nic.in/uploads/Projects/E-Waste/FAQ_ewaste_23012024.pdf', 'faq', 'central', 'weekly', 1, true, 'Official e-waste EPR registration and target FAQ.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
