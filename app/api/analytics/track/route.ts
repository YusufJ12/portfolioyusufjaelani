import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { isIP } from "net";
import { isAdminAuthenticated } from "@/lib/admin-auth";

// POST /api/analytics/track - Track page visit
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page =
      typeof body.page === "string" ? body.page.slice(0, 500) : "/";

    const headersList = await headers();
    
    // Get IP from various headers (Vercel, Cloudflare, etc.)
    const ip = 
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      headersList.get("cf-connecting-ip") ||
      "unknown";

    const userAgent = headersList.get("user-agent") || null;
    const referer = headersList.get("referer") || null;

    // Get geolocation from IP (using free IP-API)
    let country = null;
    let city = null;

    if (isIP(ip) && ip !== "::1" && ip !== "127.0.0.1") {
      try {
        const geoRes = await fetch(
          `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=country,city`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          country = geoData.country || null;
          city = geoData.city || null;
        }
      } catch {
        // Geolocation failed, continue without it
      }
    }

    // Save to database
    await db.visitor.create({
      data: {
        ip,
        country,
        city,
        page,
        userAgent,
        referer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET /api/analytics/track - Get analytics data (for admin)
export async function GET(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const requestedDays = Number.parseInt(searchParams.get("days") || "7", 10);
    const days = Number.isFinite(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), 365)
      : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get visitors in date range
    const visitors = await db.visitor.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    // Get stats
    const totalVisits = await db.visitor.count({
      where: { createdAt: { gte: startDate } },
    });

    const uniqueIps = await db.visitor.groupBy({
      by: ["ip"],
      where: { createdAt: { gte: startDate } },
    });

    // Get top countries
    const countryStats = await db.visitor.groupBy({
      by: ["country"],
      where: { createdAt: { gte: startDate } },
      _count: { country: true },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    });

    // Get top pages
    const pageStats = await db.visitor.groupBy({
      by: ["page"],
      where: { createdAt: { gte: startDate } },
      _count: { page: true },
      orderBy: { _count: { page: "desc" } },
      take: 10,
    });

    return NextResponse.json({
      visitors,
      stats: {
        totalVisits,
        uniqueVisitors: uniqueIps.length,
        topCountries: countryStats.map((c) => ({
          country: c.country || "Unknown",
          count: c._count.country,
        })),
        topPages: pageStats.map((p) => ({
          page: p.page,
          count: p._count.page,
        })),
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
