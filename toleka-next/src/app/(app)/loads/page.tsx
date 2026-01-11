import Link from "next/link";
import { LoadSearchForm } from "@/app/(app)/loads/LoadSearchForm";

export default async function LoadsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const initial: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") initial[k] = v;
  }

  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight">
              Find Loads
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Recherche inspirée de DAT (démo) — focus Haut‑Katanga & Lualaba.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="toleka-btn-secondary"
              href="/loads?originProvince=Haut-Katanga"
            >
              Origine: Haut‑Katanga
            </Link>
            <Link className="toleka-btn-secondary" href="/loads?originProvince=Lualaba">
              Origine: Lualaba
            </Link>
            <Link className="toleka-btn-secondary" href="/loads?equipment=Flatbed">
              Flatbed
            </Link>
          </div>
        </div>
      </div>

      <div className="toleka-card p-6">
        <div className="mb-4 text-base font-extrabold tracking-tight">
          Critères
        </div>
        <LoadSearchForm initial={initial} />
      </div>

      <div className="toleka-card p-6">
        <div className="text-sm text-slate-600">
          Astuce: tu peux taper une ville (Lubumbashi, Kolwezi, Kasumbalesa…),
          ou filtrer par province.
        </div>
      </div>
    </div>
  );
}

