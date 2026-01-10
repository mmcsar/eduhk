import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, sessionCookieName, signSession } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { cookies } from "next/headers";
import { upsertContact } from "@/lib/hubspot";

const RegisterSchema = z.object({
  tenantName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z
    .enum(["BROKER", "DISPATCHER", "DRIVER", "TENANT_ADMIN"])
    .default("TENANT_ADMIN"),
});

export async function POST(req: Request) {
  try {
    const body = RegisterSchema.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return Response.json(
        { error: { code: "EMAIL_ALREADY_USED", message: "Email already used" } },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(body.password);

    const created = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: { name: body.tenantName },
      });

      const user = await tx.user.create({
        data: {
          email: body.email,
          passwordHash,
        },
      });

      const membership = await tx.membership.create({
        data: {
          tenantId: tenant.id,
          userId: user.id,
          role: body.role,
        },
      });

      const subscription = await tx.subscription.create({
        data: {
          tenantId: tenant.id,
          plan: "PRO",
          status: "ACTIVE",
        },
      });

      return { tenant, user, membership, subscription };
    });

    const token = await signSession({
      userId: created.user.id,
      tenantId: created.tenant.id,
      role: created.membership.role,
    });

    const jar = await cookies();
    jar.set(sessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Best-effort HubSpot sync (non-blocking for MVP)
    upsertContact({
      email: created.user.email,
      company: created.tenant.name,
      user_role: created.membership.role,
      tenant_id: created.tenant.id,
    }).catch(() => {});

    return Response.json({
      user: { id: created.user.id, email: created.user.email },
      tenant: { id: created.tenant.id, name: created.tenant.name },
      role: created.membership.role,
      subscription: { status: created.subscription.status, plan: created.subscription.plan },
    });
  } catch (e) {
    return jsonError(e);
  }
}

