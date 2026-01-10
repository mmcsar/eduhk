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
- policies:
  - lecture/écriture limitée au `tenant_id`
  - exceptions admin contrôlées

### Webhooks

- signature HMAC (timing-safe compare)
- protection replay (timestamp + nonce si dispo)
- traitement idempotent (`reference` unique)

