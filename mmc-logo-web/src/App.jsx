const outerText = 'MAINTENANCE DE MATERIEL'
const innerText = 'AU   CONGO'

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
      <section className="w-full max-w-4xl rounded-[2.5rem] border border-white/70 bg-white/80 px-6 py-12 text-center shadow-[0_45px_120px_rgba(15,23,42,0.12)] backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.55em] text-slate-400">
          Identité visuelle
        </p>
        <h1 className="mt-2 font-display text-3xl text-slate-900">
          MMC – Maintenance de Matériel au Congo
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
          Reproduction du sceau MMC avec un workflow moderne (React + Vite + Tailwind CSS). Tous les anneaux,
          textes circulaires et typographies sont générés dynamiquement pour rester nets sur toutes les tailles d’écran.
        </p>

        <div className="mx-auto mt-12 flex max-w-md items-center justify-center">
          <div className="relative h-[18rem] w-[18rem] sm:h-[21rem] sm:w-[21rem]">
            <div className="absolute inset-0 rounded-full border border-mmcBlue/25" />
            <div className="absolute inset-6 rounded-full border border-mmcBlue/40" />
            <div className="absolute inset-12 rounded-full border border-slate-200 bg-white" />

            <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full">
              <defs>
                <path id="outer-text" d="M 160 28 A 132 132 0 1 1 159.9 28" />
                <path id="inner-text" d="M 160 292 A 132 132 0 1 0 159.9 292" />
              </defs>

              <circle cx="160" cy="160" r="150" className="fill-none stroke-[#4b63ff] stroke-[1px]" />
              <circle cx="160" cy="160" r="120" className="fill-none stroke-[#4b63ff] stroke-[2px]" />
              <circle cx="160" cy="160" r="95" className="fill-[#ffffff] stroke-[#d1d5db] stroke-[1.5px]" />

              <text className="fill-mmcBlue text-[15px] font-semibold tracking-[0.4em]">
                <textPath href="#outer-text" startOffset="50%" textAnchor="middle">
                  {outerText}
                </textPath>
              </text>

              <text className="fill-mmcBlue text-[15px] font-semibold tracking-[0.75em]">
                <textPath href="#inner-text" startOffset="50%" textAnchor="middle">
                  {innerText}
                </textPath>
              </text>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span className="font-display text-5xl tracking-[0.55em] text-mmcBlue drop-shadow-glow sm:text-6xl">
                MMC
              </span>
              <span className="text-[0.8rem] tracking-[0.65em] text-slate-900">
                EST. 2001
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.4em] text-slate-400">
          <span className="rounded-full border border-slate-200/80 px-4 py-2">
            React
          </span>
          <span className="rounded-full border border-slate-200/80 px-4 py-2">
            Vite
          </span>
          <span className="rounded-full border border-slate-200/80 px-4 py-2">
            Tailwind CSS
          </span>
        </div>
      </section>
    </main>
  )
}

export default App
