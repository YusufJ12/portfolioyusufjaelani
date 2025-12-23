import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// POST /api/admin/login - Admin login
export async function POST(request: Request) {
  try {
    console.log("[Login] Starting login process...");
    const body = await request.json();
    const { email, password } = body;
    console.log("[Login] Email:", email);

    // Validate
    if (!email || !password) {
      console.log("[Login] Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin
    console.log("[Login] Finding admin...");
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    console.log("[Login] Admin found:", !!admin);

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    console.log("[Login] Comparing password...");
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    console.log("[Login] Password valid:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session token (simple approach - in production use proper JWT)
    const sessionToken = Buffer.from(`${admin.id}:${Date.now()}`).toString("base64");
    console.log("[Login] Session token created");

    // Set cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

    response.cookies.set("admin-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    console.log("[Login] Success!");
    return response;
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { error: "Login failed", details: String(error) },
      { status: 500 }
    );
  }
}
