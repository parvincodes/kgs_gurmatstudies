# Khalsa Gurmat School — Study Portal

A standalone study portal for Khalsa Gurmat School — students 14+
studying Gurbani, Sikh history, and philosophy, plus community seva.
Kept independent from the existing Khalsa School website for now.

Built with [Next.js](https://nextjs.org) (App Router) and
[Tailwind CSS v4](https://tailwindcss.com), styled to deploy on
[Vercel](https://vercel.com).

## Status: Early preview — gathering feedback

- **`/`** — home page: program overview, community & seva, and links
  into the portal preview.
- **`/materials`** — searchable, filterable study materials library.
  Sample content only (see `src/lib/materials.ts`), no database yet.
- **`/progress`** — mock progress-tracking preview using sample data,
  not tied to a real account.
- **`/login`** — placeholder — no auth is wired up yet.

The goal of this stage is to share something real with students,
teachers, and parents and gather feedback before building auth/DB.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap — next phase

- **Auth**: whitelist-based login for students and teachers (e.g.
  [Supabase Auth](https://supabase.com/auth) or
  [NextAuth](https://authjs.dev)), with two access levels. Teachers are
  expected to be able to upload/edit materials; other permission
  differences are still to be decided.
- **Database**: [Supabase Postgres](https://supabase.com) (or
  [Vercel Postgres](https://vercel.com/storage/postgres)) to replace
  the mock data in `src/lib/materials.ts` and store per-student
  progress.
- **Search**: move from client-side filtering over mock data to a real
  full-text search once materials are in a database.
- **Relationship to the main Khalsa School site**: link the two once
  this portal is validated; no changes to the old site yet.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. No environment variables are required yet (no backend wired up).
