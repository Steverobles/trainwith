-- TrainWith: real location for distance calculations. Run this in the
-- Supabase SQL Editor after supabase-schema-5-listings.sql.

alter table public.profiles add column lat double precision;
alter table public.profiles add column lng double precision;

-- Backfill coordinates for the existing demo profiles (their city names are
-- fixed, so this is a one-time hardcoded lookup rather than a live geocode).
update public.profiles set lat = 30.2672, lng = -97.7431 where city = 'Austin' and state = 'TX';
update public.profiles set lat = 30.5083, lng = -97.6789 where city = 'Round Rock' and state = 'TX';
update public.profiles set lat = 30.5052, lng = -97.8203 where city = 'Cedar Park' and state = 'TX';
update public.profiles set lat = 30.6333, lng = -97.6780 where city = 'Georgetown' and state = 'TX';
update public.profiles set lat = 30.4394, lng = -97.6200 where city = 'Pflugerville' and state = 'TX';
