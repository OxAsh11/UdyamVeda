-- Persist the editorial checklist that must be completed before publication.
-- This turns a free-form reviewer note into auditable source-to-record evidence.

create table if not exists public.catalog_review_checks (
  id uuid primary key default gen_random_uuid(),
  review_task_id uuid not null references public.review_tasks(id) on delete cascade,
  check_type text not null check (check_type in ('source', 'eligibility', 'benefit', 'application', 'window', 'fine_print', 'amendment')),
  status text not null default 'pending' check (status in ('pending', 'passed', 'failed', 'not_applicable')),
  evidence jsonb not null default '{}'::jsonb,
  reviewer_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (review_task_id, check_type)
);

alter table public.catalog_review_checks enable row level security;

create policy "reviewers can read catalog review checks"
  on public.catalog_review_checks for select to authenticated
  using (public.is_catalog_reviewer(auth.uid()));

create policy "reviewers can create catalog review checks"
  on public.catalog_review_checks for insert to authenticated
  with check (
    public.is_catalog_reviewer(auth.uid())
    and (reviewed_by is null or reviewed_by = auth.uid())
  );

create policy "reviewers can update catalog review checks"
  on public.catalog_review_checks for update to authenticated
  using (public.is_catalog_reviewer(auth.uid()))
  with check (
    public.is_catalog_reviewer(auth.uid())
    and (reviewed_by is null or reviewed_by = auth.uid())
  );

insert into public.catalog_review_checks (review_task_id, check_type)
select review_task.id, check_type.value
from public.review_tasks review_task
cross join lateral unnest(array['source', 'eligibility', 'benefit', 'application', 'window', 'fine_print', 'amendment']::text[]) as check_type(value)
where review_task.task_type = 'publish'
  and review_task.opportunity_version_id is not null
on conflict (review_task_id, check_type) do nothing;

create or replace function public.seed_catalog_review_checks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.task_type = 'publish' and new.opportunity_version_id is not null then
    insert into public.catalog_review_checks (review_task_id, check_type)
    select new.id, check_type.value
    from unnest(array['source', 'eligibility', 'benefit', 'application', 'window', 'fine_print', 'amendment']::text[]) as check_type(value)
    on conflict (review_task_id, check_type) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists review_tasks_seed_catalog_review_checks on public.review_tasks;
create trigger review_tasks_seed_catalog_review_checks
after insert on public.review_tasks
for each row execute function public.seed_catalog_review_checks();
