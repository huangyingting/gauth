import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import { FEATURED_WORLD_MAP_POIS } from "@/lib/gauth-data/atlas-catalog";

export async function GET() {
  const custom = await prisma.customWorldMapPoi.findMany({
    orderBy: { createdAt: "desc" },
  });

  const minePois = custom.map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    region: c.region,
    category: c.category as "Person" | "Politics" | "Economy" | "Other",
    startYear: c.startYear,
    endYear: c.endYear,
    lat: c.lat,
    lng: c.lng,
    source: "Mine" as const,
  }));

  return NextResponse.json({
    featured: FEATURED_WORLD_MAP_POIS,
    mine: minePois,
  });
}

export async function POST(req: Request) {
  const user = await getAuthenticatedSessionUser();
  const body = (await req.json().catch(() => ({}))) as {
    title?: string;
    summary?: string;
    region?: string;
    category?: string;
    startYear?: number;
    endYear?: number;
    lat?: number;
    lng?: number;
  };

  const title = body.title?.trim() || "Custom Historical Event";
  const summary =
    body.summary?.trim() ||
    "User-contributed historical knowledge point on the Interactive AP US History Map.";
  const region = body.region?.trim() || "Washington, D.C., USA";
  const category = ["Person", "Politics", "Economy", "Other"].includes(body.category || "")
    ? (body.category as string)
    : "Politics";
  const startYear = Number(body.startYear) || 1776;
  const endYear = Number(body.endYear) || startYear;
  const lat = Number(body.lat) || 38.9072;
  const lng = Number(body.lng) || -77.0369;

  const created = await prisma.customWorldMapPoi.create({
    data: {
      userId: user?.id ?? null,
      title,
      summary,
      region,
      category,
      startYear,
      endYear,
      lat,
      lng,
    },
  });

  return NextResponse.json(
    {
      poi: {
        ...created,
        source: "Mine",
      },
    },
    { status: 201 }
  );
}
