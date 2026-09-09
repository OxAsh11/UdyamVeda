-- Current evidence registry for the two distinct PRIP components.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('Department of Pharmaceuticals PRIP revised scheme guidelines', 'https://prip.pharma-dept.gov.in/resources/21.%20Guidelines.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official 1 October 2025 PRIP guidelines covering Components A and B, priority areas, assistance, co-funding and milestones.'),
  ('PRIP legacy guideline URL retained for historical step references', 'https://pharma-dept.gov.in/sites/default/files/Scheme_Guidelines_Final.pdf', 'historical_guideline', 'central', 'monthly', 1, true, 'Historical URL retained only for backward-compatible step references; current review must use the PRIP portal guideline PDF.'),
  ('Department of Pharmaceuticals PRIP scheme page', 'https://pharma-dept.gov.in/schemes/scheme-promotion-research-and-innovation-pharma-medtech-sector-prip', 'scheme_page', 'central', 'weekly', 1, true, 'Official scheme page with Gazette and guidelines links.'),
  ('Official PRIP application portal', 'https://prip.pharma-dept.gov.in/', 'application_portal', 'central', 'daily', 1, true, 'Official PRIP portal: current call state, application support toolkit and applicant route.'),
  ('Official PRIP applicant login route', 'https://prip.pharma-dept.gov.in/auth/login', 'application_portal', 'central', 'daily', 1, true, 'Official PRIP applicant login route referenced by the current application steps; call availability remains subject to the portal state.'),
  ('Official PRIP FAQ', 'https://prip.pharma-dept.gov.in/resources/12.%20FAQ.pdf', 'faq', 'central', 'weekly', 1, true, 'Official FAQ with current categories, TRL, assistance, co-funding and financial-closure conditions.'),
  ('Department of Pharmaceuticals PRIP 2025 notification', 'https://pharma-dept.gov.in/sites/default/files/Gazette%20Notification%20-%20Dated%2001.10.2025.pdf', 'gazette_notification', 'central', 'monthly', 1, true, 'Official 1 October 2025 amendment/notification of the PRIP scheme.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
