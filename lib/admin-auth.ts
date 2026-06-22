import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const ADMIN_SESSION_COOKIE = "admin-session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

type SessionPayload = {
  adminId: number;
  expiresAt: number;
};

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET;

  if (!secret && process.env.NODE_ENV !== "production") {
    return "development-only-admin-session-secret-change-me";
  }

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be configured with at least 32 characters"
    );
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

export function createAdminSessionToken(adminId: number) {
  const payload: SessionPayload = {
    adminId,
    expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

function decodeAdminSessionToken(token: string): SessionPayload | null {
  const [encodedPayload, suppliedSignature] = token.split(".");
  if (!encodedPayload || !suppliedSignature) return null;

  const expectedSignature = sign(encodedPayload);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SessionPayload;

    if (
      !Number.isInteger(payload.adminId) ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = decodeAdminSessionToken(token);
  if (!payload) return null;

  return db.admin.findUnique({
    where: { id: payload.adminId },
    select: { id: true, email: true },
  });
}

export async function isAdminAuthenticated() {
  return Boolean(await getAuthenticatedAdmin());
}

export const adminSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: SESSION_MAX_AGE_SECONDS,
  path: "/",
};
