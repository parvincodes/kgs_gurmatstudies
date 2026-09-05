import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "audio/*",
  "video/*",
];

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  console.log("[api/upload] event type:", body.type);

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log("[api/upload] token requested for:", pathname);

        let passcode: string | undefined;
        try {
          const parsed = clientPayload ? JSON.parse(clientPayload) : {};
          passcode = parsed.passcode;
        } catch {
          // fall through to invalid passcode
        }

        if (!isValidPasscode(passcode)) {
          console.error(
            "[api/upload] passcode check failed for:",
            pathname,
            "(is UPLOAD_PASSCODE set on this deployment?)",
          );
          throw new Error("Invalid passcode");
        }
        console.log("[api/upload] passcode OK, issuing token for:", pathname);

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[api/upload] failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
