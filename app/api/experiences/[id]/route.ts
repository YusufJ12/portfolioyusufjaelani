import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/experiences/[id] - Get single experience
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experience = await db.experience.findUnique({
      where: { id: parseInt(id) },
    });

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    let achievements = [];
    let websiteLinks = [];
    try {
      achievements = experience.achievements ? JSON.parse(experience.achievements) : [];
    } catch (e) {
      console.error("Error parsing achievements:", e);
    }
    try {
      websiteLinks = experience.websiteLinks ? JSON.parse(experience.websiteLinks) : [];
    } catch (e) {
      console.error("Error parsing websiteLinks:", e);
    }

    return NextResponse.json({
      ...experience,
      achievements,
      websiteLinks,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch experience" }, { status: 500 });
  }
}

// PUT /api/experiences/[id] - Update experience
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, company, description, startDate, endDate, achievements, websiteLinks, order } = body;

    const experience = await db.experience.update({
      where: { id: parseInt(id) },
      data: {
        title: title || "",
        company: company || "",
        description: description || "",
        startDate: startDate || "",
        endDate: endDate || null,
        achievements: JSON.stringify(achievements || []),
        websiteLinks: JSON.stringify(websiteLinks || []),
        order: order || 0,
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 });
  }
}

// DELETE /api/experiences/[id] - Delete experience
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.experience.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Experience deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
