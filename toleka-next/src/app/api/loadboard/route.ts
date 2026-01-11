import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { decodeCursor, encodeCursor } from "@/lib/cursor";

const QuerySchema = z.object({
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  originProvince: z.string().optional(),
  destinationProvince: z.string().optional(),
  equipment: z.string().optional(),
  sort: z.enum(["newest", "oldest"]).default("newest"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

function mask(load: {
  id: string;
  status: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  equipment: string;
  lengthFt: number;
  weightKg: number;
  createdAt: Date;
}) {
  return {
    id: load.id,
    status: load.status,
    originProvince: load.originProvince,
    originCity: load.originCity,
    destinationProvince: load.destinationProvince,
    destinationCity: load.destinationCity,
    equipment: load.equipment,
    lengthFt: load.lengthFt,
    weightKg: load.weightKg,
    createdAt: load.createdAt,
    // paywall
    rateUsd: null,
    contactName: null,
    contactPhone: null,
    companyName: null,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = QuerySchema.parse({
    originCity: url.searchParams.get("originCity") ?? undefined,
    destinationCity: url.searchParams.get("destinationCity") ?? undefined,
    originProvince: url.searchParams.get("originProvince") ?? undefined,
    destinationProvince: url.searchParams.get("destinationProvince") ?? undefined,
    equipment: url.searchParams.get("equipment") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    cursor: url.searchParams.get("cursor") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  const cursor = parsed.cursor ? decodeCursor(parsed.cursor) : null;
  const orderBy =
    parsed.sort === "oldest"
      ? [{ createdAt: "asc" as const }, { id: "asc" as const }]
      : [{ createdAt: "desc" as const }, { id: "desc" as const }];

  // Cursor pagination by (createdAt, id)
  const cursorWhere =
    cursor && parsed.sort === "newest"
      ? {
          OR: [
            { createdAt: { lt: new Date(cursor.createdAt) } },
            {
              createdAt: { equals: new Date(cursor.createdAt) },
              id: { lt: cursor.id },
            },
          ],
        }
      : cursor && parsed.sort === "oldest"
        ? {
            OR: [
              { createdAt: { gt: new Date(cursor.createdAt) } },
              {
                createdAt: { equals: new Date(cursor.createdAt) },
                id: { gt: cursor.id },
              },
            ],
          }
        : {};

  // Public listing table (no sensitive fields, safe for anonymous users)
  const loads = await prisma.loadPublicListing.findMany({
    where: {
      status: "POSTED",
      originCity: parsed.originCity ? { contains: parsed.originCity, mode: "insensitive" } : undefined,
      destinationCity: parsed.destinationCity
        ? { contains: parsed.destinationCity, mode: "insensitive" }
        : undefined,
      originProvince: parsed.originProvince ?? undefined,
      destinationProvince: parsed.destinationProvince ?? undefined,
      equipment: parsed.equipment ?? undefined,
      ...(cursorWhere as object),
    },
    orderBy,
    take: parsed.limit + 1,
    select: {
      status: true,
      originProvince: true,
      originCity: true,
      destinationProvince: true,
      destinationCity: true,
      equipment: true,
      lengthFt: true,
      weightKg: true,
      createdAt: true,
      loadId: true,
      id: true,
    },
  });

  const page = loads.slice(0, parsed.limit);
  const next = loads.length > parsed.limit ? loads[parsed.limit] : null;
  const nextCursor = next
    ? encodeCursor({ createdAt: next.createdAt.toISOString(), id: next.id })
    : null;

  return Response.json({
    data: page.map((l) =>
      mask({
        id: l.loadId,
        status: l.status,
        originProvince: l.originProvince,
        originCity: l.originCity,
        destinationProvince: l.destinationProvince,
        destinationCity: l.destinationCity,
        equipment: l.equipment,
        lengthFt: l.lengthFt,
        weightKg: l.weightKg,
        createdAt: l.createdAt,
      }),
    ),
    nextCursor,
  });
}

