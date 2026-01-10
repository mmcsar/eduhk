import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const active = await prisma.subscription.findFirst({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
      select: { id: true },
    });
    if (!active) throw new ApiError("PAYWALL", 402, "Active subscription required");

    const { id } = await params;
    const load = await prisma.load.findFirst({
      where: { id, status: "POSTED" },
    });
    if (!load) throw new ApiError("NOT_FOUND", 404, "Load not found");

    return Response.json({ data: load });
  } catch (e) {
    return jsonError(e);
  }
}

