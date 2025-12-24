import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// PUT /api/admin/update - Update admin credentials
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get admin ID from session
    const decoded = Buffer.from(sessionCookie.value, "base64").toString();
    const [adminId] = decoded.split(":");

    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    // Get current admin
    const admin = await db.admin.findUnique({
      where: { id: parseInt(adminId) },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        admin.passwordHash
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: { email?: string; passwordHash?: string } = {};

    if (email && email !== admin.email) {
      // Check if email already exists
      const existingAdmin = await db.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    if (newPassword) {
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Update admin
    if (Object.keys(updateData).length > 0) {
      await db.admin.update({
        where: { id: parseInt(adminId) },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}
