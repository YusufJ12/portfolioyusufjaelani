import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/education - Get all education & certifications
export async function GET() {
  try {
    const education = await db.education.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json(
      { error: "Failed to fetch education" },
      { status: 500 }
    );
  }
}

// POST /api/education - Create new education/certification
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, title, institution, year, certificateUrl, order } = body;
    
    const education = await db.education.create({
      data: {
        type: type || "Education",
        title: title || "",
        institution: institution || "",
        year: year || "",
        certificateUrl: certificateUrl || null,
        order: order || 0,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json(
      { error: "Failed to create education" },
      { status: 500 }
    );
  }
}
