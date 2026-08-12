-- Guardian approval flow: a minor's guardian gets an emailed link and must
-- click through to approve before profiles.guardian_verified is set true.
-- The token/approval columns are only ever read or written by server-side
-- code using the service role key, which bypasses RLS entirely — so no new
-- policies are needed here, and the existing "no SELECT policy" on
-- guardian_contacts still holds for the anon/browser client.

alter table public.guardian_contacts
  add column approval_token text unique,
  add column approved_at timestamptz;
