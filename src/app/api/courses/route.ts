import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import {
  SCIENCE_LABS_COURSES,
  HISTORY_SIGNATURE_COURSES,
  MATH_CURRICULUMS,
  buildCourseBlocks,
} from "@/lib/gauth-data/courses-catalog";

export async function GET(req: Request) {
  const user = await getAuthenticatedSessionUser();
  const url = new URL(req.url);
  const slugParam = url.searchParams.get("slug");

  if (slugParam) {
    const found = await prisma.customCourse.findUnique({
      where: { slug: slugParam },
    });
    if (
      !found ||
      (found.userId !== null && found.userId !== user?.id && user?.role !== "Admin")
    ) {
      return NextResponse.json(
        { error: "not_found", message: "Custom course not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({
      course: {
        id: found.id,
        slug: found.slug,
        title: found.title,
        subtitle: found.subtitle,
        category: found.category,
        discipline: found.discipline,
        description: found.subtitle,
        progressPercent: found.progressPercent,
        blocks: JSON.parse(found.blocksJson),
        href: `/course/${found.category}/${found.slug}/learn`,
      },
    });
  }

  const customCourses = await prisma.customCourse.findMany({
    where: user ? { userId: user.id } : { userId: null },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return NextResponse.json({
    scienceCourses: SCIENCE_LABS_COURSES,
    historyCourses: HISTORY_SIGNATURE_COURSES,
    mathCurriculums: MATH_CURRICULUMS,
    customCourses: customCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.category,
      description: c.subtitle,
      prompt: c.title,
      blocks: JSON.parse(c.blocksJson),
      createdAt: c.createdAt,
    })),
  });
}

export async function POST(req: Request) {
  let body: {
    prompt?: string;
    category?: string;
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
  if (user?.role === "Viewer") {
    return NextResponse.json(
      {
        error: "forbidden",
        message: "Viewer role is read-only and cannot create custom courses.",
      },
      { status: 403 }
    );
  }

  if (
    body.prompt !== undefined &&
    (typeof body.prompt !== "string" ||
      body.prompt.trim().length === 0 ||
      body.prompt.length > 500)
  ) {
    return NextResponse.json(
      {
        error: "invalid_prompt",
        message: "Course prompt must be a non-empty string up to 500 characters.",
      },
      { status: 400 }
    );
  }

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    if (user.courseCreatesRemaining <= 0) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          message: "Course creation quota exhausted. Upgrade to Gauth PLUS.",
        },
        { status: 402 }
      );
    }
  }

  const prompt =
    body.prompt?.trim() || "Quantum Superposition and Double-Slit Interference";
  const category = body.category?.trim() || "my";
  const sanitizedPrefix =
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "custom-course";
  const slug = `${sanitizedPrefix}-${Date.now().toString(36).slice(-4)}`;

  const blocks = buildCourseBlocks(prompt, category);
  const created = await prisma.customCourse.create({
    data: {
      userId: user?.id ?? null,
      slug,
      title: prompt,
      subtitle: `Interactive AI-Generated Course · 6 Blocks (${prompt})`,
      category,
      discipline: "AI Course",
      blocksJson: JSON.stringify(blocks),
    },
  });

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    await prisma.user
      .update({
        where: { id: user.id },
        data: { courseCreatesRemaining: { decrement: 1 } },
      })
      .catch(() => null);
  }

  return NextResponse.json(
    {
      course: {
        id: created.id,
        slug: created.slug,
        title: created.title,
        category: created.category,
        description: created.subtitle,
        blocks,
        href: `/course/my/${created.slug}/learn`,
      },
    },
    { status: 201 }
  );
}
