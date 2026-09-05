import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Temporary diagnostic route — confirms the Blob store/token work when
// written to directly from the server, bypassing the browser entirely.
// Safe to delete once the client-upload CORS issue is resolved.
export async function GET(): Promise<NextResponse> {
  try {
    const blob = await put(
      `materials/_debug/test-${Date.now()}.txt`,
      "server-side put() test",
      { access: "public" },
    );
    console.log("[debug-blob-test] server-side put() succeeded:", blob.url);
    return NextResponse.json({ ok: true, url: blob.url });
  } catch (error) {
    console.error("[debug-blob-test] server-side put() failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
