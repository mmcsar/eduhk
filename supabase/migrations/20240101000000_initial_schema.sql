-- MMC Immo - Schéma de base de données pour application immobilière Lubumbashi
-- Migration initiale: Tables, Index, Triggers

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Pour les coordonnées GPS

-- ============================================
-- TYPES ÉNUMÉRÉS
-- ============================================

-- Rôles utilisateurs
CREATE TYPE user_role AS ENUM ('admin', 'agent');

-- Types de propriétés
CREATE TYPE property_type AS ENUM ('house', 'apartment', 'land', 'villa', 'commercial', 'warehouse');

-- Statuts de propriétés
CREATE TYPE property_status AS ENUM ('available', 'reserved', 'sold', 'rented', 'off_market');

-- Types de transaction
CREATE TYPE transaction_type AS ENUM ('sale', 'rent');

-- Statuts de visite
CREATE TYPE visit_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- Statuts de lead
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'negotiation', 'won', 'lost');

-- Sources de lead
CREATE TYPE lead_source AS ENUM ('app', 'website', 'facebook', 'instagram', 'whatsapp', 'referral', 'walk_in', 'other');

-- ============================================
-- TABLE: USERS (agents + admin)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'agent',
  avatar_url TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 5.00, -- ex: 5.00%
  is_active BOOLEAN DEFAULT true,
  bio TEXT, -- Petite bio pour l'agent
  whatsapp_number TEXT, -- Numéro WhatsApp si différent
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- TABLE: PROPERTIES
-- ============================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Informations de base
  title TEXT NOT NULL,
  description TEXT,
  type property_type NOT NULL DEFAULT 'house',
  status property_status NOT NULL DEFAULT 'available',
  transaction_type transaction_type NOT NULL DEFAULT 'sale',
  
  -- Localisation
  city TEXT NOT NULL DEFAULT 'Lubumbashi',
  neighborhood TEXT, -- Golf, Katuba, Kenya, Bel-Air, Rwashi, etc.
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Prix et détails financiers
  price DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  price_negotiable BOOLEAN DEFAULT true,
  
  -- Caractéristiques
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  surface_area DECIMAL(10, 2), -- en m²
  land_area DECIMAL(10, 2), -- superficie terrain en m²
  floors INT DEFAULT 1,
  year_built INT,
  
  -- Équipements
  has_parking BOOLEAN DEFAULT false,
  parking_spots INT DEFAULT 0,
  has_garden BOOLEAN DEFAULT false,
  has_pool BOOLEAN DEFAULT false,
  has_security BOOLEAN DEFAULT false,
  has_generator BOOLEAN DEFAULT false,
  has_water_tank BOOLEAN DEFAULT false,
  has_air_conditioning BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  
  -- Médias
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  virtual_tour_url TEXT,
  
  -- Statistiques
  views_count INT DEFAULT 0,
  favorites_count INT DEFAULT 0,
  leads_count INT DEFAULT 0,
  
  -- Métadonnées
  is_featured BOOLEAN DEFAULT false, -- Mise en avant
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherches fréquentes
CREATE INDEX idx_properties_agent ON properties(agent_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_transaction ON properties(transaction_type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_neighborhood ON properties(neighborhood);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX idx_properties_published ON properties(is_published);
CREATE INDEX idx_properties_featured ON properties(is_featured);
CREATE INDEX idx_properties_created ON properties(created_at DESC);

-- Index composite pour recherches courantes
CREATE INDEX idx_properties_search ON properties(city, neighborhood, type, transaction_type, status);
CREATE INDEX idx_properties_price_range ON properties(price, transaction_type, status);

-- ============================================
-- TABLE: CLIENTS (prospects)
-- ============================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  
  -- Préférences de recherche
  preferred_budget_min DECIMAL(12, 2),
  preferred_budget_max DECIMAL(12, 2),
  preferred_neighborhoods TEXT[] DEFAULT '{}',
  preferred_property_types property_type[] DEFAULT '{}',
  preferred_transaction_type transaction_type,
  preferred_bedrooms_min INT,
  
  -- Notes
  notes TEXT,
  
  -- Métadonnées
  source lead_source DEFAULT 'app',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_created ON clients(created_at DESC);

-- ============================================
-- TABLE: VISITS
-- ============================================
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Détails de la visite
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,
  status visit_status DEFAULT 'pending',
  
  -- Notes et feedback
  notes TEXT,
  client_feedback TEXT,
  agent_notes TEXT,
  interest_level INT CHECK (interest_level >= 1 AND interest_level <= 5), -- 1-5
  
  -- Rappel
  reminder_sent BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_visits_property ON visits(property_id);
CREATE INDEX idx_visits_agent ON visits(agent_id);
CREATE INDEX idx_visits_client ON visits(client_id);
CREATE INDEX idx_visits_scheduled ON visits(scheduled_at);
CREATE INDEX idx_visits_status ON visits(status);

-- ============================================
-- TABLE: LEADS
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  
  -- Informations contact (si pas de client_id)
  client_name TEXT,
  client_phone TEXT,
  client_email TEXT,
  
  -- Détails du lead
  message TEXT,
  source lead_source DEFAULT 'app',
  status lead_status DEFAULT 'new',
  
  -- Suivi
  first_contact_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  
  -- Notes
  notes TEXT,
  
  -- Conversion
  converted_at TIMESTAMPTZ,
  conversion_value DECIMAL(12, 2), -- Valeur si converti
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_leads_property ON leads(property_id);
CREATE INDEX idx_leads_agent ON leads(agent_id);
CREATE INDEX idx_leads_client ON leads(client_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ============================================
-- TABLE: FAVORITES
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_phone TEXT NOT NULL, -- Identifiant unique (même sans compte)
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contrainte d'unicité
  UNIQUE(client_phone, property_id)
);

-- Index
CREATE INDEX idx_favorites_client ON favorites(client_phone);
CREATE INDEX idx_favorites_property ON favorites(property_id);

-- ============================================
-- TABLE: PROPERTY_VIEWS (Analytics détaillées)
-- ============================================
CREATE TABLE property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  viewer_phone TEXT, -- Optionnel
  viewer_ip TEXT,
  user_agent TEXT,
  source TEXT, -- 'app', 'web', 'share_link'
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_property_views_property ON property_views(property_id);
CREATE INDEX idx_property_views_date ON property_views(viewed_at);

-- ============================================
-- TABLE: NEIGHBORHOODS (Quartiers de Lubumbashi)
-- ============================================
CREATE TABLE neighborhoods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  city TEXT DEFAULT 'Lubumbashi',
  description TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_popular BOOLEAN DEFAULT false,
  average_price_sale DECIMAL(12, 2),
  average_price_rent DECIMAL(12, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_neighborhoods_city ON neighborhoods(city);
CREATE INDEX idx_neighborhoods_popular ON neighborhoods(is_popular);

-- Insertion des quartiers populaires de Lubumbashi
INSERT INTO neighborhoods (name, is_popular, description) VALUES
  ('Golf', true, 'Quartier résidentiel haut de gamme'),
  ('Bel-Air', true, 'Quartier résidentiel moderne'),
  ('Katuba', true, 'Quartier populaire dynamique'),
  ('Kenya', true, 'Quartier commercial et résidentiel'),
  ('Rwashi', true, 'Quartier industriel et résidentiel'),
  ('Kampemba', true, 'Grand quartier populaire'),
  ('Annexe', true, 'Centre-ville historique'),
  ('Commune Lubumbashi', true, 'Centre administratif'),
  ('Kamalondo', false, 'Quartier résidentiel'),
  ('Ruashi', false, 'Quartier minier'),
  ('Kigoma', false, 'Quartier périphérique'),
  ('Kasungami', false, 'Zone périurbaine'),
  ('Lido Golf', true, 'Quartier résidentiel de standing');

-- ============================================
-- TABLE: NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL, -- 'lead', 'visit', 'property', 'system'
  
  -- Référence optionnelle
  reference_type TEXT, -- 'lead', 'visit', 'property'
  reference_id UUID,
  
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- FONCTIONS & TRIGGERS
-- ============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour incrémenter views_count
CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1 
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_views
  AFTER INSERT ON property_views
  FOR EACH ROW EXECUTE FUNCTION increment_property_views();

-- Fonction pour gérer favorites_count
CREATE OR REPLACE FUNCTION update_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties SET favorites_count = favorites_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties SET favorites_count = favorites_count - 1 WHERE id = OLD.property_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_favorites_count
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION update_favorites_count();

-- Fonction pour gérer leads_count
CREATE OR REPLACE FUNCTION update_leads_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.property_id IS NOT NULL THEN
    UPDATE properties SET leads_count = leads_count + 1 WHERE id = NEW.property_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.property_id IS NOT NULL THEN
    UPDATE properties SET leads_count = leads_count - 1 WHERE id = OLD.property_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leads_count
  AFTER INSERT OR DELETE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_leads_count();

-- Fonction pour définir published_at
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_published_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue: Propriétés avec infos agent
CREATE OR REPLACE VIEW properties_with_agent AS
SELECT 
  p.*,
  u.full_name as agent_name,
  u.phone as agent_phone,
  u.whatsapp_number as agent_whatsapp,
  u.avatar_url as agent_avatar
FROM properties p
LEFT JOIN users u ON p.agent_id = u.id;

-- Vue: Stats par agent
CREATE OR REPLACE VIEW agent_stats AS
SELECT 
  u.id,
  u.full_name,
  u.email,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT CASE WHEN p.status = 'available' THEN p.id END) as available_properties,
  COUNT(DISTINCT CASE WHEN p.status = 'sold' THEN p.id END) as sold_properties,
  COUNT(DISTINCT CASE WHEN p.status = 'rented' THEN p.id END) as rented_properties,
  COUNT(DISTINCT l.id) as total_leads,
  COUNT(DISTINCT CASE WHEN l.status = 'won' THEN l.id END) as converted_leads,
  COUNT(DISTINCT v.id) as total_visits,
  COALESCE(SUM(p.views_count), 0) as total_views
FROM users u
LEFT JOIN properties p ON u.id = p.agent_id
LEFT JOIN leads l ON u.id = l.agent_id
LEFT JOIN visits v ON u.id = v.agent_id
WHERE u.role = 'agent'
GROUP BY u.id, u.full_name, u.email;

-- Vue: Dashboard Admin - Stats globales
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM properties WHERE is_published = true) as total_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'available') as available_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'sold') as sold_properties,
  (SELECT COUNT(*) FROM properties WHERE status = 'rented') as rented_properties,
  (SELECT COUNT(*) FROM leads WHERE created_at >= NOW() - INTERVAL '30 days') as leads_this_month,
  (SELECT COUNT(*) FROM visits WHERE created_at >= NOW() - INTERVAL '30 days') as visits_this_month,
  (SELECT COALESCE(SUM(views_count), 0) FROM properties) as total_views,
  (SELECT COUNT(*) FROM users WHERE role = 'agent' AND is_active = true) as active_agents;

-- ============================================
-- COMMENTAIRES DE TABLE
-- ============================================
COMMENT ON TABLE users IS 'Utilisateurs de l''application (agents immobiliers et administrateurs)';
COMMENT ON TABLE properties IS 'Propriétés immobilières listées par les agents';
COMMENT ON TABLE clients IS 'Clients/Prospects intéressés par des propriétés';
COMMENT ON TABLE visits IS 'Visites planifiées entre agents et clients';
COMMENT ON TABLE leads IS 'Demandes/Contacts entrants des clients potentiels';
COMMENT ON TABLE favorites IS 'Propriétés favorites des utilisateurs de l''app publique';
COMMENT ON TABLE property_views IS 'Historique des vues pour analytics';
COMMENT ON TABLE neighborhoods IS 'Quartiers de Lubumbashi avec métadonnées';
COMMENT ON TABLE notifications IS 'Notifications push pour les agents';
