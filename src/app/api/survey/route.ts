import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import { createSurveyResponse, listSurveyResponses } from "@/lib/survey-db";
import { MAX_HOPES, MAX_PRIORITY_TOPICS, isValidSelection } from "@/lib/survey-options";

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
  const hopesSelected = stringArray(body.hopesSelected, MAX_HOPES);
  const hopesOther = trimmedOrNull(body.hopesOther);
  const discussionSelected = stringArray(body.discussionSelected);
  const discussionOther = trimmedOrNull(body.discussionOther);
  const strugglesSelected = stringArray(body.strugglesSelected);
  const strugglesOther = trimmedOrNull(body.strugglesOther);
  const practiceHabits = stringArray(body.practiceHabits);
  const priorityTopics = stringArray(body.priorityTopics, MAX_PRIORITY_TOPICS);

  if (
    !childName ||
    !isValidSelection(hopesSelected, hopesOther) ||
    !isValidSelection(discussionSelected, discussionOther) ||
    !isValidSelection(strugglesSelected, strugglesOther) ||
    practiceHabits.length === 0 ||
    priorityTopics.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Please answer all five questions — if you picked \"Other,\" add a quick note too.",
      },
      { status: 400 },
    );
  }

  try {
    await createSurveyResponse({
      childName,
      parentName: trimmedOrNull(body.parentName),
      hopesSelected,
      hopesOther,
      discussionSelected,
      discussionOther,
      strugglesSelected,
      strugglesOther,
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
