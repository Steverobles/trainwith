-- TrainWith: message read tracking. Run this in the Supabase SQL Editor
-- after supabase-schema-3-messages.sql.

alter table public.messages add column read_at timestamptz;

-- The recipient (the participant who did NOT send the message) can mark
-- it as read.
create policy "Recipients can mark messages as read"
  on public.messages for update
  using (
    exists (
      select 1
      from public.training_requests tr
      join public.profiles p on p.id in (tr.from_profile_id, tr.to_profile_id)
      where tr.id = request_id
        and tr.status = 'accepted'
        and p.user_id = auth.uid()
        and p.id <> sender_profile_id
    )
  );
