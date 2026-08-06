# TrainWith

Find your training partner. TrainWith matches people nearby who are working on the same sport,
drill, and skill level — long toss, bullpen sessions, shooting reps, baseline rallies — so
training is easier to stick with and more fun to show up for.

Profiles and matching are backed by a real Supabase (Postgres) database with real accounts — sign
up creates an account and a profile tied to it, you can send a training request to another
athlete that they can accept or decline, and once accepted you can message each other. Guardian
contact info for minors is write-only (see below).

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
   [`supabase-schema-2-auth.sql`](./supabase-schema-2-auth.sql), and
   [`supabase-schema-3-messages.sql`](./supabase-schema-3-messages.sql) in order in its **SQL
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

- `profiles` — publicly readable; only the signed-in owner (`auth.uid() = user_id`) can create or
  update their own row.
- `guardian_contacts` — insert-only. There is no `SELECT` policy, so parent/guardian name and
  email can never be read back through the public API key, even though the app can save them
  during signup for minors.
- `training_requests` — visible only to the sender and recipient; only the profile owner can send
  a request from their own profile, and only the recipient can accept or decline it.
- `messages` — visible only to the two participants on an *accepted* request; messaging is
  blocked entirely (by RLS, not just the UI) until a request reaches that state.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

- `src/app/` — pages: landing (`/`), browse/matching (`/browse`), profile detail
  (`/profile/[id]`), signup (`/signup`), login (`/login`), requests inbox (`/requests`), chat
  thread (`/messages/[id]`)
- `src/components/` — shared UI (header, profile cards, filters, signup/login forms, request
  button, safety banner)
- `src/lib/` — types, Supabase client, auth session hook, and profile/request/message queries

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase
