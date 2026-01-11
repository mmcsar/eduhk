import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";

function getToken() {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  return token && token.trim().length > 0 ? token.trim() : null;
}

export function hubspotClient() {
  const token = getToken();
  if (!token) return null;
  return new Client({ accessToken: token });
}

export type HubSpotContactUpsert = {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  user_role?: string;
  tenant_id?: string;
};

export async function upsertContact(input: HubSpotContactUpsert) {
  const hs = hubspotClient();
  if (!hs) return { ok: false as const, reason: "HUBSPOT_NOT_CONFIGURED" };

  // 1) Find by email
  const search = await hs.crm.contacts.searchApi.doSearch({
    filterGroups: [
      {
        filters: [
          { propertyName: "email", operator: FilterOperatorEnum.Eq, value: input.email },
        ],
      },
    ],
    properties: ["email"],
    limit: 1,
  });

  const props: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) {
    if (!v) continue;
    props[k] = String(v);
  }

  const existing = search.results?.[0];
  if (existing?.id) {
    await hs.crm.contacts.basicApi.update(existing.id, { properties: props });
    return { ok: true as const, action: "updated" as const, id: existing.id };
  }

  const created = await hs.crm.contacts.basicApi.create({ properties: props });
  return { ok: true as const, action: "created" as const, id: created.id };
}

