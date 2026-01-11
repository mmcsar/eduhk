# Nazui

## Nazui — Load Board (demo)

This workspace includes a runnable React + TypeScript demo app under `src/FretDRCApp.tsx`.

### Run locally

```bash
npm install
npm run dev
```

### Notes

- **Mock mode**: leave API base URL empty to use local mock loads.
- **Runtime headers**: set `window.__NAZUI_HEADERS__ = { ... }` in the browser console to inject extra request headers.
- **401 auto-logout**: any 401 response clears `nazui.token` and logs out automatically.
