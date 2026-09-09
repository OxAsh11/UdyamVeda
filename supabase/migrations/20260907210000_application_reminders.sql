-- Make application deadline reminders idempotent. A task can only create one
-- notification for a user and due-date window, even if the scheduled worker
-- retries.

alter table public.notifications
  add column if not exists dedupe_key text;

create unique index if not exists notifications_user_dedupe_idx
  on public.notifications(user_id, dedupe_key)
  where dedupe_key is not null;

comment on column public.notifications.dedupe_key is
  'Stable key used by scheduled notifications to make retries safe.';
