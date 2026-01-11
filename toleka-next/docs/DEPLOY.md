## Déploiement (squelette)

### Environnements

- `development`: docker-compose Postgres + Redis
- `preview`: déploiement auto (CI)
- `production`: DB managée + secrets (env vars)

### Variables d’environnement

Voir `.env.example`.

### Commandes

```bash
npm run lint
npm run build
npm run start
```

