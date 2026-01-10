import { z } from "zod";
import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";
import { withRls } from "@/lib/rls";

export const runtime = "nodejs";

const CreateBidSchema = z.object({
  amountUsd: z.coerce.number().int().min(0).max(1000000).optional(),
  message: z.string().max(2000).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const { id: loadId } = await params;

    const bids = await withRls(session, (tx) =>
      tx.bid.findMany({
        where: { loadId },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: {
          id: true,
          loadId: true,
          tenantId: true,
          userId: true,
          status: true,
          amountUsd: true,
          message: true,
          createdAt: true,
        },
      }),
    );

    return Response.json({ data: bids });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const { id: loadId } = await params;
    const body = CreateBidSchema.parse(await req.json());

    const created = await withRls(session, async (tx) => {
      const active = await tx.subscription.findFirst({
        where: { tenantId: session.tenantId, status: "ACTIVE" },
        select: { id: true },
      });
      if (!active) throw new ApiError("PAYWALL", 402, "Active subscription required");

      // Ensure load exists and is publicly posted
      const load = await tx.load.findFirst({
        where: { id: loadId, status: "POSTED" },
        select: { id: true, tenantId: true },
      });
      if (!load) throw new ApiError("NOT_FOUND", 404, "Load not found");

      // Prevent bidding on your own load
      if (load.tenantId === session.tenantId) {
        throw new ApiError("FORBIDDEN", 403, "Cannot bid on own load");
      }

      return tx.bid.create({
        data: {
          loadId,
          tenantId: session.tenantId,
          userId: session.userId,
          amountUsd: body.amountUsd,
          message: body.message,
        },
        select: {
          id: true,
          loadId: true,
          tenantId: true,
          userId: true,
          status: true,
          amountUsd: true,
          message: true,
          createdAt: true,
        },
      });
    });

    return Response.json({ data: created }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

