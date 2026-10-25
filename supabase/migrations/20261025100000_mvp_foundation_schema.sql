-- MVP foundation (PRD v1, Phase 0): the shared vocabulary the founder flow and
-- the rules engine both speak.
--
--   packs             industry packs (P1–P5 + tech lite)
--   activities        plain-language activities a founder picks, mapped to
--                     NIC 2008 codes (what Udyam asks for) and to packs
--   fact_definitions  the only facts eligibility rules may use; each says
--                     whether a "no" can be fixed (bucket B) or not (bucket D)
--   questions         onboarding questions; every question writes facts
--
-- All four are public reference data: anyone (including a founder who has
-- not logged in) can read active rows; only catalog reviewers can change them.

-- True when every element of the array matches the pattern (CHECK constraints
-- cannot contain subqueries, so this wraps the unnest).
create or replace function public.text_array_all_match(values_to_check text[], pattern text)
returns boolean
language sql
immutable
as $$
  select coalesce(bool_and(item ~ pattern), true) from unnest(values_to_check) as item
$$;

create table if not exists public.packs (
  id text primary key check (id ~ '^[a-z][a-z0-9_]*$'),
  sort_order smallint not null,
  name_en text not null,
  name_hi text not null,
  name_mr text not null,
  description_en text not null,
  is_lite boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activities (
  id text primary key check (id ~ '^[a-z][a-z0-9_]*$'),
  sort_order smallint not null,
  label_en text not null,
  label_hi text not null,
  label_mr text not null,
  -- Spellings and local words founders type: "achaar", "lonche", "murgi palan".
  synonyms text[] not null default '{}',
  nic2008_classes text[] not null check (cardinality(nic2008_classes) > 0 and public.text_array_all_match(nic2008_classes, '^\d{4}$')),
  nic2008_subclasses text[] not null default '{}' check (public.text_array_all_match(nic2008_subclasses, '^\d{5}$')),
  -- Filled once Udyam switches to NIC 2025.
  nic2025_codes text[] not null default '{}',
  icon text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.activity_packs (
  activity_id text not null references public.activities(id) on delete cascade,
  pack_id text not null references public.packs(id) on delete cascade,
  primary key (activity_id, pack_id)
);

create table if not exists public.fact_definitions (
  key text primary key check (key ~ '^[a-z][a-z0-9_]*$'),
  value_type text not null check (value_type in ('boolean', 'enum', 'multi_enum', 'number', 'band', 'date', 'text', 'activity_list')),
  -- For enum / multi_enum / band: [{"value": "...", "label_en": "...", "label_hi": "...", "label_mr": "..."}]
  allowed_values jsonb,
  unit text,
  -- true: the founder can change it (get Udyam, a certificate, a lease) → bucket B.
  -- false: a fact about who/where they are (state, age, activity) → bucket D.
  fixable boolean not null,
  -- Asked only at the funding stage, with a reason and "prefer not to say".
  sensitive boolean not null default false,
  ask_stage smallint not null check (ask_stage between 1 and 9),
  -- Empty = core fact for every founder; otherwise only for these packs.
  pack_ids text[] not null default '{}',
  label_en text not null,
  label_hi text not null,
  label_mr text not null,
  why_en text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  check (
    (value_type in ('enum', 'multi_enum', 'band') and jsonb_typeof(allowed_values) = 'array' and jsonb_array_length(allowed_values) > 0)
    or (value_type not in ('enum', 'multi_enum', 'band') and allowed_values is null)
  )
);

create table if not exists public.questions (
  id text primary key check (id ~ '^[a-z][a-z0-9_]*$'),
  ask_stage smallint not null check (ask_stage between 1 and 9),
  sort_order smallint not null,
  pack_id text references public.packs(id),
  answer_kind text not null check (answer_kind in ('single', 'multi', 'number', 'band', 'yes_no', 'date', 'text', 'activity_search')),
  prompt_en text not null,
  prompt_hi text not null,
  prompt_mr text not null,
  help_en text,
  help_hi text,
  help_mr text,
  -- Optional rule tree (same format as eligibility rules) over facts already
  -- answered; the question is asked only when it evaluates to true.
  depends_on jsonb,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.question_facts (
  question_id text not null references public.questions(id) on delete cascade,
  fact_key text not null references public.fact_definitions(key) on delete restrict,
  primary key (question_id, fact_key)
);

-- fact_definitions.pack_ids must name real packs.
create or replace function public.validate_fact_definition_packs()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if exists (select 1 from unnest(new.pack_ids) as p(id) where not exists (select 1 from public.packs where packs.id = p.id)) then
    raise exception 'fact_definitions.pack_ids contains an unknown pack: %', new.pack_ids using errcode = '23503';
  end if;
  return new;
end;
$$;

drop trigger if exists fact_definitions_validate_packs on public.fact_definitions;
create trigger fact_definitions_validate_packs
before insert or update of pack_ids on public.fact_definitions
for each row execute function public.validate_fact_definition_packs();

create index if not exists activity_packs_pack_idx on public.activity_packs (pack_id);
create index if not exists question_facts_fact_idx on public.question_facts (fact_key);

alter table public.packs enable row level security;
alter table public.activities enable row level security;
alter table public.activity_packs enable row level security;
alter table public.fact_definitions enable row level security;
alter table public.questions enable row level security;
alter table public.question_facts enable row level security;

create policy "active packs are public" on public.packs for select to anon, authenticated using (active);
create policy "active activities are public" on public.activities for select to anon, authenticated using (active);
create policy "activity packs are public" on public.activity_packs for select to anon, authenticated using (true);
create policy "active facts are public" on public.fact_definitions for select to anon, authenticated using (active);
create policy "active questions are public" on public.questions for select to anon, authenticated using (active);
create policy "question facts are public" on public.question_facts for select to anon, authenticated using (true);

create policy "reviewers manage packs" on public.packs for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
create policy "reviewers manage activities" on public.activities for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
create policy "reviewers manage activity packs" on public.activity_packs for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
create policy "reviewers manage facts" on public.fact_definitions for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
create policy "reviewers manage questions" on public.questions for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
create policy "reviewers manage question facts" on public.question_facts for all to authenticated
  using (public.is_catalog_reviewer((select auth.uid()))) with check (public.is_catalog_reviewer((select auth.uid())));
