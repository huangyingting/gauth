import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedSessionUser } from "@/lib/account-admission/session";
import { FEATURED_WORLD_MAP_POIS } from "@/lib/gauth-data/atlas-catalog";

export async function GET() {
  const user = await getAuthenticatedSessionUser();
  const custom = await prisma.customWorldMapPoi.findMany({
    where: user ? { userId: user.id } : { userId: null },
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
  let body: {
    title?: string;
    summary?: string;
    region?: string;
    category?: string;
    startYear?: number;
    endYear?: number;
    lat?: number;
    lng?: number;
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
        message: "Viewer role is read-only and cannot create World Map POIs.",
      },
      { status: 403 }
    );
  }

  if (
    body.title !== undefined &&
    (typeof body.title !== "string" ||
      body.title.trim().length === 0 ||
      body.title.length > 200)
  ) {
    return NextResponse.json(
      { error: "invalid_title", message: "POI title must be 1 to 200 characters." },
      { status: 400 }
    );
  }

  const title = body.title?.trim() || "Custom Historical Event";
  const summary =
    (typeof body.summary === "string" ? body.summary.trim().slice(0, 2000) : "") ||
    "User-contributed historical knowledge point on the Interactive AP US History Map.";
  const region =
    (typeof body.region === "string" ? body.region.trim().slice(0, 200) : "") ||
    "Washington, D.C., USA";

  if (
    body.category !== undefined &&
    !["Person", "Politics", "Economy", "Other"].includes(String(body.category))
  ) {
    return NextResponse.json(
      {
        error: "invalid_category",
        message: "Category must be Person, Politics, Economy, or Other.",
      },
      { status: 400 }
    );
  }
  const category = (body.category as string) || "Politics";

  const parsedStartYear =
    body.startYear !== undefined ? Number(body.startYear) : 1776;
  const parsedEndYear =
    body.endYear !== undefined ? Number(body.endYear) : parsedStartYear;

  if (
    !Number.isFinite(parsedStartYear) ||
    !Number.isFinite(parsedEndYear) ||
    parsedEndYear < parsedStartYear
  ) {
    return NextResponse.json(
      {
        error: "invalid_years",
        message: "startYear and endYear must be valid years with endYear >= startYear.",
      },
      { status: 400 }
    );
  }

  const parsedLat = body.lat !== undefined ? Number(body.lat) : 38.9072;
  const parsedLng = body.lng !== undefined ? Number(body.lng) : -77.0369;

  if (
    !Number.isFinite(parsedLat) ||
    parsedLat < -90 ||
    parsedLat > 90 ||
    !Number.isFinite(parsedLng) ||
    parsedLng < -180 ||
    parsedLng > 180
  ) {
    return NextResponse.json(
      {
        error: "invalid_coordinates",
        message: "Coordinates must be within [-90, 90] latitude and [-180, 180] longitude.",
      },
      { status: 400 }
    );
  }

  const created = await prisma.customWorldMapPoi.create({
    data: {
      userId: user?.id ?? null,
      title,
      summary,
      region,
      category,
      startYear: Math.trunc(parsedStartYear),
      endYear: Math.trunc(parsedEndYear),
      lat: parsedLat,
      lng: parsedLng,
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
