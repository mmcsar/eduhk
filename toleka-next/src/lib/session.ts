import { cookies } from "next/headers";
import { sessionCookieName, verifySession } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookieName())?.value;
  if (token) return verifySession(token);

  // Mobile clients: allow Authorization: Bearer <token>
  const h = await headers();
  const auth = h.get("authorization") ?? "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const bearer = m?.[1]?.trim();
  if (!bearer) return null;
  return verifySession(bearer);
}

