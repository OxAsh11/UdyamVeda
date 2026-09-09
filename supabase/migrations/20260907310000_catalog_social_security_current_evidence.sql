-- Current-source reconciliation for EPFO and ESIC employer readiness.
-- Thresholds are intentionally represented as evidence and caveats, not as a
-- universal automatic eligibility decision.

insert into public.source_registry
  (name, url, source_kind, coverage_level, cadence, authority_rank, verification_required, notes)
values
  ('EPFO current FAQ and employer coverage guidance', 'https://www.epfindia.gov.in/site_en/FAQ.php', 'ministry_portal', 'central', 'weekly', 1, true, 'Official EPFO FAQ for voluntary coverage and employer/member boundary; current establishment applicability still requires review.'),
  ('EPFO current employer portal', 'https://unifiedportal-emp.epfindia.gov.in/epfo/', 'ministry_portal', 'central', 'weekly', 1, true, 'Official employer portal and current common EPFO/ESIC registration handoff.'),
  ('ESIC current coverage and wage guidance', 'https://www.esic.gov.in/attachments/publicationfile/4bba80675aa61f0e8c9f7f57c155b185.pdf', 'guideline', 'central', 'monthly', 1, true, 'Official ESIC publication describing covered establishments, area conditions and wage ceiling; amendments require review.')
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
  epfo_version_id uuid;
  esic_version_id uuid;
begin
  select current_version_id into epfo_version_id
  from public.opportunities
  where slug = 'epfo-establishment-registration';

  select current_version_id into esic_version_id
  from public.opportunities
  where slug = 'esic-employer-registration';

  if epfo_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'Current EPFO employer guidance confirms online employer/common EPFO-ESIC registration, a free registration route and no requirement for a bank account or company seal; official guidance refers to 20 or more employees for specified establishment types and voluntary coverage for other establishments.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = epfo_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select epfo_version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://www.epfindia.gov.in/site_en/FAQ.php', 'ministry', 'EPFO FAQ', 'Voluntary coverage where establishment is not employing 20 persons; employer information boundary'),
      ('https://unifiedportal-emp.epfindia.gov.in/epfo/', 'ministry', 'EPFO employer unified portal', 'Common Registration Under EPFO & ESIC; current employer registration portal')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = epfo_version_id and source_url = evidence.source_url
    );
  end if;

  if esic_version_id is not null then
    update public.opportunity_versions
    set
      fine_print = fine_print || jsonb_build_object(
        'current_source_reconciliation', 'Current ESIC coverage guidance describes 10-or-more-employee coverage for factories and specified establishments in applicable/notified areas, a monthly wage ceiling of INR 21,000 (INR 25,000 for persons with disability), and category/state exceptions that must be checked.',
        'current_source_checked_at', '2026-09-07'
      ),
      last_verified_at = now(),
      review_status = 'in_review'
    where id = esic_version_id;

    insert into public.opportunity_sources
      (opportunity_version_id, source_url, source_kind, source_title, source_anchor, fetched_at, is_primary)
    select esic_version_id, source_url, source_kind, source_title, source_anchor, now(), false
    from (values
      ('https://www.esic.gov.in/attachments/publicationfile/4bba80675aa61f0e8c9f7f57c155b185.pdf', 'guideline', 'ESIC current coverage and wage guidance', 'Factories and specified establishments; 10 or more coverable employees; wage ceiling and area exceptions')
    ) as evidence(source_url, source_kind, source_title, source_anchor)
    where not exists (
      select 1 from public.opportunity_sources
      where opportunity_version_id = esic_version_id and source_url = evidence.source_url
    );
  end if;
end $$;
