import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  record.count += 1;
  return record.count > limit;
}

// Cleanup expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (pathname.startsWith("/api")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Strict rate limit for admin login (max 10 attempts per 15 minutes)
    if (pathname === "/api/admin/login" && request.method === "POST") {
      if (isRateLimited(`login:${ip}`, 10, 15 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Too many login attempts. Please try again after 15 minutes." },
          { status: 429 }
        );
      }
    }

    // Rate limit for contact form submissions (max 5 per 10 minutes)
    if (pathname === "/api/contact" && request.method === "POST") {
      if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
        return NextResponse.json(
          { error: "Too many messages sent. Please try again later." },
          { status: 429 }
        );
      }
    }

    // General API rate limit (max 120 requests per minute)
    if (isRateLimited(`api:${ip}`, 120, 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
