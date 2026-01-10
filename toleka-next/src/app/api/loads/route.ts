import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { jsonError, ApiError } from "@/lib/http";
import { associateDealToContact, createDeal } from "@/lib/hubspotDeals";
import { enqueueHubspotJob } from "@/lib/hubspotOutbox";
import { withRls } from "@/lib/rls";

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

    const body = CreateLoadSchema.parse(await req.json());
    const created = await withRls(session, async (tx) => {
      const active = await tx.subscription.findFirst({
        where: { tenantId: session.tenantId, status: "ACTIVE" },
        select: { id: true },
      });
      if (!active) throw new ApiError("PAYWALL", 402, "Active subscription required");

      const load = await tx.load.create({
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

      if (load.status === "POSTED") {
        await tx.loadPublicListing.create({
          data: {
            loadId: load.id,
            status: load.status,
            originProvince: load.originProvince,
            originCity: load.originCity,
            destinationProvince: load.destinationProvince,
            destinationCity: load.destinationCity,
            equipment: load.equipment,
            lengthFt: load.lengthFt,
            weightKg: load.weightKg,
          },
        });
      }

      return load;
    });

    // HubSpot Deal sync only when publicly posted
    if (created.status === "POSTED") {
      const actor = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { hubspotContactId: true },
      });

      // Best-effort HubSpot Deal sync. If it fails, queue it for retry.
      try {
        const res = await createDeal({
          dealname: `Load ${created.originCity} → ${created.destinationCity}`,
          amount: created.rateUsd ?? undefined,
          tenant_id: created.tenantId,
          pickup_city: created.originCity,
          delivery_city: created.destinationCity,
          equipment: created.equipment,
          tracking_number: created.id,
          pipeline: process.env.HUBSPOT_DEAL_PIPELINE_ID || undefined,
          dealstage: process.env.HUBSPOT_DEAL_STAGE_POSTED || undefined,
        });
        if (res.ok && res.id) {
          await prisma.load.update({
            where: { id: created.id },
            data: { hubspotDealId: res.id },
          });

          if (actor?.hubspotContactId) {
            await associateDealToContact({
              dealId: res.id,
              contactId: actor.hubspotContactId,
            });
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "HubSpot deal sync failed";
        await enqueueHubspotJob({
          tenantId: created.tenantId,
          type: "DEAL_UPSERT",
          payload: {
            loadId: created.id,
            contactId: actor?.hubspotContactId ?? undefined,
            dealname: `Load ${created.originCity} → ${created.destinationCity}`,
            amount: created.rateUsd ?? undefined,
            tenant_id: created.tenantId,
            pickup_city: created.originCity,
            delivery_city: created.destinationCity,
            equipment: created.equipment,
            tracking_number: created.id,
            pipeline: process.env.HUBSPOT_DEAL_PIPELINE_ID || undefined,
            dealstage: process.env.HUBSPOT_DEAL_STAGE_POSTED || undefined,
          },
          lastError: msg,
        });
      }
    }

    return Response.json({ data: created }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const loads = await withRls(session, async (tx) =>
      tx.load.findMany({
        where: { tenantId: session.tenantId },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
    );
    return Response.json({ data: loads });
  } catch (e) {
    return jsonError(e);
  }
}

