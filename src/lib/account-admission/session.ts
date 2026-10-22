import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
export const SESSION_UPDATE_AGE_SECONDS = 24 * 60 * 60;

export const SESSION_COOKIES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

const IS_SECURE_URL = process.env.NEXTAUTH_URL
  ? process.env.NEXTAUTH_URL.startsWith("https:")
  : process.env.NODE_ENV === "production";

export const SESSION_COOKIE_NAME = IS_SECURE_URL
  ? SESSION_COOKIES[1]
  : SESSION_COOKIES[0];

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: IS_SECURE_URL,
};

export async function createDatabaseSession(userId: string, now = new Date()) {
  const expires = new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
  return prisma.session.create({
    data: {
      sessionToken: randomBytes(32).toString("base64url"),
      userId,
      expires,
    },
  });
}

export function setDatabaseSessionCookie(
  response: NextResponse,
  session: { sessionToken: string; expires: Date }
): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: session.sessionToken,
    expires: session.expires,
    ...SESSION_COOKIE_OPTIONS,
  });
}

export function clearDatabaseSessionCookie(response: NextResponse): void {
  for (const name of SESSION_COOKIES) {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  }
}

export async function getActiveSessionUser() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(SESSION_COOKIES[1])?.value ||
      cookieStore.get(SESSION_COOKIES[0])?.value;
    if (!token) return null;

    const sessionRecord = await prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!sessionRecord) return null;
    if (sessionRecord.expires <= new Date()) {
      await prisma.session.deleteMany({ where: { id: sessionRecord.id } });
      return null;
    }
    if (sessionRecord.user.revokedAt !== null) {
      await prisma.session.deleteMany({ where: { userId: sessionRecord.userId } });
      return null;
    }
    return sessionRecord.user;
  } catch {
    return null;
  }
}

export const getAuthenticatedSessionUser = getActiveSessionUser;
