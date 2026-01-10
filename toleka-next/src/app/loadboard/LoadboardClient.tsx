"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PROVINCES } from "@/lib/locations";
import { useRouter } from "next/navigation";

type PublicLoad = {
  id: string;
  status: string;
  originProvince: string;
  originCity: string;
  destinationProvince: string;
  destinationCity: string;
  equipment: string;
  lengthFt: number;
  weightKg: number;
  createdAt: string;
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const hours = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60));
  if (Number.isFinite(hours) && hours >= 0) return `${hours}h`;
  return "—";
}

export function LoadboardClient({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();

  const [originProvince, setOriginProvince] = useState<string>(
    initial.originProvince ?? "Any",
  );
  const [destinationProvince, setDestinationProvince] = useState<string>(
    initial.destinationProvince ?? "Any",
  );
  const [originCity, setOriginCity] = useState(initial.originCity ?? "");
  const [destinationCity, setDestinationCity] = useState(initial.destinationCity ?? "");
  const [equipment, setEquipment] = useState(initial.equipment ?? "");
  const [sort, setSort] = useState<"newest" | "oldest">(
    initial.sort === "oldest" ? "oldest" : "newest",
  );
  const [limit, setLimit] = useState(() => {
    const n = Number(initial.limit ?? "25");
    if (!Number.isFinite(n)) return 25;
    return Math.max(1, Math.min(100, n));
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PublicLoad[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState<{ user: { id: string; email: string } | null } | null>(
    null,
  );

  const query = useMemo(() => {
    const sp = new URLSearchParams();
    if (originProvince !== "Any") sp.set("originProvince", originProvince);
    if (destinationProvince !== "Any") sp.set("destinationProvince", destinationProvince);
    if (originCity) sp.set("originCity", originCity);
    if (destinationCity) sp.set("destinationCity", destinationCity);
    if (equipment) sp.set("equipment", equipment);
    if (sort) sp.set("sort", sort);
    sp.set("limit", String(limit));
    return sp.toString();
  }, [originProvince, destinationProvince, originCity, destinationCity, equipment, sort, limit]);

  useEffect(() => {
    // keep URL synced (no cursor in URL)
    router.replace(`/loadboard?${query}`);
  }, [query, router]);

  useEffect(() => {
    // detect login (optional)
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d))
      .catch(() => setMe({ user: null }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRows([]);
    setNextCursor(null);
    fetch(`/api/loadboard?${query}`, { method: "GET" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Loadboard indisponible");
        const data = (await r.json()) as { data: PublicLoad[]; nextCursor?: string | null };
        if (!cancelled) {
          setRows(data.data ?? []);
          setNextCursor(data.nextCursor ?? null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="toleka-card p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-lg font-extrabold tracking-tight">Loadboard public</div>
            <div className="mt-1 text-sm text-slate-600">
              Aperçu gratuit. Les détails (contacts/prix) sont réservés aux abonnés.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className="toleka-btn" href="/register">
              S’abonner
            </Link>
            <Link className="toleka-btn-secondary" href="/login">
              Se connecter
            </Link>
            {me?.user ? (
              <>
                <button
                  type="button"
                  className="toleka-btn-secondary"
                  disabled={saving}
                  onClick={async () => {
                    const name = prompt("Nom de la recherche (ex: HK → Zambie)")?.trim();
                    if (!name) return;
                    setSaving(true);
                    try {
                      const criteria: Record<string, string> = {};
                      if (originProvince !== "Any") criteria.originProvince = originProvince;
                      if (destinationProvince !== "Any")
                        criteria.destinationProvince = destinationProvince;
                      if (originCity) criteria.originCity = originCity;
                      if (destinationCity) criteria.destinationCity = destinationCity;
                      if (equipment) criteria.equipment = equipment;
                      criteria.sort = sort;
                      criteria.limit = String(limit);

                      const res = await fetch("/api/saved-searches", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ name, criteria }),
                      });
                      if (!res.ok) return;
                      router.push("/saved-searches");
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Sauvegarder
                </button>
                <Link className="toleka-btn-secondary" href="/saved-searches">
                  Mes recherches
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="toleka-card p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Origine (province)
            </label>
            <select
              className="toleka-select"
              value={originProvince}
              onChange={(e) => setOriginProvince(e.target.value)}
            >
              <option value="Any">Any</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Destination (province)
            </label>
            <select
              className="toleka-select"
              value={destinationProvince}
              onChange={(e) => setDestinationProvince(e.target.value)}
            >
              <option value="Any">Any</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Origine (ville)
            </label>
            <input
              className="toleka-input"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="ex: Lubumbashi"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Destination (ville)
            </label>
            <input
              className="toleka-input"
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="ex: Kolwezi"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Equipment
            </label>
            <input
              className="toleka-input"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder="ex: Flatbed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Tri
            </label>
            <select
              className="toleka-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Limite
            </label>
            <select
              className="toleka-select"
              value={String(limit)}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-10 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Résultats: <span className="font-semibold text-slate-900">{rows.length}</span>
            </div>
            <button
              type="button"
              className="toleka-btn-secondary"
              onClick={() => {
                setOriginProvince("Any");
                setDestinationProvince("Any");
                setOriginCity("");
                setDestinationCity("");
                setEquipment("");
                setSort("newest");
                setLimit(25);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="toleka-card p-5">
          <div className="text-sm text-red-700">{error}</div>
          <div className="mt-1 text-xs text-slate-500">
            Astuce: configure la base de données (`DATABASE_URL`) et lance les migrations.
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        {loading ? (
          <div className="toleka-card p-5">
            <div className="text-sm text-slate-600">Chargement…</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="toleka-card p-5">
            <div className="text-base font-extrabold">Aucun load</div>
            <div className="mt-1 text-sm text-slate-600">
              Publie un load (abonné) pour le voir apparaître ici.
            </div>
          </div>
        ) : (
          rows.map((l) => (
            <div key={l.id} className="toleka-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">
                    {l.originCity}, {l.originProvince} → {l.destinationCity},{" "}
                    {l.destinationProvince}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {l.equipment} • {l.lengthFt} ft • {l.weightKg.toLocaleString()} kg
                  </div>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                  <div className="text-sm font-extrabold text-slate-900">—</div>
                  <div className="text-xs text-slate-500">{formatWhen(l.createdAt)} ago</div>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-700">Détails:</span>{" "}
                  verrouillés (abonnement requis)
                </div>
                <div className="flex gap-2">
                  {me?.user ? (
                    <Link className="toleka-btn" href={`/loads/${l.id}`}>
                      Voir détails
                    </Link>
                  ) : (
                    <>
                      <Link className="toleka-btn-secondary" href="/login">
                        Se connecter
                      </Link>
                      <Link className="toleka-btn" href="/register">
                        Débloquer
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {nextCursor ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="toleka-btn-secondary"
            disabled={loadingMore}
            onClick={async () => {
              setLoadingMore(true);
              try {
                const res = await fetch(
                  `/api/loadboard?${query}&cursor=${encodeURIComponent(nextCursor)}`,
                );
                if (!res.ok) return;
                const data = (await res.json()) as { data: PublicLoad[]; nextCursor?: string | null };
                setRows((prev) => [...prev, ...(data.data ?? [])]);
                setNextCursor(data.nextCursor ?? null);
              } finally {
                setLoadingMore(false);
              }
            }}
          >
            {loadingMore ? "Chargement…" : "Charger plus"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
