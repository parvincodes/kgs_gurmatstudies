import { NextResponse } from "next/server";
import { listMaterials } from "@/lib/materials-db";

export async function GET(): Promise<NextResponse> {
  try {
    const materials = await listMaterials("approved");
    const publicMaterials = materials.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      subject: m.subject,
      url: m.url,
      pathname: m.pathname,
      size: m.size,
    }));
    return NextResponse.json({ materials: publicMaterials });
  } catch (error) {
    console.error("[api/public/materials] failed:", error);
    return NextResponse.json({ materials: [] });
  }
}
