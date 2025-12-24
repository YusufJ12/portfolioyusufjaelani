import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// GET /api/admin/session - Check admin session
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("admin-session");

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Decode and validate session
    try {
      const decoded = Buffer.from(sessionCookie.value, "base64").toString();
      const [adminId, timestamp] = decoded.split(":");
      
      // Check if session is still valid (24 hours)
      const sessionAge = Date.now() - parseInt(timestamp);
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms

      if (sessionAge > maxAge) {
        return NextResponse.json(
          { authenticated: false, reason: "Session expired" },
          { status: 401 }
        );
      }

      // Fetch admin email from database
      const { db } = await import("@/lib/db");
      const admin = await db.admin.findUnique({
        where: { id: parseInt(adminId) },
        select: { email: true },
      });

      return NextResponse.json({
        authenticated: true,
        adminId: parseInt(adminId),
        email: admin?.email || "admin@example.com",
      });
    } catch {
      return NextResponse.json(
        { authenticated: false, reason: "Invalid session" },
        { status: 401 }
      );
    }
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
  
  response.cookies.delete("admin-session");
  
  return response;
}
