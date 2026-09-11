import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import { createSurveyResponse, listSurveyResponses, DuplicateChildError } from "@/lib/survey-db";
import { MAX_HOPES, MAX_PRIORITY_TOPICS, isValidSelection } from "@/lib/survey-options";
import { SURVEY_WAVE, getSurveyWindowStatus, formatSurveyWindow } from "@/lib/survey-config";

function trimmedOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function stringArray(value: unknown, max?: number): string[] {
  if (!Array.isArray(value)) return [];
  const strings = value.filter((v): v is string => typeof v === "string");
  return max ? strings.slice(0, max) : strings;
}

export async function POST(request: Request): Promise<NextResponse> {
  const windowStatus = getSurveyWindowStatus();
  if (windowStatus !== "open") {
    return NextResponse.json(
      {
        error:
          windowStatus === "before"
            ? `This survey isn't open yet. It runs ${formatSurveyWindow()}.`
            : `This survey has closed. It ran ${formatSurveyWindow()}.`,
      },
      { status: 403 },
    );
  }

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
      surveyWave: SURVEY_WAVE,
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
    if (error instanceof DuplicateChildError) {
      return NextResponse.json(
        {
          error: `A response for ${childName} has already been submitted for this survey. If that's a mistake, please reach out directly.`,
        },
        { status: 409 },
      );
    }
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

  const { searchParams } = new URL(request.url);
  const wave = searchParams.get("wave") ?? undefined;

  try {
    const responses = await listSurveyResponses(wave);
    return NextResponse.json({ responses });
  } catch (error) {
    console.error("[api/survey] GET failed:", error);
    return NextResponse.json(
      { error: "Database isn't configured. Set DATABASE_URL." },
      { status: 500 },
    );
  }
}
