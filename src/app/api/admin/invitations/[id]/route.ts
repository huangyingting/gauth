import { NextResponse } from "next/server";
import {
  AccountAdmissionError,
  getActiveSessionUser,
  revokeInvitation,
} from "@/lib/account-admission";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const actor = await getActiveSessionUser();
  if (!actor) {
    return NextResponse.json({ error: "unauthorized", message: "Authentication required." }, { status: 401 });
  }
  if (actor.role !== "Admin") {
    return NextResponse.json({ error: "forbidden", message: "Admin role required." }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "browser";

    const updated = await revokeInvitation({
      invitationId: id,
      actorId: actor.id,
      actorEmail: actor.email,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ ok: true, invitation: updated });
  } catch (err) {
    if (err instanceof AccountAdmissionError) {
      return NextResponse.json(
        { error: err.code, message: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "internal_error", message: "Failed to revoke invitation." },
      { status: 500 }
    );
  }
}
