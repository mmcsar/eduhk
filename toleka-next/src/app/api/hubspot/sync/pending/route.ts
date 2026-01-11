import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";
import { processHubspotJobs } from "@/lib/hubspotOutbox";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");
    if (session.role !== "PLATFORM_ADMIN") {
      throw new ApiError("FORBIDDEN", 403, "Admin only");
    }

    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "25");

    const result = await processHubspotJobs({
      limit: Number.isFinite(limit) ? Math.max(1, Math.min(100, limit)) : 25,
    });
    return Response.json({ ok: true, ...result });
  } catch (e) {
    return jsonError(e);
  }
}

