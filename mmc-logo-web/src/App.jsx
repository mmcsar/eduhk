import { useState } from 'react'

const outerText = 'MAINTENANCE DE MATERIEL'
const innerText = 'AU   CONGO'

function App() {
  const [seed, setSeed] = useState(0)

  const restartAnimation = () => setSeed((prev) => prev + 1)

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

            <svg
              key={seed}
              viewBox="0 0 320 320"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <path id="outer-text" d="M 160 28 A 132 132 0 1 1 159.9 28" />
                <path id="inner-text" d="M 160 292 A 132 132 0 1 0 159.9 292" />
              </defs>

              <circle
                cx="160"
                cy="160"
                r="150"
                className="fill-none stroke-[#4b63ff] stroke-[1px] animate-ring-draw"
                style={{ animationDelay: '0s' }}
              />
              <circle
                cx="160"
                cy="160"
                r="120"
                className="fill-none stroke-[#4b63ff] stroke-[2px] animate-ring-draw"
                style={{ animationDelay: '0.15s' }}
              />
              <circle
                cx="160"
                cy="160"
                r="95"
                className="fill-[#ffffff] stroke-[#d1d5db] stroke-[1.5px] animate-ring-draw"
                style={{ animationDelay: '0.3s' }}
              />

              <text
                className="fill-mmcBlue text-[15px] font-semibold tracking-[0.4em] animate-fade-up"
                style={{ animationDelay: '0.45s' }}
              >
                <textPath href="#outer-text" startOffset="50%" textAnchor="middle">
                  {outerText}
                </textPath>
              </text>

              <text
                className="fill-mmcBlue text-[15px] font-semibold tracking-[0.75em] animate-fade-up"
                style={{ animationDelay: '0.65s' }}
              >
                <textPath href="#inner-text" startOffset="50%" textAnchor="middle">
                  {innerText}
                </textPath>
              </text>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <span
                className="font-display text-5xl tracking-[0.55em] text-mmcBlue drop-shadow-glow animate-scale-in sm:text-6xl"
                style={{ animationDelay: '0.8s' }}
              >
                MMC
              </span>
              <span
                className="text-[0.8rem] tracking-[0.65em] text-slate-900 animate-fade-up"
                style={{ animationDelay: '1s' }}
              >
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

        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={restartAnimation}
            className="rounded-full border border-mmcBlue/20 bg-mmcBlue px-6 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-mmcBlueDark focus:outline-none focus:ring-2 focus:ring-mmcBlue/40"
          >
            Relancer l’animation
          </button>
          <p className="text-[0.75rem] uppercase tracking-[0.4em] text-slate-400">
            {`Lecture #${seed + 1}`}
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
