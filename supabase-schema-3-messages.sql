-- TrainWith: messaging. Run this in the Supabase SQL Editor after
-- supabase-schema.sql and supabase-schema-2-auth.sql.

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.training_requests(id) on delete cascade,
  sender_profile_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Only the two people on an *accepted* request can see or send messages
-- tied to it.
create policy "Participants can view messages on their accepted requests"
  on public.messages for select
  using (
    exists (
      select 1
      from public.training_requests tr
      join public.profiles p on p.id in (tr.from_profile_id, tr.to_profile_id)
      where tr.id = request_id
        and tr.status = 'accepted'
        and p.user_id = auth.uid()
    )
  );

create policy "Participants can send messages on their accepted requests"
  on public.messages for insert
  with check (
    exists (
      select 1
      from public.training_requests tr
      join public.profiles p on p.id in (tr.from_profile_id, tr.to_profile_id)
      where tr.id = request_id
        and tr.status = 'accepted'
        and p.user_id = auth.uid()
        and p.id = sender_profile_id
    )
  );
