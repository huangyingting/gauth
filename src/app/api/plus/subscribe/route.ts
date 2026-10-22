import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSessionUser } from "@/lib/account-admission/session";
import { writeAuditLog } from "@/lib/account-admission/audit";

export async function POST(req: Request) {
  const user = await getActiveSessionUser();
  const body = (await req.json().catch(() => ({}))) as {
    plan?: "monthly" | "quarterly" | "annual";
  };

  const plan = body.plan || "annual";
  const planPricing = {
    monthly: { label: "Monthly", pricePerMonth: "$11.99", billedText: "$11.99 billed every month" },
    quarterly: { label: "Quarterly", pricePerMonth: "$8.99", billedText: "$26.99 billed every 3 months" },
    annual: { label: "Annually", pricePerMonth: "$5.83", billedText: "$69.99 billed every 12 months" },
  }[plan] || { label: "Annually", pricePerMonth: "$5.83", billedText: "$69.99 billed every 12 months" };

  if (user) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          plan: `PLUS_${plan.toUpperCase()}`,
          queriesRemaining: 999,
          aiProRemaining: 999,
        },
      });
      await writeAuditLog(tx, {
        action: "USER_PLAN_UPGRADED",
        actorId: user.id,
        actorEmail: user.email,
        targetType: "User",
        targetId: user.id,
        metadata: { plan, ...planPricing },
      });
    });
  }

  return NextResponse.json({
    ok: true,
    plan,
    ...planPricing,
    message: `Gauth PLUS (${planPricing.label}) activated with unlimited answers, 50,000+ experts, and ad-free study.`,
  });
}
