import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/http";
import { sessionCookieName, signSession, verifyPassword } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = LoginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({
      where: { email: body.email },
      include: { memberships: true },
    });
    if (!user) {
      return Response.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
        { status: 401 },
      );
    }

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) {
      return Response.json(
        { error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } },
        { status: 401 },
      );
    }

    const membership = user.memberships[0];
    if (!membership) {
      return Response.json(
        { error: { code: "NO_TENANT", message: "User has no tenant" } },
        { status: 403 },
      );
    }

    const token = await signSession({
      userId: user.id,
      tenantId: membership.tenantId,
      role: membership.role,
    });

    const jar = await cookies();
    jar.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return Response.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}

