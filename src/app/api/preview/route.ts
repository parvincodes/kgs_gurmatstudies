import { NextResponse } from "next/server";

// Vercel Blob doesn't let us set Content-Disposition at upload time (it's
// decided server-side, and PDFs default to "attachment"), so browsers show
// a download prompt instead of rendering the PDF in an <iframe>. This route
// re-serves the same bytes with an explicit "inline" disposition so the
// preview panel can actually display them.
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!targetUrl.hostname.endsWith(".public.blob.vercel-storage.com")) {
    return NextResponse.json(
      { error: "Only Vercel Blob URLs are allowed" },
      { status: 400 },
    );
  }

  const upstream = await fetch(targetUrl.toString());
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 502 },
    );
  }

  return new NextResponse(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/pdf",
      "content-disposition": "inline",
      "cache-control": "public, max-age=3600",
    },
  });
}
