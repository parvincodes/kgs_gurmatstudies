import { pool } from "./db";

// Generous enough that a class of students sharing one school IP isn't
// blocked mid-lesson, but bounded enough that one visitor mashing the button
// (or a bot that finds the endpoint) can't run up a large bill before anyone
// notices. The real hard cap is the monthly spend limit set on this key's
// org/workspace in the Anthropic Console — this is a courtesy layer on top
// of that, not a substitute for it.
const PER_MINUTE_LIMIT = 6;
const PER_DAY_LIMIT = 60;

let schemaReady: Promise<void> | null = null;

function ensureRateLimitSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS japji_chat_requests (
          id SERIAL PRIMARY KEY,
          ip_hash TEXT NOT NULL,
          requested_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS japji_chat_requests_ip_time
          ON japji_chat_requests (ip_hash, requested_at);`,
      )
      .then(() => undefined)
      .catch((error) => {
        console.error("[japji-rate-limit] failed to create schema:", error);
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

// Hashed rather than stored raw — this table only exists to count requests
// per visitor, and most of this site's visitors are minors, so there's no
// reason to keep their raw IP addresses around even briefly.
async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("hex");
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number; reason: "minute" | "day" };

export async function checkJapjiRateLimit(ip: string): Promise<RateLimitResult> {
  await ensureRateLimitSchema();
  const ipHash = await hashIp(ip);

  // Opportunistic cleanup so this table doesn't grow unbounded — cheap at
  // this traffic volume, no separate cron job needed.
  await pool.query(`DELETE FROM japji_chat_requests WHERE requested_at < now() - interval '2 days'`);

  const { rows } = await pool.query<{ minute_count: string; day_count: string }>(
    `SELECT
       count(*) FILTER (WHERE requested_at > now() - interval '1 minute') AS minute_count,
       count(*) FILTER (WHERE requested_at > now() - interval '1 day') AS day_count
     FROM japji_chat_requests
     WHERE ip_hash = $1`,
    [ipHash],
  );

  const minuteCount = Number(rows[0]?.minute_count ?? 0);
  const dayCount = Number(rows[0]?.day_count ?? 0);

  if (minuteCount >= PER_MINUTE_LIMIT) {
    return { allowed: false, retryAfterSeconds: 60, reason: "minute" };
  }
  if (dayCount >= PER_DAY_LIMIT) {
    return { allowed: false, retryAfterSeconds: 24 * 60 * 60, reason: "day" };
  }

  await pool.query(`INSERT INTO japji_chat_requests (ip_hash) VALUES ($1)`, [ipHash]);
  return { allowed: true };
}
