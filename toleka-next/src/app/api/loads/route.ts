import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { jsonError, ApiError } from "@/lib/http";

const CreateLoadSchema = z.object({
  status: z.enum(["DRAFT", "POSTED"]).default("POSTED"),
  originProvince: z.string().min(2).max(64),
  originCity: z.string().min(2).max(64),
  destinationProvince: z.string().min(2).max(64),
  destinationCity: z.string().min(2).max(64),
  equipment: z.string().min(2).max(64),
  lengthFt: z.coerce.number().int().min(1).max(80),
  weightKg: z.coerce.number().int().min(1).max(100000),
  rateUsd: z.coerce.number().int().min(0).max(1000000).optional(),
  contactName: z.string().max(120).optional(),
  contactPhone: z.string().max(40).optional(),
  companyName: z.string().max(120).optional(),
  exactAddress: z.string().max(240).optional(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const active = await prisma.subscription.findFirst({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
      select: { id: true },
    });
    if (!active) throw new ApiError("PAYWALL", 402, "Active subscription required");

    const body = CreateLoadSchema.parse(await req.json());
    const created = await prisma.load.create({
      data: {
        tenantId: session.tenantId,
        status: body.status,
        originProvince: body.originProvince,
        originCity: body.originCity,
        destinationProvince: body.destinationProvince,
        destinationCity: body.destinationCity,
        equipment: body.equipment,
        lengthFt: body.lengthFt,
        weightKg: body.weightKg,
        rateUsd: body.rateUsd,
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        companyName: body.companyName,
        exactAddress: body.exactAddress,
        notes: body.notes,
      },
    });

    return Response.json({ data: created }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const loads = await prisma.load.findMany({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return Response.json({ data: loads });
  } catch (e) {
    return jsonError(e);
  }
}

