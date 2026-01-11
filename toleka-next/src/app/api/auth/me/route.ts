import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ user: null, tenant: null, subscription: null });
  }

  const [user, tenant, subscription] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, phone: true, createdAt: true },
    }),
    prisma.tenant.findUnique({
      where: { id: session.tenantId },
      select: { id: true, name: true, createdAt: true },
    }),
    prisma.subscription.findFirst({
      where: { tenantId: session.tenantId },
      orderBy: { createdAt: "desc" },
      select: { status: true, plan: true, currentPeriodEnd: true },
    }),
  ]);

  return Response.json({
    user,
    tenant,
    role: session.role,
    subscription,
  });
}

