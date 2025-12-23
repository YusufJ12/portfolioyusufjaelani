import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/profile - Get profile data
export async function GET() {
  try {
    const profile = await db.profile.findFirst();
    
    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    const profile = await db.profile.upsert({
      where: { id: 1 },
      update: body,
      create: {
        ...body,
        id: 1,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
