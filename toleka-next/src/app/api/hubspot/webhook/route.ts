import { verifyHubSpotSignatureV3 } from "@/lib/hubspotWebhook";

export async function POST(req: Request) {
  const secret = process.env.HUBSPOT_WEBHOOK_SECRET?.trim();
  const rawBody = await req.text();

  if (secret) {
    const signature = req.headers.get("x-hubspot-signature-v3") ?? "";
    const timestamp = req.headers.get("x-hubspot-request-timestamp") ?? "";
    const ok = verifyHubSpotSignatureV3({
      secret,
      signature,
      timestamp,
      httpMethod: "POST",
      url: req.url,
      rawBody,
    });
    if (!ok) {
      return Response.json(
        { error: { code: "INVALID_SIGNATURE", message: "Invalid HubSpot signature" } },
        { status: 401 },
      );
    }
  }

  // TODO: process events and sync back into DB
  // HubSpot sends an array of events
  try {
    const events = JSON.parse(rawBody) as unknown;
    return Response.json({ ok: true, received: Array.isArray(events) ? events.length : 1 });
  } catch {
    return Response.json({ ok: true });
  }
}

