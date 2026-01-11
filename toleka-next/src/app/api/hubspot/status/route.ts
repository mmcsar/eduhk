import { hubspotClient } from "@/lib/hubspot";

export async function GET() {
  const hs = hubspotClient();
  return Response.json({ connected: Boolean(hs) });
}

