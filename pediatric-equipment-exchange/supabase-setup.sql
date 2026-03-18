-- Run this in your Supabase SQL Editor
-- Creates a profiles table linked to auth.users with a role column

create type user_role as enum ('physical_therapist', 'volunteer');

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role user_role not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Allow users to read only their own profile
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Automatically create a profile row when a new user signs up
-- (You'll need to set the role manually or via your admin flow)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'role')::user_role
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
