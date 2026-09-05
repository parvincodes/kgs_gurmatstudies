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
  PowerPoint, audio, video). Drag-and-drop or folder select, files
  stored in [Vercel Blob](https://vercel.com/docs/vercel-blob), metadata
  (title, subject, review status) in Postgres. Gated by a shared
  passcode (`UPLOAD_PASSCODE`) as a stopgap until real teacher login
  exists — not real auth, just enough to keep it from being wide open.
- **`/review`** — peer review queue. Any teacher with the passcode can
  edit a material's title/description and approve it or flag it for
  removal (with a reason). Flagging hides it from the "Approved" set
  immediately but keeps the file — it's still deleted from `/upload`
  explicitly, so a mis-flag is recoverable via "Reset to pending."

The goal of this stage is to share something real with students,
teachers, and parents and gather feedback before building full auth.

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
| `UPLOAD_PASSCODE` | `/upload`, `/review` | Pick any string — this is the shared teacher passcode. |
| `BLOB_READ_WRITE_TOKEN` | `/upload` | Vercel dashboard → Storage → connect a Blob store to this project. Locally, run `vercel env pull .env.local` after connecting, or copy the token manually. |
| `DATABASE_URL` | `/upload`, `/review` | Vercel dashboard → Storage → connect a Neon Postgres database to this project (this is what shows up as "Postgres" in the Storage tab now — Vercel's own Postgres product was retired in favor of Neon). Locally, run `vercel env pull .env.local`, or point it at a local Postgres instance. The `materials` table is created automatically on first use — no migration step needed. |

Without these, every other page still works — `/upload` and `/review`
will show a clear error instead of crashing.

## Roadmap — next phase

- **Auth**: whitelist-based login for students and teachers (e.g.
  [Supabase Auth](https://supabase.com/auth) or
  [NextAuth](https://authjs.dev)), with two access levels. Teachers are
  expected to be able to upload/edit materials; other permission
  differences are still to be decided. This would replace the shared
  `UPLOAD_PASSCODE` with real per-teacher identity.
- **Public materials page**: `/materials` still shows sample data from
  `src/lib/materials.ts`, separate from the real uploads flowing
  through `/upload` → `/review`. Wiring it up to show approved
  materials from Postgres is a natural next step whenever you're ready.
- **Search**: move from client-side filtering over mock data to a real
  full-text search once `/materials` is backed by Postgres.
- **Relationship to the main Khalsa School site**: link the two once
  this portal is validated; no changes to the old site yet.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new) under your
   personal account (Hobby plan) — no Team needed for this project.
3. In the project's Storage tab, connect a Blob store — this sets
   `BLOB_READ_WRITE_TOKEN` automatically.
4. In the same Storage tab, connect a Neon Postgres database — this
   sets `DATABASE_URL` automatically.
5. In Settings → Environment Variables, add `UPLOAD_PASSCODE` with
   whatever passcode you want teachers to use.
6. Redeploy so the new environment variables take effect.
