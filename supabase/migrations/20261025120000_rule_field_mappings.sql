-- MVP PRD Phase 0 (P0.3): connect the approved rule sets to the fact
-- dictionary without rewriting them. Every field an eligibility rule uses gets
-- one row (see src/lib/opportunities/fact-mapping.ts):
--   fact        reads a canonical fact (optionally through value_map)
--   derived     computed from canonical facts by a named derivation
--   bank_check  only the bank / DIC / department can confirm it; it never
--               decides a founder's result and is shown as a note

create table if not exists public.rule_field_mappings (
  legacy_field text primary key check (legacy_field ~ '^[a-z][a-z0-9_]*$'),
  treatment text not null check (treatment in ('fact', 'derived', 'bank_check')),
  fact_key text references public.fact_definitions(key),
  value_map jsonb check (value_map is null or jsonb_typeof(value_map) = 'object'),
  derive text check (derive is null or derive ~ '^[a-z][a-z0-9_]*$'),
  check_note_en text,
  created_at timestamptz not null default timezone('utc', now()),
  check (
    (treatment = 'fact' and fact_key is not null and derive is null)
    or (treatment = 'derived' and derive is not null and fact_key is null)
    or (treatment = 'bank_check' and nullif(trim(check_note_en), '') is not null and fact_key is null and derive is null)
  )
);

alter table public.rule_field_mappings enable row level security;

create policy "rule field mappings are public" on public.rule_field_mappings
  for select to anon, authenticated using (true);
create policy "reviewers manage rule field mappings" on public.rule_field_mappings for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
