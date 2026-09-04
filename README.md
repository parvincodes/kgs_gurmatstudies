# Khalsa Gurmat School

Landing page for Khalsa Gurmat School — a learning community for students
14+ studying Gurbani, Sikh history, and philosophy, and taking part in
community seva.

Built with [Next.js](https://nextjs.org) (App Router) and
[Tailwind CSS v4](https://tailwindcss.com), styled to deploy on
[Vercel](https://vercel.com).

## Status: Phase 1 — Landing page

This first cut is a static marketing/landing page:

- Hero, program overview (Gurbani / History / Philosophy), community &
  seva section, and a "coming soon" preview of the student portal.
- `/login` is a placeholder — no auth is wired up yet.
- No database yet.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap — Phase 2 (student/teacher portal)

Planned next, once the landing page is approved:

- **Auth**: whitelist-based login for students and teachers (e.g.
  [Supabase Auth](https://supabase.com/auth) or
  [NextAuth](https://authjs.dev)), with two access levels (student /
  teacher) to be finalized.
- **Database**: [Supabase Postgres](https://supabase.com) (or
  [Vercel Postgres](https://vercel.com/storage/postgres)) to store study
  materials, course structure, and per-student progress.
- **Search**: full-text search across study materials.
- **Progress tracking**: per-student view of what's been covered.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. No environment variables are required yet (Phase 1 has no backend).
