import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import {
  ATLAS_VIDEO_STORIES,
  ATLAS_INTERACTIVE_SESSIONS,
  buildCustomAtlasSession,
} from "@/lib/gauth-data/atlas-catalog";

export async function GET(req: Request) {
  const user = await getAuthenticatedSessionUser();
  const url = new URL(req.url);
  const idParam = url.searchParams.get("id");

  if (idParam) {
    const found = await prisma.atlasSessionRecord.findUnique({
      where: { id: idParam },
    });
    if (
      !found ||
      (found.userId !== null && found.userId !== user?.id && user?.role !== "Admin")
    ) {
      return NextResponse.json(
        { error: "not_found", message: "Atlas session not found." },
        { status: 404 }
      );
    }
    const vCfg = found.videoConfigJson
      ? (JSON.parse(found.videoConfigJson) as {
          voiceLanguage?: string;
          videoGenerated?: boolean;
        })
      : {};
    return NextResponse.json({
      session: {
        id: found.id,
        title: found.title,
        subtitle: found.subtitle,
        category: "Interactive Story" as const,
        thumbnailLabel: found.title.slice(0, 28),
        accentGradient: "from-indigo-950 via-blue-900 to-slate-900",
        href: `/atlas/session/${found.id}`,
        chapters: JSON.parse(found.chaptersJson),
        voiceLanguage: vCfg.voiceLanguage || "English (United States)",
        videoGenerated: Boolean(vCfg.videoGenerated),
      },
    });
  }

  const customRecords = await prisma.atlasSessionRecord.findMany({
    where: user ? { userId: user.id } : { userId: null },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const customSessions = customRecords.map((r) => {
    const vCfg = r.videoConfigJson
      ? (JSON.parse(r.videoConfigJson) as {
          voiceLanguage?: string;
          videoGenerated?: boolean;
        })
      : {};
    return {
      id: r.id,
      title: r.title,
      subtitle: r.subtitle,
      category: "Interactive Story" as const,
      thumbnailLabel: r.title.slice(0, 28),
      accentGradient: "from-indigo-950 via-blue-900 to-slate-900",
      href: `/atlas/session/${r.id}`,
      chapters: JSON.parse(r.chaptersJson),
      voiceLanguage: vCfg.voiceLanguage || "English (United States)",
      videoGenerated: Boolean(vCfg.videoGenerated),
    };
  });

  return NextResponse.json({
    videoStories: ATLAS_VIDEO_STORIES,
    interactiveSessions: [...customSessions, ...ATLAS_INTERACTIVE_SESSIONS],
    customSessions,
  });
}

export async function POST(req: Request) {
  let body: {
    prompt?: string;
    sessionId?: string;
    voiceLanguage?: string;
    generateVideo?: boolean;
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
        message: "Viewer role is read-only and cannot generate Atlas visual stories.",
      },
      { status: 403 }
    );
  }

  if (body.sessionId && body.generateVideo) {
    const lang = body.voiceLanguage || "English (United States)";
    const existing = await prisma.atlasSessionRecord.findUnique({
      where: { id: body.sessionId },
    });
    if (
      existing &&
      (existing.userId === null ||
        existing.userId === user?.id ||
        user?.role === "Admin")
    ) {
      await prisma.atlasSessionRecord.update({
        where: { id: existing.id },
        data: {
          videoConfigJson: JSON.stringify({
            voiceLanguage: lang,
            videoGenerated: true,
          }),
        },
      });
    }
    return NextResponse.json({
      ok: true,
      sessionId: body.sessionId,
      voiceLanguage: lang,
      videoGenerated: true,
      videoDuration: "01:54",
      narrationSummary: `AI narrated visual story generated in ${lang} with synchronized chapter transitions and historical map overlays.`,
    });
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
        message: "Atlas prompt must be a non-empty string up to 500 characters.",
      },
      { status: 400 }
    );
  }

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    if (user.atlasCreditsRemaining <= 0) {
      return NextResponse.json(
        {
          error: "quota_exceeded",
          message: "Atlas story quota exhausted. Upgrade to Gauth PLUS.",
        },
        { status: 402 }
      );
    }
  }

  const prompt = body.prompt?.trim() || "The Silk Road Porcelain Trade";
  const built = buildCustomAtlasSession(prompt);

  const created = await prisma.atlasSessionRecord.create({
    data: {
      userId: user?.id ?? null,
      title: built.title,
      subtitle: built.subtitle,
      category: "Interactive Story",
      chaptersJson: JSON.stringify(built.chapters),
      videoConfigJson: JSON.stringify({
        voiceLanguage: body.voiceLanguage || "English (United States)",
        videoGenerated: Boolean(body.generateVideo),
      }),
    },
  });

  if (user && user.role !== "Admin" && !user.plan.startsWith("PLUS_")) {
    await prisma.user
      .update({
        where: { id: user.id },
        data: { atlasCreditsRemaining: { decrement: 1 } },
      })
      .catch(() => null);
  }

  return NextResponse.json(
    {
      session: {
        ...built,
        id: created.id,
        href: `/atlas/session/${created.id}`,
      },
    },
    { status: 201 }
  );
}
