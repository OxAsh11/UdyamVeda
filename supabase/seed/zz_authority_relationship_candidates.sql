-- Generate review-pending relationship candidates from the authority metadata
-- declared by the structured opportunity seeds. These candidates are not
-- authoritative: the reviewer must confirm the organizational relationship
-- against an official source before using it for the Central coverage gate.

do $$
declare
  child record;
  parent record;
  department_name text;
  ministry_name text;
  normalized_department text;
  normalized_ministry text;
begin
  for child in
    select id, name, ministry, department, official_url
    from public.authorities
    where level = 'central'
      and official_url is not null
  loop
    department_name := nullif(trim(child.department), '');
    if department_name = 'DPIIT' then
      department_name := 'Department for Promotion of Industry and Internal Trade';
    end if;
    if department_name = 'DoP' then
      department_name := 'Department of Posts';
    end if;
    if department_name = 'Department of Defence Production / DRDO' then
      department_name := 'Department of Defence Research and Development';
    end if;

    normalized_department := lower(regexp_replace(regexp_replace(replace(coalesce(department_name, ''), '&', 'and'), '\s*\([^)]*\)', '', 'g'), '\s+', ' ', 'g'));
    if normalized_department <> '' then
      select coverage.*
      into parent
      from public.authority_coverage coverage
      where lower(regexp_replace(regexp_replace(replace(coverage.authority_name, '&', 'and'), '\s*\([^)]*\)', '', 'g'), '\s+', ' ', 'g')) = trim(normalized_department)
      limit 1;

      if parent.id is not null and parent.authority_name <> child.name then
        insert into public.authority_relationships
          (child_authority_id, parent_coverage_id, relationship_type, source_url, source_anchor, evidence_note, review_status)
        values
          (child.id, parent.id, 'declared_department_parent', child.official_url, 'Seed-declared department metadata; confirm against the official organizational source.', jsonb_build_object('child_authority', child.name, 'declared_department', child.department, 'parent_authority', parent.authority_name), 'pending')
        on conflict (child_authority_id, parent_coverage_id, relationship_type) do update set
          source_url = excluded.source_url,
          source_anchor = excluded.source_anchor,
          evidence_note = excluded.evidence_note,
          review_status = case when public.authority_relationships.review_status = 'confirmed' then public.authority_relationships.review_status else 'pending' end,
          updated_at = timezone('utc', now());
      end if;
    end if;

    for ministry_name in
      select trim(value)
      from regexp_split_to_table(coalesce(child.ministry, ''), '\s*/\s*') as value
      where trim(value) <> ''
    loop
      normalized_ministry := lower(regexp_replace(regexp_replace(replace(ministry_name, '&', 'and'), '\s*\([^)]*\)', '', 'g'), '\s+', ' ', 'g'));
      select coverage.*
      into parent
      from public.authority_coverage coverage
      where lower(regexp_replace(regexp_replace(replace(coverage.authority_name, '&', 'and'), '\s*\([^)]*\)', '', 'g'), '\s+', ' ', 'g')) = trim(normalized_ministry)
      limit 1;

      if parent.id is not null and parent.authority_name <> child.name then
        insert into public.authority_relationships
          (child_authority_id, parent_coverage_id, relationship_type, source_url, source_anchor, evidence_note, review_status)
        values
          (child.id, parent.id, 'declared_ministry_parent', child.official_url, 'Seed-declared ministry metadata; confirm against the official organizational source.', jsonb_build_object('child_authority', child.name, 'declared_ministry', ministry_name, 'parent_authority', parent.authority_name), 'pending')
        on conflict (child_authority_id, parent_coverage_id, relationship_type) do update set
          source_url = excluded.source_url,
          source_anchor = excluded.source_anchor,
          evidence_note = excluded.evidence_note,
          review_status = case when public.authority_relationships.review_status = 'confirmed' then public.authority_relationships.review_status else 'pending' end,
          updated_at = timezone('utc', now());
      end if;
    end loop;
  end loop;
end $$;
