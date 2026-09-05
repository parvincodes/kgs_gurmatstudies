import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";

export async function POST(request: Request): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const { url } = (await request.json()) as { url?: string };
  if (!url || !url.startsWith("https://")) {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  await del(url);
  return NextResponse.json({ ok: true });
}
