import { cookies } from "next/headers";
import { sessionCookieName, verifySession } from "@/lib/auth";

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(sessionCookieName())?.value;
  if (!token) return null;
  return verifySession(token);
}

