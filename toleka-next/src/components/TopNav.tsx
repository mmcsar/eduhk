"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={[
        "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-blue-600 text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export function TopNav() {
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-lg bg-blue-600 text-sm font-black tracking-tight text-white">
            T
          </div>
          <div className="leading-tight">
            <div className="text-base font-extrabold tracking-tight text-slate-900">
              Toleka
            </div>
            <div className="text-xs text-slate-500">
              Haut‑Katanga • Lualaba
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink href="/dashboard" label="Accueil" />
          <NavLink href="/loads" label="Trouver des loads" />
          <button
            type="button"
            className="ml-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => {
              try {
                localStorage.removeItem("toleka_demo_user");
              } catch {
                // ignore
              }
              router.push("/login");
            }}
          >
            Déconnexion
          </button>
        </nav>
      </div>
    </header>
  );
}

