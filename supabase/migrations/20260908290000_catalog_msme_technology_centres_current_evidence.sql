-- Current official MSME Technology Centre and Extension Centre evidence.
-- This is a service-access record for businesses and skill seekers, not a
-- direct applicant cash grant. Institutional establishment facts remain
-- separate from the services a business may access.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('MSME Technology Centres and Tool Rooms official service page', 'https://dcmsme.gov.in/CLCS_TUS_Scheme/Tool_Room_Tech_Institutions/Scheme_Guidelines.aspx', 'agency_portal', 'central', 'monthly', 1, true, 'Official DC MSME page describing the 18 Technology Centres, technical services, training and skilled-manpower support available to MSMEs.'),
  ('MSME Technology Centre Systems Programme', 'https://dcmsme.gov.in/CLCS_TUS_Scheme/TCSP/Scheme_Guidelines.aspx', 'guideline', 'central', 'monthly', 1, true, 'Official TCSP page describing the expansion and upgradation programme, its locations and institutional objectives; not a direct business grant.'),
  ('MSME new Technology Centres and Extension Centres scheme', 'https://dcmsme.gov.in/CLCS_TUS_Scheme/new-Technology-Centers/Scheme_Guidelines.aspx', 'guideline', 'central', 'monthly', 1, true, 'Official scheme page for 20 new Technology Centres and 100 Extension Centres, including technology, incubation, skilling and advisory support.'),
  ('MSME Technology Centre and Extension Centre status dashboard', 'https://dashboard.msme.gov.in/100_TC_EC.aspx', 'agency_portal', 'central', 'weekly', 1, true, 'Current official dashboard for approved and operational Extension Centre locations; metrics are service context and not an applicant entitlement.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;
