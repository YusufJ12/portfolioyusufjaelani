import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

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
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const existingProfile = await db.profile.findFirst();

    if (!existingProfile) {
      const requiredFields = ["name", "title", "description", "email"] as const;
      const hasRequiredFields = requiredFields.every(
        (field) => typeof body[field] === "string" && body[field].trim()
      );

      if (!hasRequiredFields) {
        return NextResponse.json(
          { error: "Complete profile data is required" },
          { status: 400 }
        );
      }
    }

    const allowedFields = {
      name: body.name,
      title: body.title,
      description: body.description,
      email: body.email,
      phone: body.phone,
      location: body.location,
      resumeUrl: body.resumeUrl,
      avatarUrl: body.avatarUrl,
      availableForFreelance: body.availableForFreelance,
      heroTagline: body.heroTagline,
    };
    const data = Object.fromEntries(
      Object.entries(allowedFields).filter(([, value]) => value !== undefined)
    );

    const profile = existingProfile
      ? await db.profile.update({
          where: { id: existingProfile.id },
          data,
        })
      : await db.profile.create({
          data: data as {
            name: string;
            title: string;
            description: string;
            email: string;
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
