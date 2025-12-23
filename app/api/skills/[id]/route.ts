import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/skills/[id] - Get single skill
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const skill = await db.skill.findUnique({
      where: { id: parseInt(id) },
    });

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    let technologies = [];
    try {
      technologies = skill.technologies ? JSON.parse(skill.technologies) : [];
    } catch (e) {
      console.error("Error parsing technologies:", e);
    }

    return NextResponse.json({
      ...skill,
      technologies,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch skill" }, { status: 500 });
  }
}

// PUT /api/skills/[id] - Update skill
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { category, name, description, icon, technologies, order } = body;

    const skill = await db.skill.update({
      where: { id: parseInt(id) },
      data: {
        category: category || "",
        name: name || category || "",
        description: description || "",
        icon: icon || "",
        technologies: JSON.stringify(technologies || []),
        order: order || 0,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error updating skill:", error);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

// DELETE /api/skills/[id] - Delete skill
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.skill.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: "Skill deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
