import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Skill } from "@prisma/client";

// GET /api/skills - Get all skills
export async function GET() {
  try {
    const skills = await db.skill.findMany({
      orderBy: { order: "asc" },
    });

    // Parse technologies JSON string for each skill
    const parsedSkills = skills.map((skill: Skill) => {
      let technologies = [];
      try {
        technologies = skill.technologies ? JSON.parse(skill.technologies) : [];
      } catch (e) {
        console.error(`Error parsing technologies for skill ${skill.id}:`, e);
      }
      return {
        ...skill,
        technologies,
      };
    });

    return NextResponse.json(parsedSkills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

// POST /api/skills - Create new skill
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, name, description, icon, technologies, order } = body;
    
    const skill = await db.skill.create({
      data: {
        category: category || "",
        name: name || category || "", // Default name to category
        description: description || "",
        icon: icon || "",
        technologies: JSON.stringify(technologies || []),
        order: order || 0,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
