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
- **`/upload`** — teacher upload tool for study materials (PDFs, Word,
  PowerPoint, audio, video). Drag-and-drop or folder select, stored in
  [Vercel Blob](https://vercel.com/docs/vercel-blob). Gated by a shared
  passcode (`UPLOAD_PASSCODE`) as a stopgap until real teacher login
  exists — not real auth, just enough to keep it from being wide open.

The goal of this stage is to share something real with students,
teachers, and parents and gather feedback before building auth/DB.

## Local development

```bash
npm install
cp .env.local.example .env.local  # fill in the values, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required for | Where to get it |
| --- | --- | --- |
| `UPLOAD_PASSCODE` | `/upload` | Pick any string — this is the shared teacher passcode. |
| `BLOB_READ_WRITE_TOKEN` | `/upload` | Vercel dashboard → Storage → create a Blob store → connect it to this project. Locally, run `vercel env pull .env.local` after connecting, or copy the token manually. |

Without these, every other page still works — `/upload` will show a
clear error instead of crashing.

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
2. Import it at [vercel.com/new](https://vercel.com/new) under your
   personal account (Hobby plan) — no Team needed for this project.
3. In the project's Storage tab, create a Blob store and connect it —
   this sets `BLOB_READ_WRITE_TOKEN` automatically.
4. In Settings → Environment Variables, add `UPLOAD_PASSCODE` with
   whatever passcode you want teachers to use.
5. Redeploy so the new environment variables take effect.
