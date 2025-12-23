import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Project } from "@prisma/client";

// GET /api/projects - Get all projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    const where: Record<string, unknown> = {};
    
    if (featured === "true") {
      where.featured = true;
    }
    
    if (category && category !== "all") {
      where.category = category;
    }

    const projects = await db.project.findMany({
      where,
      orderBy: { order: "asc" },
      take: limit ? parseInt(limit) : undefined,
    });

    // Parse tags JSON string for each project
    const parsedProjects = projects.map((project: Project) => {
      let tags = [];
      try {
        tags = JSON.parse(project.tags);
      } catch (e) {
        console.error("Failed to parse tags for project", project.id, e);
      }
      return {
        ...project,
        tags,
      };
    });

    return NextResponse.json(parsedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const project = await db.project.create({
      data: {
        ...body,
        tags: JSON.stringify(body.tags || []),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
