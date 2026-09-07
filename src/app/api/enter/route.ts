import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import { SITE_GATE_COOKIE, computeGateToken } from "@/lib/site-gate";

export async function POST(request: Request): Promise<NextResponse> {
  const { passcode } = await request.json();

  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const token = await computeGateToken(passcode);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SITE_GATE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
