"use client";

import { useEffect, useMemo, useState } from "react";

type Load = {
  id: string;
  tenantId: string;
  status: string;
  originCity: string;
  originProvince: string;
  destinationCity: string;
  destinationProvince: string;
  equipment: string;
  lengthFt: number;
  weightKg: number;
  rateUsd?: number | null;
  companyName?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  notes?: string | null;
  createdAt: string;
};

type Bid = {
  id: string;
  loadId: string;
  tenantId: string;
  userId: string;
  status: string;
  amountUsd?: number | null;
  message?: string | null;
  createdAt: string;
};

type Me = {
  user: { id: string; email: string } | null;
  tenant: { id: string; name: string } | null;
  role?: string;
  subscription?: { status: string; plan: string } | null;
};

function moneyUsd(v?: number | null) {
  if (v === null || v === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

export function LoadDetailsClient({ loadId }: { loadId: string }) {
  const [me, setMe] = useState<Me | null>(null);
  const [load, setLoad] = useState<Load | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amountUsd, setAmountUsd] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isOwner = useMemo(() => {
    if (!me?.tenant?.id || !load?.tenantId) return false;
    return me.tenant.id === load.tenantId;
  }, [me?.tenant?.id, load?.tenantId]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [meRes, loadRes, bidsRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch(`/api/loads/${loadId}`),
        fetch(`/api/loads/${loadId}/bids`),
      ]);
      const meData = (await meRes.json()) as Me;
      setMe(meData);

      if (!loadRes.ok) {
        const data = (await loadRes.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(data?.error?.message ?? "Impossible de charger le load");
      }
      const loadData = (await loadRes.json()) as { data: Load };
      setLoad(loadData.data);

      if (bidsRes.ok) {
        const bidsData = (await bidsRes.json()) as { data: Bid[] };
        setBids(bidsData.data ?? []);
      } else {
        setBids([]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadId]);

  if (loading) {
    return (
      <div className="toleka-card p-6">
        <div className="text-sm text-slate-600">Chargement…</div>
      </div>
    );
  }

  if (error || !load) {
    return (
      <div className="toleka-card p-6">
        <div className="text-sm text-red-700">{error ?? "Erreur"}</div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="toleka-card p-6 lg:col-span-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-extrabold">
              {load.originCity}, {load.originProvince} → {load.destinationCity},{" "}
              {load.destinationProvince}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {load.equipment} • {load.lengthFt} ft • {load.weightKg.toLocaleString()} kg
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-extrabold">{moneyUsd(load.rateUsd)}</div>
            <div className="text-xs text-slate-500">
              {new Date(load.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-500">Société</div>
            <div className="text-sm font-semibold text-slate-900">
              {load.companyName || "—"}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold text-slate-500">Contact</div>
            <div className="text-sm font-semibold text-slate-900">
              {load.contactName || "—"}
            </div>
            <div className="text-sm text-slate-700">{load.contactPhone || "—"}</div>
          </div>
        </div>

        {load.notes ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
            <div className="text-xs font-semibold text-slate-500">Notes</div>
            <div className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
              {load.notes}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="toleka-card p-6">
          <div className="text-base font-extrabold">Bids / Offers</div>
          <div className="mt-1 text-sm text-slate-600">
            {isOwner
              ? "Accepte/refuse les offres reçues."
              : "Envoie une offre pour ce load."}
          </div>
        </div>

        {!isOwner ? (
          <div className="toleka-card p-6">
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  const res = await fetch(`/api/loads/${loadId}/bids`, {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      amountUsd: amountUsd ? Number(amountUsd) : undefined,
                      message: message || undefined,
                    }),
                  });
                  if (!res.ok) {
                    const data = (await res.json().catch(() => null)) as
                      | { error?: { message?: string } }
                      | null;
                    throw new Error(data?.error?.message ?? "Impossible d’envoyer l’offre");
                  }
                  setAmountUsd("");
                  setMessage("");
                  await refresh();
                } catch (e2) {
                  setError(e2 instanceof Error ? e2.message : "Erreur");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Offre (USD)
                </label>
                <input
                  className="toleka-input"
                  value={amountUsd}
                  onChange={(e) => setAmountUsd(e.target.value)}
                  inputMode="numeric"
                  placeholder="ex: 1450"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Message
                </label>
                <textarea
                  className="toleka-input min-h-20"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="optionnel"
                />
              </div>
              <button className="toleka-btn w-full" disabled={submitting} type="submit">
                {submitting ? "Envoi…" : "Envoyer l’offre"}
              </button>
            </form>
          </div>
        ) : null}

        <div className="toleka-card p-6">
          <div className="text-sm text-slate-600">
            Offres reçues: <span className="font-semibold text-slate-900">{bids.length}</span>
          </div>

          <div className="mt-3 space-y-3">
            {bids.length === 0 ? (
              <div className="text-sm text-slate-600">Aucune offre pour l’instant.</div>
            ) : (
              bids.map((b) => (
                <div key={b.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900">
                        {moneyUsd(b.amountUsd)}{" "}
                        <span className="text-xs font-semibold text-slate-500">
                          ({b.status})
                        </span>
                      </div>
                      {b.message ? (
                        <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                          {b.message}
                        </div>
                      ) : null}
                      <div className="mt-1 text-xs text-slate-500">
                        {new Date(b.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {isOwner && b.status === "SUBMITTED" ? (
                      <div className="flex shrink-0 flex-col gap-2">
                        <button
                          type="button"
                          className="toleka-btn"
                          onClick={async () => {
                            await fetch(`/api/loads/${loadId}/bids/${b.id}`, {
                              method: "PATCH",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ action: "accept" }),
                            });
                            refresh();
                          }}
                        >
                          Accepter
                        </button>
                        <button
                          type="button"
                          className="toleka-btn-secondary"
                          onClick={async () => {
                            await fetch(`/api/loads/${loadId}/bids/${b.id}`, {
                              method: "PATCH",
                              headers: { "content-type": "application/json" },
                              body: JSON.stringify({ action: "reject" }),
                            });
                            refresh();
                          }}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

