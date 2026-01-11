import { jsonError } from "@/lib/http";
import { processHubspotJobs } from "@/lib/hubspotOutbox";

export const runtime = "nodejs";

function isAuthorized(req: Request) {
  const secret = process.env.HUBSPOT_SYNC_CRON_SECRET?.trim();
  if (!secret) return false;

  const header = req.headers.get("authorization") ?? "";
  if (header === `Bearer ${secret}`) return true;

  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return Response.json(
        { error: { code: "FORBIDDEN", message: "Invalid cron secret" } },
        { status: 403 },
      );
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

