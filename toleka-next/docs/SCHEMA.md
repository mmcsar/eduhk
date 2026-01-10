## Schéma base de données (cible)

Le schéma est défini dans `prisma/schema.prisma`. Les politiques RLS sont appliquées via migrations SQL (Prisma `sql`), car Prisma ne gère pas les policies directement.

### Tables principales (cible)

- `tenants`
- `users`
- `shipper_profiles`
- `carrier_profiles`
- `shipments`
- `payments`
- `conversations`
- `chat_messages`
- `notifications`
- `tracking_history`
- `audit_logs`

### Indexes

Voir `prisma/migrations/**` (à ajouter) pour:
- index sur `shipments(status)`, `shipments(trackingNumber)`, `payments(reference)`, etc.
- indexes composites sur villes/dates selon les requêtes.

