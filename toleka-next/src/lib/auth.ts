import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";

export type Session = {
  userId: string;
  tenantId: string;
  role: string;
};

const COOKIE_NAME = "toleka_session";

function getSecret() {
  const secret = process.env.TOLEKA_JWT_SECRET;
  if (!secret) throw new Error("Missing TOLEKA_JWT_SECRET");
  return new TextEncoder().encode(secret);
}

export function sessionCookieName() {
  return COOKIE_NAME;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function signSession(session: Session) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: session.userId,
    tenantId: session.tenantId,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    const userId = payload.sub;
    const tenantId = payload.tenantId;
    const role = payload.role;
    if (typeof userId !== "string") return null;
    if (typeof tenantId !== "string") return null;
    if (typeof role !== "string") return null;
    return { userId, tenantId, role };
  } catch {
    return null;
  }
}

