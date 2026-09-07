import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import { createSurveyResponse, listSurveyResponses } from "@/lib/survey-db";
import { MAX_PRIORITY_TOPICS } from "@/lib/survey-options";

function trimmedOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown, max?: number): string[] {
  if (!Array.isArray(value)) return [];
  const strings = value.filter((v): v is string => typeof v === "string");
  return max ? strings.slice(0, max) : strings;
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json();

  const childName = typeof body.childName === "string" ? body.childName.trim() : "";
  const hopes = typeof body.hopes === "string" ? body.hopes.trim() : "";
  const discussionTopics = trimmedOrNull(body.discussionTopics);
  const identityStruggles = trimmedOrNull(body.identityStruggles);
  const practiceHabits = stringArray(body.practiceHabits);
  const priorityTopics = stringArray(body.priorityTopics, MAX_PRIORITY_TOPICS);

  if (
    !childName ||
    !hopes ||
    !discussionTopics ||
    !identityStruggles ||
    practiceHabits.length === 0 ||
    priorityTopics.length === 0
  ) {
    return NextResponse.json(
      { error: "Please answer all five questions before submitting." },
      { status: 400 },
    );
  }

  try {
    await createSurveyResponse({
      childName,
      parentName: trimmedOrNull(body.parentName),
      hopes,
      discussionTopics,
      identityStruggles,
      practiceHabits,
      priorityTopics,
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
