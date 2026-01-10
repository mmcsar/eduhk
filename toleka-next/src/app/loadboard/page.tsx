import { Container } from "@/components/Container";
import Link from "next/link";
import { LoadboardClient } from "@/app/loadboard/LoadboardClient";

export default function LoadboardPage() {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-slate-200 bg-white">
        <Container>
          <div className="flex items-center justify-between py-3">
            <Link href="/loadboard" className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-lg bg-blue-600 text-sm font-black tracking-tight text-white">
                T
              </div>
              <div className="leading-tight">
                <div className="text-base font-extrabold tracking-tight text-slate-900">
                  Toleka
                </div>
                <div className="text-xs text-slate-500">Loadboard public</div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link className="toleka-btn-secondary" href="/login">
                Se connecter
              </Link>
              <Link className="toleka-btn" href="/register">
                S’abonner
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main className="py-6">
        <Container>
          <LoadboardClient />
        </Container>
      </main>
    </div>
  );
}

