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
    return NextResponse.json({ materials });
  } catch {
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
  if (!body.pathname || !body.url || !body.subject || !body.title) {
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
    return NextResponse.json({ material });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save" },
      { status: 500 },
    );
  }
}
