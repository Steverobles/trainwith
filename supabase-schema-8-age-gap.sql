-- TrainWith: real ages + a hard age-gap safety limit on training requests.
-- Run this in the Supabase SQL Editor after supabase-schema-7-editing.sql.

alter table public.profiles add column birth_year integer;

-- Backfill existing demo/seed profiles with a representative birth year for
-- their current age band (today is 2026).
update public.profiles set birth_year = 2012 where age_band = '13-15' and birth_year is null;
update public.profiles set birth_year = 2009 where age_band = '16-17' and birth_year is null;
update public.profiles set birth_year = 2005 where age_band = '18-24' and birth_year is null;
update public.profiles set birth_year = 1996 where age_band = '25-34' and birth_year is null;
update public.profiles set birth_year = 1985 where age_band = '35+' and birth_year is null;

alter table public.profiles alter column birth_year set not null;

-- Hard safety limit: until BOTH people are adults (18+), a training request
-- can only be sent to someone within 2 years of your real age. Once both
-- are 18+, there's no restriction. This is a RESTRICTIVE policy, meaning
-- it's ANDed on top of the existing "Owners can send requests from their
-- own profile" permissive policy from supabase-schema-2-auth.sql — both
-- must pass, so this can't be bypassed by calling the API directly.
create policy "Age-gap limit on sending requests"
  on public.training_requests as restrictive for insert
  with check (
    exists (
      select 1
      from public.profiles sender
      join public.profiles recipient on recipient.id = to_profile_id
      where sender.id = from_profile_id
        and (
          (extract(year from now()) - sender.birth_year >= 18
           and extract(year from now()) - recipient.birth_year >= 18)
          or abs(
            (extract(year from now()) - sender.birth_year) -
            (extract(year from now()) - recipient.birth_year)
          ) <= 2
        )
    )
  );
