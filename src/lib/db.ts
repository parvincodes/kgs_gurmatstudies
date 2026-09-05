import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
attachDatabasePool(pool);

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS materials (
          id SERIAL PRIMARY KEY,
          pathname TEXT NOT NULL UNIQUE,
          url TEXT NOT NULL,
          subject TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          size BIGINT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          uploaded_by TEXT,
          uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          reviewed_by TEXT,
          reviewed_at TIMESTAMPTZ,
          review_note TEXT
        )`,
      )
      .then(() => undefined);
  }
  return schemaReady;
}
