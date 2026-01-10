import { prisma } from "@/lib/prisma";
import { upsertContact, type HubSpotContactUpsert } from "@/lib/hubspot";
import { createDeal, updateDeal, type HubSpotDealUpsert } from "@/lib/hubspotDeals";
import { Prisma } from "@prisma/client";

export async function enqueueHubspotJob(params: {
  tenantId: string;
  type: "CONTACT_UPSERT" | "DEAL_UPSERT";
  payload: Prisma.InputJsonValue;
  lastError?: string;
}) {
  // Ensure no `undefined` in payload (Prisma JSON can't store it)
  const payload =
    typeof params.payload === "string"
      ? params.payload
      : (JSON.parse(JSON.stringify(params.payload)) as Prisma.InputJsonValue);

  return prisma.hubspotOutbox.create({
    data: {
      tenantId: params.tenantId,
      type: params.type,
      status: "PENDING",
      payload,
      lastError: params.lastError,
    },
  });
}

export async function processHubspotJobs(params?: { limit?: number }) {
  const limit = params?.limit ?? 25;

  const jobs = await prisma.hubspotOutbox.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let done = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      await prisma.hubspotOutbox.update({
        where: { id: job.id },
        data: { status: "PROCESSING", attempts: { increment: 1 } },
      });

      if (job.type === "CONTACT_UPSERT") {
        const payload = job.payload as unknown as HubSpotContactUpsert & {
          userId?: string;
        };
        const result = await upsertContact(payload);
        if (result.ok && payload.userId && result.id) {
          await prisma.user.update({
            where: { id: payload.userId },
            data: { hubspotContactId: result.id },
          });
        }
      }

      if (job.type === "DEAL_UPSERT") {
        const payload = job.payload as unknown as HubSpotDealUpsert & {
          loadId?: string;
          dealId?: string;
        };

        const dealId = payload.dealId;
        const result = dealId ? await updateDeal(dealId, payload) : await createDeal(payload);
        if (result.ok && payload.loadId && result.id) {
          await prisma.load.update({
            where: { id: payload.loadId },
            data: { hubspotDealId: result.id },
          });
        }
      }

      await prisma.hubspotOutbox.update({
        where: { id: job.id },
        data: { status: "DONE", lastError: null },
      });
      done += 1;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "HubSpot sync error";
      await prisma.hubspotOutbox.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          lastError: msg.slice(0, 4000),
        },
      });
      failed += 1;
    }
  }

  return { processed: jobs.length, done, failed };
}

