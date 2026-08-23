import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from "@/lib/admin-auth";

// POST /api/admin/login - Admin login
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    let admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      const allAdmins = await db.admin.findMany();
      admin =
        allAdmins.find(
          (a) => a.email.trim().toLowerCase() === normalizedEmail
        ) || null;
    }

    if (!admin) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const sessionToken = createAdminSessionToken(admin.id);
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      sessionToken,
      adminSessionCookieOptions
    );
    return response;
  } catch (error) {
    console.error("[Login] Error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
