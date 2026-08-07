-- TrainWith: split "what you're looking for" out of profiles into its own
-- listings table. Run this in the Supabase SQL Editor after
-- supabase-schema-4-message-reads.sql.

create table public.training_posts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  sport text not null,
  focus text not null,
  skill_level text not null,
  created_at timestamptz not null default now()
);

alter table public.training_posts enable row level security;

create policy "Listings are viewable by everyone"
  on public.training_posts for select
  using (true);

create policy "Owners can create their own listings"
  on public.training_posts for insert
  with check (
    exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid())
  );

create policy "Owners can delete their own listings"
  on public.training_posts for delete
  using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid())
  );

-- Migrate each existing profile's current sport/focus/skill_level into a
-- listing, so nothing is lost, then drop those columns from profiles now
-- that they live on listings instead.
insert into public.training_posts (profile_id, sport, focus, skill_level, created_at)
select id, sport, focus, skill_level, created_at from public.profiles;

alter table public.profiles drop column sport;
alter table public.profiles drop column focus;
alter table public.profiles drop column skill_level;
