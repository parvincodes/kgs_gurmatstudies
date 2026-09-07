import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import { createSurveyResponse, listSurveyResponses } from "@/lib/survey-db";

const MAX_PRIORITIES = 2;

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const childName = typeof body.childName === "string" ? body.childName.trim() : "";
  const hopes = typeof body.hopes === "string" ? body.hopes.trim() : "";
  const priorities = Array.isArray(body.priorities)
    ? body.priorities.filter((p: unknown) => typeof p === "string").slice(0, MAX_PRIORITIES)
    : [];

  if (!childName || !hopes || priorities.length === 0) {
    return NextResponse.json(
      { error: "Please fill in your child's name, question 1, and at least one priority." },
      { status: 400 },
    );
  }

  const engagement = Number.isInteger(body.engagement) ? body.engagement : null;

  try {
    await createSurveyResponse({
      childName,
      parentName: typeof body.parentName === "string" ? body.parentName.trim() || null : null,
      hopes,
      priorities,
      engagement,
      relevanceIdea:
        typeof body.relevanceIdea === "string" ? body.relevanceIdea.trim() || null : null,
      notes: typeof body.notes === "string" ? body.notes.trim() || null : null,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/survey] POST failed:", error);
    return NextResponse.json(
      { error: "Something went wrong saving your response. Please try again." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  try {
    const responses = await listSurveyResponses();
    return NextResponse.json({ responses });
  } catch (error) {
    console.error("[api/survey] GET failed:", error);
    return NextResponse.json(
      { error: "Database isn't configured. Set DATABASE_URL." },
      { status: 500 },
    );
  }
}
