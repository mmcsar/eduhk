import { prisma } from "@/lib/prisma";
import { type Session } from "@/lib/jwt";

export async function withRls<T>(
  session: Session,
  fn: (tx: typeof prisma) => Promise<T>,
) {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      SELECT
        set_config('app.tenant_id', ${session.tenantId}, true),
        set_config('app.user_id', ${session.userId}, true),
        set_config('app.user_role', ${session.role}, true)
    `;

    const active = await tx.subscription.findFirst({
      where: { tenantId: session.tenantId, status: "ACTIVE" },
      select: { id: true },
    });
    await tx.$executeRaw`
      SELECT set_config('app.plan_active', ${active ? "true" : "false"}, true)
    `;

    return fn(tx as unknown as typeof prisma);
  });
}

