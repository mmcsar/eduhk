## API Reference (squelette)

Les endpoints seront exposés via `src/app/api/**/route.ts`.

### Conventions

- **Auth**: JWT (header `Authorization: Bearer <token>`)
- **Erreurs**: JSON `{ error: { code, message, details? } }`
- **Validation**: Zod côté serveur
- **Pagination**: `?cursor=` / `?limit=`

### Health

- `GET /api/health`
  - Réponse: `{ ok: true, time: ISOString }`

### Auth (à implémenter)

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

