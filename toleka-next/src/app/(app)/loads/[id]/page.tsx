import Link from "next/link";
import { LoadDetailsClient } from "@/app/(app)/loads/[id]/ui";

export default async function LoadDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight">Détails du load</div>
            <div className="mt-1 text-sm text-slate-600">
              Page abonné (détails + bids/offers).
            </div>
          </div>
          <div className="flex gap-2">
            <Link className="toleka-btn-secondary" href="/loadboard">
              Loadboard
            </Link>
            <Link className="toleka-btn-secondary" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <LoadDetailsClient loadId={id} />
    </div>
  );
}

