# Pata RDC Mobile

## Run

```bash
npm install
npm start
```

## API configuration (Step 2)

This app reads the backend base URL from `EXPO_PUBLIC_API_BASE_URL`.

- Copy `.env.example` to `.env` and update it:

```bash
cp .env.example .env
```

If `EXPO_PUBLIC_API_BASE_URL` is not set, the app uses a **mock auth** fallback so you can still navigate and test UI.

