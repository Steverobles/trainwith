# TrainWith

Find your training partner. TrainWith matches people nearby who are working on the same sport,
drill, and skill level — long toss, bullpen sessions, shooting reps, baseline rallies — so
training is easier to stick with and more fun to show up for.

This is an early-stage MVP: profiles and matching are backed by mock data (`src/lib/mock-profiles.ts`),
there's no real backend or auth yet, and signup just simulates success in the UI.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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
- `src/lib/` — types, mock profile data, and sport color/icon styling

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS
