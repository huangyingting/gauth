import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  AccountAdmissionError,
  createInvitation,
  expireStaleInvitations,
  getActiveSessionUser,
  isValidRole,
} from "@/lib/account-admission";

export async function GET() {
  const actor = await getActiveSessionUser();
  if (!actor) {
    return NextResponse.json({ error: "unauthorized", message: "Authentication required." }, { status: 401 });
  }
  if (actor.role !== "Admin") {
    return NextResponse.json({ error: "forbidden", message: "Admin role required." }, { status: 403 });
  }

  await expireStaleInvitations();

  const [invitations, users, auditLogs] = await Promise.all([
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        invitedBy: { select: { id: true, name: true, email: true } },
        acceptedBy: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        revokedAt: true,
        createdAt: true,
        invitedBy: { select: { name: true, email: true } },
      },
    }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return NextResponse.json({ invitations, users, auditLogs });
}

export async function POST(request: Request) {
  const actor = await getActiveSessionUser();
  if (!actor) {
    return NextResponse.json({ error: "unauthorized", message: "Authentication required." }, { status: 401 });
  }
  if (actor.role !== "Admin") {
    return NextResponse.json({ error: "forbidden", message: "Admin role required." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const role = body.role && isValidRole(String(body.role)) ? body.role : "Creator";
    const expiresInHours = body.expiresInHours ? Number(body.expiresInHours) : 72;
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "browser";

    const result = await createInvitation({
      email: String(body.email || ""),
      role,
      expiresInHours,
      invitedById: actor.id,
      actorEmail: actor.email,
      ipAddress,
      userAgent,
    });

    const origin =
      request.headers.get("origin") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    return NextResponse.json(
      {
        invitation: result.invitation,
        rawToken: result.rawToken,
        invitePath: result.invitePath,
        inviteUrl: `${origin.replace(/\/$/, "")}${result.invitePath}`,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "internal_error", message: "Failed to create invitation." },
      { status: 500 }
    );
  }
}
