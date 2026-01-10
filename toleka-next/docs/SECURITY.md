## Sécurité (guide)

### Principes

- **RLS obligatoire** sur les tables multi-tenant
- **Least privilege** (roles / permissions)
- **Validation d’entrée** systématique (Zod)
- **Idempotence** sur les webhooks de paiement
- **Audit trail** sur opérations sensibles

### RLS (résumé)

- variables de session:
  - `app.tenant_id`
  - `app.user_id`
  - `app.user_role`
  - `app.plan_active` (abonnement actif → lecture des loads POSTED cross-tenant)
- policies:
  - lecture/écriture limitée au `tenant_id`
  - exceptions admin contrôlées

### Loadboard public (anti fuite)

- les visiteurs non abonnés lisent uniquement `LoadPublicListing` (données non sensibles)
- les abonnés lisent `Load` (RLS) pour accéder aux détails complets des loads POSTED

### Webhooks

- signature HMAC (timing-safe compare)
- protection replay (timestamp + nonce si dispo)
- traitement idempotent (`reference` unique)

