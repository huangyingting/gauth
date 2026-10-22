import { NextResponse } from "next/server";
import { inspectInvitation } from "@/lib/account-admission";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const result = await inspectInvitation(token);
  return NextResponse.json(result, { status: result.httpStatus });
}
