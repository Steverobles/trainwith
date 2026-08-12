-- Blocking and reporting. Blocking hides a profile from your own Browse
-- and stops either side from sending new training requests to the other.
-- Reports are write-only from the client, same pattern as
-- guardian_contacts — no SELECT policy, so only dashboard/service-role
-- access can review them.

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_profile_id uuid not null references public.profiles(id) on delete cascade,
  blocked_profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (blocker_profile_id, blocked_profile_id)
);

alter table public.blocks enable row level security;

create policy "Users can view blocks they created"
  on public.blocks for select
  using (exists (select 1 from public.profiles p where p.id = blocker_profile_id and p.user_id = auth.uid()));

-- Also visible to the blocked party (not surfaced in the UI) so the
-- restrictive request-insert check below can see both directions of a
-- block — a policy's subquery against another RLS table only sees rows
-- that table's own SELECT policies allow for the current session.
create policy "Users can see blocks placed against them"
  on public.blocks for select
  using (exists (select 1 from public.profiles p where p.id = blocked_profile_id and p.user_id = auth.uid()));

create policy "Users can create blocks from their own profile"
  on public.blocks for insert
  with check (exists (select 1 from public.profiles p where p.id = blocker_profile_id and p.user_id = auth.uid()));

create policy "Users can remove their own blocks"
  on public.blocks for delete
  using (exists (select 1 from public.profiles p where p.id = blocker_profile_id and p.user_id = auth.uid()));

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_profile_id uuid not null references public.profiles(id) on delete cascade,
  reported_profile_id uuid not null references public.profiles(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can submit a report from their own profile"
  on public.reports for insert
  with check (exists (select 1 from public.profiles p where p.id = reporter_profile_id and p.user_id = auth.uid()));

-- Restrictive: ANDed on top of the existing permissive insert policy from
-- schema-2-auth.sql, so a request can't be sent in either direction once
-- either party has blocked the other.
create policy "Cannot request a blocked or blocking profile"
  on public.training_requests as restrictive for insert
  with check (
    not exists (
      select 1 from public.blocks b
      where (b.blocker_profile_id = from_profile_id and b.blocked_profile_id = to_profile_id)
         or (b.blocker_profile_id = to_profile_id and b.blocked_profile_id = from_profile_id)
    )
  );
