import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import { solveHomeworkQuestion } from "@/lib/gauth-data/solver-engine";

export async function POST(req: Request) {
  let body: {
    questionId?: string;
    questionText?: string;
    subject?: string;
    imageDataUrl?: string;
    isProVerified?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "Malformed JSON request body." },
      { status: 400 }
    );
  }

  const user = await getAuthenticatedSessionUser();
  const isProVerified = Boolean(body.isProVerified);

  if (
    body.questionText !== undefined &&
    (typeof body.questionText !== "string" ||
      body.questionText.trim().length === 0 ||
      body.questionText.length > 5000)
  ) {
    return NextResponse.json(
      {
        error: "invalid_question",
        message: "questionText must be a non-empty string up to 5000 characters.",
      },
      { status: 400 }
    );
  }

  if (
    body.imageDataUrl !== undefined &&
    body.imageDataUrl !== null &&
    (typeof body.imageDataUrl !== "string" || body.imageDataUrl.length > 2_000_000)
  ) {
    return NextResponse.json(
      { error: "invalid_image", message: "imageDataUrl exceeds maximum allowed size." },
      { status: 400 }
    );
  }

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    const remaining = isProVerified ? user.aiProRemaining : user.queriesRemaining;
    if (remaining <= 0) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          message: isProVerified
            ? "You have used all Gauth AI Pro verifications. Upgrade to Gauth PLUS for unlimited Pro answers."
            : "You have used all free homework queries. Upgrade to Gauth PLUS for unlimited answers.",
        },
        { status: 402 }
      );
    }
  }

  const questionText =
    body.questionText?.trim() || "Solve the quadratic equation x^2 - 5x + 6 = 0 step by step";
  const subject = body.subject?.trim() || "Math";

  const solved = solveHomeworkQuestion(questionText, subject, isProVerified);

  let record;
  if (body.questionId) {
    const existing = await prisma.homeworkQuestion.findUnique({
      where: { id: body.questionId },
    });
    if (existing && (existing.userId === null || existing.userId === user?.id)) {
      record = await prisma.homeworkQuestion.update({
        where: { id: existing.id },
        data: {
          isProVerified,
          answerSummary: solved.answerSummary,
          explanation: solved.explanation,
          keyConceptsJson: JSON.stringify(solved.keyConcepts),
          stepsJson: JSON.stringify(solved.steps),
        },
      });
    }
  }

  if (!record) {
    record = await prisma.homeworkQuestion.create({
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
  }

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    await prisma.user
      .update({
        where: { id: user.id },
        data: isProVerified
          ? { aiProRemaining: { decrement: 1 } }
          : { queriesRemaining: { decrement: 1 } },
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
