import { NextResponse } from "next/server";
import { answerJapjiQuestion } from "@/lib/japji-agent";
import { checkJapjiRateLimit, getClientIp } from "@/lib/japji-rate-limit";

// Needs Node's fs (to read the bundled skill files) and can take a few tool-use
// round trips to Anthropic, so this isn't edge-compatible and needs more than the
// default timeout.
export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const message =
    typeof body === "object" && body !== null && "message" in body && typeof body.message === "string"
      ? body.message.trim()
      : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "That message is too long." }, { status: 400 });
  }

  // Best-effort per-visitor cap so one browser mashing the button (or a bot
  // that finds this endpoint) can't run up a large bill on its own. If the
  // check itself fails (e.g. DATABASE_URL not set), fail open rather than
  // break the whole feature — the real hard cap is the spend limit set on
  // this key's org/workspace in the Anthropic Console.
  try {
    const rateLimit = await checkJapjiRateLimit(getClientIp(request));
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            rateLimit.reason === "minute"
              ? "That's a lot of questions at once — give it a minute and try again."
              : "That's the most Japji Sahib questions I can answer from this device today — try again tomorrow, or ask a teacher.",
        },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
  } catch (error) {
    console.error("[api/japji-chat] rate limit check failed, allowing request:", error);
  }

  try {
    const answer = await answerJapjiQuestion(message);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[api/japji-chat] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong answering that. Please try again." },
      { status: 500 },
    );
  }
}
