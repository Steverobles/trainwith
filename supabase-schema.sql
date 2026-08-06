-- TrainWith schema: run this once in the Supabase SQL Editor.

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  age_band text not null check (age_band in ('13-15','16-17','18-24','25-34','35+')),
  sport text not null,
  focus text not null,
  skill_level text not null,
  city text not null,
  state text not null,
  bio text not null default '',
  guardian_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Guardian contact info for minors. Intentionally has no SELECT policy below,
-- so it can never be read back through the public API key — write-only from the app.
create table public.guardian_contacts (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  guardian_name text not null,
  guardian_email text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.guardian_contacts enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Anyone can create a profile"
  on public.profiles for insert
  with check (true);

create policy "Anyone can submit guardian contact info"
  on public.guardian_contacts for insert
  with check (true);

-- Seed data: the original demo profiles, now living as real rows.
insert into public.profiles (name, age_band, sport, focus, skill_level, city, state, bio, guardian_verified) values
  ('Jayden M.', '16-17', 'Baseball', 'Long toss', 'Varsity+', 'Round Rock', 'TX', 'Varsity pitcher trying to add velocity before fall ball. Looking for someone to stretch out long toss with 3-4x a week.', true),
  ('Marcus T.', '16-17', 'Baseball', 'Long toss', 'Competitive', 'Round Rock', 'TX', 'Sophomore, play travel ball. Want a regular throwing partner to build arm strength for next season.', true),
  ('Ava R.', '13-15', 'Softball', 'Fielding & throwing accuracy', 'Rec / casual', 'Cedar Park', 'TX', '8th grade, play rec league. Would love a weekend partner for grounders and throw-downs.', true),
  ('Diego S.', '13-15', 'Basketball', 'Ball handling & shooting reps', 'Competitive', 'Austin', 'TX', 'Guard trying to make the JV squad next year. Looking for someone to run drills and get up shots with after school.', false),
  ('Sophia L.', '16-17', 'Tennis', 'Baseline rallying', 'Varsity+', 'Austin', 'TX', 'Varsity #2 singles. Need a consistent hitting partner for baseline rallies before matches start up.', true),
  ('Chris P.', '25-34', 'Baseball', 'Long toss', 'Rec / casual', 'Round Rock', 'TX', 'Played through college, haven''t picked up a ball in years. Would love to get the arm loose again and maybe join a men''s league.', false),
  ('Brianna K.', '18-24', 'Soccer', 'Finishing & footwork drills', 'Competitive', 'Georgetown', 'TX', 'Ex-club player, home from college for the summer. Looking for pickup partners for finishing drills a couple times a week.', false),
  ('Omar H.', '35+', 'Basketball', 'Shooting reps', 'Rec / casual', 'Austin', 'TX', 'Weekend warrior trying to relive some glory days. Just want steady reps and someone to rebound for.', false),
  ('Nate W.', '18-24', 'Football', 'Route running', 'Competitive', 'Pflugerville', 'TX', 'Former high school WR, staying sharp for adult flag league. Need a QB or another WR to run routes with.', false),
  ('Isabella C.', '13-15', 'Track & Field', 'Sprint starts & block work', 'Rec / casual', 'Cedar Park', 'TX', 'Middle schooler working on my 100m. Looking for a training partner to push my starts.', true),
  ('Tyler B.', '16-17', 'Baseball', 'Bullpen sessions', 'Varsity+', 'Georgetown', 'TX', 'Varsity pitcher, need a catcher for bullpens twice a week leading into the season.', true),
  ('Grace F.', '25-34', 'Tennis', 'Baseline rallying', 'Rec / casual', 'Austin', 'TX', 'Getting back into tennis after a long break. Looking for a casual rally partner, no pressure.', false);
