-- Complete the named lifecycle data model without changing the existing UI tables.

-- The product supports multiple businesses per account. The original foundation
-- index accidentally enforced one business per owner.
drop index if exists public.businesses_owner_unique_idx;
create index if not exists businesses_owner_idx_v2 on public.businesses(owner_id, active);

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  language_code text not null,
  canonical_content_hash text not null,
  translated_content jsonb not null default '{}'::jsonb,
  machine_generated boolean not null default true,
  status text not null default 'cached' check (status in ('cached', 'needs_review', 'invalidated')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (opportunity_version_id, language_code)
);

create table if not exists public.recommendation_runs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  engine_version text not null,
  business_facts_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.recommendation_results (
  id uuid primary key default gen_random_uuid(),
  recommendation_run_id uuid not null references public.recommendation_runs(id) on delete cascade,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete restrict,
  status text not null check (status in ('eligible', 'likely', 'possible', 'needs_information', 'not_eligible')),
  rank integer not null,
  match_score numeric(5, 4),
  reason jsonb not null default '{}'::jsonb,
  missing_facts jsonb not null default '[]'::jsonb,
  blocking_conditions jsonb not null default '[]'::jsonb,
  benefit_to_effort jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  unique (recommendation_run_id, opportunity_id)
);

create table if not exists public.application_status_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  actor_id uuid references auth.users(id),
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.application_document_links (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  business_document_id uuid not null references public.business_documents(id) on delete cascade,
  opportunity_requirement_id uuid references public.opportunity_requirements(id) on delete set null,
  status text not null default 'linked' check (status in ('linked', 'accepted', 'rejected')),
  reviewer_note text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (application_id, business_document_id, opportunity_requirement_id)
);

create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  notification_type text not null,
  channel text not null check (channel in ('in_app', 'email')),
  enabled boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, business_id, notification_type, channel)
);

create table if not exists public.concierge_requests (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  request_type text not null,
  status text not null default 'submitted' check (status in ('submitted', 'triaged', 'assigned', 'in_progress', 'completed', 'cancelled')),
  consent_given boolean not null default false,
  details jsonb not null default '{}'::jsonb,
  assigned_to uuid references auth.users(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_taxonomies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_taxonomy_terms (
  id uuid primary key default gen_random_uuid(),
  taxonomy_id uuid not null references public.catalog_taxonomies(id) on delete cascade,
  slug text not null,
  label text not null,
  parent_term_id uuid references public.catalog_taxonomy_terms(id) on delete set null,
  active boolean not null default true,
  unique (taxonomy_id, slug)
);

create table if not exists public.opportunity_taxonomy_terms (
  opportunity_version_id uuid not null references public.opportunity_versions(id) on delete cascade,
  taxonomy_term_id uuid not null references public.catalog_taxonomy_terms(id) on delete cascade,
  primary key (opportunity_version_id, taxonomy_term_id)
);

create index if not exists recommendation_runs_business_idx on public.recommendation_runs(business_id, created_at desc);
create index if not exists recommendation_results_run_idx on public.recommendation_results(recommendation_run_id, rank);
create index if not exists application_status_events_application_idx on public.application_status_events(application_id, created_at desc);
create index if not exists application_document_links_application_idx on public.application_document_links(application_id);
create index if not exists concierge_requests_business_idx on public.concierge_requests(business_id, status, created_at desc);

drop trigger if exists content_translations_updated_at on public.content_translations;
create trigger content_translations_updated_at before update on public.content_translations for each row execute function public.set_updated_at();
drop trigger if exists notification_preferences_updated_at on public.notification_preferences;
create trigger notification_preferences_updated_at before update on public.notification_preferences for each row execute function public.set_updated_at();
drop trigger if exists concierge_requests_updated_at on public.concierge_requests;
create trigger concierge_requests_updated_at before update on public.concierge_requests for each row execute function public.set_updated_at();

create or replace function public.invalidate_opportunity_translations()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.content_hash is distinct from old.content_hash then
    update public.content_translations
    set status = 'invalidated', updated_at = timezone('utc', now())
    where opportunity_version_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists opportunity_versions_translation_invalidation on public.opportunity_versions;
create trigger opportunity_versions_translation_invalidation
  after update of content_hash on public.opportunity_versions
  for each row execute function public.invalidate_opportunity_translations();

alter table public.content_translations enable row level security;
alter table public.recommendation_runs enable row level security;
alter table public.recommendation_results enable row level security;
alter table public.application_status_events enable row level security;
alter table public.application_document_links enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.concierge_requests enable row level security;
alter table public.catalog_taxonomies enable row level security;
alter table public.catalog_taxonomy_terms enable row level security;
alter table public.opportunity_taxonomy_terms enable row level security;

create policy "members can view translations for published opportunities" on public.content_translations for select to anon, authenticated using (exists (select 1 from public.opportunity_versions v where v.id = opportunity_version_id and v.review_status = 'approved'));
create policy "members can manage recommendation runs" on public.recommendation_runs for all to authenticated using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));
create policy "members can manage recommendation results" on public.recommendation_results for all to authenticated using (exists (select 1 from public.recommendation_runs r where r.id = recommendation_run_id and public.is_business_member(r.business_id))) with check (exists (select 1 from public.recommendation_runs r where r.id = recommendation_run_id and public.is_business_member(r.business_id)));
create policy "members can view application status events" on public.application_status_events for select to authenticated using (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id)));
create policy "members can create application status events" on public.application_status_events for insert to authenticated with check (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id)));
create policy "members can manage application document links" on public.application_document_links for all to authenticated using (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id))) with check (exists (select 1 from public.applications a where a.id = application_id and public.is_business_member(a.business_id)));
create policy "users can manage notification preferences" on public.notification_preferences for all to authenticated using (user_id = (select auth.uid()) and (business_id is null or public.is_business_member(business_id))) with check (user_id = (select auth.uid()) and (business_id is null or public.is_business_member(business_id)));
create policy "members can manage concierge requests" on public.concierge_requests for all to authenticated using (public.is_business_member(business_id)) with check (requester_id = (select auth.uid()) and public.is_business_member(business_id));
create policy "published taxonomies are public" on public.catalog_taxonomies for select to anon, authenticated using (true);
create policy "published taxonomy terms are public" on public.catalog_taxonomy_terms for select to anon, authenticated using (active = true);
create policy "published opportunity taxonomy links are public" on public.opportunity_taxonomy_terms for select to anon, authenticated using (exists (select 1 from public.opportunity_versions v where v.id = opportunity_version_id and v.review_status = 'approved'));
