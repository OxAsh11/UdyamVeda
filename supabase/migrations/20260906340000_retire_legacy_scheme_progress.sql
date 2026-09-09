-- The opportunity/application workspace now stores versioned application tasks.
-- Preserve any old progress rows, but remove the old public-facing table name from
-- the active data model before the legacy route is retired.
do $$
begin
  if to_regclass('public.scheme_progress') is not null
     and to_regclass('public.scheme_progress_retired') is null then
    alter table public.scheme_progress rename to scheme_progress_retired;
    execute 'revoke all on table public.scheme_progress_retired from anon, authenticated';
    execute 'comment on table public.scheme_progress_retired is ''Archived legacy scheme progress. Replaced by application_tasks.''';
  end if;
end
$$;
