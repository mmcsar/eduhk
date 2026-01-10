"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
              setLoading(true);
              await new Promise((r) => setTimeout(r, 350));
              try {
                localStorage.setItem(
                  "toleka_demo_user",
                  JSON.stringify({ username: username || "demo" }),
                );
              } catch {
                // ignore
              }
              router.push("/dashboard");
            }}
          >
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Nom d’utilisateur
              </label>
              <input
                className="toleka-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: dispatch@toleka.cd"
                autoComplete="username"
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

            <button className="toleka-btn w-full" type="submit" disabled={loading}>
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <div className="text-xs text-slate-500">
              Démo: ce login est un mock (pas de backend).
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

