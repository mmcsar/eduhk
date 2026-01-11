# 🏠 MMC Immo - Configuration Base de Données

Ce dossier contient tous les fichiers nécessaires pour configurer la base de données Supabase pour l'application immobilière MMC Immo à Lubumbashi.

## 📁 Structure des fichiers

```
supabase/
├── migrations/
│   ├── 20240101000000_initial_schema.sql    # Schéma principal (tables, index, triggers)
│   ├── 20240101000001_rls_policies.sql      # Politiques de sécurité Row Level Security
│   └── 20240101000002_storage.sql           # Configuration du stockage (images)
├── seed.sql                                  # Données de test pour développement
├── config.toml                               # Configuration Supabase local
└── README.md                                 # Ce fichier
```

## 🚀 Installation

### Option 1: Supabase Cloud (Recommandé pour production)

1. **Créer un projet Supabase**
   - Allez sur [supabase.com](https://supabase.com)
   - Créez un nouveau projet
   - Notez l'URL et la clé anon

2. **Exécuter les migrations**
   - Dans le dashboard Supabase, allez dans "SQL Editor"
   - Exécutez les fichiers dans l'ordre:
     1. `migrations/20240101000000_initial_schema.sql`
     2. `migrations/20240101000001_rls_policies.sql`
     3. `migrations/20240101000002_storage.sql`

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   # Éditez .env avec vos clés Supabase
   ```

### Option 2: Supabase CLI (Développement local)

1. **Installer Supabase CLI**
   ```bash
   npm install -g supabase
   # ou
   brew install supabase/tap/supabase
   ```

2. **Initialiser et démarrer**
   ```bash
   supabase init
   supabase start
   ```

3. **Appliquer les migrations**
   ```bash
   supabase db push
   ```

4. **Charger les données de test**
   ```bash
   supabase db seed
   ```

## 📊 Schéma de la base de données

### Tables principales

| Table | Description |
|-------|-------------|
| `users` | Agents immobiliers et administrateurs |
| `properties` | Propriétés immobilières (villas, maisons, appartements, terrains) |
| `clients` | Prospects/clients intéressés |
| `visits` | Visites planifiées |
| `leads` | Demandes de contact entrantes |
| `favorites` | Propriétés favorites (par numéro de téléphone) |
| `neighborhoods` | Quartiers de Lubumbashi |
| `notifications` | Notifications push pour les agents |
| `property_views` | Tracking des vues pour analytics |

### Types énumérés

```sql
-- Rôles
user_role: 'admin' | 'agent'

-- Types de propriétés
property_type: 'house' | 'apartment' | 'land' | 'villa' | 'commercial' | 'warehouse'

-- Statuts de propriété
property_status: 'available' | 'reserved' | 'sold' | 'rented' | 'off_market'

-- Types de transaction
transaction_type: 'sale' | 'rent'

-- Statuts de visite
visit_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

-- Statuts de lead
lead_status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost'

-- Sources de lead
lead_source: 'app' | 'website' | 'facebook' | 'instagram' | 'whatsapp' | 'referral' | 'walk_in' | 'other'
```

### Vues SQL

| Vue | Description |
|-----|-------------|
| `properties_with_agent` | Propriétés avec informations de l'agent |
| `agent_stats` | Statistiques par agent (propriétés, leads, visites) |
| `admin_dashboard_stats` | Statistiques globales pour le dashboard admin |

## 🔐 Sécurité (Row Level Security)

Toutes les tables ont RLS activé avec les règles suivantes:

### Propriétés
- **Lecture publique**: Propriétés publiées visibles par tous
- **Écriture**: Agents peuvent créer/modifier leurs propriétés
- **Admin**: Accès complet

### Leads
- **Création publique**: Clients peuvent créer des leads
- **Lecture/Modification**: Agent assigné ou admin

### Favoris
- **Publique**: Basé sur le numéro de téléphone

### Utilisateurs
- **Lecture**: Agents actifs visibles
- **Modification profil**: Utilisateur peut modifier son profil
- **Création/Suppression**: Admin uniquement

## 📦 Storage (Buckets)

| Bucket | Public | Taille max | Usage |
|--------|--------|-----------|-------|
| `property-images` | ✅ | 5 MB | Photos des propriétés |
| `avatars` | ✅ | 2 MB | Photos de profil agents |
| `documents` | ❌ | 10 MB | Contrats et documents privés |

## 🌱 Données de seed

Le fichier `seed.sql` inclut:

- **4 agents** de test avec différentes spécialités
- **10 propriétés** variées (villas, maisons, appartements, terrains)
- **4 clients** prospects
- **4 leads** à différents stades
- **4 visites** avec différents statuts
- **Favoris** et **vues** pour les statistiques
- **Quartiers** de Lubumbashi pré-remplis

### Comptes de test

| Email | Rôle | Mot de passe |
|-------|------|--------------|
| admin@mmcimmo.cd | Admin | *(à définir dans Supabase Auth)* |
| jean@mmcimmo.cd | Agent | *(à définir dans Supabase Auth)* |
| marie@mmcimmo.cd | Agent | *(à définir dans Supabase Auth)* |

## 🔧 Fonctions & Triggers

### Triggers automatiques
- `update_updated_at_column`: Met à jour `updated_at` automatiquement
- `increment_property_views`: Incrémente le compteur de vues
- `update_favorites_count`: Met à jour le compteur de favoris
- `update_leads_count`: Met à jour le compteur de leads
- `set_published_at`: Définit la date de publication

### Fonctions utilitaires
- `get_user_role()`: Retourne le rôle de l'utilisateur connecté
- `is_admin()`: Vérifie si l'utilisateur est admin
- `is_active_agent()`: Vérifie si l'utilisateur est un agent actif

## 📈 Exemple de requêtes

### Propriétés disponibles avec filtre
```sql
SELECT * FROM properties_with_agent
WHERE is_published = true
  AND status = 'available'
  AND neighborhood = 'Golf'
  AND price BETWEEN 100000 AND 500000
ORDER BY created_at DESC;
```

### Stats d'un agent
```sql
SELECT * FROM agent_stats WHERE id = 'agent-uuid';
```

### Dashboard admin
```sql
SELECT * FROM admin_dashboard_stats;
```

## 🆘 Dépannage

### Erreur RLS
```
row-level security policy for table "xxx" restricts row
```
→ Vérifiez que l'utilisateur est authentifié et a les permissions

### Erreur Storage
```
storage/object-not-found
```
→ Vérifiez que le bucket existe et que le fichier a été uploadé

### Migration échoue
→ Exécutez les migrations dans l'ordre correct (schema → rls → storage)

## 📝 Notes importantes

1. **Production**: Changez tous les mots de passe par défaut
2. **Backup**: Configurez des backups automatiques dans Supabase
3. **Monitoring**: Utilisez les logs Supabase pour le debugging
4. **Performance**: Les index sont déjà optimisés pour les requêtes courantes

---

**MMC Immo** - L'immobilier simplifié à Lubumbashi 🏠
