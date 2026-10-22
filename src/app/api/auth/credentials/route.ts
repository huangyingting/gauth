import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  AccountAdmissionError,
  authenticateCredentials,
  clearDatabaseSessionCookie,
  SESSION_COOKIES,
  setDatabaseSessionCookie,
} from "@/lib/account-admission";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "browser";

    const { user, session } = await authenticateCredentials({
      email: String(body.email || ""),
      password: String(body.password || ""),
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        plan: user.plan,
      },
    });
    setDatabaseSessionCookie(response, session);
    return response;
  } catch (err) {
    if (err instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "internal_error", message: "Sign-in failed." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(SESSION_COOKIES[1])?.value ||
      cookieStore.get(SESSION_COOKIES[0])?.value;
    if (token) {
      await prisma.session.deleteMany({ where: { sessionToken: token } });
    }
    const response = NextResponse.json({ ok: true });
    clearDatabaseSessionCookie(response);
    return response;
  } catch {
    const response = NextResponse.json({ ok: true });
    clearDatabaseSessionCookie(response);
    return response;
  }
}
