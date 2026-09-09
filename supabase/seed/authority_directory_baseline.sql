-- IGOD authority baseline for the reviewer queue.
-- Authority URLs come from the versioned IGOD baseline, including separately
-- verified official parent-ministry portals where IGOD did not expose a
-- distinct department domain. These rows never imply relevance or publication.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, expected_item_count, notes)
values
  ('IGOD Union Government ministries directory', 'https://igod.gov.in/ug/E002/organizations', 'authority_directory', 'central', 'monthly', 1, true, 53, 'Versioned ministry baseline is seeded for review; refresh the official directory before assessment.'),
  ('IGOD Union Government departments directory', 'https://igod.gov.in/ug/E003/organizations', 'authority_directory', 'central', 'monthly', 1, true, 50, 'Versioned department baseline is seeded for review; refresh the official directory before assessment.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  expected_item_count = excluded.expected_item_count,
  notes = excluded.notes;

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, expected_item_count, notes)
values
  ('IGOD-linked Union authority portal', 'https://ayush.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://agriwelfare.gov.in/en/who', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mocf.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.civilaviation.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://coal.nic.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.moci.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.cooperation.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mca.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://culture.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mod.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mdoner.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://moes.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.education.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://meity.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://moef.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mea.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://finmin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://minfahd.gov.in', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mofpi.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mohfw.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://heavyindustries.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mha.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mohua.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mib.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://jalshakti.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://labour.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://lawmin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://msme.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mines.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://minorityaffairs.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mnre.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://panchayat.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mpa.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://persmin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://mopng.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://shipmin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://powermin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://indianrailways.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://morth.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.rural.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://most.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.msde.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mospi.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://steel.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://texmin.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://tourism.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://tribal.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://wcd.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://yas.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dpiit.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://darpg.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dare.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://agriwelfare.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dahd.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dbt.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://chemicals.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://commerce.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://doca.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://ddpmod.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://drdo.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.jalshakti-ddws.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dea.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://depwd.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.desw.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://doe.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://fert.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://financialservices.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dof.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dfpd.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dhr.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.mohfw-dohfw.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.dohe-education.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dipam.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.doj.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dolr.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://legalaffairs.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dmamod.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://rajbhasha.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.doppw.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dopt.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://pharma-dept.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.indiapost.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dpe.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dor.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.dord.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dsel.education.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dst.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.dsir.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://socialjustice.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://dbtyas-sports.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.dot.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('Verified Union authority portal', 'https://consumeraffairs.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official Department of Consumer Affairs portal verified during the 2026-09-07 authority URL review; authority relevance and opportunity coverage still require review.'),
  ('Verified Union authority portal', 'https://www.niti.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official NITI Aayog portal used for the Ministry of Planning authority row; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://www.jalshakti-dowr.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://youth.yas.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.'),
  ('IGOD-linked Union authority portal', 'https://legislative.gov.in/', 'authority_portal', 'central', 'weekly', 1, true, null, 'Official portal URL explicitly linked by the IGOD directory baseline; authority relevance and opportunity coverage still require review.')
on conflict (url) do nothing;

do $authority$
declare
  ministry_source_id uuid;
  department_source_id uuid;
begin
  select id into ministry_source_id
  from public.source_registry
  where url = 'https://igod.gov.in/ug/E002/organizations';

  select id into department_source_id
  from public.source_registry
  where url = 'https://igod.gov.in/ug/E003/organizations';

  insert into public.authority_coverage as coverage
    (source_registry_id, authority_level, authority_name, authority_url, business_relevance, assessment_status)
  select ministry_source_id, 'ministry', item->>'authorityName', item->>'authorityUrl', 'pending', 'not_assessed'
  from jsonb_array_elements($baseline${
  "ministry": [
    {
      "authorityName": "Ministry of AYUSH (MoA)",
      "authorityUrl": "https://ayush.gov.in/"
    },
    {
      "authorityName": "Ministry of Agriculture and Farmers Welfare (MoAFW)",
      "authorityUrl": "https://agriwelfare.gov.in/en/who"
    },
    {
      "authorityName": "Ministry of Chemicals and Fertilizers (MoCF)",
      "authorityUrl": "https://mocf.gov.in/"
    },
    {
      "authorityName": "Ministry of Civil Aviation (MoCA)",
      "authorityUrl": "https://www.civilaviation.gov.in/"
    },
    {
      "authorityName": "Ministry of Coal",
      "authorityUrl": "https://coal.nic.in/"
    },
    {
      "authorityName": "Ministry of Commerce and Industry (MoCI)",
      "authorityUrl": "https://www.moci.gov.in/"
    },
    {
      "authorityName": "Ministry of Communications (MoC)",
      "authorityUrl": "https://www.dot.gov.in/"
    },
    {
      "authorityName": "Ministry of Consumer Affairs, Food and Public Distribution (MoCAFP)",
      "authorityUrl": "https://consumeraffairs.gov.in/"
    },
    {
      "authorityName": "Ministry of Cooperation",
      "authorityUrl": "https://www.cooperation.gov.in/"
    },
    {
      "authorityName": "Ministry of Corporate Affairs (MCA)",
      "authorityUrl": "https://www.mca.gov.in/"
    },
    {
      "authorityName": "Ministry of Culture",
      "authorityUrl": "https://culture.gov.in/"
    },
    {
      "authorityName": "Ministry of Defence (MoD)",
      "authorityUrl": "https://www.mod.gov.in/"
    },
    {
      "authorityName": "Ministry of Development of North Eastern Region (MDONER)",
      "authorityUrl": "https://mdoner.gov.in/"
    },
    {
      "authorityName": "Ministry of Earth Sciences (MoES)",
      "authorityUrl": "https://moes.gov.in/"
    },
    {
      "authorityName": "Ministry of Education (MoE)",
      "authorityUrl": "https://www.education.gov.in/"
    },
    {
      "authorityName": "Ministry of Electronics and Information Technology (MeitY)",
      "authorityUrl": "https://meity.gov.in/"
    },
    {
      "authorityName": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
      "authorityUrl": "https://moef.gov.in/"
    },
    {
      "authorityName": "Ministry of External Affairs (MEA)",
      "authorityUrl": "https://www.mea.gov.in/"
    },
    {
      "authorityName": "Ministry of Finance (MoF)",
      "authorityUrl": "https://finmin.gov.in/"
    },
    {
      "authorityName": "Ministry of Fisheries, Animal Husbandry and Dairying (MoFAHD)",
      "authorityUrl": "https://minfahd.gov.in"
    },
    {
      "authorityName": "Ministry of Food Processing Industries (MoFPI)",
      "authorityUrl": "https://mofpi.gov.in/"
    },
    {
      "authorityName": "Ministry of Health and Family Welfare (MoHFW)",
      "authorityUrl": "https://mohfw.gov.in/"
    },
    {
      "authorityName": "Ministry of Heavy Industries (MoHI)",
      "authorityUrl": "https://heavyindustries.gov.in/"
    },
    {
      "authorityName": "Ministry of Home Affairs (MHA)",
      "authorityUrl": "https://mha.gov.in/"
    },
    {
      "authorityName": "Ministry of Housing and Urban Affairs (MoHUA)",
      "authorityUrl": "https://mohua.gov.in/"
    },
    {
      "authorityName": "Ministry of Information and Broadcasting (MIB)",
      "authorityUrl": "https://www.mib.gov.in/"
    },
    {
      "authorityName": "Ministry of Jal Shakti (MoJS)",
      "authorityUrl": "https://jalshakti.gov.in/"
    },
    {
      "authorityName": "Ministry of Labour and Employment (MoLE)",
      "authorityUrl": "https://labour.gov.in/"
    },
    {
      "authorityName": "Ministry of Law and Justice (MoLJ)",
      "authorityUrl": "https://lawmin.gov.in/"
    },
    {
      "authorityName": "Ministry of Micro, Small & Medium Enterprises (MSME)",
      "authorityUrl": "https://msme.gov.in/"
    },
    {
      "authorityName": "Ministry of Mines (MoM)",
      "authorityUrl": "https://mines.gov.in/"
    },
    {
      "authorityName": "Ministry of Minority Affairs (MoMA)",
      "authorityUrl": "https://minorityaffairs.gov.in/"
    },
    {
      "authorityName": "Ministry of New and Renewable Energy (MNRE)",
      "authorityUrl": "https://mnre.gov.in/"
    },
    {
      "authorityName": "Ministry of Panchayati Raj (MoPR)",
      "authorityUrl": "https://panchayat.gov.in/"
    },
    {
      "authorityName": "Ministry of Parliamentary Affairs (MPA)",
      "authorityUrl": "https://www.mpa.gov.in/"
    },
    {
      "authorityName": "Ministry of Personnel, Public Grievances and Pensions (MoPPGP)",
      "authorityUrl": "https://persmin.gov.in/"
    },
    {
      "authorityName": "Ministry of Petroleum and Natural Gas (MoPNG)",
      "authorityUrl": "https://mopng.gov.in/"
    },
    {
      "authorityName": "Ministry of Planning (MoP)",
      "authorityUrl": "https://www.niti.gov.in/"
    },
    {
      "authorityName": "Ministry of Ports, Shipping and Waterways (MoPSW)",
      "authorityUrl": "https://shipmin.gov.in/"
    },
    {
      "authorityName": "Ministry of Power",
      "authorityUrl": "https://powermin.gov.in/"
    },
    {
      "authorityName": "Ministry of Railways (MoR)",
      "authorityUrl": "https://indianrailways.gov.in/"
    },
    {
      "authorityName": "Ministry of Road Transport and Highways (MoRTH)",
      "authorityUrl": "https://morth.gov.in/"
    },
    {
      "authorityName": "Ministry of Rural Development (MoRD)",
      "authorityUrl": "https://www.rural.gov.in/"
    },
    {
      "authorityName": "Ministry of Science and Technology (MST)",
      "authorityUrl": "https://most.gov.in/"
    },
    {
      "authorityName": "Ministry of Skill Development and Entrepreneurship (MSDE)",
      "authorityUrl": "https://www.msde.gov.in/"
    },
    {
      "authorityName": "Ministry of Social Justice and Empowerment (MoSJE)",
      "authorityUrl": "https://socialjustice.gov.in/"
    },
    {
      "authorityName": "Ministry of Statistics and Programme Implementation (MoSPI)",
      "authorityUrl": "https://www.mospi.gov.in/"
    },
    {
      "authorityName": "Ministry of Steel (MoS)",
      "authorityUrl": "https://steel.gov.in/"
    },
    {
      "authorityName": "Ministry of Textiles (MoT)",
      "authorityUrl": "https://texmin.gov.in/"
    },
    {
      "authorityName": "Ministry of Tourism",
      "authorityUrl": "https://tourism.gov.in/"
    },
    {
      "authorityName": "Ministry of Tribal Affairs (MoTA)",
      "authorityUrl": "https://tribal.gov.in/"
    },
    {
      "authorityName": "Ministry of Women and Child Development (MoWCD)",
      "authorityUrl": "https://wcd.gov.in/"
    },
    {
      "authorityName": "Ministry of Youth Affairs and Sports (MoYAS)",
      "authorityUrl": "https://yas.gov.in/"
    }
  ],
  "department": [
    {
      "authorityName": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "authorityUrl": "https://dpiit.gov.in/"
    },
    {
      "authorityName": "Department of Administrative Reforms and Public Grievances (DARPG)",
      "authorityUrl": "https://darpg.gov.in/"
    },
    {
      "authorityName": "Department of Agricultural Research and Education (DARE)",
      "authorityUrl": "https://dare.gov.in/"
    },
    {
      "authorityName": "Department of Agriculture and Farmers Welfare (DoAFW)",
      "authorityUrl": "https://agriwelfare.gov.in/"
    },
    {
      "authorityName": "Department of Animal Husbandry and Dairying (DoAHD)",
      "authorityUrl": "https://dahd.gov.in/"
    },
    {
      "authorityName": "Department of Biotechnology (DBT)",
      "authorityUrl": "https://dbt.gov.in/"
    },
    {
      "authorityName": "Department of Border Management (DoBM)",
      "authorityUrl": "https://mha.gov.in/"
    },
    {
      "authorityName": "Department of Capital Development (DCD)",
      "authorityUrl": "https://mohua.gov.in/"
    },
    {
      "authorityName": "Department of Chemicals and Petro-Chemicals (DoCP)",
      "authorityUrl": "https://chemicals.gov.in/"
    },
    {
      "authorityName": "Department of Commerce (DoC)",
      "authorityUrl": "https://commerce.gov.in/"
    },
    {
      "authorityName": "Department of Consumer Affairs (DoCA)",
      "authorityUrl": "https://doca.gov.in/"
    },
    {
      "authorityName": "Department of Defence (DoD)",
      "authorityUrl": "https://www.mod.gov.in/"
    },
    {
      "authorityName": "Department of Defence Production (DDP)",
      "authorityUrl": "https://ddpmod.gov.in/"
    },
    {
      "authorityName": "Department of Defence Research and Development (DRDO)",
      "authorityUrl": "https://drdo.gov.in/"
    },
    {
      "authorityName": "Department of Drinking Water and Sanitation (DDWS)",
      "authorityUrl": "https://www.jalshakti-ddws.gov.in/"
    },
    {
      "authorityName": "Department of Economic Affairs (DEA)",
      "authorityUrl": "https://dea.gov.in/"
    },
    {
      "authorityName": "Department of Empowerment of Persons with Disabilities (DEPWD)",
      "authorityUrl": "https://depwd.gov.in/"
    },
    {
      "authorityName": "Department of Ex-Servicemen Welfare (DESW)",
      "authorityUrl": "https://www.desw.gov.in/"
    },
    {
      "authorityName": "Department of Expenditure (DoE)",
      "authorityUrl": "https://doe.gov.in/"
    },
    {
      "authorityName": "Department of Fertilizers (DoFz)",
      "authorityUrl": "https://fert.gov.in/"
    },
    {
      "authorityName": "Department of Financial Services (DoFS)",
      "authorityUrl": "https://financialservices.gov.in/"
    },
    {
      "authorityName": "Department of Fisheries (DoF)",
      "authorityUrl": "https://dof.gov.in/"
    },
    {
      "authorityName": "Department of Food and Public Distribution (DFPD)",
      "authorityUrl": "https://dfpd.gov.in/"
    },
    {
      "authorityName": "Department of Health Research (DHR)",
      "authorityUrl": "https://dhr.gov.in/"
    },
    {
      "authorityName": "Department of Health and Family Welfare (DoHFW)",
      "authorityUrl": "https://www.mohfw-dohfw.gov.in/"
    },
    {
      "authorityName": "Department of Higher Education (DoHE)",
      "authorityUrl": "https://www.dohe-education.gov.in/"
    },
    {
      "authorityName": "Department of Home (DoH)",
      "authorityUrl": "https://mha.gov.in/"
    },
    {
      "authorityName": "Department of Investment and Public Asset Management (DIPAM)",
      "authorityUrl": "https://dipam.gov.in/"
    },
    {
      "authorityName": "Department of Justice (DoJ)",
      "authorityUrl": "https://www.doj.gov.in/"
    },
    {
      "authorityName": "Department of Land Resources (DLR)",
      "authorityUrl": "https://dolr.gov.in/"
    },
    {
      "authorityName": "Department of Legal Affairs (DoLA)",
      "authorityUrl": "https://legalaffairs.gov.in/"
    },
    {
      "authorityName": "Department of Military Affairs (DMA)",
      "authorityUrl": "https://dmamod.gov.in/"
    },
    {
      "authorityName": "Department of Official Language (DoOL)",
      "authorityUrl": "https://rajbhasha.gov.in/"
    },
    {
      "authorityName": "Department of Pension & Pensioner's Welfare (DoPPW)",
      "authorityUrl": "https://www.doppw.gov.in/"
    },
    {
      "authorityName": "Department of Personnel and Training (DoPT)",
      "authorityUrl": "https://dopt.gov.in/"
    },
    {
      "authorityName": "Department of Pharmaceuticals (DoPs)",
      "authorityUrl": "https://pharma-dept.gov.in/"
    },
    {
      "authorityName": "Department of Posts (DoP)",
      "authorityUrl": "https://www.indiapost.gov.in/"
    },
    {
      "authorityName": "Department of Public Enterprises (DPE)",
      "authorityUrl": "https://dpe.gov.in/"
    },
    {
      "authorityName": "Department of Revenue (DoR)",
      "authorityUrl": "https://dor.gov.in/"
    },
    {
      "authorityName": "Department of Rural Development (DoRD)",
      "authorityUrl": "https://www.dord.gov.in/"
    },
    {
      "authorityName": "Department of School Education and Literacy (DSEL)",
      "authorityUrl": "https://dsel.education.gov.in/"
    },
    {
      "authorityName": "Department of Science and Technology (DST)",
      "authorityUrl": "https://dst.gov.in/"
    },
    {
      "authorityName": "Department of Scientific and Industrial Research (DSIR)",
      "authorityUrl": "https://www.dsir.gov.in/"
    },
    {
      "authorityName": "Department of Social Justice and Empowerment (DoSJE)",
      "authorityUrl": "https://socialjustice.gov.in/"
    },
    {
      "authorityName": "Department of Sports (DoS)",
      "authorityUrl": "https://dbtyas-sports.gov.in/"
    },
    {
      "authorityName": "Department of Telecommunications (DoT)",
      "authorityUrl": "https://www.dot.gov.in/"
    },
    {
      "authorityName": "Department of Urban Development (DUD)",
      "authorityUrl": "https://mohua.gov.in/"
    },
    {
      "authorityName": "Department of Water Resources, River Development and Ganga Rejuvenation (DoWRGR)",
      "authorityUrl": "https://www.jalshakti-dowr.gov.in/"
    },
    {
      "authorityName": "Department of Youth Affairs (DoYA)",
      "authorityUrl": "https://youth.yas.gov.in/"
    },
    {
      "authorityName": "Legislative Department (LD)",
      "authorityUrl": "https://legislative.gov.in/"
    }
  ]
}$baseline$::jsonb -> 'ministry') as item
  on conflict (source_registry_id, authority_level, authority_name) do update
    set authority_url = coalesce(excluded.authority_url, coverage.authority_url),
        updated_at = timezone('utc', now());

  insert into public.authority_coverage as coverage
    (source_registry_id, authority_level, authority_name, authority_url, business_relevance, assessment_status)
  select department_source_id, 'department', item->>'authorityName', item->>'authorityUrl', 'pending', 'not_assessed'
  from jsonb_array_elements($baseline${
  "ministry": [
    {
      "authorityName": "Ministry of AYUSH (MoA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Agriculture and Farmers Welfare (MoAFW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Chemicals and Fertilizers (MoCF)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Civil Aviation (MoCA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Coal",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Commerce and Industry (MoCI)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Communications (MoC)",
      "authorityUrl": "https://www.dot.gov.in/"
    },
    {
      "authorityName": "Ministry of Consumer Affairs, Food and Public Distribution (MoCAFP)",
      "authorityUrl": "https://consumeraffairs.gov.in/"
    },
    {
      "authorityName": "Ministry of Cooperation",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Corporate Affairs (MCA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Culture",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Defence (MoD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Development of North Eastern Region (MDONER)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Earth Sciences (MoES)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Education (MoE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Electronics and Information Technology (MeitY)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of External Affairs (MEA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Finance (MoF)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Fisheries, Animal Husbandry and Dairying (MoFAHD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Food Processing Industries (MoFPI)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Health and Family Welfare (MoHFW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Heavy Industries (MoHI)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Home Affairs (MHA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Housing and Urban Affairs (MoHUA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Information and Broadcasting (MIB)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Jal Shakti (MoJS)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Labour and Employment (MoLE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Law and Justice (MoLJ)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Micro, Small & Medium Enterprises (MSME)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Mines (MoM)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Minority Affairs (MoMA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of New and Renewable Energy (MNRE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Panchayati Raj (MoPR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Parliamentary Affairs (MPA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Personnel, Public Grievances and Pensions (MoPPGP)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Petroleum and Natural Gas (MoPNG)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Planning (MoP)",
      "authorityUrl": "https://www.niti.gov.in/"
    },
    {
      "authorityName": "Ministry of Ports, Shipping and Waterways (MoPSW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Power",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Railways (MoR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Road Transport and Highways (MoRTH)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Rural Development (MoRD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Science and Technology (MST)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Skill Development and Entrepreneurship (MSDE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Social Justice and Empowerment (MoSJE)",
      "authorityUrl": "https://socialjustice.gov.in/"
    },
    {
      "authorityName": "Ministry of Statistics and Programme Implementation (MoSPI)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Steel (MoS)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Textiles (MoT)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Tourism",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Tribal Affairs (MoTA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Women and Child Development (MoWCD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Ministry of Youth Affairs and Sports (MoYAS)",
      "authorityUrl": null
    }
  ],
  "department": [
    {
      "authorityName": "Department for Promotion of Industry and Internal Trade (DPIIT)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Administrative Reforms and Public Grievances (DARPG)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Agricultural Research and Education (DARE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Agriculture and Farmers Welfare (DoAFW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Animal Husbandry and Dairying (DoAHD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Biotechnology (DBT)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Border Management (DoBM)",
      "authorityUrl": "https://mha.gov.in/"
    },
    {
      "authorityName": "Department of Capital Development (DCD)",
      "authorityUrl": "https://mohua.gov.in/"
    },
    {
      "authorityName": "Department of Chemicals and Petro-Chemicals (DoCP)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Commerce (DoC)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Consumer Affairs (DoCA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Defence (DoD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Defence Production (DDP)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Defence Research and Development (DRDO)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Drinking Water and Sanitation (DDWS)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Economic Affairs (DEA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Empowerment of Persons with Disabilities (DEPWD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Ex-Servicemen Welfare (DESW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Expenditure (DoE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Fertilizers (DoFz)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Financial Services (DoFS)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Fisheries (DoF)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Food and Public Distribution (DFPD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Health Research (DHR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Health and Family Welfare (DoHFW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Higher Education (DoHE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Home (DoH)",
      "authorityUrl": "https://mha.gov.in/"
    },
    {
      "authorityName": "Department of Investment and Public Asset Management (DIPAM)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Justice (DoJ)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Land Resources (DLR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Legal Affairs (DoLA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Military Affairs (DMA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Official Language (DoOL)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Pension & Pensioner's Welfare (DoPPW)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Personnel and Training (DoPT)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Pharmaceuticals (DoPs)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Posts (DoP)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Public Enterprises (DPE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Revenue (DoR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Rural Development (DoRD)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of School Education and Literacy (DSEL)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Science and Technology (DST)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Scientific and Industrial Research (DSIR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Social Justice and Empowerment (DoSJE)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Sports (DoS)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Telecommunications (DoT)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Urban Development (DUD)",
      "authorityUrl": "https://mohua.gov.in/"
    },
    {
      "authorityName": "Department of Water Resources, River Development and Ganga Rejuvenation (DoWRGR)",
      "authorityUrl": null
    },
    {
      "authorityName": "Department of Youth Affairs (DoYA)",
      "authorityUrl": null
    },
    {
      "authorityName": "Legislative Department (LD)",
      "authorityUrl": null
    }
  ]
}$baseline$::jsonb -> 'department') as item
  on conflict (source_registry_id, authority_level, authority_name) do update
    set authority_url = coalesce(excluded.authority_url, coverage.authority_url),
        updated_at = timezone('utc', now());
end
$authority$;
