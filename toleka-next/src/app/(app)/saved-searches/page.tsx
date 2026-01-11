"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SavedSearch = {
  id: string;
  name: string;
  criteria: Record<string, string>;
  createdAt: string;
};

function toQuery(criteria: Record<string, string>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(criteria ?? {})) {
    if (!v) continue;
    sp.set(k, v);
  }
  return sp.toString();
}

export default function SavedSearchesPage() {
  const [rows, setRows] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useMemo(
    () => async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/saved-searches");
        if (!res.ok) throw new Error("Impossible de charger");
        const data = (await res.json()) as { data: SavedSearch[] };
        setRows(data.data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xl font-extrabold tracking-tight">Mes recherches</div>
            <div className="mt-1 text-sm text-slate-600">
              Accès rapide à tes filtres loadboard.
            </div>
          </div>
          <div className="flex gap-2">
            <Link className="toleka-btn-secondary" href="/loadboard">
              Loadboard public
            </Link>
            <Link className="toleka-btn-secondary" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      {error ? (
        <div className="toleka-card p-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      ) : null}

      <div className="grid gap-3">
        {loading ? (
          <div className="toleka-card p-6">
            <div className="text-sm text-slate-600">Chargement…</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="toleka-card p-6">
            <div className="text-base font-extrabold">Aucune recherche</div>
            <div className="mt-1 text-sm text-slate-600">
              Va sur le loadboard public et clique sur “Sauvegarder”.
            </div>
            <div className="mt-4">
              <Link className="toleka-btn" href="/loadboard">
                Ouvrir le loadboard
              </Link>
            </div>
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="toleka-card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-extrabold">{r.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link className="toleka-btn" href={`/loadboard?${toQuery(r.criteria)}`}>
                    Ouvrir
                  </Link>
                  <button
                    type="button"
                    className="toleka-btn-secondary"
                    onClick={async () => {
                      const ok = confirm(`Supprimer “${r.name}” ?`);
                      if (!ok) return;
                      const res = await fetch(`/api/saved-searches/${r.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) refresh();
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(r.criteria ?? {}).map(([k, v]) => (
                  <span
                    key={`${r.id}:${k}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                  >
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

