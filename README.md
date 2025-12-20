# eduhk
Application éducative complète pour la gestion des écoles en RDC (attendance RFID/NFC, chat parent ↔ école, calendrier, bulletins, dashboard admin). Développée avec React + Node.js/MongoDB scalable

## FretDRC — Load Board (demo)

This workspace now includes a runnable React + TypeScript demo app under `src/FretDRCApp.tsx`.

### Run locally

```bash
npm install
npm run dev
```

### Notes

- **Mock mode**: leave API base URL empty to use local mock loads.
- **Runtime headers**: set `window.__FRETDRC_HEADERS__ = { ... }` in the browser console to inject extra request headers.
- **401 auto-logout**: any 401 response clears `fretdrc.token` and logs out automatically.
