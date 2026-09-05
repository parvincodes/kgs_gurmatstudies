import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isValidPasscode } from "@/lib/passcode";
import {
  updateMaterialDetails,
  reviewMaterial,
  deleteMaterialById,
} from "@/lib/materials-db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isInteger(materialId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await request.json();

  try {
    const material =
      body.action === "review"
        ? await reviewMaterial(
            materialId,
            body.status,
            body.reviewedBy ?? "",
            body.reviewNote ?? "",
          )
        : await updateMaterialDetails(
            materialId,
            body.title ?? "",
            body.description ?? "",
          );

    if (!material) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ material });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const passcode = request.headers.get("x-upload-passcode");
  if (!isValidPasscode(passcode)) {
    return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
  }

  const { id } = await params;
  const materialId = Number(id);
  if (!Number.isInteger(materialId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const deleted = await deleteMaterialById(materialId);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    await del(deleted.url);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete" },
      { status: 500 },
    );
  }
}
