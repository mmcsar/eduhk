"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "TENANT_ADMIN" | "BROKER" | "DISPATCHER" | "DRIVER";

export default function RegisterPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TENANT_ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-lg">
        <div className="toleka-card p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-600 text-base font-black text-white">
                T
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-tight">
                  Créer une entreprise (SaaS)
                </div>
                <div className="text-sm text-slate-500">
                  Chaque abonné a son dashboard (RLS) + accès aux détails.
                </div>
              </div>
            </div>
            <Link className="toleka-btn-secondary" href="/login">
              Se connecter
            </Link>
          </div>

          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const res = await fetch("/api/auth/register", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ tenantName, email, password, role }),
                });
                if (!res.ok) {
                  const data = (await res.json().catch(() => null)) as
                    | { error?: { message?: string } }
                    | null;
                  setError(data?.error?.message ?? "Création impossible");
                  return;
                }
                router.push("/dashboard");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Nom de l’entreprise
              </label>
              <input
                className="toleka-input"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="ex: MMC SARL"
                autoComplete="organization"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                className="toleka-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: admin@mmc.cd"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Rôle
              </label>
              <select
                className="toleka-select"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value="TENANT_ADMIN">Admin (entreprise)</option>
                <option value="BROKER">Broker</option>
                <option value="DISPATCHER">Dispatcher</option>
                <option value="DRIVER">Driver</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <input
                className="toleka-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 caractères"
                type="password"
                autoComplete="new-password"
              />
            </div>

            {error ? (
              <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button className="toleka-btn" type="submit" disabled={loading}>
                {loading ? "Création…" : "Créer mon compte"}
              </button>
              <Link className="text-sm font-semibold text-slate-600 hover:underline" href="/loadboard">
                Voir le loadboard public
              </Link>
            </div>

            <div className="md:col-span-2 text-xs text-slate-500">
              En prod, l’abonnement sera géré via facturation/paiements. Pour le
              MVP, le tenant est créé avec un statut abonnement ACTIVE.
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Toleka
        </div>
      </div>
    </div>
  );
}

