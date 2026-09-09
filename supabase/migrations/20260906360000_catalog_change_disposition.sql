alter table public.change_events
  add column if not exists reviewer_note text;
