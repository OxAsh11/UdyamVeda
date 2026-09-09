-- Apply the final reviewer decision atomically. The server route performs the
-- evidence-heavy dossier validation; this function makes the state transition,
-- task completion, publication status, and audit event one transaction.
create or replace function public.apply_catalog_review_decision(
  p_task_id uuid,
  p_action text,
  p_notes text default null,
  p_publication_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid := auth.uid();
  task_row record;
  version_status text;
  task_status text;
  completed_at_value timestamptz;
begin
  if actor_id is null or not public.is_catalog_reviewer(actor_id) then
    raise exception 'Catalog reviewer access is required.' using errcode = '42501';
  end if;

  if p_action not in ('approve', 'reject', 'request_changes') then
    raise exception 'Unsupported catalog review action.' using errcode = '22023';
  end if;

  if p_action = 'approve' and p_publication_status not in ('active', 'upcoming', 'closed') then
    raise exception 'An approval decision requires a valid publication status.' using errcode = '22023';
  end if;

  select rt.id, rt.status, rt.task_type, rt.opportunity_version_id,
         ov.opportunity_id, o.current_version_id
    into task_row
    from public.review_tasks rt
    join public.opportunity_versions ov on ov.id = rt.opportunity_version_id
    join public.opportunities o on o.id = ov.opportunity_id
   where rt.id = p_task_id
   for update of rt, ov, o;

  if not found then
    raise exception 'Review task not found.' using errcode = 'P0002';
  end if;
  if task_row.task_type <> 'publish' then
    raise exception 'Only publish review tasks can change publication state.' using errcode = '22023';
  end if;
  if task_row.status not in ('open', 'in_review') then
    raise exception 'This review task has already been completed.' using errcode = '40001';
  end if;

  version_status := case when p_action = 'approve' then 'approved' when p_action = 'reject' then 'rejected' else 'in_review' end;
  task_status := case when p_action = 'approve' then 'approved' when p_action = 'reject' then 'rejected' else 'in_review' end;
  completed_at_value := case when p_action = 'request_changes' then null else timezone('utc', now()) end;

  update public.opportunity_versions
     set review_status = version_status,
         reviewed_by = actor_id,
         reviewed_at = timezone('utc', now())
   where id = task_row.opportunity_version_id;

  if p_action = 'approve' then
    update public.opportunities
       set status = p_publication_status,
           current_version_id = task_row.opportunity_version_id
     where id = task_row.opportunity_id;
  elsif task_row.current_version_id = task_row.opportunity_version_id then
    update public.opportunities
       set status = case when p_action = 'reject' then 'draft' else 'in_review' end
     where id = task_row.opportunity_id;
  end if;

  update public.review_tasks
     set status = task_status,
         assigned_to = actor_id,
         reviewer_notes = nullif(trim(coalesce(p_notes, '')), ''),
         completed_at = completed_at_value
   where id = p_task_id;

  insert into public.audit_logs(actor_id, entity_type, entity_id, action, metadata)
  values (
    actor_id,
    'opportunity_version',
    task_row.opportunity_version_id,
    'catalog_' || p_action,
    jsonb_build_object('task_id', p_task_id, 'notes', nullif(trim(coalesce(p_notes, '')), ''), 'publication_status', p_publication_status)
  );

  return jsonb_build_object('status', task_status, 'publication_status', p_publication_status);
end;
$$;

revoke all on function public.apply_catalog_review_decision(uuid, text, text, text) from public;
grant execute on function public.apply_catalog_review_decision(uuid, text, text, text) to authenticated;
