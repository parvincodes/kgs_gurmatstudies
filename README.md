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
- **In-browser file preview** — clicking a material on `/upload` or
  `/review` opens it in a slide-in side panel instead of downloading:
  PDFs render directly, Word/PowerPoint render via Google's public
  document viewer, audio/video play with native browser controls.
  See `src/components/FilePreviewPanel.tsx`.
- **Search widget** — a floating chat-style widget (bottom-right,
  every page) lets anyone keyword-search **approved** materials by
  title/description/subject and open a result straight into the same
  preview panel. This is basic keyword search over existing metadata,
  not an AI that reads inside documents — see the roadmap below for
  what a real "ask questions about the content" version would need.

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
| `BLOB_READ_WRITE_TOKEN` | `/upload` | Vercel dashboard → Storage → connect a Blob store to this project. Locally, run `vercel env pull .env.local` after connecting, or copy the token manually. **When creating the store, you must choose "Public" access — this cannot be changed later, and our code uploads with `access: "public"` everywhere.** A private store causes every upload to fail with a confusing CORS error in the browser rather than a clear message, because Vercel's blob endpoint doesn't send CORS headers on that particular rejection. |
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
- **AI document Q&A**: the search widget currently matches only title/
  description/subject text already in Postgres — it can't answer
  questions about what's actually inside a PDF or audio file. A real
  version would need: extracting text from each upload (PDF/Word
  parsing, audio transcription), storing it (likely as embeddings for
  semantic search), and calling an LLM API (e.g. the
  [Claude API](https://docs.claude.com)) to answer questions grounded
  in that content. That's meaningfully more infrastructure and an
  ongoing API cost, so it's deliberately deferred until the basic
  search widget proves useful.
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
