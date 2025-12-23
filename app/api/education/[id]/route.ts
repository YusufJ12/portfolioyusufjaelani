import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/education/[id] - Get single education item
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const education = await db.education.findUnique({
      where: { id: parseInt(id) },
    });

    if (!education) {
      return NextResponse.json({ error: "Education not found" }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// PUT /api/education/[id] - Update education item
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, title, institution, year, certificateUrl, order } = body;

    const education = await db.education.update({
      where: { id: parseInt(id) },
      data: {
        type: type || "Education",
        title: title || "",
        institution: institution || "",
        year: year || "",
        certificateUrl: certificateUrl || null,
        order: order || 0,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

// DELETE /api/education/[id] - Delete education item
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.education.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Education deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
