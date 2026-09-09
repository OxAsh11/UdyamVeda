-- Keep the implementing-authority to IGOD-parent relationship explicit.
-- Seed metadata creates pending candidates only; it never confirms a
-- relationship or makes an opportunity publishable.

create table if not exists public.authority_relationships (
  id uuid primary key default gen_random_uuid(),
  child_authority_id uuid not null references public.authorities(id) on delete cascade,
  parent_coverage_id uuid not null references public.authority_coverage(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('declared_department_parent', 'declared_ministry_parent', 'implementing_agency', 'delegated_authority', 'source_only')),
  source_url text not null check (source_url ~* '^https://'),
  source_anchor text not null,
  evidence_note jsonb not null default '{}'::jsonb,
  review_status text not null default 'pending' check (review_status in ('pending', 'confirmed', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (child_authority_id, parent_coverage_id, relationship_type)
);

create index if not exists authority_relationships_parent_idx
  on public.authority_relationships(parent_coverage_id, review_status, relationship_type);

create index if not exists authority_relationships_child_idx
  on public.authority_relationships(child_authority_id, review_status);

alter table public.authority_relationships enable row level security;

create policy "reviewers can manage authority relationships"
  on public.authority_relationships for all
  to authenticated
  using (public.is_catalog_reviewer((select auth.uid())))
  with check (public.is_catalog_reviewer((select auth.uid())));

drop trigger if exists authority_relationships_updated_at on public.authority_relationships;
create trigger authority_relationships_updated_at
  before update on public.authority_relationships
  for each row execute function public.set_updated_at();
