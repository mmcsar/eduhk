import { apiFetch } from "./api";
import { clearToken, setToken } from "./storage";

export type MeResponse = {
  user: { id: string; email: string } | null;
  tenant: { id: string; name: string } | null;
  role?: string;
  subscription?: { status: string; plan: string } | null;
};

export async function login(email: string, password: string) {
  const res = await apiFetch<{ ok: boolean; token?: string }>("/api/auth/login", {
    method: "POST",
    json: { email, password },
  });
  if (res.token) await setToken(res.token);
  return res;
}

export async function register(input: {
  tenantName: string;
  email: string;
  password: string;
  role: "TENANT_ADMIN" | "BROKER" | "DISPATCHER" | "DRIVER";
}) {
  const res = await apiFetch<{ token?: string }>("/api/auth/register", {
    method: "POST",
    json: input,
  });
  if (res.token) await setToken(res.token);
  return res;
}

export async function me() {
  return apiFetch<MeResponse>("/api/auth/me");
}

export async function logout() {
  await clearToken();
  try {
    await apiFetch<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }
}

