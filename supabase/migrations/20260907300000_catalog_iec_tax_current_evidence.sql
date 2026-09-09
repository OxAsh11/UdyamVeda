-- Current-source reconciliation for IEC and PAN/TAN readiness.
-- These records prepare an applicant-controlled official handoff; they do not
-- decide trade-law exemptions or submit tax identity applications.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('DGFT Handbook of Procedures Chapter 2', 'https://content.dgft.gov.in/Website/dgftprod/38d98f53-86e0-4cf7-98db-834864a08524/HBP2023_Chapter02.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official DGFT material for IEC exemptions, incomplete applications and related procedures; amendments require review.'),
  ('DGFT Appendix 2K application fee schedule', 'https://content.dgft.gov.in/Website/dgftprod/85f0e5a2-14d7-4e66-b9c4-4eba7bfd1810/Appendix-2k.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official fee schedule identifying the IEC application fee and annual IEC update period.'),
  ('Income Tax Act 2025 transition FAQs', 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/objective-and-scope-new-act', 'ministry_portal', 'central', 'weekly', 1, true, 'Official transition guidance for continuity of PAN and TAN frameworks.'),
  ('Income Tax forms 2026 PAN/TAN transition FAQ', 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-forms', 'ministry_portal', 'central', 'weekly', 1, true, 'Official guidance for fresh PAN applications and validity of existing PAN/TAN numbers from 1 April 2026.')
on conflict (url) do update set
  name = excluded.name,
  source_kind = excluded.source_kind,
  coverage_level = excluded.coverage_level,
  cadence = excluded.cadence,
  authority_rank = excluded.authority_rank,
  verification_required = excluded.verification_required,
  notes = excluded.notes;

do $$
declare
  iec_version_id uuid;
  tax_version_id uuid;
begin
  select current_version_id into iec_version_id
  from public.opportunities
  where slug = 'importer-exporter-code-iec';

  select current_version_id into tax_version_id
  from public.opportunities
  where slug = 'pan-tan-allocation-readiness';

  if iec_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'DGFT Handbook of Procedures Chapter 2 and Appendix 2K confirm the IEC exemption boundary, annual April-June update period and INR 500 application fee; product-specific permissions remain separate.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = iec_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select iec_version_id, source_url, 'guideline', source_title, source_anchor, now(), false
    from (values
      ('https://content.dgft.gov.in/Website/dgftprod/38d98f53-86e0-4cf7-98db-834864a08524/HBP2023_Chapter02.pdf', 'DGFT Handbook of Procedures Chapter 2', 'IEC exemptions; incomplete applications; application procedure'),
      ('https://content.dgft.gov.in/Website/dgftprod/85f0e5a2-14d7-4e66-b9c4-4eba7bfd1810/Appendix-2k.pdf', 'DGFT Appendix 2K application fee schedule', 'IEC application fee INR 500; annual updation during April-June')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = iec_version_id and source_url = evidence.source_url
    );
  end if;

  if tax_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'Income Tax Department transition guidance confirms continuity of PAN/TAN, validity of existing numbers and new forms for fresh applications from 1 April 2026.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = tax_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select tax_version_id, source_url, 'ministry', source_title, source_anchor, now(), false
    from (values
      ('https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/objective-and-scope-new-act', 'Income Tax Act 2025 transition FAQs', 'Continuity of PAN and TAN administrative frameworks'),
      ('https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/income-tax-forms', 'Income Tax forms 2026 PAN/TAN transition FAQ', 'Fresh PAN applications from 1 April 2026; existing PAN/TAN validity; pending applications')
    ) as evidence(source_url, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = tax_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
