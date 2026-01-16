# eduhk
Application éducative complète pour la gestion des écoles en RDC (attendance RFID/NFC, chat parent ↔ école, calendrier, bulletins, dashboard admin). Développée avec React + Node.js/MongoDB scalable

## FretDRC — Load Board (demo)

This workspace now includes a runnable React + TypeScript demo app under `src/FretDRCApp.tsx`.

### Run locally

```bash
npm install
npm run dev
```

### Supabase (integration + Cursor)

- **Create a Supabase project** (Dashboard → Project Settings → API) and copy:
  - `Project URL` → `VITE_SUPABASE_URL`
  - `anon public key` → `VITE_SUPABASE_ANON_KEY`
- **Create `.env.local`** at the repo root (do not commit it) and use `.env.example` as a template.
- **Run the app** and use the “Supabase” panel to send a magic link and verify auth works end-to-end.

In Cursor, you can keep `.env.local` in your workspace for local dev, and ask Cursor to generate:
- SQL migrations for new tables/policies (RLS)
- typed queries/components around `src/supabaseClient.ts`

### Notes

- **Mock mode**: leave API base URL empty to use local mock loads.
- **Runtime headers**: set `window.__FRETDRC_HEADERS__ = { ... }` in the browser console to inject extra request headers.
- **401 auto-logout**: any 401 response clears `fretdrc.token` and logs out automatically.
