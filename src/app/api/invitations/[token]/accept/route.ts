import { NextResponse } from "next/server";
import {
  acceptInvitation,
  AccountAdmissionError,
  setDatabaseSessionCookie,
} from "@/lib/account-admission";

export async function POST(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Malformed JSON request body." },
      { status: 400 }
    );
  }

  try {
    const { token } = await context.params;
    const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "browser";

    const { user, session } = await acceptInvitation({
      rawToken: token,
      email: body.email ? String(body.email) : undefined,
      name: String(body.name || ""),
      password: String(body.password || ""),
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      {
        ok: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
        },
      },
      { status: 201 }
    );
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
      { error: "internal_error", message: "Could not accept invitation." },
      { status: 500 }
    );
  }
}
