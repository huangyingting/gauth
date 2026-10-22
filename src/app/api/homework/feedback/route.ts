import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    questionId?: string;
    vote?: "helpful" | "not_helpful";
  };

  if (body.questionId && body.vote === "helpful") {
    await prisma.homeworkQuestion
      .update({
        where: { id: body.questionId },
        data: { helpfulCount: { increment: 1 } },
      })
      .catch(() => null);
  }

  return NextResponse.json({ ok: true, vote: body.vote ?? "helpful" });
}
