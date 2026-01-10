import Link from "next/link";
import { NewLoadForm } from "@/app/(app)/loads/new/NewLoadForm";

export default function NewLoadPage() {
  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight">Poster un load</div>
            <div className="mt-1 text-sm text-slate-600">
              Si le statut est <span className="font-semibold">POSTED</span>, il
              apparaîtra sur le <Link className="underline" href="/loadboard">loadboard public</Link>{" "}
              (sans détails). Les abonnés verront les détails.
            </div>
          </div>
          <Link className="toleka-btn-secondary" href="/dashboard">
            Retour
          </Link>
        </div>
      </div>

      <div className="toleka-card p-6">
        <NewLoadForm />
      </div>
    </div>
  );
}

