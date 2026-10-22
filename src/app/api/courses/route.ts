import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import {
  SCIENCE_LABS_COURSES,
  HISTORY_SIGNATURE_COURSES,
  MATH_CURRICULUMS,
  buildCourseBlocks,
} from "@/lib/gauth-data/courses-catalog";

export async function GET() {
  const user = await getAuthenticatedSessionUser();
  const customCourses = await prisma.customCourse.findMany({
    where: user ? { OR: [{ userId: user.id }, { userId: null }] } : {},
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
  const user = await getAuthenticatedSessionUser();
  const body = (await req.json().catch(() => ({}))) as {
    prompt?: string;
    category?: string;
  };

  const prompt = body.prompt?.trim() || "Quantum Superposition and Double-Slit Interference";
  const category = body.category?.trim() || "my";
  const slug =
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) +
    "-" +
    Date.now().toString(36).slice(-4);

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
