## Toleka Mobile (Expo + EAS)

### Prérequis

- Node.js + npm
- Compte Expo (pour EAS)

### Variables d’environnement

Crée un `.env` à partir de `.env.example` et configure:
- `EXPO_PUBLIC_API_BASE_URL`

> Sur téléphone, évite `localhost` et utilise l’IP de ton PC (ex: `http://192.168.1.10:3000`).

### Dev

```bash
npm install
npm run start
```

### EAS Build (Android)

```bash
npm i -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

### EAS Update (OTA)

```bash
eas update --channel preview
```

