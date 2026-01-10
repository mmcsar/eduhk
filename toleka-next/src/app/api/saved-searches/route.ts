import { z } from "zod";
import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";
import { withRls } from "@/lib/rls";

export const runtime = "nodejs";

const CreateSchema = z.object({
  name: z.string().min(1).max(60),
  criteria: z.record(z.string(), z.string()).default({}),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const rows = await withRls(session, (tx) =>
      tx.savedSearch.findMany({
        where: { tenantId: session.tenantId, userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 50,
        select: { id: true, name: true, criteria: true, createdAt: true },
      }),
    );
    return Response.json({ data: rows });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const body = CreateSchema.parse(await req.json());
    const created = await withRls(session, (tx) =>
      tx.savedSearch.create({
        data: {
          tenantId: session.tenantId,
          userId: session.userId,
          name: body.name,
          criteria: body.criteria,
        },
        select: { id: true, name: true, criteria: true, createdAt: true },
      }),
    );
    return Response.json({ data: created }, { status: 201 });
  } catch (e) {
    return jsonError(e);
  }
}

