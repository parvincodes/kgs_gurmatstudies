import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import {
  listMaterials,
  createMaterial,
  type MaterialStatus,
} from "@/lib/materials-db";

const VALID_STATUSES: MaterialStatus[] = ["pending", "approved", "flagged"];

export async function GET(request: Request): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && VALID_STATUSES.includes(statusParam as MaterialStatus)
      ? (statusParam as MaterialStatus)
      : undefined;

  try {
    const materials = await listMaterials(status);
    console.log("[api/materials] GET returned", materials.length, "rows");
    return NextResponse.json({ materials });
  } catch (error) {
    console.error("[api/materials] GET failed:", error);
    return NextResponse.json(
      { error: "Database isn't configured. Set DATABASE_URL." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const body = await request.json();
  console.log("[api/materials] POST", {
    pathname: body.pathname,
    subject: body.subject,
    title: body.title,
    size: body.size,
  });
  if (!body.pathname || !body.url || !body.subject || !body.title) {
    console.error("[api/materials] POST missing fields:", body);
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const material = await createMaterial({
      pathname: body.pathname,
      url: body.url,
      subject: body.subject,
      title: body.title,
      size: Number(body.size) || 0,
      uploadedBy: body.uploadedBy || null,
    });
    console.log("[api/materials] created id:", material.id);
    return NextResponse.json({ material });
  } catch (error) {
    console.error("[api/materials] POST failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 },
    );
  }
}
