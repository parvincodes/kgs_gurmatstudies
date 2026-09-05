import { list } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";

export async function GET(request: Request): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  try {
    const { blobs } = await list({ prefix: "materials/" });

    const files = blobs
      .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      .map((blob) => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: blob.uploadedAt,
      }));

    return NextResponse.json({ files });
  } catch {
    return NextResponse.json(
      { error: "Blob storage isn't configured. Set BLOB_READ_WRITE_TOKEN." },
      { status: 500 },
    );
  }
}
