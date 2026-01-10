import { prisma } from "@/lib/prisma";
import { z } from "zod";

const QuerySchema = z.object({
  originCity: z.string().optional(),
  destinationCity: z.string().optional(),
  originProvince: z.string().optional(),
  destinationProvince: z.string().optional(),
  equipment: z.string().optional(),
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
    limit: url.searchParams.get("limit") ?? undefined,
  });

  const loads = await prisma.load.findMany({
    where: {
      status: "POSTED",
      originCity: parsed.originCity ? { contains: parsed.originCity, mode: "insensitive" } : undefined,
      destinationCity: parsed.destinationCity
        ? { contains: parsed.destinationCity, mode: "insensitive" }
        : undefined,
      originProvince: parsed.originProvince ?? undefined,
      destinationProvince: parsed.destinationProvince ?? undefined,
      equipment: parsed.equipment ?? undefined,
    },
    orderBy: { createdAt: "desc" },
    take: parsed.limit,
    select: {
      id: true,
      status: true,
      originProvince: true,
      originCity: true,
      destinationProvince: true,
      destinationCity: true,
      equipment: true,
      lengthFt: true,
      weightKg: true,
      createdAt: true,
    },
  });

  return Response.json({ data: loads.map(mask) });
}

