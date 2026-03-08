-- Analytics table (single row, updated daily by GitHub Action)
create table public.analytics (
  id integer primary key default 1,
  total_providers integer default 0,
  total_care_plans integer default 0,
  total_ministry_leaders integer default 0,
  total_reviews integer default 0,
  total_saved_providers integer default 0,
  liftcare_eligible_providers integer default 0,
  providers_accepting_clients integer default 0,
  computed_at timestamp with time zone default now(),
  constraint single_row check (id = 1)
);

-- Seed initial row so upsert always works
insert into public.analytics (id) values (1) on conflict do nothing;

-- RLS
alter table public.analytics enable row level security;

create policy "Analytics are publicly readable"
  on analytics for select
  using (true);
