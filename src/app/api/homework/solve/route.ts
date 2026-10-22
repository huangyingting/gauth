import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import { solveHomeworkQuestion } from "@/lib/gauth-data/solver-engine";

export async function POST(req: Request) {
  const user = await getAuthenticatedSessionUser();
  const body = (await req.json().catch(() => ({}))) as {
    questionText?: string;
    subject?: string;
    imageDataUrl?: string;
    isProVerified?: boolean;
  };

  const questionText =
    body.questionText?.trim() || "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step";
  const subject = body.subject?.trim() || "Math";
  const isProVerified = Boolean(body.isProVerified);

  const solved = solveHomeworkQuestion(questionText, subject, isProVerified);

  const record = await prisma.homeworkQuestion.create({
    data: {
      userId: user?.id ?? null,
      questionText,
      subject,
      imageDataUrl: body.imageDataUrl ?? null,
      answerSummary: solved.answerSummary,
      explanation: solved.explanation,
      keyConceptsJson: JSON.stringify(solved.keyConcepts),
      stepsJson: JSON.stringify(solved.steps),
      isProVerified,
    },
  });

  if (user) {
    await prisma.user
      .update({
        where: { id: user.id },
        data: isProVerified
          ? { aiProRemaining: { decrement: user.aiProRemaining > 0 ? 1 : 0 } }
          : { queriesRemaining: { decrement: user.queriesRemaining > 0 ? 1 : 0 } },
      })
      .catch(() => null);
  }

  return NextResponse.json({
    solution: {
      ...solved,
      id: record.id,
    },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const q = url.searchParams.get("q");
  const subject = url.searchParams.get("subject") || "Math";
  const pro = url.searchParams.get("pro") === "1";

  if (id) {
    const found = await prisma.homeworkQuestion.findUnique({ where: { id } });
    if (found) {
      const keyConcepts = JSON.parse(found.keyConceptsJson) as {
        intro: string;
        methods: { name: string; detail: string }[];
      };
      const steps = JSON.parse(found.stepsJson) as {
        stepNumber: number;
        title: string;
        content: string;
        formula?: string;
      }[];
      return NextResponse.json({
        solution: {
          id: found.id,
          questionText: found.questionText,
          subject: found.subject,
          answerSummary: found.answerSummary,
          explanation: found.explanation,
          keyConcepts,
          steps,
          isProVerified: found.isProVerified,
          proVerificationNote: found.isProVerified
            ? "Gauth AI Pro symbolic cross-check verified."
            : undefined,
          helpfulCount: found.helpfulCount,
        },
      });
    }
  }

  const solved = solveHomeworkQuestion(
    q || "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step",
    subject,
    pro
  );
  return NextResponse.json({ solution: solved });
}
