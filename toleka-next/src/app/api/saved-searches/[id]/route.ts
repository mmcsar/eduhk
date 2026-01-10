import { getSession } from "@/lib/session";
import { ApiError, jsonError } from "@/lib/http";
import { withRls } from "@/lib/rls";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) throw new ApiError("UNAUTHORIZED", 401, "Login required");

    const { id } = await params;
    await withRls(session, (tx) =>
      tx.savedSearch.delete({
        where: { id },
      }),
    );
    return Response.json({ ok: true });
  } catch (e) {
    return jsonError(e);
  }
}

