# AGENTS.md

Guidance for automated agents working in this repository.

## Project overview

- **App**: `FretDRC — Load Board (demo)` (React + TypeScript + Vite)
- **Entry**: `src/main.tsx` renders `src/FretDRCApp.tsx`
- **Data**: Uses **mock mode** when no API base URL is configured; otherwise talks to a backend over HTTP.
- **Key libs**: `@tanstack/react-query` for fetching/caching, `zod` for runtime validation.

## Setup & run

```bash
npm install
npm run dev
```

## Build / verification

There are no explicit lint/test scripts. Before finishing a change, prefer:

```bash
npm run build
```

## Repo structure (high-signal)

- `src/main.tsx`: React root.
- `src/FretDRCApp.tsx`: Entire UI + data layer lives here (large single-file app; mostly inline styles).
- `index.html`: Vite entry HTML.
- `vite.config.ts`: Vite config (minimal).

## Runtime behavior notes (important for changes)

- **Mock mode**: if `baseUrl` is empty, the app uses local mock loads (`MOCK`) and client-side filtering/paging.
- **Auth/token**:
  - Token is stored as JSON in `localStorage` or `sessionStorage` under `fretdrc.token`.
  - Any **401** response triggers auto-logout: token cleared + `fretdrc:unauthorized` event dispatched.
- **Extra headers injection**: the app merges `window.__FRETDRC_HEADERS__` into request headers at runtime.
- **Backend endpoints used** (when `baseUrl` is set):
  - `POST /auth/login`
  - `GET /health` (fallback: `GET /ping`)
  - `GET /loads?…` (cursor pagination)
  - `GET /loads/:id`
  - `POST /loads/:id/offers`

## Code style / constraints

- **TypeScript strict** is enabled (`tsconfig.json`).
- Prefer **small, localized edits** in `src/FretDRCApp.tsx`; avoid broad refactors unless required.
- Keep UI patterns consistent (inline styles + small local components like `Panel`, `Row`, `Button`).
- Don’t introduce new dependencies unless necessary; if you do, update `package.json` via npm and keep changes minimal.

## Common pitfalls

- Preserve the mock/server split (`baseUrl` empty vs set).
- When adjusting network code, keep **401 handling** and **extra headers** behavior intact.
- React Query: changes to query keys or pagination should keep `fetchNextPage()` behavior and `nextCursor` support.

