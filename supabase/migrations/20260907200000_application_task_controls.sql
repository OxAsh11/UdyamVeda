-- Add accountable task ownership, dependency metadata and immutable status history
-- to the application workspace.

alter table public.application_tasks
  add column if not exists owner_id uuid references auth.users(id) on delete set null,
  add column if not exists depends_on_task_ids uuid[] not null default '{}';

create index if not exists application_tasks_owner_idx
  on public.application_tasks(owner_id, status, due_date);

create table if not exists public.application_task_status_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.application_tasks(id) on delete cascade,
  from_status text,
  to_status text not null check (to_status in ('todo', 'in_progress', 'blocked', 'done')),
  actor_id uuid references auth.users(id),
  note text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists application_task_status_events_task_idx
  on public.application_task_status_events(task_id, created_at desc);

alter table public.application_task_status_events enable row level security;

create policy "members can view application task status events"
  on public.application_task_status_events for select
  to authenticated
  using (exists (
    select 1
    from public.application_tasks task
    join public.applications application on application.id = task.application_id
    where task.id = public.application_task_status_events.task_id and public.is_business_member(application.business_id)
  ));

create policy "members can create application task status events"
  on public.application_task_status_events for insert
  to authenticated
  with check (
    (actor_id is null or actor_id = (select auth.uid()))
    and exists (
      select 1
      from public.application_tasks task
      join public.applications application on application.id = task.application_id
      where task.id = public.application_task_status_events.task_id and public.is_business_member(application.business_id)
    )
  );
