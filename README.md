# eduhk

Application éducative pour la gestion des écoles en RDC (attendance RFID/NFC, chat parent ↔ école, calendrier, bulletins, dashboard admin).

## Structure

- `apps/web`: front React (Vite + TypeScript)
- `apps/api`: API Node.js (Express + TypeScript)
- `docker-compose.yml`: MongoDB (local)

## Prérequis

- Node.js \(>= 20\)
- Docker \(optionnel, pour MongoDB\)

## Démarrage rapide

Installer toutes les dépendances (workspaces npm) :

```bash
npm install
```

Lancer MongoDB (optionnel) :

```bash
docker compose up -d
```

Lancer le front + l’API en dev :

```bash
npm run dev
```

Endpoints utiles :

- API healthcheck : `GET http://localhost:4000/health`
