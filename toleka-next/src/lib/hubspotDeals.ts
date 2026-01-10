import { hubspotClient } from "@/lib/hubspot";

export type HubSpotDealUpsert = {
  dealname: string;
  amount?: number;
  pipeline?: string;
  dealstage?: string;
  tracking_number?: string;
  pickup_city?: string;
  delivery_city?: string;
  equipment?: string;
  tenant_id?: string;
};

export async function createDeal(input: HubSpotDealUpsert) {
  const hs = hubspotClient();
  if (!hs) return { ok: false as const, reason: "HUBSPOT_NOT_CONFIGURED" };

  const properties: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    properties[k] = String(v);
  }

  const created = await hs.crm.deals.basicApi.create({ properties });
  return { ok: true as const, id: created.id };
}

export async function updateDeal(dealId: string, input: HubSpotDealUpsert) {
  const hs = hubspotClient();
  if (!hs) return { ok: false as const, reason: "HUBSPOT_NOT_CONFIGURED" };

  const properties: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v === undefined || v === null) continue;
    properties[k] = String(v);
  }

  await hs.crm.deals.basicApi.update(dealId, { properties });
  return { ok: true as const, id: dealId };
}

