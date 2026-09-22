import { NextResponse } from "next/server";
import { answerJapjiQuestion } from "@/lib/japji-agent";

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
