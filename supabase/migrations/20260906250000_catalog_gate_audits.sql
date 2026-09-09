-- Evidence for the manual factual-accuracy portion of the Central beta gate.

create table if not exists public.catalog_audits (
  id uuid primary key default gen_random_uuid(),
  audit_type text not null check (audit_type in ('factual_accuracy', 'source_sampling')),
  sample_size integer not null check (sample_size > 0),
  accurate_count integer not null check (accurate_count >= 0 and accurate_count <= sample_size),
  accuracy_percent numeric(5, 2) generated always as ((accurate_count::numeric / sample_size::numeric) * 100) stored,
  notes text,
  audited_by uuid not null references auth.users(id),
  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists catalog_audits_type_idx
  on public.catalog_audits(audit_type, completed_at desc);

alter table public.catalog_audits enable row level security;

create policy "reviewers can manage catalog audits"
  on public.catalog_audits for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())) and audited_by = (select auth.uid()));
