import Link from "next/link";

function ActionCard({
  title,
  description,
  href,
  cta,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  disabled?: boolean;
}) {
  const inner = (
    <div className="toleka-card p-5 transition-shadow hover:shadow-md">
      <div className="text-base font-extrabold tracking-tight">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{description}</div>
      <div className="mt-4">
        <span
          className={[
            "inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-semibold",
            disabled
              ? "bg-slate-100 text-slate-400"
              : "bg-blue-600 text-white",
          ].join(" ")}
        >
          {cta}
        </span>
      </div>
    </div>
  );

  if (disabled) return inner;
  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="toleka-card p-6">
        <div className="text-xl font-extrabold tracking-tight">
          Tableau de bord
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Trouve des opportunités de fret au départ / vers le Haut‑Katanga et le
          Lualaba.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ActionCard
          title="Trouver des loads"
          description="Rechercher des charges disponibles (mock)."
          href="/loads"
          cta="Find Loads"
        />
        <ActionCard
          title="Poster un load"
          description="Publier une charge (à ajouter plus tard)."
          href="/loads"
          cta="Post Load"
          disabled
        />
        <ActionCard
          title="Trouver des camions"
          description="Rechercher des camions (à ajouter plus tard)."
          href="/loads"
          cta="Find Trucks"
          disabled
        />
      </div>

      <div className="toleka-card p-6">
        <div className="text-base font-extrabold tracking-tight">
          Raccourcis RDC
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="toleka-btn-secondary" href="/loads?originCity=Lubumbashi">
            Lubumbashi
          </Link>
          <Link className="toleka-btn-secondary" href="/loads?originCity=Kolwezi">
            Kolwezi
          </Link>
          <Link className="toleka-btn-secondary" href="/loads?originCity=Likasi">
            Likasi
          </Link>
          <Link className="toleka-btn-secondary" href="/loads?originCity=Kasumbalesa">
            Kasumbalesa
          </Link>
        </div>
      </div>
    </div>
  );
}

