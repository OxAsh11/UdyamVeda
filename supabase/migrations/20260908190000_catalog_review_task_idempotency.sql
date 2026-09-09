-- Keep seed replays and ingestion retries from creating duplicate active review work.
-- Completed decisions remain historical rows; only open/in-review publish work is unique.

delete from public.review_tasks duplicate
using public.review_tasks canonical
where duplicate.id > canonical.id
  and duplicate.opportunity_version_id is not null
  and duplicate.opportunity_version_id = canonical.opportunity_version_id
  and duplicate.task_type = canonical.task_type
  and duplicate.status in ('open', 'in_review')
  and canonical.status in ('open', 'in_review');

create unique index if not exists review_tasks_active_version_type_unique
  on public.review_tasks(opportunity_version_id, task_type)
  where opportunity_version_id is not null
    and status in ('open', 'in_review');
