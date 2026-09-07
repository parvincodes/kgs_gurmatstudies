import { NextResponse, type NextRequest } from "next/server";
import { SITE_GATE_COOKIE, isValidGateToken } from "@/lib/site-gate";

const ALLOWED_PATHS = ["/enter", "/api/enter"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (ALLOWED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SITE_GATE_COOKIE)?.value;
  if (await isValidGateToken(token)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/enter";
  url.search = "";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
