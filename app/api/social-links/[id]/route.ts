import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/social-links/[id] - Get single social link
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const link = await db.socialLink.findUnique({
      where: { id: parseInt(id) },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error fetching social link:", error);
    return NextResponse.json(
      { error: "Failed to fetch social link" },
      { status: 500 }
    );
  }
}

// PUT /api/social-links/[id] - Update social link
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const link = await db.socialLink.update({
      where: { id: parseInt(id) },
      data: body,
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating social link:", error);
    return NextResponse.json(
      { error: "Failed to update social link" },
      { status: 500 }
    );
  }
}

// DELETE /api/social-links/[id] - Delete social link
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.socialLink.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Social link deleted" });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: "Failed to delete social link" },
      { status: 500 }
    );
  }
}
