-- Prevent a trivial one-record audit from satisfying the Central beta gate.
-- Reviewers must record a meaningful sample and explain the sampling basis.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'catalog_audits_factual_accuracy_quality'
  ) then
    alter table public.catalog_audits
      add constraint catalog_audits_factual_accuracy_quality
      check (
        audit_type <> 'factual_accuracy'
        or (
          sample_size >= 20
          and nullif(trim(notes), '') is not null
        )
      );
  end if;
end $$;
