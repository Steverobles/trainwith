# TrainWith

Find your training partner. TrainWith matches people nearby who are working on the same sport,
drill, and skill level — long toss, bullpen sessions, shooting reps, baseline rallies — so
training is easier to stick with and more fun to show up for.

Profiles and matching are backed by a real Supabase (Postgres) database with real accounts.
Profile and "what I'm looking for" are deliberately separate: your **profile** is your identity
(name, age, city, a bio about the sports you play and what you're working toward), while
**listings** are the specific "looking for a partner" cards you post (sport, focus, skill level) —
you can have several at once, and Browse shows listings, not people directly. Sending a training
request still connects two *people*, and once accepted it becomes a conversation on the Messages
tab. Requests and Messages are deliberately separate too: Requests is just the pending
accept/decline inbox, Messages is where your actual connections live. Your city/state is geocoded
into real coordinates at signup, so Browse can show actual distance and sort nearest-first.
Guardian contact info for minors is write-only (see below).

## Requirements

- Node.js 20+
- npm
- A free [Supabase](https://supabase.com) project

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then run [`supabase-schema.sql`](./supabase-schema.sql),
   [`supabase-schema-2-auth.sql`](./supabase-schema-2-auth.sql),
   [`supabase-schema-3-messages.sql`](./supabase-schema-3-messages.sql),
   [`supabase-schema-4-message-reads.sql`](./supabase-schema-4-message-reads.sql),
   [`supabase-schema-5-listings.sql`](./supabase-schema-5-listings.sql), and
   [`supabase-schema-6-location.sql`](./supabase-schema-6-location.sql) in order in its **SQL
   Editor** to create the tables, row-level security policies, and seed demo profiles.

   For faster local testing, also turn off **Confirm email** under
   **Authentication → Providers → Email** so new signups don't need to click an email link.

3. Copy `.env.local.example` to `.env.local` and fill in your project's URL and anon/public key
   (found in **Project Settings → API Keys**):

   ```bash
   cp .env.local.example .env.local
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data model

- `profiles` — identity only (name, age band, city/state, bio). Publicly readable; only the
  signed-in owner (`auth.uid() = user_id`) can create or update their own row.
- `training_posts` — the "looking for a partner" listings (sport, focus, skill level), each owned
  by a profile. Publicly readable; only the owning profile's user can create or delete their own
  listings. A profile can have any number of active listings.
- `profiles.lat` / `profiles.lng` — geocoded (via free OpenStreetMap/Nominatim lookup, once at
  signup) from the city/state you enter. Powers real distance display and nearest-first sorting in
  Browse; if geocoding fails, signup still succeeds, that profile just won't show a distance.
- `guardian_contacts` — insert-only. There is no `SELECT` policy, so parent/guardian name and
  email can never be read back through the public API key, even though the app can save them
  during signup for minors.
- `training_requests` — visible only to the sender and recipient; only the profile owner can send
  a request from their own profile, and only the recipient can accept or decline it.
- `messages` — visible only to the two participants on an *accepted* request; messaging is
  blocked entirely (by RLS, not just the UI) until a request reaches that state. Each message has
  a `read_at` that only the recipient (never the sender) can set, which drives the unread badge
  in the header.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

- `src/app/` — pages: landing (`/`), browse/matching (`/browse`), profile detail
  (`/profile/[id]`), your own profile redirect (`/profile/me`), manage your listings
  (`/listings`), signup (`/signup`), login (`/login`), pending requests inbox (`/requests`),
  conversation list (`/messages`), chat thread (`/messages/[id]`)
- `src/components/` — shared UI (header, listing grid/cards, filters, signup/login forms, request
  button, safety banner)
- `src/lib/` — types, Supabase client, auth session hook, and profile/post/request/message queries

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase
