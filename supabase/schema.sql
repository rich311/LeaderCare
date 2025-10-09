-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text check (role in ('leader', 'provider', 'admin')) default 'leader',
  church_name text,
  denomination text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create holistic health providers table
create table public.providers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  credentials text,
  specialties text[] default '{}',
  bio text,
  phone text,
  email text not null,
  website text,
  address text,
  city text,
  state text,
  zip_code text,
  insurance_accepted text[] default '{}',
  accepting_new_clients boolean default true,
  languages text[] default '{"English"}',
  rating numeric(3,2) default 0,
  review_count integer default 0,
  location_type text check (location_type in ('in-person', 'virtual', 'both')) default 'both',
  location_details text,
  gloo_scholarship_available boolean default false,
  service_durations text[] default '{}',
  content_resources boolean default false,
  content_resources_list text[] default '{}',
  denominations text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create care plans table
create table public.care_plans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assessment_data jsonb not null,
  recommendations jsonb not null,
  priority_level text check (priority_level in ('low', 'medium', 'high', 'urgent')) default 'medium',
  status text check (status in ('draft', 'active', 'completed', 'archived')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create care plan resources table (linking care plans to providers)
create table public.care_plan_resources (
  id uuid default uuid_generate_v4() primary key,
  care_plan_id uuid references public.care_plans(id) on delete cascade not null,
  provider_id uuid references public.providers(id) on delete cascade,
  resource_type text check (resource_type in ('provider', 'activity', 'resource', 'other')) default 'provider',
  title text not null,
  description text,
  url text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create provider reviews table
create table public.provider_reviews (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid references public.providers(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  review_text text,
  anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(provider_id, user_id)
);

-- Create saved providers table (favorites)
create table public.saved_providers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider_id uuid references public.providers(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, provider_id)
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.providers enable row level security;
alter table public.care_plans enable row level security;
alter table public.care_plan_resources enable row level security;
alter table public.provider_reviews enable row level security;
alter table public.saved_providers enable row level security;

-- RLS Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- RLS Policies for providers
create policy "Providers are viewable by everyone"
  on providers for select
  using ( true );

create policy "Providers can insert their own data"
  on providers for insert
  with check ( auth.uid() = user_id );

create policy "Providers can update their own data"
  on providers for update
  using ( auth.uid() = user_id );

-- RLS Policies for care_plans
create policy "Users can view their own care plans"
  on care_plans for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own care plans"
  on care_plans for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own care plans"
  on care_plans for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own care plans"
  on care_plans for delete
  using ( auth.uid() = user_id );

-- RLS Policies for care_plan_resources
create policy "Users can view resources for their care plans"
  on care_plan_resources for select
  using (
    exists (
      select 1 from care_plans
      where care_plans.id = care_plan_resources.care_plan_id
      and care_plans.user_id = auth.uid()
    )
  );

create policy "Users can insert resources to their care plans"
  on care_plan_resources for insert
  with check (
    exists (
      select 1 from care_plans
      where care_plans.id = care_plan_resources.care_plan_id
      and care_plans.user_id = auth.uid()
    )
  );

create policy "Users can update resources in their care plans"
  on care_plan_resources for update
  using (
    exists (
      select 1 from care_plans
      where care_plans.id = care_plan_resources.care_plan_id
      and care_plans.user_id = auth.uid()
    )
  );

-- RLS Policies for provider_reviews
create policy "Reviews are viewable by everyone"
  on provider_reviews for select
  using ( true );

create policy "Authenticated users can insert reviews"
  on provider_reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews"
  on provider_reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews"
  on provider_reviews for delete
  using ( auth.uid() = user_id );

-- RLS Policies for saved_providers
create policy "Users can view their own saved providers"
  on saved_providers for select
  using ( auth.uid() = user_id );

create policy "Users can save providers"
  on saved_providers for insert
  with check ( auth.uid() = user_id );

create policy "Users can remove saved providers"
  on saved_providers for delete
  using ( auth.uid() = user_id );

-- Create functions to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure update_updated_at_column();

create trigger update_providers_updated_at before update on public.providers
  for each row execute procedure update_updated_at_column();

create trigger update_care_plans_updated_at before update on public.care_plans
  for each row execute procedure update_updated_at_column();

create trigger update_provider_reviews_updated_at before update on public.provider_reviews
  for each row execute procedure update_updated_at_column();

-- Function to update provider rating when a review is added/updated/deleted
create or replace function update_provider_rating()
returns trigger as $$
begin
  update providers
  set
    rating = (
      select avg(rating)::numeric(3,2)
      from provider_reviews
      where provider_id = coalesce(new.provider_id, old.provider_id)
    ),
    review_count = (
      select count(*)
      from provider_reviews
      where provider_id = coalesce(new.provider_id, old.provider_id)
    )
  where id = coalesce(new.provider_id, old.provider_id);
  return coalesce(new, old);
end;
$$ language plpgsql;

-- Create trigger for automatic rating updates
create trigger update_provider_rating_on_review_change
  after insert or update or delete on provider_reviews
  for each row execute procedure update_provider_rating();

-- Create a function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
