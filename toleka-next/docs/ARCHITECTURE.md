## 🏗️ TOLEKA — Architecture (référence)

Cette documentation décrit la cible “enterprise-grade” de Toleka (multi-tenant, RLS, temps réel, CRM, paiements, IA).

### Vue d’ensemble

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Route Handlers Next.js + services/repositories, jobs asynchrones
- **DB**: PostgreSQL (RLS) + migrations (Prisma)
- **Temps réel**: WebSocket (Socket.io) + Redis Pub/Sub
- **Cache**: Redis
- **CRM**: HubSpot API v3 (sync évènementielle + batch)
- **Paiements**: Mobile Money (Orange/M-Pesa/Airtel) via webhooks + idempotence
- **IA**: Matching et estimation prix (LLM + règles)

### Couches

1. **Client layer**: Web/PWA (et plus tard mobile), i18n (FR/LN/SW)
2. **Application layer**: Auth, API, SSR/CSR, middleware
3. **Data layer**: Postgres RLS, Redis, stockage fichiers, queue
4. **External services**: HubSpot, OpenAI, Mobile Money, email/SMS
5. **Real-time layer**: tracking GPS, chat, notifications, statut paiement

### Multi-tenant + RLS (principe)

- Chaque table “métier” est rattachée à un `tenantId`
- La session DB reçoit un contexte (`app.tenant_id`, `app.user_id`, `app.user_role`)
- Les policies RLS filtrent automatiquement les lignes

### Dossiers (cible)

```
src/
  app/
    (auth)/
    (dashboard)/
    api/
  components/
  lib/
  services/
  repositories/
  hooks/
  config/
  types/
prisma/
docs/
```

