import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAuthenticatedAdmin,
} from "@/lib/admin-auth";

// GET /api/admin/session - Check admin session
export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      adminId: admin.id,
      email: admin.email,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { error: "Session check failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/session - Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.delete(ADMIN_SESSION_COOKIE);
  
  return response;
}
