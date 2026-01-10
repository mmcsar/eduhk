"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="toleka-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-600 text-base font-black text-white">
              T
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-tight">
                Bienvenue sur Toleka
              </div>
              <div className="text-sm text-slate-500">
                Modèle type DAT — RDC (Haut‑Katanga & Lualaba)
              </div>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setLoading(true);
              try {
                const res = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ email, password }),
                });
                if (!res.ok) {
                  const data = (await res.json().catch(() => null)) as
                    | { error?: { message?: string } }
                    | null;
                  setError(data?.error?.message ?? "Connexion impossible");
                  return;
                }
                router.push("/dashboard");
              } finally {
                setLoading(false);
              }
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Email
              </label>
              <input
                className="toleka-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: dispatch@mmc.cd"
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>
              <input
                className="toleka-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button className="toleka-btn w-full" type="submit" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <Link className="hover:underline" href="/register">
                Créer un compte entreprise
              </Link>
              <Link className="hover:underline" href="/loadboard">
                Voir le loadboard public
              </Link>
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

