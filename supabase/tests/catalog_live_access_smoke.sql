-- Executes real RLS predicates with temporary fixtures. Everything rolls back.
-- This focused smoke test is not the full cross-tenant acceptance suite.
begin;
do $$
declare
  test_owner uuid;
  test_business uuid := gen_random_uuid();
begin
  select id into test_owner from auth.users order by created_at limit 1;
  if test_owner is null then raise exception 'An existing Auth user is required for the owner fixture'; end if;
  perform set_config('test.owner_id', test_owner::text, true);
  perform set_config('test.business_id', test_business::text, true);
  insert into public.businesses (id, owner_id, name) values (test_business, test_owner, 'ROLLBACK ONLY access smoke');
  insert into public.business_memberships (business_id, user_id, role) values (test_business, test_owner, 'owner');
  insert into public.business_facts (business_id, fact_key, fact_value) values (test_business, 'access_smoke', 'true');
end $$;

select set_config('request.jwt.claim.sub', current_setting('test.owner_id'), true);
set local role authenticated;
do $$
begin
  if not exists (select 1 from public.business_facts where business_id = current_setting('test.business_id')::uuid) then
    raise exception 'Owner cannot read their own fixture';
  end if;
end $$;
reset role;

select set_config('request.jwt.claim.sub', gen_random_uuid()::text, true);
set local role authenticated;
do $$
begin
  if exists (select 1 from public.businesses where id = current_setting('test.business_id')::uuid)
    or exists (select 1 from public.business_facts where business_id = current_setting('test.business_id')::uuid)
    or exists (select 1 from public.business_memberships where business_id = current_setting('test.business_id')::uuid) then
    raise exception 'Cross-tenant fixture read was allowed';
  end if;
  begin
    insert into public.business_facts (business_id, fact_key, fact_value)
    values (current_setting('test.business_id')::uuid, 'forbidden', 'true');
    raise exception 'Cross-tenant fixture write was allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select set_config('request.jwt.claim.sub', '', true);
set local role anon;
do $$
begin
  if exists (select 1 from public.opportunity_versions where review_status <> 'approved') then
    raise exception 'Unapproved catalog version is public';
  end if;
  if exists (select 1 from public.source_registry) then
    raise exception 'Internal source registry is public';
  end if;
  if exists (select 1 from public.businesses where id = current_setting('test.business_id')::uuid) then
    raise exception 'Business fixture is public';
  end if;
end $$;
reset role;
rollback;
select 'passed' as focused_live_rls_smoke;
