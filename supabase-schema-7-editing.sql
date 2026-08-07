-- TrainWith: allow editing listings in place. Run this in the Supabase SQL
-- Editor after supabase-schema-6-location.sql.
-- (profiles already has an UPDATE policy from supabase-schema-2-auth.sql —
-- this just adds the equivalent for training_posts, which only had
-- SELECT/INSERT/DELETE policies before.)

create policy "Owners can update their own listings"
  on public.training_posts for update
  using (
    exists (select 1 from public.profiles p where p.id = profile_id and p.user_id = auth.uid())
  );
