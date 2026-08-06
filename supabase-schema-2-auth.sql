-- TrainWith: auth + training requests. Run this in the Supabase SQL Editor
-- after supabase-schema.sql.

alter table public.profiles add column user_id uuid references auth.users(id) on delete cascade;

create table public.training_requests (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  to_profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (from_profile_id, to_profile_id)
);

alter table public.training_requests enable row level security;

-- Profiles: only the signed-in owner may create or update their own profile.
-- (The original "Anyone can create a profile" policy is replaced — profiles
-- are now tied to a real account.)
drop policy if exists "Anyone can create a profile" on public.profiles;

create policy "Authenticated users can create their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Owners can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Training requests: visible only to the two people involved, sendable only
-- from a profile you own, and only the recipient can change its status.
create policy "Participants can view their requests"
  on public.training_requests for select
  using (
    exists (select 1 from public.profiles p where p.id = from_profile_id and p.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = to_profile_id and p.user_id = auth.uid())
  );

create policy "Owners can send requests from their own profile"
  on public.training_requests for insert
  with check (
    exists (select 1 from public.profiles p where p.id = from_profile_id and p.user_id = auth.uid())
  );

create policy "Recipients can respond to requests"
  on public.training_requests for update
  using (
    exists (select 1 from public.profiles p where p.id = to_profile_id and p.user_id = auth.uid())
  );
