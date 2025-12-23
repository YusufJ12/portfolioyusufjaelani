import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/social-links - Get all social links
export async function GET() {
  try {
    const socialLinks = await db.socialLink.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json(socialLinks);
  } catch (error) {
    console.error("Error fetching social links:", error);
    return NextResponse.json(
      { error: "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

// POST /api/social-links - Create new social link
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const socialLink = await db.socialLink.create({
      data: body,
    });

    return NextResponse.json(socialLink, { status: 201 });
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Failed to create social link" },
      { status: 500 }
    );
  }
}
