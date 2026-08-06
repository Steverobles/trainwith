# TrainWith

Find your training partner. TrainWith matches people nearby who are working on the same sport,
drill, and skill level — long toss, bullpen sessions, shooting reps, baseline rallies — so
training is easier to stick with and more fun to show up for.

Profiles and matching are backed by a real Supabase (Postgres) database — signup creates a real
row and browse/profile pages read from it. There's no authentication yet, so anyone can create a
profile; guardian contact info for minors is write-only (see below).

## Requirements

- Node.js 20+
- npm
- A free [Supabase](https://supabase.com) project

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project, then run [`supabase-schema.sql`](./supabase-schema.sql) in its
   **SQL Editor** to create the tables, row-level security policies, and seed demo profiles.

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

- `profiles` — publicly readable and insertable (anyone can browse or sign up).
- `guardian_contacts` — insert-only. There is no `SELECT` policy, so parent/guardian name and
  email can never be read back through the public API key, even though the app can save them
  during signup for minors.

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Project structure

- `src/app/` — pages: landing (`/`), browse/matching (`/browse`), profile detail
  (`/profile/[id]`), signup (`/signup`)
- `src/components/` — shared UI (header, profile cards, filters, signup form, safety banner)
- `src/lib/` — types, Supabase client and queries, and sport color/icon styling

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase
