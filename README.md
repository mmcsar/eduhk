# EduHK - Hit Coach

Application educative pour le coaching scolaire en RDC. **Hit Coach** est un module complet de gestion de coaching academique qui permet aux coaches de suivre les sessions, definir des objectifs, et fournir des retours personnalises aux eleves.

## Fonctionnalites

- **Tableau de bord** - Vue d'ensemble avec statistiques, sessions a venir, objectifs en cours et retours recents
- **Sessions de coaching** - Gestion des sessions individuelles, de groupe et ateliers avec suivi de statut
- **Objectifs** - Definition d'objectifs avec etapes (milestones), suivi de progression et priorites
- **Retours** - Evaluations par etoiles, points forts, axes d'amelioration et commentaires
- **Coaches** - Profils des coaches avec specialites et informations de contact

## Architecture

```
eduhk/
├── packages/
│   ├── api/          # Backend Express/TypeScript + MongoDB
│   │   ├── src/
│   │   │   ├── controllers/   # Logique metier
│   │   │   ├── models/        # Schemas Mongoose
│   │   │   ├── routes/        # Routes REST API
│   │   │   └── utils/         # Utilitaires (seed data)
│   │   └── package.json
│   └── web/          # Frontend React + Vite
│       ├── src/
│       │   ├── components/    # Composants reutilisables
│       │   ├── pages/         # Pages de l'application
│       │   ├── hooks/         # Hooks personnalises
│       │   ├── services/      # Client API
│       │   └── styles/        # CSS
│       └── package.json
├── docker-compose.yml         # MongoDB
└── package.json               # Monorepo workspaces
```

## Demarrage rapide

### Prerequis

- Node.js 18+
- Docker (pour MongoDB) ou MongoDB installe localement

### Installation

```bash
# Cloner le depot
git clone <repo-url>
cd eduhk

# Installer les dependances
npm install

# Demarrer MongoDB
docker compose up -d

# Configurer l'environnement
cp packages/api/.env.example packages/api/.env

# Demarrer l'application (API + Frontend)
npm run dev
```

### Variables d'environnement

Copier `packages/api/.env.example` vers `packages/api/.env` et configurer:

| Variable | Description | Defaut |
|----------|-------------|--------|
| `PORT` | Port de l'API | `4000` |
| `MONGODB_URI` | URI de connexion MongoDB | `mongodb://localhost:27017/eduhk` |
| `CORS_ORIGIN` | Origine CORS autorisee | `http://localhost:5173` |
| `SEED_DB` | Remplir la base avec des donnees exemples | `true` |

## API Endpoints

### Coaches
| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/coaches` | Liste des coaches |
| GET | `/api/coaches/:id` | Detail d'un coach |
| POST | `/api/coaches` | Creer un coach |
| PUT | `/api/coaches/:id` | Modifier un coach |
| DELETE | `/api/coaches/:id` | Desactiver un coach |

### Sessions
| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/sessions` | Liste des sessions (filtrable par status, coach, student, from, to) |
| GET | `/api/sessions/stats` | Statistiques des sessions |
| GET | `/api/sessions/:id` | Detail d'une session |
| POST | `/api/sessions` | Creer une session |
| PUT | `/api/sessions/:id` | Modifier une session |
| PATCH | `/api/sessions/:id/complete` | Terminer une session |
| PATCH | `/api/sessions/:id/cancel` | Annuler une session |

### Objectifs
| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/goals` | Liste des objectifs (filtrable par student, coach, status) |
| GET | `/api/goals/:id` | Detail d'un objectif |
| POST | `/api/goals` | Creer un objectif |
| PUT | `/api/goals/:id` | Modifier un objectif |
| PATCH | `/api/goals/:id/progress` | Mettre a jour la progression |
| PATCH | `/api/goals/:id/milestones/:index/toggle` | Basculer une etape |
| DELETE | `/api/goals/:id` | Supprimer un objectif |

### Retours
| Methode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/feedback` | Liste des retours |
| GET | `/api/feedback/:id` | Detail d'un retour |
| GET | `/api/feedback/student/:id/summary` | Resume d'un eleve |
| POST | `/api/feedback` | Creer un retour |
| PUT | `/api/feedback/:id` | Modifier un retour |
| DELETE | `/api/feedback/:id` | Supprimer un retour |

## Technologies

- **Frontend**: React 19, Vite 6, TypeScript, Lucide Icons
- **Backend**: Express 4, TypeScript, Mongoose 8
- **Base de donnees**: MongoDB 7
- **Outils**: npm workspaces, Docker Compose
