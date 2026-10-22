import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getActiveSessionUser } from "@/lib/account-admission/session";
import { writeAuditLog } from "@/lib/account-admission/audit";

const VALID_PLANS = ["monthly", "quarterly", "annual"] as const;
type ValidPlan = (typeof VALID_PLANS)[number];

export async function POST(req: Request) {
  let body: { plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Malformed JSON request body." },
      { status: 400 }
    );
  }

  const user = await getActiveSessionUser();
  if (user?.role === "Viewer") {
    return NextResponse.json(
      {
        error: "forbidden",
        message: "Viewer role is read-only and cannot modify subscription plans.",
      },
      { status: 403 }
    );
  }

  if (
    body.plan !== undefined &&
    (typeof body.plan !== "string" ||
      !VALID_PLANS.includes(body.plan as ValidPlan))
  ) {
    return NextResponse.json(
      {
        error: "invalid_plan",
        message: "Plan must be one of monthly, quarterly, or annual.",
      },
      { status: 400 }
    );
  }

  const plan: ValidPlan = (body.plan as ValidPlan) || "annual";
  const planPricing = {
    monthly: { label: "Monthly", pricePerMonth: "$11.99", billedText: "$11.99 billed every month" },
    quarterly: { label: "Quarterly", pricePerMonth: "$8.99", billedText: "$26.99 billed every 3 months" },
    annual: { label: "Annually", pricePerMonth: "$5.83", billedText: "$69.99 billed every 12 months" },
  }[plan];

  if (user) {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          plan: `PLUS_${plan.toUpperCase()}`,
          queriesRemaining: 999,
          aiProRemaining: 999,
          atlasCreditsRemaining: 999,
          courseCreatesRemaining: 999,
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
