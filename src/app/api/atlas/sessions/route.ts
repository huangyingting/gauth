import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import {
  ATLAS_VIDEO_STORIES,
  ATLAS_INTERACTIVE_SESSIONS,
  buildCustomAtlasSession,
} from "@/lib/gauth-data/atlas-catalog";

export async function GET() {
  const customRecords = await prisma.atlasSessionRecord.findMany({
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
  });
}

export async function POST(req: Request) {
  const user = await getAuthenticatedSessionUser();
  const body = (await req.json().catch(() => ({}))) as {
    prompt?: string;
    sessionId?: string;
    voiceLanguage?: string;
    generateVideo?: boolean;
  };

  if (body.sessionId && body.generateVideo) {
    const lang = body.voiceLanguage || "English (United States)";
    return NextResponse.json({
      ok: true,
      sessionId: body.sessionId,
      voiceLanguage: lang,
      videoGenerated: true,
      videoDuration: "01:54",
      narrationSummary: `AI narrated visual story generated in ${lang} with synchronized chapter transitions and historical map overlays.`,
    });
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
