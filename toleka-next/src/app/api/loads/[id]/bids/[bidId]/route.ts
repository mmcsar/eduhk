import { z } from "zod";
import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";
import { withRls } from "@/lib/rls";

export const runtime = "nodejs";

const UpdateSchema = z.object({
  action: z.enum(["accept", "reject", "withdraw"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; bidId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const { id: loadId, bidId } = await params;
    const body = UpdateSchema.parse(await req.json());

    const updated = await withRls(session, async (tx) => {
      const bid = await tx.bid.findFirst({
        where: { id: bidId, loadId },
        select: { id: true, tenantId: true, userId: true, status: true, loadId: true },
      });
      if (!bid) throw new ApiError("NOT_FOUND", 404, "Bid not found");

      const load = await tx.load.findFirst({
        where: { id: loadId },
        select: { tenantId: true },
      });
      if (!load) throw new ApiError("NOT_FOUND", 404, "Load not found");

      const isOwner = load.tenantId === session.tenantId;
      const isBidder = bid.tenantId === session.tenantId && bid.userId === session.userId;

      if (body.action === "withdraw") {
        if (!isBidder) throw new ApiError("FORBIDDEN", 403, "Not your bid");
        return tx.bid.update({
          where: { id: bidId },
          data: { status: "WITHDRAWN" },
          select: {
            id: true,
            status: true,
            amountUsd: true,
            message: true,
            tenantId: true,
            userId: true,
            createdAt: true,
          },
        });
      }

      if (!isOwner) throw new ApiError("FORBIDDEN", 403, "Owner only");

      const nextStatus = body.action === "accept" ? "ACCEPTED" : "REJECTED";
      return tx.bid.update({
        where: { id: bidId },
        data: { status: nextStatus },
        select: {
          id: true,
          status: true,
          amountUsd: true,
          message: true,
          tenantId: true,
          userId: true,
          createdAt: true,
        },
      });
    });

    return Response.json({ data: updated });
  } catch (e) {
    return jsonError(e);
  }
}

