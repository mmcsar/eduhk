# eduhk
Application éducative complète pour la gestion des écoles en RDC (attendance RFID/NFC, chat parent ↔ école, calendrier, bulletins, dashboard admin). Développée avec React + Node.js/MongoDB scalable

## Supabase (connexion rapide)

Ce dépôt inclut un **client Supabase** prêt à l’emploi (Node.js) + un script de vérification.

### Prérequis

- Créer un projet sur Supabase
- Récupérer `Project URL` et `anon public key` (Dashboard Supabase → Project Settings → API)

### Configuration

1) Crée un fichier `.env` à la racine en t’inspirant de `.env.example`:

```
SUPABASE_URL="https://XXXX.supabase.co"
SUPABASE_ANON_KEY="eyJ..."
```

2) Installer les dépendances:

```
npm install
```

3) Vérifier que Supabase répond:

```
npm run supabase:healthcheck
```

### Utilisation dans le code

- Le client est dans `src/supabaseClient.js` via `createSupabaseClient()`.
