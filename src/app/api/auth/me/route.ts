import { NextResponse } from "next/server";
import { getActiveSessionUser } from "@/lib/account-admission";

export async function GET() {
  const user = await getActiveSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      planTier: user.plan,
      queriesRemaining: user.queriesRemaining,
      aiProRemaining: user.aiProRemaining,
      proQuotaRemaining: user.aiProRemaining,
      atlasCreditsRemaining: user.atlasCreditsRemaining,
      courseCreatesRemaining: user.courseCreatesRemaining,
    },
  });
}
