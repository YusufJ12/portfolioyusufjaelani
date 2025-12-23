import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/experiences - Get all experiences
export async function GET() {
  try {
    const experiences = await db.experience.findMany({
      orderBy: { order: "asc" },
    });

    // Parse JSON strings for each experience
    const parsedExperiences = experiences.map((exp: any) => {
      let achievements = [];
      let websiteLinks = [];
      try {
        achievements = exp.achievements ? JSON.parse(exp.achievements) : [];
      } catch (e) {
        console.error(`Error parsing achievements for exp ${exp.id}:`, e);
      }
      try {
        websiteLinks = exp.websiteLinks ? JSON.parse(exp.websiteLinks) : [];
      } catch (e) {
        console.error(`Error parsing websiteLinks for exp ${exp.id}:`, e);
      }

      return {
        ...exp,
        achievements,
        websiteLinks,
      };
    });

    return NextResponse.json(parsedExperiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST /api/experiences - Create new experience
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, company, description, startDate, endDate, achievements, websiteLinks, order } = body;
    
    const experience = await db.experience.create({
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

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
