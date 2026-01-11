import Link from "next/link";
import { LoadCard } from "@/components/LoadCard";
import { MOCK_LOADS } from "@/lib/mockLoads";
import { filterLoads } from "@/lib/search";
import { type Equipment, type LoadSearchCriteria, type Province } from "@/lib/types";

function firstString(v: string | string[] | undefined): string | undefined {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function parseNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function toCriteria(sp: Record<string, string | string[] | undefined>): LoadSearchCriteria {
  const equipment = firstString(sp.equipment) as Equipment | undefined;
  const originProvince = firstString(sp.originProvince) as Province | undefined;
  const destinationProvince = firstString(sp.destinationProvince) as Province | undefined;

  return {
    equipment: equipment ?? "Any",
    originProvince: originProvince ?? "Any",
    originCity: firstString(sp.originCity),
    destinationProvince: destinationProvince ?? "Any",
    destinationCity: firstString(sp.destinationCity),
    minLengthFt: parseNumber(firstString(sp.minLengthFt)),
    maxLengthFt: parseNumber(firstString(sp.maxLengthFt)),
  };
}

function criteriaQuery(sp: Record<string, string | string[] | undefined>): string {
  const qp = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const s = firstString(v);
    if (s) qp.set(k, s);
  }
  const qs = qp.toString();
  return qs ? `?${qs}` : "";
}

export default async function LoadResultsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const criteria = toCriteria(sp);
  const results = filterLoads(MOCK_LOADS, criteria);

  const chips: string[] = [];
  if (criteria.equipment && criteria.equipment !== "Any") chips.push(criteria.equipment);
  if (criteria.originProvince && criteria.originProvince !== "Any")
    chips.push(`Origine: ${criteria.originProvince}`);
  if (criteria.originCity) chips.push(`Origine ville: ${criteria.originCity}`);
  if (criteria.destinationProvince && criteria.destinationProvince !== "Any")
    chips.push(`Dest: ${criteria.destinationProvince}`);
  if (criteria.destinationCity) chips.push(`Dest ville: ${criteria.destinationCity}`);
  if (typeof criteria.minLengthFt === "number") chips.push(`≥ ${criteria.minLengthFt} ft`);
  if (typeof criteria.maxLengthFt === "number") chips.push(`≤ ${criteria.maxLengthFt} ft`);

  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight">
              Résultats ({results.length})
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Loads (démo) — inspiré de DAT, adapté RDC.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="toleka-btn-secondary" href={`/loads${criteriaQuery(sp)}`}>
              Modifier la recherche
            </Link>
            <Link className="toleka-btn" href="/loads/results">
              Reset
            </Link>
          </div>
        </div>

        {chips.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {c}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-4">
        {results.length === 0 ? (
          <div className="toleka-card p-6">
            <div className="text-base font-extrabold">Aucun résultat</div>
            <div className="mt-1 text-sm text-slate-600">
              Essaie de retirer des filtres (equipment/province) ou de changer de
              ville.
            </div>
            <div className="mt-4">
              <Link className="toleka-btn" href="/loads">
                Retour à la recherche
              </Link>
            </div>
          </div>
        ) : (
          results.map((l) => <LoadCard key={l.id} load={l} />)
        )}
      </div>
    </div>
  );
}

